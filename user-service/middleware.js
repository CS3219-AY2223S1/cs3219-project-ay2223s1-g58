// With reference to JWT Authentication Tutorial - Node.js
// https://www.youtube.com/watch?v=mbsmsi7l3r4
import jwt from "jsonwebtoken";
import { isAccessTokenDenied } from "./auth/index.js";
import logger from "./logger.js";

function getAccessToken(req) {
    try {
        const authHeader = req.headers['authorization'];
        const authContent = authHeader && authHeader.split(' ');
        if (!authHeader || authContent.length !== 2 || authContent[0] !== "Bearer" || authContent[1] === null) {
            logger.info("Access token not provided or invalid");
            return null;
        }
        return authContent[1];
    } catch (err) {
        logger.info("Access token not provided or invalid");
        return null;
    }
}

// Modifies the response object to configure the cookie
export async function updateCookieToken(res, token, maxAge) {
    res.cookie("jwt_refresh_token", token, {
        httpOnly: true,
        overwrite: true,
        maxAge: maxAge,
    })
}

export async function authenticateToken(req, res, next) {
    try {
        const token = getAccessToken(req);
        if (token === null) {
            return res.status(401).json({ message: "Access token not found" });
        }

        const denied = await isAccessTokenDenied(token);
        if (denied) {
            return res.status(401).json({ message: "Token has been revoked" });
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                logger.error(err)
                return res.status(401).json({ message: "Invalid access token" });
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