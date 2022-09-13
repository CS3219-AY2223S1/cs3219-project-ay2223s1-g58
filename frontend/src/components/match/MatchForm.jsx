import {
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Select,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'

const MatchForm = ({ onClose, onSubmit, onChange }) => {
  return (
    <form onSubmit={onSubmit}>
      <ModalHeader>Select match criterias</ModalHeader>
      <ModalCloseButton />

      <ModalBody>
        <FormControl isRequired>
          <FormLabel>Question difficulty</FormLabel>
          <Select placeholder="Select a difficulty" onChange={onChange}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>
        </FormControl>
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" mr={3} onClick={onClose}>
          Cancel
        </Button>
        <Button colorScheme="blue" type="submit">
          Match
        </Button>
      </ModalFooter>
    </form>
  )
}

export default MatchForm
