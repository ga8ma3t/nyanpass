import Vue from 'vue'
import Router from 'vue-router'
import Index from './pages/Index.vue'
import Catalogues from './pages/Catalogues.vue'
import About from './pages/About.vue'

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
    },
    {
      path: '/auth/*',
      meta: {
        forceReload: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  window.gtag('config', 'UA-82809079-2', {'page_path': to.path})
  if (to.matched.some(record => record.meta.forceReload)) {
    location.href = to.path
  } else {
    next()
  }
})

export default router
