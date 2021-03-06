import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Products from '@/views/Products.vue'
import { Globals } from '@/services/Api'
import Register from '@/views/Register.vue'
import CheckOut from '@/views/CheckOut.vue'
Vue.use(Router)

const router = new Router({
  base: '/e/b-f19-08',
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/products',
      name: 'Products',
      component: Products
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/checkout',
      name: 'CheckOut',
      component: CheckOut
    }
  ]
})
router.beforeEach((to, from, next) => {
  while(Globals.toastr.length > 0) {
    Globals.toastr.pop()
  }
  if(to.name === 'CheckOut') {
    if(!Globals.user.length) {
      Globals.toastr.push({
        type: 'error',
        message: 'Please log in first!'
      })
      return
    }
    next()
  } else next()
})
export default router