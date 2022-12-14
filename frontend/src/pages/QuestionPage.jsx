import {
  Text,
  Center,
  Code,
  HStack,
  StackDivider,
  VStack,
  Box,
  useToast,
  Image,
  Badge,
  Heading,
} from '@chakra-ui/react'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer'
import { AuthLayout } from '../components/AuthLayout'
import ReactMarkdown from 'react-markdown'
import { URL_QUESTION_SERVICE } from '../constants'
import axios from '../api/axios'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Helmet } from 'react-helmet-async'

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
    return <Image m={4} sizes="md" src={node.properties.src}></Image>
  },
  code: ({ node, inline, children, ...props }) => {
    return !inline ? (
      <Code overflow="auto" fontSize="md" w="100%"  >
        <ReactMarkdown
          components={ChakraUIRenderer(supTheme)}
          children={children[0]}
        />
      </Code>
    ) : (
      <Code fontSize="md">
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
        <div className="text-xl text-center"></div>
      </AuthLayout>
    )
  }

  const difficultyColor = (difficulty) => difficultyColorMap.get(difficulty)
  return (
    <>
    <Helmet>
      <title>{questionData.name} | LeetWithFriend</title>
      <meta charSet="utf-8" />
      <meta
        name="description"
        content="An interview preparation platform and peer matching system, where students can find peers to practice whiteboard-style interview questions together."
      />
    </Helmet>
    <Center>
        <VStack h="100vh" divider={<StackDivider borderColor="gray.200" />}>
          <Heading size="lg" fontWeight="semibold" color="gray 500">
            {questionData.name}
          </Heading>
          <HStack spacing={180}>
            <Button
              onClick={previousQuestion}
              variant="outline"
              className=" dark:text-gray-300"
            >
              Previous
            </Button>
            <Badge
              align="center"
              textAlign="center"
              borderRadius="full"
              px="2"
              colorScheme={difficultyColor(questionData.difficulty)}
            >
              {questionData.difficulty}
            </Badge>
            <Button
              onClick={nextQuestion}
              variant="outline"
              className=" dark:text-gray-300"
            >
              Next
            </Button>
          </HStack>
          <Box maxHeight="750px" maxWidth="900px" overflow="auto" m={2}>
            <ReactMarkdown
              components={ChakraUIRenderer(newTheme)}
              children={parse(questionData.content)}
              skipHtml
            />
          </Box>
        </VStack>
      </Center>
    </>
  )
}

export default QuestionPage
