import { AuthLayout } from '../components/AuthLayout'
import { Button } from '../components/Button'
import { TextField } from '../components/Fields'
import { useEffect, useRef, useState } from "react";
import axios from "../api/axios";
import {
    Typography
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { URL_USER_LOGIN, STATUS_CODE_CONFLICT, STATUS_CODE_SUCCESS } from "../constants";
import useAuth from '../hooks/useAuth';
import { ToastContainer, toast } from 'react-toastify';


function Login() {
    const { setAuth } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/";
    const errRef = useRef();

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errorMsg, setErrorMsg] = useState("");

    const handleLogin = async () => {
        const res = await axios.post(URL_USER_LOGIN, { username, password })
            .catch((err) => {
                if (err.response.status === STATUS_CODE_CONFLICT) {
                    setErrorMsg(err.response.data.message)
                } else {
                    setErrorMsg(err.response.data.message)
                }
            })
        if (res && res.status === STATUS_CODE_SUCCESS) {
            setAuth({ username, accessToken: res.data.data.accessToken })
            setUsername('')
            setPassword('')
            navigate(from, { replace: true })
        }
    }

    useEffect(() => {
        setErrorMsg('');
    }, [username, password])

    useEffect(() => {
        toast({ errorMsg });
    }, [errorMsg])
    return (<>
        <AuthLayout
            title="Sign in to account"
            subtitle={
                <>
                    Don’t have an account?{' '}
                    <a href="/register" className="text-cyan-600">
                        Sign up
                    </a>
                </>
            }
        >
            <div>
                <ToastContainer />
                <div className="space-y-6">
                    <TextField
                        label="Username"
                        value={username}
                        autoComplete="off"
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{ marginBottom: "1rem" }}
                        autoFocus
                        required
                    />
                    <TextField
                        label="Password"
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ marginBottom: "2rem" }}
                    />
                </div>
                <Button color="cyan" className="w-full mt-8" onClick={handleLogin}>
                    Sign in to account
                </Button>

                <Typography variant={"p"} marginBottom={"2rem"} ref={errRef} className={errorMsg ? "errormsg" : "offscreen"} aria-live="assertive">{errorMsg}</Typography>
            </div>
        </AuthLayout>
    </>

    )
}

export default Login;
