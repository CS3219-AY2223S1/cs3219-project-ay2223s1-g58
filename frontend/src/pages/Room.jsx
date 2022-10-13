import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  EVENT_LISTEN,
  URI_MATCHING_SERVICE,
  URL_MATCHING_ROOM,
  URL_HISTORY_ROOM,
  STATUS_CODE_SUCCESS,
  STATUS_CODE_BAD_REQUEST,
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
  const [editor, setEditor] = useState()
  const [isValid, setIsValid] = useState(true)
  const toast = useToast()
  const auth = useAuth()
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    const getQuestionId = async () => {
      const res = await axiosPrivate
        .get(`${URL_MATCHING_ROOM}/${roomId}`)
        .catch((e) => {
          if (e.response.status === STATUS_CODE_BAD_REQUEST) {
            // Room not found
            return setIsValid(false)
          }
        })
      if (res && res.status === STATUS_CODE_SUCCESS) {
        setQuestionId(res.data.data.questionId)
      }
    }
    getQuestionId()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const newSocket = io(URI_MATCHING_SERVICE, {
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

    return () => newSocket.close()
  }, [auth.accessToken, navigate, roomId, toast])

  const endSession = async () => {
    await axiosPrivate
      .delete(`${URL_MATCHING_ROOM}/${roomId}`)
      .catch(console.log)
  }

  const markCompleted = async () => {
    console.log(editor.getText());
    await axiosPrivate
      .put(`${URL_HISTORY_ROOM}/${roomId}`, {
        questionId,
        answer: editor.getText(),   // accessing Firepad
      })
      .then(() => {
        toast({
          title: 'Marked question as completed!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      })
      .catch((e) => {
        toast({
          title: "Couldn't mark as completed...",
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        return console.log(e)
      })
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
          <QuestionPane id={questionId} />
          <div className="flex flex-col justify-start">
            <Editor roomId={roomId} setEditorComponent={setEditor} />
            <div className="flex flex-row items-center justify-center">
              <Button className='mx-2' onClick={markCompleted}>Mark completed</Button>
              <RoomEndDialog handleClick={endSession} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Room
