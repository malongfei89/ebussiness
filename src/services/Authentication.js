import { api } from './Api'

export default {
    login (credential) {
        return api().post('/', credential)
    },
    register (credential) {
        return api().post('/register', credential)
    },
    getBankInfo (credential) {
        return api().get('/checkout', { params: { id: credential.id }})
    },
    checkout (credential) {
        return api().post('/checkout', credential)
    }
}
