import axios from '../api/axios';
import {useState, useEffect} from 'react'
import { URL_RETRIEVE_QUESTION } from '../constants';

const useFetchQuestion = (difficulty) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchData = async () =>{
          setLoading(true);
          try {
            const {data: response} = await axios.post(URL_RETRIEVE_QUESTION,  {
                difficulty: difficulty
              })
            setData(response);
            console.log(response)
          } catch (error) {
            console.error(error);
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
