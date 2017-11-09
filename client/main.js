import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { Button } from 'element-ui'

Vue.use(Button)

export default new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
