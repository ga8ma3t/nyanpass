<template>
  <div class="index">
    <div class="welcome">
      <div class="message">
        <h1>Twitterサークル検索サービス</h1>
        <h1><span class="title">「にゃんぱす！」</span></h1>
        <img src="/images/bigsight.png">
      </div>
      <div class="cutter"></div>
    </div>

    <div class="container">
      <h3 class="center">対応イベント一覧</h3>
      <event-card></event-card>
    </div>
  </div>
</template>

<script>
  import EventCard from '../components/EventCard.vue'
  export default {
    components: {
      EventCard
    }
  }
</script>

<style lang="scss" scoped>
  .welcome {
    background-image: url("/images/welcome.jpg");
    background-size: cover;
    background-position: center;
    overflow: hidden;
    .message {
      text-align: center;
      margin: 30px 0 60px;
      height: 400px;
      img {
        height: 140%;
        overflow: hidden;
        filter: drop-shadow(0 0 20px rgba(0,0,0,0.5));
      }
      h1 {
        font-size: 30px;
        padding: 5px;
        color: #ffffff;
        .title {
          font-size: 35px;
        }
      }
    }
  }
  .welcome .cutter {
    position: relative;
    background-color: #555;
    width: 120%;
    height: 200px;
    margin: 0 -10% -150px;
    transform: rotate(3deg);
  }
  .welcome .cutter:before {
    content: "";
    position: absolute;
    width: 120%;
    height: 400px;
    margin: 0 -10%;
    background: #fafafa;
    transform: rotate(-6deg);
  }

</style>
