/* eslint-disable consistent-return */
const jwt = require("jsonwebtoken");

const getAccessToken = (req) => {
  try {
    const authHeader = req.headers.authorization;
    const authContent = authHeader && authHeader.split(" ");
    if (
      !authHeader ||
      authContent.length !== 2 ||
      authContent[0] !== "Bearer" ||
      authContent[1] === null
    ) {
      console.log("Access token not provided or invalid");
      return null;
    }
    return authContent[1];
  } catch (err) {
    console.log("Access token not provided or invalid");
    return null;
  }
};

exports.authenticateToken = (req) => {
  try {
    const token = getAccessToken(req);
    if (token === null) {
      return null;
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        return null;
      }
      return user;
    });
  } catch (err) {
    console.log("Fail to authenticate token in middleware");
    console.log(err);
    return null;
  }
};
