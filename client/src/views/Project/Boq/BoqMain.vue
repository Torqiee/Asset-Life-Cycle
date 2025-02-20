<template>
  <div id="app">
    <Sidebar />
    <main class="ms-md-2">
      <div class="p-2 d-flex flex-column" style="height: 100%;">

        <nav class="px-5 pb-4 pt-5 rounded-top-4" style="background-color: #EFEDEF; padding-top: 2.5rem;">
          <i class="ri-menu-line sidebar-toggle me-3 d-block d-md-none"></i>
          <div class="d-flex flex-column">
            <h3 class="fw-bold fs-3 me-auto mb-md-2 d-md-block d-none">Bill of Quantity</h3>
          </div>
          <Navbar />
        </nav>

        <div class="py-4 px-4 rounded-bottom-4 flex-grow-1" style="background-color: #EFEDEF; overflow-y: auto;">
          <div class="row g-3 mx-3 px-4 pb-4 rounded-4" style="background-color: #EAE8EA;">
            <div class="d-flex align-items-center py-2 mb-md-2">
              <img src="../../assets/layers.png" alt="logo" style="width: 40px;" />
              <h1 class="fs-4 fw-bold mb-md-1 ms-3 d-md-block d-none">BoQ Database</h1>
              <h1 class="fs-4 fw-bold mb-md-1 ms-3 d-md-none d-block">BoQ</h1>
              <button v-if="userRole === 'Admin'" class="btn rounded-3 text-white fw-medium ms-auto px-3 py-1 d-md-block d-none" style="background-color: #0E2D65;" data-bs-toggle="modal" data-bs-target="#createOption">Create +</button>
              <button v-if="userRole === 'Admin'" class="btn rounded-3 text-white fw-medium ms-auto px-3 py-1 d-md-none d-block" style="background-color: #0E2D65;" data-bs-toggle="modal" data-bs-target="#createOption">+</button>
            </div>

            <div class="table-responsive px-2">
              <table class="table align-middle" style="white-space: nowrap;">
                <thead class="text-white align-middle" style="background-color: #133E87;">
                  <tr>
                    <th class="fw-semibold px-3 rounded-start-3" scope="col">No.</th>
                    <th class="fw-semibold px-3" scope="col">BoQ Number</th>
                    <th class="fw-semibold px-3" scope="col">Project Name</th>
                    <th class="fw-semibold px-3" scope="col">Created By</th>
                    <th class="fw-semibold px-3" scope="col">Created At</th>
                    <th class="fw-semibold px-3 text-center" scope="col">Status</th>
                    <th class="fw-semibold px-3 text-center rounded-end-3" scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(folder, index) in paginatedFolders" :key="folder._id" class="border-bottom border-3">
                    <td class="px-3">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                    <td class="px-3">{{ folder.boqNumber }}</td>
                    <td class="px-3">{{ folder.projectName }}</td>
                    <td class="px-3">{{ folder.createdBy }}</td>
                    <td class="px-3">{{ formatDate(folder.createdAt) }}</td>
                    <td class="px-3">
                      <span :class="statusClass(folder.status)" class="px-md-2 px-3 py-1 fw-semibold d-flex justify-center align-items-center rounded-3">
                        {{ getStatusText(folder.status) }}
                        <img :src="getStatusImage(folder.status)" class="ms-2" alt="status icon" style="width: 16px;">
                      </span>
                    </td>
                    <td class="px-3 text-center">
                      <router-link v-if="userRole === 'Admin' && folder.status == 'Draft'" :to="'/hardware/' + folder._id" class="btn rounded-3 fw-semibold px-3 py-0.5 me-2" style="background-color: #EFEDEF; border-color: #133E87; border-width: 0.150rem; color: #133E87;">Add data +</router-link>
                      <router-link v-if="folder.status == 'Approved' || folder.status == 'Rejected'" :to="'/hardware/' + folder._id" class="btn rounded-3 fw-semibold px-3 py-0.5 me-2" style="background-color: #EFEDEF; border-color: #133E87; border-width: 0.150rem; color: #133E87;">Detail</router-link>
                      <div v-if="userRole === 'Manager' && folder.status == 'On Review'" class="d-flex justify-center gap-2">
                        <div class="btn-group">
                          <button class="me-2">
                              <router-link
                              v-if="folder.status !== 'Approved'"
                              :to="'/Rejection/' + folder._id"
                              class="btn border-2 fw-semibold rounded-3 px-3 py-0.5"
                              style="background-color: #EFEDEF; border-color: #a01c1b; border-width: 0.150rem; color: #a01c1b;">
                              Reject
                            </router-link>
                          </button>
                          <button class="me-2">
                            <router-link
                            v-if="folder.status !== 'Approved'"
                            :to="'/approval/' + folder._id"
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
              <!-- Pagination Nav -->
              <div class="d-flex justify-content-between align-items-center mt-3" style="white-space: nowrap;">
                <p class="m-0">Showing {{ startItem }} - {{ endItem }} of {{ folders.length }} entries</p>
                <nav>
                  <ul class="pagination">
                    <li class="page-item ms-1" :class="{ disabled: currentPage === 1 }">
                      <button class="page-link" @click="currentPage--">Previous</button>
                    </li>
                    
                    <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
                      <button class="page-link" @click="currentPage = page">{{ page }}</button>
                    </li>
                    
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                      <button class="page-link" @click="currentPage++">Next</button>
                    </li>
                  </ul>
                </nav>
              </div>
              <!-- End Pagination -->
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
      <!-- end: Content -->

      <!-- Input Modal Option -->
      <div class="modal fade" id="createOption" tabindex="-1" aria-labelledby="uploadFileModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content p-2 pb-5 rounded-4">
            <div class="d-flex p-3">
              <button type="button" class="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body pb-5">
              <h3 class="h2 text-center fw-bold mb-3">Create BoQ Data</h3>
              <p class="text-center mb-5 fw-medium text-secondary">Select one to input your data</p>
              <div class="row">
                <div class="col-6 justify-items-center" data-bs-toggle="modal" data-bs-target="#createFolderModal">
                  <img src="../../assets/input-boq-manual.svg" alt="" style="width: 9rem;">
                </div>
                <div class="col-6 justify-items-center" data-bs-toggle="modal" data-bs-target="#uploadFileModal">
                  <img src="../../assets/input-boq-excel.svg" alt="" style="width: 9rem;">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bootstrap Modal -->
      <div class="modal fade" id="createFolderModal" tabindex="-1" aria-labelledby="createFolderModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content rounded-4 p-2">
            <div class="d-flex p-3">
              <h6 class="modal-title fw-semibold h5" id="createFolderModalLabel">Create BoQ</h6>
              <button type="button" class="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="submitForm">
                <div class="mb-3">
                  <label for="boqNumber" class="form-label">BoQ Number</label>
                  <input type="text" id="boqNumber" v-model="formData.boqNumber" class="form-control w-100 bg-white border-3 text-start" required />
                </div>
                <div class="mb-3">
                  <label for="projectName" class="form-label">Project Name</label>
                  <input type="text" id="projectName" v-model="formData.projectName" class="form-control w-100 bg-white border-3 text-start" required />
                </div>
                <button type="submit" class="btn text-white fw-medium mb-3 w-100" style="background-color: #133E87;">Create</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Second Modal (File Upload) -->
      <div class="modal fade rounded-5" id="uploadFileModal" tabindex="-1" aria-labelledby="uploadFileModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content rounded-4 p-2">
            <div class="d-flex p-3">
              <h6 class="modal-title fw-semibold h5" id="uploadFileModalLabel">Create BoQ with File</h6>
              <button type="button" class="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="submitFormWithFile">
                <div class="mb-3">
                  <label for="boqNumber" class="form-label">BoQ Number</label>
                  <input type="text" id="boqNumber" v-model="formData.boqNumber" class="form-control w-100 text-start bg-white border-3" required />
                </div>
                <div class="mb-3">
                  <label for="projectName" class="form-label">Project Name</label>
                  <input type="text" id="projectName" v-model="formData.projectName" class="form-control w-100 text-start bg-white border-3" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Upload Excel</label>
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
                  <button type="submit" class="btn text-white fw-medium mb-3 w-100" style="background-color: #133E87;">Create</button>
                  <p class="text-center mt-2">
                    <a :href="filePath" :download="fileName">Download the template here</a>
                  </p>
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
import Swal from 'sweetalert2';

import approveImage from '../../assets/approve.svg';
import reviewImage from '../../assets/review.svg';
import rejectImage from '../../assets/reject.svg';
import defaultImage from '../../assets/pending.svg';
import excelTemplate from '../../assets/boQ_template.xlsx'

export default {
  name: "BoqMain",
  components: {
    Sidebar,
    Navbar
  },
  data() {
    return {
      filePath: excelTemplate,
      fileName: "BoqTemplate.xlsx",
      folders: [],
      userRole: '',
      showModal: false,
      formData: { boqNumber: '', projectName: '' },
      currentPage: 1,
      itemsPerPage: 10
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.folders.length / this.itemsPerPage);
    },
    paginatedFolders() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.folders.slice(start, end);
    },
    startItem() {
      return (this.currentPage - 1) * this.itemsPerPage + 1;
    },
    endItem() {
      return Math.min(this.currentPage * this.itemsPerPage, this.folders.length);
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.formData.nodinFile = file;
      }
    },
    dragOver(event) {
      event.preventDefault();
      event.currentTarget.classList.add('drag-over');
    },
    dragLeave(event) {
      event.currentTarget.classList.remove('drag-over');
    },
    handleDrop(event) {
      event.preventDefault();
      event.currentTarget.classList.remove('drag-over');
      const file = event.dataTransfer.files[0];
      if (file) {
        this.formData.nodinFile = file;
      }
    },
    getStatusText(status) {
      if (status === "On Review" && this.userRole === "Manager") {
        return "Need Approval";
      }
      if (status === "Draft" && this.userRole === "Manager") {
        return "On Draft";
      }
      return status;
    },
    async submitFormWithFile() {
      const token = Cookies.get('authToken');
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Unauthorized',
          text: 'Please log in to continue.',
        });
        return;
      }

      try {
        // Step 1: Create the folder first
        const folderResponse = await api.post('/api/folder', this.formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const createdFolder = folderResponse.data.data;
        const folderId = createdFolder._id;

        // Step 2: Handle file upload
        const fileInput = this.$refs.fileInput; // Use the ref to access the file input
        if (!fileInput.files || !fileInput.files.length) {
          Swal.fire({
            icon: 'warning',
            title: 'No file selected',
            text: 'Please upload a file before submitting.',
          });
          return;
        }

        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('folderId', folderId); // Attach the created folder ID

        await api.post('/api/upload', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'BoQ Created Successfully with File',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        this.formData = { boqNumber: '', projectName: '' };
        fileInput.value = ''; // Clear the file input

        const modal = bootstrap.Modal.getInstance(document.getElementById('uploadFileModal'));
        modal.hide();

        // Redirect to the hardware page for the newly created BoQ
        setTimeout(() => {
          this.$router.push(`/hardware/${folderId}`);
        }, 500);

      } catch (error) {
        console.error('Error uploading file:', error);
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: 'Please recheck your file data first.',
        });
      }
    },
    async submitForm() {
      const token = Cookies.get('authToken');
      if (token) {
        try {
          await api.post('/api/folder', this.formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          this.fetchFolders();

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'BoQ Created Successfully',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });

          this.formData = { boqNumber: '', projectName: '' };

          const modal = bootstrap.Modal.getInstance(document.getElementById('createFolderModal'));
          modal.hide();

          // Redirect to the latest folder's page
          setTimeout(() => {
            if (this.folders.length > 0) {
              const latestFolder = this.folders[0];
              if (latestFolder && latestFolder._id) {
                this.$router.push(`/hardware/${latestFolder._id}`);
              } else {
                console.error("Latest folder ID is missing.");
              }
            }
          }, 500);
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
          }
        })
        .then(response => {
          this.folders = response.data.data.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
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
          this.userRole = response.data.data.role;
        })
        .catch(error => console.error(error));
      }
    },
    formatDate(date) {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
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
    this.fetchFolders();
    this.fetchUser();
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
  height: 100%;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

main::-webkit-scrollbar {
  display: none;
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


.table-responsive::-webkit-scrollbar {
  display: none;
}

.py-4.px-4.rounded-bottom-4.flex-grow-1 {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.py-4.px-4.rounded-bottom-4.flex-grow-1::-webkit-scrollbar {
  display: none;
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

.hidden-input {
  display: none;
}
</style>