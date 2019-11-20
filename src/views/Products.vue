<template>
    <div @click="toggleCart2">
        <Header @toggleCart="toggleCart" @showNote="showNote = true">
        <template #customized1>
            <button style="font-weight:bold;width:100%;padding:46px 0;min-width:94px" @click="loginOrOut">{{btnD}}</button>
        </template>
        </Header>
        <div v-if="!showNote">
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
                <button v-if="cart.length" @click="$router.push('/checkout')" class="cart-btn">Check<br> Out</button>
            </div>
        </ul>
        <div style="display:flex;width:100%;justify-content:space-evenly;padding:20px 0">
        <div class="sidebar">
            <p style="font-size:24px">
            Customize your search
            </p>
           <ul>
                <li><button @click="sortByName">sort by name</button></li>   
                <li><button @click="sortByQuantity">sort by quantity</button></li>   
                <li><button @click="sortByPrice">sort by price<br>(low to high)</button></li>   
                <li><button @click="sortByPriceR">sort by price<br>(high to low)</button></li>   
                <li><button @click="sortBySpeed">sort by speed<br>(slow to fast)</button></li>   
                <li><button @click="sortBySpeedR">sort by speed<br>(fast to low)</button></li>   
                <li>Price from <input v-model="lowPrice" style="width:30px"> To <input v-model="highPrice" style="width:30px"> <button @click="itemInRange(lowPrice,highPrice)"> go</button></li>   
                <li><button style="left:30%;position:relative" @click="resetProducts">reset</button></li>   
            </ul>
        </div>
        <ul class="product-div">
            <li v-for="(item, index) in products" :key="item.id"  class="item-div">
                <div style="border:2px solid grey;">
                <div style="padding-top:16px">{{item.name}}</div>
                <div style="padding-top:16px">$ {{item.unit_price}}</div>
                <div style="padding-top:16px">{{itemStockInfo(item, index)}}</div>
                <button @click.stop="addToCart(item)" :style="styleforBtn(item)">Add</button>
                </div>
            </li>
        </ul>
        </div>
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
            <button style="float:right;width:65px;min-width:65px;padding:12px;margin-right:18px" @click="login">Login</button>
            </div>
                <p style="width:100%;height:15%;float:right">No account yet? click <router-link class="noback" to="/register">here</router-link> to Register</p>
            </div>
        </div>
        <div id="overlay" @click="closeLoginPopup"></div>
        </div>
        <div v-else class="note-B2B">
      <button style="font-size:20px;padding:10px" @click="showNote=false">Got it</button>
      <p>Here is the information for making B2B order:</p>
      <p><b>Port</b>: 11089</p>
      <p><b>Data</b> you need to send in along: </p>
      <p><b>Username</b>: your username,</p>
      <p><b>Password</b>: password for your username,</p>
      <p><b>Order Details</b>:</p>
      <p> 1.Case-insensitive.</p>
      <p style="margin-left:10px;">
        ex. If you choose 'Next-day Deliver', 'next-day deliver' will work
      </p>
      <p>
        2.Please put name of product and quantity you will order in JSON object
      </p>
      <p style="margin-left:10px;">
        ex. {name: 'Next-day Deliver', quantity: 1}
      </p>
      <p>
        3.If you select more than one product, please put all your products in an array
      </p>
      <p style="margin-left:10px;">
        ex. [{name: 'Next-day Deliver', quantity: 2}, 
      </p>
      <p style="margin-left:35px;">
      {name: 'Regular Shipping', quantity: 1}]
      </p>
      <p><b>Bank Information</b>:</p>
      <p>
        Please put name of bank and account number in JSON object
      </p>
      <p style="margin-left:10px;">
        ex. {bankName: 'bank of america', 
      </p>
      <p style="margin-left:45px;">
      bankAccount: 12345678914}
      </p>
      <p><b>Recipient Information</b>:</p>
      <p>
        Please put name and address of recipient in JSON object
      </p>
      <p style="margin-left:10px;">
        ex. {shipToName: 'Lyn', 
      </p>
      <p style="margin-left:45px;">
      shipToAddress: '0 main st new paltz NY 12561'}
      </p>
      <p><b>Complete Example:(please use the same key names)</b>:</p>
      <p>{</p>
      <p>username: 123,</p>
      <p>password: 123,</p>
      <p>orderDetail: </p>
      <p style="margin-left:10px;">
        [{name: 'Next-day Deliver', quantity: 2}, 
      </p>
      <p style="margin-left:11px;">
      {name: 'Regular Shipping', quantity: 1}],
      </p>
      <p>bankInfo: </p>
       <p style="margin-left:10px;">
        {bankName: 'bank of america', 
      </p>
      <p style="margin-left:16px;">
      bankAccount: 12345678914},</p>
      <p>shippingInfo: </p>
      <p style="margin-left:10px;">
        {shipToName: 'Lyn', 
      </p>
      <p style="margin-left:15px;">
      shipToAddress: '0 main st new paltz NY 12561'}
      </p>
      <p>}</p>
      </div>
        <Footer></Footer>>
    </div>
</template>
<script>
import { throttlingComponents } from '@/services/ThrottlingComponents'
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
            numOfProducts: 0,
            cart: Globals.cart,
            showCart: false,
            lowPrice: null,
            highPrice: null,
            showNote: false
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
        this.numOfProducts = this.products.length
        if(this.cart.length === 0 && sessionStorage.getItem('cart')) {
            this.cart = JSON.parse(sessionStorage.getItem('cart'))
        }
        this.addToCart = throttlingComponents(500, this.addToCart)
    },
    methods: {
        loginOrOut () {
            if(this.btnD === 'Log out') {
                this.user.pop()
                this.cart = []
                Globals.cart = []
                Globals.user = []
                if(sessionStorage.getItem('cart')) sessionStorage.removeItem('cart')
                if(sessionStorage.getItem('user')) sessionStorage.removeItem('user')
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
            let alreadyInCart = false
            for(let itemInCart of this.cart){
                if(itemInCart.id === item.id) {
                    itemInCart.quantity++
                    alreadyInCart = true
                }
            }
            if(!alreadyInCart){
                this.cart.push({
                name: item.name,
                unit_price: item.unit_price,
                quantity: 1,
                id: item.id
                })
            }
            Globals.toastr.push({
                type: 'success',
                message: `It's been added to your cart! Yeaaaaaaah`
            })
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
        },
        sortByName () {
            this.products.sort(function(a, b) {
                if(a.name > b.name) return 1
                if(a.name < b.name) return -1
                return 0
            })
        },
        sortByQuantity () {
            this.products.sort(function(a, b) {
                if(a.quantity > b.quantity) return 1
                if(a.quantity < b.quantity) return -1
                return 0
            })
        },
        sortByPrice () {
            this.products.sort(function(a, b) {
                if(a.unit_price > b.unit_price) return 1
                if(a.unit_price < b.unit_price) return -1
                return 0
            })
        },
        sortByPriceR () {
            this.sortByPrice()
            this.products.reverse()
        },
        sortBySpeed () {
            this.sortByPrice()
            this.products.unshift(this.products.pop())
        },
        sortBySpeedR () {
            this.sortBySpeed()
            this.products.reverse()
        },
        itemInRange (low, high) {
            this.products = this.products.filter(item => {
                return item.unit_price > low && item.unit_price < high
            })
        },
        async resetProducts () {
            if(this.products.length < this.numOfProducts) 
                this.products = (await GetProducts.getProducts()).data
            else this.sortByName()
        }
    }
}
</script>

<style>
</style>
