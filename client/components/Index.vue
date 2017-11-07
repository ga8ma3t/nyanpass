<template>
  <div class="index">
    <h1>{{ msg }}</h1>
    <router-link to="/catalogue/example">Catalogue</router-link>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data () {
      return {
        msg: 'It works!'
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
