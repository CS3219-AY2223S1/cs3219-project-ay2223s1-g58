import MatchDialog from '../components/match/MatchDialog'
import { Helmet } from 'react-helmet-async'

const Match = () => {
  return (
    <div>
      <Helmet>
        <title>Match | PeerPrep</title>
        <meta charSet="utf-8" />
        <meta name="description" content="PeerPrep help you prep" />
      </Helmet>
      <main className="flex flex-col items-center justify-center h-full">
        <h1>Select your criterias and find a match within 30s!</h1>
        <br />
        <MatchDialog />
      </main>
    </div>
  )
}

export default Match
