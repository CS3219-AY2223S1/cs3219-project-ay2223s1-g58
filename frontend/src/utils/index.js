import { RANDOM_AVATAR_URL } from "../constants";

export function getUserProfileUrl(username) {
    return `${RANDOM_AVATAR_URL}${username}.svg`
}
