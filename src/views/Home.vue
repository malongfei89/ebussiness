<template>
<div @click="closeLoginPopup">
  <Header>
    <template #customized1>
      <button style="font-weight:bold;padding:46px 0;width:100%" @click.stop="showLoginPopup">Register/Login</button>
    </template>
  </Header>
  <main>
    <div id="home-main">
    <div style="margin:0;padding:0">
      <img style="width:66%;float:left" src="@/assets/home-page-pic.jpg" alt="fast shipping">
    </div>
    <div class="loginPopup" @click.stop>
      <button @click="closeLoginPopup" style="float:right;width:40px;height:40px;background-color:transparent;font-size:30px">&times;</button>
      <div style="top:15%;left:15%;width:70%;height:80%;position:absolute">
        <div class="input-group login-input-group">
          <label for="username">Username:</label>
          <input id="username" type="text">
        </div>
        <div class="input-group login-input-group">
          <label for="password">Password:</label>
          <input id="password" type="password">
        </div>
        <div class="div-button" style="height:15%;">
          <button style="float:right;height:85%;width:65px;min-width:65px;">Login</button>
        </div>
        <p style="width:100%;height:15%;float:right">No account yet? click <router-link class="noback" to="/register">here</router-link> to Register</p>
      </div>
    </div>
    <div id="home-description"><p>
      Here, We provide you with fast and Accurate shipping experience. Leave your package to us, and be worry free!
    </p>
    </div>
    </div>
  </main>
  <div id="overlay"></div>
  <Footer></Footer>
</div>
</template>

<script>
export default {
  methods: {
    generalQuestion () {
      alert('I know you have a question!')
    },
    closeLoginPopup () {
      document.getElementById('overlay').classList.remove('greyout')
      document.getElementsByClassName('loginPopup')[0].style.display = 'none'
    },
    showLoginPopup () {
      document.getElementsByClassName('loginPopup')[0].style.display = 'block'
      document.getElementById('overlay').classList.add('greyout')
    }
  }
}
</script>

<style>
</style>
