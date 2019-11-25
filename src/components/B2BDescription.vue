<template>
  <div class="note-B2B">
      <button style="font-size:20px;padding:10px" @click="$emit('closeNote')">Got it</button>
      <p>Here is the information for making B2B order:</p>
      <p><b>Port</b>: 11089</p>
      <p><b>Data</b> you need to send in along: </p>
      <p><b>Username</b>: your username,</p>
      <p><b>Password</b>: password for your username,</p>
      <p><b>Order Details</b>:</p>
      <p> 1.Case-insensitive.</p>
      <p style="margin-left:10px;">
        ex. If you choose 'Next-day Deliver', 'next-day deliver' will work
      </p>
      <p>
        2.Please put name of product and quantity you will order in JSON object
      </p>
      <p style="margin-left:10px;">
        ex. {name: 'Next-day Deliver', quantity: 1}
      </p>
      <p>
        3.If you select more than one product, please put all your products in an array
      </p>
      <p style="margin-left:10px;">
        ex. [{name: 'Next-day Deliver', quantity: 2}, 
      </p>
      <p style="margin-left:35px;">
      {name: 'Regular Shipping', quantity: 1}]
      </p>
      <p><b>Bank Information</b>:</p>
      <p>
        Please put name of bank and account number in JSON object
      </p>
      <p style="margin-left:10px;">
        ex. {bankName: 'bank of america', 
      </p>
      <p style="margin-left:45px;">
      bankAccount: 12345678914}
      </p>
      <p><b>Recipient Information</b>:</p>
      <p>
        Please put name and address of recipient in JSON object
      </p>
      <p style="margin-left:10px;">
        ex. {shipToName: 'Lyn', 
      </p>
      <p style="margin-left:45px;">
      shipToAddress: '0 main st new paltz NY 12561'}
      </p>
      <p><b>Complete Example:(please use the same key names)</b>:</p>
      <p>{</p>
      <p>username: 123,</p>
      <p>password: 123,</p>
      <p>orderDetail: </p>
      <p style="margin-left:10px;">
        [{name: 'Next-day Deliver', quantity: 2}, 
      </p>
      <p style="margin-left:11px;">
      {name: 'Regular Shipping', quantity: 1}],
      </p>
      <p>bankInfo: </p>
       <p style="margin-left:10px;">
        {bankName: 'bank of america', 
      </p>
      <p style="margin-left:16px;">
      bankAccount: 12345678914},</p>
      <p>shippingInfo: </p>
      <p style="margin-left:10px;">
        {shipToName: 'Lyn', 
      </p>
      <p style="margin-left:15px;">
      shipToAddress: '0 main st new paltz NY 12561'}
      </p>
      <p>}</p>
      </div>
</template>

<script>
export default {

}
</script>

<style>

</style>