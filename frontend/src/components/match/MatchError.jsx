import {
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react'

const MatchError = ({ onClose, handleRetry }) => {
  return (
    <>
      <ModalHeader>Match Error</ModalHeader>
      <ModalCloseButton />

      <ModalBody>
        Something went wrong, please wait for a while before trying again.
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" mr={3} onClick={onClose}>
          Cancel
        </Button>
        <Button colorScheme="blue" onClick={handleRetry}>
          Retry
        </Button>
      </ModalFooter>
    </>
  )
}

export default MatchError
