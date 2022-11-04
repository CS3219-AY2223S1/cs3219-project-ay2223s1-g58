import useAuth from '../hooks/useAuth'
import { Helmet } from 'react-helmet-async'
import { useState, useEffect, useMemo } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { URL_HISTORY_USER, STATUS_CODE_BAD_REQUEST, STATUS_CODE_SUCCESS } from '../constants'
import { useTable, useSortBy } from 'react-table'
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Spinner } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

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
        <title>History | LeetWithFriend</title>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="An interview preparation platform and peer matching system, where students can find peers to practice whiteboard-style interview questions together."
        />
      </Helmet>
    )
  }

  const columns = useMemo(() => [
    {
      Header: 'Partner',
      accessor: 'partner',
      widthProp: 'w-1/6',   // Own property to style column width (not react-table's property)
      disableSortBy: true,
    },
    {
      Header: 'Question id',
      accessor: 'id',
      widthProp: 'w-1/5',
      disableSortBy: true,
      Cell: (cellInfo) => (
        <Link 
          to={`/question/${cellInfo.row.original.id}`} 
          className='font-semibold hover:underline text-gray-500 dark:text-gray-300'
        >
          {cellInfo.row.original.name}
        </Link>
      )
    },
    {
      Header: 'Answer',
      accessor: 'answer',
      widthProp: 'w-1/2',
      disableSortBy: true,
      Cell: ({ cell: { value } }) => (
        <div className='font-mono text-sm whitespace-pre-wrap'>{value}</div>
      )
    },
    {
      Header: 'Completed at',
      accessor: 'completedAt',
      Cell: ({ cell: { value } }) => {
        return new Date(value).toLocaleString('en-GB', {
          hour12: 'true',
          dateStyle: 'medium',
          timeStyle: 'medium',
        })
      },
      sortType: 'basic',
    }
  ], [])

  return (
    <>
      {getHelmet()}

      <main className="flex flex-col items-center justify-start h-full">
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
          <HistTable columns={columns} data={hist} />
        )}
      </main>
    </>
  )
}

const HistTable = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns, 
    data,
    disableSortRemove: true,
    initialState: {
      sortBy: [
        {
          id: 'completedAt',
          desc: true,
        }
      ]
    }
  }, useSortBy)

  return (
    <TableContainer overflowY='auto' whiteSpace='pre-wrap' maxHeight='100vh' className='mr-2'>
      <Table variant='striped' className='max-w-full table-fixed' {...getTableProps()}>
        <Thead className='sticky top-0 bg-blue-200 dark:bg-blue-900'>
          {headerGroups.map(headerGroup => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <Th className={column.widthProp} {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {column.isSorted && <span>{column.isSortedDesc ? ' ▼' : ' ▲'}</span>}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        
        <Tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row)
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <Td className='align-text-top' {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </Td>
                ))}
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default History
