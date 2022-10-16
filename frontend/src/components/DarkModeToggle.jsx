import { useColorMode } from '@chakra-ui/react'
import { BsMoon, BsSun } from 'react-icons/bs'

const DarkModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <button
      className="h-10 px-3 text-yellow-300 transition duration-200 ease-in border border-gray-300 rounded-lg hover:bg-gray-800"
      onClick={toggleColorMode}
    >
      {colorMode === 'dark' ? <BsMoon /> : <BsSun />}
    </button>
  )
}

export default DarkModeToggle
