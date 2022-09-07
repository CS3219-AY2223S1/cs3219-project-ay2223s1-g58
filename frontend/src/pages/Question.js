import {
    Box,
    Button,
    Grid,
    TextField,
    Typography
} from "@mui/material";

import { useEffect, useRef, useState } from "react";
import axios from "../api/axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { URL_USER_LOGIN, STATUS_CODE_CONFLICT, STATUS_CODE_SUCCESS } from "../constants";


function Login() {
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/";
    const errRef = useRef();

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

    return (
        <Box display={"flex"} flexDirection={"column"} width={"30%"} >
            <Typography variant={"h3"} marginBottom={"2rem"}>Login</Typography>
            <TextField
                label="Username"
                variant="standard"
                value={username}
                autoComplete="off"
                onChange={(e) => setUsername(e.target.value)}
                sx={{ marginBottom: "1rem" }}
                autoFocus
                required
            />
            <TextField
                label="Password"
                variant="standard"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ marginBottom: "2rem" }}
                required
            />
            <Box display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
                <Button variant={"outlined"} onClick={handleLogin}>Login</Button>
            </Box>
            <Grid container>
                <Grid item xs>
                    <Link to="/signup" variant="body2">
                        Forgot password?
                    </Link>
                </Grid>
                <Grid item>
                    <Link to="/signup" variant="body2">
                        {"Don't have an account? Sign Up"}
                    </Link>
                </Grid>
            </Grid>
            <Typography variant={"p"} marginBottom={"2rem"} ref={errRef} className={errorMsg ? "errormsg" : "offscreen"} aria-live="assertive">{errorMsg}</Typography>
        </Box>
    )
}

export default Login;
