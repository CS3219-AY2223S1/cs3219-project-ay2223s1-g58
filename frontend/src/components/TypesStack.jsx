import {
  Badge,
  HStack,
} from '@chakra-ui/react'

const TypesStack = (types) => {
  let badgeList = []
  if (!Array.isArray(types)) {
    types = [types]
  }
  types.forEach((type, index) => {
    badgeList.push(
      <Badge
        fontWeight="bold"
        color="gray.600"
        borderRadius="1"
        px="2"
        colorScheme="blue"
        key={index}
      >
        {type}
      </Badge>
    )
  })

  return <HStack>{badgeList}</HStack>
}

export default TypesStack
