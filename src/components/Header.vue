<template>
<div style="background-color: darkgrey">
  <ul class="header-list">
    <li style="min-width:130px" class="header-list-item"><router-link style="font-weight:bold;font-size:25px;padding:30px 14px 12px 5px;font-family: Lucida Console" to="/">Flag Shipping</router-link></li>
    <li class="header-list-item"><router-link style="font-weight:bold" to="/products">Products</router-link></li>
    <li>
      <button title="Shopping-cart" class="btn-right-header"><i class="fas fa-shopping-cart fa-5x"></i></button>
    </li>
    <li>
      <button title="Question" class="btn-right-header" @click.stop="generalQuestion"><i class="fas fa-question-circle fa-5x"></i></button>
    </li>
    <li class="header-list-item">
        <slot name="customized1"></slot>
    </li>
    <li class="header-list-item">
        <slot name="customized2"></slot>
    </li>
    <li>
        <slot name="customized3"></slot>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  methods: {
  }
}
</script>

<style>
</style>
