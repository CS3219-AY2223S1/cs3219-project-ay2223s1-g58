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
import History from './pages/History.jsx'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* public routes */}
            <Route path="/login" element={<Login />} />
            <Route element={<PersistLogin />}>
              <Route path="/signup" element={<Signup />} />
            </Route>

            {/* private routes */}
            <Route element={<PersistLogin />}>
              <Route element={<RequireAuth />}>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/userTokenTest" element={<UserTokenTest />} />
                <Route path="/match" element={<Match />} />
                <Route path="/room/:roomId" element={<Room />} />
                <Route path="/history" element={<History />} />
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
