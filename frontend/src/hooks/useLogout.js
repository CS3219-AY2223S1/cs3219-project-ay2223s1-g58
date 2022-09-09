import { useNavigate } from "react-router-dom";
import { STATUS_CODE_SUCCESS, URL_USER_LOGOUT } from "../constants";
import useAuth from "./useAuth";
import useAxiosPrivate from "./useAxiosPrivate";

const useLogout = () => {
    const { setAuth } = useAuth();
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()

    const logout = async () => {
        try {
            const res = await axiosPrivate.post(URL_USER_LOGOUT, {
                withCredentials: true
            }).catch((err) => {
                console.log(err.response.data.message)
            })
            if (res && res.status === STATUS_CODE_SUCCESS) {
                setAuth({
                    accessToken: '',
                    username: '',
                })
                navigate('/login')
            }
        } catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogout