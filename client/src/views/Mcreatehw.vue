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
            <div class="row g-3 mx-3 px-4 pb-4 rounded-4" style="background-color: #EAE8EA;">
                <div class="d-flex align-items-center py-3 mb-md-2">
                    <img src="./assets/profile.svg" alt="logo" style="width: 40px;" />
                    <h1 class="fs-4 fw-bold mb-md-1 ms-3 d-md-block d-none">Account Information</h1>
                    <h1 class="fs-4 fw-bold mb-md-1 ms-3 d-md-none d-block">Account</h1>
                </div>

                <div v-if="loading" class="text-center">Loading...</div>
                <div v-else-if="error" class="text-danger">{{ error }}</div>
                <form v-else @submit.prevent="updateProfile">
                    <div class="row justify-center">
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <label for="username" class="form-label fw-semibold">Username</label>
                                <input v-model="form.username" id="username" class="form-control form-control-lg w-100 fs-6 text-start" style="background-color: #e4e2e4;" />
                            </div>
                            <div class="col-md-6">
                                <label for="email" class="form-label fw-semibold">Email</label>
                                <input v-model="form.email" type="email" id="email" class="form-control form-control-lg w-100 fs-6 text-start" style="background-color: #e4e2e4;" />
                            </div>
                            </div>
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <label for="fullName" class="form-label fw-semibold">Full name</label>
                                    <input v-model="form.fullName" id="fullName" class="form-control form-control-lg w-100 fs-6 text-start" style="background-color: #e4e2e4;" />
                                </div>
                                <div class="col-md-6">
                                    <label for="phone" class="form-label fw-semibold">Phone number</label>
                                    <input v-model="form.phone" id="phone" class="form-control form-control-lg w-100 fs-6 text-start" style="background-color: #e4e2e4;" />
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="company" class="form-label fw-semibold">Company name</label>
                                    <input v-model="form.companyName" id="company" class="form-control form-control-lg w-100 fs-6 text-start" style="background-color: #e4e2e4;" />
                                </div>
                                <div class="col-md-6">
                                    <label for="nik" class="form-label fw-semibold">NIK</label>
                                    <input v-model="form.nik" id="nik" class="form-control form-control-lg w-100 fs-6 text-start" style="background-color: #e4e2e4;" />
                                </div>
                            </div>
                            <div class="row px-4 mb-5">
                                <button type="submit" class="btn btn-primary fw-medium w-100 mt-3" style="background-color: #133E87;">Save Changes</button>
                            </div>

                            <!-- <div class="row px-4 mb-5">
                                <hr class="border border-primary border-3">
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <label for="idCard" class="form-label fw-semibold">ID Card Image</label>
                                    <div class="image-container">
                                        <img v-if="form.idCardImage" id="idCard" :src="form.idCardImage" alt="ID Card" class="img-fluid rounded-4" />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label for="selfie" class="form-label fw-semibold">Selfie with ID Card</label>
                                    <div class="image-container">
                                        <img v-if="form.selfieIdCardImage" id="selfie" :src="form.selfieIdCardImage" alt="Selfie ID Card" class="img-fluid rounded-4" />
                                    </div>
                                </div>
                            </div> -->
                    </div>
                </form>
            </div>
          </div>
        </div>
      </main>
    </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue';
import Navbar from './components/Navbar.vue';
import api from '../api';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

export default {
  name: "BoqMain",
  components: {
    Sidebar,
    Navbar
  },
  data() {
    return {
      user: null,
      loading: false,
      error: null,
      form: {
        username: '',
        email: '',
        phone: '',
        companyName: '',
        fullName: '',
        nik: '',
        idCardImage: '',
        selfieIdCardImage: ''
      }
    };
  },
  methods: {
    async fetchUser() {
      this.loading = true;
      this.error = null;
      const token = Cookies.get('authToken');

      if (!token) {
        this.error = 'User not authenticated.';
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
            username: this.user.username || '',
            email: this.user.email || '',
            phone: this.user.phone || '',
            companyName: this.user.companyName || '',
            fullName: this.user.fullName || '',
            nik: this.user.nik || '',
            idCardImage: this.user.idCardImage || '',
            selfieIdCardImage: this.user.selfieIdCardImage || ''
          };
        } else {
          this.error = 'Failed to load user data';
        }
      } catch (err) {
        console.error("API Error:", err.response ? err.response.data : err);
        this.error = err.response?.data?.message || 'Failed to load user data';
      } finally {
        this.loading = false;
      }
    },

    async updateProfile() {
      const token = Cookies.get('authToken');
      if (!token) {
        this.error = 'User not authenticated.';
        return;
      }

      try {
        const updateData = {
          username: this.form.username,
          email: this.form.email,
          phone: this.form.phone,
          companyName: this.form.companyName,
          fullName: this.form.fullName,
          nik: this.form.nik,
        };

        await api.patch('/api/auth/user', updateData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Swal.fire('Success', 'Profile updated successfully!', 'success');
        this.fetchUser();
      } catch (err) {
        console.error("Update Error:", err.response ? err.response.data : err);
        this.error = err.response?.data?.message || 'Update failed. Check your inputs.';
      }
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

</style>
