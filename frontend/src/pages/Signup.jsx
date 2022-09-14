import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'
import axios from '../api/axios'
import { URL_USER_SERVICE, USER_REGEX, PASSWORD_REGEX } from '../constants'
import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED } from '../constants'
import { AuthLayout } from '../components/AuthLayout'
import { Button } from '../components/Button'
import { FormTextField } from '../components/Fields'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const [validName, setValidName] = useState(false)
  const [validPassword, setValidPassword] = useState(false)
  const [validMatch, setValidMatch] = useState(false)

  const [usernameFocus, setUsernameFocus] = useState(false)
  const [passwordFocus, setPasswordFocus] = useState(false)
  const [repeatPasswordFocus, setRepeatPasswordFocus] = useState(false)

  const [success, setSuccess] = useState(false)

  const errRef = useRef()

  const handleSignup = async () => {
    const v1 = USER_REGEX.test(username)
    const v2 = PASSWORD_REGEX.test(password)
    if (!v1 || !v2) {
      setErrorMsg('Invalid Entry')
      return
    }
    const res = await axios
      .post(URL_USER_SERVICE, { username, password })
      .catch((err) => {
        console.log(err.response.data.message)
        if (err.response.status === STATUS_CODE_CONFLICT) {
          setErrorMsg('This username already exists')
        } else {
          setErrorMsg('Please try again later')
        }
      })
    if (res && res.status === STATUS_CODE_CREATED) {
      setSuccess(true)
      setUsername('')
      setPassword('')
      setRepeatPassword('')
    }
  }
  useEffect(() => {
    setValidName(USER_REGEX.test(username))
  }, [username])

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password))
    setValidMatch(password === repeatPassword)
  }, [password, repeatPassword])

  useEffect(() => {
    setErrorMsg('')
  }, [username, password, repeatPassword])

  return (
    <>
      <Helmet>
        <title>Signup | PeerPrep</title>
        <meta charSet="utf-8" />
        <meta name="description" content="PeerPrep help you prep" />
      </Helmet>
      {success ? (
        <AuthLayout title="Sign up successful!">
          <div className="text-xl text-center">
            <Link to="/login" className="underline text-cyan-600">
              Sign in
            </Link>{' '}
            to your account now!
          </div>
        </AuthLayout>
      ) : (
        <>
          <AuthLayout
            title="Sign up for an account"
            subtitle={
              <>
                Already registered?{' '}
                <Link to="/login" className="text-cyan-600">
                  Sign in
                </Link>{' '}
                to your account.
              </>
            }
          >
            <div>
              <div className="grid grid-cols-2 gap-2">
                <FormTextField
                  label="Username"
                  id="username"
                  name="username"
                  minLength={4}
                  isValid={validName}
                  isFocused={usernameFocus}
                  value={username}
                  className="col-span-full"
                  type="text"
                  autoComplete="off"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                  onFocus={() => setUsernameFocus(true)}
                  onBlur={() => setUsernameFocus(false)}
                />
                <div
                  id="uidnote"
                  className={
                    usernameFocus && username && !validName
                      ? 'relative col-span-full flex items-center gap-2 bg-slate-500 px-1 text-white'
                      : 'hidden'
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  4 to 24 characters.
                  <br />
                  Must begin with a letter.
                  <br />
                  Letters, numbers, underscores, hyphens allowed.
                </div>
                <FormTextField
                  className="col-span-full"
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="off"
                  required
                  isValid={validPassword}
                  isFocused={passwordFocus}
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                />
                <div
                  className={
                    passwordFocus && !validPassword
                      ? 'relative col-span-full flex items-center gap-2 bg-slate-500 px-1 text-white'
                      : 'hidden'
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <div>
                    8 to 24 characters.
                    <br />
                    Must include uppercase and lowercase letters, a number and a
                    special character.
                    <br />
                    Allowed special characters:{' '}
                    <span aria-label="exclamation mark">!</span>
                    <span aria-label="at symbol">@</span>{' '}
                    <span aria-label="hashtag">#</span>{' '}
                    <span aria-label="dollar sign">$</span>{' '}
                    <span aria-label="percent">%</span>
                  </div>
                </div>
                <FormTextField
                  label="Confirm Password"
                  type="password"
                  required
                  className="col-span-2"
                  isValid={validMatch}
                  isFocused={repeatPasswordFocus}
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  onFocus={() => setRepeatPasswordFocus(true)}
                  onBlur={() => setRepeatPasswordFocus(false)}
                />
                <div
                  className={
                    repeatPasswordFocus && !validMatch
                      ? 'relative col-span-full flex items-center gap-2 bg-slate-500 px-1 text-white'
                      : 'hidden'
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Must match the password input field.
                </div>
              </div>
              <Button
                className="w-full mt-8"
                color={`${
                  !validName || !validPassword || !validMatch ? 'gray' : 'cyan'
                }`}
                onClick={handleSignup}
                disabled={
                  !validName || !validPassword || !validMatch ? true : false
                }
              >
                Let's Go
              </Button>
              <p
                ref={errRef}
                className={`mt-2 text-center ${
                  errorMsg ? 'errormsg' : 'offscreen'
                }`}
                aria-live="assertive"
              >
                {errorMsg}
              </p>
            </div>
          </AuthLayout>
        </>
      )}
    </>
  )
}

export default Signup
