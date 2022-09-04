import { createUser, doesUserExist, getUser, deleteUser, updateUser } from "./repository.js"
import { hashPassword } from "../auth/index.js"
import logger from "../logger.js"

// need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
    try {
        const newUser = await createUser({
            username,
            password: hashPassword(password),
        })
        newUser.save()
        return true
    } catch (err) {
        logger.error("Could not create new user")
        logger.error(err)
        return false
    }
}

export async function ormDoesUserExist(username) {
    try {
        return await doesUserExist(username)
    } catch (err) {
        logger.error("Could not check user existence")
        return { err }
    }
}

export async function ormGetUser(username) {
    try {
        return await getUser(username)
    } catch (err) {
        logger.error("Could not get user")
        return { err }
    }
}

export async function ormGetUserRefreshToken(username) {
    try {
        return await getUser(username).refreshToken
    } catch (err) {
        logger.error("Could not get user refresh token")
        return { err }
    }
}

export async function ormSaveUserRefreshToken(user, refreshToken) {
    try {
        user.refreshToken = refreshToken
        await user.save()
        return true
    } catch (err) {
        logger.error("Could not save user refresh token")
        return { err }
    }
}

export async function ormDeleteUserRefreshToken(username) {
    try {
        const user = await getUser(username)
        user.refreshToken = undefined
        await user.save()
        return true
    } catch (err) {
        logger.error("Could not delete user refresh token")
        return { err }
    }
}

export async function ormDeleteUser(username) {
    try {
        await deleteUser(username)
        return true
    } catch (err) {
        logger.error("Could not delete user")
        return { err }
    }
}

export async function ormUpdateUser(username, password) {
    try {
        await updateUser(username, hashPassword(password))
        return true
    } catch (err) {
        logger.error("Could not create new user")
        return { err }
    }
}