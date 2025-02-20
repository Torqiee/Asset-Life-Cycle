<template>
  <Sidebar />
  <main class="ms-md-2">
    <div class="p-2">
      <!-- start: Navbar -->
      <nav class="px-5 pb-4 rounded-top-4" style="background-color: #EFEDEF; padding-top: 2.5rem;">
        <i class="ri-menu-line sidebar-toggle me-3 d-block d-md-none"></i>
        <div class="d-flex flex-column">
          <h3 class="fw-bold fs-3 me-auto mb-md-2" style="color: #133E87;">Project Management</h3>
        </div>
        <Navbar />
      </nav>
      <!-- end: Navbar -->

      <div class="py-4 px-4 rounded-bottom-4" style="background-color: #EFEDEF;">
        <div class="row g-3 mx-3 px-4 pb-4 rounded-4" style="background-color: #EAE8EA;">
          <div class="d-flex align-items-center py-2 mb-md-3">
            <img src="../../assets/layers.png" alt="logo" style="width: 40px;" />
            <h3 class="fs-4 fw-bold mb-md-1 ms-3">Create new project</h3>
          </div>

          <form @submit.prevent="submitForm" class="row">
            <div class="col-md-6 mb-3">
              <label for="projectName" class="form-label">Project Name</label>
              <input type="text" id="projectName" v-model="formData.projectName" class="form-control text-start border-3 w-100" required />
            </div>
            <div class="col-md-6 mb-3">
              <label for="nodinNumber" class="form-label">Nodin Number</label>
              <input type="text" id="nodinNumber" v-model="formData.nodinNumber" class="form-control text-start border-3 w-100" required />
            </div>

            <div class="col-md-4 mb-3">
              <label for="nodinDate" class="form-label">Nodin Date</label>
              <input type="date" id="nodinDate" v-model="formData.nodinDate" class="form-control border-3 w-100" required />
            </div>
            <div class="col-md-4 mb-3">
              <label for="startDate" class="form-label">Start Date</label>
              <input type="date" id="startDate" v-model="formData.startDate" class="form-control border-3 w-100" required />
            </div>
            <div class="col-md-4 mb-3">
              <label for="endDate" class="form-label">End Date</label>
              <input type="date" id="endDate" v-model="formData.endDate" class="form-control border-3 w-100" required />
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

            <div class="d-flex justify-content-end">
              <button type="submit" class="btn text-white fw-medium px-4 py-2" style="background-color: #133E87;">Create Project</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>


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

<script>
import Sidebar from '../../components/Sidebar.vue';
import Navbar from '../../components/Navbar.vue';
import api from '../../../api';
import Cookies from 'js-cookie';

export default {
  name: "AddProject",
  components: {
    Sidebar,
    Navbar
  },
  data() {
    return {
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
    // Handle file selection via input
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.formData.nodinFile = file;
      }
    },
    // Handle drag-and-drop file selection
    handleDrop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file) {
        this.formData.nodinFile = file;
      }
    },
    // Prevent unwanted styling issues
    dragOver(event) {
      event.preventDefault();
      event.currentTarget.classList.add("drag-over");
    },
    dragLeave(event) {
      event.currentTarget.classList.remove("drag-over");
    },
    // Trigger file input when clicking the drop zone
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async submitForm() {
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
        });

        this.$router.push('/project'); // Redirect after success
      } catch (error) {
        console.error("Error creating project:", error.response?.data || error.message);
      }
    },
  },
};
</script>