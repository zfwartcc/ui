<template>
	<div class="card">
		<div class="card-content">
			<div class="row row_no_margin">
				<div class="card-title col s8"><span class="card-title">Controller Schedule</span></div>
				<div class="col s4"><router-link to="/dash/scheduling/new"><span class="btn new_event_button right">Schedule</span></router-link><span class="btn new_event_button right" @click.native="nextDate">Next</span><span class="btn new_event_button right" @click.native="prevDate">Prev</span></div>
			</div>
		</div>
		<div v-if="sessions === null">
            <div class="card-content loading">
                <Spinner />
            </div>
        </div>
        <div v-else>
            <div class="card-content">
                <p class="no_schedule" v-if="sessions && sessions.length === 0">
                    There is no ATC availability scheduled for {{currentDate}}.
                </p>
            </div>
            <div class="table_wrapper" v-if="sessions && sessions.length !== 0">
                <p class="date"> {{ currentDate }} </p>
                <table>
                    <thead>
                        <tr>
						    <th>Controller</th>
						    <th>Start Time</th>
						    <th>End Time</th>
						    <th>Position</th>
                            <th class="options">Options</th>
					    </tr>
				    </thead>
				    <tbody class="position_list_row" v-if="sessions">
					    <tr v-for="session in sessions" :key="session._id">
						    <td>{{ session.submitter.fname }} {{ session.submitter.lname }}</td> 
						    <td>{{dtLong(session.startTime)}}</td>
						    <td>{{dtLong(session.endTime)}}</td>
						    <td>{{ session.facility }}_{{ session.position }}</td>
                            <td class="options">
								<router-link data-position="top" data-tooltip="Edit Session" class="tooltipped" :to="`/scheduling/sessions/${session._id}`"><i class="material-icons">edit</i></router-link>
								<a :href="`#modal_delete_${session._id}`" data-position="top" data-tooltip="Remove Session" class="tooltipped modal-trigger"><i class="material-icons red-text text-darken-2">delete</i></a>
						</td>
					    </tr>
                        <div :id="`modal_delete_${sessions._id}`" class="modal modal_delete">
								<div class="modal-content">
									<h4>Delete Session?</h4>
									<p>This will remove your presently scheduled session.</p>
                                    <p>This only affects the display on the main page.</p>
								</div>
								<div class="modal-footer">
									<a href="#!" @click="removeSession(sessions._id)" class="btn waves-effect">Remove</a>
									<a href="#!" class="btn-flat waves-effect modal-close">Cancel</a>
								</div>
							</div>
				    </tbody>
			    </table>
		    </div>
	    </div>
    </div>
</template>  

<script>
import { zabApi } from "@/helpers/axios.js";
  


export default {
    name: 'SchedulingDash',
	title: 'Scheduling',
    data() {
        return {
            currentDate: new Date().toISOString().substring(0, 10),
            showModal: false,
            sessions: []
        };
    },
    mounted() {
        this.getSessions();
        this.$watch('sessions', () => {
            this.$nextTick(() => {
                M.Modal.init(document.querySelectorAll('.modal'), {
                    preventScrolling: false
                });
                M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
                    margin: 0
                });
            });
        });
    },
    methods: {
        prevDate() {
            this.currentDate = new Date(new Date(this.currentDate).setDate(new Date(this.currentDate).getDate() - 1)).toISOString().substring(0, 10);
            this.getSessions();
        },
        nextDate() {
            this.currentDate = new Date(new Date(this.currentDate).setDate(new Date(this.currentDate).getDate() + 1)).toISOString().substring(0, 10);
            this.getSessions();
        },
        async getSessions() {
          try {
            const { data } = await zabApi.get('/scheduling/sessions', {
              params: {
                startTime: this.currentDate
              },
            });
            console.log(data);
            //console.log(data.data);
            this.sessions = data;
            console.log(this.sessions);
            } catch (error) {
              console.error(error);
            }
        },
        async removeSession(_id) {
            try {
                console.log(this.sessions);
                this.toastInfo('Removing session...');
                let sessionToRemove = this.sessions.find(session => session._id === _id);
                console.log(sessionToRemove)
                if (!sessionToRemove) {
                    console.error('Session not found');
                    this.toastError('Session not found');
                    return;
                }
                // Make a delete request to the API
                const { data } = await zabApi.delete(`/scheduling/sessions/${sessionToRemove._id}`, {
                    data: {
                        reason: this.reason
                    }
                });
                console.log('Session removed successfully');
                this.toastSuccess('Session removed successfully');
            } catch (error) {
                console.error(error);
                this.toastError('Error removing session');
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