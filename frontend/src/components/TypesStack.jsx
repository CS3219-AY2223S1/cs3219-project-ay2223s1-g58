import { Text, Box, Badge, HStack, VStack, Heading, Divider } from '@chakra-ui/react'

const TypesStack = (types) => {
    let badgeList=[];
    if (!Array.isArray(types)) {
        types = [types]
    }
    types.forEach((type, index)=>{
    badgeList.push(<Badge fontWeight='bold' color='gray.600' colorScheme='blue' key={index}>{type}</Badge>)
    })

    return (
    <HStack>
        {badgeList}
    </HStack>);
  }
  
  export default TypesStack