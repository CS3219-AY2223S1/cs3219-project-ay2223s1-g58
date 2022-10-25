import {
  Text,
  Code,
  HStack,
  StackDivider,
  VStack,
  Box,
  useToast,
  Image,
  Badge,
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

const supTheme = {
  em: ({ node, ...props }) => {
    if (
      props.children[0] &&
      typeof props.children[0] === 'string' &&
      props.children[0].startsWith('^')
    ) {
      return <sup>{props.children[0].substring(1, 2)}</sup>
    }
    if (
      props.children[0] &&
      typeof props.children[0] === 'string' &&
      props.children[0].startsWith('~')
    ) {
      return <sub>{props.children[0].substring(1, 2)}</sub>
    }
    return <i {...props} />
  },
}

const newTheme = {
  img: ({ node, children, ...props }) => {
    return <Image m={4} src={node.properties.src}></Image>
  },
  code: ({ node, inline, children, ...props }) => {
    return !inline ? (
      <Code overflow="auto" fontSize="lg" w="100%" p={2} mt={4} mb={4}>
        <ReactMarkdown
          components={ChakraUIRenderer(supTheme)}
          children={children[0]}
        />
      </Code>
    ) : (
      <Code fontSize="lg">
        <ReactMarkdown
          components={ChakraUIRenderer(supTheme)}
          children={children[0]}
        />
      </Code>
    )
  },
  p: (props) => {
    const { children } = props
    return (
      <Text overflow="auto" mb={1} className="text-lg">
        {children}
      </Text>
    )
  },
  em: ({ node, ...props }) => {
    if (
      props.children[0] &&
      typeof props.children[0] === 'string' &&
      props.children[0].startsWith('^')
    ) {
      return <sup>{props.children[0].substring(1, 2)}</sup>
    }
    if (
      props.children[0] &&
      typeof props.children[0] === 'string' &&
      props.children[0].startsWith('~')
    ) {
      return <sub>{props.children[0].substring(1, 2)}</sub>
    }
    return <i {...props} />
  },
}

const parse = (text) => {
  text = text.replace('\n', '\n\n')
  return text
}

const QuestionPage = () => {
  const [questionData, setQuestionData] = useState([])
  const [end, setEnd] = useState(false)
  const { questionId } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const nextQuestion = async () => {
    if (!end) {
      navigate('/question/' + (parseInt(questionId) + 1))
    }
  }

  const previousQuestion = async () => {
    if (questionId > 1) {
      navigate('/question/' + (parseInt(questionId) - 1))
    } else {
      toast({
        title: 'You have reached the start of the questions!',
        position: 'top',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
    }
  }

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
            title: 'You have reached the end of the questions!',
            position: 'top',
            status: 'warning',
            duration: 3000,
            isClosable: true,
          })
          setEnd(true)
        })
    }
    if (
      typeof questionData.id === 'undefined' ||
      Number(questionData.id) !== Number(questionId)
    ) {
      getQuestion()
    }
  }, [questionData, end, questionId, toast])

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
      <Box className="rounded-lg border">
        <VStack h="100vh" divider={<StackDivider borderColor="gray.200" />}>
          <Heading size="lg" fontWeight="semibold" color="gray 500">
            {questionData.name}
          </Heading>
          <HStack spacing={350}>
            <IconButton
              onClick={previousQuestion}
              aria-label="Back"
              icon={<ArrowBackIcon />}
            ></IconButton>
            <Badge
              align="center"
              textAlign="center"
              borderRadius="full"
              px="2"
              colorScheme={difficultyColor(questionData.difficulty)}
            >
              {questionData.difficulty}
            </Badge>
            <IconButton
              onClick={nextQuestion}
              aria-label="Back"
              icon={<ArrowForwardIcon />}
            ></IconButton>
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

export default QuestionPage
