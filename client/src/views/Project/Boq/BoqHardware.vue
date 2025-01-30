<template>
  <Sidebar />
  <!-- start: Main -->
  <main class="ms-md-2">
    <div class="p-2">
      <!-- start: Navbar -->
      <nav class="px-5 pb-4 rounded-top-4" style="background-color: #EFEDEF; padding-top: 2.5rem;">
        <i class="ri-menu-line sidebar-toggle me-3 d-block d-md-none"></i>
        <div class="d-flex flex-column">
          <h3 class="fw-bold fs-3 me-auto mb-md-2" style="color: #133E87;">Bill of Quantity</h3>
          <div class="d-md-block d-none">
            <ol class="breadcrumb fw-semibold mb-0">
              <router-link :to="{ path: `/hardware/${$route.params.folderId}` }" class="breadcrumb-item" style="color: #133E87;">Hardware</router-link>
              <router-link :to="{ path: `/software/${$route.params.folderId}` }" class="breadcrumb-item">Software</router-link>
              <router-link :to="{ path: `/service/${$route.params.folderId}` }" class="breadcrumb-item">Service</router-link>
            </ol>
          </div>
        </div>
        <Navbar />
      </nav>
      <!-- end: Navbar -->

      <!-- start: Content -->
      <div class="py-4 px-4 rounded-bottom-4" style="background-color: #EFEDEF;">
        <div class="row g-3 mx-3 px-4 pb-4 rounded-4" style="background-color: #EAE8EA;">
          <div class="d-flex align-items-center py-2 mb-md-2">
            <img src="../../assets/layers.png" alt="logo" style="width: 40px;" />
            <h1 class="fs-4 fw-bold mb-md-1 ms-3">Hardware</h1>
            <button v-if="folderStatus == 'Pending'" @click="openAddHardwareModal" class="btn rounded-3 text-white fw-medium ms-auto px-3 py-1" style="background-color: #133E87;">Add +</button>
          </div>

          <div class="table-responsive px-2">
            <table class="table align-middle">
              <thead class="text-white align-middle" style="background-color: #133E87;">
                <tr>
                  <th class="fw-semibold px-3 rounded-start-3" scope="col">No.</th>
                  <th class="fw-semibold px-3" scope="col">Category</th>
                  <th class="fw-semibold px-3" scope="col">Type</th>
                  <th class="fw-semibold px-3" scope="col">Brand</th>
                  <th class="fw-semibold px-3" scope="col">Series</th>
                  <th class="fw-semibold px-3" scope="col">Unit</th>
                  <th class="fw-semibold px-3" scope="col">Quantity</th>
                  <th class="fw-semibold px-3" scope="col">Site</th>
                  <th v-if="folderStatus !== 'Pending'" class="fw-semibold px-3 rounded-end-3 text-start" scope="col">Created At</th>
                  <th v-if="folderStatus == 'Pending'" class="fw-semibold px-3 text-start" scope="col">Created At</th>
                  <th v-if="folderStatus == 'Pending'" class="fw-semibold px-3 rounded-end-3 text-center" scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(hardware, index) in hardwareList" :key="hardware._id">
                  <td class="px-3">{{ index + 1 }}</td>
                  <td class="px-3">Hardware</td>
                  <td class="px-3">{{ hardware.type }}</td>
                  <td class="px-3">{{ hardware.brand }}</td>
                  <td class="px-3">{{ hardware.series }}</td>
                  <td class="px-3">{{ hardware.unit }}</td>
                  <td class="px-3">{{ hardware.quantity }}</td>
                  <td class="px-3">{{ hardware.site }}</td>
                  <td class="px-3">{{ formatDate(hardware.createdAt) }}</td>
                  <td v-if="folderStatus == 'Pending'" class="px-3 d-flex text-center">
                    <a @click="openEditHardwareModal(hardware)" class="btn rounded-3 fs-6 text-white px-3 py-1 me-2" style="background-color: #133E87;">
                      Edit
                    </a>
                    <a @click="deleteHardware(hardware._id)" class="btn rounded-3 fs-6 btn-danger px-2 py-1">
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

  <!-- Add/Edit Hardware Modal (Bootstrap Modal) -->
  <div class="modal fade" id="hardwareModal" tabindex="-1" aria-labelledby="hardwareModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-semibold" id="hardwareModalLabel">{{ modalTitle }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveHardware">
            <div class="row">
              <div class="col-6 mb-3">
                <input type="text" v-model="formData.type" class="form-control w-100" placeholder="Type" required />
              </div>
              <div class="col-6 mb-3">
                <input type="text" v-model="formData.brand" class="form-control w-100" placeholder="Brand" required />
              </div>
              <div class="col-6 mb-3">
                <input type="text" v-model="formData.series" class="form-control w-100" placeholder="Series" required />
              </div>
              <div class="col-6 mb-3">
                <input type="text" v-model="formData.unit" class="form-control w-100" placeholder="Unit" required />
              </div>
              <div class="col-6 mb-3">
                <input type="number" v-model="formData.quantity" class="form-control w-100" placeholder="Quantity" required />
              </div>
              <div class="col-6 mb-3">
                <input type="text" v-model="formData.site" class="form-control w-100" placeholder="Site" required />
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

// const folderId = this.$route.params.folderId;

export default {
  name: "BoqHardware",
  components: {
    Sidebar,
    Navbar
  },
  data() {
    return {
      hardwareList: [],
      modalTitle: "Add Hardware",
      formData: {
        type: '',
        brand: '',
        series: '',
        unit: '',
        quantity: 0,
        site: ''
      },
      editingId: null, // To store the ID of the hardware being edited
      folderStatus: '', // Store folder status
    };
  },
  methods: {
    fetchHardware() {
      const token = Cookies.get('authToken');
      const folderId = this.$route.params.folderId; // Get folderId from route params
      if (token) {
        api.get(`/api/hardware/${folderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
          this.hardwareList = response.data.data;
        })
        .catch(error => console.error("Error fetching hardware:", error));
      }
    },
    fetchFolderStatus() {
      const token = Cookies.get('authToken');
      const folderId = this.$route.params.folderId; // Get folderId from route params
      if (token) {
        api.get(`/api/folder/${folderId}/status`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
          this.folderStatus = response.data.status; // Set the folder status
        })
        .catch(error => console.error("Error fetching folder status:", error));
      }
    },
    openAddHardwareModal() {
      this.modalTitle = "Add Hardware";
      this.formData = { type: '', brand: '', series: '', unit: '', quantity: 0, site: '' };
      this.editingId = null;
      const modal = new bootstrap.Modal(document.getElementById('hardwareModal'));
      modal.show();
    },
    openEditHardwareModal(hardware) {
      this.modalTitle = "Edit Hardware";
      this.formData = { ...hardware }; // Pre-fill the form with existing data
      this.editingId = hardware._id;
      const modal = new bootstrap.Modal(document.getElementById('hardwareModal'));
      modal.show();
    },
    closeModal() {
      const modal = new bootstrap.Modal(document.getElementById('hardwareModal'));
      modal.hide();
    },
    saveHardware() {
      const folderId = this.$route.params.folderId;
      const token = Cookies.get('authToken');
      if (token && folderId) {
        if (this.editingId) {
          // Update existing hardware
          api.put(`/api/hardware/${this.editingId}`, this.formData, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(response => {
            const index = this.hardwareList.findIndex(h => h._id === this.editingId);
            this.hardwareList[index] = response.data.data; // Update the hardware in the list
            this.closeModal();
          })
          .catch(error => console.error("Error updating hardware:", error));
        } else {
          // Add new hardware
          api.post(`/api/hardware/${folderId}`, this.formData, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(response => {
            this.hardwareList.push(response.data.data); // Add new hardware to the list
            this.closeModal();
          })
          .catch(error => console.error("Error saving hardware:", error));
        }
      }
    },
    deleteHardware(id) {
      const token = Cookies.get('authToken');
      if (token) {
        api.delete(`/api/hardware/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          this.hardwareList = this.hardwareList.filter(hardware => hardware._id !== id); // Remove the deleted hardware
        })
        .catch(error => console.error("Error deleting hardware:", error));
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    },
  },
  mounted() {
    this.fetchHardware();
    this.fetchFolderStatus(); // Fetch the folder status when the component mounts
  },
};
</script>

<style scoped>
.modal-content {
  border-radius: 8px;
}
</style>
