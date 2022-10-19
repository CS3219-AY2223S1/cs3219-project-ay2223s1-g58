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
import QuestionBank from './pages/QuestionBank'
import QuestionPage from './pages/QuestionPage'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/questions" element={<QuestionBank />} />
            <Route path="/question/:questionId" element={<QuestionPage />} />
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
