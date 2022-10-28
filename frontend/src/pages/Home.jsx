import useAuth from '../hooks/useAuth'
import { Helmet } from 'react-helmet-async'
import { SecondaryFeatures } from '../components/SecondaryFeatures'

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
        <SecondaryFeatures username={auth.username} />
      </main>
    </div>
  )
}

export default Home
