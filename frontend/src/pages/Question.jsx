import { Box, Badge, HStack, VStack, Heading, Divider } from '@chakra-ui/react'
import useFetchQuestion from '../hooks/useFetchQuestion';
import { URL_RETRIEVE_QUESTION, STATUS_CODE_BAD_REQUEST, STATUS_CODE_SUCCESS } from '../constants'


function Question() {
    const {
        data,
        loading,
      } = useFetchQuestion();
    

    return (
         <div>
            {loading && <div>Loading</div>}
            {!loading && (
                <div>
                    <Box w='40%' h='100%' borderWidth='1px' borderRadius='lg' overflow='hidden'>
                        <VStack>
                            <HStack spacing ='36px' alignItems={['center', 'left']}>
                                <Heading mb='6px' size='lg' textAlign={[ 'left', 'center' ]} fontWeight='semibold' color='gray 500'>{'Two Sum'}</Heading> 
                                <Badge borderRadius='full' px='2' colorScheme='green' >
                                    Easy
                                </Badge>
                            </HStack>
                            <Divider orientation='horizontal' />
                            <Box mt='1' fontWeight='semibold' as='h4' lineHeight='tight' noOfLines={1} h='100%'>
                                {data.map(item => (<span>{item.content}</span>))}
                            </Box>
                        </VStack>
                    </Box>
                </div>
            )}
          
          </div>
    )
}

export default Question
