import { api } from './Api'

export default {
    login (credential) {
        return api().post('/', {
            username: credential.username,
            password: credential.password
        })
    },
    register (credential) {
        return api().post('/register', {
            name: credential.name,
            username: credential.username,
            password: credential.password,
            address: credential.address,
            bank_name: credential.bank_name,
            card_number: credential.card_number
        })
    }
}
