<template>
  <div class="catalogue">
    <h2>{{event.name}}</h2>
    <div class="loading" v-if="event === null || friendList === null">
      Loading...
    </div>
    <div class="result" v-else>
      <p>{{friendList.length}}件のフレンドが見つかりました</p>
      <ul>
        <li v-for="friend in friendList">
          <h4>
            {{friend.name}}<span> @{{friend.twitterName}}</span>
          </h4>
          <p>
            <template v-if="friend.spaces[0].date">{{friend.spaces[0].date}}日目 </template>
            <template v-if="friend.spaces[0].district">{{friend.spaces[0].district}}地区 </template>
            "{{friend.spaces[0].block}}"ブロック-{{friend.spaces[0].space}}
            <template v-if="friend.spaces[0].name">「{{friend.spaces[0].name}}」</template>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import request from 'axios'
  export default {
    name: 'catalogue',
    data() {
      return {
        event: null,
        friendList: null
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
            this.friendList = result.data
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
