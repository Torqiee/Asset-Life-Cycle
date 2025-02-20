<template>
  <Sidebar />
    <main class="ms-md-2">
      <div class="p-2">
        <nav class="px-5 pb-4 rounded-top-4" style="background-color: #EFEDEF; padding-top: 2.5rem;">
          <i class="ri-menu-line sidebar-toggle me-3 d-block d-md-none"></i>
          <div class="d-flex flex-column">
            <h3 class="fw-bold fs-3 me-auto" style="color: #133E87;">Confirmation Bill of Quantity</h3>
          </div>
          <Navbar />
        </nav>
          
        <div class="d-md-block d-none py-1 px-4" style="background-color: #EFEDEF;">
          <ol class="breadcrumb fw-semibold mt-4 mb-3 justify-content-md-center justify-content-start align-items-center custom-breadcrumb" style="--bs-breadcrumb-divider: '';">
            <router-link :to="{ path: `/hardware/${$route.params.folderId}` }" class="breadcrumb-item" style="color: #133E87;">
              <span class="d-flex align-middle fw-semibold">
                <img src="../../assets/checkmark.svg" class="me-3" style="width: 25px;">
                1. <span class="ms-3 text-dark">Hardware, Software, Service</span>
              </span>
            </router-link>
            <hr class="mx-3 rounded-4" style="width: 6rem; border-width: 0.4rem; border-color: #133E87;">
            <router-link :to="{ path: `/hardware/${$route.params.folderId}` }" class="breadcrumb-item" style="color: #133E87;">
              <span class="d-flex align-middle fw-semibold">
                <img src="../../assets/step.svg" class="me-3" style="width: 25px;">
                2. <span class="ms-3">Review and Submit Data</span>
              </span>
            </router-link>
          </ol>
        </div>

        <div class="py-4 px-4 rounded-bottom-4" style="background-color: #EFEDEF;">
          <ApprovalInfo :folderId="$route.params.folderId" />
          <div class="row g-3 mx-3 px-4 pb-4 rounded-4" style="background-color: #EAE8EA;">
            
            <div class="d-flex align-items-center py-3 mb-md-2">
              <img src="../../assets/layers.png" alt="logo" style="width: 40px;" />
              <h1 class="fs-4 fw-bold ms-3">Hardware Data</h1>
            </div>
            
            <div class="table-responsive px-2" style="max-height: 300px; overflow-y: auto;">
              <table class="table align-middle" style="white-space: nowrap;">
                <thead class="text-white align-middle" style="background-color: #133E87; position: sticky; top: 0;">
                  <tr>
                    <th class="fw-semibold px-3 rounded-start-3" scope="col">No.</th>
                    <th class="fw-semibold px-3" scope="col">Category</th>
                    <th class="fw-semibold px-3" scope="col">Type</th>
                    <th class="fw-semibold px-3" scope="col">Brand</th>
                    <th class="fw-semibold px-3" scope="col">Series</th>
                    <th class="fw-semibold px-3" scope="col">Unit</th>
                    <th class="fw-semibold px-3" scope="col">Quantity</th>
                    <th class="fw-semibold px-3" scope="col">Site</th>
                    <th class="fw-semibold px-3 rounded-end-3" scope="col">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(hardware, index) in hardwareList" :key="hardware._id" class="border-1 border-secondary">
                    <td class="px-3">{{ index + 1 }}</td>
                    <td class="px-3">Hardware</td>
                    <td class="px-3">{{ hardware.type }}</td>
                    <td class="px-3">{{ hardware.brand }}</td>
                    <td class="px-3">{{ hardware.series }}</td>
                    <td class="px-3">{{ hardware.unit }}</td>
                    <td class="px-3">{{ hardware.quantity }}</td>
                    <td class="px-3">{{ hardware.site }}</td>
                    <td class="px-3">{{ formatDate(hardware.createdAt) }}</td>
                  </tr>
                </tbody>
              </table>
              <div v-if="hardwareList.length === 0" class="text-center py-3">
                <p class="text-muted">No Hardware data available.</p>
              </div>
            </div>

            <hr>

            <div class="d-flex align-items-center py-3 mb-md-2">
              <img src="../../assets/software.png" alt="logo" style="width: 40px;" />
              <h1 class="fs-4 fw-bold ms-3">Software Data</h1>
            </div>

            <div class="table-responsive px-2" style="max-height: 300px; overflow-y: auto;">
              <table class="table align-middle" style="white-space: nowrap;">
                <thead class="text-white align-middle" style="background-color: #133E87; position: sticky; top: 0;">
                  <tr>
                    <th class="fw-semibold px-3 rounded-start-3" scope="col">No.</th>
                    <th class="fw-semibold px-3" scope="col">Category</th>
                    <th class="fw-semibold px-3" scope="col">Brand</th>
                    <th class="fw-semibold px-3" scope="col">Series</th>
                    <th class="fw-semibold px-3" scope="col">License</th>
                    <th class="fw-semibold px-3" scope="col">Quantity</th>
                    <th class="fw-semibold px-3" scope="col">Site</th>
                    <th class="fw-semibold px-3 rounded-end-3" scope="col">Created At</th>
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
                  </tr>
                </tbody>
              </table>
              <div v-if="softwareList.length === 0" class="text-center py-3">
                <p class="text-muted">No Software data available.</p>
              </div>
            </div>

            <hr>

            <div class="d-flex align-items-center py-3 mb-md-2">
              <img src="../../assets/settings.svg" alt="logo" style="width: 40px;" />
              <h1 class="fs-4 fw-bold ms-3">Service Data</h1>
            </div>

            <div class="table-responsive px-2" style="max-height: 300px; overflow-y: auto;">
              <table class="table align-middle" style="white-space: nowrap;">
                <thead class="text-white align-middle" style="background-color: #133E87; position: sticky; top: 0;">
                  <tr>
                    <th class="fw-semibold px-3 rounded-start-3" scope="col">No.</th>
                    <th class="fw-semibold px-3" scope="col">Category</th>
                    <th class="fw-semibold px-3" scope="col">Name</th>
                    <th class="fw-semibold px-3" scope="col">Quantity</th>
                    <th class="fw-semibold px-3" scope="col">License Length</th>
                    <th class="fw-semibold px-3" scope="col">Site</th>
                    <th class="fw-semibold px-3 rounded-end-3" scope="col">Created At</th>
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
                  </tr>
                </tbody>
              </table>
              <div v-if="serviceList.length === 0" class="text-center py-3">
                <p class="text-muted">No Service data available.</p>
              </div>
            </div>
              
            <div class="text-start py-4">
              <input 
                type="checkbox" 
                v-model="confirmApproval" 
                id="approvalCheck" 
              />
              <label for="approvalCheck" class="ms-2">I have completed BoQ data and am ready to submit it.</label>
              <br>
              <div class="text-center mt-5">
                  <button class="btn btn-md text-white fw-medium px-5" :disabled="!confirmApproval" @click="approveBoq" style="background-color: #133E87;">
                    Submit
                  </button>
              </div>
            </div>
            </div>
          </div>
        </div>
    </main>
</template>
  
<script>
  import Sidebar from '../../components/Sidebar.vue';
  import Navbar from '../../components/Navbar.vue';
  import ApprovalInfo from '../../components/Approval.vue';
  import api from '../../../api';
  import Cookies from 'js-cookie';
  
  export default {
    name: "Approval",
    components: {
      Sidebar,
      Navbar,
      ApprovalInfo
    },
    data() {
      return {
        hardwareList: [],
        softwareList: [],
        serviceList: [],
        confirmApproval: false,
      };
    },
    methods: {
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
      formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      },
      approveBoq() {
        const token = Cookies.get('authToken');
        const folderId = this.$route.params.folderId;
        if (token && folderId) {
          api.put(`/api/folder/${folderId}/status`, 
            { status: 'On Review' }, 
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then(response => {
            Swal.fire({
              icon: 'success',
              title: 'BoQ Submitted',
              text: 'The BoQ has been submitted successfully.',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000
            });
            this.$router.push('/boq'); // Redirect to main page
          })
          .catch(error => {
            console.error('Error approving BoQ:', error);
            alert('Failed to approve BoQ.');
          });
        }
      },
    },
    mounted() {
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
  .progress-hr {
    width: 6rem;
    height: 0.400rem;
    border: none;
    background-color: #133E87;
    transform-origin: left;
    animation: progressFill 2s ease-in-out infinite;
  }
  
  @keyframes progressFill {
    0% {
      transform: scaleX(0);
      opacity: 1;
    }
    90% {
      transform: scaleX(1);
      opacity: 1;
    }
    100% {
      transform: scaleX(1);
      opacity: 0;
    }
  }

/* Global Scrollbar CSS */
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
  margin: 5px;
}

::-webkit-scrollbar-thumb {
  background: #133E87;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #0E2D65;
}

/* Firefox (limited support) */
* {
  scrollbar-width: thin;
  scrollbar-color: #a7a8ab #f1f1f1;
}

</style>