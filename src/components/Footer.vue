<template>
  <footer id="home-footer">
    <div id="footer-list">
      <p style="padding:5px">
        Flag shipping Inc.
        200 Main st. Huguenot
        NY 99999
      </p>
      <p>800-888-8888</p>
      <p>
        Follow us on
      <router-link class="noback" to="/">facebook</router-link>
      </p>
    </div>
  </footer>
</template>

<script>
export default {

}
</script>

<style>
#home-footer{
  clear:both;
}
#footer-list{
  height:100px;
  background-color: rgb(169,169,169);
}
</style>
