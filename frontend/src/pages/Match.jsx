import MatchDialog from '../components/match/MatchDialog'

const Match = () => {
  return (
    <div>
      <main className="flex flex-col items-center justify-center h-full">
        <h1>Select your criterias and find a match within 30s!</h1>
        <br />
        <MatchDialog />
      </main>
    </div>
  )
}

export default Match
