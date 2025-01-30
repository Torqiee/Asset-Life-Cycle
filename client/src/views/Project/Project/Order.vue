<template>
    <Sidebar />
    <!-- start: Main -->
    <main class="ms-md-2">
      <div class="p-2">
        <!-- start: Navbar -->
        <nav class="px-5 pb-4 rounded-top-4" style="background-color: #EFEDEF; padding-top: 2.5rem;">
          <i class="ri-menu-line sidebar-toggle me-3 d-block d-md-none"></i>
          <div class="d-flex flex-column">
            <h3 class="fw-bold fs-3 me-auto mb-md-2" style="color: #133E87;">Purchase Order</h3>
          </div>
          <Navbar />
        </nav>
        <!-- end: Navbar -->
  
        <!-- start: Content -->
        <div class="py-4 px-4 rounded-bottom-4" style="background-color: #EFEDEF;">
          <div class="row g-3 mx-3 px-4 pb-4 rounded-4" style="background-color: #EAE8EA;">
            <div class="d-flex align-items-center py-2 mb-md-2">
              <img src="../../assets/layers.png" alt="logo" style="width: 40px;" />
              <h1 class="fs-4 fw-bold mb-md-1 ms-3">Order Data</h1>
              <button v-if="projectStatus == 'Pending'" @click="openAddOrderModal" class="btn rounded-3 text-white fw-medium ms-auto px-3 py-1" style="background-color: #133E87;">Add +</button>
            </div>
  
            <div class="table-responsive px-2">
              <table class="table align-middle">
                <thead class="text-white align-middle" style="background-color: #133E87;">
                  <tr>
                    <th class="fw-semibold px-3 rounded-start-3" scope="col">No.</th>
                    <th class="fw-semibold px-3" scope="col">PO Number</th>
                    <th class="fw-semibold px-3" scope="col">BoQ Number</th>
                    <th class="fw-semibold px-3" scope="col">Vendor</th>
                    <!-- <th class="fw-semibold px-3" scope="col">Nodin Number</th> -->
                    <th class="fw-semibold px-3" scope="col">Site TTC</th>
                    <th v-if="projectStatus == 'Pending'" class="fw-semibold px-3 rounded-end-3 text-center" scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(order, index) in orderList" :key="order._id">
                    <td class="px-3">{{ index + 1 }}</td>
                    <td class="px-3">{{ order.orderNumber }}</td>
                    <td class="px-3">{{ order.boqNumber }}</td>
                    <td class="px-3">{{ order.vendor }}</td>
                    <td class="px-3">{{ order.site }}</td>
                    <td v-if="projectStatus == 'Pending'" class="px-3 d-flex text-center">
                      <a @click="openEditOrderModal(order)" class="btn rounded-3 fs-6 text-white px-3 py-1 me-2" style="background-color: #133E87;">
                        Edit
                      </a>
                      <a @click="deleteOrder(order._id)" class="btn rounded-3 fs-6 btn-danger px-2 py-1">
                        Delete
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- end: Content -->
      </div>
    </main>
  
    <!-- Add/Edit Order Modal (Bootstrap Modal) -->
    <div class="modal fade" id="orderModal" tabindex="-1" aria-labelledby="orderModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content rounded-4">
          <div class="modal-header">
            <h5 class="modal-title fw-semibold" id="orderModalLabel">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveOrder">
              <div class="row">
                <div class="col-6 mb-3">
                  <label for="ordernumber" class="form-label fw-semibold">Order Number</label>
                  <input type="text" id="ordernumber" v-model="formData.orderNumber" class="form-control w-100" placeholder="Order Number" required />
                </div>
                <div class="col-6 mb-3">
                  <label for="orderdate" class="form-label fw-semibold">Order Date</label>
                  <input type="date" id="orderdate" v-model="formData.orderDate" class="form-control w-100" placeholder="Order Date" required />
                </div>
                <div class="col-6 mb-3">
                  <label for="vendor" class="form-label fw-semibold">Vendor</label>
                  <input type="text" id="vendor" v-model="formData.vendor" class="form-control w-100" placeholder="Vendor - 123456" required />
                </div>
                <div class="col-6 mb-3">
                  <label for="boqnumber" class="form-label fw-semibold">BoQ Number</label>
                  <input type="text" id="boqnumber" v-model="formData.boqNumber" class="form-control w-100" placeholder="BoQ Number" required />
                </div>
                <div class="col-6 mb-3">
                  <label for="nodintoreg" class="form-label fw-semibold">Nodin to Regional Number</label>
                  <input type="text" id="nodintoreg" v-model="formData.nodinToReg" class="form-control w-100" placeholder="Vendor" required />
                </div>
                <div class="col-6 mb-3">
                  <label for="nodintoregdate" class="form-label fw-semibold">Nodin to Regional Date</label>
                  <input type="text" id="nodintoregdate" v-model="formData.nodinToRegDate" class="form-control w-100" placeholder="Vendor" required />
                </div>
                <div class="col-md-6 mb-4">
                <label class="form-label">Order File</label>
                <div class="drop-zone" @click="triggerFileInput('orderFile')" @dragover.prevent @drop="handleDrop">
                        <p v-if="!formData.orderFile">Drag & drop file here or click to upload</p>
                        <p v-else>{{ formData.orderFile.name }}</p>
                        <input type="file" ref="orderFile" @change="handleFileUpload($event, 'orderFile')" class="hidden-input" />
                    </div>
                </div>

                <div class="col-md-6 mb-4">
                    <label class="form-label">Nodin File</label>
                    <div class="drop-zone" @click="triggerFileInput('nodinToRegFile')" @dragover.prevent @drop="handleDrop">
                        <p v-if="!formData.nodinToRegFile">Drag & drop file here or click to upload</p>
                        <p v-else>{{ formData.nodinToRegFile.name }}</p>
                        <input type="file" ref="nodinToRegFile" @change="handleFileUpload($event, 'nodinToRegFile')" class="hidden-input" />
                    </div>
                </div>
              </div>
              <button type="submit" class="btn text-white fw-medium w-100" style="background-color: #133E87;">Save</button>
            </form>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import Sidebar from '../../components/Sidebar.vue';
import Navbar from '../../components/Navbar.vue';
import api from '../../../api';
import Cookies from 'js-cookie';

export default {
name: "Purchase Order",
components: {
    Sidebar,
    Navbar
},
data() {
    return {
    orderList: [],
    modalTitle: "Add Purchase Order",
    formData: {
        orderNumber: '',
        orderDate: '',
        orderFile: null,
        vendor: '',
        boqNumber: '',
        nodinToReg: '',
        nodinToRegDate: '',
        nodinToRegFile: null
    },
    editingId: null, // To store the ID of the order being edited
    projectStatus: '', // Store project status
    };
},
methods: {
    fetchOrder() {
        const token = Cookies.get('authToken');
        const projectId = this.$route.params.projectId;
        if (token) {
            api.get(`/api/order/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(response => {
                this.orderList = response.data.data;
            })
            .catch(error => console.error("Error fetching order:", error));
        }
    },
    fetchProjectStatus() {
        const token = Cookies.get('authToken');
        const projectId = this.$route.params.projectId;
        if (token) {
            api.get(`/api/project/${projectId}/status`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(response => {
                this.projectStatus = response.data.status;
            })
            .catch(error => console.error("Error fetching project status:", error));
        }
    },
    openAddOrderModal() {
        this.modalTitle = "Add Purchase Order";
        this.formData = {
            orderNumber: '',
            orderDate: '',
            orderFile: null,
            vendor: '',
            boqNumber: '',
            nodinToReg: '',
            nodinToRegDate: '',
            nodinToRegFile: null
        };
        this.editingId = null;
        const modal = new bootstrap.Modal(document.getElementById('orderModal'));
        modal.show();
    },
    openEditOrderModal(order) {
        this.modalTitle = "Edit Purchase Order";
        this.formData = { ...order };
        this.editingId = order._id;
        const modal = new bootstrap.Modal(document.getElementById('orderModal'));
        modal.show();
    },
    closeModal() {
        const modal = new bootstrap.Modal(document.getElementById('orderModal'));
        modal.hide();
    },
    handleFileUpload(event, field) {
        const file = event.target.files[0];
        if (file) {
            this.formData[field] = file;
        }
    },
    triggerFileInput(field) {
        this.$refs[field].click();
    },
    saveOrder() {
        const projectId = this.$route.params.projectId;
        const token = Cookies.get('authToken');

        if (token && projectId) {
            const formData = new FormData();
            formData.append('orderNumber', this.formData.orderNumber);
            formData.append('orderDate', this.formData.orderDate);
            formData.append('vendor', this.formData.vendor);
            formData.append('boqNumber', this.formData.boqNumber);
            formData.append('nodinToReg', this.formData.nodinToReg);
            formData.append('nodinToRegDate', this.formData.nodinToRegDate);

            // Append files if they exist
            if (this.formData.orderFile) {
                formData.append('orderFile', this.formData.orderFile);
            }
            if (this.formData.nodinToRegFile) {
                formData.append('nodinToRegFile', this.formData.nodinToRegFile);
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            };

            if (this.editingId) {
                // Update existing order
                api.put(`/api/order/${this.editingId}`, formData, config)
                    .then(response => {
                        const index = this.orderList.findIndex(h => h._id === this.editingId);
                        this.orderList[index] = response.data.data;
                        this.closeModal();
                    })
                    .catch(error => console.error("Error updating order:", error));
            } else {
                // Add new order
                api.post(`/api/order/${projectId}`, formData, config)
                    .then(response => {
                        this.orderList.push(response.data.data);
                        this.closeModal();
                    })
                    .catch(error => console.error("Error saving order:", error));
            }
        }
    },
    deleteOrder(id) {
        const token = Cookies.get('authToken');
        if (token) {
            api.delete(`/api/order/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                this.orderList = this.orderList.filter(order => order._id !== id);
            })
            .catch(error => console.error("Error deleting order:", error));
        }
    },
    formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    },
},
mounted() {
    this.fetchOrder();
    this.fetchProjectStatus();
},
};
</script>

<style scoped>
.drop-zone {
  border: 2px dashed #133E87;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  background-color: #f8f9fa;
  transition: background-color 0.3s ease-in-out;
  position: relative;
}

.drop-zone p {
  margin: 0;
  font-size: 14px;
  color: #555;
}

.drop-zone:hover, .drop-zone.drag-over {
  background-color: #e0e0e0;
}

/* Completely hide the file input */
.hidden-input {
  display: none;
}
</style>