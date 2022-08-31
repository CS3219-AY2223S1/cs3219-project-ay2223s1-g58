import {
    validatePassword,
    generateAccessToken,
    generateRefreshToken,
    validateToken
} from "../auth/index.js"
import {
    ormCreateUser,
    ormDeleteUserRefreshToken,
    ormDoesUserExist,
    ormGetUser,
    ormSaveUserRefreshToken,
} from "../model/user-orm.js"

export async function createUser(req, res) {
    try {
        const { username, password } = req.body
        if (!(username && password)) {
            return res.status(400).json({ message: "Username and/or Password are missing!" })
        }
        const exist = await ormDoesUserExist(username)
        if (exist) {
            return res.status(409).json({ message: "Username has been taken!" })
        }
        const resp = await ormCreateUser(username, password)
        if (resp.err) {
            return res.status(400).json({ message: "Could not create a new user!" })
        } else {
            console.log(`Created new user ${username} successfully!`)
            return res.status(201).json({
                message: `Created new user ${username} successfully!`,
            })
        }
    } catch (err) {
        return res.status(500).json({ message: "Database failure when creating new user!" })
    }
}

export async function login(req, res) {
    try {
        const { username, password } = req.body
        if (!(username && password)) {
            return res.status(400).json({ message: "Username and/or Password are missing!" })
        }
        const exist = await ormDoesUserExist(username)
        if (!exist) {
            return res.status(400).json({ message: "User does not exist!" })
        }
        const user = await ormGetUser(username)
        const refreshToken = generateRefreshToken(user)
        if (!ormSaveUserRefreshToken(user, refreshToken)) {
            return res.status(500).json({ message: "Could not save user refresh token!" })
        }
        if (validatePassword(password, user.password)) {
            return res
                .status(200)
                .cookie("JWT_ACCESS_TOKEN", generateAccessToken(user))
                .json({
                    message: "User login is successful!",
                    data: {
                        refreshToken: refreshToken,
                    },
                })
        }
        return res.status(400).json({ message: `Username and/or Password are incorrect!` })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Login failed!" })
    }
}

export async function logout(req, res) {
    if (ormDeleteUserRefreshToken(req.user.username)) {
        return res.status(200).json({ message: "User logout is successful!" })
    }
    return res.status(500).json({ message: "Could not logout user!" })
}

export async function token(req, res) {
    try {
        const { refreshToken } = req.body
        const userInfo = validateToken(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        if (!userInfo) {
            return res.status(400).json({ message: "Invalid refresh token!" })
        }
        const newRefreshToken = generateRefreshToken(userInfo)
        const resp = await ormGetUser(userInfo.username)
        if (resp.err) {
            return res.status(400).json({ message: "Could not get user!" })
        }
        if (resp.refreshToken !== refreshToken) {
            return res.status(400).json({ message: "Invalid refresh token!" })
        }
        resp.refreshToken = newRefreshToken
        await resp.save()
        return res
            .status(200)
            .cookie("JWT_ACCESS_TOKEN", generateAccessToken(resp))
            .json({
                message: "Token refreshed successfully!",
                data: {
                    "refreshToken": newRefreshToken,
                }
            })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Database failure when refreshing token!" })
    }
}

