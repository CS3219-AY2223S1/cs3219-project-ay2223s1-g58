import {
    Box,
    Button,
    TextField,
    Typography
} from "@mui/material";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { URL_USER_SERVICE } from "../constants";
import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED } from "../constants";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

function Signup() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState('');

    const [validName, setValidName] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [validMatch, setValidMatch] = useState(false);

    const [usernameFocus, setUsernameFocus] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);
    const [repeatPasswordFocus, setRepeatPasswordFocus] = useState(false);

    const [success, setSuccess] = useState(false);

    const errRef = useRef();

    const handleSignup = async () => {
        const v1 = USER_REGEX.test(username);
        const v2 = PASSWORD_REGEX.test(password);
        if (!v1 || !v2) {
            setErrorMsg("Invalid Entry");
            return;
        }
        const res = await axios.post(URL_USER_SERVICE, { username, password })
            .catch((err) => {
                console.log(err.response.data.message);
                if (err.response.status === STATUS_CODE_CONFLICT) {
                    setErrorMsg('This username already exists')
                } else {
                    setErrorMsg('Please try again later')
                }
            })
        if (res && res.status === STATUS_CODE_CREATED) {
            setSuccess(true);
            setUsername('');
            setPassword('');
            setRepeatPassword('');
        }
    }
    useEffect(() => {
        setValidName(USER_REGEX.test(username));
    }, [username])

    useEffect(() => {
        setValidPassword(PASSWORD_REGEX.test(password));
        setValidMatch(password === repeatPassword);
    }, [password, repeatPassword])

    useEffect(() => {
        setErrorMsg('');
    }, [username, password, repeatPassword])

    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="/login">Login</a>
                    </p>
                </section>
            ) : (
                <Box display={"flex"} flexDirection={"column"} width={"30%"}>
                    <Typography variant={"h3"} marginBottom={"2rem"}>Sign Up</Typography>
                    <label htmlFor="username">
                        <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validName || !username ? "hide" : "invalid"} />
                    </label>
                    <TextField
                        label="Username"
                        variant="standard"
                        autoComplete="off"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{ marginBottom: "1rem" }}
                        autoFocus
                        onFocus={() => setUsernameFocus(true)}
                        onBlur={() => setUsernameFocus(false)}
                    />
                    <p id="uidnote" className={usernameFocus && username && !validName ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        4 to 24 characters.<br />
                        Must begin with a letter.<br />
                        Letters, numbers, underscores, hyphens allowed.
                    </p>
                    <label htmlFor="password">
                        <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validPassword || !password ? "hide" : "invalid"} />
                    </label>
                    <TextField
                        label="Password"
                        variant="standard"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ marginBottom: "2rem" }}
                        onFocus={() => setPasswordFocus(true)}
                        onBlur={() => setPasswordFocus(false)}
                    />
                    <p className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        8 to 24 characters.<br />
                        Must include uppercase and lowercase letters, a number and a special character.<br />
                        Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                    </p>
                    <TextField
                        label="Confirm Password"
                        variant="standard"
                        type="password"
                        required
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        sx={{ marginBottom: "2rem" }}
                        onFocus={() => setRepeatPasswordFocus(true)}
                        onBlur={() => setRepeatPasswordFocus(false)}
                    />
                    <p className={repeatPasswordFocus && !validMatch ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must match the first password input field.
                    </p>
                    <Box display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
                        <Button variant={"outlined"} onClick={handleSignup} disabled={!validName || !validPassword || !validMatch ? true : false}>Sign up</Button>
                    </Box>
                    <p>
                        Already registered?<br />
                        <span className="line">
                            <Link to="/Login">Login</Link>
                        </span>
                    </p>
                    <Typography variant={"p"} marginBottom={"2rem"} ref={errRef} className={errorMsg ? "errormsg" : "offscreen"} aria-live="assertive">{errorMsg}</Typography>
                </Box>
            )}
        </>
    )
}

export default Signup;
