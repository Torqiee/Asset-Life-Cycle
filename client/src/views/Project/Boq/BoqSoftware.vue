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
                <router-link :to="{ path: `/hardware/${$route.params.folderId}` }" class="breadcrumb-item">Hardware</router-link>
                <router-link :to="{ path: `/software/${$route.params.folderId}` }" class="breadcrumb-item" style="color: #133E87;">Software</router-link>
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
              <img src="../../assets/software.png" alt="logo" style="width: 40px;" />
              <h1 class="fs-4 fw-bold mb-md-1 ms-3">Software</h1>
              <button v-if="folderStatus == 'Pending'" @click="openAddSoftwareModal" class="btn rounded-3 text-white fw-medium ms-auto px-3 py-1" style="background-color: #133E87;">Add +</button>
            </div>
  
            <div class="table-responsive px-2">
              <table class="table align-middle">
                <thead class="text-white align-middle" style="background-color: #133E87;">
                  <tr>
                    <th class="fw-semibold px-3 rounded-start-3" scope="col">No.</th>
                    <th class="fw-semibold px-3" scope="col">Category</th>
                    <th class="fw-semibold px-3" scope="col">Brand</th>
                    <th class="fw-semibold px-3" scope="col">Series</th>
                    <th class="fw-semibold px-3" scope="col">License</th>
                    <th class="fw-semibold px-3" scope="col">Quantity</th>
                    <th class="fw-semibold px-3" scope="col">Site</th>
                    <th v-if="folderStatus !== 'Pending'" class="fw-semibold px-3 rounded-end-3" scope="col">Created At</th>
                    <th v-if="folderStatus == 'Pending'" class="fw-semibold px-3" scope="col">Created At</th>
                    <th v-if="folderStatus == 'Pending'" class="fw-semibold px-3 rounded-end-3 text-center" scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(software, index) in softwareList" :key="software._id">
                    <td class="px-3">{{ index + 1 }}</td>
                    <td class="px-3">Software</td>
                    <td class="px-3">{{ software.brand }}</td>
                    <td class="px-3">{{ software.series }}</td>
                    <td class="px-3">{{ software.license }}</td>
                    <td class="px-3">{{ software.quantity }}</td>
                    <td class="px-3">{{ software.site }}</td>
                    <td class="px-3">{{ formatDate(software.createdAt) }}</td>
                    <td v-if="folderStatus !== 'Approved'" class="px-3 text-center">
                      <a @click="openEditSoftwareModal(software)" class="btn rounded-3 fs-6 text-white px-3 py-1 me-2" style="background-color: #133E87;">Edit</a>
                      <a @click="deleteSoftware(software._id)" class="btn rounded-3 fs-6 btn-danger px-2 py-1">Delete</a>
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
  
    <!-- Add/Edit Software Modal (Bootstrap Modal) -->
    <div class="modal fade" id="softwareModal" tabindex="-1" aria-labelledby="softwareModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-semibold" id="softwareModalLabel">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveSoftware">
              <div class="row">
                <div class="col-6 mb-3">
                  <input type="text" v-model="formData.brand" class="form-control w-100" placeholder="Brand" required />
                </div>
                <div class="col-6 mb-3">
                  <input type="text" v-model="formData.series" class="form-control w-100" placeholder="Series" required />
                </div>
                <div class="col-6 mb-3">
                  <input type="text" v-model="formData.license" class="form-control w-100" placeholder="License length" required />
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
  
  export default {
    name: "BoqSoftware",
    components: {
      Sidebar,
      Navbar
    },
    data() {
      return {
        softwareList: [],
        modalTitle: "Add software",
        formData: {
          brand: '',
          series: '',
          license: '',
          quantity: 0,
          site: ''
        },
        editingId: null, // To store the ID of the software being edited
        folderStatus: '',
      };
    },
    methods: {
      fetchSoftware() {
        const token = Cookies.get('authToken');
        const folderId = this.$route.params.folderId; // Get folderId from route params
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
      openAddSoftwareModal() {
        this.modalTitle = "Add Software";
        this.formData = { brand: '', series: '', license: '', quantity: 0, site: '' };
        this.editingId = null;
        const modal = new bootstrap.Modal(document.getElementById('softwareModal'));
        modal.show();
      },
      openEditSoftwareModal(software) {
        this.modalTitle = "Edit software";
        this.formData = { ...software }; // Pre-fill the form with existing data
        this.editingId = software._id;
        const modal = new bootstrap.Modal(document.getElementById('softwareModal'));
        modal.show();
      },
      closeModal() {
        const modal = new bootstrap.Modal(document.getElementById('softwareModal'));
        modal.hide();
      },
      saveSoftware() {
        const folderId = this.$route.params.folderId;
        const token = Cookies.get('authToken');
        if (token && folderId) {
          if (this.editingId) {
            // Update existing Software
            api.put(`/api/software/${this.editingId}`, this.formData, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then(response => {
              const index = this.softwareList.findIndex(h => h._id === this.editingId);
              this.softwareList[index] = response.data.data; // Update the software in the list
              this.closeModal();
            })
            .catch(error => console.error("Error updating software:", error));
          } else {
            // Add new software
            api.post(`/api/software/${folderId}`, this.formData, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then(response => {
              this.softwareList.push(response.data.data); // Add new software to the list
              this.closeModal();
            })
            .catch(error => console.error("Error saving software:", error));
          }
        }
      },
      deleteSoftware(id) {
        const token = Cookies.get('authToken');
        if (token) {
          api.delete(`/api/software/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            this.softwareList = this.softwareList.filter(software => software._id !== id); // Remove the deleted software
          })
          .catch(error => console.error("Error deleting software:", error));
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
      this.fetchFolderStatus();
      this.fetchSoftware();
    },
  };
  </script>
  
  <style scoped>
  .modal-content {
    border-radius: 8px;
  }
  </style>
  