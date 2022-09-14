import axios from '../api/axios';
import {useState, useEffect} from 'react'
import { URL_RETRIEVE_QUESTION_ID } from '../constants';

const useFetchQuestionById = (questionId) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([])
  
    useEffect((questionId) => {
        const fetchData = async () =>{
          setLoading(true);
          try {
            const {data: response} = await axios.post(URL_RETRIEVE_QUESTION_ID,  {
                id: questionId
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
  
  export default useFetchQuestionById