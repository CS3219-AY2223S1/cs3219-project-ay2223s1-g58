import {
  Text,
  useToast,
  Grid,
  Badge,
  GridItem,
  Heading,
  IconButton,
} from '@chakra-ui/react'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer'
import { AuthLayout } from '../components/AuthLayout'
import ReactMarkdown from 'react-markdown'
import { URL_QUESTION_SERVICE } from '../constants'
import axios from '../api/axios'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

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

const parse = (text) => {
  if (text?.startsWith('## Description')) {
    text = text.replace('## Description', '')
  }
  return text
}

const QuestionPage = () => {
  const [questionData, setQuestionData] = useState([])
  const [end, setEnd] = useState(false)
  const { questionId } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    const getQuestion = async () => {
      await axios
        .get(URL_QUESTION_SERVICE + '?id=' + questionId)
        .then((response) => {
          const newData = response.data
          setQuestionData(newData)
        })
        .catch((error) => {
          toast({
            title: '  You have reached the end of the questions!',
            position: 'top',
            status: 'warning',
            duration: 3000,
            isClosable: true,
          })
          setEnd(true)
        })
    }
    getQuestion()
  }, [questionData, end])

  const nextQuestion = async () => {
    if (!end) {
      navigate('/question/' + (parseInt(questionId) + 1))
    }
  }

  if (
    !questionData ||
    typeof questionData === 'undefined' ||
    questionData.length === 0
  ) {
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
        <Grid
          maxHeight="100%"
          autoRows="repeat(2, 1fr)"
          autoColumns="repeat(4,1fr)"
        >
          <GridItem colSpan={1} align="center">
            <IconButton
              w={10}
              onClick={() => navigate('/questions')}
              aria-label="Back"
              icon={<ArrowBackIcon />}
            ></IconButton>
          </GridItem>
          <GridItem colSpan={1} align="center">
            <Heading size="lg" fontWeight="semibold" color="gray 500">
              {questionData.name}
            </Heading>
          </GridItem>
          <GridItem colSpan={1} align="center">
            <Badge
              borderRadius="full"
              px="2"
              colorScheme={difficultyColor(questionData.difficulty)}
            >
              {questionData.difficulty}
            </Badge>
          </GridItem>
          <GridItem colSpan={1} align="center">
            <IconButton
              w={10}
              onClick={nextQuestion}
              aria-label="Back"
              icon={<ArrowForwardIcon />}
            ></IconButton>
          </GridItem>
          <GridItem colSpan={4} ml="5px" mr="5px">
            <div className="mx-2 max-h-full max-w-full overflow-y-auto px-2">
              <ReactMarkdown
                components={ChakraUIRenderer(newTheme)}
                children={parse(questionData.content)}
                skipHtml
              />
              ;
            </div>
          </GridItem>
        </Grid>
      }
    </>
  )
}

export default QuestionPage
