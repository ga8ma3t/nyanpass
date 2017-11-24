<template>
  <div id="app">
    <header>
      <router-link to="/"><h1>にゃんぱす！</h1></router-link>
    </header>
    <router-view></router-view>
    <footer>
      <li v-if="session" class="right"><router-link to="/auth/logout"><p>ログアウト</p></router-link></li>
      <li v-else class="right"><router-link to="/auth/twitter"><p>ログイン</p></router-link></li>
      <li class="right"><router-link to="/about"><p>このサイトについて</p></router-link></li>
    </footer>
  </div>
</template>

<script>
  import request from 'axios'
  export default {
    components: {
      //
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
  .container {
    margin: 0 auto;
    @media screen and (min-width: 615px) {
      max-width: 600px;
    }
    @media screen and (min-width: 815px) {
      max-width: 800px;
    }
    @media screen and (min-width: 1015px) {
      max-width: 1000px;
    }
  }
  header {
    height: 70px;
    margin: 0 auto;
    @media screen and (min-width:768px) {
      margin: inherit;
    }
  }
</style>
