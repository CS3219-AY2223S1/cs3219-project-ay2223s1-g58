import { useEffect, useState } from 'react'
import MatchDialog from '../components/match/MatchDialog'
import { Helmet } from 'react-helmet-async'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { URL_ROOM_SERVICE, STATUS_CODE_SUCCESS } from '../constants'
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
        console.log(e)
      })
  }, [axiosPrivate])
  return (
    <div>
      <Helmet>
        <title>Match | LeetWithFriend</title>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="An interview preparation platform and peer matching system, where students can find peers to practice whiteboard-style interview questions together."
        />
      </Helmet>
      <main className="flex flex-col items-center justify-center h-full">
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
