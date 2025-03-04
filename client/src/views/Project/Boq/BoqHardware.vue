<template>
  <div id="app">
    <Sidebar />
    <!-- start: Main -->
    <main class="ms-md-2">
      <div class="p-2 d-flex flex-column" style="height: 100%;">
        <!-- start: Navbar -->
        <nav class="px-5 pb-4 rounded-top-4" style="background-color: #EFEDEF; padding-top: 2.5rem;">
          <i class="ri-menu-line sidebar-toggle me-3 d-block d-md-none"></i>
          <div class="d-flex flex-column">
            <h3 class="fw-bold fs-3 me-auto mb-md-2 d-flex align-items-center" style="color: #133E87;">
              <router-link to="/boq">
                <img src="../../assets/back.svg" alt="logo" class="d-md-block d-none" style="width: 15px;" />
              </router-link>
              <span class="ms-md-3">
                Bill of Quantity
              </span>
            </h3>

          </div>
          <Navbar />
        </nav>
        <!-- end: Navbar -->

        <div class="py-4 px-4 rounded-bottom-4 flex-grow-1" style="background-color: #EFEDEF;">
          <div class="row g-3 mx-3 px-4 pb-4 rounded-4 justify-center" style="background-color: #EAE8EA;">

            <!-- General Information -->
            <BoqStatus :folderId="$route.params.folderId" :folderStatus="folderStatus" />
            <FolderInfo :folderId="$route.params.folderId" />

            <!-- start: Content -->
            <div class="d-flex align-items-center py-2 mb-md-2" style="white-space: nowrap;">
              <img src="../../assets/layers.png" alt="logo" style="width: 40px;" />
              <div class="">
                <h1 class="fs-4 fw-bold mb-md-1 ms-3">Hardware</h1>
                <ol class="breadcrumb fw-semibold mb-0 ms-2 ps-2" style="--bs-breadcrumb-divider: '|';">
                  <router-link :to="{ path: `/hardware/${$route.params.folderId}` }" class="breadcrumb-item" style="color: #133E87;">
                    <span class="badge fw-medium" style="background-color: #133E87;">
                      Hardware
                    </span>
                  </router-link>
                  <router-link :to="{ path: `/software/${$route.params.folderId}` }" class="breadcrumb-item">Software</router-link>
                  <router-link :to="{ path: `/service/${$route.params.folderId}` }" class="breadcrumb-item">Service</router-link>
                </ol>
              </div>
              <button v-if="folderStatus == 'Draft'" @click="openAddHardwareModal" class="btn rounded-3 text-white fw-medium ms-auto px-3 py-1 me-2" style="background-color: #0E2D65;">Add +</button>
            </div>

            <div class="table-responsive px-2">
              <table class="table align-middle" style="white-space: nowrap;">
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
                    <th v-if="folderStatus !== 'Draft'" class="fw-semibold px-3 rounded-end-3 text-start" scope="col">Created At</th>
                    <th v-if="folderStatus == 'Draft'" class="fw-semibold px-3 text-start" scope="col">Created At</th>
                    <th v-if="folderStatus == 'Draft'" class="fw-semibold px-3 rounded-end-3 text-center" scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(hardware, index) in paginatedHardware" :key="hardware._id" class="border-bottom border-3">
                    <td class="px-3">{{ index + 1 }}</td>
                    <td class="px-3">Hardware</td>
                    <td class="px-3">{{ hardware.type }}</td>
                    <td class="px-3">{{ hardware.brand }}</td>
                    <td class="px-3">{{ hardware.series }}</td>
                    <td class="px-3">{{ hardware.unit }}</td>
                    <td class="px-3">{{ hardware.quantity }}</td>
                    <td class="px-3">{{ hardware.site }}</td>
                    <td class="px-3">{{ formatDate(hardware.createdAt) }}</td>
                    <td v-if="folderStatus == 'Draft'" class="px-3 text-center">
                      <a @click="openEditHardwareModal(hardware)" class="btn rounded-3 text-white px-3 py-0 me-2" style="background-color: #133E87;">
                        Edit
                      </a>
                      <a @click="deleteHardware(hardware._id)" class="btn rounded-3 btn-danger px-2 py-0">
                        Delete
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- Display message if no hardware data -->
              <div v-if="hardwareList.length === 0" class="text-center py-3">
                <p class="text-muted">No Hardware data available.</p>
              </div>

              <!-- Bootstrap Pagination -->
              <div class="d-flex justify-content-between align-items-center mt-3" style="white-space: nowrap;">
                <p class="m-0">Showing {{ startItem }} - {{ endItem }} of {{ hardwareList.length }} entries</p>
                <nav v-if="totalPages > 1">
                  <ul class="pagination justify-content-center mt-3">
                    <!-- Previous Button -->
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                      <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
                    </li>

                    <!-- Page Numbers -->
                    <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: currentPage === page }">
                      <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                    </li>

                    <!-- Next Button -->
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                      <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
                    </li>
                  </ul>
                </nav>
              </div>

              <div class="d-flex mt-3">
                <router-link 
                  :to="'/submit/' + folderId" 
                  v-if="folderStatus == 'Draft' && (hardwareList.length > 0 || softwareList.length > 0 || serviceList.length > 0)" 
                  class="btn rounded-3 fw-medium ms-auto px-3 py-1 text-white" 
                  style="background-color: #12753a"
                >
                  Proceed
                </router-link>
                <button 
                  v-else-if="folderStatus == 'Draft' && (hardwareList.length === 0 && softwareList.length === 0 && serviceList.length === 0)" 
                  class="btn rounded-3 fw-semibold ms-auto px-3 py-1 bg-white" 
                  style="color: #133E87; cursor: not-allowed;" 
                  disabled
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- end: Content -->
      </div>
    </main>
  </div>

  <!-- Add/Edit Hardware Modal (Bootstrap Modal) -->
  <div class="modal fade" id="hardwareModal" tabindex="-1" aria-labelledby="hardwareModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content rounded-4">
        <div class="d-flex p-4">
          <h5 class="modal-title fw-semibold h5" id="hardwareModalLabel">{{ modalTitle }}</h5>
          <button type="button" class="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body px-4">
          <form @submit.prevent="saveHardware">
            <div class="row mb-2">
              <div class="col-6 mb-3">
                <label for="type" class="form-label">Type</label>
                <input type="text" id="type" v-model="formData.type" class="form-control w-100 text-start bg-white border-3" required />
              </div>
              <div class="col-6 mb-3">
                <label for="brand" class="form-label">Brand</label>
                <input type="text" id="brand" v-model="formData.brand" class="form-control w-100 text-start bg-white border-3" required />
              </div>
              <div class="col-6 mb-3">
                <label for="series" class="form-label">Series</label>
                <input type="text" id="series" v-model="formData.series" class="form-control w-100 text-start bg-white border-3" required />
              </div>
              <div class="col-6 mb-3">
                <label for="unit" class="form-label">Unit</label>
                <input type="text" id="unit" v-model="formData.unit" class="form-control w-100 text-start bg-white border-3" required />
              </div>
              <div class="col-6 mb-3">
                <label for="quantity" class="form-label">Quantity</label>
                <input type="number" id="quantity" v-model="formData.quantity" class="form-control w-100 text-start bg-white border-3" required />
              </div>
              <div class="col-6 mb-3">
                <label for="site" class="form-label">Site</label>
                <input type="text" id="site" v-model="formData.site" class="form-control w-100 text-start bg-white border-3" required />
              </div>
            </div>
            <button type="submit" class="btn text-white fw-medium w-100 mb-3" style="background-color: #133E87;">Add to BoQ</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../../components/Sidebar.vue';
import Navbar from '../../components/Navbar.vue';
import FolderInfo from '../../components/BoqInfo.vue';
import BoqStatus from '../../components/BoqStatus.vue';
import api from '../../../api';
import Cookies from 'js-cookie';

export default {
  name: "BoqHardware",
  components: {
    Sidebar,
    Navbar,
    FolderInfo,
    BoqStatus
  },
  data() {
    return {
      folderId: this.$route.params.folderId,
      currentPage: 1,
      perPage: 15,
      hardwareList: [],
      softwareList: [],
      serviceList: [],
      folderData: {},
      modalTitle: "Add Hardware",
      formData: {
        type: '',
        brand: '',
        series: '',
        unit: '',
        quantity: 0,
        site: ''
      },
      editingId: null,
      folderStatus: '',
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.hardwareList.length / this.perPage);
    },
    paginatedHardware() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.hardwareList.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.hardwareList.length / this.perPage);
    },
    visiblePages() {
      let pages = [];
      let start = Math.max(1, this.currentPage - 1);
      let end = Math.min(this.totalPages, start + 2);

      if (end - start < 2) {
        start = Math.max(1, end - 2);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    },
    startItem() {
      return (this.currentPage - 1) * this.perPage + 1;
    },
    endItem() {
      return Math.min(this.currentPage * this.perPage, this.hardwareList.length);
    }
  },
  methods: {
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
    },
    fetchHardware() {
      const token = Cookies.get('authToken');
      const folderId = this.$route.params.folderId;
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
    fetchSoftware() {
      const token = Cookies.get('authToken');
      const folderId = this.$route.params.folderId;
      if (token) {
        api.get(`/api/software/${folderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
          this.softwareList = response.data.data;
        })
        .catch(error => console.error("Error fetching software:", error));
      }
    },
    fetchService() {
      const token = Cookies.get('authToken');
      const folderId = this.$route.params.folderId;
      if (token) {
        api.get(`/api/service/${folderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
          this.serviceList = response.data.data;
        })
        .catch(error => console.error("Error fetching service:", error));
      }
    },
    fetchFolderData() {
      const token = Cookies.get('authToken');
      const folderId = this.$route.params.folderId;
      if (token && folderId) {
        api.get(`/api/folder/${folderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
          this.folderData = response.data.data;
        })
        .catch(error => console.error("Error fetching folder data:", error));
      }
    },
    fetchFolderStatus() {
      const token = Cookies.get('authToken');
      const folderId = this.$route.params.folderId;
      if (token) {
        api.get(`/api/folder/${folderId}/status`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
          this.folderStatus = response.data.status;
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
      const modalElement = document.getElementById('hardwareModal');
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
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
            this.hardwareList[index] = response.data.data;
            this.closeModal();

            Swal.fire({
              icon: 'success',
              title: 'Hardware Updated',
              text: 'The hardware has been updated successfully.',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000
            });
          })
          .catch(error => {
            console.error("Error updating hardware:", error);
            Swal.fire({
              icon: 'error',
              title: 'Update Failed',
              text: 'Something went wrong while updating the hardware.',
            });
          });
        } else {
          // Add new hardware
          api.post(`/api/hardware/${folderId}`, this.formData, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(response => {
            this.hardwareList.push(response.data.data); // Add new hardware to the list
            this.closeModal();

            Swal.fire({
              icon: 'success',
              title: 'Hardware Added',
              text: 'The Hardware has been added successfully.',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000
            });
          })
          .catch(error => {
            console.error("Error saving hardware:", error);
            Swal.fire({
              icon: 'error',
              title: 'Addition Failed',
              text: 'Something went wrong while adding the hardware.',
            });
          });
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
          this.hardwareList = this.hardwareList.filter(hardware => hardware._id !== id);
        })
        .catch(error => console.error("Error deleting hardware:", error));
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
    this.fetchHardware();
    this.fetchSoftware();
    this.fetchService();
    this.fetchFolderStatus();
    this.fetchFolderData();
    this.$nextTick(() => {
      initializeSidebar();
    });
  },
};
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 100svh;
}

main {
  height: 100%; /* Ensure the main section fills its parent */
  overflow-y: auto; /* Enable vertical scrolling for the main content */
  -ms-overflow-style: none; /* Hide scrollbar in IE and Edge */
  scrollbar-width: none; /* Hide scrollbar in Firefox */
}

main::-webkit-scrollbar {
  display: none; /* Hide scrollbar in Chrome, Safari */
}

.custom-breadcrumb .breadcrumb-item {
  display: flex;
  align-items: center;
}

.custom-breadcrumb .breadcrumb-item + .breadcrumb-item::before {
  font-size: 2rem; /* Make divider bigger */
  font-weight: lighter; /* Optional: Make it bolder */
  align-items: center;
}

.modal-content {
  border-radius: 8px;
}

.pagination .page-link {
  color: #133E87;
  border-color: #133E87;
}

.pagination .page-item.active .page-link {
  background-color: #133E87;
  border-color: #133E87;
  color: white;
}

.pagination .page-link:hover {
  background-color: #133E87;
  color: white;
}
</style>
