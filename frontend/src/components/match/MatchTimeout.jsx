import {
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react'

const MatchTimeout = ({ onClose, handleRetry }) => {
  return (
    <>
      <ModalHeader>No match found</ModalHeader>
      <ModalCloseButton />

      <ModalBody>
        Please try again. Consider relaxing your matching critera(s).
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

export default MatchTimeout
