import { useNavigate, Link } from "react-router-dom";
import { STATUS_CODE_CONFLICT, STATUS_CODE_SUCCESS, URL_USER_LOGOUT } from "../constants";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Home = () => {
    const { setAuth } = useAuth()
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const logout = async () => {
        const res = await axiosPrivate.post(URL_USER_LOGOUT)
            .catch((err) => {
                if (err.response.status === STATUS_CODE_CONFLICT) {
                    console.log(err.response.data.message)
                } else {
                    console.log(err.response.data.message)
                }
            })
        if (res && res.status === STATUS_CODE_SUCCESS) {
            setAuth({});
            navigate('/login');
        }
    }

    return (
        <section>
            <h1>Home</h1>
            <br />
            <p>You are logged in!</p>
            <br />
            <Link to="/login">Go to the Login page</Link>
            <br />
            <Link to="/signup">Go to the Signup page</Link>
            <br />
            <br />
            <div className="flexGrow">
                <button onClick={logout}>Sign Out</button>
            </div>
        </section>
    )
}

export default Home