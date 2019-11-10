<template>
  <div @click="toggleCart2">
    <Header @toggleCart="toggleCart"></Header>
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
      <div style="display:flex;justify-content:flex-start;margin:20px">
        <button @click="$router.push('/products')" class="cart-btn">Continue<br>shopping</button>
      </div>
    </ul>
    <div style="display:flex;justify-content:center;">
      <ul class="checkout-div">
        <li class="cart-li" v-for="(itemInCart, indexForItemInCart) in cart" :key="indexForItemInCart">
        {{itemInCart.name}}<span style="float:right;display:flex;">Quantity: <input @focusout="updateCart(itemInCart, indexForItemInCart)" style="width:25px;margin-left:3px;padding:2px" type="number" v-model.number="itemInCart.quantity"></span><br>
        <span style="clear:right;float:right">Price: {{(itemInCart.quantity * itemInCart.unit_price).toFixed(2)}}</span>
        </li>
        <li style="margin:20px 10px 10px 0px;clear:right;float:right;font-size:24px;text-align:right">Total Before Tax: {{totalCost}}</li>
        <br>
        <li style="margin:10px 10px 10px 0px;clear:right;float:right;font-size:24px;">Estimate Tax: {{calTax}}</li>
        <br>
        <li style="margin:10px 10px 10px 0px;clear:right;float:right;font-size:24px;">Grand Total: {{(parseFloat(totalCost) + parseFloat(calTax)).toFixed(2)}}</li>
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
         <button @click="addNewBankInfo" style="width:100%;backgroundColor:transparent;color:blue;margin-bottom:12px">Want to add a new bank account?</button>
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
    <Footer></Footer>
  </div>
</template>

<script>
//implement add new bank account
//potentially add new bank account here into customer's account(db)
const TAX_RATE = 0.0875
import Authentication from '@/services/Authentication'
import { Globals } from '@/services/Api'
export default {
  data: () => {
    return {
      user: Globals.user,
      cart: Globals.cart,
      bankInfo: [],
      bankAccount: null,
      bankName: null,
      selectedBankInfo: {
        bankName: null,
        bankAccount: null
      },
      shipToName: null,
      shipToAddress: null,
      showCart: false
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
      return total.toFixed(2)
    },
    calTax () {
      return (this.totalCost * TAX_RATE).toFixed(2)
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
      if(confirm(`You will be changred for ${(parseFloat(this.totalCost) + parseFloat(this.calTax)).toFixed(2)} dollars.`)){
        try {
          await Authentication.checkout({
            id: this.user[0].id,
            shipToName: this.shipToName,
            shipToAddress: this.shipToAddress,
            bankInfo: this.selectedBankInfo,
            orderDetail: this.cart,
            totalCostbfTax: this.totalCost,
            tax: this.calTax
          })
        } catch (error) {
          Globals.toastr.push({ type: 'error', message: error.response.data.error})
        }
      }
    },
    toggleCart () {
      this.showCart = !this.showCart
    },
    toggleCart2 () {
      if(this.showCart) this.showCart=false
    },
    addNewBankInfo () {
      alert('coming soon!')
    }
  }
}
</script>

<style>

</style>