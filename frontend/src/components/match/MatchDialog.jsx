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
import {
  URI_MATCHING_SERVICE_SOCKET_PATH,
  EVENT_EMIT,
  EVENT_LISTEN,
  URI_MATCHING_SERVICE,
} from '../../constants'
import MatchError from './MatchError'
import useAuth from '../../hooks/useAuth'

const PHASES = {
  SELECT: 'SELECT',
  FINDING: 'FINDING',
  TIMEOUT: 'TIMEOUT',
  ERROR: 'ERROR',
}

const MatchDialog = ({ isDisabled }) => {

const difficultyList = ['easy', 'medium', 'hard']

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [difficulty, setDifficulty] = useState('')
  const [type, setType] = useState('')
  const [phase, setPhase] = useState(PHASES.SELECT)
  const [socket, setSocket] = useState()
  const navigate = useNavigate()
  const { auth } = useAuth()

  useEffect(() => {
    const newSocket = io(URI_MATCHING_SERVICE, {
      path: URI_MATCHING_SERVICE_SOCKET_PATH,
      auth: {
        token: auth.accessToken,
      },
    })
    setSocket(newSocket)
    newSocket.on(EVENT_LISTEN.MATCHING, () => console.log('matching'))
    newSocket.on(EVENT_LISTEN.MATCH_SUCCESS, (payload) => {
      console.log('match success')
      navigate(`/room/${payload.room}`)
    })
    newSocket.on(EVENT_LISTEN.MATCH_FAIL, () => {
      console.log('match error')
      setPhase(PHASES.ERROR)
    })
    newSocket.on(EVENT_LISTEN.MATCH_TIMEOUT, () => {
      console.log('timed out')
      setPhase(PHASES.TIMEOUT)
    })
    return () => newSocket.close()
  }, [auth.accessToken, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit(EVENT_EMIT.MATCH_FIND, { difficulty: difficulty, types: type })
    setPhase(PHASES.FINDING)
  }

  const handleOpen = () => {
    setPhase(PHASES.SELECT)
    onOpen()
  }

  const handleClose = () => {
    socket.emit(EVENT_EMIT.MATCH_CANCEL, () => console.log('Cancelled'))
    onClose()
  }

  const renderBody = () => {
    switch (phase) {
      case PHASES.SELECT:
        return (
          <MatchForm
            onClose={handleClose}
            onSubmit={handleSubmit}
            onChange={(e) => {
              if (difficultyList.includes(e.target.value)) {
                setDifficulty(e.target.value)
              } else {
                setType(e.target.value)
              }
            }}
          />
        )
      case PHASES.FINDING:
        return <MatchTimer currDate={new Date()} onClose={handleClose} />
      case PHASES.TIMEOUT:
        return (
          <MatchTimeout
            onClose={handleClose}
            handleRetry={() => setPhase(PHASES.SELECT)}
          />
        )
      default:
        return (
          <MatchError
            onClose={handleClose}
            handleRetry={() => setPhase(PHASES.SELECT)}
          />
        )
    }
  }

  return (
    <>
      <Button onClick={handleOpen} disabled={isDisabled}>
        Find Match
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>{renderBody()}</ModalContent>
      </Modal>
    </>
  )
}

export default MatchDialog
