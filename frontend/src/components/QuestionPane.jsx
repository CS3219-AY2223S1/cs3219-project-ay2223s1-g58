import {
  Text,
  Box,
  Badge,
  HStack,
  VStack,
  Heading,
  useToast,
  StackDivider,
} from '@chakra-ui/react'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer'
import { AuthLayout } from '../components/AuthLayout'
import ReactMarkdown from 'react-markdown'
import { Button } from '../components/Button'
import {
  URL_QUESTION_SERVICE,
  URL_ROOM_SERVICE,
  STATUS_CODE_SUCCESS,
} from '../constants'
import axios from '../api/axios'
import { useEffect, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const difficultyColorMap = new Map([
  ['easy', 'green'],
  ['medium', 'orange'],
  ['hard', 'red'],
])

const newTheme = {
  p: (props) => {
    const { children } = props
    return <Text className="text-sm">{children}</Text>
  },
}

// Prettify the question text
// TODO: fix the root issue when storing questions in DB
const parse = (text) => {
  if (text?.startsWith('## Description')) {
    text = text.replace('## Description', '')
  }
  return text
}

const QuestionPane = ({ questionId, roomId }) => {
  const [questionData, setQuestionData] = useState([])
  const toast = useToast()
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    const getQuestion = async () => {
      await axios
        .get(URL_QUESTION_SERVICE + '?id=' + questionId)
        .then((response) => {
          const newData = response.data
          setQuestionData(newData)
        })
        .catch((e) => console.log(e))
    }
    getQuestion()
  }, [questionId])

  const getNextQuestion = async () => {
    await axiosPrivate
      .put(`${URL_ROOM_SERVICE}/${roomId}`)
      .then((res) => {
        if (res && res.status !== STATUS_CODE_SUCCESS) {
          toast({
            title: 'Something went wrong',
            description: 'Please try again',
            status: 'error',
            duration: 4000,
            isClosable: true,
          })
        }
      })
      .catch(console.log)
  }

  if (typeof questionData === 'undefined' || questionData.length === 0) {
    return (
      <AuthLayout title="Retrieving question...">
        <div className="text-center text-xl"></div>
      </AuthLayout>
    )
  }

  const difficultyColor = (difficulty) => difficultyColorMap.get(difficulty)

  return (
    <>
      <Box className="rounded-lg border">
        <VStack h="100vh" divider={<StackDivider borderColor="gray.200" />}>
          <HStack spacing="30px" className="mt-2">
            <Heading size="lg" fontWeight="semibold" color="gray 500">
              {questionData.name}
            </Heading>
            <Badge
              borderRadius="full"
              px="2"
              colorScheme={difficultyColor(questionData.difficulty)}
            >
              {questionData.difficulty}
            </Badge>
            <Button
              onClick={getNextQuestion}
              variant="outline"
              className=" dark:text-gray-300"
            >
              Next Question
            </Button>
          </HStack>
          <div className="mx-2 max-h-full overflow-y-auto px-2">
            <ReactMarkdown
              components={ChakraUIRenderer(newTheme)}
              children={parse(questionData.content)}
              skipHtml
            />
          </div>
        </VStack>
      </Box>
    </>
  )
}

export default QuestionPane
