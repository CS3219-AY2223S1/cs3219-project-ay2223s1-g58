import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  URL_ROOM_SERVICE,
  STATUS_CODE_SUCCESS,
  STATUS_CODE_BAD_REQUEST,
  URI_ROOM_SERVICE_SOCKET_PATH,
  EVENT_LISTEN,
  URI_ROOM_SERVICE,
} from '../constants'
import { Button, useToast, Stack, Text } from '@chakra-ui/react'
import { Helmet } from 'react-helmet-async'
import QuestionPane from '../components/QuestionPane'
import Editor from '../components/collaboration/Editor'
import RoomEndDialog from '../components/room/RoomEndDialog'
import io from 'socket.io-client'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const Room = () => {
  const navigate = useNavigate()
  const { roomId } = useParams()
  const [questionId, setQuestionId] = useState()
  const [isValid, setIsValid] = useState(true)
  const toast = useToast()
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    axiosPrivate
      .get(`${URL_ROOM_SERVICE}/${roomId}`)
      .then((res) => {
        if (res && res.status === STATUS_CODE_SUCCESS) {
          setQuestionId(res.data.data.questionId)
        }
      })
      .catch((e) => {
        if (e.response.status === STATUS_CODE_BAD_REQUEST) {
          // Room not found
          setIsValid(false)
        }
      })
  }, [axiosPrivate, roomId])

  useEffect(() => {
    const newSocket = io(URI_ROOM_SERVICE, {
      path: URI_ROOM_SERVICE_SOCKET_PATH,
      auth: {
        token: auth.accessToken,
      },
    })
    newSocket.on(`${roomId}-${EVENT_LISTEN.ROOM_END}`, () => {
      toast({
        title: 'Session ended!',
        description: 'Going to Home...',
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
      setTimeout(() => {
        navigate('/')
      }, 4000)
    })

    newSocket.on(`${roomId}-${EVENT_LISTEN.ROOM_UPDATE}`, (payload) => {
      toast({
        title: 'Next Question',
        description: 'Fetched new question',
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
      setQuestionId(payload.question)
    })

    return () => newSocket.close()
  }, [auth.accessToken, navigate, roomId, toast])

  const endSession = async () => {
    await axiosPrivate
      .delete(`${URL_ROOM_SERVICE}/${roomId}`)
      .catch(console.log)
  }

  const getHelmet = () => {
    return (
      <Helmet>
        <title>Room | PeerPrep</title>
        <meta charSet="utf-8" />
        <meta name="description" content="PeerPrep help you prep" />
      </Helmet>
    )
  }

  return (
    <>
      {getHelmet()}

      {!isValid || !questionId ? (
        <main className="flex h-full flex-col items-center justify-start">
          <h1>
            {isValid ? (
              'Retrieving room...'
            ) : (
              <>
                <Stack spacing={10} textAlign="center">
                  <Text fontSize="2xl">Invalid Room</Text>
                  <Text>
                    The session has ended or you are not a valid participant.
                  </Text>
                  <Button as="a" href="/">
                    Return Home
                  </Button>
                </Stack>
              </>
            )}
          </h1>
        </main>
      ) : (
        <div className="grid h-screen grid-cols-2 gap-4">
          <QuestionPane questionId={questionId} roomId={roomId} />
          <div className="flex flex-col justify-start">
            <Editor roomId={roomId} />
            <div className="flex flex-col items-center justify-start">
              <RoomEndDialog handleClick={endSession} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Room
