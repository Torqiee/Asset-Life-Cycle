<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100 min-vw-100" style="background-color: #ececec;">
    <div class="row border rounded-5 p-3 bg-white box-area justify-content-center">
      <div class="d-flex align-items-center mb-4 pt-4 ps-4">
        <img src="../assets/key.png" alt="Logo" class="w-[45px]" />
        <h2 class="fw-bolder fs-4 ps-4">Forgot Password</h2>
      </div>

      <h2 class="ps-4 fs-6 mb-2 fw-medium" style="color: #989898;">
        Please enter your email address to reset the password
      </h2>

      <div class="col-md-6 box">
        <div class="row align-items-center">
          <div class="col">
            <label for="email" class="form-label fw-semibold">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="registered@gmail.com"
              v-model="email"
              required
              class="form-control form-control-lg text-start fs-6 w-100"
              style="background-color: #E4E2E4; height: 3rem;"
            />
          </div>
          <div class="input-group my-4">
            <button
              @click="sendOTP"
              class="btn btn-lg w-100 fs-5 text-white fw-semibold"
              style="background-color: #133E87;"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
              <span v-else>Continue</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../api'; // Axios instance to make API calls
import Swal from 'sweetalert2'; // Import SweetAlert2

const email = ref('');
const isLoading = ref(false); // Add a loading state
const router = useRouter();

const sendOTP = async () => {
  if (!email.value) {
    Swal.fire({
      toast: true,
      icon: 'error',
      title: 'Please enter your email',
      position: 'top-end',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    return;
  }

  isLoading.value = true; // Set loading to true

  try {
    const response = await api.patch('/api/auth/send-forgot-password-code', { email: email.value });

    if (response.data.success) {
      localStorage.setItem('currentUserEmail', email.value);
      Swal.fire({
        toast: true,
        icon: 'success',
        title: 'OTP sent to your email',
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      router.push('/ForgotPassOTP');
    } else {
      Swal.fire({
        toast: true,
        icon: 'error',
        title: response.data.message || 'Failed to send OTP.',
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  } catch (error) {
    console.error('Error sending OTP:', error.response?.data || error.message);
    Swal.fire({
      toast: true,
      icon: 'error',
      title: 'No user found',
      position: 'top-end',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  } finally {
    isLoading.value = false; // Reset loading state after the request is complete
  }
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

body {
  font-family: 'Poppins', sans-serif;
  background: #ececec;
}

/*------------ Login container ------------*/
.box-area {
  width: 730px;
}

/*------------ Right box ------------*/
.box {
  padding: 60px 0px 60px 0px;
}

/*------------ Custom Placeholder ------------*/
::placeholder {
  font-size: 16px;
}

.rounded-4 {
  border-radius: 20px;
}

.rounded-5 {
  border-radius: 30px;
}


/*------------ For small screens------------*/
@media only screen and (max-width: 768px) {
  .box-area {
    margin: 0 10px;
  }
  .box {
    padding: 20px;
  }
}
</style>
