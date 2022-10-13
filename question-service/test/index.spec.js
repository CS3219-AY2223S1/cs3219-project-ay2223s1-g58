const request = require('supertest')
const app = require('../index.js')
const { expect } = require('chai')

describe('GET service status', function () {
    it('responds successfully', function (done) {
        request(app)
            .get('/api/v1/question/status')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(
                200,
                {
                    message: 'Hello World from question-service',
                },
                done
            )
    })
})

describe('GET Question by id', function () {
    it('Responds with retrieved question id', function (done) {
        request(app)
            .get('/api/v1/question?id=1')
            .set('Accept', 'application/json')
            .expect(200, done)
    })
})

describe('POST new Question', function () {
    it('responds successfully for creating question', async function () {
        const response = await request(app)
            .post('/api/v1/question')
            .set('Accept', 'application/json')
            .send({
                name: 'test',
                type: ['test'],
                content: 'test',
                difficulty: 'easy',
            })
        expect('Content-Type', /json/)
        expect(201)
        expect(response.body.message).equal('Create new question successfully!')
    })
})

describe('GET Next Question of same difficulty', function () {
    it('Responds with retrieved question id', function (done) {
        request(app)
            .get(
                '/api/v1/question/nextQuestion?past_id=1&past_id=2&difficulty=easy'
            )
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(
                200,
                {
                    id: 121,
                    name: 'Best Time to Buy and Sell Stock',
                    content: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `ith` day.\n\n\nYou want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.\n\n\nReturn *the maximum profit you can achieve from this transaction*. If you cannot achieve any profit, return `0`.\n\n\n\n**Example 1:**\n\n\n\n```\n**Input:** prices = [7,1,5,3,6,4]\n**Output:** 5\n**Explanation:** Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.\nNote that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.\n\n```\n\n**Example 2:**\n\n\n\n```\n**Input:** prices = [7,6,4,3,1]\n**Output:** 0\n**Explanation:** In this case, no transactions are done and the max profit = 0.\n\n```\n\n\n**Constraints:**\n\n\n* `1 <= prices.length <= 105`\n* `0 <= prices[i] <= 104`\n\n\n",
                    difficulty: 'easy',
                    types: ["Array", "Dynamic Programming"],
                },
                done
            )
    })
})

describe('Delete a question', function () {
    it('responds successfully for delete', function (done) {
        request(app)
            .delete('/api/v1/question?id=7')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(
                200,
                {
                    message: 'Question deleted succesfully',
                },
                done
            )
    })
})
