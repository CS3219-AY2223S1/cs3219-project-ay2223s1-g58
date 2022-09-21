import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import PageNotFound from './pages/PageNotFound'
import Home from './pages/Home'
import UserTokenTest from './pages/UserTokenTest'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import Profile from './pages/Profile'
import PersistLogin from './components/PersistLogin'
import Match from './pages/Match'
import Room from './pages/Room'
import MatchTest from './pages/MatchTest'
import Collaboration from './pages/Collaboration'


// Text to simulate question. This should be provided 
// by the Question Service once it is ready. 
let veryLongText = "Hello World "
for (let i = 0; i < 1000; i++) {
  veryLongText += "Hello World "
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* public routes */}
            <Route element={<PersistLogin />}>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
            </Route>

            {/* private routes */}
            <Route element={<PersistLogin />}>
              <Route element={<RequireAuth />}>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/userTokenTest" element={<UserTokenTest />} />
                <Route path="/match" element={<Match />} />
                <Route path="/room" element={<Room />} />
                <Route path="/match/test" element={<MatchTest />} />
                <Route path="/room/:docID" element={<Collaboration questionText={veryLongText}/>} />
              </Route>
            </Route>
            {/* 404 */}
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
