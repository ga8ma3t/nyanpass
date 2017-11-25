<template>
  <div>
    <div v-for="(circleList, index) in circleListGroup">
      <h4>{{index + 1}}日目</h4>
      <p class="nothing" v-if="circleList.length === 0">みつかりませんでした</p>
      <div class="circle-card-container">
        <div class="circle-card" v-for="circle in circleList">
          <p class="bookmark" v-show="circle.space.isBookmarked"></p>
          <img :src="circle.imageUrl" class="circle-card-image" onerror="this.src='/images/noimage.jpg'">
          <div class="circle-card-info">
            <p class="circle-card-info-space">{{circle.space.district}} {{circle.space.block}}-{{circle.space.space}}</p>
            <p class="circle-card-info-circle-name">{{circle.space.name}}</p>
            <p class="circle-card-info-account-name">{{circle.name}}</p>
            <p class="circle-card-info-account-twitter">@{{circle.twitterName}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['circleListGroup'],
    computed: {
      isLoading() {
        return !this.circleListGroup
      }
    }
  }
</script>

<style lang="scss" scoped>
  h4 {
    text-align: center;
    font-size: 20px;
    margin: 10px 2%;
    padding: 10px 0;
    background-color: #0084b4;
    color: #ffffff;
    @media screen and (min-width: 635px) {
      margin: 10px;
    }
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
      @media screen and (min-width: 635px) {
        width: 200px;
        padding: 0 10px 20px;
      }
      &:hover {
        cursor: pointer;
        .circle-card-info {
          box-shadow: 0 1px 1px rgba(0,0,0,0.1);
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
