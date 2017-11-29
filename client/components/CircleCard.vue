<template>
  <div>
    <div class="day-selector" :class="category">
      <ul v-if="circleListGroup && circleListGroup.length > 1">
        <template v-for="(circleList, index) in circleListGroup">
          <li :class="{selected: selectedDay === index + 1}"
              @click="onSelectDay(index + 1)"
          >{{index + 1}}日目</li>
        </template>
      </ul>
    </div>
    <div v-for="(circleList, index) in circleListGroup" v-show="selectedDay === index + 1">
      <p class="nothing" v-if="circleList.length === 0">{{nothingMessage}}</p>
      <div class="circle-card-container">
        <div class="circle-card" v-for="circle in circleList" @click="onClickCircleCard(circle.space.id, circle.space.isBookmarked)">
          <p class="bookmark" v-show="circle.space.isBookmarked"></p>
          <img :src="circle.imageUrl" class="circle-card-image" onerror="this.src='/images/noimage.jpg'">
          <div class="circle-card-info">
            <p class="circle-card-info-space">{{circle.space.district}} {{circle.space.block}}-{{circle.space.space}}</p>
            <p class="circle-card-info-circle-name">{{circle.space.name}}</p>
            <p class="circle-card-info-account-name">{{circle.name}}</p>
            <p class="circle-card-info-account-twitter" @click.stop="">
              <a :href="`https://twitter.com/${circle.twitterName}`" target="_blank" rel="noopener">
                <i class="fa fa-twitter" aria-hidden="true"></i>@{{circle.twitterName}}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['circleListGroup', 'nothingMessage', 'category'],
    data() {
      return {
        selectedDay: 1
      }
    },
    computed: {
      isLoading() {
        return !this.circleListGroup
      }
    },
    methods: {
      onClickCircleCard(spaceId, isBookmarked) {
        this.$emit('onUpdateBookmark', spaceId, isBookmarked)
      },
      onSelectDay(selectDay) {
        this.selectedDay = selectDay
      }
    }
  }
</script>

<style lang="scss" scoped>
  .day-selector {
    ul {
      display: flex;
      justify-content: center;
      margin-bottom: 15px;
      li {
        width: 30%;
        max-width: 200px;
        text-align: center;
        cursor: pointer;
        font-weight: bold;
        padding: 10px;
        color: #ffffff;
        background-color: #555555;
        &:hover {
          background-color: #777777;
        }
      }
    }
    &.recommends ul li.selected {
      background-color: #ed85da;
    }
    &.friends ul li.selected {
      background-color: #00aced;
    }
    &.bookmarks ul li.selected {
      background-color: #edaf00;
    }
  }
  h4 {
    text-align: center;
    font-size: 20px;
    margin-bottom: 10px;
    padding: 10px 0;
    background-color: #0084b4;
    color: #ffffff;
  }
  .nothing {
    text-align: center;
    margin: 50px 0;
  }
  .circle-card-container {
    display: flex;
    flex-wrap: wrap;
    .circle-card {
      box-sizing: border-box;
      position: relative;
      padding: 2%;
      width: 50%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      transition-duration: .1s;
      @media screen and (min-width: 635px) {
        width: 200px;
        padding: 0 10px 20px;
      }
      &:hover {
        cursor: pointer;
        transform: scale(1.05);
        .circle-card-info {
          box-shadow: 0 1px 1px rgba(0,0,0,0.2);
        }
      }
      .circle-card-image {
        width: 100%;
        display: block;
        background-color: #ffffff;
      }
      .circle-card-info {
        padding: 10px;
        background-color: #ffffff;
      }
      .circle-card-info-space {
        font-size: 20px;
      }
      .circle-card-info-circle-name {
        padding-bottom: 4px;
      }
      .circle-card-info-account-name, .circle-card-info-account-twitter {
        font-size: 12px;
      }
      .circle-card-info-account-twitter a {
        color: #0084b4;
        text-decoration: none;
      }
      .bookmark {
        position: absolute;
        border-right: 50px solid #ffc423;
        border-bottom: 50px solid transparent;
        right: 4%;
        @media screen and (min-width: 635px) {
          right: 10px;
        }
      }
      .bookmark:after {
        position: absolute;
        top: 2px;
        right: -48px;
        font-size: 24px;
        content: "★";
        color: #ffffff;
      }
    }
  }
</style>
