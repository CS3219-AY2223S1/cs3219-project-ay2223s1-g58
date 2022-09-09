import {
    validatePassword,
    generateAccessToken,
    generateRefreshToken,
    validateToken,
    denyAccessToken,
    hashPassword
} from "../auth/index.js"
import {
    ormCreateUser,
    ormDeleteUser,
    ormDeleteUserRefreshToken,
    ormDoesUserExist,
    ormGetUser,
    ormSaveUserRefreshToken,
} from "../model/user-orm.js"
import logger from "../logger.js"

export async function getUser(req, res) {
    try {
        const { username } = req.user
        const resp = await ormGetUser(username)
        if (resp.err) {
            logger.error(resp.err)
            return res.status(400).json({ message: "Could not get user info" })
        }
        return res.status(200).json({
            message: "Get user info successfully",
            data: {
                username: resp.username,
                email: resp.email,
                createdAt: resp.createdAt,
                updatedAt: resp.updatedAt,
            }
        })
    } catch (err) {
        logger.error(err)
        return res.status(500).json({ message: "Database failure when querying user" })
    }
}

export async function updateUser(req, res) {
    try {
        const { username } = req.user

        const resp = await ormGetUser(username)
        if (resp.err) {
            logger.error(resp.err)
            return res.status(400).json({ message: "Could not get user info" })
        }
        const user = resp
        if (req.body?.email) {
            user.email = req.body.email
        }
        if ((req.body?.previousPassword && !req.body?.updatedPassword) || (!req.body?.previousPassword && req.body?.updatedPassword)) {
            return res.status(400).json({ message: "Previous password and updated password must be provided together" })
        }
        let passwordUpdated = false
        if (req.body?.previousPassword && req.body?.updatedPassword) {
            if (req.body.previousPassword === req.body.updatedPassword) {
                return res.status(400).json({ message: "Previous password and updated password cannot be the same" })
            }
            if (!validatePassword(req.body.previousPassword, user.password)) {
                return res.status(400).json({ message: "Invalid password" })
            }
            user.password = hashPassword(req.body.updatedPassword)
            passwordUpdated = true
        }
        user.save()
        if (passwordUpdated) {
            return res.status(200)
                .cookie("jwt_refresh_token", "", { maxAge: 0, overwrite: true })
                .json({
                    message: "Update user info successfully",
                    data: {
                        username: resp.username,
                        email: resp.email,
                        createdAt: resp.createdAt,
                        updatedAt: resp.updatedAt,
                    }
                })
        }
        return res.status(200).json({
            message: "Update user info successfully",
            data: {
                username: resp.username,
                email: resp.email,
                createdAt: resp.createdAt,
                updatedAt: resp.updatedAt,
            }
        })
    } catch (err) {
        logger.error(err)
        return res.status(500).json({ message: "Database failure when updating user" })
    }
}

export async function createUser(req, res) {
    try {
        const { username, password } = req.body
        if (!(username && password)) {
            return res.status(400).json({ message: "Username and/or Password are missing" })
        }

        const exist = await ormDoesUserExist(username)
        if (exist) {
            return res.status(409).json({ message: "Username has been taken" })
        }

        const resp = await ormCreateUser(username, password)
        if (resp.err) {
            logger.error(resp.err)
            return res.status(400).json({ message: "Could not create a new user" })
        }

        const msg = `Created new user ${username} successfully`
        logger.info(msg)
        return res.status(201).json({ message: msg })
    } catch (err) {
        logger.error(err)
        return res.status(500).json({ message: "Database failure when creating new user" })
    }
}

export async function deleteUser(req, res) {
    try {
        const { username } = req.user
        const resp = await ormDeleteUser(username)
        if (resp.err) {
            logger.error(resp.err)
            return res.status(400).json({ message: "Could not delete user" })
        }
        const msg = `Deleted user ${username} successfully`
        logger.info(msg)
        await denyAccessToken(req.accessToken, req.user.username)
        return res.status(200)
            .cookie("jwt_refresh_token", "", { maxAge: 0, overwrite: true })
            .json({ message: msg })
    } catch (err) {
        logger.error(err)
        return res.status(500).json({ message: "Database failure when deleting user" })
    }
}

export async function login(req, res) {
    try {
        const { username, password } = req.body
        if (!(username && password)) {
            return res.status(400).json({ message: "Username and/or Password are missing" })
        }
        const exist = await ormDoesUserExist(username)
        if (!exist) {
            return res.status(400).json({ message: "User does not exist" })
        }
        const user = await ormGetUser(username)
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)
        if (!ormSaveUserRefreshToken(user, refreshToken)) {
            return res.status(500).json({ message: "Could not save user refresh token" })
        }
        if (validatePassword(password, user.password)) {
            return res
                .status(200)
                .cookie("jwt_refresh_token", refreshToken, {
                    httpOnly: true,
                    overwrite: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000, // expires in 7days
                })
                .json({
                    message: "User login is successful",
                    data: {
                        accessToken: accessToken,
                    },
                })
        }
        return res.status(400).json({ message: `Username and/or Password are incorrect` })
    } catch (err) {
        logger.error(err)
        return res.status(500).json({ message: "Login failed" })
    }
}

export async function logout(req, res) {
    try {
        if (ormDeleteUserRefreshToken(req.user.username)) {
            await denyAccessToken(req.accessToken, req.user.username)
            return res
                .status(200)
                .cookie("jwt_refresh_token", "", { maxAge: 0, overwrite: true })
                .json({ message: "User logout is successful" })
        }
        return res.status(500).json({ message: "Could not logout user" })
    } catch (err) {
        logger.error(err)
        return res.status(500).json({ message: "Could not logout user" })
    }
}

// Handle refresh token
export async function token(req, res) {
    try {
        const refreshToken = req.cookies.jwt_refresh_token
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is missing" })
        }

        const userInfo = validateToken(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        if (!userInfo) {
            return res.status(400).json({ message: "Invalid refresh token" })
        }

        const resp = await ormGetUser(userInfo.username)
        if (resp.err) {
            return res.status(400).json({ message: "Could not get user" })
        }
        if (resp.refreshToken !== refreshToken) {
            return res.status(400).json({ message: "Refresh token does not match the user's token record" })
        }

        await denyAccessToken(req.accessToken, userInfo.username)
        const accessToken = generateAccessToken(resp)
        const newRefreshToken = generateRefreshToken(userInfo)
        resp.refreshToken = newRefreshToken
        await resp.save()

        return res
            .status(200)
            .cookie("jwt_refresh_token", newRefreshToken, {
                httpOnly: true,
                overwrite: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, // expires in 7days
            })
            .json({
                message: "Token refreshed successfully",
                data: {
                    "username": userInfo.username,
                    "accessToken": accessToken,
                }
            })
    } catch (err) {
        logger.error(err)
        return res.status(500).json({ message: "Database failure when refreshing token" })
    }
}

