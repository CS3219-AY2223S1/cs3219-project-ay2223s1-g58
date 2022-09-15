import { Avatar } from '@chakra-ui/react'
import { getUserProfileUrl } from '../utils'

export function UserAvatar({ username, src }) {
  const url = src ?? getUserProfileUrl(username)
  return (
    <div>
      <Avatar bg="white" name={username} src={url}></Avatar>
    </div>
  )
}
