<template>
  <div v-loading="isLoading">
    <el-table :data="circleList">
      <el-table-column
        prop="name"
        label="なまえ">
      </el-table-column>
      <el-table-column
        prop="twitterName"
        label="ついったー">
      </el-table-column>
      <el-table-column
        prop="space.date"
        label="日付">
      </el-table-column>
      <el-table-column
        prop="space.district"
        label="地区">
      </el-table-column>
      <el-table-column
        prop="space.block"
        label="ブロック">
      </el-table-column>
      <el-table-column
        prop="space.space"
        label="スペース">
      </el-table-column>
      <el-table-column
        prop="space.name"
        label="サークル名">
      </el-table-column>
    </el-table>
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
