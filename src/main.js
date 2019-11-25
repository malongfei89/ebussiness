// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Popup from '@/components/Popup.vue'
import B2BDescription from '@/components/B2BDescription.vue'
import '@/assets/main.css'
import { Globals } from '@/services/Api'

Vue.config.productionTip = false
Vue.component('Header', Header)
Vue.component('Footer', Footer)
Vue.component('B2BDescription', B2BDescription)
Vue.component('Popup', Popup)
/* eslint-disable no-new */
new Vue({
  created() {
    window.addEventListener('beforeunload', this.writeToL)
    //window.addEventListener('load', this.readFromL)
  },
  methods: { 
    // readFromL: () => {
    //   Globals.grabFromL()
    // },
    writeToL: () => {
      Globals.persist()
    }
  },
  router,
  render: h => h(App)
}).$mount('#app')
