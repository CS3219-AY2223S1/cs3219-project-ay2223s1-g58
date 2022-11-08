import React, { useMemo } from 'react'
import {
  Button,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionTable from '../components/QuestionTable'
import { AuthLayout } from '../components/AuthLayout'
import TypesStack from '../components/TypesStack'
import axios from '../api/axios'
import { URL_QUESTION_SERVICE } from '../constants'
import { Helmet } from 'react-helmet-async'

const difficultyColorMap = new Map([
  ['easy', 'green.500'],
  ['medium', 'orange.300'],
  ['hard', 'red'],
])

const QuestionBank = () => {
  const [loading, setLoading] = useState(true)
  const [searchVal, setSearchVal] = useState(null)
  const [data, setData] = useState()
  const [filteredData, setFilteredData] = useState()
  const [searchIndex, setSearchIndex] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const { data: response } = await axios.get(
          URL_QUESTION_SERVICE + '/allQuestions'
        )
        setData(response.questions)
        setFilteredData(response.questions)
        const searchInd = response.questions.map((question) => {
          const allValues = crawl(question)
          return { allValues: allValues.toString() }
        })
        setSearchIndex(searchInd)
      } catch (error) {
        //todo toast
        console.error(error)
      }
      setLoading(false)
    }

    const crawl = (question, allValues) => {
      if (!allValues) allValues = []
      for (let key in question) {
        if (key.toString() === 'types') {
          allValues.push(question[key].join(' ') + ' ')
        } else if (typeof question[key] === 'object') {
          crawl(question[key], allValues)
        } else {
          if (key.toString() === 'name' || key.toString() === 'difficulty')
            allValues.push(question[key] + ' ')
        }
      }
      return allValues
    }

    if (!data || data.length === 0) {
      fetchData()
    } else {
      if (searchVal) {
        const reqData = searchIndex.map((question, index) => {
          if (
            question.allValues.toLowerCase().indexOf(searchVal.toLowerCase()) >=
            0
          )
            return data[index]
          return null
        })
        setFilteredData(
          reqData.filter((question) => {
            if (question) return true
            return false
          })
        )
      } else {
        setFilteredData(data)
      }
    }
  }, [data, searchVal, searchIndex])

  const columns = useMemo(
    () => [
      {
        Header: 'Title',
        accessor: (row) => row,
        Cell: ({ cell: { value } }) => (
          <Button
            variant="link"
            color="gray.600"
            maxW="340px"
            justifyContent="flex-start"
            onClick={() => navigate('/question/' + value.id)}
          >
            <Text
              overflow="hidden"
              textOverflow="ellipsis"
              className="dark:text-gray-200"
            >
              {value.id + '. ' + value.name}
            </Text>
          </Button>
        ),
      },
      {
        Header: 'Types',
        accessor: 'Category.types',
        Cell: ({ cell: { value } }) => TypesStack(value),
      },
      {
        Header: 'Difficulty',
        accessor: 'Category.difficulty',
        Cell: ({ cell: { value } }) => (
          <Text color={difficultyColorMap.get(value)} fontWeight="normal">
            {value[0].toUpperCase() + value.slice(1)}
          </Text>
        ),
      },
    ],
    [navigate]
  )

  return !loading ? (
    <>
      <Helmet>
        <title>Question Bank | LeetWithFriend</title>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="An interview preparation platform and peer matching system, where students can find peers to practice whiteboard-style interview questions together."
        />
      </Helmet>
      <Box overflowY="auto">
        <VStack>
          <InputGroup w="35%" alignItems="center">
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search"
            />
          </InputGroup>
          <br />
          <QuestionTable columns={columns} data={filteredData} />
        </VStack>
      </Box>
    </>
  ) : (
    <AuthLayout title="Retrieving question...">
      <Helmet>
        <title>Question Bank | LeetWithFriend</title>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="An interview preparation platform and peer matching system, where students can find peers to practice whiteboard-style interview questions together."
        />
      </Helmet>
      <div className="text-xl text-center"></div>
    </AuthLayout>
  )
}

export default QuestionBank
