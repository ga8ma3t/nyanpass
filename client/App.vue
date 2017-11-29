<template>
  <div id="app">
    <header-component></header-component>
    <router-view></router-view>
    <footer-component :session="session"></footer-component>
  </div>
</template>

<script>
  import request from 'axios'
  import HeaderComponent from './components/Header.vue'
  import FooterComponent from './components/Footer.vue'
  export default {
    components: {
      HeaderComponent,
      FooterComponent
    },
    name: 'app',
    data() {
      return {
        session: null
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
    background: #fafafa;
  }
  #app {
    font-family: "Helvetica Neue", Helvetica, "Hiragino Kaku Gothic ProN", Arial, sans-serif;
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
  h2 {
    font-size: 32px;
    padding: 20px 0;
  }
  h3 {
    font-size: 24px;
    padding: 20px 0;
  }
  button {
    margin: 20px;
    padding: 10px 40px;
    font-size: 16px;
    border: none;
    border-radius: 3px;
    background-color: #00aced;
    color: #ffffff;
    cursor: pointer;
  }
  li {
    list-style: none;
  }
  .center {
    margin: 0 auto;
    text-align: center;
  }
</style>
