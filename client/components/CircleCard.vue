<template>
  <div>
    <div v-for="(circleList, index) in circleListGroup">
      <h4>{{index + 1}}日目</h4>
      <div class="circle-card-container">
        <div v-if="circleList.length === 0">
          <p>サークルはありません</p>
        </div>
        <div class="circle-card" v-for="circle in circleList">
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
  .circle-card-container {
    display: flex;
    flex-wrap: wrap;
    .circle-card {
      box-sizing: border-box;
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
    }
  }
</style>
