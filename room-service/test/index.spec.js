/* eslint-disable no-undef */
/* eslint-disable node/no-unpublished-require */
const request = require("supertest");
const { expect } = require("chai");
const sinon = require("sinon");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const { URL_QUESTION_SERVICE } = require("../const/constants");

const URI_PREFIX = "/api/v1/room";
const roomId = "1234";
const userId1 = "qwe";
const userId2 = "zxc";
const difficulty = "easy";

const auth = require("../utils/authentication");

sinon.stub(auth, "authenticationMiddleware").callsFake((req, res, next) => {
  req.user = { username: userId1 };
  return next();
});

const app = require("../index");

describe("Get service status", () => {
  it("responds Hello World", (done) => {
    request(app).get(`/`).expect(200, "Hello World from room-service", done);
  });
});

describe("POST / (create room)", () => {
  it("creates room successfully", async () => {
    // Delete existing room if any
    await request(app).delete(`${URI_PREFIX}/${roomId}`).send();

    const mock = new MockAdapter(axios);
    mock.onGet(new RegExp(`^${URL_QUESTION_SERVICE}`)).reply(200, { id: 1 });

    const resp = await request(app).post(`${URI_PREFIX}/`).send({
      roomId: roomId,
      userId1: userId1,
      userId2: userId2,
      difficulty: difficulty,
    });
    expect(resp.statusCode).to.equal(200);
    expect(resp.body.message).to.equal("Created Room successfully");
    expect(resp.body.data).to.deep.equal({
      roomId: roomId,
    });
    mock.restore();
  });

  it("fails for duplicate roomId", (done) => {
    request(app)
      .post(`${URI_PREFIX}/`)
      .send({
        roomId: roomId,
        userId1: userId1,
        userId2: userId2,
        difficulty: difficulty,
      })
      .expect(500);
    done();
  });

  it("fails for missing fields in request body", (done) => {
    request(app)
      .post(`${URI_PREFIX}/`)
      .send({
        userId1: userId1,
        userId2: userId2,
        difficulty: difficulty,
      })
      .expect(500);
    done();
  });
});

describe("PUT /next/:roomId (get next question)", () => {
  const mock = new MockAdapter(axios);
  mock.onGet(new RegExp(`^${URL_QUESTION_SERVICE}`)).reply(200, {
    data: { id: 2 },
  });
  it("get next room successfully", (done) => {
    // testRoom is created from previous test
    request(app)
      .put(`${URI_PREFIX}/next/${roomId}`)
      .send()
      .expect(200)
      .expect({ message: "Update Room next questionId successfully" }, done);
  });
});

describe("PUT /prev/:roomId (get prev question)", () => {
  const mock = new MockAdapter(axios);
  mock.onGet(new RegExp(`^${URL_QUESTION_SERVICE}`)).reply(200, { id: 2 });
  it("get previous room successfully", (done) => {
    // testRoom is created from previous test
    request(app)
      .put(`${URI_PREFIX}/prev/${roomId}`)
      .send()
      .expect(200)
      .expect(
        { message: "Update Room previous questionId successfully" },
        done
      );
  });
});

describe("GET /:roomId (get room info)", () => {
  it("gets successfully for room info", (done) => {
    request(app)
      .get(`${URI_PREFIX}/${roomId}`)
      .expect(200)
      .expect(
        {
          message: "Get Room info successfully",
          data: {
            roomId: roomId,
            userId1: userId1,
            userId2: userId2,
            questionId: 1,
            isFirst: true,
          },
        },
        done
      );
  });
});

describe("GET / (get room info by user id)", () => {
  it("gets successfully for room info for user id in room", (done) => {
    request(app)
      .get(`${URI_PREFIX}/`)
      .expect(200)
      .expect(
        {
          message: "Get Room info successfully",
          data: {
            roomId: roomId,
            isInRoom: true,
          },
        },
        done
      );
  });
});

describe("DELETE / (delete room)", () => {
  it("deletes successfully for room", (done) => {
    request(app)
      .delete(`${URI_PREFIX}/${roomId}`)
      .expect(200)
      .expect(
        {
          message: "Deleted Room successfully",
          data: {
            roomId: roomId,
          },
        },
        done
      );
  });

  it("fails for non-existent room", (done) => {
    request(app).delete(`${URI_PREFIX}/${roomId}`).expect(500);
    done();
  });
});
