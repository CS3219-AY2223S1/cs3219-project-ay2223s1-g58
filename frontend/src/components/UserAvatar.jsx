import { Avatar } from '@chakra-ui/react'
import { getUserProfileUrl } from '../utils'
import { Tooltip } from '@chakra-ui/react'

export function UserAvatar({ username, src }) {
  const url = src ?? getUserProfileUrl(username)
  return (
    <div>
      <Tooltip label={username} hasArrow>
        <Avatar bg="white" name={username} src={url}></Avatar>
      </Tooltip>
    </div>
  )
}
