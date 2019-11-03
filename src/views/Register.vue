<template>
  <div>
    <Header></Header>
    <div style="width:70%;margin-top:40px;left:15%;position:relative">
      <div class="input-group register-input-group">
        <label for="newUsername">Username:</label>
        <input id="newUsername" type="text">
      </div>
      <div class="input-group register-input-group">
        <label for="newpassword">Password:</label>
        <input id="newPassword" type="password">
      </div>
      <div class="input-group register-input-group">
        <label for="confirmNewPassword">Confirm Password:</label>
        <input id="confirmNewPassword" type="password">
      </div>
      <div class="input-group">
        <label style="font-size:20px;width:20%">I'm</label>
        <input type="radio" name="identity" value="individual" checked><span style="font-size:18px"> An individual person</span>
        <input type="radio" name="identity" value="company"><span style="font-size:18px"> A company</span>
      </div>
      <div class="input-group register-input-group">
        <label for="newName">Name:(optional)</label>
        <input id="newName" type="text">
      </div>
      <div class="input-group register-input-group">
        <label for="newAddress">Address:(optional)</label>
        <input id="newAddress" type="text">
      </div>
      <div class="input-group register-input-group">
        <label for="newBankname">Bank name:(optional)</label>
        <input id="newBankname" type="text">
      </div>
      <div class="input-group register-input-group">
        <label for="newBankAccount">Bank account:(optional)</label>
        <input id="newBankAccount" type="text">
      </div>
      <div class="div-button">
        <button style="float:right;width:80px;padding:15px;margin:5px;text-align:center" @click="register">Register</button>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
export default {
  methods: {
    register () {
    }
  }
}
</script>
<style>
</style>
