<template>
  <div id="app">
    <div style="position:absolute;z-index:2;left:20%;width:80%;transform:translate(-12.5%,-14%);text-align:center;top:14%">
       <div :id="`toast-${index}`" v-for="(toast, index) in newToast" :key="index" @click="resetToastr(index)" @animationend="resetToastr(index)" :style="{backgroundColor:toast.type==='error'?error:success}" class="toastr-block">
        {{toast.message}}
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
//throttle the toastr push
import { Globals } from '@/services/Api'
export default {
  data: () => {
    return{
      error: 'rgb(240, 110, 121)',
      success: 'rgb(144, 208, 248)',
      newToast: Globals.toastr
    }
  },
  name: 'App',
  computed:{
  },
  methods: {
    resetToastr (index) {
      document.getElementById(`toast-${index}`).style.display = 'none'
      this.newToast.pop()
    }
  }
}
</script>

<style>
</style>
