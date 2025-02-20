<template>
  <Sidebar />
    <main class="ms-md-2">
      <div class="p-2">
        <nav class="px-5 pb-4 pt-5 rounded-top-4" style="background-color: #EFEDEF; padding-top: 2.5rem;">
          <i class="ri-menu-line sidebar-toggle me-3 d-block d-md-none"></i>
          <div class="d-flex flex-column">
            <h3 class="fw-bold fs-3 me-auto mb-md-2">Confirmation Project</h3>
          </div>
          <Navbar />
        </nav>

        <div class="py-4 px-4 rounded-bottom-4" style="background-color: #EFEDEF;">
          <ProjectApprovalInfo :projectId="$route.params.projectId" />
          <div class="row g-3 mx-3 px-4 pb-4 rounded-4" style="background-color: #EAE8EA;">
            
            <div class="d-flex align-items-center py-3 mb-md-2">
              <img src="../../assets/layers.png" alt="logo" style="width: 40px;" />
              <h1 class="fs-4 fw-bold mb-md-1 ms-3">Order Data</h1>
            </div>
            
            <div class="table-responsive px-2">
              <table class="table align-middle" style="white-space: nowrap;">
                <thead class="text-white align-middle" style="background-color: #133E87;">
                  <tr>
                    <th class="fw-semibold px-3 rounded-start-3" scope="col">No.</th>
                    <th class="fw-semibold px-3" scope="col">PO Number</th>
                    <th class="fw-semibold px-3" scope="col">BoQ Number</th>
                    <th class="fw-semibold px-3 rounded-end-3" scope="col">Vendor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(order, index) in orderList" :key="order._id">
                    <td class="px-3">{{ index + 1 }}</td>
                    <td class="px-3">{{ order.orderNumber }}</td>
                    <td class="px-3">{{ order.boqNumber }}</td>
                    <td class="px-3">{{ order.vendor }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <hr style="color: #133E87; border-width: 0.2rem;">
            
            <div class="d-flex align-items-center py-3 mb-md-2">
              <img src="../../assets/software.png" alt="logo" style="width: 40px;" />
              <h1 class="fs-4 fw-bold mb-md-1 ms-3">Site Data</h1>
            </div>
            
            <div class="table-responsive px-2">
              <table class="table align-middle" style="white-space: nowrap;">
                <thead class="text-white align-middle" style="background-color: #133E87;">
                  <tr>
                    <th class="fw-semibold px-3 rounded-start-3" scope="col">No.</th>
                    <th class="fw-semibold px-3" scope="col">Site</th>
                    <th class="fw-semibold px-3" scope="col">Start date</th>
                    <th class="fw-semibold px-3 rounded-end-3" scope="col">End date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(site, index) in siteList" :key="site._id">
                    <td class="px-3">{{ index + 1 }}</td>
                    <td class="px-3">{{ site.site }}</td>
                    <td class="px-3">{{ formatDate(site.startDate) }}</td>
                    <td class="px-3">{{ formatDate(site.endDate) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <hr style="color: #133E87; border-width: 0.2rem;">
  
            <div class="text-start py-4">
              <div class="d-flex align-center">
                <input 
                  type="checkbox" 
                  v-model="confirmApproval" 
                  id="approvalCheck" 
                />
                <label for="approvalCheck" class="ms-2 text-wrap">I have completed and i'm ready to submit it.</label>
              </div>
              <br>
              <div class="text-center mt-5">
                <button class="btn btn-md text-white fw-medium px-5" :disabled="!confirmApproval" @click="approveProject" style="background-color: #133E87;">
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
import ProjectApprovalInfo from '../../components/ApprovalProject.vue';
import api from '../../../api';
import Cookies from 'js-cookie';
  
  export default {
    name: "Approval",
    components: {
      Sidebar,
      Navbar,
      ProjectApprovalInfo
    },
    data() {
      return {
        orderList: [],
        siteList: [],
        confirmApproval: false,
      };
    },
    methods: {
      fetchOrder() {
        const token = Cookies.get('authToken');
        const projectId = this.$route.params.projectId;
        if (token) {
            api.get(`/api/order/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(response => {
                this.orderList = response.data.data;
            })
            .catch(error => console.error("Error fetching order:", error));
        }
      },
      fetchSitesByProject() {
        const token = Cookies.get('authToken');
        const projectId = this.$route.params.projectId;

        if (!projectId) {
            console.warn("No projectId provided, skipping fetch.");
            return;
        }

        if (token) {
            api.get(`/api/site/project/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(response => {
                this.siteList = response.data.data; // Update siteList with fetched data
            })
            .catch(error => console.error("Error fetching sites:", error));
        }
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      },
      approveProject() {
        const token = Cookies.get('authToken');
        const projectId = this.$route.params.projectId;
        if (token && projectId) {
          api.put(`/api/project/${projectId}/status`, 
            { status: 'On Review' }, 
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then(response => {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Project submited',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });

                this.$router.push('/project'); // Redirect to project list
            })
            .catch(error => {
                console.error('Error submitting project:', error);
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: 'Failed to submit project',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
            });
        }
      },
    },
    mounted() {
      this.fetchOrder();
      this.fetchSitesByProject();
      this.$nextTick(() => {
        initializeSidebar();
      });
    },
  };
  </script>
  