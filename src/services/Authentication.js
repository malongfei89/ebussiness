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
            id: credential.id,
            name: credential.name,
            username: credential.username,
            password: credential.password,
            address: credential.address,
            bank_name: credential.bank_name,
            card_number: credential.card_number,
            cus_type: credential.cus_type
        })
    },
    getBankInfo (credential) {
        return api().get('/checkout', { params: { id: credential.id }})
    },
    checkout (credential) {
        return api().post('/checkout', {
            shipToName: credential.shipToName,
            shipToAddress: credential.shipToAddress,
            bankInfo: credential.selectedBankInfo,
            totalCostbfTax: credential.totalCostbfTax,
            tax: credential.tax,
            orderDetail: credential.orderDetail
        })
    }
}
