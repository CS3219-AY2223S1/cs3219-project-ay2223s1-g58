import useAuth from '../hooks/useAuth'
import { Helmet } from 'react-helmet-async'

const Home = () => {
  const { auth } = useAuth()

  return (
    <div>
      <Helmet>
        <title>Home | LeetWithFriend</title>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="An interview preparation platform and peer matching system, where students can find peers to practice whiteboard-style interview questions together."
        />
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
