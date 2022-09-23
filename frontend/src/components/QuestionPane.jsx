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
        <Text mb={1} fontSize={'16px'}>
          {children}
        </Text>
      );
    },
  };


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
                <Box borderWidth='1px' borderRadius='lg'>
                    <VStack h = '100%'>
                        <HStack spacing ='36px'>
                            <Heading mb='6px' size='lg' fontWeight='semibold' color='gray 500'>{data.name}</Heading> 
                            <Badge borderRadius='full' px='2' colorScheme={difficultyColor} >
                                {data.difficulty}
                            </Badge>
                        </HStack>
                        <Divider orientation='horizontal' />
                        <div className="mx-2 my-2 h-85v overflow-y-auto border-x-2 border-y-2">
                            <ReactMarkdown components={ChakraUIRenderer(newTheme)} children={data.content} skipHtml/>;
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
