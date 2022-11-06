import {
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react'

const MatchError = ({ onClose, handleRetry, header, message }) => {
  return (
    <>
      <ModalHeader>{header}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>{message}</ModalBody>

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
