<template>
  <div class="catalogue">
    <h1>{{ $route.params.id }}</h1>
    <router-link to="/">Index</router-link>
    <a href="/auth/twitter">aaa</a>
  </div>
</template>

<script>
  export default {
    name: 'catalogue',
    data () {
      return {
        //
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
