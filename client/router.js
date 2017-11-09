import Vue from 'vue'
import Router from 'vue-router'
import Index from './components/Index.vue'
import Catalogues from './components/Catalogues.vue'
import About from './components/About.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/catalogues/:id',
      name: 'Catalogues',
      component: Catalogues
    },
    {
      path: '/about',
      name: 'About',
      component: About
    }
  ]
})
export default router
