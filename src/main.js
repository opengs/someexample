import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'
import VueToastr from 'vue-toastr'
import router from './router'

Vue.config.productionTip = false

Vue.use(VueToastr, {});

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
