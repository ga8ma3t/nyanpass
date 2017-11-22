<template>
  <div id="app">
    <div class="container">
      <header-menu :session="session"></header-menu>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import request from 'axios'
  import HeaderMenu from './components/HeaderMenu.vue'
  export default {
    components: {
      HeaderMenu
    },
    name: 'app',
    data() {
      return {
        session: null // TODO globalから見れるようにするか、propsみたいに渡したい
      }
    },
    created() {
      this.initialize()
    },
    watch: {
      '$route': 'initialize'
    },
    methods: {
      initialize() {
        request.get('/auth/status').then(result => {
          this.session = result.data.session
        })
      }
    }
  }
</script>

<style lang="scss">
  #app {
    font-family: "Helvetica Neue", Helvetica, "Hiragino Sans GB", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
