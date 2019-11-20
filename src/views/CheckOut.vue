<template>
  <div @click="toggleCart2">
    <Header @toggleCart="toggleCart" @showNote="showNote = true">
      <template #customized1>
            <button style="font-weight:bold;width:100%;padding:46px 0;min-width:94px" @click="logOut">{{btnD}}</button>
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
      <div style="display:flex;justify-content:center;margin:20px">
        <button @click="$router.push('/products')" class="cart-btn">Continue<br>shopping</button>
      </div>
    </ul>
    <div v-if="!orderSuccessful">
    <div class="loginPopup">
      <button @click="closeAddBankDiv" style="float:right;width:40px;height:40px;background-color:transparent;font-size:30px">&times;</button>
      <div style="top:15%;left:15%;width:70%;height:80%;position:absolute">
        <div class="input-group">
          <label for="bankname">Bank Name:</label>
          <input id="bankname" v-model="newBankName" type="text">
        </div>
        <div class="input-group login-input-group">
          <label for="bankaccount">Bank Account:</label>
          <input id="bankaccount" v-model="newBankAccount" type="text">
        </div>
          <button style="float:right;width:65px;min-width:65px;padding:12px;margin-right:18px" @click="addNewBankInfo">Add</button>
      </div>
    </div>
    <div style="display:flex;justify-content:center;flex-wrap:wrap" v-if="!showNote">
      <ul class="checkout-div">
        <li class="cart-li" v-for="(itemInCart, indexForItemInCart) in cart" :key="indexForItemInCart">
        {{itemInCart.name}}<span style="float:right;">Quantity: <input @focusout="updateCart(itemInCart, indexForItemInCart)" style="width:25px;margin-left:3px;padding:2px" type="number" v-model.number="itemInCart.quantity"></span><br>
        <span style="clear:right;float:right">Price: {{(itemInCart.quantity * itemInCart.unit_price).toFixed(2)}}</span>
        </li>
        <li style="margin:20px 10px 10px 0px;clear:right;float:right;font-size:24px;text-align:right">Total Before Tax: {{totalCost.toFixed(2)}}</li>
        <br>
        <li style="margin:10px 10px 10px 0px;clear:right;float:right;font-size:24px;">Estimate Tax: {{calTax.toFixed(2)}}</li>
        <br>
        <li style="margin:10px 10px 10px 0px;clear:right;float:right;font-size:24px;">Grand Total: {{(totalCost + calTax).toFixed(2)}}</li>
      </ul>
    <div class="checkout-form">
      <div style="padding: 0 10px">
      <p style="font-size:24px;margin-top:15px">Please fill every field up very carefully!</p>
      <div class="input-group ">
        <label for="newName">Recipient name:</label>
        <input style="font-size:20px" v-model="shipToName" type="text">
      </div>
      <div class="input-group ">
        <label for="newAddress">Recipient Address:</label>
        <input style="font-size:20px" v-model="shipToAddress" type="text">
      </div>
      <div v-if="!bankInfo.length" class="input-group">
        <label for="newBankName">Your bank name:</label>
        <input style="font-size:20px" v-model="selectedBankInfo.bankName" type="text">
      </div>
      <div v-else class="input-group">
         <button @click="showAddBankDiv" style="width:100%;backgroundColor:transparent;color:blue;margin-bottom:12px">Want to add a new bank account?</button>
        <div style="width:100%">
          <div>
            <label  for="newBankName">Bank name:</label>
          </div>
          <select style="width:80%;" v-model="selectedBankInfo.bankName">
            <option disabled value="">Please pick one</option>
            <option v-for="bank in bankInfo" :key="bank.card_number" :value="bank.bank_name">{{bank.bank_name}}</option>
          </select>
        </div>
      </div>
      <div v-if="!bankInfo.length" class="input-group" style="width:100">
        <label for="newBankAccount">Your bank account:</label>
        <input style="font-size:18px" v-model="selectedBankInfo.bankAccount" type="text">
      </div>
      <div v-else class="input-group">
        <div>
          <label for="newBankAccount">Bank account:</label>
        </div>
        <select style="width:80%" v-model="selectedBankInfo.bankAccount">
          <option disabled value="">Please pick one</option>
          <option v-for="bank in bankInfo" :key="bank.card_number" :value="bank.card_number">{{bank.card_number}}</option>
        </select>
      </div>
      <button @click="checkout" style="float:right;padding:20px;margin:10px 0;">Check Out</button>
      </div>
    </div>
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
    <div id="overlay" @click="closeAddBankDiv"></div>
    </div>
    <div v-else>
      <p style="font-size:40px;padding:20px;margin:10px">Thank you for your business!</p>
      <p style="font-size:25px;padding:20px;margin:10px">You order has been placed!</p>
      <p style="font-size:25px;padding:20px;margin:10px">Your confirmation number is {{confirmationID}}</p>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
const TAX_RATE = 0.0875
import Authentication from '@/services/Authentication'
import { Globals } from '@/services/Api'
export default {
  data: () => {
    return {
      user: Globals.user,
      cart: Globals.cart,
      bankInfo: [],
      selectedBankInfo: {
        bankName: null,
        bankAccount: null
      },
      shipToName: null,
      shipToAddress: null,
      showCart: false,
      btnD: 'Log out',
      showNote: false,
      hasNewBankInfo: true,
      newBankName: null,
      newBankAccount: null,
      orderSuccessful: false,
      confirmationID: null
    }
  },
  async created () {
    if(Globals.user.length === 0 && sessionStorage.getItem('user')){
      this.user = JSON.parse(sessionStorage.getItem('user'))
    }
    this.bankInfo = (await Authentication.getBankInfo({
      id: this.user[0].id
    })).data
    if(this.cart.length === 0 && sessionStorage.getItem('cart')) {
      this.cart = JSON.parse(sessionStorage.getItem('cart'))
    }
  },
  computed: {
    totalCost () {
      let total = 0
      for(let cartItem of this.cart){
        total+=cartItem.unit_price*cartItem.quantity
      }
      return total
    },
    calTax () {
      return (this.totalCost * TAX_RATE)
    }
  },
  methods: {
    updateCart (itemInCart, indexForItemInCart) {
      if(itemInCart.quantity < 0 ) itemInCart.quantity = 0
      if(itemInCart.quantity === 0 || itemInCart.quantity === "") this.cart.splice(indexForItemInCart, 1)
    },
    async checkout () {
      if(this.selectedBankInfo.bankName === null | this.selectedBankInfo.bankAccount === null | this.shipToName === null | this.shipToAddress === null){
        Globals.toastr.push({ type: 'error', message: 'Please fill in all fields!'})
        return
      }
      if(this.totalCost>0){
        if(confirm(`You will be changred for ${(this.totalCost + this.calTax).toFixed(2)} dollars.`)){
          try {
            if(this.bankInfo.length === 0){
              this.confirmationID = (await Authentication.checkout({
                id: this.user[0].id,
                shipToName: this.shipToName,
                shipToAddress: this.shipToAddress,
                bankInfo: this.selectedBankInfo,
                orderDetail: this.cart,
                totalCostbfTax: this.totalCost,
                tax: this.calTax,
                hasNewBankInfo: this.hasNewBankInfo
              })).data.confirmationId
              this.orderSuccessful = true
              this.cart = Globals.cart = []
              if(sessionStorage.getItem('cart')) sessionStorage.removeItem('cart')
            } else {
              this.confirmationID = (await Authentication.checkout({
                id: this.user[0].id,
                shipToName: this.shipToName,
                shipToAddress: this.shipToAddress,
                bankInfo: this.selectedBankInfo,
                orderDetail: this.cart,
                totalCostbfTax: this.totalCost,
                tax: this.calTax,
                hasNewBankInfo: !this.hasNewBankInfo
              })).data.confirmationId
              this.orderSuccessful = true
              this.cart = Globals.cart = []
              if(sessionStorage.getItem('cart')) sessionStorage.removeItem('cart')
            }
            
          } catch (error) {
            Globals.toastr.push({ type: 'error', message: error.response.data.error})
          }
        }
      } else {
        Globals.toastr.push({ type: 'error', message: 'Your cart is empty!' })
      }
    },
    toggleCart () {
      this.showCart = !this.showCart
    },
    toggleCart2 () {
      if(this.showCart) this.showCart=false
    },
    async addNewBankInfo () {
      try {
        await Authentication.addNewBankInfo({
          newBankName: this.newBankName,
          newBankAccount: this.newBankAccount,
          cus_id: this.user[0].id
        })
        Globals.toastr.push({ type: 'success', message: 'Bank account added successfully!'})
        this.bankInfo.push({
          bank_name: this.newBankName,
          card_number: this.newBankAccount
        })
        this.closeAddBankDiv()
      } catch (error) {
        Globals.toastr.push({ type: 'error', message: error.response.data.error})
      }
    },
    showAddBankDiv () {
      document.getElementsByClassName('loginPopup')[0].style.display = 'block'
      document.getElementById('overlay').classList.add('greyout')
    },
    closeAddBankDiv () {
      document.getElementById('overlay').classList.remove('greyout')
      document.getElementsByClassName('loginPopup')[0].style.display = 'none'
    },
    logOut () {
      if(confirm('Your order will be lost. Are you sure?')){
        this.user.pop()
        this.cart = []
        Globals.cart = []
        Globals.user = []
        if(sessionStorage.getItem('cart')) sessionStorage.removeItem('cart')
        if(sessionStorage.getItem('user')) sessionStorage.removeItem('user')
        this.btnD = 'Register/Login'
        this.$router.push('/')
      }
    }
  }
}
</script>

<style>

</style>