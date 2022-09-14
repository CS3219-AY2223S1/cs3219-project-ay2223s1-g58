import useAuth from '../hooks/useAuth'
import { useSearchParams } from 'react-router-dom'

const Room = () => {
  const { auth } = useAuth()
  let [searchParams] = useSearchParams()

  return (
    <div>
      <main className="flex h-full flex-col items-center justify-center">
        <h1>Room</h1>
        <br />
        <p>Username: {auth.username}</p>
        <p>Room: {searchParams.get('roomId')}</p>
        <br />
        <br />
      </main>
    </div>
  )
}

export default Room
