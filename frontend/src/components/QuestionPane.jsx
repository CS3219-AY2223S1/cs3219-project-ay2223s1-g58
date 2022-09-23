import { Text, Box, Badge, HStack, VStack, Heading, Divider } from '@chakra-ui/react'
import { AuthLayout } from '../components/AuthLayout';
import useFetchQuestionById from '../hooks/useFetchQuestionById';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import ReactMarkdown from 'react-markdown'

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

const QuestionPane = ({ id }) => {
    const {
        data,
        loading,
      } = useFetchQuestionById(id);
    
    const difficultyColor = difficultyColorMap.get(data.difficulty)

    return (
        <>
            { !loading ?
            (
                <Box className='border rounded-lg'>
                    <VStack h='100vh'>
                        <HStack spacing='24px'>
                            <Heading size='lg' fontWeight='semibold' color='gray 500'>
                              {data.name}
                            </Heading> 
                            <Badge borderRadius='full' px='2' colorScheme={difficultyColor}>
                                {data.difficulty}
                            </Badge>
                        </HStack>

                        <Divider orientation='horizontal' />

                        <div className="mx-2 px-2 max-h-full overflow-y-auto">
                            <ReactMarkdown components={ChakraUIRenderer(newTheme)} children={parse(data.content)} skipHtml/>;
                        </div>
                    </VStack>
                </Box>
            ) : <AuthLayout title="Retrieving question...">
            <div className="text-xl text-center">
            </div>
          </AuthLayout>}
        </>

    )
}

export default QuestionPane
