<template>
  <Sidebar />
  <!-- start: Main -->
  <main class="ms-md-2">
    <div class="p-2">
      <!-- start: Navbar -->
      <nav class="px-5 pb-4 rounded-top-4" style="background-color: #EFEDEF; padding-top: 2.5rem;">
        <i class="ri-menu-line sidebar-toggle me-3 d-block d-md-none"></i>
        <div class="d-flex flex-column">
          <h3 class="fw-bold fs-3 me-auto mb-md-2" style="color: #133E87;">Bill of Quantity</h3>
        </div>
        <Navbar />
      </nav>
      <!-- end: Navbar -->

      <!-- start: Content -->
      <div class="py-4 px-4 rounded-bottom-4" style="background-color: #EFEDEF;">
        <!-- start: Summary -->
        <div class="row g-3 mx-3 px-4 pb-4 rounded-4" style="background-color: #EAE8EA;">
          <div class="d-flex align-items-center py-2 mb-md-2">
            <img src="../assets/person.svg" alt="logo" style="width: 40px;" />
            <h1 class="fs-4 fw-bold mb-md-1 ms-3">User management</h1>
          </div>

          <div class="table-responsive px-2">
            <table class="table align-middle" style="white-space: nowrap;">
              <thead class="text-white align-middle" style="background-color: #133E87;">
                <tr>
                  <th class="fw-semibold px-3 rounded-start-3" scope="col">No.</th>
                  <th class="fw-semibold px-3" scope="col">Email</th>
                  <th class="fw-semibold px-3" scope="col">Full name</th>
                  <th class="fw-semibold px-3" scope="col">Username</th>
                  <th class="fw-semibold px-3" scope="col">Role</th>
                  <th class="fw-semibold px-3 rounded-end-3 text-center" scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(user, index) in users" :key="user._id">
                  <td class="px-3">{{ index + 1 }}</td>
                  <td class="px-3">{{ user.email }}</td>
                  <td class="px-3">{{ user.fullName }}</td>
                  <td class="px-3">{{ user.username }}</td>
                  <td class="px-3">{{ user.role || 'User' }}</td>
                  <td class="px-3 text-center">
                    <div class="dropdown">
                      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Select Role
                      </button>
                      <ul class="dropdown-menu">
                        <li>
                          <a @click="updateRole(user._id, 'Admin')" class="px-3 py-1">Admin</a>
                        </li>
                        <li>
                          <a @click="updateRole(user._id, 'Vendor')" class="px-3 py-1">Vendor</a>
                        </li>
                        <li>
                          <a @click="updateRole(user._id, 'Regional')" class="px-3 py-1">Regional</a>
                        </li>
                        <li>
                          <a @click="updateRole(user._id, 'Manager')" class="px-3 py-1">Manager</a>
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
      <!-- end: Content -->
    </div>
  </main>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';
import Navbar from '../components/Navbar.vue';
import Cookies from 'js-cookie';
import api from '../../api';

export default {
  components: {
    Sidebar,
    Navbar
  },
  data() {
    return {
      users: [],
    };
  },
  methods: {
    async fetchUsers() {
      const token = Cookies.get('authToken');
      try {
        const response = await api.get('/api/auth/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        this.users = response.data.data; // Adjusted to match expected structure
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    async updateRole(userId, role) {
      const token = Cookies.get('authToken');
      try {
        await api.patch(`/api/auth/users/${userId}/role`, { role }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        this.fetchUsers();
      } catch (error) {
        console.error('Error updating role:', error);
      }
    },
  },
  created() {
    this.fetchUsers();
  },
};
</script>