<template>
  <div class="catalogues">

    <div class="event-wrapper">
      <div class="container">
        <h2>{{event.name}}</h2>
        <p><i class="fa fa-map-marker fa-fw" aria-hidden="true"></i>{{event.place}}</p>
        <p><i class="fa fa-calendar fa-fw" aria-hidden="true"></i>{{event.dates.join(', ')}}</p>
      </div>
    </div>

    <div class="group-selector">
      <ul>
        <li
          class="recommends"
          :class="{selected: selectedGroup === 'recommends'}"
          @click="onSelectGroup('recommends')"
        >ピックアップ</li>
        <li
          class="friends"
          :class="{selected: selectedGroup === 'friends'}"
          @click="onSelectGroup('friends')"
        >フレンド</li>
        <li
          class="bookmarks"
          :class="{selected: selectedGroup === 'bookmarks'}"
          @click="onSelectGroup('bookmarks')"
        >ブックマーク</li>
      </ul>
    </div>

    <div class="catalogue-wrapper" v-show="selectedGroup === 'friends'">
      <div class="container">
        <div class="center" v-if="isRequireLogin">
          <img src="/images/login.png">
          <p>Twitterアカウントを連携すると、フォローしているフレンドのサークル一覧を表示できます</p>
          <a :href="`/auth/twitter?from=/catalogues/${this.$route.params.id}`">
            <button>Twitterと連携する</button>
          </a>
        </div>
        <div v-else>
          <Loading v-show="!friendListGroup"></Loading>
          <circle-card
            :category="'friends'"
            :circle-list-group="friendListGroup"
            :nothing-message="'みつかりませんでした'"
            @onUpdateBookmark="onUpdateBookmark(...arguments)"
          ></circle-card>
        </div>
      </div>
    </div>

    <div class="catalogue-wrapper" v-show="selectedGroup === 'recommends'">
      <div class="container">
        <Loading v-show="!recommendListGroup"></Loading>
        <circle-card
          :category="'recommends'"
          :circle-list-group="recommendListGroup"
          :nothing-message="'みつかりませんでした'"
          @onUpdateBookmark="onUpdateBookmark(...arguments)"
        ></circle-card>
      </div>
    </div>

    <div class="catalogue-wrapper" v-show="selectedGroup === 'bookmarks'">
      <div class="container">
        <div class="center" v-if="isRequireLogin">
          <img src="/images/book.png">
          <p>Twitterアカウントを連携すると、お気に入りのサークルをブックマークできます</p>
          <a :href="`/auth/twitter?from=/catalogues/${this.$route.params.id}`">
            <button>Twitterと連携する</button>
          </a>
        </div>
        <div v-else>
          <Loading v-show="!bookmarkListGroup"></Loading>
          <circle-card
            :category="'bookmarks'"
            :circle-list-group="bookmarkListGroup"
            :nothing-message="'ブックマークはありません'"
            @onUpdateBookmark="onUpdateBookmark(...arguments)"
          ></circle-card>
        </div>
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
        session: null,
        event: {},
        bookmarkListGroup: null,
        friendListGroup: null,
        recommendListGroup: null,
        isRequireLogin: false,
        selectedGroup: 'recommends'
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
          return request.get('/auth/status').then(result => {
            this.session = result.data.session
          })
        }).then(() => {
          return request.get(`/api/events/${this.$route.params.id}`).then(result => {
            this.event = result.data
          })
        }).then(() => {
          return request.get(`/api/catalogues/${this.$route.params.id}`).then(result => {
            this.recommendListGroup = result.data.recommends || null
            this.friendListGroup = result.data.friends || null
            this.bookmarkListGroup = result.data.bookmarks || null
            if (!this.friendListGroup) {
              this.isRequireLogin = true
            }
          })
        })
      },
      onSelectGroup(selectGroup) {
        Promise.resolve().then(() => {
          return request.get(`/api/catalogues/${this.$route.params.id}`).then(result => {
            this.bookmarkListGroup = result.data.bookmarks || null
            this.selectedGroup = selectGroup
            window.ga('set', 'page', `/catalogues/${this.$route.params.id}#${selectGroup}`)
            window.ga('send', 'pageview')
          })
        })
      },
      onUpdateBookmark(spaceId, isCurrentBookmarked) {
        if (!this.session) {
          // ログインしてないとだめ、なんか出す
          return
        }
        Promise.resolve().then(() => {
          return request.request({
            url: `/api/bookmarks/${spaceId}`,
            method: isCurrentBookmarked ? 'delete' : 'post',
            headers: {'x-csrf-token': this.session.token}
          })
        }).then(() => {
          this.friendListGroup = this.toggleCircleListGroupBookmark(spaceId, this.friendListGroup)
          this.recommendListGroup = this.toggleCircleListGroupBookmark(spaceId, this.recommendListGroup)
          this.bookmarkListGroup = this.toggleCircleListGroupBookmark(spaceId, this.bookmarkListGroup)
        }).catch(() => {
          // TODO リロードなどで対応
        })
      },
      toggleCircleListGroupBookmark(spaceId, circleListGroup) {
        return circleListGroup.map(circleList => {
          return circleList.map(circle => {
            if (circle.space.id === spaceId) {
              circle.space.isBookmarked = !circle.space.isBookmarked
            }
            return circle
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .group-selector {
    background-image: repeating-linear-gradient(45deg, rgba(0,0,0,0.07), rgba(0,0,0,0.07) 1px, transparent 1px, transparent 4px);
    background-size: 6px 6px;
    margin-bottom: 15px;
    ul {
      display: flex;
      justify-content: center;
      border-bottom: 1px solid #ccc;
      li {
        width: 30%;
        max-width: 200px;
        margin-top: 5px;
        padding: 18px 10px;
        text-align: center;
        cursor: pointer;
        font-weight: bold;
        &.selected {
          background-color: #fafafa;
          border-top: 2px solid #ccc;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          margin-bottom: -1px;
          padding-top: 16px;
          border-radius: 3px 3px 0 0;
          &.recommends {
            border-top-color: #ed85da;
          }
          &.friends {
            border-top-color: #00aced;
          }
          &.bookmarks {
            border-top-color: #edaf00;
          }
        }
      }
    }
  }
  .event-wrapper {
    background-color: #333333;
    color: #ffffff;
    padding: 0 10px;
    .container {
      padding: 20px 0;
      background-image: url("/images/bigsight.png");
      background-position: right top;
      background-repeat: no-repeat;
    }
    p {
      margin-bottom: 20px;
    }
  }
  .catalogue-wrapper {
    margin-bottom: 10px;
  }
</style>
