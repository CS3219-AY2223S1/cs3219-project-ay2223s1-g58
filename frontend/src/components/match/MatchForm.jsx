import axios from '../../api/axios'
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
import { useEffect, useState } from 'react';
import { URL_QUESTION_SERVICE } from '../../constants'

const MatchForm = ({ onClose, onSubmit, onChange }) => {
  const [data, setData] = useState()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response } = await axios.get(
          URL_QUESTION_SERVICE + '/allTypes'
        )
        const optionList = response.types.map((types) => 
            <option key={types} value={types}>{types}</option>
      )
        setData(optionList)
      } catch (error) {
        console.error(error)
      }
    }
    if (!data || data.length === 0) {
      fetchData()
    }
  })


  return (
          <form onSubmit={onSubmit}>
            <ModalHeader>Select match criteria</ModalHeader>
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
              <FormControl isRequired></FormControl>
            </ModalBody>

            <ModalBody>
            <FormControl>
                <FormLabel>Question Category</FormLabel>
                <Select placeholder="Select a category" onChange={onChange}>
                  {data}
                </Select>
                </FormControl>
                <FormControl></FormControl>
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
