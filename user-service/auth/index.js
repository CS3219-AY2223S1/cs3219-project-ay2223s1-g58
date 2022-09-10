import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import logger from "../logger.js"
import { redisClient } from "../index.js"

export function hashPassword(password) {
    return bcrypt.hashSync(password, 10)
}

export function validatePassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword)
}

export function validateToken(token, secret) {
    try {
        const result = jwt.verify(token, secret)
        return {
            username: result.username,
            email: result.email,
            school: result.school,
        }
    } catch (err) {
        logger.error(err)
        return null
    }
}

export function generateAccessToken(user) {
    return jwt.sign(
        {
            username: user.username,
            email: user.email,
            school: user.school,
        }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "60s",
    })
}

export function generateRefreshToken(user) {
    return jwt.sign({
        username: user.username,
        email: user.email,
        school: user.school,
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d", // to be safe, we set it to 7 days instead of no expiration
    })
}

export async function denyAccessToken(accessToken, username) {
    try {
        if (!accessToken) {
            return
        }
        // Revoke access token immediately
        await redisClient.set(accessToken, username, "EX", 60)
        logger.info("Access token is denied")
    } catch (err) {
        logger.error(err)
        logger.error(`Could not deny access token ${accessToken} for user ${username}`)
    }
}

export async function isAccessTokenDenied(accessToken) {
    try {
        const username = await redisClient.get(accessToken);
        if (username != null) {
            logger.warn("Token has been revoked");
            return true
        }
        return false
    } catch (err) {
        logger.error(err)
        return true
    }
}