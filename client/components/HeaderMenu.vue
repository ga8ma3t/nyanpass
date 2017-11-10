<template>
  <el-menu :default-active="activeIndex" router="true" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item index="/">
      <h1>にゃんぱす！</h1>
    </el-menu-item>
    <el-menu-item index="/about">
      <p>このサイトについて</p>
    </el-menu-item>
    <el-menu-item v-if="session" index="/auth/logout">
      <p>ログアウト</p>
    </el-menu-item>
    <el-menu-item v-else index="/auth/twitter">
      <p>ログイン</p>
    </el-menu-item>
  </el-menu>
</template>

<script>
  export default {
    props: ['session']
  }
</script>
