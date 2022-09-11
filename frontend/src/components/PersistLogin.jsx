import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useRefreshToken from '../hooks/useRefreshToken'
import useAuth from '../hooks/useAuth'
import { Spinner } from '@chakra-ui/react'
const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true)
  const refresh = useRefreshToken()
  const { auth, persist } = useAuth()

  useEffect(() => {
    let isMounted = true

    const verifyRefreshToken = async () => {
      try {
        await refresh()
      } catch (err) {
        console.error(err)
      } finally {
        isMounted && setIsLoading(false)
      }
    }

    !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false)

    return () => (isMounted = false)
    // might need to use [] instead
  }, [auth?.accessToken, persist, refresh])

  return (
    <>
      {!persist ? (
        <Outlet />
      ) : isLoading ? (
        <div className="flex justify-center">
          <Spinner size="xl" />
        </div>
      ) : (
        <Outlet />
      )}
    </>
  )
}

export default PersistLogin
