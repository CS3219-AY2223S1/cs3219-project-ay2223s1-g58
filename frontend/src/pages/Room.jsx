import { useNavigate, useParams } from 'react-router-dom'
import axios from '../api/axios'
import { useEffect, useState } from 'react'
import { URL_MATCHING_ROOM, STATUS_CODE_SUCCESS } from '../constants'
import { useToast } from '@chakra-ui/react'
import QuestionPane from '../components/QuestionPane'
import Editor from '../components/collaboration/Editor'
import { Button } from '../components/Button'

const Room = () => {
  const navigate = useNavigate()
  const { roomId } = useParams()
  const [questionId, setQuestionId] = useState()
  const toast = useToast()

  useEffect(() => {
    getQuestionId()
  })

  const getQuestionId = async () => {
    const res = await axios.get(`${URL_MATCHING_ROOM}/${roomId}`).catch((e) => {
      console.log(e)
    })
    if (res && res.status === STATUS_CODE_SUCCESS) {
      setQuestionId(res.data.data.questionId)
    }
  }

  const endSession = async () => {
    toast({
      title: 'Session ended!',
      description: "Going to Home...",
      status: 'success',
      duration: 9000,
      isClosable: true,
    })
    await axios.delete(`${URL_MATCHING_ROOM}/${roomId}`).catch(console.log)
    navigate('/')
  }

  if (!questionId) {
    return <h2>Retrieving room...</h2>
  }

  return (
    <>
      <div className="grid h-screen grid-cols-2 gap-4">
        <QuestionPane id={questionId} />

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
