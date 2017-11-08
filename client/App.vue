<template>
  <div id="app">
    <router-link to="/"><h1>にゃんぱす！v2</h1></router-link>
    <router-view></router-view>
    <router-link to="/about"><p>このサイトについて</p></router-link>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
