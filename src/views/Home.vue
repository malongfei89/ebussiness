<template>
<div @click="toggleCart">
  <Header @toggleCart='showCart = !showCart' @showNote="showNote = !showNote">
    <template #customized1>
      <button class="menu-login" @click="loginOrOut">{{btnD}}</button>
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
        <div style="width:66%;max-width:1600px;clear:both;float:left;overflow:hidden;display:flex">
          <img id="pic1" src= "@/assets/home-page-pic-1.jpg" alt="fast shipping">
          <img id="pic2" src= "@/assets/home-page-pic-2.jpg" alt="fast shipping">
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
import { setInterval, clearInterval } from 'timers'
export default {
  data: () => {
    return {
      cart: Globals.cart,
      showCart: false,
      user: Globals.user,
      showNote: false,
      showLoginPopup: false,
      picNum: 1,
      slideInterval: null
    }
  },
  created () {
    this.slideInterval = setInterval(function() {
      let pic1 = document.getElementById('pic1')
      let pic2 = document.getElementById('pic2')
      if(++this.picNum===1) {
        pic1.classList.add('pic1slide')
        pic1.style.display = 'inline'
        pic2.classList.add('pic2slideout')
        setTimeout(function () {
          pic2.style.display = 'none'
          pic2.classList.remove('pic2slideout')
          pic1.classList.remove('pic1slide')
        }, 1450)
      }
      else{
        pic2.classList.add('pic2slide')
        pic2.style.display = 'inline'
        pic1.classList.add('pic1slideout')
        setTimeout(function () {
          pic1.style.display = 'none'
          pic1.classList.remove('pic1slideout')
          pic2.classList.remove('pic2slide')
        }, 1450)
        this.picNum = 0
      }
    }, 4000)
  },
  beforeDestroy() {
    clearInterval(this.slideInterval)
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
