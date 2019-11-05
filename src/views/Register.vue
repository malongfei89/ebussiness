<template>
  <div>
    <Header></Header>
    <div style="width:70%;margin-top:40px;left:15%;position:relative">
      <div class="input-group register-input-group">
        <label for="newUsername">Username:</label>
        <input id="newUsername" v-model="newUsername" type="text">
      </div>
      <div class="input-group register-input-group">
        <label for="newPassword">Password:</label>
        <input id="newPassword" v-model="newPassword" type="password">
      </div>
      <div class="input-group register-input-group">
        <label for="confirmNewPassword">Confirm Password:</label>
        <input id="confirmNewPassword" v-model="confirmNewPassword" type="password">
      </div>
      <div class="input-group">
        <label style="font-size:20px;width:20%">I'm</label>
        <input type="radio" name="identity" v-model="identity" value="individual" checked><span style="font-size:18px"> An individual person</span>
        <input type="radio" name="identity" v-model="identity" value="company"><span style="font-size:18px"> A company</span>
      </div>
      <div class="input-group register-input-group">
        <label for="newName">Name:(optional)</label>
        <input id="newName" v-model="newName" type="text">
      </div>
      <div class="input-group register-input-group">
        <label for="newAddress">Address:(optional)</label>
        <input id="newAddress" v-model="newAddress" type="text">
      </div>
      <div class="input-group register-input-group">
        <label for="newBankName">Bank name:(optional)</label>
        <input id="newBankName" v-model="newBankName" type="text">
      </div>
      <div class="input-group register-input-group">
        <label for="newBankAccount">Bank account:(optional)</label>
        <input id="newBankAccount" v-model="newBankAccount" type="text">
      </div>
      <div class="div-button">
        <button style="float:right;width:80px;padding:15px;margin:5px;text-align:center" @click="register">Register</button>
      </div>
    </div>
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
      newBankAccount: null
    }
  },
  methods: {
    async register () {
      try {
        await Authentication.register({
          name: this.newName,
          username: this.newUsername,
          password: this.newPassword,
          address: this.newAddress,
          bank_name: this.newBankName,
          card_number: this.newBankAccount
        })
      } catch (error) {
        console.log(error.response.data)
        Globals.error = error.response.data
      }
    }
  }
}
</script>
<style>
</style>
