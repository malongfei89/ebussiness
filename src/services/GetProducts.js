import Api from './Api.js'
export default {
    getProducts () {
        return Api.get('/products')
    }
}
