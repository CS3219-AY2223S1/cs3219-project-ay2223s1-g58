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
  Container,
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
import TypesStack from './TypesStack'

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
      <Code overflow="auto" fontSize="md" w="100%" >
        <ReactMarkdown
          components={ChakraUIRenderer(supTheme)}
          children={children[0]}
        />
      </Code>
    ) : (
      <Code fontSize="md" >
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
      <Text overflow="auto" mb={1} className="text-md">
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
          <VStack divider={<StackDivider borderColor="gray.200"/>}>
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
              {TypesStack(questionData.types)}
          </VStack>
          <Box overflow='auto' w="95%" mx='2' my='2'>
            <ReactMarkdown
              components={ChakraUIRenderer(newTheme)}
              children={parse(questionData.content)}
              skipHtml
            />
          </Box>
          <Button
              onClick={getNextQuestion}
              variant="outline"
              className=" dark:text-gray-300"
            >
              Next Question
            </Button>
        </VStack>
      </Box>
    </>
  )
}

export default QuestionPane
