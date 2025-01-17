<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100 min-vw-100" style="background-color: #ececec;">
    <div class="row border rounded-5 p-3 bg-white box-area justify-content-center">
      <div class="d-flex align-items-center pt-4 ps-4">
        <img src="../assets/layers.png" alt="Logo" style="width: 45px;">
        <h2 class="fw-bolder fs-4 ps-4">User Registration</h2>
      </div>

      <div class="col-md-12 box">
        <div class="row justify-content-center">
          <div class="col-md-6 mb-3">
            <label for="fullName" class="form-label fw-semibold">Full name</label>
            <input
              v-model="fullName"
              type="text"
              id="fullName"
              class="form-control form-control-lg text-start w-100 fs-6"
              placeholder=" Example Citaa Developer"
              style="background-color: #E4E2E4; height: 3rem;"
              :class="{'is-invalid': errorMessages.fullName}"
            />
            <p v-if="errorMessages.fullName" class="text-danger mt-2">{{ errorMessages.fullName }}</p>
          </div>
          <div class="col-md-6 mb-3">
            <label for="username" class="form-label fw-semibold">Username</label>
            <input
              v-model="username"
              type="text"
              id="username"
              class="form-control form-control-lg text-start w-100 fs-6"
              placeholder="example_citaa"
              style="background-color: #E4E2E4; height: 3rem;"
              :class="{'is-invalid': errorMessages.username}"
            />
            <p v-if="errorMessages.username" class="text-danger mt-2">{{ errorMessages.username }}</p>
          </div>
          <div class="col-md-6 mb-4">
            <label for="companyName" class="form-label fw-semibold">Company name</label>
            <input
              v-model="companyName"
              type="text"
              id="companyName"
              class="form-control form-control-lg text-start w-100 fs-6"
              placeholder="Vendor A"
              style="background-color: #E4E2E4; height: 3rem;"
              :class="{'is-invalid': errorMessages.companyName}"
            />
            <p v-if="errorMessages.companyName" class="text-danger mt-2">{{ errorMessages.companyName }}</p>
          </div>
          <div class="col-md-6 mb-2">
            <label for="nik" class="form-label fw-semibold">NIK (Nomor Induk Kependudukan)</label>
            <input
              v-model="nik"
              type="text"
              id="nik"
              class="form-control form-control-lg text-start w-100 fs-6 no-spinners"
              placeholder="16 Digit number"
              style="background-color: #E4E2E4; height: 3rem;"
              :class="{'is-invalid': errorMessages.nik}"
            />
            <p v-if="errorMessages.nik" class="text-danger mt-2">{{ errorMessages.nik }}</p>
          </div>
          <h2 class="fs-6 pt-2 mb-3 fw-medium" style="color: #989898;">
            Make sure to re-check your data before continuing.
          </h2>
          <div class="col-md-6">
            <div class="mt-3">
              <button
                @click="handleContinue"
                class="btn btn-lg w-100 fs-5 text-white fw-semibold"
                style="background-color: #133E87;"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Section -->
      <p class="text-center pb-3 text-lg">
        Already have an account?
        <span
          @click="goToLoginPage"
          class="text-[#133E87] font-bold hover:text-[#1e61d6] cursor-pointer"
        >
          Login here
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'; // Import SweetAlert
import api from "../../api";

export default {
  data() {
    return {
      fullName: '',
      username: '',
      companyName: '',
      nik: '',
      savedData: {}, // To store previously saved data if available
      errorMessages: {} // To store error messages for each field
    };
  },
  mounted() {
    // Check if required data from the first page is available
    const savedData = localStorage.getItem('registrationData');
    if (!savedData) {
      // Redirect to the first page if data is missing
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete data',
        text: 'Please complete the first step before proceeding.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 3000,
      });
      this.$router.push('/registration-one'); // Adjust route as needed

    } else {
      this.savedData = JSON.parse(savedData);
      // Pre-fill the form with saved data if applicable
      this.fullName = this.savedData.fullName || '';
      this.username = this.savedData.username || '';
      this.companyName = this.savedData.companyName || '';
      this.nik = this.savedData.nik || '';
    }
  },
  methods: {
    async handleContinue() {
    let valid = true;

    // Clear previous error messages
    this.errorMessages = {};

    // Validate fields
    if (!this.fullName.trim()) {
      this.errorMessages.fullName = 'Full name is required.';
      valid = false;
    }

    if (!this.username.trim()) {
      this.errorMessages.username = 'Username is required.';
      valid = false;
    }

    if (!this.companyName.trim()) {
      this.errorMessages.companyName = 'Company name is required.';
      valid = false;
    }

    if (!this.nik.trim() || this.nik.length !== 16) {
      this.errorMessages.nik = 'Must be 16 digits.';
      valid = false;
    }

    if (!this.fullName.trim() || this.fullName.length < 6) {
      this.errorMessages.fullName = 'Required at least 6 letter.';
      valid = false;
    }

    if (!valid) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please check your input.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    // Check if the username is already taken
    try {
      const response = await api.post('/api/auth/check-registration', {
        username: this.username,
      });

      if (response.data.usernameExists) {
        this.errorMessages.username = 'Username is already taken.';
        Swal.fire({
          icon: 'warning',
          title: 'Username already exists',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        return;
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while checking the username. Please try again later.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    // Save the data to localStorage
    const updatedData = {
      ...this.savedData,
      fullName: this.fullName,
      username: this.username,
      companyName: this.companyName,
      nik: this.nik,
    };
    localStorage.setItem('registrationData', JSON.stringify(updatedData));

    // Redirect to the next page
    Swal.fire({
      icon: 'success',
      title: 'Registration Step Completed',
      text: 'Proceeding to the next step.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
    });

    this.$router.push('/SelfieIdCard'); // Adjust route as needed
    },

    goToLoginPage() {
      this.$router.push('/'); // Redirect to login page
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

body {
  font-family: 'Poppins', sans-serif;
  background: #ececec;
}

.box-area {
  width: 730px;
}

.box {
  padding: 60px 40px;
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

/* Remove up/down arrows for number input fields */
input[type="number"].no-spinners {
    -moz-appearance: textfield; /* Remove in Firefox */
    appearance: textfield; /* Remove in other browsers */
}

input[type="number"].no-spinners::-webkit-inner-spin-button,
input[type="number"].no-spinners::-webkit-outer-spin-button {
    -webkit-appearance: none; /* Remove in WebKit-based browsers (Chrome, Safari, etc.) */
    margin: 0; /* Prevent layout shift */
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
