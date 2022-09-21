import axios from '../api/axios';
import {useState, useEffect} from 'react'
import { URL_QUESTION_SERVICE } from '../constants';

const useFetchQuestionByDifficulty = (inputDifficulty) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([])

    useEffect( () => {
        const fetchData = async () =>{
          setLoading(true);
          try {
            const {data: response} = await axios.get(URL_QUESTION_SERVICE 
              + '?difficulty=' + (inputDifficulty ? inputDifficulty : 'medium'))
            setData(response);
            
          } catch (error) {
            //todo toast
            console.error(error);
          }
          setLoading(false);
        }
    
        fetchData();
      }, [inputDifficulty]);

    return {
        data,
        loading
    };
}

export default useFetchQuestionByDifficulty