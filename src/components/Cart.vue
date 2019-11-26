<template>
  <transition name="cart">
    <ul v-if="showCart" @click.stop class="cart-ul">
      <div v-if="cart.length">
        <li class="cart-li" v-for="(item, index) in cart" :key="index">
          {{item.name}}<span style="float:right;padding-left:4px;display:flex;">&times;<input @focusout="$emit('updateCart',item, index)" style="width:25px;margin-left:3px;padding:2px" type="number" min="0" v-model.number="item.quantity"></span><br>
          <span style="clear:both;float:right">Price: {{item.quantity>0?(item.quantity * item.unit_price).toFixed(2):0}}</span>
        </li>
      </div>
      <div style="margin:50px;padding:20px 5px;font-size:24px;text-align:center" v-else>
        Nothing has been added to your cart yet!
      </div>
      <div style="display:flex;justify-content:space-around;margin:20px">
        <button @click="$emit('toProducts')" class="cart-btn">Continue<br>shopping</button>
        <button v-if="cart.length" @click="$emit('toCheckOut')" class="cart-btn">Check<br> Out</button>
        <button v-if="cart.length" @click="$emit('emptyCart')" class="cart-btn">Empty<br> Cart</button>
      </div>
    </ul>
    </transition>
</template>

<script>
export default {
    props:['cart','showCart']
}
</script>

<style>

</style>