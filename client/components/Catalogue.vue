<template>
  <div class="catalogue">
    <h2>{{event.name}}</h2>
    <div class="loading" v-if="data === null">
      Loading...
    </div>
    <div class="result" v-if="data !== null">
      <p>{{circleList.length}}件</p>
      <ul>
        <li v-for="circle in circleList">
          <h4>{{circle.name}}</h4>
          <p>{{circle.district}}地区"{{circle.block}}"ブロック{{circle.space}}</p>
        </li>
      </ul>
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
        event: null,
        circleList: null
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
          request.get(`/api/events/${this.$route.params.id}`).then(result => {
            this.event = result.data
          })
        }).then(() => {
          request.get(`/api/catalogues/${this.$route.params.id}`).then(result => {
            this.circleList = result.data
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
