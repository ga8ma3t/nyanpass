<template>
  <div class="index">
    <h2>イベント一覧</h2>
    <ul>
      <li v-for="event in eventList">
        <router-link :to="`/catalogue/${event.alternateId}`">{{event.name}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import request from 'axios'
  export default {
    name: 'index',
    data() {
      return {
        eventList: null
      }
    },
    created() {
      this.fetchEventList()
    },
    watch: {
      '$route': 'fetchEventList'
    },
    methods: {
      fetchEventList() {
        if (this.eventList) {
          return
        }
        request.get(`/api/events`).then(result => {
          this.eventList = result.data
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
