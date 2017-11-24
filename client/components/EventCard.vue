<template>
  <div class="container">
    <ul class="event-card" v-for="event in eventList">
      <li>
        <router-link :to="`/catalogues/${event.alternateId}`">
          <div>
            <h3>{{event.name}}</h3>
            <p>{{event.place}}</p>
            <p>{{event.date}}</p>
          </div>
        </router-link>
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
  .event-card {
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
