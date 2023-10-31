import { CardComponent } from 'Admin/components/CardComponent'
import { useSlackUsers } from '@/api/useSlackUsers'

const SlackUsers = () => {
    const { data, isLoading, error } = useSlackUsers()

    return (
        <CardComponent title="People">
            {isLoading
                ? 'Loading...'
                : error
                ? `Failed to load users due to the following error: ${error?.info.msg}`
                : !data || data.length == 0
                ? 'No users found.'
                : data
                      .filter((slackUser) => slackUser.active) // filter users based of the active property
                      .map((slackUser) => (
                          <div key={slackUser.slack_id} className="flex items-center justify-between py-2">
                              <p>{slackUser.current_username}</p>
                          </div>
                      ))}
        </CardComponent>
    )
}

export { SlackUsers }
