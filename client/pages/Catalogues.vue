<template>
  <div class="catalogues">

    <div class="event-wrapper">
      <div class="container">
        <h2>{{event.name}}</h2>
        <p>場所：{{event.place}}(未実装) 日付：{{event.date}}</p>
      </div>
    </div>

    <div class="catalogue-wrapper">
      <div class="container">
        <h3>ブックマークしたサークル</h3>
        <div class="center" v-if="isRequireLogin">
          <img src="/images/login.png">
          <p>Twitterアカウントを連携すると、サークルをブックマークできます</p>
          <a :href="`/auth/twitter?from=/catalogues/${this.$route.params.id}`">
            <button>Twitterと連携する</button>
          </a>
        </div>
        <div v-else>
          <Loading v-show="!bookmarkList"></Loading>
          <circle-card :circle-list="bookmarkList"></circle-card>
        </div>
      </div>
    </div>

    <div class="catalogue-wrapper">
      <div class="container">
        <h3>フレンドのサークル</h3>
        <div class="center" v-if="isRequireLogin">
          <img src="/images/login.png">
          <p>Twitterアカウントを連携すると、フォローしているフレンドのサークル一覧を表示できます</p>
          <a :href="`/auth/twitter?from=/catalogues/${this.$route.params.id}`">
            <button>Twitterと連携する</button>
          </a>
        </div>
        <div v-else>
          <Loading v-show="!friendList"></Loading>
          <circle-card :circle-list="friendList"></circle-card>
        </div>
      </div>
    </div>

    <div class="catalogue-wrapper">
      <div class="container">
        <h3>おすすめのサークル</h3>
        <Loading v-show="!recommendList"></Loading>
        <circle-card :circle-list="recommendList"></circle-card>
      </div>
    </div>

  </div>
</template>

<script>
  import request from 'axios'
  import CircleCard from '../components/CircleCard.vue'
  import Loading from '../components/Loading.vue'
  export default {
    components: {
      CircleCard,
      Loading
    },
    name: 'catalogues',
    data() {
      return {
        event: null,
        bookmarkList: null,
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
  .event-wrapper {
    padding: 20px 0;
    p {
      margin-bottom: 20px;
    }
  }
  .catalogue-wrapper {
    background-color: #fafafa;
    padding: 20px 0;
    margin-bottom: 10px;
  }
</style>
