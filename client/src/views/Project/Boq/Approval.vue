<template>
    <Sidebar />
    <!-- start: Main -->
    <main class="ms-md-2">
      <div class="p-2">
        <!-- start: Navbar -->
        <nav class="px-5 pb-4 rounded-top-4" style="background-color: #EFEDEF; padding-top: 2.5rem;">
          <i class="ri-menu-line sidebar-toggle me-3 d-block d-md-none"></i>
          <div class="d-flex flex-column">
            <h3 class="fw-bold fs-3 me-auto mb-md-2" style="color: #133E87;">Approval Bill of Quantity</h3>
          </div>
          <Navbar />
        </nav>
        <!-- end: Navbar -->
  
        <!-- start: Content -->
        <div class="py-4 px-4 rounded-bottom-4" style="background-color: #EFEDEF;">
          <div class="row g-3 mx-3 px-4 pb-4 rounded-4" style="background-color: #EAE8EA;">
  
            <!-- Hardware -->
            <div class="d-flex align-items-center py-2 mb-md-2">
              <img src="../../assets/layers.png" alt="logo" style="width: 40px;" />
              <h1 class="fs-4 fw-bold mb-md-1 ms-3">Hardware Data</h1>
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
                    <th class="fw-semibold px-3 rounded-end-3" scope="col">Created At</th>
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
                  </tr>
                </tbody>
              </table>
            </div>
  
            <!-- Software -->
            <div class="d-flex align-items-center py-2 mb-md-2">
              <img src="../../assets/software.png" alt="logo" style="width: 40px;" />
              <h1 class="fs-4 fw-bold mb-md-1 ms-3">Software Data</h1>
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
            </div>
  
            <!-- Service -->
            <div class="d-flex align-items-center py-2 mb-md-2">
              <img src="../../assets/settings.svg" alt="logo" style="width: 40px;" />
              <h1 class="fs-4 fw-bold mb-md-1 ms-3">Service Data</h1>
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
              <!-- Approval Section -->
              <div class="text-start py-4">
                <input 
                  type="checkbox" 
                  v-model="confirmApproval" 
                  id="approvalCheck" 
                />
                <label for="approvalCheck" class="ms-2">I have completed my review of the BoQ data and am ready to approve it.</label>
                <br>
                <div class="text-center mt-5">
                    <button class="btn btn-md text-white fw-medium px-5" :disabled="!confirmApproval" @click="approveBoq" style="background-color: #133E87;">
                      Approve
                    </button>
                </div>
              </div>
            </div>
          </div>
  
        </div>
        <!-- end: Content -->
      </div>
    </main>
  </template>
  
  <script>
  import Sidebar from '../../components/Sidebar.vue';
  import Navbar from '../../components/Navbar.vue';
  import api from '../../../api';
  import Cookies from 'js-cookie';
  
  export default {
    name: "Approval",
    components: {
      Sidebar,
      Navbar
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
            { status: 'Approved' }, 
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then(response => {
            alert('BoQ approved successfully!');
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
    },
  };
  </script>
  