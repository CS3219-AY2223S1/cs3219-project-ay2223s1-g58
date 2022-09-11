import axios from '../api/axios';
import { URL_USER_TOKEN } from '../constants';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.post(URL_USER_TOKEN);
        setAuth(prev => {
            return {
                ...prev,
                username: response.data.data.username,
                email: response.data.data.email,
                school: response.data.data.school,
                accessToken: response.data.data.accessToken
            }
        });
        return response.data.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;