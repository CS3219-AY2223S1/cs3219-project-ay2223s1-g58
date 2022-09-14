import { Text, Box, Badge, HStack, VStack, Heading, Divider } from '@chakra-ui/react'
import { AuthLayout } from '../components/AuthLayout';
import useFetchQuestionByDifficulty from '../hooks/useFetchQuestionByDifficulty';
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
        <Text mb={1} fontSize={'16px'}>
          {children}
        </Text>
      );
    },
  };


const QuestionPane = (difficulty) => {
    const {
        data,
        loading,
      } = useFetchQuestionByDifficulty(difficulty);
    
    const difficultyColor = difficultyColorMap.get(data.difficulty)

    return (
        <>
            { !loading ?
            (
                <Box borderWidth='1px' borderRadius='lg'>
                    <VStack h = '100%'>
                        <HStack spacing ='36px'>
                            <Heading mb='6px' size='lg' fontWeight='semibold' color='gray 500'>{data.name}</Heading> 
                            <Badge borderRadius='full' px='2' colorScheme={difficultyColor} >
                                {data.difficulty}
                            </Badge>
                        </HStack>
                        <Divider orientation='horizontal' />
                        <div className="mx-3 my-3 overflow-y-auto">
                            <ReactMarkdown components={ChakraUIRenderer(newTheme)} children={data.content} skipHtml/>;
                        </div>
                    </VStack>
                </Box>
            ) : <AuthLayout title="Unable to retrieve question">
            <div className="text-xl text-center">
            </div>
          </AuthLayout>}
        </>

    )
}

export default QuestionPane