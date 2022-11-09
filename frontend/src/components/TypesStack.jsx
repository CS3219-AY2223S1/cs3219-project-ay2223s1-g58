import {
  Tag,
  HStack,
} from '@chakra-ui/react'

const TypesStack = (types) => {
  let badgeList = []
  if (!Array.isArray(types)) {
    types = [types]
  }
  types.forEach((type, index) => {
    badgeList.push(
      <Tag
        fontWeight="semibold"
        px="2"
        variant='outline' 
        colorScheme='blue'
        key={index}
      >
        {type[0] + type.slice(1).toLowerCase()}
      </Tag>
    )
  })

  return <HStack>{badgeList}</HStack>
}

export default TypesStack
