<template>
  <div class="catalogues">
    <h2>{{event.name}}</h2>
    <div>
      <h3>フレンドのサークル</h3>
      <div v-if="isRequireLogin">
        <p>Twitterアカウントと連携すると、フォローしているフレンドのサークル一覧を表示できます</p>
        <a :href="`/auth/twitter?from=/catalogues/${this.$route.params.id}`">
          <button>Twitterと連携する</button>
        </a>
      </div>
      <div v-else>
        <circle-card :circle-list="friendList"></circle-card>
      </div>
    </div>

    <div>
      <h3>おすすめのサークル</h3>
      <circle-card :circle-list="recommendList"></circle-card>
    </div>
  </div>
</template>

<script>
  import request from 'axios'
  import CircleCard from '../components/CircleCard.vue'
  export default {
    components: {
      CircleCard
    },
    name: 'catalogues',
    data() {
      return {
        event: null,
        friendList: null,
        recommendList: null,
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
            this.recommendList = result.data
            this.recommendList = this.recommendList.map(recommend => {
              return {
                id: recommend.id,
                name: recommend.name,
                imageUrl: recommend.imageUrl,
                twitterId: recommend.twitterId,
                twitterName: recommend.twitterName,
                space: recommend.spaces[0]
              }
            })
          })
        }).then(() => {
          return request.get(`/api/catalogues/${this.$route.params.id}/friends`).then(result => {
            this.friendList = result.data
            this.friendList = this.friendList.map(friend => {
              return {
                id: friend.id,
                name: friend.name,
                imageUrl: friend.imageUrl,
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
