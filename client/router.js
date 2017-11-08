import Vue from 'vue'
import Router from 'vue-router'
import Index from './components/Index.vue'
import Catalogue from './components/Catalogue.vue'
import About from './components/About.vue'
import request from 'axios'

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
      path: '/catalogue/:id',
      name: 'Catalogue',
      component: Catalogue
    },
    {
      path: '/about',
      name: 'About',
      component: About
    }
  ]
})
export default router
