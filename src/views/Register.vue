<template>
  <div @click="toggleCart2">
    <Header @toggleCart="toggleCart">
      <template #customized1>
      <button style="font-weight:bold;padding:46px 0;width:100%;min-width:94px" @click="showLoginPopup=true">{{btnD}}</button>
    </template>
    </Header>
    <transition name="cart">
    <ul v-if="showCart" @click.stop class="cart-ul">
      <div v-if="cart.length">
        <li class="cart-li" v-for="(item, index) in cart" :key="index">
          {{item.name}}<span style="float:right;padding-left:4px;display:flex;">&times;<input @focusout="updateCart(item, index)" style="width:25px;margin-left:3px;padding:2px" type="number" min="0" v-model.number="item.quantity"></span><br>
          <span style="clear:both;float:right">Price: {{item.quantity * item.unit_price}}</span>
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
    <div v-if="!showNote" class="form-div">
      <div class="input-group">
        <label for="newUsername">Username:(required)</label>
        <input id="newUsername" v-model="newUsername" type="text">
      </div>
      <div class="input-group ">
        <label for="newPassword">Password:(required)</label>
        <input id="newPassword" v-model="newPassword" type="password">
      </div>
      <div class="input-group ">
        <label for="confirmNewPassword">Confirm Password:(required)</label>
        <input id="confirmNewPassword" v-model="confirmNewPassword" type="password">
      </div>
      <div class="input-group">
        <label style="font-size:20px;width:20%">I'm</label>
        <input type="radio" name="identity" v-model="identity" value="individual" checked><span style="font-size:18px"> An individual person</span>
        <input type="radio" name="identity" v-model="identity" value="company"><span style="font-size:18px"> A company (required)</span>
      </div>
      <div class="input-group ">
        <label for="newName">Name:(optional)</label>
        <input id="newName" v-model="newName" type="text">
      </div>
      <div class="input-group ">
        <label for="newAddress">Address:(optional)</label>
        <input id="newAddress" v-model="newAddress" type="text">
      </div>
      <div class="input-group ">
        <label for="newBankName">Bank name:(optional)</label>
        <input id="newBankName" v-model="newBankName" type="text">
      </div>
      <div class="input-group ">
        <label for="newBankAccount">Bank account:(optional)</label>
        <input id="newBankAccount" v-model="newBankAccount" type="text">
      </div>
      <button style="float:right;padding:20px;margin:0 20px 0 20px;" @click="register">Register</button>
    </div>
    <B2BDescription v-else @closeNote="$router.push('/')"></B2BDescription>
    <Footer></Footer>
  </div>
</template>

<script>
import { Globals } from '@/services/Api'
import Authentication from '@/services/Authentication'
export default {
  data: () => {
    return {
      newUsername: null,
      newPassword: null,
      confirmNewPassword: null,
      identity: null,
      newName: null,
      newAddress: null,
      newBankName: null,
      newBankAccount: null,
      showNote: false,
      cart: Globals.cart,
      showCart: false,
      showLoginPopup: false
    }
  },
  computed: {
    btnD: function () {
        return this.user.length?'Log out':'Register/Login'
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
  methods: {
    async register () {
      if(!this.newUsername | !this.newPassword | !this.confirmNewPassword | !this.identity) {
        Globals.toastr.push({ type: 'error', message: 'Please fill in all required fileds!'})
        return
      }
      if (this.newPassword !== this.confirmNewPassword) {
        Globals.toastr.push({ type: 'error', message: 'Two passwords you entered are not the same!'})
        return
      }
      try {
        await Authentication.register({
          name: this.newName,
          username: this.newUsername,
          password: this.newPassword,
          address: this.newAddress,
          bank_name: this.newBankName,
          card_number: this.newBankAccount,
          cus_type: this.identity
        })
        Globals.toastr.push({ type: 'success', message: `You've been successfully registered!`})
        if(this.identity==='company'){
          this.showNote=true
        }
        else{
          setTimeout(function () {
            this.showLoginPopup = true
          }, 1000)
        }
      } catch (error) {
        Globals.toastr.push({ type: 'error', message: error.response.data.error})
      }
    },
    async login (credential) {
      try {
        const answer = await (Authentication.login({
          username: credential.value1,
          password: credential.value2
        }))
        this.user.push(answer.data) //id, name
        this.$router.push('/')
        Globals.toastr.push({
            type: 'success',
            message: `Log in successfully!`
        })
      } catch (error) {
        Globals.toastr.push({ type: 'error', message: error.response.data.error})
      }
    },
    updateCart (itemInCart, indexForItemInCart) {
      if(itemInCart.quantity < 0 ) itemInCart.quantity = 0
      if(itemInCart.quantity === 0 || itemInCart.quantity === "") this.cart.splice(indexForItemInCart, 1)
    },
    toggleCart () {
      this.showCart = !this.showCart
    },
    toggleCart2 () {
      if(this.showCart) this.showCart=false
    }
  }
}
</script>
<style>
</style>
