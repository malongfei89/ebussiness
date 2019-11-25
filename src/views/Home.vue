<template>
<div @click="toggleCart2">
  <Header @toggleCart='toggleCart' @showNote="showNote = !showNote">
    <template #customized1>
      <button style="font-weight:bold;padding:46px 0;width:100%;min-width:94px" @click="loginOrOut">{{btnD}}</button>
    </template>
  </Header>
  <main v-if="!showNote">
    <transition name="cart">
    <ul v-if="showCart" @click.stop class="cart-ul">
      <div v-if="cart.length">
        <li class="cart-li" v-for="(item, index) in cart" :key="index">
          {{item.name}}<span style="float:right;padding-left:4px;display:flex;">&times;<input @focusout="updateCart(item, index)" style="width:25px;margin-left:3px;padding:2px" type="number" min="0" v-model.number="item.quantity"></span><br>
          <span style="clear:both;float:right">Price: {{(item.quantity * item.unit_price).toFixed(2)}}</span>
        </li>
      </div>
      <div style="margin:50px;padding:20px 5px;font-size:24px;text-align:center" v-else>
        Nothing has been added to your cart yet!
      </div>
      <div style="display:flex;justify-content:space-around;margin:20px">
        <button @click="$router.push('/products')" class="cart-btn">Continue<br>shopping</button>
        <button v-if="cart.length" @click="$router.push('/checkout')" class="cart-btn">Check<br> Out</button>
      </div>
    </ul>
    </transition>
    <div id="home-main">
    <div style="margin:0;padding:0">
      <img style="width:66%;float:left" src="@/assets/home-page-pic.jpg" alt="fast shipping">
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
    <div id="home-description"><p>
      Here, We provide you with fast and Accurate shipping experience. Leave your package to us, and be worry free!
    </p>
    </div>
    </div>
  </main>
  <B2BDescription v-else @closeNote="showNote=false"></B2BDescription>
  <Footer></Footer>
</div>
</template>

<script>
import { Globals } from '@/services/Api'
import Authentication from '@/services/Authentication'
export default {
  data: () => {
    return {
      cart: [],
      showCart: false,
      user: [],
      showNote: false,
      showLoginPopup: false
    }
  },
  created () {
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
  }, 
  computed: {
    btnD: function () {
      return this.user.length?'Log out':'Register/Login'
    }
  },
  methods: {
    async login (credential) {
      try {
        const answer = await (Authentication.login({
          username: credential.value1,
          password: credential.value2
        }))
        this.user.push(answer.data) //id, name
        if(localStorage.getItem(`cart${this.user[0].id}`)) {
          const result = JSON.parse(localStorage.getItem(`cart${this.user[0].id}`))
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
        sessionStorage.setItem(`user`, JSON.stringify(this.user))
        this.showLoginPopup = false 
        Globals.toastr.push({
          type: 'success',
          message: `Log in successfully!`
        })
      } catch (error) {
        Globals.toastr.push({ type: 'error', message: error.response.data.error})
      }
    },
    loginOrOut () {
      if(this.btnD === 'Log out') {
        localStorage.setItem(`cart${this.user[0].id}`, JSON.stringify(this.cart))
        this.cart= Globals.cart = []
        this.user.pop()
        if(sessionStorage.getItem('user')) sessionStorage.removeItem('user')
      }
      else {
        this.showLoginPopup = true
      }
    },
    toggleCart () {
      this.showCart = !this.showCart
    },
    toggleCart2 () {
      if(this.showCart)  this.showCart=false
    },
    updateCart (item, index) {
      if(item.quantity < 0 ) item.quantity = 0
      if(item.quantity === 0 || item.quantity === "") this.cart.splice(index, 1)
    }
  }
}
</script>

<style>
</style>
