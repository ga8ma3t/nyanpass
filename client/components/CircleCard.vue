<template>
  <div v-loading="isLoading">
    <el-row>
      <el-col :span="8" v-for="circle in circleList">
        <el-card>
          <img :src="circle.imageUrl" class="image">
          <div>
            <p>{{circle.name}}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
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
