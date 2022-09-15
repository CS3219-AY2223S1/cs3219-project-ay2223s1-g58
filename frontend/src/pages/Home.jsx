import useAuth from '../hooks/useAuth'
import { Helmet } from 'react-helmet-async'

const Home = () => {
  const { auth } = useAuth()

  return (
    <div>
      <Helmet>
        <title>Home | PeerPrep</title>
        <meta charSet="utf-8" />
        <meta name="description" content="PeerPrep help you prep" />
      </Helmet>
      <main className="flex flex-col items-center justify-center h-full">
        <h1>Home</h1>
        <br />
        <p>Username: {auth.username}</p>
        <p>You are logged in!</p>
        <br />
        <br />
      </main>
    </div>
  )
}

export default Home
