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
                    id: 7,
                    name: 'test',
                    content: 'test',
                    difficulty: 'easy',
                    types: ['test'],
                },
                done
            )
    })
})

describe('Delete a question', function () {
    it('responds successfully for delete', async function () {
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
