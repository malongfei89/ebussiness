<template>
  <div @click="toggleCart">
    <Header @toggleCart="showCart = !showCart">
      <template #customized1>
      <button style="font-weight:bold;padding:46px 0;width:100%;min-width:94px" @click="showLoginPopup=true">{{btnD}}</button>
    </template>
    </Header>
    <Cart
    :cart = "cart"
    :showCart = "showCart"
    @emptyCart = "emptyCart"
    @updateCart = "updateCart"
    ></Cart>
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
      user: Globals.user,
      showCart: false,
      showLoginPopup: false
    }
  },
  computed: {
    btnD: function () {
        return this.user.length?'Log out':'Register/Login'
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
    updateCart (item, index) {
      if(item.quantity < 0 ) item.quantity = 0
      if(!item.quantity) this.cart.splice(index, 1)
    },
    toggleCart () {
      if(this.showCart) this.showCart=false
    },
    emptyCart(){
      this.cart = Globals.cart = []
    }
  }
}
</script>
<style>
</style>
