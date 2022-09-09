import { useNavigate } from 'react-router-dom'
import {
  STATUS_CODE_CONFLICT,
  STATUS_CODE_SUCCESS,
  URL_USER_LOGOUT,
} from '../constants'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const Home = () => {
  const { auth, setAuth } = useAuth()
  const navigate = useNavigate()
  const axiosPrivate = useAxiosPrivate()
  const logout = async () => {
    const res = await axiosPrivate.post(URL_USER_LOGOUT).catch((err) => {
      if (err.response.status === STATUS_CODE_CONFLICT) {
        console.log(err.response.data.message)
      } else {
        console.log(err.response.data.message)
      }
    })
    if (res && res.status === STATUS_CODE_SUCCESS) {
      setAuth({
        accessToken: '',
        username: '',
      })
      navigate('/login')
    }
  }

  return (
    <div>
      <main className="flex flex-col items-center justify-center h-full">
        <h1>Home</h1>
        <br />
        <p>Username: {auth.username}</p>
        <p>You are logged in!</p>
        <br />
        <br />
        <div className="flexGrow">
          <button onClick={logout}>Sign Out</button>
        </div>
      </main>
    </div>
  )
}

export default Home
