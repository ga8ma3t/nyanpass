<template>
  <div id="app">
    <header>
      <router-link to="/"><h1>にゃんぱす！v2</h1></router-link>
    </header>
    <router-view></router-view>
    <footer>
      <ul>
        <li>
          <router-link to="/about"><p>このサイトについて</p></router-link>
        </li>
        <li v-if="session">
          <a href="/auth/logout"><p>ログアウト</p></a>
        </li>
      </ul>
    </footer>
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
