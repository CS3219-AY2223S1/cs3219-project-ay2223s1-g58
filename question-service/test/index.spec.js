import request from 'supertest';
import { app } from '../index.js';

describe('GET /status', function () {
    it('responds successfully', function (done) {
        request(app)
            .get('/api/v1/question/status')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, {
                message: 'Hello World from question-service'
            }, done);
    });
});