import {
  Text,
  Box,
  Badge,
  VStack,
  Heading,
  useToast,
  Image,
  Code,
  StackDivider,
  Flex,
  Spacer,
  Button,
} from '@chakra-ui/react'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer'
import { AuthLayout } from '../components/AuthLayout'
import ReactMarkdown from 'react-markdown'
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

// Prettify the question text
// TODO: fix the root issue when storing questions in DB
const parse = (text) => {
  if (text?.startsWith('## Description')) {
    text = text.replace('## Description', '')
  }
  return text
}

const QuestionPane = ({ questionId, roomId, isFirstQuestion }) => {
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
      .put(`${URL_ROOM_SERVICE}/next/${roomId}`)
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

  const getPrevQuestion = async () => {
    await axiosPrivate
      .put(`${URL_ROOM_SERVICE}/prev/${roomId}`)
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
          <VStack divider={<StackDivider borderColor="gray.200" />}>
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
          </VStack>
          <div className="mx-2 max-h-full overflow-y-auto px-2">
            <ReactMarkdown
              components={ChakraUIRenderer(newTheme)}
              children={parse(questionData.content)}
              skipHtml
            />
          </div>
          <Flex>
            <Spacer />
            <Button
              isDisabled={isFirstQuestion}
              onClick={getPrevQuestion}
              mr={2}
            >
              Previous Question
            </Button>
            <Button onClick={getNextQuestion}>Next Question</Button>
            <Spacer />
          </Flex>
        </VStack>
      </Box>
    </>
  )
}

export default QuestionPane
