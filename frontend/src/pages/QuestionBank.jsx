import React, { useMemo } from "react";
import { Badge, Button, TableContainer } from '@chakra-ui/react'
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionTable from '../components/QuestionTable';
import { AuthLayout } from '../components/AuthLayout';
import TypesStack from '../components/TypesStack';
import axios from '../api/axios';
import { URL_QUESTION_SERVICE } from '../constants';


const difficultyColorMap = new Map([
    ['easy', 'green'],
    ['medium', 'orange'],
    ['hard', 'red'],
  ])




const QuestionBank = () => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState()
    const navigate = useNavigate()
    useEffect( () => {
        const fetchData = async () =>{
            setLoading(true);
            try {
            const {data:response} = await axios.get(URL_QUESTION_SERVICE 
                + '/allQuestions')
            setData(response.questions);
            
            } catch (error) {
            //todo toast
            console.error(error);
            }
            setLoading(false);
        }
        if (!data) {
            fetchData();
        }  
        });



    const columns = useMemo(
        () => [
            {
            Header: "Title",
            accessor: (row) => row,
            Cell: ({cell: { value }}) => <Button variant='link' fontWeight='bold' color='gray.600' onClick={() => navigate('/question/' + value.id)}> {value.id + ". " + value.name} </Button>
            },
            {
            Header: "Types",
            accessor: "Category.types",
            Cell: ({cell: { value }}) => TypesStack(value)
            },
            {
            Header: "Difficulty",
            accessor: "Category.difficulty",
            Cell: ({ cell: { value }}) =>  <Badge fontWeight='bold' color='gray.600' borderRadius='full' px='2' colorScheme={difficultyColorMap.get(value)}>
                {value}
                </Badge>
            }
        ],
        []
    );

    return (
        (!loading) ? (
        <TableContainer overflowY='auto' maxHeight='100%'>
        <QuestionTable columns={columns} data={data} />
        </TableContainer>)
        : <AuthLayout title="Retrieving question...">
        <div className="text-xl text-center">
        </div>
    </AuthLayout>
    );
}

export default QuestionBank
