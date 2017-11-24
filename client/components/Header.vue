<template>
  <header>
    <div class="container">
      <router-link to="/"><img class="logo" src="/images/logo.png"></router-link>
    </div>
  </header>
</template>

<style lang="scss" scoped>
  header {
    height: 50px;
    margin: 0 auto;
    border-bottom: 1px solid #eeeeee;
    background-color: #3399cc;
    box-sizing: border-box;
    .logo {
      height: 34px;
      padding: 8px 0;
    }
  }
</style>
