import axios from '../api/axios';
import {useState, useEffect} from 'react'
import { URL_QUESTION_SERVICE } from '../constants';

const useFetchQuestionById = (questionId) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([])
  
    useEffect(() => {
        const fetchData = async () =>{
          setLoading(true);
          try {
            const {data: response} = await axios.get(URL_QUESTION_SERVICE + '?id=' + (questionId ? questionId : '1'))
            setData(response);
            setLoading(false);
          } catch (error) {
            console.error(error);
          }
        }
        fetchData();
      }, [questionId]);
  
    return {
        data,
        loading
    };
  }
  
  export default useFetchQuestionById