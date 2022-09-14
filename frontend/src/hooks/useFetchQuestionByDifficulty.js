import axios from '../api/axios';
import {useState, useEffect} from 'react'
import { URL_RETRIEVE_QUESTION_DIFFICULTY } from '../constants';

const useFetchQuestionByDifficulty = (inputDifficulty) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchData = async () =>{
          setLoading(true);
          try {
            const {data: response} = await axios.post(URL_RETRIEVE_QUESTION_DIFFICULTY,  {
                difficulty: inputDifficulty || 'medium'
              })
            setData(response);
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

export default useFetchQuestionByDifficulty