<template>
    <div>
      <div>
        <button @click="prevDate">Prev</button>
        {{ currentDate }}
        <button @click="nextDate">Next</button>
      </div>
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
      <button @click="openAddModal">Add Position</button>
    </div>
    <div class="modal-wrapper" v-bind:class="{ 'is-open': showModal }" style="z-index: 1000;">
      <div class="modal">
        <div class="modal-header">
          <h3>Add Position</h3>
          <button @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <!-- Form to add a new position -->
          <form @submit.prevent="addPosition">
            <div class="form-group">
              <label for="user">User</label>
              <input type="text" id="user" v-model="newPosition.user">
            </div>
            <div class="form-group">
              <label for="zuluTime">Zulu Time</label>
              <input type="text" id="zuluTime" v-model="newPosition.zuluTime">
            </div>
            <div class="form-group">
              <label for="localTime">Local Time</label>
              <input type="text" id="localTime" v-model="newPosition.localTime">
            </div>
            <div class="form-group">
              <label for="position">Position</label>
              <input type="text" id="position" v-model="newPosition.position">
            </div>
            <div class="form-group">
              <button type="submit">Add</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>  

  <script>
  import { zabApi } from "@/helpers/axios.js";
  
  export default {
    data() {
        return {
            positions: [],
            currentDate: new Date().toISOString().substring(0, 10),
            showModal: false,
            newPosition: {
                user: null,
                zuluTime: null,
                localTime: null,
                position: null,
            }
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
                const start = new Date(`${this.currentDate}T00:00:00.000Z`);
                const end = new Date(`${this.currentDate}T23:59:59.999Z`);
                const { response } = await zabApi.get('/online/scheduledpositions', {
                    params: {
                        day: { $gte: start, $lt: end },
                    },
                });
            this.positions = response;
            } catch (error) {
                console.error(error);
            }
        },
    },
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

  </style>