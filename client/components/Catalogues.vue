<template>
  <div class="catalogues">
    <h2>{{event.name}}</h2>
    <div v-if="isRequireLogin">
      <a :href="`/auth/twitter?from=/catalogues/${this.$route.params.id}`">Twitterと連携する</a>
    </div>
    <div v-else-if="event === null || friendList === null">
      よみこみちゅう...
    </div>
    <div v-else>
      <p>{{friendList.length}}件のフレンドが見つかりました</p>
      <ul>
        <li v-for="friend in friendList">
          <h4>
            {{friend.name}}<span> @{{friend.twitterName}}</span>
          </h4>
          <p>
            <template v-if="friend.space.date">{{friend.space.date}}日目 </template>
            <template v-if="friend.space.district">{{friend.space.district}}地区 </template>
            "{{friend.space.block}}"ブロック-{{friend.space.space}}
            <template v-if="friend.space.name">「{{friend.space.name}}」</template>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import request from 'axios'
  export default {
    name: 'catalogues',
    data() {
      return {
        event: null,
        friendList: null,
        isRequireLogin: false
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
        return Promise.resolve().then(() => {
          return request.get(`/api/events/${this.$route.params.id}`).then(result => {
            this.event = result.data
          })
        }).then(() => {
          return request.get(`/api/catalogues/${this.$route.params.id}`).then(result => {
            this.friendList = result.data
            this.friendList = this.friendList.map(friend => {
              return {
                id: friend.id,
                name: friend.name,
                twitterId: friend.twitterId,
                twitterName: friend.twitterName,
                space: friend.spaces[0]
              }
            })
          })
        }).catch(() => {
          this.isRequireLogin = true
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
