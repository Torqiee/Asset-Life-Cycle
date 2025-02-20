<template>
    <div class="dropdown ms-auto">
      <div class="d-flex align-items-center cursor-pointer">
        <span class="me-3 d-none d-sm-block fs-5 fw-semibold">{{ username }}</span>
        <img
          class="navbar-profile-image border border-3 rounded-5 border-secondary"
          src="../assets/pfp.webp"
          alt="Profile Image"
        >
      </div>
    </div>
</template>
  
<script>
import Cookies from 'js-cookie';
import api from '../../api'; // Adjust the import path to your `api` instance
  
  export default {
    name: 'Navbar',
    data() {
      return {
        username: ''
      };
    },
    methods: {
        fetchUser() {
        const token = Cookies.get('authToken');
        if (token) {
            api.get('/api/auth/user', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            })
            .then(response => {
            this.username = response.data.data.username;
            })
            .catch(error => {
            console.error(error);
            this.username = 'Failed fetching username'; // Fallback message
            });
        }
        }

    },
    mounted() {
      this.fetchUser();
    },
  };
</script>