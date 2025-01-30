<template>
    <div id="app">
      <Sidebar />
      <!-- start: Main -->
      <main class="ms-md-2">
        <div class="p-2 d-flex flex-column" style="height: 100%;">
          <!-- start: Navbar -->
          <nav class="px-5 pb-4 rounded-top-4" style="background-color: #EFEDEF; padding-top: 2.5rem;">
            <i class="ri-menu-line sidebar-toggle me-3 d-block d-md-none"></i>
            <div class="d-flex flex-column">
              <h3 class="fw-bold fs-3 me-auto mb-md-2" style="color: #133E87;">Project Management</h3>
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
                <router-link
                  :to="'/add-project'"
                  class="btn rounded-3 text-white fw-medium ms-auto px-3 py-1"
                  style="background-color: #133E87;"
                >
                  Create +
                </router-link>
              </div>
  
              <div class="table-responsive px-2">
                <table class="table align-middle">
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
                        <router-link :to="'/order/' + project._id" class="btn rounded-3 fw-semibold px-3 py-1 me-2" style="background-color: #EFEDEF; border-color: #133E87; border-width: 0.150rem; color: #133E87;">View</router-link>
                        <router-link v-if="userRole === 'User' && project.status == 'Pending'" :to="'/submit/' + project._id" class="btn rounded-3 text-white fw-medium px-3 me-2" style="background-color: #133E87;">Submit</router-link>
                        <div v-if="userRole === 'Admin' && project.status == 'On Review'" class="d-flex justify-center gap-2">
                          <div class="btn-group">
                            <button
                              v-if="project.status !== 'Approved' && project.status !== 'Rejected'"
                              type="button"
                              class="btn btn-secondary rounded-3 dropdown-toggle py-1"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                              style="background-color: #133E87;"
                            >
                              Approval
                            </button>
                            <ul class="dropdown-menu dropdown-menu-ligth py-0">
                              <li>
                                <router-link
                                  v-if="project.status !== 'Approved'"
                                  :to="'/approval/' + project._id"
                                  class="dropdown-item text-success border-bottom border-3 px-3 py-1"
                                >
                                  Approve
                                </router-link>
                              </li>
                              <li>
                                <router-link
                                  v-if="project.status !== 'Approved'"
                                  :to="'/rejection/' + project._id"
                                  class="dropdown-item text-danger px-3 py-1"
                                >
                                  Reject
                                </router-link>
                              </li>
                            </ul>
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
        userRole: '', // To store the user's role
      };
    },
    methods: {
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
    background-color: #e8eaf9;
    color: #1f13a1;
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
  </style>