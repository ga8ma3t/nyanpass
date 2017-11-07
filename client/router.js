import Vue from 'vue'
import Router from 'vue-router'
import Index from './components/Index.vue'
import Catalogue from './components/Catalogue.vue'

Vue.use(Router)

export default new Router({
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

  ]
})
