import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Home from "./pages/Home";
import UserTokenTest from "./pages/UserTokenTest";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        {/* public routes */}
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />

                        {/* private routes */}
                        <Route element={<RequireAuth />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/userTokenTest" element={<UserTokenTest />} />
                        </Route>

                        {/* 404 */}
                        <Route path="*" element={<PageNotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
