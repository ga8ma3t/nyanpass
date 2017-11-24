<template>
  <div class="circle-card-container">
    <div class="circle-card" v-for="circle in circleList">
      <img :src="circle.imageUrl" class="circle-card-image" onerror="this.src='/images/noimage.jpg'">
      <div>
        <p class="circle-card-account-info">{{circle.name}} {{circle.twitterName}}</p>
        <p class="circle-card-space-info">{{circle.space.district}} {{circle.space.block}}-{{circle.space.space}}</p>
        <p class="circle-card-name-info">{{circle.space.name}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  // 'id', 'name', 'imageUrl', 'twitterId', 'twitterName'
  // 'id', 'name', 'date', 'district', 'block', 'space'

  export default {
    props: ['circleList'],
    computed: {
      isLoading() {
        return !this.circleList
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
      @media screen and (min-width: 615px) {
        width: 200px;
        padding: 0 10px 20px;
      }
      .circle-card-image {
        width: 100%;
      }
      .circle-card-account-info {

      }
      .circle-card-space-info {

      }
      .circle-card-name-info {

      }
    }
  }
</style>
