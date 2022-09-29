import { Text, Box, Badge, HStack, VStack, Heading, Divider } from '@chakra-ui/react'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer'
import { AuthLayout } from '../components/AuthLayout';
import useFetchQuestionById from '../hooks/useFetchQuestionById';
import ReactMarkdown from 'react-markdown'
import { Button } from '../components/Button'
import { URL_QUESTION_SERVICE } from '../constants'
import axios from '../api/axios'
import { useEffect, useState } from 'react'


const difficultyColorMap = new Map([
    ['easy', 'green'],
    ['medium', 'orange'],
    ['hard', 'red']
])

const newTheme = {
  p: props => {
    const { children } = props;
    return (
      <Text className='text-sm'>
        {children}
      </Text>
    );
  },
};

// Prettify the question text
// TODO: fix the root issue when storing questions in DB
const parse = (text) => {
  if (text.startsWith('## Description')) {
    text = text.replace('## Description', '')
  }
  return text
}



const QuestionPane = ({id, setQuestionId}) => {
  const [questionData, setQuestionData] = useState([])

  useEffect(() => {
    if (questionData.length == 0) {
      const fetchData = async () => {
        try {
          const {data: response} = await axios.get(URL_QUESTION_SERVICE + '?id=' + id).then((response) => {
            setQuestionData(response.data)
          })
        } catch (error) {
          //todo toast
          console.error(error);
        }
      }
      fetchData()
    }
  }, [questionData])


  const getNextQuestion = async () => {
    const {data: response} = await axios.get(URL_QUESTION_SERVICE + '?id=' + questionData.id).catch(console.log)
    await axios.get(URL_QUESTION_SERVICE + '/nextQuestion' 
    + '?difficulty=' + response.difficulty  + '&past_id=' + questionData.id).then((response) => {
      var newData = response.data
      setQuestionData(newData)
      console.log("After: " + newData.id)
      setQuestionId(newData.id)
    }).catch(console.log)
  }

  if (questionData.length == 0) {
    return (
      <AuthLayout title="Retrieving question...">
            <div className="text-xl text-center">
            </div>
          </AuthLayout>
    )
  }

  return (
      <>
          {
          (
              <Box className='border rounded-lg'>
                  <VStack h='100vh'>
                      <HStack spacing='30px'>
                          <Heading size='lg' fontWeight='semibold' color='gray 500'>
                            {questionData.name}
                          </Heading> 
                          <Badge borderRadius='full' px='2' colorScheme={() => {difficultyColorMap.get(questionData.difficulty)}}>
                              {questionData.difficulty}
                          </Badge>
                          <Button onClick={getNextQuestion} variant="outline">Next Question</Button>
                      </HStack>

                      <Divider orientation='horizontal' />

                      <div className="mx-2 px-2 max-h-full overflow-y-auto">
                          <ReactMarkdown components={ChakraUIRenderer(newTheme)} children={parse(questionData.content)} skipHtml/>;
                      </div>
                  </VStack>
              </Box>
          )}
      </>

  )
}

export default QuestionPane
