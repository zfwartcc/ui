<template>
  <div class="card" style="width: 800px">
    <div class="card-content">
      <div class="row">
        <span class="card-title">Controller Schedule</span>
        <div class="button-container right">
          <button class="btn-scheduling" @click="prevDate">
            <div><i class="material-icons larger-icon">navigate_before</i></div>
          </button>
          <button class="btn-scheduling" @click="nextDate">
            <div><i class="material-icons larger-icon">navigate_next</i></div>
          </button>
          <button class="btn" @click="addDate">
            <div class="secondary-content"><i class="material-icons text-white larger-icon">add</i></div>
          </button>
        </div>
      </div>
    </div>
    <div v-if="positions === null">
      <div class="card-content loading">
        <Spinner />
      </div>
    </div>
    <div v-else>
      <div class="card-content">
        <p class="no_schedule" v-if="positions && positions.length === 0">
          There is no ATC availability scheduled for {{currentDate}}.
        </p>
      </div>
      <div class="table_wrapper" v-if="positions && positions.length > 0">
        <p class="date"> {{ currentDate }} </p>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Zulu Time</th>
            <th>Local Time</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="position in positions" :key="position._id">
            <td>{{ position.user }}</td>
            <td>{{ position.zuluTime }}</td>
            <td>{{ position.localTime }}</td>
            <td>{{ position.position }}</td>
          </tr>
        </tbody>
      </table>
      </div>
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
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  .modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(10, 10, 10, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 8;
  transition: all 0.3s ease-in-out;
  visibility: hidden;
  opacity: 0;
}

.modal-wrapper.is-open {
  visibility: visible;
  display: block;
  opacity: 1;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  z-index: 9;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #ccc;
  z-index: 10;
}

.modal-body {
  padding: 20px;
  z-index: 10;

}

.larger-icon {
  font-size: 2em;
  font-weight: bold;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  float: right;
  width: 110px;
}

.btn-scheduling {
  border: 3px solid rgb(3, 3, 3) !important;
  color: grey !important;
  background: white;
}

.no_schedule {
  padding: 0 1em 1em 1em;
  margin-top: -1em;
  font-style: italic;
}

.row {
  display: flex;
  align-items: center;
}

.button-container.right {
  display: flex;
  justify-content: flex-end;
  float: right;
}
  </style>