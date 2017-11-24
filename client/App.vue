<template>
  <div id="app">
    <header>
      <div class="container">
        <router-link to="/"><h1>にゃんぱす！</h1></router-link>
      </div>
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
    color: #444444;
  }
  .container {
    margin: 0 auto;
    padding: 0 10px;
    @media screen and (min-width: 635px) {
      max-width: 600px;
    }
    @media screen and (min-width: 835px) {
      max-width: 800px;
    }
    @media screen and (min-width: 1035px) {
      max-width: 1000px;
    }
  }
  header {
    height: 50px;
    margin: 0 auto;
    border-bottom: 1px solid #eeeeee;
  }
  h2 {
    font-size: 32px;
    padding: 20px 0;
  }
  h3 {
    font-size: 22px;
    padding: 20px 0;
  }
</style>
