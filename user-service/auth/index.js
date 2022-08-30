import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

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
        }
    } catch (err) {
        console.log(err)
        return null
    }
}

export function generateAccessToken(user) {
    return jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "60s",
    })
}

export function generateRefreshToken(user) {
    return jwt.sign({ username: user.username }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "1d", // to be safe, we set it to 1 day instead of no expiration
    })
}