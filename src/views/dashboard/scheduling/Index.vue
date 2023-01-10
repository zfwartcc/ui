<template>
	<div class="card">
		<div class="card-content">
			<div class="row row_no_margin">
				<div class="card-title col s8"><span class="card-title">Controller Schedule</span></div>
				<div class="col s4"><router-link to="/dash/scheduling/new"><span class="btn new_event_button right">Schedule</span></router-link><span class="btn new_event_button right">Next</span><span class="btn new_event_button right">Prev</span></div>
			</div>
		</div>
		<div class="loading_container" v-if="!positions === null">
			<Spinner />
		</div>
		<p class="no_schedule" v-else-if="positions && positions.length === 0">There are no scheduled sessions for {{ currentDate }}.</p>
		<div class="session_wrapper" v-else>
			<table class="session_list striped">
				<thead class="session_list_head">
					<tr>
						<th>Controller</th>
						<th>Start Time</th>
						<th>End Time</th>
						<th>position</th>
					</tr>
				</thead>
				<tbody class="position_list_row" v-if="positions">
					<tr v-for="position in positions" :key="position._id">
						<td>{{ cid }}</td>
						<td>{{dtLong(session.startTime)}}</td>
						<td>{{dtLong(session.endTime)}}</td>
						<td>{{session.instructor ? (session.instructor.fname + ' ' + session.instructor.lname) : 'Unfulfilled'}}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>  

  <script>
  import { zabApi } from "@/helpers/axios.js";
  
  export default {
    data() {
        return {
            currentDate: new Date().toISOString().substring(0, 10),
            showModal: false,
            positions: []
        };
    },
    created() {
        this.fetchPositions();
    },
    methods: {
        openAddModal(){
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        prevDate() {
            this.currentDate = new Date(new Date(this.currentDate).setDate(new Date(this.currentDate).getDate() - 1)).toISOString().substring(0, 10);
            this.fetchPositions();
        },
        nextDate() {
            this.currentDate = new Date(new Date(this.currentDate).setDate(new Date(this.currentDate).getDate() + 1)).toISOString().substring(0, 10);
            this.fetchPositions();
        },
        async fetchPositions() {
          try {
            const { data } = await zabApi.get('/online/scheduledpositions', {
              params: {
                day: this.currentDate
              },
            });
            console.log(data);
            //console.log(data.data);
            this.positions = data;
            } catch (error) {
              console.error(error);
          }
        },
      }
  }
  </script>

<style>

.no_schedule {
  padding: 0 1em 1em 1em;
  margin-top: -1em;
  font-style: italic;
}

table {
	min-width: 500px;
}

.session_wrapper {
	overflow: auto;
}

.session_list {
	min-width: 500px;
}

.position_list_row {
	tr {
		transition: background-color .3s ease;
		&:hover {
			background: #eaeaea;
		}
	}
}
</style>