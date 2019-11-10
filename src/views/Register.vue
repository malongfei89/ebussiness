<template>
  <div>
    <Header></Header>
    <div class="form-div" style="min-width:340px">
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
        this.$router.push('/')
        Globals.toastr.push({ type: 'success', message: `You've been successfully registered!`})
      } catch (error) {
        Globals.toastr.push({ type: 'error', message: error.response.data.error})
      }
    }
  }
}
</script>
<style>
</style>
