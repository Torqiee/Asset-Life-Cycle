<template>
  <div id="app">
    <Sidebar />
    <main class="ms-md-2">
      <div class="p-2 d-flex flex-column" style="height: 100%;">
        <nav class="px-5 pb-4 rounded-top-4" style="background-color: #EFEDEF; padding-top: 2.5rem;">
          <i class="ri-menu-line sidebar-toggle me-3 d-block d-md-none"></i>
          <div class="d-flex flex-column">
            <h3 class="fw-bold fs-3 me-auto mb-md-2">Settings</h3>
          </div>
          <Navbar />
        </nav>

        <div class="py-4 px-4 rounded-bottom-4 flex-grow-1" style="background-color: #EFEDEF; overflow-y: auto;">
          <div class="row g-4 mx-3 px-4 pb-4 rounded-4" style="background-color: #EAE8EA;">
            <div class="d-flex align-items-center py-3 mb-md-2">
              <img src="../assets/profile.svg" alt="logo" style="width: 40px;" />
              <h1 class="fs-3 fw-bold mb-md-1 ms-3 d-md-block d-none">Account Information</h1>
              <h1 class="fs-3 fw-bold mb-md-1 ms-3 d-md-none d-block">Account</h1>
            </div>

            <div v-if="loading" class="text-center">Loading...</div>
            <form v-else @submit.prevent="updateProfile">
              <div class="row g-3 justify-center">
                <div class="col-md-6" v-for="(value, key) in form" :key="key">
                  <label :for="key" class="form-label fw-semibold">{{ getLabel(key) }}</label>
                  <input 
                    v-model="form[key]" 
                    :id="key" 
                    :type="key === 'email' ? 'email' : 'text'"
                    class="form-control form-control-lg w-100 fs-6 text-start bg-white border-3" 
                    style="background-color: #e4e2e4;" 
                  />
                  <span v-if="errors[key]" class="text-danger">{{ errors[key] }}</span>
                </div>
              </div>
              <div class="row justify-center g-0">
                <button type="submit" class="btn btn-primary fw-medium w-100 py-2 mt-3" style="background-color: #133E87;">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';
import Navbar from '../components/Navbar.vue';
import api from '../../api';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

export default {
  name: "UserAccount",
  components: {
    Sidebar,
    Navbar
  },
  data() {
    return {
      user: null,
      loading: false,
      errors: {},
      form: {
        username: '',
        email: '',
        phone: '',
        companyName: '',
        fullName: '',
        nik: ''
      }
    };
  },
  methods: {
    async fetchUser() {
      this.loading = true;
      const token = Cookies.get('authToken');

      if (!token) {
        this.errors.general = 'User not authenticated.';
        this.loading = false;
        return;
      }

      try {
        const response = await api.get('/api/auth/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          this.user = response.data.data;
          this.form = {
            username: String(this.user.username || ''),
            email: String(this.user.email || ''),
            phone: String(this.user.phone || ''),
            companyName: String(this.user.companyName || ''),
            fullName: String(this.user.fullName || ''),
            nik: String(this.user.nik || '')
          };
        } else {
          this.errors.general = 'Failed to load user data';
        }
      } catch (err) {
        this.errors.general = err.response?.data?.message || 'Failed to load user data';
      } finally {
        this.loading = false;
      }
    },
    async updateProfile() {
      this.errors = {};

      // Ensure all values are strings
      for (const key in this.form) {
        if (typeof this.form[key] !== 'string') {
          this.form[key] = String(this.form[key] || '');
        }
      }

      // Validate fields
      for (const key in this.form) {
        if (!this.form[key].trim()) {
          this.errors[key] = `${this.getLabel(key)} is required.`;
        }
      }

      // Email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (this.form.email && !emailPattern.test(this.form.email)) {
        this.errors.email = 'Invalid email format.';
      }

      // Phone number validation
      const phonePattern = /^[0-9]{10,}$/;
      if (this.form.phone && !phonePattern.test(this.form.phone)) {
        this.errors.phone = 'Phone number must be at least 10 digits.';
      }

      // Stop if there are validation errors
      if (Object.keys(this.errors).length > 0) return;

      const token = Cookies.get('authToken');
      if (!token) {
        this.errors.general = 'User not authenticated.';
        return;
      }

      try {
        const updateData = {
          username: this.form.username,
          email: this.form.email,
          phone: this.form.phone,
          companyName: this.form.companyName,
          fullName: this.form.fullName,
          nik: this.form.nik
        };

        await api.patch('/api/auth/user', updateData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Swal.fire('Success', 'Profile updated successfully!', 'success');
        this.fetchUser();
      } catch (err) {
        this.errors.general = err.response?.data?.message || 'Update failed. Check your inputs.';
      }
    },
    getLabel(field) {
      const labels = {
        username: "Username",
        email: "Email",
        phone: "Phone Number",
        companyName: "Company Name",
        fullName: "Full Name",
        nik: "NIK"
      };
      return labels[field] || field;
    }
  },
  mounted() {
    this.fetchUser();
  },
};
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.text-danger {
  font-size: 0.875rem;
}
</style>
