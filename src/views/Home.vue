<template>
<div @click="toggleCart2">
  <Header @toggleCart='toggleCart'>
    <template #customized1>
      <button style="font-weight:bold;padding:46px 0;width:100%;min-width:94px" @click="loginOrOut">{{btnD}}</button>
    </template>
  </Header>
  <main>
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
    <div id="home-main">
    <div style="margin:0;padding:0">
      <img style="width:66%;float:left" src="@/assets/home-page-pic.jpg" alt="fast shipping">
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
          <button style="float:right;width:65px;min-width:65px;padding:12px;margin-right:18px" @click="login">Login</button>
        <p style="width:100%;height:15%;float:right">No account yet? click <router-link class="noback" to="/register">here</router-link> to Register</p>
      </div>
    </div>
    <div id="home-description"><p>
      Here, We provide you with fast and Accurate shipping experience. Leave your package to us, and be worry free!
    </p>
    </div>
    </div>
  </main>
  <div id="overlay" @click="closeLoginPopup"></div>
  <Footer></Footer>
</div>
</template>

<script>
import { Globals } from '@/services/Api'
import Authentication from '@/services/Authentication'
export default {
  data: () => {
    return {
      cart: Globals.cart,
      username: null,
      password: null,
      showCart: false,
      user: Globals.user,
      btnD: null
    }
  },
  mounted () {
    if(this.user.length === 0 && sessionStorage.getItem('user')){
      this.user = JSON.parse(sessionStorage.getItem('user'))[0]
    }
    this.btnD = this.user.length?'Log out':'Register/Login'
    if(this.cart.length === 0 && sessionStorage.getItem('cart')) {
      this.cart = JSON.parse(sessionStorage.getItem('cart'))
    }
  },
  methods: {
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
    toggleCart () {
      this.showCart = !this.showCart
    },
    toggleCart2 () {
      if(this.showCart) this.showCart=false
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
