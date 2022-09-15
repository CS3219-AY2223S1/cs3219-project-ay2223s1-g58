import useAuth from '../hooks/useAuth'
import { useSearchParams } from 'react-router-dom'
import axios from '../api/axios'
import { useEffect, useState } from 'react'
import { URL_MATCHING_ROOM, STATUS_CODE_SUCCESS } from '../constants'

const Room = () => {
  const { auth } = useAuth()
  const [questionId, setQuestionId] = useState('')
  let [searchParams] = useSearchParams()

  useEffect(() => {
    getQuestionId()
  })

  const getQuestionId = async () => {
    const res = await axios
      .get(`${URL_MATCHING_ROOM}/${searchParams.get('roomId')}`)
      .catch((e) => {
        console.log(e)
      })
    if (res && res.status === STATUS_CODE_SUCCESS) {
      setQuestionId(res.data.data.questionId)
    }
  }

  return (
    <div>
      <main className="flex h-full flex-col items-center justify-center">
        <h1>Room</h1>
        <br />
        <p>Username: {auth.username}</p>
        <p>Room: {searchParams.get('roomId')}</p>
        <p>Quesiton: {questionId}</p>
        <br />
        <br />
      </main>
    </div>
  )
}

export default Room
