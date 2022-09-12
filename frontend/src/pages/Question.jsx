import { Box, Badge, HStack, VStack, Heading, Divider } from '@chakra-ui/react'
import { AuthLayout } from '../components/AuthLayout';
import useFetchQuestion from '../hooks/useFetchQuestion';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import ReactMarkdown from 'react-markdown'

function Question() {
    const {
        data,
        loading,
      } = useFetchQuestion();
    

    console.log(data.Content)

    return (
        <>
            { !loading ?
            (
                <Box w='40%' h='100%' borderWidth='1px' borderRadius='lg' overflow='hidden'>
                    <VStack h = '100%'>
                        <HStack spacing ='36px' alignItems={['center', 'left']}>
                            <Heading mb='6px' size='lg' textAlign={[ 'left', 'center' ]} fontWeight='semibold' color='gray 500'>{data.name}</Heading> 
                            <Badge borderRadius='full' px='2' colorScheme='green' >
                                Easy
                            </Badge>
                        </HStack>
                        <Divider orientation='horizontal' />
                        <Box h='100%' mt='1' fontWeight='semibold' lineHeight='tight' >
                            <ReactMarkdown components={ChakraUIRenderer()} children={data.content} skipHtml />;
                        </Box>
                    </VStack>
                </Box>

            ) : <AuthLayout title="Unable to retrieve question">
            <div className="text-xl text-center">
            </div>
          </AuthLayout>}
        </>

    )
}

export default Question
