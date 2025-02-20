<template>
  <div id="app">
    <Sidebar />
    <main class="ms-md-2">
      <div class="p-2 d-flex flex-column" style="height: 100%;">

        <nav class="px-5 pb-4 rounded-top-4" style="background-color: #EFEDEF; padding-top: 2.5rem;">
          <i class="ri-menu-line sidebar-toggle me-3 d-block d-md-none"></i>
          <div class="d-flex flex-column">
            <h3 class="fw-bold fs-3 me-auto mb-md-2" style="color: #133E87;">Purchase Order</h3>
          </div>
          <Navbar />
        </nav>
  
        <div class="py-4 px-4 rounded-bottom-4 flex-grow-1" style="background-color: #EFEDEF;">
          <div class="row g-3 mx-3 px-4 pb-4 rounded-4" style="background-color: #EAE8EA;">
            <div class="d-flex align-items-center py-2 mb-md-2">
              <img src="../../assets/folder.svg" alt="logo" style="width: 40px;" />
              <h1 class="fs-4 fw-bold ms-3">PO Data</h1>
              <button v-if="projectStatus == 'Draft'" @click="openAddOrderModal" class="btn rounded-3 text-white fw-medium ms-auto px-3 py-1" style="background-color: #0E2D65;">Add +</button>
            </div>
  
            <div class="table-responsive px-2">
              <table class="table align-middle" style="white-space: nowrap;">
                <thead class="text-white align-middle" style="background-color: #133E87;">
                  <tr>
                    <th class="fw-semibold px-3 rounded-start-3" scope="col">No.</th>
                    <th class="fw-semibold px-3" scope="col">PO Number</th>
                    <th class="fw-semibold px-3" scope="col">BoQ Number</th>
                    <th class="fw-semibold px-3" scope="col">Vendor</th>
                    <th v-if="projectStatus !== 'Draft'" class="fw-semibold px-3 rounded-end-3 text-start" scope="col">Site TTC</th>
                    <th v-if="projectStatus == 'Draft'" class="fw-semibold px-3 text-start" scope="col">Site TTC</th>
                    <th v-if="projectStatus == 'Draft'" class="fw-semibold px-3 rounded-end-3 text-center" scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(order, index) in ordersWithVendorDetails" :key="order._id">
                    <td class="px-3">{{ index + 1 }}</td>
                    <td class="px-3">{{ order.orderNumber }}</td>
                    <td class="px-3">
                      <span class="fw-semibold">{{ order.boqProjectName }}</span> | {{ order.boqNumberData }}
                    </td>
                    <td class="px-3">
                      {{ order.vendorName }} ({{ order.vendorCompany }})
                    </td>
                    <td class="px-3">
                      <a @click="openAddSiteModal(order._id)" class="fw-semibold py-1 text-start" style="color: #0E2D65; cursor: pointer;">
                        View site
                      </a>
                    </td>
                    <td v-if="projectStatus == 'Draft'" class="px-3 text-center">
                      <a @click="openEditOrderModal(order)" class="btn rounded-3 text-white px-3 py-0 me-2" style="background-color: #133E87;">
                        Edit
                      </a>
                      <a @click="deleteOrder(order._id)" class="btn rounded-3 btn-danger text-emphashis px-2 py-0">
                        Delete
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- Display message if no order data -->
              <div v-if="orderList.length === 0" class="text-center py-3">
                <p class="text-muted">No Order data available.</p>
              </div>

              <div class="d-flex">
                <router-link 
                  :to="'/submit-project/' + projectId" 
                  v-if="projectStatus == 'Draft' && (orderList.length > 0 || siteList.length > 0)" 
                  class="btn rounded-3 fw-medium ms-auto px-3 py-1 text-white" 
                  style="background-color: #0E2D65"
                >
                  Submit
                </router-link>
                <button 
                  v-else-if="projectStatus == 'Draft' && (orderList.length === 0 && siteList.length === 0)" 
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
  
    <!-- Add/Edit Order -->
    <div class="modal fade" id="orderModal" tabindex="-1" aria-labelledby="orderModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content rounded-4">
          <div class="d-flex p-4">
            <h5 class="modal-title fw-semibold h5" id="orderModalLabel">{{ modalTitle }}</h5>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body px-4">
            <form @submit.prevent="saveOrder">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="ordernumber" class="form-label fw-medium">Order Number</label>
                  <input type="text" id="ordernumber" v-model="formData.orderNumber" class="form-control w-100 bg-white border-2 text-start" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="orderdate" class="form-label fw-medium">Order Date</label>
                  <input type="date" id="orderdate" v-model="formData.orderDate" class="form-control w-100 bg-white border-2" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="vendor" class="form-label fw-medium">Vendor</label>
                  <select id="vendor" v-model="formData.vendor" class="form-control w-100 bg-white border-2 text-start" required>
                    <option value="" disabled>Select a vendor</option>
                    <option v-for="vendor in vendorList" :key="vendor._id" :value="vendor._id">
                      {{ vendor.fullName || vendor.username }} ({{ vendor.companyName }})
                    </option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="boqnumber" class="form-label fw-medium">BoQ Number</label>
                  <select id="boqnumber" v-model="formData.boqNumber" class="form-control w-100 bg-white border-2 text-start" required>
                    <option value="" disabled>Select BOQ Number</option>
                    <option v-for="boq in boqList" :key="boq._id" :value="boq._id">
                      {{ boq.boqNumber}} | {{ boq.projectName }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="nodintoreg" class="form-label fw-medium">Nodin to Reg Number</label>
                  <input type="text" id="nodintoreg" v-model="formData.nodinToReg" class="form-control w-100 bg-white border-2 text-start" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="nodintoregdate" class="form-label fw-medium">Nodin to Reg Date</label>
                  <input type="date" id="nodintoregdate" v-model="formData.nodinToRegDate" class="form-control w-100 bg-white border-2" required />
                </div>
                <div class="col-md-6 mb-4" id="dropFile">
                  <label class="form-label">Order File</label>
                  <div class="drop-zone" @click="triggerFileInput('orderFile')" @dragover.prevent @drop="handleDrop">
                    <p v-if="!formData.orderFile">
                      {{ formData.existingOrderFile ? `${formData.existingOrderFile}` : 'Drag & drop file here or click to upload' }}
                    </p>
                    <p v-else>{{ formData.orderFile.name }}</p>
                    <input type="file" ref="orderFile" @change="handleFileUpload($event, 'orderFile')" class="hidden-input" />
                  </div>
                </div>
                <div class="col-md-6 mb-4" id="dropFile">
                  <label class="form-label">Nodin File</label>
                  <div class="drop-zone" @click="triggerFileInput('nodinToRegFile')" @dragover.prevent @drop="handleDrop">
                    <p v-if="!formData.nodinToRegFile">
                      {{ formData.existingNodinToRegFile ? `${formData.existingNodinToRegFile}` : 'Drag & drop file here or click to upload' }}
                    </p>
                    <p v-else>{{ formData.nodinToRegFile.name }}</p>
                    <input type="file" ref="nodinToRegFile" @change="handleFileUpload($event, 'nodinToRegFile')" class="hidden-input" />
                  </div>
                </div>
              </div>
              <button type="submit" class="btn text-white fw-medium w-100" style="background-color: #133E87;">{{ buttonTitle }}</button>
            </form>
          </div>
        </div>
      </div>
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
            <form v-if="projectStatus == 'Draft'" @submit.prevent="saveSite">
              <div class="row">
                <div class="col-md-4 mb-3">
                  <label for="Site" class="form-label fw-medium">Site name</label>
                  <input type="text" id="Site" v-model="siteData.site" class="form-control w-100 bg-white border-3 text-start" placeholder="TTC ..." required />
                </div>
                <div class="col-md-4 mb-3">
                  <label for="startDate" class="form-label fw-medium">Start date</label>
                  <input type="date" id="startDate" v-model="siteData.startDate" class="form-control w-100 bg-white border-3" required />
                </div>
                <div class="col-md-4 mb-3">
                  <label for="endDate" class="form-label fw-medium">End date</label>
                  <input type="date" id="endDate" v-model="siteData.endDate" class="form-control w-100 bg-white border-3" required />
                </div>
              </div>
              <button type="submit" class="btn text-white fw-medium w-100 mb-2" style="background-color: #133E87;">{{ buttonTitle }}</button>
              <hr class="text-primary rounded-1 my-3" style="border-width: 0.150rem;">
            </form>


            <div class="table-responsive">
              <table class="table align-middle" style="white-space: nowrap;">
                <thead class="text-white align-middle" style="background-color: #0E2D65;">
                  <tr>
                    <th class="fw-semibold px-3 rounded-start-3" scope="col">No.</th>
                    <th class="fw-semibold px-3" scope="col">Site</th>
                    <th class="fw-semibold px-3" scope="col">Start date</th>
                    <th v-if="projectStatus !== 'Draft'" class="fw-semibold px-3 rounded-end-3 text-start" scope="col">End date</th>
                    <th v-if="projectStatus == 'Draft'" class="fw-semibold px-3 text-start" scope="col">End date</th>
                    <th v-if="projectStatus == 'Draft'" class="fw-semibold px-3 rounded-end-3 text-center" scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(site, index) in siteList" :key="site._id">
                    <td class="px-3">{{ index + 1 }}</td>
                    <td class="px-3">{{ site.site }}</td>
                    <td class="px-3">{{ formatDate(site.startDate) }}</td>
                    <td class="px-3">{{ formatDate(site.endDate) }}</td>
                    <td v-if="projectStatus == 'Draft'" class="px-3 d-flex text-center justify-center">
                      <a @click="deleteSite(site._id)" class="btn rounded-3 fs-6 text-danger fw-medium px-2 py-0">
                        Delete
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- Display message if no site data -->
              <div v-if="siteList.length === 0" class="text-center py-3">
                <p class="text-muted">No Site data available.</p>
              </div>
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
    projectId: this.$route.params.projectId,
    orderId: null,
    modalTitle: 'Add Order Data',
    buttonTitle: 'Create',
    vendorList: [],
    boqList: [],
    orderList: [],
    siteList: [],
    siteData: {
      site: '',
      startDate: '',
      endDate: ''
    },
    formData: {
      orderNumber: '',
      orderDate: '',
      orderFile: null,
      vendor: '',
      boqNumber: '',
      nodinToReg: '',
      nodinToRegDate: '',
      nodinToRegFile: null
    },
      editingId: null, // To store the ID of the order being edited
      projectStatus: '', // Store project status
  };
},
computed: {
  ordersWithVendorDetails() {
    return this.orderList.map(order => {
      const vendor = this.vendorList.find(v => v._id === order.vendor);
      const boq = this.boqList.find(b => b._id === order.boqNumber); // Find the BOQ by ID
      return {
        ...order,
        vendorName: vendor ? vendor.fullName || vendor.username : 'N/A',
        vendorCompany: vendor ? vendor.companyName : 'N/A',
        boqNumberData: boq ? boq.boqNumber : 'N/A',
        boqProjectName: boq ? boq.projectName : 'N/A',
      };
    });
  },
},
methods: {
    async fetchVendors() {
      const token = Cookies.get('authToken');
      if (token) {
        try {
          const response = await api.get('/api/auth/users/role/Vendor', {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.vendorList = response.data.data;
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
          this.boqList = response.data.data; // Assuming you're storing options in a reactive variable
        } catch (error) {
          console.error('Error fetching approved BOQs:', error);
        }
      }
    },
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
    fetchProjectStatus() {
      const token = Cookies.get('authToken');
      const projectId = this.$route.params.projectId;
      if (token) {
        api.get(`/api/project/${projectId}/status`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
          this.projectStatus = response.data.status;
        })
        .catch(error => console.error("Error fetching project status:", error));
      }
    },
    openAddOrderModal() {
      this.modalTitle = "Add Purchase Order";
      this.buttonTitle = "Create";
      this.formData = {
        orderNumber: '',
        orderDate: '',
        orderFile: null,
        vendor: '',
        boqNumber: '',
        nodinToReg: '',
        nodinToRegDate: '',
        nodinToRegFile: null
      };
      this.editingId = null;
      const modal = new bootstrap.Modal(document.getElementById('orderModal'));
      modal.show();
    },
    openEditOrderModal(order) {
      this.modalTitle = "Edit Purchase Order";
      this.buttonTitle = "Update";
      this.formData = {
        ...order,
        orderDate: order.orderDate ? this.formatDateForInput(order.orderDate) : '',
        nodinToRegDate: order.nodinToRegDate ? this.formatDateForInput(order.nodinToRegDate) : '',
        orderFile: null, // Reset file input for new uploads
        nodinToRegFile: null,
        existingOrderFile: order.orderFile ? order.orderFile.split(/[/\\]/).pop() : '', // Extract filename only
        existingNodinToRegFile: order.nodinToRegFile ? order.nodinToRegFile.split(/[/\\]/).pop() : '', // Extract filename only
      };

      this.editingId = order._id;
      const modal = new bootstrap.Modal(document.getElementById('orderModal'));
      modal.show();
    },
    closeModal() {
      const modalElement = document.getElementById('orderModal');
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    },
    handleFileUpload(event, field) {
      const file = event.target.files[0];
      if (file) {
        this.formData[field] = file;
      }
    },
    triggerFileInput(field) {
      this.$refs[field].click();
    },
    saveOrder() {
      const projectId = this.$route.params.projectId;
      const token = Cookies.get("authToken");

      if (token && projectId) {
        if (this.editingId) {
          const formData = new FormData();
          formData.append("orderNumber", this.formData.orderNumber);
          formData.append("orderDate", this.formData.orderDate);
          formData.append("vendor", this.formData.vendor);
          formData.append("boqNumber", this.formData.boqNumber);
          formData.append("nodinToReg", this.formData.nodinToReg);
          formData.append("nodinToRegDate", this.formData.nodinToRegDate);

          // Only append file if a new one was selected
          if (this.formData.orderFile) {
            formData.append("orderFile", this.formData.orderFile);
          }
          if (this.formData.nodinToRegFile) {
            formData.append("nodinToRegFile", this.formData.nodinToRegFile);
          }

          api.put(`/api/order/${this.editingId}`, formData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            })
            .then((response) => {
              const index = this.orderList.findIndex((o) => o._id === this.editingId);
              this.orderList[index] = response.data.data;
              this.closeModal();

              Swal.fire({
                icon: "success",
                title: "Order Updated",
                text: "The order has been updated successfully.",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
              });
            })
            .catch((error) => {
              console.error("Error updating order:", error);
              Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: "Something went wrong while updating the order.",
              });
            });
          } else {
            const formData = new FormData();
            formData.append("orderNumber", this.formData.orderNumber);
            formData.append("orderDate", this.formData.orderDate);
            formData.append("vendor", this.formData.vendor);
            formData.append("boqNumber", this.formData.boqNumber);
            formData.append("nodinToReg", this.formData.nodinToReg);
            formData.append("nodinToRegDate", this.formData.nodinToRegDate);

            if (this.formData.orderFile) {
              formData.append("orderFile", this.formData.orderFile);
            }
            if (this.formData.nodinToRegFile) {
              formData.append("nodinToRegFile", this.formData.nodinToRegFile);
            }

        api.post(`/api/order/${projectId}`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          })
        .then((response) => {
          this.orderList.push(response.data.data);
          this.closeModal();

          Swal.fire({
            icon: "success",
            title: "Order Added",
            text: "Order added successfully.",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
          });
        })
        .catch((error) => {
          console.error("Error saving order:", error);
          Swal.fire({
            icon: "error",
            title: "Addition Failed",
            text: "Something went wrong while adding the order.",
          });
        });
        }
      }
    },
    deleteOrder(id) {
      const token = Cookies.get('authToken');
      if (token) {
        api.delete(`/api/order/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          this.orderList = this.orderList.filter(order => order._id !== id);
        })
        .catch(error => console.error("Error deleting order:", error));
      }
    },
    openAddSiteModal(orderId) {
      this.modalTitle = "Site Data";
      this.buttonTitle = "Add to Order";
      this.siteData = {
        site: '',
        startDate: '',
        endDate: ''
      },
      this.orderId = orderId; // Store the Order ID
      this.fetchSite();
      const modal = new bootstrap.Modal(document.getElementById('siteModal'));
      modal.show();
    },
    fetchSite() {
      const token = Cookies.get('authToken');
      if (!this.orderId) {
        console.error("Order ID is missing.");
        return;
      }

      if (token) {
        api.get(`/api/site/${this.orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
          this.siteList = response.data.data; // Update siteList with fetched data
        })
        .catch(error => console.error("Error fetching site:", error));
      }
    },
    saveSite() {
      const token = Cookies.get('authToken');

      if (!this.orderId) { // Ensure orderId is set
        console.error("Order ID is missing.");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Order ID is missing. Please try again.",
        });
        return;
      }

      if (token) {
        api.post(`/api/site/${this.orderId}`, this.siteData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
          console.log("Site saved:", response.data);
          Swal.fire({
            icon: "success",
            title: "Site Added",
            text: "The site has been added successfully.",
          });
          this.fetchSite();
        })
        .catch(error => {
          console.error("Error saving site:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to save site. Please try again.",
          });
        });
      }
    },
    deleteSite(id) {
      const token = Cookies.get('authToken');
      if (token) {
        api.delete(`/api/site/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          this.siteList = this.siteList.filter(site => site._id !== id);
        })
        .catch(error => console.error("Error deleting site:", error));
      }
    },
    formatDateForInput(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Converts to 'YYYY-MM-DD'
    },
    formatDate(date) {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    },
    },
    mounted() {
      this.fetchOrder();
      this.fetchVendors();
      this.fetchApprovedBoqs();
      this.fetchProjectStatus();
      this.$nextTick(() => {
        initializeSidebar();
      });
    },
};
</script>

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

.drop-zone {
  border: 2px dashed #133E87;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  background-color: #f8f9fa;
  transition: background-color 0.3s ease-in-out;
  position: relative;
  min-height: 60px; /* Set a minimum height */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Ensures both drop zones have equal height */
#dropFile {
  display: flex;
  flex-direction: column;
}

</style>