import { useEffect, useState } from 'react'
import MatchDialog from '../components/match/MatchDialog'
import { Helmet } from 'react-helmet-async'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import {
  URL_ROOM_SERVICE,
  STATUS_CODE_SUCCESS,
  STATUS_CODE_BAD_REQUEST,
} from '../constants'
import { Button } from '@chakra-ui/react'
import { PrimaryFeatures } from '../components/PrimaryFeatures'
import { ArrowForwardIcon } from '@chakra-ui/icons'

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
  }, [axiosPrivate])
  return (
    <div>
      <Helmet>
        <title>Match | PeerPrep</title>
        <meta charSet="utf-8" />
        <meta name="description" content="PeerPrep help you prep" />
      </Helmet>
      <main className="flex flex-col items-center justify-center h-full">
        {isInRoom ? (
          <PrimaryFeatures
            content={
              <div className="flex items-center justify-center max-w-2xl gap-4 mx-auto lg:mx-0 lg:max-w-3xl">
                <h2 className="text-3xl font-medium tracking-tight text-gray-600 dark:text-white">
                  Already in room!
                </h2>
                <Button
                  as="a"
                  href={`/room/${roomId}`}
                  variant="outline"
                  rightIcon={<ArrowForwardIcon />}
                >
                  Rejoin
                </Button>
              </div>
            }
          />
        ) : (
          <PrimaryFeatures
            content={
              <div className="flex items-center justify-center max-w-2xl gap-4 mx-auto lg:mx-0 lg:max-w-3xl">
                <h2 className="text-3xl font-medium tracking-tight text-gray-600 dark:text-white">
                  Ready to match? Select your criteria and
                </h2>
                <MatchDialog isDisabled={isInRoom} />
              </div>
            }
          />
        )}
      </main>
    </div>
  )
}

export default Match
