import { useNavigate } from 'react-router-dom'
import {
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_SUCCESS,
  URL_USER_SERVICE,
} from '../constants'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const Profile = () => {
  const { setAuth } = useAuth()
  const navigate = useNavigate()
  const axiosPrivate = useAxiosPrivate()
  const deleteAccount = async () => {
    const res = await axiosPrivate.delete(URL_USER_SERVICE).catch((err) => {
      if (err.response.status === STATUS_CODE_BAD_REQUEST) {
        console.log(err.response.data.message)
      } else {
        console.log('Server Error')
      }
    })
    if (res && res.status === STATUS_CODE_SUCCESS) {
      setAuth({})
      navigate('/login')
    }
  }

  return (
    <div>
      <main className="flex flex-col items-center justify-center h-full">
        <div className="flex flex-col">
          <button onClick={deleteAccount}>Delete Account</button>
        </div>
      </main>
    </div>
  )
}

export default Profile
