import {
    ormCreateUser,
    ormDoesUserExist,
    ormGetUser,
} from "../model/user-orm.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function createUser(req, res) {
    try {
        const { username, password } = req.body
        if (username) {
            const exist = await ormDoesUserExist(username)
            if (exist) {
                return res
                    .status(409)
                    .json({ message: "Username has been taken!" })
            }
        }
        if (username && password) {
            const resp = await ormCreateUser(username, password)
            if (resp.err) {
                return res
                    .status(400)
                    .json({ message: "Could not create a new user!" })
            } else {
                console.log(`Created new user ${username} successfully!`)
                return res.status(201).json({
                    message: `Created new user ${username} successfully!`,
                })
            }
        } else {
            return res
                .status(400)
                .json({ message: "Username and/or Password are missing!" })
        }
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Database failure when creating new user!" })
    }
}

export async function login(req, res) {
    try {
        const { username, password } = req.body
        if (username) {
            const exist = await ormDoesUserExist(username)
            if (!exist) {
                return res.status(400).json({ message: "User does not exist!" })
            }
        }
        if (username && password) {
            const user = await ormGetUser(username)
            const isMatched = bcrypt.compareSync(password, user.password)
            if (isMatched) {
                const token = jwt.sign(
                    { username: user.username },
                    process.env.ACCESS_TOKEN,
                    { algorithm: "HS256", expiresIn: "30s" }
                )
                const refreshtoken = jwt.sign(
                    { username: user.username },
                    process.env.REFRESH_TOKEN,
                    { algorithm: "HS256" }
                )
                return res
                    .setHeader("set-cookie", [
                        `JWT_TOKEN=${token}; httponly; samesite=lax`,
                    ])
                    .status(200)
                    .json({
                        message: "User login is successful!",
                        data: {
                            refreshToken: refreshtoken,
                        },
                    })
            } else {
                return res
                    .status(400)
                    .json({ message: `User cannot be logged in!` })
            }
        } else {
            return res
                .status(400)
                .json({ message: "Username and/or Password are missing!" })
        }
    } catch (err) {
        return res.status(500).json({ message: "Login failed!" })
    }
}
