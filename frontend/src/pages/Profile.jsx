import { useNavigate } from 'react-router-dom'
import {
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_SUCCESS,
  URL_USER_SERVICE,
  PASSWORD_REGEX,
  EMAIL_REGEX,
} from '../constants'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { Tooltip } from '@chakra-ui/react'
import { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { Helmet } from 'react-helmet-async'
import { getUserProfileUrl } from '../utils'

const Profile = () => {
  const { auth, setAuth } = useAuth()
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const toast = useToast()
  const navigate = useNavigate()
  const axiosPrivate = useAxiosPrivate()

  const [school, setSchool] = useState(auth.school)
  const [email, setEmail] = useState(auth.email)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')

  const updateAccountInfo = async (e) => {
    e.preventDefault()
    if (school === auth.school && email === auth.email) {
      toast({
        title: `Nothing to update!`,
        status: 'warning',
        isClosable: true,
      })
      return
    }
    if (!EMAIL_REGEX.test(email)) {
      toast({
        title: 'Invalid email!',
        status: 'error',
        isClosable: true,
      })
      return
    }
    const res = await axiosPrivate
      .put(URL_USER_SERVICE, {
        school,
        email,
      })
      .catch((err) => {
        if (err.response.status === STATUS_CODE_BAD_REQUEST) {
          console.log(err.response.data.message)
        } else {
          console.log('Server Error')
        }
      })
    if (res && res.status === STATUS_CODE_SUCCESS) {
      toast({
        title: `Account info changed!`,
        status: 'success',
        isClosable: true,
      })
      setAuth({
        ...auth,
        school,
        email,
      })
    }
  }

  const updateAccountPassword = async () => {
    if (newPassword !== repeatPassword) {
      toast({
        title: `New password doesn't match`,
        status: 'warning',
        isClosable: true,
      })
      return
    }
    if (!PASSWORD_REGEX.test(newPassword)) {
      toast({
        title: `New password not valid`,
        status: 'warning',
        isClosable: true,
      })
      return
    }
    const res = await axiosPrivate
      .put(URL_USER_SERVICE, {
        previousPassword: currentPassword,
        updatedPassword: newPassword,
      })
      .catch((err) => {
        if (err.response.status === STATUS_CODE_BAD_REQUEST) {
          console.log(err.response.data.message)
        } else {
          console.log('Server Error')
        }
      })
    if (res && res.status === STATUS_CODE_SUCCESS) {
      toast({
        title: `Account password changed!`,
        status: 'success',
        isClosable: true,
      })
      setTimeout(() => {
        setAuth({
          accessToken: '',
          username: '',
        })
      }, 2000)
      setTimeout(() => {
        navigate('/login')
      }, 4000)
    }
  }

  const deleteAccount = async () => {
    if (deleteConfirmation !== auth.username) {
      toast({
        title: `Username doesn't match`,
        status: 'error',
        isClosable: true,
      })
      return
    }
    const res = await axiosPrivate.delete(URL_USER_SERVICE).catch((err) => {
      if (err.response.status === STATUS_CODE_BAD_REQUEST) {
        console.log(err.response.data.message)
      } else {
        console.log('Server Error')
      }
    })
    if (res && res.status === STATUS_CODE_SUCCESS) {
      toast({
        title: `Account deleted!`,
        status: 'success',
        isClosable: true,
      })
      setTimeout(() => {
        setAuth({
          accessToken: '',
          username: '',
        })
      }, 2000)
      setTimeout(() => {
        navigate('/login')
      }, 4000)
    }
  }

  return (
    <form className="container max-w-2xl mx-auto mt-4 shadow-md md:w-3/4">
      <Helmet>
        <title>Profile | PeerPrep</title>
        <meta charSet="utf-8" />
        <meta name="description" content="PeerPrep help you prep" />
      </Helmet>
      <div className="p-4 bg-gray-100 border-t-2 rounded-lg bg-opacity-5">
        <div className="max-w-sm mx-auto md:mx-0 md:w-full">
          <div className="inline-flex items-center space-x-4">
            <img
              alt="profil"
              src={getUserProfileUrl(auth.username)}
              className="object-cover w-16 h-16 mx-auto rounded-full "
            />
            <h1>User Profile</h1>
          </div>
        </div>
      </div>
      <div className="space-y-6 bg-white">
        <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
          <h2 className="max-w-sm pl-3 mx-auto md:w-1/3">Account Username</h2>
          <div className="max-w-sm mx-auto md:w-2/3">
            <Tooltip
              hasArrow
              placement="top"
              label="Username cannot be modified"
              aria-label="Username cannot be modified"
            >
              <div className="relative ">
                <input
                  type="text"
                  disabled={true}
                  className="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-transparent border-gray-300 rounded-lg shadow-sm appearance-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder={auth.username}
                />
              </div>
            </Tooltip>
          </div>
        </div>
        <hr />
        <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
          <h2 className="max-w-sm pl-3 mx-auto md:w-1/3">Personal info</h2>
          <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
            <div>
              <div className="relative">
                <input
                  type="text"
                  id="school"
                  className="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-transparent border-gray-300 rounded-lg shadow-sm appearance-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="School"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  className="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-transparent border-gray-300 rounded-lg shadow-sm appearance-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600"
                  autoComplete="off"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full px-2 ml-auto text-center text-gray-500 md:w-3/12 ">
          <button
            onClick={(e) => updateAccountInfo(e)}
            className="px-6 py-2 text-base font-semibold text-center text-white transition duration-200 ease-in bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-200"
          >
            Update
          </button>
        </div>
        <hr />
        <div className="items-center w-full p-8 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
          <h2 className="max-w-sm mx-auto md:w-4/12">Change password</h2>
          <div className="flex flex-col w-full max-w-sm pl-2 mx-auto space-y-5 md:inline-flex md:w-7/12 md:pl-12">
            <div className="">
              <input
                type="password"
                id="current-password"
                value={currentPassword}
                autoComplete="off"
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="flex-1 w-full px-2 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-transparent border-gray-300 rounded-lg shadow-sm appearance-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Current Password"
              />
            </div>
            <div className="">
              <input
                type="password"
                id="new-password"
                value={newPassword}
                autoComplete="off"
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1 w-full px-2 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-transparent border-gray-300 rounded-lg shadow-sm appearance-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="New Password"
              />
            </div>
            <div className="">
              <input
                type="password"
                id="repeat-password"
                value={repeatPassword}
                autoComplete="off"
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="flex-1 w-full px-2 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-transparent border-gray-300 rounded-lg shadow-sm appearance-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Repeat New Password"
              />
            </div>
          </div>
          <div className="text-center md:w-3/12 md:pl-6">
            <button
              type="button"
              onClick={updateAccountPassword}
              className="w-full px-4 py-2 text-base font-semibold text-center text-white transition duration-200 ease-in bg-pink-600 rounded-lg shadow-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-pink-200 "
            >
              Change
            </button>
          </div>
        </div>
        <hr />
        <div className="items-center w-full p-8 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
          <h2 className="max-w-sm mx-auto md:w-4/12">Delete Account</h2>
          <div className="w-full max-w-sm pl-2 mx-auto space-y-5 md:inline-flex md:w-6/12 md:pl-7">
            <div className="relative">
              <input
                type="text"
                className="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-transparent border-gray-300 rounded-lg shadow-sm appearance-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Type Your Username"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
              />
            </div>
          </div>
          <div className="text-center md:w-3/12 md:pl-8">
            <button
              type="button"
              onClick={deleteAccount}
              className="py-2 text-base font-semibold text-center text-white transition duration-200 ease-in bg-red-600 rounded-lg shadow-md px-7 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-pink-200 "
            >
              Delete
            </button>
          </div>
        </div>
        <hr />
      </div>
    </form>
  )
}

export default Profile
