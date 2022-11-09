import { useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { URL_USER_TOKEN_TEST } from "../constants";
import useAuth from "../hooks/useAuth";

const Users = () => {
    const { auth } = useAuth()
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {

        const testToken = async () => {
            try {
                const response = await axiosPrivate.post(URL_USER_TOKEN_TEST);
                console.log(response.data);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        testToken();
    }, [axiosPrivate, navigate, location]);

    return (
        <article>
            <h2>User Token Test</h2>
            {auth.username?.length
                ? (
                    <ul>
                        <p>{auth?.username}</p>
                    </ul>
                ) : <p>User not ready</p>
            }
        </article>
    );
};

export default Users;