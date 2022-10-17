import { Peer } from 'peerjs'
import { AspectRatio, HStack, Button, ButtonGroup } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useState } from 'react'

const VideoChat = ({ userId, roomId, socket }) => {
  const [isShowOther, setShowOther] = useState(true)
  const [isAudio, setAudio] = useState(false)
  const [isVideo, setVideo] = useState(false)
  const [peer, setPeer] = useState()
  const [myStream, setMyStream] = useState()
  useEffect(() => {
    if (!peer) {
      const newPeer = new Peer(userId)
      setPeer(newPeer)
      // console.log(peer)
      const selfVideo = document.getElementById('self')
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          setMyStream(stream)
          addVideoStream(selfVideo, stream)
          stream.getAudioTracks()[0].enabled = isAudio
          stream.getVideoTracks()[0].enabled = isVideo

          newPeer.on('call', (call) => {
            console.log('call')
            call.answer(stream)
            const otherVideo = document.getElementById('other')
            call.on('stream', (userVideoStream) => {
              addVideoStream(otherVideo, userVideoStream)
            })
          })

          socket.on('user-connected', (otherUserId) => {
            // connectToNewUser(userId, stream, newPeer)
            console.log('user-connected: peer', newPeer)
            console.log('otherUserId', otherUserId)
            if (otherUserId !== userId) {
              const call = newPeer.call(otherUserId, stream)
              const video = document.getElementById('other')
              console.log(call)
              call.on('stream', (userVideoStream) => {
                addVideoStream(video, userVideoStream)
              })
            }
          })

          newPeer.on('open', (userId) => {
            console.log('opened')
            socket.emit('join-room', { roomId, userId })
          })
        })
    }
  }, [])

  //   const connectToNewUser = (userId, stream) => {
  //     console.log('connectToNewUser')
  //     const call = peer.call(userId, stream)
  //     const video = document.getElementById('other')
  //     call.on('stream', (userVideoStream) => {
  //       addVideoStream(video, userVideoStream)
  //     })
  //     // call.on('close', () => {
  //     //   video.remove()
  //     // })

  //     // peers[userId] = call
  //   }

  const addVideoStream = (video, stream) => {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
  }

  return (
    <>
      <HStack
        spacing="24px"
        sx={{
          position: '-webkit-sticky',
          //   /* Safari */ position: 'sticky',
          top: '0',
        }}
        //     h={300}
        //     w={1000}
        zIndex={100}
      >
        {isShowOther && (
          <AspectRatio w="200px" ratio={4 / 3}>
            <video id="other" />
          </AspectRatio>
        )}
        <AspectRatio w="200px" ratio={4 / 3}>
          <video id="self" muted={true} />
        </AspectRatio>
        <ButtonGroup variant="outline" spacing="6">
          <Button
            colorScheme="blue"
            onClick={() => {
              myStream.getAudioTracks()[0].enabled = !isAudio
              setAudio(!isAudio)
            }}
          >
            {isAudio ? 'Aud off' : 'Aud on'}
          </Button>
          <Button
            onClick={() => {
              console.log(myStream)
              myStream.getVideoTracks()[0].enabled = !isVideo
              setVideo(!isVideo)
            }}
          >
            {isVideo ? 'Vid off' : 'Vid on'}
          </Button>
        </ButtonGroup>
      </HStack>
    </>
  )
}

export default VideoChat
