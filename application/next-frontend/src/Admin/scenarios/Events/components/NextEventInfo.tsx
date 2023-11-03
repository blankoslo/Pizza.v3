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
        <div className="flex flex-col font-workSans">
            <span className="">{responses.accepted} Accepted </span>
            <span className="">{responses.waiting} Waiting </span>
            <span className="">{responses.declined} Declined </span>
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

    return (
        <div className="mt-5 flex flex-col">
            <div className="italic text-green-primary">Next event:</div>
            <h3 className="text-2xl font-semibold leading-10">{resturantName}</h3>
            <h4 className="text-xl font-semibold leading-10">{date}</h4>
            <span className="text-xl font-semibold leading-7">
                {time} <span className="italic">{meridiem}</span>
            </span>

            <div className="mt-8">
                <h4 className="italic text-green-primary">Invitation status: </h4>

                {isLoading ? (
                    'Loading...'
                ) : error ? (
                    `Failed to load invitation status. ${error?.info.msg}`
                ) : !data || !data.length ? (
                    'Invitations has not been sent yet.'
                ) : (
                    <InvitationsStatus invitations={data} />
                )}
            </div>
        </div>
    )
}

export { NextEventInfo }
