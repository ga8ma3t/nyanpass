<template>
  <div id="app">
    <router-link to="/"><h1>にゃんぱす！v2</h1></router-link>
    <router-view></router-view>
    <router-link to="/about"><p>このサイトについて</p></router-link>
    <a href="/auth/logout" v-if="session"><p>ログアウト</p></a>
  </div>
</template>

<script>
  import request from 'axios'
  export default {
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
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
