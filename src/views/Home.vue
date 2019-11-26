<template>
<div @click="toggleCart">
  <Header @toggleCart='showCart = !showCart' @showNote="showNote = !showNote">
    <template #customized1>
      <button style="font-weight:bold;padding:46px 0;width:100%;min-width:94px" @click="loginOrOut">{{btnD}}</button>
    </template>
  </Header>
  <main v-if="!showNote">
    <Cart
    :cart = "cart"
    :showCart = "showCart"
    @emptyCart = "emptyCart"
    @updateCart = "updateCart"
    @toProducts = "$router.push('/products')"
    @toCheckOut = "$router.push('/checkout')"
    ></Cart>
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
      cart: Globals.cart,
      showCart: false,
      user: Globals.user,
      showNote: false,
      showLoginPopup: false
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
        this.showLoginPopup = false 
        Globals.toastr.push({
          type: 'success',
          message: `Log in successfully!`
        })
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
      } catch (error) {
        Globals.toastr.push({ type: 'error', message: error.response.data.error})
      }
    },
    loginOrOut () {
      if(this.btnD === 'Log out') {
        localStorage.setItem(`cart${this.user[0].id}`, JSON.stringify(this.cart))
        this.cart=[]
        this.user.pop()
        if(sessionStorage.getItem('user')) sessionStorage.removeItem('user')
      } else this.showLoginPopup = true
    },
    toggleCart () {
      if(this.showCart)  this.showCart=false
    },
    updateCart (item, index) {
      if(item.quantity < 0 ) item.quantity = 0
      if(!item.quantity) this.cart.splice(index, 1)
    },
    emptyCart () {
      this.cart = Globals.cart = []
    }
  }
}
</script>

<style>
</style>
