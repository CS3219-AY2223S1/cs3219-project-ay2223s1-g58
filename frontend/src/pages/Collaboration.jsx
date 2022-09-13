import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Editor from '../components/Editor'
import { Button } from '../components/Button'
import { db } from '../api/firebase'

const Collaboration = ({ questionText }) => {
  const { auth } = useAuth()
  return (
    <>
      <h3 className="bg-red-400">Currently logged in: {auth.username}</h3>

      <div className="grid h-screen grid-cols-2 gap-4">
        <LeftPane text={questionText} />
        <RightPane user={auth.username} />
      </div>
    </>
  )
}

const LeftPane = ({ text }) => {
  return (
    <div className="mx-2 my-2 h-85v overflow-y-auto border-x-2 border-y-2">
      {text}
    </div>
  )
}

const RightPane = ({ user }) => {
  const navigate = useNavigate()
  return (
    <div className='flex flex-col justify-start' >
      <Editor />
      <div className='flex flex-col items-center justify-start'>
        <Button
          onClick={() => {
            alert('clicked End session! Going to Home...')
            // Temporary method to keep user's session
            db.ref(`users/${user}`).remove() // removes docID from user entry
            db.ref(`users/qwe`).remove()
            navigate('/')
          }}
        >
          End session
        </Button>
      </div>
    </div>
  )
}

export default Collaboration
