<template>
  <header>
    <div class="container">
      <router-link to="/"><img class="logo" src="/images/logo.png"></router-link>
    </div>
  </header>
</template>

<style lang="scss" scoped>
  header {
    border-bottom: 2px solid rgba(0,0,0,0.5);
    height: 50px;
    background-color: #00aced;
    /*box-sizing: border-box;*/
    .logo {
      height: 34px;
      padding: 8px 0;
      display: block;
      margin: 0 auto;
      @media screen and (min-width: 835px) {
        display: inherit;
        margin: inherit;
      }
    }
  }
</style>
