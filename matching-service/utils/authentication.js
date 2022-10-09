/* eslint-disable consistent-return */
const jwt = require("jsonwebtoken");

const getAccessToken = (req) => {
  try {
    const authHeader = req.headers.authorization;
    const authContent = authHeader && authHeader.split(" ");
    console.log("req", req.headers);
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
    console.log("Error: Access token not provided or invalid");
    return null;
  }
};

exports.authenticationMiddleware = (req, res, next) => {
  try {
    const token = getAccessToken(req);
    console.log("token: ", token);
    if (token === null) {
      return res.status(401).json({ message: "Access token not found" });
    }

    // Skip deny check as the token is only valid for 60 seconds if circumventing the frontend
    // Reasonable risk to tolerate

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(401).json({ message: "Invalid access token" });
      }
      req.user = user;
      req.accessToken = token;
      next();
    });
  } catch (err) {
    console.log("Fail to authenticate token in middleware");
    console.log(err);
    return res
      .status(500)
      .json({ message: "Problem encountered when validating token" });
  }
};
