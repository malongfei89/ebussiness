import axios from 'axios'

export function api() {
    return axios.create({
        baseURL: 'http://cs.newpaltz.edu:11080'
    })
}
export const Globals = {
    user: [],
    toastr: [],
    cart: [],
    persist: function () {
        if(this.user.length !== 0 && !sessionStorage.getItem('user')) sessionStorage.setItem('user', JSON.stringify(this.user))
        if(this.cart.length !== 0 && !sessionStorage.getItem('cart')) sessionStorage.setItem('cart', JSON.stringify(this.cart))
    },
    grabFromL: function () {
        if(sessionStorage.getItem('user')) this.user = JSON.parse(sessionStorage.getItem('user'))
        if(sessionStorage.getItem('cart')) this.cart = JSON.parse(sessionStorage.getItem('cart'))
    }
}