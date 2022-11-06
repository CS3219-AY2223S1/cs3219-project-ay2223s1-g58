import useAuth from '../hooks/useAuth'
import { Helmet } from 'react-helmet-async'
import { SecondaryFeatures } from '../components/SecondaryFeatures'

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
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <main className="flex h-full flex-col items-center justify-center">
        <SecondaryFeatures username={auth.username} />
      </main>
    </div>
  )
}

export default Home
