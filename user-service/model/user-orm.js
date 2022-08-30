import { createUser, doesUserExist, getUser } from "./repository.js"
import { hashPassword } from "../auth/index.js"

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
    const passwordHash = hashPassword(password)
    try {
        const newUser = await createUser({
            username,
            password: passwordHash,
        })
        newUser.save()
        return true
    } catch (err) {
        console.log("ERROR: Could not create new user")
        return { err }
    }
}

export async function ormDoesUserExist(username) {
    try {
        return await doesUserExist(username)
    } catch (err) {
        console.log("ERROR: Could not check user existence")
        return { err }
    }
}

export async function ormGetUser(username) {
    try {
        return await getUser(username)
    } catch (err) {
        console.log("ERROR: Could not get user")
        return { err }
    }
}

export async function ormGetUserRefreshToken(username) {
    try {
        return await getUser(username).refreshToken
    } catch (err) {
        console.log("ERROR: Could not get user")
        return { err }
    }
}

export async function ormSaveUserRefreshToken(user, refreshToken) {
    try {
        user.refreshToken = refreshToken
        await user.save()
        return true
    } catch (err) {
        console.log("ERROR: Could not save user refresh token")
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
        console.log("ERROR: Could not delete user refresh token")
        return { err }
    }
}