import {
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react'
import { useCountdown } from '../../hooks/useCountdown'

const MATCH_TIMEOUT_SECONDS = 30
const MATCH_TIMEOUT = MATCH_TIMEOUT_SECONDS * 1000

const MatchTimer = ({ currDate, onClose }) => {
  const [, , , seconds] = useCountdown(
    new Date(currDate.getTime() + MATCH_TIMEOUT)
  )
  return (
    <>
      <ModalHeader>Finding a Match</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <div className="flex justify-center">
          {seconds >= 0 ? (
            <CircularProgress
              value={
                ((MATCH_TIMEOUT_SECONDS - seconds) / MATCH_TIMEOUT_SECONDS) *
                100
              }
              size="120px"
            >
              <CircularProgressLabel>{`${seconds}s`}</CircularProgressLabel>
            </CircularProgress>
          ) : (
            <CircularProgress isIndeterminate size="120px" />
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" mr={3} onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </>
  )
}

export default MatchTimer
