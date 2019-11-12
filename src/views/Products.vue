<template>
    <div @click="toggleCart2">
        <Header @toggleCart="toggleCart">
        <template #customized1>
            <button style="font-weight:bold;width:100%;padding:46px 0;min-width:94px" @click="loginOrOut">{{btnD}}</button>
        </template>
        </Header>
        <ul v-if="showCart" @click.stop class="cart-ul">
            <div v-if="cart.length">
                <li class="cart-li" v-for="(itemInCart, indexForItemInCart) in cart" :key="indexForItemInCart">
                {{itemInCart.name}}<span style="float:right;padding-left:4px;display:flex;">&times;<input @focusout="updateCart(itemInCart, indexForItemInCart)" style="width:25px;margin-left:3px;padding:2px" type="number" v-model.number="itemInCart.quantity"></span><br>
                <span style="clear:both;float:right">Price: {{(itemInCart.quantity * itemInCart.unit_price).toFixed(2)}}</span>
                </li>
            </div>
            <div style="margin:50px;padding:20px 5px;font-size:24px;text-align:center" v-else>
                Nothing has been added to your cart yet!
            </div>
            <div style="display:flex;justify-content:space-around;margin:20px 0">
                <button @click="toggleCart2" class="cart-btn">Continue<br>shopping</button>
                <button @click="$router.push('/checkout')" class="cart-btn">Check<br> Out</button>
            </div>
        </ul>
        <ul class="product-div">
            <li v-for="(item, index) in products" :key="item.id"  class="item-div">
                <div style="padding-top:16px">{{item.name}}</div>
                <br>
                <div>$ {{item.unit_price}}</div>
                <br>
                <div>{{itemStockInfo(item, index)}}</div>
                <br>
                <button @click.stop="addToCart(item)" :style="styleforBtn(item)">Add</button>
            </li>
        </ul>
        <div class="loginPopup">
            <button @click="closeLoginPopup" style="float:right;width:40px;height:40px;background-color:transparent;font-size:30px">&times;</button>
            <div style="top:15%;left:15%;width:70%;height:80%;position:absolute">
                <div class="input-group login-input-group">
                    <label for="username">Username:</label>
                    <input id="username" v-model="username" type="text">
                </div>
            <div class="input-group login-input-group">
                <label for="password">Password:</label>
                <input id="password" v-model="password" type="password">
            </div>
            <div class="div-button" style="height:15%;">
            <button style="float:right;height:85%;width:65px;min-width:65px;" @click="login">Login</button>
            </div>
                <p style="width:100%;height:15%;float:right">No account yet? click <router-link class="noback" to="/register">here</router-link> to Register</p>
            </div>
        </div>
        <div id="overlay" @click="closeLoginPopup"></div>
        <Footer></Footer>>
    </div>
</template>
<script>
import { Globals } from '@/services/Api'
import Authentication from '@/services/Authentication'
import GetProducts from '@/services/GetProducts'
export default {
    data: () => {
        return {
            username: null,
            password: null,
            user: Globals.user,
            btnD: null,
            products: null,
            cart: Globals.cart,
            showCart: false
        }
    },
    computed: {
    },
    async mounted () {
        if(this.user.length === 0 && sessionStorage.getItem('user')){
            this.user = JSON.parse(sessionStorage.getItem('user'))
        }
        this.btnD = this.user.length?'Log out':'Register/Login'
        this.products = (await GetProducts.getProducts()).data
        if(this.cart.length === 0 && sessionStorage.getItem('cart')) {
            this.cart = JSON.parse(sessionStorage.getItem('cart'))
        }
    },
    methods: {
        loginOrOut () {
            if(this.btnD === 'Log out') {
                this.user.pop()
                this.btnD = 'Register/Login'
            }
            else {
                document.getElementsByClassName('loginPopup')[0].style.display = 'block'
                document.getElementById('overlay').classList.add('greyout')
            }
        },
        async login () {
            try {
                const answer = await (Authentication.login({
                    username: this.username,
                    password: this.password
                }))
                Globals.user.push(answer.data) //id, name
                this.btnD = 'Log out'
                this.closeLoginPopup () 
                    Globals.toastr.push({
                    type: 'success',
                    message: `Log in successfully!`
                })
            } catch (error) {
                Globals.toastr.push({ type: 'error', message: error.response.data.error})
            }
        },
        closeLoginPopup () {
            document.getElementById('overlay').classList.remove('greyout')
            document.getElementsByClassName('loginPopup')[0].style.display = 'none'
        },
        itemStockInfo (item) {
            return item.quantity>0?'In Stock':'Out of Stock'
        },
        styleforBtn (item){
            return item.quantity > 0?'padding:20px;margin:15px;':'padding:20px;margin:15px;visibility:hidden;'
        },
        addToCart (item) {
            Globals.toastr.push({
                type: 'success',
                message: `It's been added to your cart! Yeaaaaaaah`
            })
            let alreadyInCart = false
            for(let itemInCart of this.cart){
                if(itemInCart.name === item.name) {
                    itemInCart.quantity++
                    alreadyInCart = true
                }
            }
            if(!alreadyInCart){
                this.cart.push({
                name: item.name,
                unit_price: item.unit_price,
                quantity: 1
                })
            }
        },
        toggleCart () {
            this.showCart = !this.showCart
        },
        toggleCart2 () {
            if(this.showCart) this.showCart=false
        },
        updateCart (itemInCart, indexForItemInCart) {
            if(itemInCart.quantity < 0 ) itemInCart.quantity = 0
            if(itemInCart.quantity === 0 || itemInCart.quantity === "") this.cart.splice(indexForItemInCart, 1)
        }
    }
}
</script>

<style>
</style>
