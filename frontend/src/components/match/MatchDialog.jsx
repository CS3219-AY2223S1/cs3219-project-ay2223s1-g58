import {
  Modal,
  ModalOverlay,
  ModalContent,
  Button,
  useDisclosure,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import MatchForm from './MatchForm'
import io from 'socket.io-client'
import MatchTimer from './MatchTimer'
import MatchTimeout from './MatchTimeout'
import { useNavigate } from 'react-router-dom'
import { URI_MATCHING_SERVICE, EVENT_EMIT, EVENT_LISTEN } from '../../constants'
import MatchError from './MatchError'

const phases = [
  'Selecting Criteria',
  'Finding Match',
  'Failed to Find Match',
  'Match Error',
]

const MatchDialog = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [difficulty, setDifficulty] = useState('')
  const [phase, setPhase] = useState(phases[3])
  const [socket, setSocket] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    const newSocket = io(URI_MATCHING_SERVICE)
    setSocket(newSocket)
    newSocket.on(EVENT_LISTEN.MATCHING, () => console.log('matching'))
    newSocket.on(EVENT_LISTEN.MATCH_SUCCESS, (payload) => {
      console.log('match success')
      navigate(`/room?roomId=${payload.room}`)
    })
    newSocket.on(EVENT_LISTEN.MATCH_FAIL, () => {
      console.log('match error')
      setPhase(phases[3])
    })
    newSocket.on(EVENT_LISTEN.MATCH_TIMEOUT, () => {
      console.log('timed out')
      setPhase(phases[2])
    })
    return () => newSocket.close()
  }, [navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit(EVENT_EMIT.MATCH_FIND, { difficulty: difficulty })
    setPhase(phases[1])
  }

  const handleOpen = () => {
    setPhase(phases[0])
    onOpen()
  }

  const handleClose = () => {
    socket.emit(EVENT_EMIT.MATCH_CANCEL, () => console.log('Cancelled'))
    onClose()
  }

  const renderBody = () => {
    switch (phase) {
      case phases[0]:
        return (
          <MatchForm
            onClose={handleClose}
            onSubmit={handleSubmit}
            onChange={(e) => setDifficulty(e.target.value)}
          />
        )
      case phases[1]:
        return <MatchTimer currDate={new Date()} onClose={handleClose} />
      case phases[2]:
        return (
          <MatchTimeout
            onClose={handleClose}
            handleRetry={() => setPhase(phases[0])}
          />
        )
      default:
        return (
          <MatchError
            onClose={handleClose}
            handleRetry={() => setPhase(phases[0])}
          />
        )
    }
  }

  return (
    <>
      <Button onClick={handleOpen}>Find Match</Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>{renderBody()}</ModalContent>
      </Modal>
    </>
  )
}

export default MatchDialog
