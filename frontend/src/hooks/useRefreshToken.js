import axios from '../api/axios';
import { URL_USER_TOKEN } from '../constants';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();

    const refresh = async () => {
        let response;
        if (auth.accessToken !== '') {
            response = await axios.post(URL_USER_TOKEN,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.accessToken}`
                    }
                }
            );
        } else {
            response = await axios.post(URL_USER_TOKEN);
        }
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