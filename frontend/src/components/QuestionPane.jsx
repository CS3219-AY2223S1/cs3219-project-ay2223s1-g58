import { Box, Badge, HStack, VStack, Heading, Divider } from '@chakra-ui/react'
import { AuthLayout } from '../components/AuthLayout';
import useFetchQuestion from '../hooks/useFetchQuestion';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import ReactMarkdown from 'react-markdown'

const difficultyColorMap = new Map([
    ['easy', 'green'],
    ['medium', 'orange'],
    ['hard', 'red']
])

const QuestionPane = (difficulty) => {
    const {
        data,
        loading,
      } = useFetchQuestion(difficulty);
    
    const difficultyColor = difficultyColorMap.get(data.difficulty)

    return (
        <>
            { !loading ?
            (
                <Box w='40%' h='100%' borderWidth='1px' borderRadius='lg' overflow='hidden'>
                    <VStack h = '100%'>
                        <HStack spacing ='36px' alignItems={['center', 'left']}>
                            <Heading mb='6px' size='lg' textAlign={[ 'left', 'center' ]} fontWeight='semibold' color='gray 500'>{data.name}</Heading> 
                            <Badge borderRadius='full' px='2' colorScheme={difficultyColor} >
                                {data.difficulty}
                            </Badge>
                        </HStack>
                        <Divider orientation='horizontal' />
                        <div className="mx-3 my-3 h-85v overflow-y-auto border-10 border-white">
                            <ReactMarkdown m={[1, 1]} components={ChakraUIRenderer()} children={data.content} skipHtml />;
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