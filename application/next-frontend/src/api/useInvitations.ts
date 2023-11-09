import { useAuthedSWR } from './useAuthedSWR'
import { SlackUser } from './useSlackUsers'

export type ApiInvitation = {
    event_id: string
    invited_at: string
    reminded_at: string
    rsvp: 'unanswered' | 'attending' | 'not attending'
    slack_id: string
    slack_user: SlackUser
}

const useInvitations = (eventId: string) => {
    const endpoint = `/invitations/${eventId}`
    const { data, isLoading, error } = useAuthedSWR<ApiInvitation[]>(endpoint)

    return { data, isLoading, error }
}

export { useInvitations }
