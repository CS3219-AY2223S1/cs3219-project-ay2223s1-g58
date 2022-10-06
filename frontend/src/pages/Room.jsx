import { useNavigate, useParams } from 'react-router-dom'
import axios from '../api/axios'
import { useEffect, useState } from 'react'
import {
  URL_MATCHING_ROOM,
  STATUS_CODE_SUCCESS,
  STATUS_CODE_BAD_REQUEST,
} from '../constants'
import { useToast } from '@chakra-ui/react'
import { Helmet } from 'react-helmet-async'
import QuestionPane from '../components/QuestionPane'
import Editor from '../components/collaboration/Editor'
import RoomEndDialog from '../components/room/RoomEndDialog'
import io from 'socket.io-client'
import { URI_MATCHING_SERVICE, EVENT_LISTEN } from '../constants'
import useAuth from '../hooks/useAuth'

const Room = () => {
  const navigate = useNavigate()
  const { roomId } = useParams()
  const [questionId, setQuestionId] = useState()
  const [isValid, setIsValid] = useState(true)
  const toast = useToast()
  const auth = useAuth()

  useEffect(() => {
    getQuestionId()
  })

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

  const getQuestionId = async () => {
    const res = await axios.get(`${URL_MATCHING_ROOM}/${roomId}`).catch((e) => {
      if (e.response.status === STATUS_CODE_BAD_REQUEST) {
        // Room not found
        return setIsValid(false)
      }
    })
    if (res && res.status === STATUS_CODE_SUCCESS) {
      setQuestionId(res.data.data.questionId)
    }
  }

  const endSession = async () => {
    await axios.delete(`${URL_MATCHING_ROOM}/${roomId}`).catch(console.log)
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
            {isValid
              ? 'Retrieving room...'
              : 'Invalid Room... The session has ended.'}
          </h1>
        </main>
      ) : (
        <div className="grid h-screen grid-cols-2 gap-4">
          <QuestionPane id={questionId} />
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
