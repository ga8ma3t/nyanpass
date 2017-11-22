<template>
  <header>
    <ul>
      <li><router-link to="/"><h1>にゃんぱす！</h1></router-link></li>
      <li><router-link to="/about"><p>このサイトについて</p></router-link></li>
      <li v-if="session"><router-link to="/auth/logout"><p>ログアウト</p></router-link></li>
      <li v-else><router-link to="/auth/twitter"><p>ログイン</p></router-link></li>
    </ul>
  </header>
</template>

<script>
  export default {
    props: ['session']
  }
</script>
