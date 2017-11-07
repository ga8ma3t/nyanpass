import Vue from 'vue'
import Router from 'vue-router'
import Index from './components/Index.vue'
import Catalogue from './components/Catalogue.vue'
import request from 'axios'

const isSession = !!document.getElementById('app').dataset.session
console.log(isSession)
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
      component: Catalogue,
      meta: {
        auth: true
      }
    },

  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.auth)) {
    request.get('/auth/status').then(result => {
      if (!result.data.session) {
        window.location = '/auth/twitter'
      } else {
        next()
      }
    })
  } else {
    next()
  }
})

export default router
