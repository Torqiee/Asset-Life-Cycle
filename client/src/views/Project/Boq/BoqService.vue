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
                <router-link :to="{ path: `/software/${$route.params.folderId}` }" class="breadcrumb-item">Software</router-link>
                <router-link :to="{ path: `/service/${$route.params.folderId}` }" class="breadcrumb-item" style="color: #133E87;">Service</router-link>
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
              <img src="../../assets/settings.svg" alt="logo" style="width: 40px;" />
              <h1 class="fs-4 fw-bold mb-md-1 ms-3">Service</h1>
              <button v-if="folderStatus == 'Pending'" @click="openAddServiceModal" class="btn rounded-3 text-white fw-medium ms-auto px-3 py-1" style="background-color: #133E87;">Add +</button>
            </div>
  
            <div class="table-responsive px-2">
              <table class="table align-middle">
                <thead class="text-white align-middle" style="background-color: #133E87;">
                  <tr>
                    <th class="fw-semibold px-3 rounded-start-3" scope="col">No.</th>
                    <th class="fw-semibold px-3" scope="col">Category</th>
                    <th class="fw-semibold px-3" scope="col">Name</th>
                    <th class="fw-semibold px-3" scope="col">Quantity</th>
                    <th class="fw-semibold px-3" scope="col">License Length</th>
                    <th class="fw-semibold px-3" scope="col">Site</th>
                    <th v-if="folderStatus !== 'Pending'" class="fw-semibold px-3 rounded-end-3" scope="col">Created At</th>
                    <th v-if="folderStatus == 'Pending'" class="fw-semibold px-3" scope="col">Created At</th>
                    <th v-if="folderStatus == 'Pending'" class="fw-semibold px-3 rounded-end-3 text-center" scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(service, index) in serviceList" :key="service._id">
                    <td class="px-3">{{ index + 1 }}</td>
                    <td class="px-3">Service</td>
                    <td class="px-3">{{ service.name }}</td>
                    <td class="px-3">{{ service.quantity }}</td>
                    <td class="px-3">{{ service.license }}</td>
                    <td class="px-3">{{ service.site }}</td>
                    <td class="px-3">{{ formatDate(service.createdAt) }}</td>
                    <td v-if="folderStatus == 'Pending'" class="px-3 text-center">
                      <a @click="openEditServiceModal(service)" class="btn rounded-3 fs-6 text-white px-3 py-1 me-2" style="background-color: #133E87;">Edit</a>
                      <a @click="deleteService(service._id)" class="btn rounded-3 fs-6 btn-danger px-2 py-1">Delete</a>
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
  
    <!-- Add/Edit Service Modal (Bootstrap Modal) -->
    <div class="modal fade" id="serviceModal" tabindex="-1" aria-labelledby="serviceModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-semibold" id="serviceModalLabel">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveService">
              <div class="row">
                <div class="col-6 mb-3">
                  <input type="text" v-model="formData.name" class="form-control w-100" placeholder="Name" required />
                </div>
                <div class="col-6 mb-3">
                  <input type="number" v-model="formData.quantity" class="form-control w-100" placeholder="Quantity" required />
                </div>
                <div class="col-6 mb-3">
                  <input type="text" v-model="formData.license" class="form-control w-100" placeholder="License" required />
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
    name: "BoqService",
    components: {
      Sidebar,
      Navbar
    },
    data() {
      return {
        serviceList: [],
        modalTitle: "Add Service",
        formData: {
          name: '',
          quantity: 0,
          license: '',
          site: '',

        },
        editingId: null, // To store the ID of the service being edited
        folderStatus: '', // Store folder status
      };
    },
    methods: {
      fetchService() {
        const token = Cookies.get('authToken');
        const folderId = this.$route.params.folderId; // Get folderId from route params
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
      openAddServiceModal() {
        this.modalTitle = "Add Service";
        this.formData = { name: '', quantity: '', license: '', site: '' };
        this.editingId = null;
        const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
        modal.show();
      },
      openEditServiceModal(service) {
        this.modalTitle = "Edit service";
        this.formData = { ...service }; // Pre-fill the form with existing data
        this.editingId = service._id;
        const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
        modal.show();
      },
      closeModal() {
        const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
        modal.hide();
      },
      saveService() {
        const folderId = this.$route.params.folderId;
        const token = Cookies.get('authToken');
        if (token && folderId) {
          if (this.editingId) {
            // Update existing service
            api.put(`/api/service/${this.editingId}`, this.formData, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then(response => {
              const index = this.serviceList.findIndex(h => h._id === this.editingId);
              this.serviceList[index] = response.data.data; // Update the service in the list
              this.closeModal();
            })
            .catch(error => console.error("Error updating service:", error));
          } else {
            // Add new service
            api.post(`/api/service/${folderId}`, this.formData, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then(response => {
              this.serviceList.push(response.data.data); // Add new service to the list
              this.closeModal();
            })
            .catch(error => console.error("Error saving service:", error));
          }
        }
      },
      deleteService(id) {
        const token = Cookies.get('authToken');
        if (token) {
          api.delete(`/api/service/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            this.serviceList = this.serviceList.filter(service => service._id !== id); // Remove the deleted service
          })
          .catch(error => console.error("Error deleting service:", error));
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
      this.fetchService();
      this.fetchFolderStatus();
    },
  };
  </script>
  
  <style scoped>
  .modal-content {
    border-radius: 8px;
  }
  </style>
  