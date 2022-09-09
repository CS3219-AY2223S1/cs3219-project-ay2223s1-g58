import axios from 'axios';

axios.defaults.withCredentials = true

export default axios.create({
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

