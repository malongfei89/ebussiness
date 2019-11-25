<template>
    <div @click="toggleCart2">
        <Header @toggleCart="toggleCart" @showNote="showNote = !showNote">
        <template #customized1>
            <button style="font-weight:bold;width:100%;padding:46px 0;min-width:94px" @click="loginOrOut">{{btnD}}</button>
        </template>
        </Header>
        <div v-if="!showNote">
        <transition name="cart">
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
        </transition>
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
        <Popup
            btnValue = "Login" 
            type1 = "text"
            type2 = "password"
            label1 = "Username: "
            label2 = "Password: "
            :showPopup = "showLoginPopup"
            forLabel1 = "username"
            forLabel2 = "password"
            @finished = "login($event)"
            @closePopup = "showLoginPopup = false"
            >
        </Popup>
        </div>
        <B2BDescription v-else @closeNote="showNote=false"></B2BDescription>
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
            user: [],
            products: null,
            numOfProducts: 0,
            cart: [],
            showCart: false,
            lowPrice: null,
            highPrice: null,
            showNote: false,
            showLoginPopup: false
        }
    },
    computed: {
        btnD: function () {
            return this.user.length?'Log out':'Register/Login'
        }
    },
    async created () {
      if(Globals.cart.length || Globals.user.length) {
          this.user = Globals.user
          this.cart = Globals.cart
      } else{
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
          Globals.user = this.user
          Globals.cart = this.cart
      }
      this.products = (await GetProducts.getProducts()).data
      this.numOfProducts = this.products.length
      this.addToCart = throttlingComponents(500, this.addToCart)
    },
    methods: {
        loginOrOut () {
            if(this.btnD === 'Log out') {
                localStorage.setItem(`cart${this.user[0].id}`, JSON.stringify(this.cart))
                this.cart= Globals.cart = []
                this.user.pop()
                if(sessionStorage.getItem('user')) sessionStorage.removeItem('user')
            }
            else this.showLoginPopup = true
        },
        async login (credential) {
            try {
                const answer = await (Authentication.login({
                username: credential.value1,
                password: credential.value2
                }))
                this.user.push(answer.data) //id, name
                this.showLoginPopup = false 
                Globals.toastr.push({
                    type: 'success',
                    message: `Log in successfully!`
                })
                if(localStorage.getItem(`cart${this.user[0].id}`)){
                   const result = JSON.parse(localStorage.getItem(`cart${this.user[0].id}`))
                   localStorage.removeItem(`cart${this.user[0].id}`)
                    for(let i = 0;i<this.cart.length;i++) {
                        for(let j=0;j<result.length;j++) {
                        if(this.cart[i].id === result[j].id){
                            this.cart[i].quantity += result[j].quantity
                            result.splice(j, 1)
                            break
                        }
                        }
                    }
                    this.cart.push(...result)
                }
            } catch (error) {
                Globals.toastr.push({ type: 'error', message: error.response.data.error})
            }
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
                    break
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
            this.lowPrice = null
            this.highPrice = null
            this.resetProducts()
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
