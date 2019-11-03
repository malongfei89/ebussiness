import Api from './Api.js'
require('dotenv').config()
const api = Api(process.env.SERVER_ADD)

export default {
    getProducts () {
        return api.get('/products')
    }
}
