const request = require('supertest')
const app = require('../index.js')

describe('GET /status', function () {
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

describe('GET /', function() {
    it('Question retrieved succesfully', function (done) {
        request(app)
            .get('/api/v1/question?id=1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) throw err;
                console.log(res.body)
            })
    })
})
