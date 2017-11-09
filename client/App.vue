<template>
  <div id="app">
    <el-container>
      <el-header>
        <router-link to="/"><h1>にゃんぱす！v2</h1></router-link>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>
        <ul>
          <li>
            <router-link to="/about"><p>このサイトについて</p></router-link>
          </li>
          <li v-if="session">
            <a href="/auth/logout"><p>ログアウト</p></a>
          </li>
        </ul>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
  import request from 'axios'
  import ElMain from '../node_modules/element-ui/packages/main/src/main.vue'
  import ElContainer from '../node_modules/element-ui/packages/container/src/main.vue'
  export default {
    components: {
      ElContainer,
      ElMain
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
