import { useColorMode } from '@chakra-ui/react'
import { BsMoon, BsSun } from 'react-icons/bs'

const DarkModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <button
      className="h-10 px-3 text-yellow-300 transition duration-200 ease-in border border-gray-300 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-200"
      onClick={toggleColorMode}
    >
      {colorMode === 'dark' ? <BsMoon /> : <BsSun />}
    </button>
  )
}

export default DarkModeToggle
