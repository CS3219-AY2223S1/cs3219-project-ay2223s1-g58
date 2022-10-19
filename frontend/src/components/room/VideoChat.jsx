import { Peer } from 'peerjs'
import {
  AspectRatio,
  HStack,
  Button,
  ButtonGroup,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react'
import { useEffect } from 'react'
import { useState } from 'react'
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from 'react-icons/fa'

const VideoChat = ({ userId, otherUserId, roomId, socket }) => {
  const [isShowOther, setShowOther] = useState(true)
  const [isAudio, setAudio] = useState(false)
  const [isVideo, setVideo] = useState(false)
  const [peer, setPeer] = useState()
  const [myStream, setMyStream] = useState()
  const [otherStream, setOtherStream] = useState()
  const buttonColour = useColorModeValue('blackAlpha', 'gray')
  useEffect(() => {
    if (!peer) {
      console.log('userId: ', userId)
      const newPeer = new Peer(userId)
      setPeer(newPeer)
      console.log('newPeer: ', newPeer)
      const selfVideo = document.getElementById('self')
      const otherVideo = document.getElementById('other')
      const getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia
      getUserMedia(
        { video: true, audio: isAudio },
        function (stream) {
          stream.getVideoTracks()[0].enabled = isVideo
          setMyStream(stream)
          selfVideo.srcObject = stream
          console.log('hi over here', stream.getVideoTracks())
          const call = newPeer.call(otherUserId, stream)
          call.on('stream', function (remoteStream) {
            // Show stream in some video/canvas element.
            setUpOtherStream(remoteStream, true)
            otherVideo.srcObject = remoteStream
          })
          console.log('otheruser: ', otherUserId)

          socket.on('user-connected', (otherUserId) => {
            console.log('user-connected: peer', newPeer)
            console.log('otherUserId', otherUserId)
            const call = newPeer.call(otherUserId, stream)
            call.on('stream', function (remoteStream) {
              console.log('user connected and called back')
              setUpOtherStream(remoteStream, true)
              console.log(remoteStream)
              otherVideo.srcObject = remoteStream
            })
          })

          socket.on('user-disconnected', (otherUserId) => {
            console.log('user-disconnected: peer', peer)
            console.log('otherUserId', otherUserId)
            setUpOtherStream(null, false)
            otherVideo.srcObject = null
          })
        },
        function (err) {
          console.log('Failed to get local stream', err)
        }
      )
      newPeer.on('call', function (call) {
        getUserMedia(
          { video: true, audio: isAudio },
          function (stream) {
            console.log('Hi, I just got a call')
            stream.getVideoTracks()[0].enabled = isVideo
            call.answer(stream) // Answer the call with an A/V stream.
            call.on('stream', function (remoteStream) {
              // Show stream in some video/canvas element.
              console.log('remote stream from call', remoteStream)
              otherVideo.srcObject = remoteStream
              setUpOtherStream(remoteStream, true)
            })
          },
          function (err) {
            console.log('Failed to get local stream', err)
          }
        )
      })
      newPeer.on('close', function () {
        console.log('close')
      })
      newPeer.on('open', (userId) => {
        console.log('opened with: ', userId)
        socket.emit('join-room', { roomId, userId })
      })
    }
  }, [isAudio, isVideo, otherUserId, peer, roomId, socket, userId])

  const setUpOtherStream = (stream, isShow) => {
    setOtherStream(stream)
    setShowOther(isShow)
  }

  const toggleAudioVideo = (isAudio, isVideo) => {
    setAudio(isAudio)
    setVideo(isVideo)
    const selfVideo = document.getElementById('self')
    const getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia
    console.log('toggleAudioVideo')
    getUserMedia(
      { video: true, audio: isAudio },
      function (stream) {
        console.log('toggleAudioVideo send new stream isVideo', isVideo)
        stream.getVideoTracks()[0].enabled = isVideo
        setMyStream(stream)
        selfVideo.srcObject = stream
        peer.call(otherUserId, stream)
      },
      function (err) {
        console.log('Failed to get local stream', err)
      }
    )
  }

  return (
    <>
      <HStack spacing="5px" position="fixed" bottom={5} right={5} zIndex={1000}>
        {isShowOther && (
          <Stack spacing={-10} background="black">
            <AspectRatio w="200px" ratio={4 / 3}>
              <video id="other" autoPlay={true} />
            </AspectRatio>
            <ButtonGroup colorScheme={buttonColour} spacing="0">
              <Button width="full">
                {otherStream && otherStream.getAudioTracks().length > 0 ? (
                  <FaMicrophone />
                ) : (
                  <FaMicrophoneSlash />
                )}
              </Button>
              <Button width="full">{otherUserId}</Button>
            </ButtonGroup>
          </Stack>
        )}
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
