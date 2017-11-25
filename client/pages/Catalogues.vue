<template>
  <div class="catalogues">

    <div class="event-wrapper">
      <div class="container">
        <h2>{{event.name}}</h2>
        <p>場所：{{event.place}}</p>
        <p>日付：{{event.dates}}</p>
      </div>
    </div>

    <div class="catalogue-wrapper">
      <div class="container">
        <h3>ブックマークしたサークル</h3>
        <div class="center" v-if="isRequireLogin">
          <img src="/images/book.png">
          <p>Twitterアカウントを連携すると、お気に入りのサークルをブックマークできます</p>
          <a :href="`/auth/twitter?from=/catalogues/${this.$route.params.id}`">
            <button>Twitterと連携する</button>
          </a>
        </div>
        <div v-else>
          <p class="center">ブックマーク機能は準備中です</p>
          <!--<Loading v-show="!bookmarkList"></Loading>-->
          <!--<circle-card :circle-list="bookmarkList"></circle-card>-->
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
          <Loading v-show="!friendListGroup"></Loading>
          <circle-card :circle-list-group="friendListGroup"></circle-card>
        </div>
      </div>
    </div>

    <div class="catalogue-wrapper">
      <div class="container">
        <h3>おすすめのサークル</h3>
        <Loading v-show="!recommendListGroup"></Loading>
        <circle-card :circle-list-group="recommendListGroup"></circle-card>
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
        friendListGroup: null,
        recommendListGroup: null,
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
            this.recommendListGroup = result.data.recommend || null
            this.friendListGroup = result.data.friends || null
            if (!this.friendListGroup) {
              this.isRequireLogin = true
            }
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .event-wrapper {
    background-color: #ffffff;
    padding: 20px 0;
    p {
      margin-bottom: 20px;
    }
  }
  .catalogue-wrapper {
    padding: 20px 0;
    margin-bottom: 10px;
  }
</style>
