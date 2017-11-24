<template>
  <div class="index">
    <div class="container">
      <ul>
        <li v-for="event in eventList">
          <router-link :to="`/catalogues/${event.alternateId}`">{{event.name}}</router-link>
        </li>
      </ul>
    </div>
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
