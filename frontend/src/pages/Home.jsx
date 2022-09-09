import useAuth from '../hooks/useAuth'

const Home = () => {
  const { auth } = useAuth()

  return (
    <div>
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
