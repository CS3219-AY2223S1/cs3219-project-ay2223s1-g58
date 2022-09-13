import axios from '../api/axios';
import { URL_USER_TOKEN } from '../constants';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.post(URL_USER_TOKEN);
        if (response.status === 200) {
            setAuth(prev => {
                return {
                    ...prev,
                    accessToken: response.data.data.accessToken,
                    username: response.data.data.username,
                    email: response.data.data.email,
                    school: response.data.data.school,
                    isLoggedIn: true
                }
            })
            return response.data.data.accessToken;
        }
        console.error(response.data.message);
        setAuth({
            accessToken: '',
            username: '',
            email: '',
            school: '',
            isLoggedIn: false
        })
        return null;
    }
    return refresh;
};

export default useRefreshToken;