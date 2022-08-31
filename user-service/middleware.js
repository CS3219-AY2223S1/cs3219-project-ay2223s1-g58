// With reference to JWT Authentication Tutorial - Node.js
// https://www.youtube.com/watch?v=mbsmsi7l3r4

import jwt from "jsonwebtoken";
import { redisClient } from "./index.js";
export async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);
    }
    const val = await redisClient.get(token);
    if (val != null) {
        console.log("User already logged out!");
        return res.sendStatus(403);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err)
            return res.sendStatus(403).json({ message: "Invalid access token!" });
        }
        req.user = user;
        req.accessToken = token;
        next();
    })
}