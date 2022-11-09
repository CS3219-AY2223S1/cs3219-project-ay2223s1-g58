import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-[#1A2238]">
      <Helmet>
        <title>404 | LeetWithFriend</title>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="An interview preparation platform and peer matching system, where students can find peers to practice whiteboard-style interview questions together."
        />
      </Helmet>
      <h1 className="font-extrabold tracking-widest text-white text-9xl">
        404
      </h1>
      <div className="absolute rotate-12 rounded bg-[#FF6A3D] px-2 text-sm">
        Page Not Found
      </div>
      <div className="group relative mt-5 inline-block text-sm font-medium text-[#FF6A3D] focus:outline-none focus:ring active:text-orange-500">
        <span className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] transition-transform group-hover:translate-y-0 group-hover:translate-x-0"></span>

        <span className="relative block border border-current bg-[#1A2238] px-8 py-3">
          <Link to="/home">Home</Link>
        </span>
      </div>
      <div className="group relative mt-5 inline-block text-sm font-medium text-[#FF6A3D] focus:outline-none focus:ring active:text-orange-500">
        <span className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] transition-transform group-hover:translate-y-0 group-hover:translate-x-0"></span>
        <span className="relative block border border-current bg-[#1A2238] px-8 py-3">
          <Link to="/login">Login</Link>
        </span>
      </div>
    </main>
  )
}

export default PageNotFound
