import { Peer } from 'peerjs'
import {
  AspectRatio,
  HStack,
  Button,
  ButtonGroup,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from 'react-icons/fa'
import { PEERJS_PATH, PEERJS_PORT } from '../../constants'

const VideoChat = ({ userId, otherUserId, roomId, socket }) => {
  const [isShowOther, setShowOther] = useState(false)
  const [isAudio, setAudio] = useState(false)
  const [isVideo, setVideo] = useState(false)
  const [peer, setPeer] = useState()
  const [myStream, setMyStream] = useState()
  const [otherStream, setOtherStream] = useState()
  const [otherCallerId, setOtherCallerId] = useState()
  const buttonColour = useColorModeValue('blackAlpha', 'gray')

  useEffect(() => {
    if (!peer) {
      console.log('You should only ever see me once!')
      // const time = new Date().getTime() / 60000
      const id = userId // + time
      console.log('userId: ', id)
      const newPeer = new Peer(id, {
        host: 'localhost',
        port: PEERJS_PORT,
        path: PEERJS_PATH,
        // proxied: true,
      })
      setPeer(newPeer)

      const selfVideo = document.getElementById('self')
      const getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia
      getUserMedia(
        { video: true, audio: true },
        (stream) => {
          stream.getVideoTracks()[0].enabled = isVideo
          stream.getAudioTracks()[0].enabled = isAudio
          console.log('my stream is set here: ', stream)
          setMyStream(stream)
          addVideoStream(selfVideo, stream)
          socket.emit()
          callOtherUser(otherUserId, stream)
        },
        (err) => {
          console.log('Failed to get local stream', err)
        }
      )
    }

    socket.on('user-connected', (id) => {
      callOtherUser(id, myStream)
    })

    socket.on('user-disconnected', (otherUserId) => {
      setUpOtherStream(null, false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myStream, peer, socket, userId])

  useEffect(() => {
    if (peer) {
      console.log('newPeer that is set in peer: ', peer)

      if (myStream && !otherStream) {
        callOtherUser(otherUserId, myStream)
      }

      peer.on(
        'call',
        (call) => {
          console.log('Hi, I just got a call, this is mystream: ', myStream)
          call.answer(myStream) // Answer the call with an A/V stream.
          call.on('stream', (remoteStream) => {
            // Show stream in some video/canvas element.
            console.log('remote stream from call', remoteStream)

            setUpOtherStream(remoteStream, true)
          })
        },
        (err) => {
          console.log('Failed to get local stream', err)
        }
      )
      peer.on('open', (userId) => {
        console.log('opened with: ', userId)
        socket.emit('join-room', { roomId, userId })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAudio, isVideo, myStream, peer, roomId, socket])

  // useEffect(() => {
  //   function checkIfOnline() {
  //     console.log('checking if other dude is there')
  //     if (!callOtherUser(otherUserId, myStream)) {
  //       setTimeout(checkIfOnline, 5000)
  //     }
  //   }
  //   if (!otherStream && peer && myStream) {
  //     console.log('other stream', otherStream)
  //     checkIfOnline()
  //   }
  // }, [myStream, otherStream, otherUserId, peer])

  const callOtherUser = (id, stream) => {
    console.log('callOtherUser: ID, stream, peer: ', id, stream, peer)
    const call = peer.call(id, stream)
    console.log('call: ', call)
    if (call) {
      call.on('stream', (remoteStream) => {
        console.log('received stream from other dude')
        setUpOtherStream(remoteStream, true)
      })
      return true
    }
    return false
  }

  const setUpOtherStream = (stream, isShow) => {
    setShowOther(isShow)

    // if (isShow) {
    // console.log('setUpOtherStream, showing')
    setOtherStream(stream)
    const otherVideo = document.getElementById('other')
    addVideoStream(otherVideo, stream)
    // }

    console.log(isShowOther)
  }

  function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
  }

  const toggleAudioVideo = (isAudio, isVideo) => {
    setAudio(isAudio)
    setVideo(isVideo)
    // const selfVideo = document.getElementById('self')
    const updatedStream = myStream
    updatedStream.getVideoTracks()[0].enabled = isVideo
    updatedStream.getAudioTracks()[0].enabled = isAudio
    setMyStream(updatedStream)
    callOtherUser(otherUserId, updatedStream)
  }

  return (
    <>
      <HStack spacing="5px" position="fixed" bottom={5} right={5} zIndex={1000}>
        <Stack spacing={-10} background="black" hidden={!isShowOther}>
          <AspectRatio w="200px" ratio={4 / 3}>
            <video id="other" autoPlay={true} />
          </AspectRatio>
          <ButtonGroup colorScheme={buttonColour} spacing="0">
            <Button
              width="full"
              onClick={() =>
                console.log(
                  'other dude audio',
                  otherStream && otherStream.getAudioTracks()
                )
              }
            >
              {otherStream && otherStream.getAudioTracks()[0] ? (
                <FaMicrophone />
              ) : (
                <FaMicrophoneSlash />
              )}
            </Button>
            <Button width="full">{otherUserId}</Button>
          </ButtonGroup>
        </Stack>
        <Stack spacing={-10} background="black">
          <AspectRatio w="200px" ratio={4 / 3}>
            <video id="self" muted={true} autoPlay={true} />
          </AspectRatio>
          <ButtonGroup colorScheme={buttonColour} spacing="0">
            <Button
              width="full"
              onClick={() => {
                toggleAudioVideo(!isAudio, isVideo)
              }}
            >
              {isAudio ? <FaMicrophone /> : <FaMicrophoneSlash />}
            </Button>
            <Button
              width="full"
              onClick={() => {
                console.log(myStream)
                toggleAudioVideo(isAudio, !isVideo)
              }}
            >
              {isVideo ? <FaVideo /> : <FaVideoSlash />}
            </Button>
          </ButtonGroup>
        </Stack>
      </HStack>
    </>
  )
}

export default VideoChat
