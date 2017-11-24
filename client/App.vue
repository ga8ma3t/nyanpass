<template>
  <div id="app">
    <header-component></header-component>
    <router-view></router-view>
    <footer-component :session="session"></footer-component>
  </div>
</template>

<script>
  import request from 'axios'
  import HeaderComponent from './components/header'
  import FooterComponent from './components/footer'
  export default {
    components: {
      HeaderComponent,
      FooterComponent
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
  html {
    background-color: #555555;
  }
  body {
    background-color: #ffffff;
  }
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
  button {
    margin: 20px;
    padding: 10px 40px;
    font-size: 16px;
    border: none;
    border-radius: 3px;
    background-color: #54b2ff;
    color: #ffffff;
  }
  li {
    list-style: none;
  }
  .center {
    text-align: center;
  }
</style>
