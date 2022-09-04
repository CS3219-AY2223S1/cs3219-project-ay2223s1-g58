// With reference to JWT Authentication Tutorial - Node.js
// https://www.youtube.com/watch?v=mbsmsi7l3r4
import jwt from "jsonwebtoken";
import { isAccessTokenDenied } from "./auth/index.js";
import logger from "./logger.js";

export async function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) {
            return res.status(401).json({ message: "Access token not found" });
        }

        const denied = await isAccessTokenDenied(token);
        if (denied) {
            return res.status(403).json({ message: "Token has been revoked" });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                logger.error(err)
                return res.status(403).json({ message: "Invalid access token" });
            }
            req.user = user;
            req.accessToken = token;
            next();
        })
    } catch (err) {
        logger.error("Fail to authenticate token in middleware");
        logger.error(err);
        return res.status(500).json({ message: "Problem encountered when validating token" });
    }
}