import request from 'supertest';
import { app } from '../index.js';
import { expect } from 'chai';

const BASE_URL_PREFIX = '/api/v1/user';
let accessToken = '';

describe('GET /status', function () {
    it('responds successfully', function (done) {
        request(app)
            .get(`${BASE_URL_PREFIX}/status`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, {
                message: 'Hello World from user-service'
            }, done);
    });
});

describe('POST /user', function () {
    it('responds successfully for creating user', async function () {
        // Clear user if any
        await request(app)
            .delete(`${BASE_URL_PREFIX}/testDelete`)
            .set('Accept', 'application/json')
            .send({
                username: 'testuser',
                password: 'testuser'
            })
        const response = await request(app)
            .post(`${BASE_URL_PREFIX}`)
            .set('Accept', 'application/json')
            .send({
                username: 'testuser',
                password: 'testuser'
            })
        expect('Content-Type', /json/)
        expect(201)
        expect(response.body.message).equal('Created new user testuser successfully');
    });

    it('responds unsuccessfully for creating duplicate user', async function () {
        // Creates once
        await request(app)
            .post(`${BASE_URL_PREFIX}`)
            .set('Accept', 'application/json')
            .send({
                username: 'testuser',
                password: 'testuser'
            })
        // Creates twice
        const response = await request(app)
            .post(`${BASE_URL_PREFIX}`)
            .set('Accept', 'application/json')
            .send({
                username: 'testuser',
                password: 'testuser'
            })
        expect('Content-Type', /json/)
        expect(409)
        expect(response.body.message).equal('Username has been taken');
    });
});

describe('Login/Logout user', function () {
    it('responds successfully for login', async function () {
        const response = await request(app)
            .post(`${BASE_URL_PREFIX}/login`)
            .set('Accept', 'application/json')
            .send({
                username: 'testuser',
                password: 'testuser'
            })
        expect('Content-Type', /json/)
        expect(200)
        expect(response.body.message).equal('User login is successful');
        expect(response.body.data).to.be.a('object');
        expect(response.body.data).to.have.property('username');
        expect(response.body.data).to.have.property('accessToken');
        expect(response.body.data.username).equal('testuser');
        accessToken = response.body.data.accessToken;
    });

    it('responds successfully for logout', async function () {
        const response = await request(app)
            .post(`${BASE_URL_PREFIX}/logout`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)
        expect('Content-Type', /json/)
        expect(200)
        expect(response.body.message).equal('User logout is successful');
    });
});

describe('Delete user', function () {
    it('responds successfully for delete', async function () {
        // await some time to allow for token change
        // https://github.com/auth0/node-jsonwebtoken/issues/570
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Update access token
        const res = await request(app)
            .post(`${BASE_URL_PREFIX}/login`)
            .set('Accept', 'application/json')
            .send({
                username: 'testuser',
                password: 'testuser'
            })
        accessToken = res.body.data.accessToken;

        const response = await request(app)
            .delete(`${BASE_URL_PREFIX}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)
        expect('Content-Type', /json/)
        expect(200)
        expect(response.body.message).equal('Deleted user testuser successfully');
    });
});
