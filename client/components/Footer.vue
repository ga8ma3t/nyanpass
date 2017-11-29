<template>
  <footer>
    <div class="container">
      <div class="footer-menu">
        <ul>
          <li><router-link to="/"><p>トップページ</p></router-link></li>
          <li><router-link to="/about"><p>このサイトについて</p></router-link></li>
          <li><a href="https://www.kurokuroworks.net" target="_blank"><p>開発サークル</p></a></li>
          <li v-if="session"><a href="/auth/logout"><p>ログアウト</p></a></li>
        </ul>
      </div>
      <div class="copyright">
        <img src="/images/kurokuroworks.png">
      </div>
    </div>
  </footer>
</template>

<script>
  export default {
    props: ['session']
  }
</script>

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
    .container {
      text-align: center;
      overflow: hidden;
    }
    .footer-menu {
      ul li {
        margin: 0 0 10px;
      }
      @media screen and (min-width: 635px) {
        position: relative;
        overflow: hidden;
        ul {
          position: relative;
          left: 50%;
          float: left;
          li {
            margin: 0 10px;
            position: relative;
            left: -50%;
            float: left;
            list-style: none;
          }
        }
      }
    }
    .copyright {
      margin-top: 10px;
      img {
        width: 150px;
      }
    }
  }
</style>
