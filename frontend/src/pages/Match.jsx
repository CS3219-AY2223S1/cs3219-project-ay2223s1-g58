import { useEffect, useState } from 'react'
import MatchDialog from '../components/match/MatchDialog'
import { Helmet } from 'react-helmet-async'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import {
  URL_ROOM_SERVICE,
  STATUS_CODE_SUCCESS,
  STATUS_CODE_BAD_REQUEST,
  URI_ROOM_SERVICE_SOCKET_PATH,
  EVENT_LISTEN,
  URI_ROOM_SERVICE,
} from '../constants'
import { Button } from '@chakra-ui/react'

const Match = () => {
  const [roomId, setRoomId] = useState()
  const [isInRoom, setInRoom] = useState(false)

  const axiosPrivate = useAxiosPrivate()
  useEffect(() => {
    axiosPrivate
      .get(URL_ROOM_SERVICE)
      .then((res) => {
        if (res && res.status === STATUS_CODE_SUCCESS) {
          setRoomId(res.data.data.roomId)
          setInRoom(res.data.data.isInRoom)
        }
      })
      .catch((e) => {
        if (e.response.status === STATUS_CODE_BAD_REQUEST) {
          console.log(e)
        }
      })
  }, [])
  return (
    <div>
      <Helmet>
        <title>Match | PeerPrep</title>
        <meta charSet="utf-8" />
        <meta name="description" content="PeerPrep help you prep" />
      </Helmet>
      <main className="flex h-full flex-col items-center justify-center">
        {isInRoom ? (
          <>
            <h1>You are already in a room, please rejoin it. </h1>{' '}
            <h1>End Session to start a new match. </h1>
            <br />
            <Button as="a" href={`/room/${roomId}`}>
              Rejoin
            </Button>
          </>
        ) : (
          <>
            <h1>Select your criterias and find a match within 30s!</h1>
            <br />
            <MatchDialog isDisabled={isInRoom} />
          </>
        )}
      </main>
    </div>
  )
}

export default Match
