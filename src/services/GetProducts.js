import { api } from './Api.js'
export default {
    getProducts () {
        return api().get('/products')
    }
}
