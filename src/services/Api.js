import axios from 'axios'

export function api() {
    return axios.create({
        baseURL: 'http://cs.newpaltz.edu:11080'
    })
}
export const Globals = {
    user: null,
    error: null
}