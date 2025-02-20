<template>
    <Sidebar />
    <!-- start: Main -->
    <main class="ms-md-2">
      <div class="p-2">
        <!-- start: Navbar -->
        <nav class="px-5 pb-4 rounded-top-4" style="background-color: #EFEDEF; padding-top: 2.5rem;">
          <i class="ri-menu-line sidebar-toggle me-3 d-block d-md-none"></i>
          <div class="d-flex flex-column">
            <h3 class="fw-bold fs-3 me-auto mb-md-2" style="color: #133E87;">Add Folder</h3>
          </div>
        </nav>
        <!-- end: Navbar -->
  
        <!-- start: Content -->
        <div class="py-4 px-4 rounded-bottom-4" style="background-color: #EFEDEF;">
          <!-- start: Form -->
          <div class="row g-3 mx-3 px-4 pb-4 rounded-4" style="background-color: #EAE8EA;">
            <div class="d-flex align-items-center py-2 mb-md-3">
              <img src="../../assets/layers.png" alt="logo" style="width: 40px;" />
              <h1 class="fs-4 fw-bold mb-md-1 ms-3">Create New Folder</h1>
            </div>
  
            <form @submit.prevent="submitForm" class="row">
              <div class="col-6 mb-3">
                <label for="boqNumber" class="form-label">BoQ Number</label>
                <input type="text" id="boqNumber" v-model="formData.boqNumber" class="form-control text-start border-3 w-100" required/>
              </div>
  
              <div class="col-6 mb-3">
                <label for="projectName" class="form-label">Project Name</label>
                <input type="text" id="projectName" v-model="formData.projectName" class="form-control text-start border-3 w-100" required />
              </div>
  
              <!-- <div class="mb-3">
                <label for="createdBy" class="form-label">Created By</label>
                <input type="text" id="createdBy" v-model="formData.createdBy" class="form-control w-100" required />
              </div> -->
  
              <div class="d-flex justify-content-end">
                <button type="submit" class="btn text-white fw-medium px-4 py-2" style="background-color: #133E87;">Create Folder</button>
              </div>
            </form>
          </div>
          <!-- end: Form -->
        </div>
        <!-- end: Content -->
      </div>
    </main>
  </template>
  
  <script>
  import Sidebar from '../../components/Sidebar.vue';
  import api from '../../../api';
  import Cookies from 'js-cookie';
  import { useRouter } from 'vue-router';
  
  export default {
    name: "AddFolder",
    components: {
      Sidebar,
    },
    data() {
      return {
        formData: {
          boqNumber: '',
          projectName: '',
        //   createdBy: '',
        },
      };
    },
    methods: {
      async submitForm() {
        const token = Cookies.get('authToken');
        if (token) {
          try {
            await api.post('/api/folder', this.formData, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            // Fetch the latest list of folders
            this.fetchFolders();

            // Find the latest folder (assuming it's the last one created)
            setTimeout(() => {
              if (this.folders.length > 0) {
                const latestFolder = this.folders[this.folders.length - 1];
                if (latestFolder && latestFolder._id) {
                  this.$router.push(`/hardware/${latestFolder._id}`);
                } else {
                  console.error("Latest folder ID is missing.");
                }
              }
            }, 500); // Adding a small delay to ensure data is fetched
          } catch (error) {
            console.error("Error creating folder:", error);
          }
        }
      },

      fetchFolders() {
        const token = Cookies.get('authToken');
        if (token) {
          api.get('/api/folders', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(response => {
            this.folders = response.data.data;
          })
          .catch(error => console.error("Error fetching folders:", error));
        }
      },
    },
  };
  </script>