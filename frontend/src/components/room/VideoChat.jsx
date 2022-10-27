import { Peer } from 'peerjs'
import {
  AspectRatio,
  HStack,
  Button,
  ButtonGroup,
  Stack,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from 'react-icons/fa'
import { PEERJS_PATH, PEERJS_PORT } from '../../constants'
import { useRef } from 'react'
// userid1 is initiator
const VideoChat = ({ userId, otherUserId, roomId, socket }) => {
  const toast = useToast()
  const [isShowOther, setShowOther] = useState(false)
  const [isAudio, setAudio] = useState(false)
  const [isVideo, setVideo] = useState(false)
  const [audioChannel, setAudioChannel] = useState()
  const peer = useRef(null)
  const [myStream, setMyStream] = useState()
  const [otherStream, setOtherStream] = useState()
  const buttonColour = useColorModeValue('blackAlpha', 'gray')
  const selfVideo = useRef()
  const otherVideo = useRef()

  useEffect(() => {
    if (!peer.current || peer.current.destroyed) {
      console.log('You should only ever see me once!')
      peer.current = new Peer(userId, {
        host: 'localhost',
        port: PEERJS_PORT,
        path: PEERJS_PATH,
        // proxied: true,
      })
    }

    if (!myStream) {
      const getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia
      getUserMedia(
        { video: true, audio: true },
        (stream) => {
          setAudioChannel(stream.getAudioTracks()[0])
          stream.getVideoTracks()[0].enabled = isVideo
          if (!isAudio) {
            stream.removeTrack(stream.getAudioTracks()[0])
          }
          setMyStream(stream)
          selfVideo.current.srcObject = stream
          callOtherUser(otherUserId, stream)
        },
        (err) => {
          console.log('Failed to get local stream', err)
        }
      )
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myStream, peer.current, socket, userId])

  useEffect(() => {
    if (peer.current) {
      console.log('newPeer that is set in peer: ', peer.current)

      if (myStream && !otherStream) {
        callOtherUser(otherUserId, myStream, peer.current)
      }

      peer.current.on(
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

      peer.current.on('open', (userId) => {
        console.log('opened with: ', userId)
        socket.emit('join-room', { roomId, userId })
      })

      peer.current.on('close', () => {
        console.log('ohter person closed: ', userId)
      })

      peer.current.on('error', (e) => {
        console.log('on error', e)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAudio, isVideo, myStream, peer, roomId, socket])

  useEffect(() => {
    return () => {
      if (peer.current) {
        peer.current.destroy()
        console.log('cleaned up')
      }
    }
  }, [])

  const callOtherUser = (id, providedStream) => {
    console.log(
      'callOtherUser: ID, providestream, mystream, peer: ',
      id,
      providedStream,
      myStream,
      peer.current
    )
    if (!peer.current) {
      console.log('no peer yet')
      return false
    }
    console.log(
      'stream.getVideoTracks()[0]',
      providedStream
        ? providedStream.getVideoTracks()[0]
        : myStream.getVideoTracks()[0]
    )
    const call = peer.current.call(
      id,
      providedStream ? providedStream : myStream
    )
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
    setOtherStream(stream)
    otherVideo.current.srcObject = stream
  }

  const toggleAudioVideo = (isAudio, isVideo) => {
    setAudio(isAudio)
    setVideo(isVideo)
    myStream.getVideoTracks()[0].enabled = isVideo
    if (isAudio) {
      myStream.addTrack(audioChannel)
    } else {
      myStream.removeTrack(audioChannel)
    }
    setMyStream(myStream)
    callOtherUser(otherUserId, myStream)
  }

  return (
    <>
      <HStack spacing="5px" position="fixed" bottom={5} right={5} zIndex={1000}>
        <Stack spacing={-10} background="black" hidden={!isShowOther}>
          <AspectRatio w="200px" ratio={4 / 3}>
            <video
              id="other"
              ref={otherVideo}
              autoPlay={true}
              playsInline={true}
            />
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
            <video
              id="self"
              ref={selfVideo}
              muted={true}
              autoPlay={true}
              playsInline={true}
            />
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
