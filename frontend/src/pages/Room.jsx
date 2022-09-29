import { useNavigate, useParams } from 'react-router-dom'
import axios from '../api/axios'
import { useEffect, useState } from 'react'
import { URL_MATCHING_ROOM, STATUS_CODE_SUCCESS, STATUS_CODE_BAD_REQUEST } from '../constants'
import { useToast } from '@chakra-ui/react'
import { Helmet } from 'react-helmet-async'
import QuestionPane from '../components/QuestionPane'
import Editor from '../components/collaboration/Editor'
import { Button } from '../components/Button'

const Room = () => {
  const navigate = useNavigate()
  const { roomId } = useParams()
  const [questionId, setQuestionId] = useState()
  const [isValid, setIsValid] = useState(true)
  const toast = useToast()

  useEffect(() => {
    getQuestionId()
  })

  const getQuestionId = async () => {
    const res = await axios.get(`${URL_MATCHING_ROOM}/${roomId}`).catch((e) => {
      if (e.response.status === STATUS_CODE_BAD_REQUEST) { // Room not found
        return setIsValid(false)
      }
    })
    if (res && res.status === STATUS_CODE_SUCCESS) {
      setQuestionId(res.data.data.questionId)
    }
  }

  const endSession = async () => {
    toast({
      title: 'Session ended!',
      description: 'Going to Home...',
      status: 'success',
      duration: 4000,
      isClosable: true,
    })
    await axios.delete(`${URL_MATCHING_ROOM}/${roomId}`).catch(console.log)
    setTimeout(() => {
      navigate('/')
    }, 4000)
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

  if (!isValid) {
    return (
      <>
        {getHelmet()}
        <main className="flex h-full flex-col items-center justify-start">
          <h1>Invalid Room... The session has ended.</h1>
        </main>
      </>
    )
  }

  if (!questionId) {
    return (
      <>
        {getHelmet()}
        <main className="flex h-full flex-col items-center justify-start">
          <h1>Retrieving room...</h1>
        </main>
      </>
    )
  }

  return (
    <>
      {getHelmet()}
      <div className="grid h-screen grid-cols-2 gap-4">
        <QuestionPane id={questionId} setQuestionId = {setQuestionId} />

        <div className="flex flex-col justify-start">
          <Editor roomId={roomId} />
          <div className="flex flex-col items-center justify-start">
            <Button onClick={endSession}>End session</Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Room
