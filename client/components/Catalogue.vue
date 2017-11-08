<template>
  <div class="catalogue">
    <h2>{{ $route.params.id }}</h2>
    <div class="loading" v-if="data === null">
      Loading...
    </div>
    <div class="result" v-if="data !== null">
      <p>Complete!</p>
      {{ data }}
    </div>
    <router-link to="/">Index</router-link>
  </div>
</template>

<script>
  import request from 'axios'
  export default {
    name: 'catalogue',
    data() {
      return {
        data: null
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
        Promise.resolve().then(() => {
          return request.get('/auth/status')
        }).then(result => {
          if (!result.data.session) {
            window.location = `/auth/twitter?from=/catalogue/${this.$route.params.id}`
            return Promise.reject()
          }
        }).then(() => {
          request.get(`/api/catalogue/${this.$route.params.id}`).then(result => {
            this.data = result.data
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
