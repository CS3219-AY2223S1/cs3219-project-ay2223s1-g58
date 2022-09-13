import { Box, Badge, HStack, VStack, Heading, Divider } from '@chakra-ui/react'
import { AuthLayout } from '../components/AuthLayout';
import useFetchQuestion from '../hooks/useFetchQuestion';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import ReactMarkdown from 'react-markdown'

const QuestionPane = (difficulty) => {
    const {
        data,
        loading,
      } = useFetchQuestion(difficulty);
    

    console.log(data.content)
    
    const difficultyColor = data.difficulty == 'easy' 
        ? 'green' 
        : (data.difficulty == 'medium' ? 'orange' : 'red')

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
                        <div className="mx-1 my-1 h-85v overflow-y-auto">
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