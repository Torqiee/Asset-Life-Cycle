<template>
  <div id="app">
    <Sidebar />
    <!-- start: Main -->
    <main class="ms-md-2">
      <div class="p-2 d-flex flex-column" style="height: 100%;">
        <!-- start: Navbar -->
        <nav class="px-5 pb-4 rounded-top-4" style="background-color: #EFEDEF; padding-top: 2.5rem; --bs-breadcrumb-divider: '|';">
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

        <!-- start: Content -->
        <div class="py-4 px-4 rounded-bottom-4 flex-grow-1" style="background-color: #EFEDEF;">
          <div class="row g-3 mx-3 px-4 pb-4 rounded-4 justify-center" style="background-color: #EAE8EA;">
            <BoqStatus :folderId="$route.params.folderId" :folderStatus="folderStatus" />
            <FolderInfo :folderId="$route.params.folderId" />

            <div class="d-flex align-items-center py-2 mb-md-2">
              <img src="../../assets/software.png" alt="logo" style="width: 40px;" />
              <div class="">
                <h1 class="fs-4 fw-bold mb-md-1 ms-3">Software</h1>
                <ol class="breadcrumb fw-semibold mb-0 ms-2 ps-2" style="--bs-breadcrumb-divider: '|';">
                  <router-link :to="{ path: `/hardware/${$route.params.folderId}` }" class="breadcrumb-item">Hardware</router-link>
                  <router-link :to="{ path: `/software/${$route.params.folderId}` }" class="breadcrumb-item " style="color: #133E87;">
                    <span class="badge fw-medium" style="background-color: #133E87;">
                      Software
                    </span>
                  </router-link>
                  <router-link :to="{ path: `/service/${$route.params.folderId}` }" class="breadcrumb-item">Service</router-link>
                </ol>
              </div>
              <button v-if="folderStatus == 'Draft'" @click="openAddSoftwareModal" class="btn rounded-3 text-white fw-medium ms-auto px-3 py-1 me-2" style="background-color: #133E87;">Add +</button>
            </div>
  
            <div class="table-responsive px-2">
              <table class="table align-middle" style="white-space: nowrap;">
                <thead class="text-white align-middle" style="background-color: #133E87;">
                  <tr>
                    <th class="fw-semibold px-3 rounded-start-3" scope="col">No.</th>
                    <th class="fw-semibold px-3" scope="col">Category</th>
                    <th class="fw-semibold px-3" scope="col">Brand</th>
                    <th class="fw-semibold px-3" scope="col">Series</th>
                    <th class="fw-semibold px-3" scope="col">License</th>
                    <th class="fw-semibold px-3" scope="col">Quantity</th>
                    <th class="fw-semibold px-3" scope="col">Site</th>
                    <th v-if="folderStatus !== 'Draft'" class="fw-semibold px-3 rounded-end-3" scope="col">Created At</th>
                    <th v-if="folderStatus == 'Draft'" class="fw-semibold px-3" scope="col">Created At</th>
                    <th v-if="folderStatus == 'Draft'" class="fw-semibold px-3 rounded-end-3 text-center" scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(software, index) in paginatedSoftware" :key="software._id" class="border-bottom border-3">
                    <td class="px-3">{{ index + 1 }}</td>
                    <td class="px-3">Software</td>
                    <td class="px-3">{{ software.brand }}</td>
                    <td class="px-3">{{ software.series }}</td>
                    <td class="px-3">{{ software.license }}</td>
                    <td class="px-3">{{ software.quantity }}</td>
                    <td class="px-3">{{ software.site }}</td>
                    <td class="px-3">{{ formatDate(software.createdAt) }}</td>
                    <td v-if="folderStatus == 'Draft'" class="px-3 text-center">
                      <a @click="openEditSoftwareModal(software)" class="btn rounded-3 fs-6 text-white px-3 py-0 me-2" style="background-color: #133E87;">Edit</a>
                      <a @click="deleteSoftware(software._id)" class="btn rounded-3 fs-6 btn-danger px-2 py-0">Delete</a>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- Display message if no software data -->
              <div v-if="softwareList.length === 0" class="text-center py-3">
                <p class="text-muted">No Software data available.</p>
              </div>

              <!-- Bootstrap Pagination -->
              <div class="d-flex justify-content-between align-items-center mt-3" style="white-space: nowrap;">
                <p class="m-0">Showing {{ startItem }} - {{ endItem }} of {{ softwareList.length }} entries</p>
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
                  Submit
                </router-link>
                <button 
                  v-else-if="folderStatus == 'Draft' && (hardwareList.length === 0 && softwareList.length === 0 && serviceList.length === 0)" 
                  class="btn rounded-3 fw-semibold ms-auto px-3 py-1 bg-white" 
                  style="color: #133E87; cursor: not-allowed;" 
                  disabled
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- end: Content -->
      </div>
    </main>
  </div>
  
    <!-- Add/Edit Software Modal (Bootstrap Modal) -->
    <div class="modal fade" id="softwareModal" tabindex="-1" aria-labelledby="softwareModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content rounded-4">
          <div class="d-flex p-4">
            <h5 class="modal-title fw-semibold h5" id="softwareModalLabel">{{ modalTitle }}</h5>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body px-4">
            <form @submit.prevent="saveSoftware">
              <div class="row mb-2">
                <div class="col-6 mb-3">
                  <label for="brand" class="form-label">Brand</label>
                  <input type="text" id="brand" v-model="formData.brand" class="form-control w-100 text-start bg-white border-3" required />
                </div>
                <div class="col-6 mb-3">
                  <label for="series" class="form-label">Series</label>
                  <input type="text" id="series" v-model="formData.series" class="form-control w-100 text-start bg-white border-3" required />
                </div>
                <div class="col-6 mb-3">
                  <label for="quantity" class="form-label">Quantity</label>
                  <input type="number" id="quantity" v-model="formData.quantity" class="form-control w-100 text-start bg-white border-3" required />
                </div>
                <div class="col-6 mb-3">
                  <label for="site" class="form-label">Site</label>
                  <input type="text" id="site" v-model="formData.site" class="form-control w-100 text-start bg-white border-3" required />
                </div>
                <div class="col-12 mb-3">
                  <label for="license" class="form-label">License</label>
                  <input type="text" id="license" v-model="formData.license" class="form-control w-100 text-start bg-white border-3" placeholder="DD/MM/YYYY - DD/MM/YYYY" required />
                </div>
              </div>
              <button type="submit" class="btn text-white fw-medium w-100 py-2 mb-3" style="background-color: #133E87;">Add to BoQ</button>
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
    name: "BoqSoftware",
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
        modalTitle: "Add software",
        formData: {
          brand: '',
          series: '',
          license: '',
          quantity: 0,
          site: ''
        },
        editingId: null,
        folderStatus: '',
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.softwareList.length / this.perPage);
      },
      paginatedSoftware() {
        const start = (this.currentPage - 1) * this.perPage;
        const end = start + this.perPage;
        return this.softwareList.slice(start, end);
      },
      totalPages() {
        return Math.ceil(this.softwareList.length / this.perPage);
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
        return Math.min(this.currentPage * this.perPage, this.softwareList.length);
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
      openAddSoftwareModal() {
        this.modalTitle = "Add Software";
        this.formData = { brand: '', series: '', license: '', quantity: 0, site: '' };
        this.editingId = null;
        const modal = new bootstrap.Modal(document.getElementById('softwareModal'));
        modal.show();
      },
      openEditSoftwareModal(software) {
        this.modalTitle = "Edit software";
        this.formData = { ...software };
        this.editingId = software._id;
        const modal = new bootstrap.Modal(document.getElementById('softwareModal'));
        modal.show();
      },
      closeModal() {
        const modalElement = document.getElementById('softwareModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
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

              Swal.fire({
                icon: 'success',
                title: 'Software Updated',
                text: 'The Software has been updated successfully.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
              });
            })
            .catch(error => {
              console.error("Error updating software:", error);
              Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Something went wrong while updating the software.',
              });
            });          
        } else {
            // Add new software
            api.post(`/api/software/${folderId}`, this.formData, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then(response => {
              this.softwareList.push(response.data.data); // Add new software to the list
              this.closeModal();

              Swal.fire({
                icon: 'success',
                title: 'Software Added',
                text: 'The Software has been added successfully.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
              });
            })
            .catch(error => {
              console.error("Error saving software:", error);
              Swal.fire({
                icon: 'error',
                title: 'Addition Failed',
                text: 'Something went wrong while adding the software.',
              });
            });          
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
            this.softwareList = this.softwareList.filter(software => software._id !== id);
          })
          .catch(error => console.error("Error deleting software:", error));
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
      this.fetchFolderStatus();
      this.fetchHardware();
      this.fetchSoftware();
      this.fetchService();
      this.$nextTick(() => {
        initializeSidebar();
      });
    },
  };
  </script>
  
<style scoped>
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