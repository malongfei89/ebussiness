<template>
  <div @click="toggleCart2">
    <Header @toggleCart="toggleCart">
      <template #customized1>
      <button style="font-weight:bold;padding:46px 0;width:100%;min-width:94px" @click="showlogin">{{btnD}}</button>
    </template>
    </Header>
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
      </div>
    </div>
    <div v-if="!showNote" class="form-div" style="min-width:340px">
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
    <div v-else class="note-B2B">
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
      username: null,
      password: null,
      btnD: 'Login'
    }
  },
  async created () {
    if(this.cart.length === 0 && sessionStorage.getItem('cart')) {
      this.cart = JSON.parse(sessionStorage.getItem('cart'))
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
            this.showlogin()
          }, 1000)
        }
      } catch (error) {
        Globals.toastr.push({ type: 'error', message: error.response.data.error})
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
    showlogin () {
      document.getElementsByClassName('loginPopup')[0].style.display = 'block'
      document.getElementById('overlay').classList.add('greyout')
    },
    closeLoginPopup () {
      document.getElementById('overlay').classList.remove('greyout')
      document.getElementsByClassName('loginPopup')[0].style.display = 'none'
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
