import axios from '../api/axios'
import {useState, useEffect} from 'react'

const useFetchQuestion = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchData = async () =>{
          setLoading(true);
          try {
            const {data: response} = await axios.get('http://localhost:8500/api/v1/question/difficulty', { params: { difficulty: 'easy' } })
            setData(response);
          } catch (error) {
            console.error(error.message);
          }
          setLoading(false);
        }
    
        fetchData();
      }, []);

    return {
        data,
        loading
    };
}

export default useFetchQuestion
