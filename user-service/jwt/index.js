import jwt from "jsonwebtoken"

export async function validateToken(token, secret) {
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
