import {
  Text,
  Box,
  Badge,
  HStack,
  VStack,
  Heading,
  Divider,
} from '@chakra-ui/react'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer'
import { AuthLayout } from '../components/AuthLayout'
import ReactMarkdown from 'react-markdown'
import { Button } from '../components/Button'
import { URL_QUESTION_SERVICE } from '../constants'
import axios from '../api/axios'
import { useEffect, useState } from 'react'

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

const QuestionPane = ({ id }) => {
  const [questionId, setQuestionId] = useState(id)
  const [questionData, setQuestionData] = useState([])

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
  }, [questionId, questionData])

  const getNextQuestion = async () => {
    const { data: response } = await axios
      .get(URL_QUESTION_SERVICE + '?id=' + questionId)
      .catch((e) => console.log(e))
    await axios
      .get(
        URL_QUESTION_SERVICE +
          '/nextQuestion' +
          '?difficulty=' +
          response.difficulty +
          '&past_id=' +
          questionData.id
      )
      .then((response) => {
        const newData = response.data
        setQuestionId(newData.id)
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
      {
        <Box className="rounded-lg border">
          <VStack h="100vh">
            <HStack spacing="30px">
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
              <Button onClick={getNextQuestion} variant="outline">
                Next Question
              </Button>
            </HStack>

            <Divider orientation="horizontal" />

            <div className="mx-2 max-h-full overflow-y-auto px-2">
              <ReactMarkdown
                components={ChakraUIRenderer(newTheme)}
                children={parse(questionData.content)}
                skipHtml
              />
              ;
            </div>
          </VStack>
        </Box>
      }
    </>
  )
}

export default QuestionPane
