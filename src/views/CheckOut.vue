<template>
  <div @click="toggleCart2">
    <Header @toggleCart="toggleCart" @showNote="showNote = !showNote">
      <template #customized1>
            <button style="font-weight:bold;width:100%;padding:46px 0;min-width:94px" @click="logOut">{{btnD}}</button>
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
      <div style="display:flex;justify-content:center;margin:20px">
        <button @click="$router.push('/products')" class="cart-btn">Continue<br>shopping</button>
      </div>
    </ul>
    </transition>
    <div v-if="!orderSuccessful">
      <Popup
        btnValue = "Add" 
        type1 = "text"
        type2 = "text"
        label1 = "Bank Name: "
        label2 = "Account number: "
        :showPopup = "showAddBankPopup"
        forLabel1 = "bankname"
        forLabel2 = "bankaccount"
        @finished = "addNewBankInfo($event)"
        @closePopup = "showAddBankPopup = false"
        >
      </Popup>
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
            <input id="newBankName" style="font-size:20px" v-model="selectedBankInfo.bankName" type="text">
            <label for="newBankAccount">Your bank account:</label>
            <input id="newBankAccount" style="font-size:18px" v-model="selectedBankInfo.bankAccount" type="text">
          </div>
          <div v-else class="input-group">
            <button @click="showAddBankPopup = true" style="width:100%;backgroundColor:transparent;color:blue;margin-bottom:12px">Want to add a new bank account?</button>
            <div style="width:100%">
              <div>
                <label>Bank Account:</label>
              </div>
              <select style="width:80%;" v-model="selectedBankInfo">
                <option disabled value="">Please pick one</option>
                <option v-for="bank in bankInfo" :key="bank.card_number" :value="{bankName:bank.bank_name, bankAccount: bank.card_number}">{{bank.bank_name}} ----- {{bank.card_number}}</option>
              </select>
            </div>
          </div>
          <button @click="checkout" style="float:right;padding:20px;margin:10px 0;">Check Out</button>
          </div>
        </div>
      </div>
      <B2BDescription v-else @closeNote="showNote=false"></B2BDescription>
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
      showNote: false,
      hasNewBankInfo: true,
      orderSuccessful: false,
      confirmationID: null,
      showAddBankPopup: false
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
    this.bankInfo = (await Authentication.getBankInfo({
      id: this.user[0].id
    })).data
  },
  computed: {
    totalCost () {
      let total = 0
      for(let cartItem of this.cart){
        total+=cartItem.unit_price*cartItem.quantity
      }
      return total
    },
    btnD: function () {
        return this.user.length?'Log out':'Register/Login'
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
              if(sessionStorage.getItem(`cart${this.user[0].id}`)) sessionStorage.removeItem(`cart${this.user[0].id}`)
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
              if(sessionStorage.getItem(`cart${this.user[0].id}`)) sessionStorage.removeItem(`cart${this.user[0].id}`)
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
    async addNewBankInfo (credential) {
      try {
        await Authentication.addNewBankInfo({
          newBankName: credential.value1,
          newBankAccount: credential.value2,
          cus_id: this.user[0].id
        })
        Globals.toastr.push({ type: 'success', message: 'Bank account added successfully!'})
        this.bankInfo.push({
          bank_name: credential.value1,
          card_number: credential.value2
        })
        this.showAddBankPopup = false
      } catch (error) {
        Globals.toastr.push({ type: 'error', message: error.response.data.error})
      }
    },
    logOut () {
      if(confirm('Your order will be lost. Are you sure?')){
        localStorage.setItem(`cart${this.user[0].id}`, JSON.stringify(this.cart))
        this.cart= Globals.cart = []
        this.user.pop()
        if(sessionStorage.getItem('user')) sessionStorage.removeItem('user')
        this.$router.push('/')
      }
    }
  }
}
</script>

<style>

</style>