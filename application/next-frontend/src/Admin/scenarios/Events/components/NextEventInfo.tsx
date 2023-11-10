import { useHover } from '@/Shared/context/HoverContext'
import { ApiInvitation, useInvitations } from '@/api/useInvitations'

const InvitationsStatus = ({ invitations }: { invitations: ApiInvitation[] }) => {
    const responses = invitations.reduce(
        (prev, next) => {
            if (next.rsvp === 'unanswered') prev.waiting++
            else if (next.rsvp === 'attending') prev.accepted++
            else if (next.rsvp === 'not attending') prev.declined++
            return prev
        },
        { waiting: 0, accepted: 0, declined: 0 },
    )

    return (
        <div className="flex flex-col gap-1 font-workSans">
            <span className="tabular-nums">{responses.accepted} Accepted </span>
            <span className="tabular-nums">{responses.waiting} Waiting </span>
            <span className="tabular-nums">{responses.declined} Declined </span>
        </div>
    )
}

const NextEventInfo = ({
    event_id,
    resturantName,
    date,
    time,
    meridiem,
}: {
    event_id: string
    resturantName: string
    date: string
    time: string
    meridiem: string
}) => {
    const { data, error, isLoading } = useInvitations(event_id)

    const { isHovered } = useHover()

    return (
        <div className="mt-5 flex flex-col">
            <div className="pl-3 italic text-green-primary">Next event:</div>
            <h3 className="text-2xl font-semibold leading-10">
                <span className={`px-3 ${isHovered ? 'marked-entry-card' : ''}`}>{resturantName}</span>
            </h3>
            <h4 className="text-xl font-semibold leading-10">
                <span className={`px-3 ${isHovered ? 'marked-entry-card' : ''}`}>{date}</span>
            </h4>
            <span className="pl-3 text-xl font-semibold leading-7">
                {time} <span className="italic">{meridiem}</span>
            </span>

            <div className="mt-8 pl-3">
                <h4 className="italic text-green-primary">Invitation status: </h4>

                {isLoading ? (
                    'Loading...'
                ) : error ? (
                    `Failed to load invitation status. ${error?.info.msg}`
                ) : !data || !data.length ? (
                    'Invitations have not been sent yet.'
                ) : (
                    <InvitationsStatus invitations={data} />
                )}
            </div>
        </div>
    )
}

export { NextEventInfo }
