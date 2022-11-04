import request from 'supertest'
import { expect } from 'chai'
import { app } from '../index.js'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { URL_QUESTION_SERVICE_QUESTION_NAMES } from '../constants/const.js'

const URI_PREFIX = '/api/v1/history'

describe('Get service status', function () {
  it('responds server alive', function (done) {
    request(app)
      .get('/')
      .expect(200, 'Hello World from history-service', done)
  })
})

describe('POST /room (create room history)', function () {
  it('creates room successfully', async function () {
    // Delete existing room if any
    await request(app)
      .delete(`${URI_PREFIX}/room/testDelete`)
      .send({
        'roomId': 'testRoom',
      })
    
    const resp = await request(app)
      .post(`${URI_PREFIX}/room`)
      .send({
        'roomId': 'testRoom',
        'u1': 'testUser1',
        'u2': 'testUser2',
      })
    expect(resp.statusCode).to.equal(201)
    expect(resp.body.message).to.equal('Created room history')
  })

  it('fails for duplicate roomId', function (done) {
    request(app)
      .post(`${URI_PREFIX}/room`)
      .send({
        'roomId': 'testRoom',
        'u1': 'testUser1',
        'u2': 'testUser2',
      })
      .expect(400)
      .expect({ message: 'Could not create room history for roomId testRoom' }, done)
  })

  it('fails for missing fields in request body', function (done) {
    request(app)
      .post(`${URI_PREFIX}/room`)
      .send({})
      .expect(400)
      .expect({ message: 'roomId is missing' }, done)
  })
})

describe('PUT /room/:roomId (update room history)', function () {
  it('updates room history successfully', function (done) {
    // testRoom is created from previous test
    request(app)
    .put(`${URI_PREFIX}/room/testRoom`)
    .send({
      'questionId': 1234,
      'answer': 'test',
  })
    .expect(200)
    .expect({ message: 'Update history successfully' }, done)
  })

  it('fails for non-existent roomId', function (done) {
    request(app)
      .put(`${URI_PREFIX}/room/not-exist`)
      .send({
        'questionId': 1234,
        'answer': 'test',
      })
      .expect(400)
      .expect({ message: 'Could not update history for room not-exist' }, done)
  })

  it('fails for missing fields in request body', function (done) {
    request(app)
      .put(`${URI_PREFIX}/room/testRoom`)
      .send({})
      .expect(400)
      .expect({ message: 'questionId is missing' }, done)
  })
})

describe('GET /user/:uid (get user history)', function () {
  it('gets successfully for empty history', function (done) {
    request(app)
      .get(`${URI_PREFIX}/user/emptyUser`)
      .expect(200)
      .expect({ 
        message: 'Get history successfully',
        data: [],
      }, done)
  })

  // testUser1 has history in testRoom, which was updated in previous test
  it('gets successfully for non-empty history', async function () {
    const mockAxios = new MockAdapter(axios)
    // Mock the response from Question Service. Mock any GET request to /questionNames endpoint
    mockAxios
      .onGet(new RegExp(`^${URL_QUESTION_SERVICE_QUESTION_NAMES}`))
      .reply(200, {
        data: { 1234: 'testQuestion' },
      })
    
    const resp = await request(app).get(`${URI_PREFIX}/user/testUser1`)
    
    expect(resp.statusCode).to.equal(200)
    expect(resp.body.message).to.equal('Get history successfully')
    expect(resp.body.data).to.be.a('array')
    expect(resp.body.data.length).to.be.greaterThanOrEqual(1)
    // Check the fields required for History page
    expect(resp.body.data[0]).to.be.a('object')
    expect(resp.body.data[0]).to.have.property('partner')
    expect(resp.body.data[0]).to.have.property('id')
    expect(resp.body.data[0]).to.have.property('name')
    expect(resp.body.data[0]).to.have.property('answer')
    expect(resp.body.data[0]).to.have.property('completedAt')
    mockAxios.restore()
  })
})
