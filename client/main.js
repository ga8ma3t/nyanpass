import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {
  Container,
  Header,
  Main,
  Footer,
  Row,
  Col,
  Button
} from 'element-ui'

// Layouts
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Row)
Vue.use(Col)

// Forms
Vue.use(Button)

export default new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
