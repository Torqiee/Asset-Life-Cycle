<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100 min-vw-100" style="background-color: #ececec;">
    <div class="row border rounded-5 p-3 bg-white box-area justify-content-center">
      <div class="col-md-6 box">
        <div class="row align-items-center">
          <div class="d-flex align-items-center mb-5 pt-2">
            <img src="../assets/logo.png" alt="" style="width: 45px;" />
            <h2 class="fw-bold fs-3 ps-4">Data center</h2>
          </div>
          
          <!-- Email Input -->
          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control form-control-lg fs-6 text-start"
              placeholder="Email address"
              v-model="email"
              style="background-color: #E4E2E4; height: 3rem;"
            />
          </div>

          <!-- Password Input with Toggle -->
          <div class="input-group mb-1">
            <input
              :type="showPassword ? 'text' : 'password'"
              class="form-control form-control-lg fs-6 text-start"
              placeholder="password"
              v-model="password"
              style="background-color: #E4E2E4; height: 3rem;"
            />
            <!-- Button to toggle password visibility -->
            <button class="btn btn-outline" type="button" @click="togglePassword" style="background-color: #E4E2E4;">
              <img
                v-if="showPassword"
                src="../assets/eye-open.svg"
                alt="Eye Open"
                class="me-2"
                style="width: 20px; height: 20px;"
              />
              <img
                v-else
                src="../assets/eye-closed.svg"
                alt="Eye Closed"
                class="me-2"
                style="width: 20px; height: 20px;"
              />
            </button>
          </div>

          <!-- Login Button -->
          <div class="input-group my-3">
            <button
              class="btn btn-lg w-100 fs-5 text-white fw-semibold"
              style="background-color: #133E87;"
              @click="handleLogin"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
              <span v-else>Login</span>
            </button>
          </div>

          <!-- Forgot Password -->
          <div class="input-group mb-5 justify-content-end">
            <div class="forgot">
              <small>
                <a
                  href="#"
                  class="text-decoration-none fw-bold fs-6"
                  style="color: #133E87;"
                  @click.prevent="goToForgotPassPage"
                >
                  Forgot Password?
                </a>
              </small>
            </div>
          </div>

          <!-- Register Link -->
          <div class="text-center">
            <small class="fw-semibold fs-6">
              Don't have an account?
              <a
                href="#"
                class="text-decoration-none fw-bold"
                style="color: #133E87;"
                @click.prevent="goToRegisterPage"
              >
                Register now
              </a>
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../api';
import Swal from 'sweetalert2';

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const showPassword = ref(false); // Track password visibility
const router = useRouter();

// Function to toggle password visibility
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

onMounted(() => {
  const authToken = getCookie('authToken');
  if (authToken) {
    router.push('/dashboard');
  }

  // Check if the user has already accepted cookies
  const cookiesAccepted = localStorage.getItem('cookiesAccepted');
  if (!cookiesAccepted) {
    // Show SweetAlert toast to ask for cookie consent
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'We use cookies',
      text: 'By using this site, you agree to our use of cookies.',
      showCancelButton: true,
      confirmButtonText: 'Accept',
      cancelButtonText: 'Decline',
      timer: 10000,
      timerProgressBar: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Store the acceptance in localStorage
        localStorage.setItem('cookiesAccepted', 'true');
      }
    });
  }
});

const handleLogin = async () => {
  if (!email.value || !password.value) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'warning',
      title: 'Credential is required',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    return;
  }

  isLoading.value = true;

  try {
    const response = await api.post('/api/auth/signin', {
      email: email.value,
      password: password.value,
    });

    if (response.data.success) {
      localStorage.setItem('currentUserEmail', email.value);
      await api.patch('/api/auth/send-verification-code', { email: email.value });
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Two step verification',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      router.push({ path: '/OTPSend', query: { email: email.value } });
    } else {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Login failed',
        text: response.data.message || 'Please check your credentials.',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  } catch (error) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Invalid credentials.',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  } finally {
    isLoading.value = false;
  }
};

const goToRegisterPage = () => {
  router.push('/registration-one');
};

const goToForgotPassPage = () => {
  router.push('/ForgotPass');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.box-area {
  width: 730px;
}

.box {
  padding: 80px 0px 80px 0px;
}

::placeholder {
  font-size: 16px;
}

.rounded-4 {
  border-radius: 20px;
}

.rounded-5 {
  border-radius: 30px;
}

@media only screen and (max-width: 768px) {
  .box-area {
    margin: 0 10px;
  }
  .box {
    padding: 20px;
  }
}
</style>
