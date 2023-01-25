<template>
	<div class="card">
		<div class="card-content">
			<span class="card-title">Schedule Online Session</span>
			<div class="request_wrapper row row_no_margin">
				<div class="col s12 l6 push-l6">
					<p><b class="red-text">Important: </b> this is to post your planned online session. (Not Required) <br /><br />
					There is no guarantee that your session will be picked up by a member of the training staff. If a request you've made gets picked up, you are expected to show up.
					Treat the times as your availability, mentors and instructors have the ability to modify them when they pick up the session. <br /><br />
					Please make sure that you've studied the relevant training material, as per the Training Syllabus, before requesting a session.</p>
				</div>
				<div class="col s12 l6 pull-l6">
					<form class="row row_no_margin" @submit.prevent=submitRequest>
						<div class="input-field col s12">
							<input id="start_date" type="text" ref="start_date" required>
							<label for="start_date">Start Time (Local)<span class="red-text">*</span></label>
						</div>
						<div class="input-field col s12">
							<input id="end_date" type="text" ref="end_date" required>
							<label for="end_date">End Time (Local)<span class="red-text">*</span></label>
						</div>
						<div class="input-field col s6">
							<select v-model="selectedOption" class="materialize-select" @change="updateSelectedFacility" id="select-facility">
								<option value="" disabled selected>Select a Facility</option>
								<option v-for="position in positions" :key="position.code" :value="position.code">{{position.name}}</option>

							</select>
							<label>Facility <span class="red-text">*</span></label>
						</div>
						<div class="input-field col s6">
							<select id='select-position' class="materialize-select" v-model="selectedFacility">
								<option value="" disabled selected>Select a Position</option>
								<option v-for="pos in selectedFacility" :key="pos.id" :value="pos.id">{{pos.name}}</option>

							</select>
							<label>Position <span class="red-text">*</span></label>
						</div>
						<div class="submit_request">
							<input type="submit" class="btn" value="Post" :disabled="makingRequest"/>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { zabApi } from '@/helpers/axios.js';
import { mapState } from 'vuex';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import moment from 'moment-timezone';

export default {
	name: 'EditScheduleSessions',
	title: 'Edit Session',
	data() {
		return {
			request: {
				facility: '',
				position: '',
				submitter: '',
			},
			session: null,
			selectedFacility: '',
			selectedOption: '',
			makingRequest: false
		};
	},
	created(){
		this.getPositions();
		this.getSessionDetails();
		
	},
	async mounted() {
		await this.getPositions();
		await this.getSessionDetails();
		const today = new Date(new Date().toUTCString());

		M.FormSelect.init(document.querySelectorAll('select'));

		this.request.submitter = this.user.data._id;

		flatpickr(this.$refs.start_date, {
			enableTime: true,
			time_24hr: true,
			minDate: today,
			maxDate: new Date().fp_incr(14), // 14 days from now
			disableMobile: true,
			minuteIncrement: 15,
			dateFormat: 'Y-m-dTH:i:00.000\\Z',
			altFormat: 'Y-m-d H:i',
			altInput: true,
            opacity: 100,
		});

		flatpickr(this.$refs.end_date, {
			enableTime: true,
			time_24hr: true,
			minDate: today,
			maxDate: new Date().fp_incr(14), // 14 days from now
			disableMobile: true,
			minuteIncrement: 15,
			dateFormat: 'Y-m-dTH:i:00.000\\Z',
			altFormat: 'Y-m-d H:i',
			altInput: true,
		});
	},
	methods: {
		async editRequest() {
			try {
				if(!this.selectedOption) {
					this.toastError('You must select a facility');
				} else if(!this.selectedFacility) {
					this.toastError('You must select a position');
				} else{
					this.makingRequest = true;
					const {data} = await zabApi.put('/scheduling/request/new', {
						...this.request,
						startTime: `${this.$refs.start_date.value}`,
						endTime: `${this.$refs.end_date.value}`,
						facility: this.selectedOption,
						position: this.selectedFacility,
					});
					if(data.ret_det.code === 200) {
						this.toastSuccess('Controlling Session Submitted');
						this.$router.push('/dash/scheduling');
						this.makingRequest = false;
					} else {
						this.toastError(data.ret_det.message);
						this.makingRequest = false;
					}
				}
			} catch(e) {
				console.log(e);
			}
		},
		async getSessionDetails() {
			const {data} = await zabApi.get(`/scheduling/sessions/${this.$route.params.id}`);
			this.session = data.data;
			//console.log(this.session);
		},
		async getPositions() {
			//console.log(this.user);
			const { data } = await zabApi.get('/scheduling/positions', { params: { certCodes: this.user.data.certCodes } });
			this.positions = data;
			//console.log(data);
		},
		updateSelectedFacility() {
    		const filteredFacility = this.positions.find(positions => positions.code === this.selectedOption);
			//console.log(filteredFacility);
			this.selectedFacility = filteredFacility.positions;
			//console.log(this.selectedFacility);
			this.$nextTick(() => {
    			// Update Materialize select list here
    			M.FormSelect.init(document.querySelector('#select-position'), {height: 600});
  			});
		}
		
	},

	computed: {
		...mapState('user', ['user']),
		filteredPositions() {
      if(!this.selectedOption) return []
      return this.positions.find(positions => positions.code === this.selectedOption).positions
    }
  	},
};
</script>

<style scoped lang="scss">
.request_wrapper {
	padding-top: 1em;

	.col {
		margin-bottom: 1em;
	}
}
#select-options-51dcadc5-c16d-5db5-cd86-0abf82b17f1b{
  height: 200px;
  overflow-y: scroll;
}
#select-facility .select-dropdown {
 max-height: 600px !important;
 overflow-y: scroll;
}

.submit_request {
	margin-left: .75em;
}
</style>
