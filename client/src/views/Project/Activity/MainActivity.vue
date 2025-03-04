<template>
  <div id="app">
    <Sidebar />
    <main class="ms-md-2">
      <div class="p-2 d-flex flex-column" style="height: 100%;">
        <nav class="px-5 pb-4 rounded-top-4" style="background-color: #EFEDEF; padding-top: 2.5rem;">
          <i class="ri-menu-line sidebar-toggle me-3 d-block d-md-none"></i>
          <div class="d-flex flex-column">
            <h3 class="fw-bold fs-3 me-auto mb-md-2" style="color: #133E87;">Deployment</h3>
          </div>
          <Navbar />
        </nav>

        <!-- start: Content -->
        <div class="py-4 px-4 rounded-bottom-4 justify-center flex-grow-1" style="background-color: #EFEDEF; overflow-y: auto;">
          <div class="row g-3 mx-3 px-4 pb-4 rounded-4" style="background-color: #EAE8EA;">
            <div class="d-flex align-items-center py-2 mb-md-2">
              <img src="../../assets/tray.svg" alt="logo" style="width: 40px;" />
              <h1 class="fs-4 fw-bold ms-3">Activity</h1>
            </div>

            <div class="table-responsive px-2">
              <table class="table align-middle" style="white-space: nowrap;">
                <thead class="text-white align-middle" style="background-color: #133E87;">
                  <tr>
                    <th class="fw-semibold px-3 rounded-start-3" scope="col">No.</th>
                    <th class="fw-semibold px-3" scope="col">PO Number</th>
                    <th class="fw-semibold px-3" scope="col">BoQ Number</th>
                    <th class="fw-semibold px-3" scope="col">Vendor</th>
                    <th class="fw-semibold px-3 text-start" scope="col">Site TTC</th>
                    <th class="fw-semibold px-3 rounded-end-3 text-center" scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(order, index) in ordersWithVendorDetails" :key="order._id">
                    <td class="px-3">{{ index + 1 }}</td>
                    <td class="px-3">{{ order.orderNumber }}</td>
                    <td class="px-3">{{ order.boqProjectName }} | {{ order.boqNumberData }}</td>
                    <td class="px-3">
                      {{ order.vendorName }} ({{ order.vendorCompany }})
                    </td>
                    <td class="px-3">
                      <a @click="openAddSiteModal(order._id)" class="fw-semibold py-1 text-start" style="color: #0E2D65; cursor: pointer;">
                        View site
                      </a>
                    </td>
                    <td class="px-3 text-center">
                      <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                          Select Option
                        </button>
                        <ul class="dropdown-menu">
                          <li>
                            <a @click="" class="px-3 py-1">Deployment</a>
                          </li>
                          <li>
                            <a @click="" class="px-3 py-1">Maintenance</a>
                          </li>
                          <li>
                            <a @click="" class="px-3 py-1">Removal</a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <!-- Add/Edit Site -->
  <div class="modal fade" id="siteModal" tabindex="-1" aria-labelledby="siteModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content rounded-4">
        <div class="d-flex p-4">
          <h5 class="modal-title fw-semibold h5" id="siteModalLabel">{{ modalTitle }}</h5>
          <button type="button" class="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body px-4">
          <div class="table-responsive">
            <table class="table align-middle" style="white-space: nowrap;">
              <thead class="text-white align-middle" style="background-color: #0E2D65;">
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
  name: "Purchase Order",
  components: {
    Sidebar,
    Navbar
  },
  data() {
    return {
      vendorList: [],
      orderList: [],
      siteList: [],
      userId: null, // Store the logged-in user's ID
      projectId: null,
      modalTitle: '',
      siteData: {
        site: '',
        startDate: '',
        endDate: ''
      },
      orderId: null, // Store the selected order ID for site modal
    };
  },
  computed: {
    ordersWithVendorDetails() {
      return this.orderList.map(order => {
        const vendor = this.vendorList.find(v => v._id === (order.vendor?._id || order.vendor));
        const boq = this.boqList.find(b => b._id === order.boqNumber); // Find the BOQ by ID
        return {
          ...order,
          vendorName: vendor ? vendor.fullName || vendor.username : 'N/A',
          vendorCompany: vendor ? vendor.companyName : 'N/A',
          boqNumberData: boq ? boq.boqNumber : 'N/A', // Add BOQ number data
          boqProjectName: boq ? boq.projectName : 'N/A', // Add BOQ project name
        };
      });
    },
  },
  methods: {
    async fetchCurrentUser() {
      const token = Cookies.get('authToken');
      if (token) {
        try {
          const response = await api.get('/api/auth/user', {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.userId = response.data.data.userId;
        } catch (error) {
          console.error('Error fetching current user:', error);
        }
      }
    },
    fetchOrder() {
      const token = Cookies.get('authToken');
      if (!token) return;

      api.get('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async response => {
        let orders = response.data.data;
        
        // Fetch project statuses in parallel
        const orderPromises = orders.map(async (order) => {
          if (!order.projectId) return null; // Skip if projectId is missing

          try {
            const projectResponse = await api.get(`/api/project/${order.projectId}/status`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (projectResponse.data.status === "Approved") {
              return { ...order, projectStatus: projectResponse.data.status };
            }
            return null; // Exclude orders not approved
          } catch (error) {
            console.error(`Error fetching project status for order ${order._id}:`, error);
            return null;
          }
        });

        // Wait for all project status requests to resolve
        const filteredOrders = (await Promise.all(orderPromises)).filter(order => order !== null);

        this.orderList = filteredOrders; // Update with approved orders only
      })
      .catch(error => console.error("Error fetching orders:", error));
    },
    async fetchVendors() {
      const token = Cookies.get('authToken');
      if (token) {
        try {
          const response = await api.get('/api/auth/users/role/Vendor', {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.vendorList = response.data.data; // Store the list of vendors
        } catch (error) {
          console.error('Error fetching vendors:', error);
        }
      }
    },
    async fetchApprovedBoqs() {
      const token = Cookies.get('authToken');
      if (token) {
        try {
          const response = await api.get('/api/folder/status/Approved', {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.boqList = response.data.data; // Store the list of approved BOQs
        } catch (error) {
          console.error('Error fetching approved BOQs:', error);
        }
      }
    },
    openAddSiteModal(orderId) {
      this.modalTitle = "Site Data";
      this.siteData = {
        site: '',
        startDate: '',
        endDate: ''
      };
      this.orderId = orderId; // Store the Order ID
      this.fetchSite();
      const modal = new bootstrap.Modal(document.getElementById('siteModal'));
      modal.show();
    },
    fetchSite() {
      const token = Cookies.get('authToken');
      if (token && this.orderId) {
        api.get(`/api/site/${this.orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
          this.siteList = response.data.data; // Update siteList with fetched data
        })
        .catch(error => console.error("Error fetching site:", error));
      }
    },
    formatDate(date) {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    },
    async initializeData() {
      await this.fetchCurrentUser(); // Wait for current user ID to be fetched
      this.fetchOrder();
      this.fetchVendors();
      this.fetchApprovedBoqs();
      this.$nextTick(() => {
        initializeSidebar();
      });
    },
  },
  mounted() {
    this.initializeData();
  },
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.action-icon {
  width: 1.3rem; /* Fixed width */
  height: 1.3rem; /* Fixed height */
  min-width: 1.3rem; /* Prevent shrinking */
  min-height: 1.3rem; /* Prevent shrinking */
  object-fit: contain; /* Ensure the image scales properly */
}

.action-icon:hover {
  opacity: 0.7; /* Slightly reduce opacity on hover */
  transition: opacity 0.2s ease-in-out; /* Smooth transition */
}
</style>