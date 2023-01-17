<template>
  <div id="scheduling">
    <div v-if="sessions === null" class="loading_container">
      <Spinner />
    </div>
    <div v-else-if="sessions.length === 0">
      <p>There is no planned ATC availability for this date.</p>
    </div>
    <div v-else>
      <div class="card" v-for="session in sessions" :key="session._id">
        <div class="card-header">
          <p>{{ session.facility2.name }} {{ session.position.name }}</p>
        </div>
        <div class="card-body">
          <p>{{ session.submitter.fname }} {{ session.submitter.lname }}</p>
          <p>{{ convertTime(session.startTime) }}-{{ convertTime(session.endTime) }} {{ new Date(session.startTime).toISOString().slice(11, 16) + "Z" }}-{{ new Date(session.endTime).toISOString().slice(11, 16) + "Z"}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { zabApi } from "@/helpers/axios.js";

export default {
  props:{
    currentDate: {
      type: Date,
      required: true
    }
  },
  data() {
    return {
      sessions: null,
      formattedDate: null,
      localDate: null,
    };
  },
  created() {
    this.localDate = this.currentDate
    this.fetchSessions();
    
  },
  methods: {
    async fetchSessions() {
      try {
        const formattedDate = this.localDate.toISOString().substring(0, 10);
        console.log(formattedDate);
        const { data } = await zabApi.get('/scheduling/sessions', {
          params: {
            startTime: formattedDate,
          },
        });
        console.log(data);
        this.sessions = data;
      } catch (error) {
        console.error(error);
      }
    },
    convertTime(time) {
      let date = new Date(time);
      let offset = -5; // Default to CST
      const isDST = date.toLocaleString("en-US", {timeZone: "America/Chicago"}).includes("CDT");
      offset = isDST ? -6 : offset;
      date = new Date(date.getTime() + offset * 60 * 60 * 1000);
      return date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + (isDST ? " CDT" : " CST");
    }
  },
  watch: {
    currentDate(newValue) {
      this.localDate = newValue
      this.fetchSessions()
    }
  },
}
</script>

<style scoped lang="scss">
</style>