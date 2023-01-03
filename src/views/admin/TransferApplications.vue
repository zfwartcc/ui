<template>
  <div class="card">
    <div class="card-content">
      <span class="card-title">Transfer Applications</span>
    </div>
    <div class="card-content loading" v-if="transfers === null">
      <Spinner />
    </div>
    <p class="no_transfer" v-else-if="transfers && transfers.length === 0">
      There are no new transfer applications
    </p>
    <div class="table_wrapper" v-else>
      <table class="striped">
        <thead class="certs_list_head">
          <tr>
            <th>Name</th>
            <th>Rating</th>
            <th>Current ARTCC</th>
            <th class="options">Options</th>
          </tr>
        </thead>
        <tbody class="certs_list_row">
          <tr v-for="transfer in transfers" :key="transfer.id">
            <td>{{ transfer.fname }} {{ transfer.lname }}</td>
            <td>{{ transfer.rating }}</td>
            <td>{{ transfer.fromFac.id }} - {{ transfer.fromFac.name }}</td>
            <td class="options">
              <a :href="`#modal_${transfer.id}`" class="modal-trigger"
                ><i class="material-icons">search</i></a
              >
            </td>
            <div :id="`modal_${transfer.id}`" class="modal modal_visit">
              <div class="modal-content">
                <div class="modal_title">Transfer Application</div>
                <div class="row row_no_margin">
                  <div class="input-field col s6">
                    <p id="name">{{ transfer.fname + " " + transfer.lname }}</p>
                    <label for="name" class="active">Name</label>
                  </div>
                  <div class="input-field col s6">
                    <p id="email">{{ transfer.email }}</p>
                    <label for="email" class="active">Email</label>
                  </div>
                  <div class="input-field col s6">
                    <p id="cid">{{ transfer.cid }}</p>
                    <label for="cid" class="active">CID</label>
                  </div>
                  <div class="input-field col s6">
                    <p id="rating">{{ transfer.rating }}</p>
                    <label for="rating" class="active">Rating</label>
                  </div>
                  <div class="input-field col s6">
                    <p id="home">{{ transfer.fromFac.id }} - {{ transfer.fromFac.name }}</p>
                    <label for="home" class="active">Current ARTCC</label>
                  </div>
                  <div class="input-field col s6">
                    <p id="submission_date">{{ dtLong(transfer.date).slice(0,-9) }}</p>
                    <label for="submission_date" class="active">Date</label>
                  </div>
                  <div class="input-field col s12">
                    <p id="join_reason">
                      <template v-if="transfer.reason">{{ transfer.reason }}
                      </template>
                      <template v-else>
                        No reason provided(This is normal for ZAE transfers.)
                      </template>
                    </p>
                    <label for="join_reason" class="active"
                      >Why would you like to transfer to ZAU?</label
                    >
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <a href="#!" class="btn-flat modal-close right">Cancel</a>
                <a
                  href="#!"
                  class="btn-flat right"
                  @click="openRejectModal(transfer.id)"
                  >Reject</a
                >
                <a
                  href="#!"
                  class="waves-effect waves-light btn right"
                  @click="approveTransfer(transfer.id)"
                  >Approve</a
                >
              </div>
            </div>
            <div :id="`modal_reject_${transfer.id}`" class="modal modal_visit">
              <div class="modal-content">
                <div class="modal_title">Reject Transfer Application?</div>
                <p>
                  This will reject the transfer application from
                  <strong>{{ transfer.fname + " " + transfer.lname }}</strong
                  >. You must provide a reason for rejection below. This will
                  also be shown to the applicant.
                </p>
                <div class="row row_no_margin">
                  <div class="input-field col s12">
                    <input
                      :id="`reason_${transfer.id}`"
                      :name="`reason_${transfer.id}`"
                      v-model="reason[transfer.id]"
                    />
                    <label :for="`reason_${transfer.id}`" class="active"
                      >Reason</label
                    >
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <a
                  href="#!"
                  class="waves-effect btn modal-close"
                  @click="rejectTransfer(transfer.id)"
                  >Reject</a
                >
                <a href="#!" class="waves-effect btn-flat modal-close"
                  >Cancel</a
                >
              </div>
            </div>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { zabApi, vatusaApi, vatusaApiAuth} from "@/helpers/axios.js";

export default {
  name: "TransferApplications",
  title: "Transfer Applications",
  data() {
    return {
      transfers: null,
      reason: {}
    };
  },
  async mounted() {
    await this.getNewApplications();
    M.Modal.init(document.querySelectorAll(".modal"), {
      preventScrolling: false,
    });
  },
  methods: {
    async getNewApplications() {
      try {
        let response = await vatusaApi.get("/facility/ZNY/transfers");
        if (response.status === 200){
          console.log('API call was successful');
        } else {
          console.log('API call failed with status code: ' + response.status);
        }
        console.log(response.data.data.transfers);
        this.transfers = response.data.data.transfers;
        if ((response.status === 200) && (this.transfers.length !== 0)){
          this.toastSuccess("Transfer applications received");
        } else {
          this.toastSuccess("There are no transfer applications")
        }
      } catch (e) {
        console.log(e);
      }
    },
    async approveTransfer(id) {
      try {
        let response = await vatusaApi.put(`/facility/ZNY/transfers/${id}`, {
          data: {
            action: "approve",
            by: 908962,
          },
        });
        this.toastSuccess("Transfer application approved");
        await this.getNewApplications();
      } catch (e) {
        console.log(e);
        this.toastError("Something went wrong, please try again");
      }
    },
    async rejectTransfer(id) {
      try {
        console.log(this.reason[id]);
        await vatusaApi.put(`/facility/ZNY/transfers/${id}`, {
          data: {
            action: "reject",
            reason: this.reason[id],
            by: 908962,
          },
        });

        this.toastSuccess("Transfer application rejected");

        await this.getNewApplications();
      } catch (e) {
        console.log(e);
        this.toastError("Something went wrong, please try again");
      }
    },
    openRejectModal(i) {
      M.Modal.getInstance(document.querySelector(`#modal_${i}`)).close();
      M.Modal.getInstance(document.querySelector(`#modal_reject_${i}`)).open();
    },
  },
};
</script>

<style scoped lang="scss">
.modal_title {
  font-size: 1.8em;
  margin-bottom: 0.5em;
}
.no_transfer {
  padding: 0 1em 1em 1em;
  margin-top: -1em;
  font-style: italic;
}

#join_reason {
  font-family: inherit;
  width: 100%;
}

.row {
  .input-field p {
    margin: 0.33em 0 0 0;
    white-space: pre-wrap;
  }
}
</style>
