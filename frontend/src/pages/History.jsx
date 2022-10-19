import useAuth from '../hooks/useAuth'
import { Helmet } from 'react-helmet-async'
import { useState, useEffect } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { URL_HISTORY_USER, STATUS_CODE_BAD_REQUEST, STATUS_CODE_SUCCESS } from '../constants'
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Spinner, Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const History = () => {
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()
  const [hist, setHist] = useState([])
  const [isValid, setIsValid] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHist = async () => {
      const res = await axiosPrivate
        .get(`${URL_HISTORY_USER}/${auth.username}`)
        .catch((e) => {
          if (e.response.status === STATUS_CODE_BAD_REQUEST) {
            setIsValid(false) // no username given
            return setIsLoading(false)
          }
        })
      if (res && res.status === STATUS_CODE_SUCCESS) {
        setHist(res.data.data)
        setIsValid(true)
        setIsLoading(false)
      }
    }
    fetchHist()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getHelmet = () => {
    return (
      <Helmet>
        <title>History | PeerPrep</title>
        <meta charSet="utf-8" />
        <meta name="description" content="PeerPrep help you prep" />
      </Helmet>
    )
  }

  return (
    <>
      {getHelmet()}

      <main className="flex h-full flex-col items-center justify-start">
        {isLoading && (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
          />
        )}
        
        {!isLoading && !isValid ? (
          <h1>Unable to retrieve your learning history</h1>
        ) : (
          <HistTable questions={hist} />
        )}
      </main>
    </>
  )
}

const HistTable = ({ questions }) => {
  const navigate = useNavigate()
  return (
    <TableContainer overflowY='auto' whiteSpace='pre-wrap' maxHeight='100vh'>
      <Table variant='striped' className='max-w-full table-fixed'>
        <Thead className='sticky top-0 bg-blue-200 dark:bg-blue-900'>
          <Tr>
            <Th className='w-1/6'>Partner</Th>
            <Th className='w-1/5'>Question id</Th>
            <Th className='w-1/2'>Answer</Th>
            <Th>Completed at</Th>
          </Tr>
        </Thead>
        <Tbody>
          {questions.map((q, idx) => {
            return (
              <Tr key={q.roomId + q.id + idx} className='text-gray-700 dark:text-gray-300'>
                <Td>{q.partner}</Td>
                <Td>
                  <Button
                    variant='link'
                    onClick={() => navigate(`/question/${q.id}`)}
                    className='dark:text-gray-500'
                  >
                      {q.name}
                  </Button>
                </Td>
                <Td className='font-mono text-sm'>{q.answer}</Td>
                <Td>
                  {new Date(q.completedAt).toLocaleString('en-GB', {
                    hour12: 'true',
                    dateStyle: 'medium',
                    timeStyle: 'medium',
                  })}
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default History
