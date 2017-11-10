<template>
  <div id="app">
    <el-container>
      <el-header>
        <header-menu :session="session"></header-menu>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import request from 'axios'
  import ElMain from '../node_modules/element-ui/packages/main/src/main.vue'
  import ElContainer from '../node_modules/element-ui/packages/container/src/main.vue'
  import HeaderMenu from './components/HeaderMenu.vue'
  export default {
    components: {
      ElContainer,
      ElMain,
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
