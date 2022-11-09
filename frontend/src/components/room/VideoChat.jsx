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
import { PEERJS_PATH, PEERJS_PORT, PEERJS_HOST } from '../../constants'
import { useRef } from 'react'

const VideoChat = ({ userId, otherUserId, roomId, socket }) => {
  const [isShowOther, setShowOther] = useState(false)
  const isAudioRef = useRef(false)
  const [isAudio, setAudio] = useState(false)
  const [isVideo, setVideo] = useState(false)
  const [isOtherAudio, setOtherAudio] = useState(false)
  const [connection, setConnection] = useState()
  const peer = useRef(null)
  const [myStream, setMyStream] = useState()
  const [otherStream, setOtherStream] = useState()
  const buttonColour = useColorModeValue('blackAlpha', 'gray')
  const selfVideo = useRef()
  const otherVideo = useRef()

  useEffect(() => {
    if (!peer.current || peer.current.destroyed) {
      peer.current = new Peer(userId, {
        host: PEERJS_HOST,
        port: PEERJS_PORT,
        path: PEERJS_PATH,
      })

      peer.current.on('open', (userId) => {
        console.log('opened with: ', userId)
        socket.emit('join-room', { roomId, userId })
      })

      peer.current.on('close', () => {
        console.log('other person closed: ', userId)
        setUpOtherStream(null, false)
      })

      peer.current.on('error', (e) => {
        console.log('peer error', e)
      })

      socket.on('user-disconnected', (otherUserId) => {
        console.log('user-disconnected: peer', peer.current)
        console.log('otherUserId', otherUserId)
        setUpOtherStream(null, false)
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
          isAudioRef.current = false
          const videoTrack = stream
            .getTracks()
            .find((track) => track.kind === 'video')
          videoTrack.enabled = isVideo

          const audioTrack = stream
            .getTracks()
            .find((track) => track.kind === 'audio')
          audioTrack.enabled = isAudioRef.current
          setMyStream(stream)
          selfVideo.current.srcObject = stream
          callOtherUser(otherUserId, stream)

          peer.current.on(
            'call',
            (call) => {
              console.log('Hi, I just got a call, this is mystream: ', stream)
              call.answer(stream) // Answer the call with an A/V stream.
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

          peer.current.on(
            'connection',
            (conn) => {
              console.log('Hi, I just got a connection')
              console.log('connect', conn)
              setConnection(conn)

              conn.on('error', function (err) {
                console.log('error')
              })

              conn.on('open', () => {
                // Send messages
                console.log('audio video', isAudioRef.current, isVideo)
                if (conn) {
                  conn.send({ isAudio: isAudioRef.current, isVideo })
                }
              })

              // Receive messages
              conn.on('data', function (data) {
                console.log('Received', data)
                setOtherAudio(data.isAudio)
              })
            },
            (err) => {
              console.log('Connection err', err)
            }
          )
        },
        (err) => {
          console.log('Failed to get local stream', err)
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVideo, myStream, otherUserId, roomId, socket, userId])

  useEffect(() => {
    if (peer.current) {
      console.log('newPeer that is set in peer: ', peer.current)

      if (myStream && !otherStream) {
        callOtherUser(otherUserId, myStream, peer.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myStream, otherStream, otherUserId])

  useEffect(() => {
    return () => {
      if (peer.current) {
        peer.current.disconnect()
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
      return
    }

    const call = peer.current.call(
      id,
      providedStream ? providedStream : myStream
    )

    if (call) {
      call.on('stream', (remoteStream) => {
        console.log('received stream from other dude')
        setUpOtherStream(remoteStream, true)
      })
    }

    const conn = peer.current.connect(id)
    if (conn) {
      console.log('connect', conn)
      setConnection(conn)

      conn.on('error', function (err) {
        console.log('conection error: ', err)
      })

      conn.on('open', function () {
        conn.send({ isAudio: isAudioRef.current, isVideo })
      })

      conn.on('data', function (data) {
        console.log('Received', data)
        setOtherAudio(data.isAudio)
      })
    }
  }

  const setUpOtherStream = (stream, isShow) => {
    setShowOther(isShow)
    setOtherStream(stream)
    if (otherVideo.current) {
      otherVideo.current.srcObject = stream
    }
  }

  const toggleAudioVideo = (isAudioEnabled, isVideoEnabled) => {
    isAudioRef.current = isAudioEnabled
    setAudio(isAudioEnabled)
    setVideo(isVideoEnabled)
    console.log('toggleAudioVideo, stream:', myStream)

    const videoTrack = myStream
      .getTracks()
      .find((track) => track.kind === 'video')
    console.log('videoTracks: ', myStream.getTracks())
    videoTrack.enabled = isVideoEnabled

    const audioTrack = myStream
      .getTracks()
      .find((track) => track.kind === 'audio')
    audioTrack.enabled = isAudioEnabled

    setMyStream(myStream)

    if (connection) {
      connection.send({ isAudio: isAudioEnabled, isVideo: isVideoEnabled })
    }
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
              onClick={() => {
                console.log(
                  'other dude audio',
                  otherStream && otherStream.getAudioTracks()
                )
                console.log(
                  'other video',
                  otherStream && otherStream.getVideoTracks()
                )
                console.log('other stream tracks', otherStream.getTracks())
              }}
            >
              {isOtherAudio ? <FaMicrophone /> : <FaMicrophoneSlash />}
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
                toggleAudioVideo(!isAudioRef.current, isVideo)
              }}
            >
              {isAudio ? <FaMicrophone /> : <FaMicrophoneSlash />}
            </Button>
            <Button
              width="full"
              onClick={() => {
                console.log(myStream)
                toggleAudioVideo(isAudioRef.current, !isVideo)
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
