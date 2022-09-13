import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { db } from '../api/firebase'
import { Button } from '../components/Button'

const MatchTest = () => {
  const { auth } = useAuth();
  const navigate = useNavigate()
  const [id, setID] = useState()

  const genID = () => {
    const newDocRef = db.ref(`docs`).push()
    const docID = newDocRef.key
    // Temporary method to check for user's ongoing session
    db.ref(`users/${auth.username}`).set(docID)  // Save this docID under current user
    db.ref(`users/qwe`).set(docID) // user "qwe" is the default partner
    setID(docID)
  }

  const goToEditor = () => {
    navigate(`/room/${id}`)
  }

  useEffect(() => {
    db.ref(`users/${auth.username}`)
      .get()
      .then((snapshot) => {
        if (snapshot.exists() && snapshot.val() !== id) {
          setID(snapshot.val())
        }
      })
      .catch((e) => {
        console.error(e)
      })
  }, [])

  return (
    <div className='flex flex-col items-center justify-start h-full'>
      {id ? (
        <Button className="cursor-not-allowed opacity-50">
          Generate doc ID
        </Button>
      ) : (
        <Button onClick={genID}>Generate doc ID</Button>
      )}
      <p className="font-bold">{id}</p>
      <p>is your current room ID</p>
      {id && <Button onClick={goToEditor}>To editor</Button>}
    </div>
  )
}

export default MatchTest
