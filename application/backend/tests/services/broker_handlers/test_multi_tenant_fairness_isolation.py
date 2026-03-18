"""
Multi-Tenant Fairness Isolation
================================

Proves that the invitation fairness algorithm uses per-org user counts
when computing the lookback window, not a global count inflated by
users from other orgs.

Scenario
--------
Org A: 6 users, people_per_event=3  →  correct lookback = ceil(6/3) = 2
Org B: 12 users (just exist, no events)  →  buggy lookback = ceil(18/3) = 6

History for Org A (finalized, newest first):
  Past 1: User1, User2, User3 attended
  Past 2: User1, User2, User3 attended
  Past 3: User4, User5, User6 attended
  Past 4: User4, User5, User6 attended
  Past 5: User4, User5, User6 attended
  Past 6: User4, User5, User6 attended

Correct lookback (2 events):
  User1=2, User2=2, User3=2, User4=0, User5=0, User6=0
  → User4, User5, User6 get invited

Buggy lookback (6 events):
  User1=2, User2=2, User3=2, User4=4, User5=4, User6=4
  → User1, User2, User3 get invited (fewer attendances)

The outcome flips entirely. Deterministic — no random tiebreaker involved.
"""
import pytest
import pytz
from datetime import datetime, timedelta

from app.models.event import Event
from app.models.invitation import Invitation
from app.models.enums import RSVP
from app.models.slack_user import SlackUser
from app.models.slack_organization import SlackOrganization
from app.models.restaurant import Restaurant


@pytest.fixture
def rpc_queue(environment_variables, mock_broker):
    from app.services.broker.queue import rpc
    return rpc


@pytest.fixture
def two_orgs(db):
    org_a = SlackOrganization(
        team_id="fairness_org_a",
        access_token="token_a",
        channel_id="channel_a",
        app_id="app_a",
        bot_user_id="bot_a"
    )
    org_b = SlackOrganization(
        team_id="fairness_org_b",
        access_token="token_b",
        channel_id="channel_b",
        app_id="app_b",
        bot_user_id="bot_b"
    )
    db.session.add_all([org_a, org_b])
    db.session.commit()
    return org_a, org_b


@pytest.fixture
def org_a_users(db, two_orgs):
    org_a, _ = two_orgs
    users = []
    for i in range(1, 7):
        user = SlackUser(
            slack_id=f"org_a_user_{i}",
            current_username=f"user{i}",
            first_seen="2024-01-01T00:00:00Z",
            active=True,
            priority=1,
            email=f"user{i}@orga.invalid",
            slack_organization_id=org_a.team_id
        )
        users.append(user)
    db.session.add_all(users)
    db.session.commit()
    return users


@pytest.fixture
def org_b_users(db, two_orgs):
    """12 users in Org B. They just need to exist to inflate the global count."""
    _, org_b = two_orgs
    users = []
    for i in range(1, 13):
        user = SlackUser(
            slack_id=f"org_b_user_{i}",
            current_username=f"orgb_user{i}",
            first_seen="2024-01-01T00:00:00Z",
            active=True,
            priority=1,
            email=f"user{i}@orgb.invalid",
            slack_organization_id=org_b.team_id
        )
        users.append(user)
    db.session.add_all(users)
    db.session.commit()
    return users


@pytest.fixture
def org_a_restaurant(db, two_orgs):
    org_a, _ = two_orgs
    restaurant = Restaurant(
        name="Org A Pizza Place",
        slack_organization_id=org_a.team_id
    )
    db.session.add(restaurant)
    db.session.commit()
    return restaurant


@pytest.fixture
def org_a_history(db, two_orgs, org_a_users, org_a_restaurant):
    """
    6 finalized past events for Org A.

    Newest first:
      Past 1: User1, User2, User3 attended
      Past 2: User1, User2, User3 attended
      Past 3: User4, User5, User6 attended
      Past 4: User4, User5, User6 attended
      Past 5: User4, User5, User6 attended
      Past 6: User4, User5, User6 attended

    In the correct 2-event window: User1=2, User2=2, User3=2, User4/5/6=0
    In the buggy 6-event window:   User1=2, User2=2, User3=2, User4/5/6=4
    """
    org_a, _ = two_orgs
    now = datetime.now(pytz.timezone('Europe/Oslo'))
    recent_group = org_a_users[0:3]   # User1, User2, User3
    veteran_group = org_a_users[3:6]  # User4, User5, User6

    events = []
    invitations = []

    for i in range(6):
        event = Event(
            time=now - timedelta(days=30 - i),  # Past 6 is oldest, Past 1 is newest
            restaurant_id=org_a_restaurant.id,
            people_per_event=3,
            slack_organization_id=org_a.team_id,
            finalized=True
        )
        events.append(event)

    db.session.add_all(events)
    db.session.commit()

    # Past 1 and Past 2 (indices 4, 5 — newest): User1, User2, User3
    for event in events[4:6]:
        for user in recent_group:
            invitations.append(Invitation(
                event_id=event.id,
                slack_id=user.slack_id,
                rsvp=RSVP.attending
            ))

    # Past 3 through Past 6 (indices 0-3 — oldest): User4, User5, User6
    for event in events[0:4]:
        for user in veteran_group:
            invitations.append(Invitation(
                event_id=event.id,
                slack_id=user.slack_id,
                rsvp=RSVP.attending
            ))

    db.session.add_all(invitations)
    db.session.commit()
    return events


@pytest.mark.usefixtures('client_class')
class TestMultiTenantFairnessIsolation:
    def test_invite_uses_org_scoped_user_count(
        self, db, mock_broker, two_orgs, org_a_users, org_b_users,
        org_a_restaurant, org_a_history, rpc_queue
    ):
        """
        With correct per-org lookback (2 events), User4/5/6 have 0 recent
        attendances and get invited. If the user count is inflated by Org B's
        12 users, the lookback expands to 6 events, User4/5/6 have 4
        attendances each, and User1/2/3 get invited instead.
        """
        org_a, _ = two_orgs

        # New event needing 3 invitations
        new_event = Event(
            time=datetime.now(pytz.timezone('Europe/Oslo')) + timedelta(days=3),
            restaurant_id=org_a_restaurant.id,
            people_per_event=3,
            slack_organization_id=org_a.team_id
        )
        db.session.add(new_event)
        db.session.commit()

        rpc_queue(
            routing_key="dontCareRoutingKey",
            body={"type": "invite_multiple_if_needed", "payload": {}},
            correlation_id="dontCareCorrelationId",
            reply_to="dontCareReplyTo"
        )

        new_invitations = Invitation.query.filter_by(event_id=new_event.id).all()
        invited_ids = {inv.slack_id for inv in new_invitations}

        expected_invited = {f"org_a_user_{i}" for i in range(4, 7)}  # User4, User5, User6

        assert len(new_invitations) == 3, (
            f"Expected 3 invitations, got {len(new_invitations)}"
        )
        assert invited_ids == expected_invited, (
            f"Expected {expected_invited} to be invited (0 recent attendances), "
            f"but got {invited_ids}. If User1/2/3 were invited, the lookback "
            f"window was inflated by users from Org B."
        )
