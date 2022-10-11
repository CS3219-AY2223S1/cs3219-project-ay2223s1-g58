import useAuth from '../hooks/useAuth'
import { Helmet } from 'react-helmet-async'
import { useState, useEffect } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { URL_USER_HISTORY, STATUS_CODE_BAD_REQUEST, STATUS_CODE_SUCCESS } from '../constants'
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Spinner } from '@chakra-ui/react'

const History = () => {
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()
  const [hist, setHist] = useState([])
  const [isValid, setIsValid] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHist = async () => {
      const res = await axiosPrivate
        .get(`${URL_USER_HISTORY}/${auth.username}`)
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
          <HistTable uid={auth.username} data={hist} />
        )}
      </main>
    </>
  )
}

/**
 * History data is a list of room documents; within each room is a list of question documents.
 * We flatten it into a list of question objects, where each question consists of a partner,
 * question details, and a key property for React child.
 */
function processData(uid, data) {
  const questions = data.flatMap((room) => {
    const partner = room.u1 === uid ? room.u2 : room.u1
    function transformer(question, idx) {
      return {
        partner,
        ...question,
        key: room.roomId + question.Id + idx,
      }
    }
    return room.completed.map(transformer)
  })
  questions.sort((x, y) => new Date(x.completedAt) - new Date(y.completedAt))
  return questions
}

const HistTable = ({ uid, data }) => {
  const questions = processData(uid, data)

  return (
    <TableContainer overflowY='auto' whiteSpace='pre-line' maxHeight='100vh'>
      <Table variant='striped' className='max-w-full break-words table-fixed'>
        <Thead className='sticky top-0 bg-blue-300'>
          <Tr>
            <Th className='w-1/6'>Partner</Th>
            <Th className='w-1/5'>Question id</Th>
            <Th className='w-1/2'>Answer</Th>
            <Th>Completed at</Th>
          </Tr>
        </Thead>
        <Tbody>
          {questions.map((q) => {
            return (
              <Tr key={q.key}>
                <Td>{q.partner}</Td>
                <Td>{q.id}</Td>
                <Td>{q.answer}</Td>
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
