<template>
  <footer>
    <div class="container">
      <ul>
        <li v-if="session"><router-link to="/auth/logout"><p>ログアウト</p></router-link></li>
        <li v-else><router-link to="/auth/twitter"><p>ログイン</p></router-link></li>
        <li><router-link to="/about"><p>このサイトについて</p></router-link></li>
      </ul>
      <div class="copyright">
        <img src="/images/kurokuroworks.png">
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
  footer {
    color: #ffffff;
    background-color: #555555;
    border-top: 1px solid #777777;
    margin-top: 40px;
    padding: 20px 0;
    font-size: 14px;
    a {
      color: #ffffff;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
    .copyright {
      text-align: center;
      img {
        width: 150px;
      }
    }
  }
</style>
