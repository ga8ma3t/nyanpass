<template>
  <div class="circle-card-container">
    <template v-for="circle in circleList">
      <div class="circle-card">
        <img :src="circle.imageUrl" class="circle-card-image">
        <div>
          <p class="circle-card-account-info">{{circle.name}} {{circle.twitterName}}</p>
          <p class="circle-card-space-info">{{circle.space.district}} {{circle.space.block}}-{{circle.space.space}}</p>
          <p class="circle-card-name-info">{{circle.space.name}}</p>
        </div>
      </div>
    </template>
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
    width: 92%;
    margin: 0 auto;
    .circle-card {
      margin: 0 0 4% 4%;
      width: 48%;
      max-width: 200px;
      @media screen and (min-width: 768px) {
        width: 200px;
        margin: 0 0 20px 20px;
      }
      &:nth-child(odd) {
        margin: 0 0 4%;
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
