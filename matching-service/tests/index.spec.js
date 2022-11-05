/* eslint-disable no-undef */
const app = require("../index");

describe("Get service status", () => {
  it("responds Hello World", (done) => {
    request(app)
      .get(`/`)
      .expect(200, "Hello World from matching-service", done);
  });
});
