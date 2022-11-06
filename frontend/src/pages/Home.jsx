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
      </Helmet>
      <main className="flex flex-col items-center justify-center h-full">
        <SecondaryFeatures username={auth.username} />
      </main>
    </div>
  )
}

export default Home
