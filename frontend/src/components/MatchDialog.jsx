
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Select,
    FormControl,
    FormLabel,
    useDisclosure
  } from '@chakra-ui/react'
import { useState } from 'react'


const MatchDialog = () => {
    const { isOpen = true, onOpen, onClose } = useDisclosure()
    const [difficulty, setDifficulty] = useState('')
    const onSubmit = (e) => {
        e.preventDefault()
        console.log(difficulty)
    }
    return (
      <>
        <Button onClick={onOpen}>Find Match</Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>

            <form onSubmit={onSubmit}>
            <ModalHeader>Find a Match</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <FormControl isRequired>
                <FormLabel>Question difficulty</FormLabel>
                <Select placeholder='Select a difficulty' onChange={(e) => setDifficulty(e.target.value)}>
                    <option value='easy'>Easy</option>
                    <option value='medium'>Medium</option>
                    <option value='hard'>Hard</option>
                </Select>
            </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button variant='ghost' mr={3} onClick={onClose} >
                Cancel
              </Button>
              <Button colorScheme='blue' type="submit" >Match</Button>
            </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </>
    )
  }

export default MatchDialog;