import { createUser, doesUserExist, getUser } from "./repository.js"
import bcrypt from "bcryptjs"

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
    const passwordHash = bcrypt.hashSync(password, 10)
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
