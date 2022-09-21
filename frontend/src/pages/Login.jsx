import { AuthLayout } from '../components/AuthLayout'
import { Button } from '../components/Button'
import { TextField } from '../components/Fields'
import { useEffect, useRef, useState } from 'react'
import axios from '../api/axios'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  URL_USER_LOGIN,
  STATUS_CODE_SUCCESS,
  STATUS_CODE_BAD_REQUEST,
} from '../constants'
import useAuth from '../hooks/useAuth'
import { Helmet } from 'react-helmet-async'

function Login() {
  const { auth, setAuth, persist, setPersist } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  const errRef = useRef()
  const togglePersist = () => {
    setPersist((prev) => !prev)
  }
  useEffect(() => {
    localStorage.setItem('persist:peerprep', persist)
  }, [persist])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleLogin = async () => {
    const res = await axios
      .post(URL_USER_LOGIN, { username, password })
      .catch((err) => {
        if (err.response.status === STATUS_CODE_BAD_REQUEST) {
          setErrorMsg(err.response.data.message)
        } else {
          setErrorMsg('Server Error')
        }
      })
    if (res && res.status === STATUS_CODE_SUCCESS) {
      setAuth({
        username,
        school: res.data.data.school,
        email: res.data.data.email,
        accessToken: res.data.data.accessToken,
        isLoggedIn: true,
      })
      setUsername('')
      setPassword('')
      navigate(from, { replace: true })
    }
  }

  useEffect(() => {
    setErrorMsg('')
  }, [username, password])

  useEffect(() => {
    console.log(auth)
  }, [auth])
  return (
    <>
      <Helmet>
        <title>Login | PeerPrep</title>
        <meta charSet="utf-8" />
        <meta name="description" content="PeerPrep help you prep" />
      </Helmet>
      {auth?.username === '' ? (
        <AuthLayout
          title="Sign in to account"
          subtitle={
            <>
              Don’t have an account?{' '}
              <Link to="/signup" className="text-cyan-600">
                Sign up
              </Link>
            </>
          }
        >
          <div>
            <div className="space-y-6">
              <TextField
                label="Username"
                value={username}
                autoComplete="off"
                onChange={(e) => setUsername(e.target.value)}
                sx={{ marginBottom: '1rem' }}
                autoFocus
                required
              />
              <TextField
                label="Password"
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ marginBottom: '2rem' }}
              />
            </div>
            <div className="mt-2 flex items-center justify-center gap-2">
              <input
                type="checkbox"
                id="persist"
                onChange={togglePersist}
                checked={persist}
              />
              <label htmlFor="persist">
                Trust This Device (Persist Sign In)
              </label>
            </div>
            <Button color="cyan" className="mt-8 w-full" onClick={handleLogin}>
              Sign In
            </Button>
            <div
              ref={errRef}
              className={`mt-2 text-center ${errorMsg ? 'errormsg' : 'hidden'}`}
              aria-live="assertive"
            >
              {errorMsg}
            </div>
          </div>
        </AuthLayout>
      ) : (
        <div className="mx-auto text-center">You have logged in!</div>
      )}
    </>
  )
}

export default Login
