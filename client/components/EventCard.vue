<template>
  <div class="container">
    <ul class="event-card-container" v-for="event in eventList">
      <li class="event-card">
        <router-link :to="`/catalogues/${event.alternateId}`">
          <div class="event-card-inner">
            <h4>{{event.name}}</h4>
            <p><i class="fa fa-map-marker fa-fw" aria-hidden="true"></i>{{event.place}}</p>
            <p><i class="fa fa-calendar fa-fw" aria-hidden="true"></i>{{event.dates}}</p>
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
  .event-card-container {
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    .event-card {
      background-color: #ffffff;
      margin: 10px;
      box-shadow: 0 1px 1px rgba(0,0,0,0.2);
      transition-duration: .1s;
      a {
        text-decoration: none;
        color: #555555;
      }
      .event-card-inner {
        padding: 15px;
        h4 {
          font-size: 20px;
          margin-bottom: 10px;
        }
      }
      &:hover {
        box-shadow: 0 2px 2px rgba(0,0,0,0.2);
      }
    }
  }
</style>
