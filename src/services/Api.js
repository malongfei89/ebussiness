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
    products: [],
    persist: function () {
        if(this.user.length) {
            sessionStorage.setItem('user', JSON.stringify(this.user))
            localStorage.setItem(`cart${this.user[0].id}`, JSON.stringify(this.cart))
        }
        else  localStorage.setItem(`cart`, JSON.stringify(this.cart))
    }
    ,
    grabFromL: function () {
        if(sessionStorage.getItem('user')) {
            this.user = JSON.parse(sessionStorage.getItem('user'))
        }
        if(this.user.length){
            if(localStorage.getItem(`cart${this.user[0].id}`)) {
                this.cart = JSON.parse(localStorage.getItem(`cart${this.user[0].id}`))
            }
        } else{
            if(localStorage.getItem(`cart`)) {
                this.cart = JSON.parse(localStorage.getItem(`cart`))
                localStorage.removeItem('cart')
            }
        }
    }
}