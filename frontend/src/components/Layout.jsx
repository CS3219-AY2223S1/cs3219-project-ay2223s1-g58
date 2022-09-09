import { Outlet } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { Footer } from './Footer'
import { Header } from './Header'

const Layout = () => {
  return (
    <>
      <Header />
      <Box className="h-screen">
        <Outlet />
      </Box>
      <Footer />
    </>
  )
}

export default Layout
