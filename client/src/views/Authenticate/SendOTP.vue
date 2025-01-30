<template>
  <div id="otpPage" class="container d-flex justify-content-center align-items-center min-vh-100 min-vw-100" style="background-color: #ececec;">
    <div class="row border rounded-5 p-3 bg-white box-area justify-content-center">
        <div class="col-md-6 box">
            <div class="d-flex justify-content-center flex-column align-items-center">
                <div class="text-center mb-3">
                  <div class="row justify-content-center">
                    <img src="../assets/mail.png" class="mb-3" alt="" style="width: 190px; height: 150px;">
                  </div>
                    <h3 class="fs-4 mb-3 fw-semibold">Hello, {{ userEmail }}</h3>
                    <p class="mb-3" style="color: #989898;">Please check your inbox for OTP </p>
                </div>
                
              <!-- OTP Input Fields -->
              <div class="d-flex justify-content-center gap-2 mb-3">
                  <input
                      v-for="(digit, index) in otp"
                      :key="index"
                      type="text"
                      maxlength="1"
                      class="form-control form-control-lg fs-6 rounded-3 otp-input"
                      v-model="otp[index]"
                      @input="handleInput(index, $event)"
                      @keydown.backspace="handleBackspace(index, $event)"
                  />
              </div>

                <!-- Verify Button -->
                <div class="input-group justify-content-center my-2">
                  <button
                    @click="verifyOTP"
                    class="btn btn-lg w-100 fs-5 text-white fw-semibold"
                    style="background-color: #133E87;"
                    :disabled="isLoading"
                  >
                    <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                    <span v-else>Verify</span>
                  </button>
                </div>

                <!-- Resend OTP Button -->
                <p
                    class="text-center font-roboto font-semibold text-l mt-[17px] text-[#133E87] hover:text-[#608BC1] cursor-pointer"
                    @click="resendOTP"
                    v-if="cooldown === 0"
                >
                    Resend the OTP
                </p>
                <p
                    class="text-center font-roboto font-semibold text-l mt-[17px] text-[#133E87] cursor-not-allowed"
                    v-else
                >
                    Resend the OTP in {{ cooldown }} seconds
                </p>
            </div>
        </div>
    </div>

    <!-- Loading Screen -->
    <div v-if="showLoadingScreen" class="loading-screen">
      <video autoplay muted loop>
        <source src="../assets/loading.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../api';
import Swal from 'sweetalert2';

const router = useRouter();
const otp = ref(new Array(6).fill('')); // Array for 6-digit OTP
const userEmail = ref(localStorage.getItem('currentUserEmail'));
const cooldown = ref(0);
const isLoading = ref(false); // Loading spinner state
const showLoadingScreen = ref(false); // Loading screen state

onMounted(() => {
  // Check if there's a cooldown value in localStorage
  const savedCooldown = localStorage.getItem('otpCooldown');
  if (savedCooldown) {
    cooldown.value = parseInt(savedCooldown);
  } else {
    // Start a new countdown if none exists
    cooldown.value = 60; // Set the initial cooldown to 60 seconds
    localStorage.setItem('otpCooldown', cooldown.value);
  }

  // Start the countdown timer
  startCooldown();
});

const startCooldown = () => {
  const interval = setInterval(() => {
    if (cooldown.value > 0) {
      cooldown.value--;
      localStorage.setItem('otpCooldown', cooldown.value);
    } else {
      clearInterval(interval);
      localStorage.removeItem('otpCooldown');
    }
  }, 1000);
};

const handleInput = (index, event) => {
  const value = event.target.value;
  if (value.match(/^\d$/)) {
    otp.value[index] = value; // Set the current digit
    if (index < otp.value.length - 1) {
      // Move to the next input field
      event.target.nextElementSibling?.focus();
    }
  } else {
    otp.value[index] = ''; // Clear invalid input
  }
};

const handleBackspace = (index, event) => {
  if (!otp.value[index] && index > 0) {
    // Move to the previous input field
    event.target.previousElementSibling?.focus();
  }
};

const resendOTP = async () => {
  if (cooldown.value === 0) {
    try {
      const response = await api.patch('/api/auth/send-verification-code', {
        email: userEmail.value,
      });

      if (response.data.success) {
        Swal.fire({
          toast: true,
          icon: 'success',
          title: 'OTP resent successfully!',
          position: 'top-end',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        // Store the expiration time (e.g., 5 minutes from now)
        // const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes
        // localStorage.setItem('otpExpirationTime', expirationTime);

        cooldown.value = 60;
        // localStorage.setItem('otpCooldown', cooldown.value);
        startCooldown();
      } else {
        Swal.fire({
          toast: true,
          icon: 'error',
          title: 'Failed to resend OTP.',
          text: 'Please try again.',
          position: 'top-end',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      Swal.fire({
        toast: true,
        icon: 'error',
        title: 'Error resending OTP.',
        text: 'Please try again.',
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  }
};

const verifyOTP = async () => {
  const enteredOTP = otp.value.join(''); // Combine all digits into a single string
  if (enteredOTP.length !== 6) {
    Swal.fire({
      toast: true,
      icon: 'error',
      title: 'Please enter the complete OTP.',
      position: 'top-end',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    return;
  }

  isLoading.value = true; // Start loading spinner

  try {
    const response = await api.patch('/api/auth/verify-verification-code', {
      email: userEmail.value,
      providedCode: enteredOTP,
    });

    if (response.data.success) {
      showLoadingScreen.value = true; // Show the loading screen

      setTimeout(() => {
        const token = response.data.token;
        const expires = new Date(Date.now() + 2 * 60 * 60 * 1000).toUTCString();
        document.cookie = `authToken=${token}; expires=${expires}; path=/; secure`;

        Swal.fire({
          toast: true,
          icon: 'success',
          title: "Login successfull",
          position: 'top-end',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        localStorage.removeItem("currentUserEmail");
        localStorage.removeItem("otpCooldown");
        router.push('/boq');
      }, 2000); // Simulate a delay for the loading screen
    } else {
      Swal.fire({
        toast: true,
        icon: 'error',
        title: 'Verification failed.',
        text: response.data.message || 'Invalid OTP.',
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  } catch (error) {
    console.error('OTP verification failed:', error);
    Swal.fire({
      toast: true,
      icon: 'error',
      title: 'Incorrect OTP.',
      position: 'top-end',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  } finally {
    isLoading.value = false; // Stop loading spinner
  }
};

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}
.box-area{
  width: 730px;
}

/*------------ Right box ------------*/

.box{
    padding: 65px 0px 65px 0px;
}

/*------------ Custom Placeholder ------------*/

::placeholder{
    font-size: 16px;
}

.rounded-4{
    border-radius: 20px;
}
.rounded-5{
    border-radius: 30px;
}

/* Center the content inside OTP input fields */
.form-control {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: #E4E2E4;
    height: 3rem;
    color: #555;
    width: 3.2rem; /* Ensure input fields are not too wide */
}


.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #EAEAEA; /* Solid background color */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-screen video {
  max-width: 70%;
  max-height: 70%;
  object-fit: cover; /* Ensure the video fills the area without distortion */
}


/*------------ For small screens------------*/

@media only screen and (max-width: 768px){

    .box-area{
        margin: 50px;

    }
    .box{
        padding: 20px;
    }
    .form-control {
      width: 2.7rem;
    }

}
</style>

