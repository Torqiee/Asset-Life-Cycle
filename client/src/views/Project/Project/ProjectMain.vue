<template>
  <div id="app">
    <Sidebar />
    <!-- start: Main -->
    <main class="ms-md-2">
      <div class="p-2 d-flex flex-column" style="height: 100%;">
        <!-- start: Navbar -->
        <nav class="px-5 pb-4 pt-5 rounded-top-4" style="background-color: #EFEDEF; padding-top: 2.5rem;">
          <i class="ri-menu-line sidebar-toggle me-3 d-block d-md-none"></i>
          <div class="d-flex flex-column">
            <h3 class="fw-bold fs-3 me-auto mb-md-2">Project Management</h3>
          </div>
          <Navbar />
        </nav>
        <!-- end: Navbar -->

        <!-- start: Content -->
        <div class="py-4 px-4 rounded-bottom-4 flex-grow-1" style="background-color: #EFEDEF; overflow-y: auto;">
          <!-- start: Summary -->
          <div class="row g-3 mx-3 px-4 pb-4 rounded-4" style="background-color: #EAE8EA;">
            <div class="d-flex align-items-center py-2 mb-md-2">
              <img src="../../assets/layers.png" alt="logo" style="width: 40px;" />
              <h1 class="fs-4 fw-bold mb-md-1 ms-3">Projects Data</h1>
              <button v-if="userRole === 'Admin'" class="btn rounded-3 text-white fw-medium ms-auto px-3 py-1" style="background-color: #133E87;"  data-bs-toggle="modal" data-bs-target="#projectModal">
                Create +
              </button>
            </div>

            <div class="table-responsive px-2">
              <table class="table align-middle" style="white-space: nowrap;">
                <thead class="text-white align-middle" style="background-color: #133E87;">
                  <tr>
                    <th class="fw-semibold px-3 rounded-start-3" scope="col">No.</th>
                    <th class="fw-semibold px-3" scope="col">Project Name</th>
                    <th class="fw-semibold px-3" scope="col">Owner Name</th>
                    <th class="fw-semibold px-3" scope="col">Start Date</th>
                    <th class="fw-semibold px-3" scope="col">End Date</th>
                    <th class="fw-semibold px-3 text-center" scope="col">Status</th>
                    <th class="fw-semibold px-3 text-center rounded-end-3" scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(project, index) in projects" :key="project._id">
                    <td class="px-3">{{ index + 1 }}</td>
                    <td class="px-3">{{ project.projectName }}</td>
                    <td class="px-3">{{ project.createdBy }}</td>
                    <td class="px-3">{{ project.startDate }}</td>
                    <td class="px-3">{{ project.endDate }}</td>
                    <td class="px-3">
                      <span :class="statusClass(project.status)" class="px-md-0 px-3 py-1 fw-semibold d-flex justify-center align-items-center rounded-3">
                        {{ project.status }}
                        <img :src="getStatusImage(project.status)" class="ms-2" alt="status icon" style="width: 16px;">
                      </span>
                    </td>
                    <td class="px-3 d-flex justify-center">
                      <router-link v-if="userRole === 'Admin' && project.status == 'Draft'" :to="'/order/' + project._id" class="btn rounded-3 fw-semibold px-3 py-0.5 me-2" style="background-color: #EFEDEF; border-color: #133E87; border-width: 0.150rem; color: #133E87;">Add data +</router-link>
                      <router-link v-if="project.status == 'Approved' || project.status == 'Rejected'" :to="'/order/' + project._id" class="btn rounded-3 fw-semibold px-3 py-0.5 me-2" style="background-color: #EFEDEF; border-color: #133E87; border-width: 0.150rem; color: #133E87;">Detail</router-link>
                      <!-- <router-link v-if="project.status == 'Approved' || project.status == 'Rejected' || project.status == 'Draft'" :to="'/order/' + project._id" class="btn rounded-3 fw-semibold px-3 py-0.5 me-2" style="background-color: #EFEDEF; border-color: #133E87; border-width: 0.150rem; color: #133E87;">View</router-link> -->
                      <!-- <router-link v-if="userRole === 'Admin' && project.status == 'Draft'" :to="'/submit-project/' + project._id" class="btn rounded-3 text-white fw-medium px-3 py-0.5 me-2" style="background-color: #133E87;">Submit</router-link> -->
                      <div v-if="userRole === 'Manager' && project.status == 'On Review'" class="d-flex justify-center gap-2">
                        <div class="btn-group">
                          <button class="me-2">
                              <router-link
                              v-if="project.status !== 'Approved'"
                              :to="'/rejection-project/' + project._id"
                              class="btn border-2 fw-semibold rounded-3 px-3 py-0.5"
                              style="background-color: #EFEDEF; border-color: #a01c1b; border-width: 0.150rem; color: #a01c1b;">
                              Reject
                            </router-link>
                          </button>
                          <button class="me-2">
                              <router-link
                              v-if="project.status !== 'Approved'"
                              :to="'/approval-project/' + project._id"
                              class="btn border-2 fw-semibold rounded-3 px-3 py-0.5"
                              style="background-color: #EFEDEF; border-color: #2a6d20; border-width: 0.150rem; color: #2a6d20;">
                              Approve
                            </router-link>
                          </button>
                        </div>
                      </div>
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
  </div>

  <!-- Add Project -->
  <div class="modal fade" id="projectModal" tabindex="-1" aria-labelledby="projectModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content rounded-4">
        <div class="d-flex p-4">
          <h5 class="modal-title fw-semibold h5" id="projectModalLabel">Add Project</h5>
          <button type="button" class="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body px-4">
          <form @submit.prevent="saveProject" class="row">
            <div class="col-md-6 mb-3">
              <label for="projectName" class="form-label">Project Name</label>
              <input type="text" id="projectName" v-model="formData.projectName" class="form-control bg-white text-start border-3 w-100" required />
            </div>
            <div class="col-md-6 mb-3">
              <label for="nodinNumber" class="form-label">Nodin Number</label>
              <input type="text" id="nodinNumber" v-model="formData.nodinNumber" class="form-control bg-white text-start border-3 w-100" required />
            </div>

            <div class="col-md-4 mb-3">
              <label for="nodinDate" class="form-label">Nodin Date</label>
              <input type="date" id="nodinDate" v-model="formData.nodinDate" class="form-control bg-white border-3 w-100" required />
            </div>
            <div class="col-md-4 mb-3">
              <label for="startDate" class="form-label">Start Date</label>
              <input type="date" id="startDate" v-model="formData.startDate" class="form-control bg-white border-3 w-100" required />
            </div>
            <div class="col-md-4 mb-3">
              <label for="endDate" class="form-label">End Date</label>
              <input type="date" id="endDate" v-model="formData.endDate" class="form-control bg-white border-3 w-100" required />
            </div>

            <!-- Fixed Drag & Drop File Input -->
            <div class="col-md-12 mb-3">
              <label class="form-label">Nodin File</label>
              <div 
                class="drop-zone" 
                @click="triggerFileInput"
                @dragover.prevent="dragOver" 
                @dragleave="dragLeave" 
                @drop="handleDrop"
              >
                <p v-if="!formData.nodinFile">Drag & drop file here or click to upload</p>
                <p v-else>{{ formData.nodinFile.name }}</p>
                <input 
                  type="file" 
                  ref="fileInput" 
                  @change="handleFileUpload" 
                  class="hidden-input"
                />
              </div>
            </div>
            <div class="d-flex justify-content-center">
              <button type="submit" class="btn text-white fw-medium px-4 py-2 mb-2 w-100" style="background-color: #133E87;">Create Project</button>
            </div>
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

import approveImage from '../../assets/approve.svg';
import reviewImage from '../../assets/review.svg';
import rejectImage from '../../assets/reject.svg';
import defaultImage from '../../assets/pending.svg';
  
export default {
  name: "BoqMain",
  components: {
    Sidebar,
    Navbar
  },
  data() {
    return {
      projects: [],
      userRole: '',
      formData: {
        projectName: '',
        createdBy: '',
        nodinNumber: '',
        nodinDate: '',
        nodinFile: null,
        startDate: '',
        endDate: '',
      },
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.formData.nodinFile = file;
      }
    },
    handleDrop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file) {
        this.formData.nodinFile = file;
      }
    },
    dragOver(event) {
      event.preventDefault();
      event.currentTarget.classList.add("drag-over");
    },
    dragLeave(event) {
      event.currentTarget.classList.remove("drag-over");
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async saveProject() {
      const token = Cookies.get('authToken');
      if (!token) {
        console.error("Authentication token not found.");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("projectName", this.formData.projectName);
        formData.append("createdBy", this.formData.createdBy);
        formData.append("nodinNumber", this.formData.nodinNumber);
        formData.append("nodinDate", this.formData.nodinDate);
        formData.append("startDate", this.formData.startDate);
        formData.append("endDate", this.formData.endDate);

        if (this.formData.nodinFile) {
          formData.append("nodinFile", this.formData.nodinFile);
        } else {
          console.error("No file selected.");
          return;
        }

        await api.post('/api/project', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          this.closeModal();
          this.fetchProjects()

          Swal.fire({
            icon: "success",
            title: "Project Created",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
          });
        })

      } catch (error) {
        console.error("Error creating project:", error.response?.data || error.message);
      }
    },
    closeModal() {
      const modalElement = document.getElementById('projectModal');
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    },
    fetchProjects() {
      const token = Cookies.get('authToken');
      if (token) {
        api.get('/api/projects', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then(response => {
          this.projects = response.data.data;
        })
        .catch(error => console.error(error));
      }
    },
    fetchUser() {
      const token = Cookies.get('authToken');
      if (token) {
        api.get('/api/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then(response => {
          this.userRole = response.data.data.role; // Assign the user's role
        })
        .catch(error => console.error(error));
      }
    },
    formatDate(date) {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    },
    statusClass(status) {
      switch (status) {
        case 'Approved':
          return 'custom-approved';
        case 'On Review':
          return 'custom-on-review';
        case 'Rejected':
          return 'custom-rejected';
        default:
          return 'custom-default';
      }
    },
    getStatusImage(status) {
      switch (status) {
        case 'Approved':
          return approveImage;
        case 'On Review':
          return reviewImage;
        case 'Rejected':
          return rejectImage;
        default:
          return defaultImage;
      }
    }
  },
  mounted() {
    this.fetchProjects();
    this.fetchUser(); // Fetch the current user's role
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
  
.custom-approved {
  background-color: #eaf0e9;
  color: #2a6d20;
  /* border-width: 0.150rem;
  border-color: #2a6d20; */
}

.custom-on-review {
  background-color: #faf6e8;
  color: #d5ac2f;
  /* border-width: 0.150rem; */
  /* border-color: ; */
}

.custom-rejected {
  background-color: #f6e8e8;
  color: #a01c1b;
  /* border-width: 0.150rem;
  border-color: #a01c1b; */
}

.custom-default {
  background-color: #f1f0f0;
  color: #5e6266;
  /* border-width: 0.150rem;
  border-color: #1f13a1; */
}
  
  .table-responsive::-webkit-scrollbar {
    display: none; /* Hide scrollbar in WebKit browsers (Chrome, Safari, Edge) */
  }
  
  .py-4.px-4.rounded-bottom-4.flex-grow-1 {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
  }
  
  .py-4.px-4.rounded-bottom-4.flex-grow-1::-webkit-scrollbar {
    display: none; /* Chrome, Safari, and Edge */
  }

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