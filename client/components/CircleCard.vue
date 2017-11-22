<template>
  <div>
    <template v-for="circle in circleList">
      <div>
        <img :src="circle.imageUrl" class="image">
        <div>
          <p>{{circle.name}}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    props: ['circleList'],
    computed: {
      isLoading() {
        return !this.circleList
      }
    }
  }
</script>
