import { CardComponent } from 'Admin/components/CardComponent'
import { useSlackUsers } from '@/api/useSlackUsers'
import { Switch } from '@mui/material'

const SlackUsers = () => {
    const { data, isLoading, error, updateUser } = useSlackUsers()

    return (
        <CardComponent title="People">
            {isLoading
                ? 'Loading...'
                : error
                ? `Failed to load users due to the following error: ${error?.info.msg}`
                : !data || data.length == 0
                ? 'No users found.'
                : data.map((slackUser) => (
                      <div key={slackUser.slack_id} className="flex items-center justify-between py-2">
                          <Switch
                              checked={slackUser.active}
                              onChange={() => updateUser(slackUser)}
                              color="success"
                              inputProps={{ 'aria-label': 'controlled' }}
                          />
                          <p className="ml-3">{slackUser.current_username}</p>
                      </div>
                  ))}
        </CardComponent>
    )
}

export { SlackUsers }
