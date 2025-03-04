<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100 min-vw-100" style="background-color: #ececec;">
    <div class="row border rounded-5 p-3 bg-white box-area justify-content-center">
      <!-- Header Section -->
      <div class="d-flex align-items-center pt-4 ps-4">
        <img src="../assets/layers.png" alt="Logo" style="width: 45px;" />
        <h2 class="fw-bolder fs-4 ps-4">User Registration</h2>
      </div>

      <!-- Form Section -->
      <div class="col-md-12 box">
        <div class="row justify-content-center">
          <div class="col-md-6 mb-3">
            <label for="email" class="form-label fw-semibold">Email</label>
            <input
              v-model="email"
              type="email"
              id="email"
              class="form-control form-control-lg text-start w-100 fs-6 bg-white border-3"
              placeholder="citaa@example.com"
              style="background-color: #e4e2e4; height: 3rem;"
              :class="{'is-invalid': errorMessages.email}"
            />
            <p v-if="errorMessages.email" class="text-danger mt-2">{{ errorMessages.email }}</p>
          </div>
          <div class="col-md-6 mb-3">
            <label for="phone" class="form-label fw-semibold">Phone number</label>
            <input
              v-model="phone"
              type="text"
              id="phone"
              class="form-control form-control-lg text-start w-100 fs-6 bg-white border-3 no-spinners"
              placeholder="(+62) 8123456789"
              style="background-color: #e4e2e4; height: 3rem;"
              :class="{'is-invalid': errorMessages.phone}"
            />
            <p v-if="errorMessages.phone" class="text-danger mt-2">{{ errorMessages.phone }}</p>
          </div>
          <div class="col-md-6 mb-4">
            <label for="password" class="form-label fw-semibold">Password</label>
            <input
              v-model="password"
              type="password"
              id="password"
              placeholder="At least 8 digits"
              class="form-control form-control-lg text-start w-100 fs-6 bg-white border-3"
              style="background-color: #e4e2e4; height: 3rem;"
              :class="{'is-invalid': errorMessages.password}"
            />
            <p v-if="errorMessages.password" class="text-danger mt-2">{{ errorMessages.password }}</p>
          </div>
          <div class="col-md-6 mb-4">
            <label for="rePassword" class="form-label fw-semibold">Re-enter Password</label>
            <input
              v-model="rePassword"
              type="password"
              id="rePassword"
              class="form-control form-control-lg text-start w-100 fs-6 bg-white border-3"
              style="background-color: #e4e2e4; height: 3rem;"
              :class="{'is-invalid': errorMessages.rePassword}"
            />
            <p v-if="errorMessages.rePassword" class="text-danger mt-2">{{ errorMessages.rePassword }}</p>
          </div>
          <h2 class="fs-6 pt-2 mb-3 fw-medium" style="color: #989898;">
            Make sure to re-check your data before continuing.
          </h2>
          <div class="col-md-6">
            <div class="mt-3">
              <button
                @click="handleRegister"
                type="button"
                class="btn btn-lg w-100 fs-5 text-white fw-semibold"
                style="background-color: #133e87;"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                <span v-else>Continue</span>
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
import Swal from "sweetalert2";
import api from "../../api";

export default {
  data() {
    return {
      email: "",
      phone: "",
      password: "",
      rePassword: "",
      errorMessages: {}, // To store error messages for each field
      isLoading: false, // Loading state for the button
    };
  },
  methods: {
    goToLoginPage() {
      this.$router.push("/");
    },
    async handleRegister() {
      let valid = true;
      this.errorMessages = {}; // Clear previous error messages

      // Validate required fields and constraints
      if (!this.email || !this.validateEmail(this.email)) {
        this.errorMessages.email = "Enter a valid email";
        valid = false;
      }

      if (!this.phone || this.phone.length < 10) {
        this.errorMessages.phone = "Must be at least 10 digits";
        valid = false;
      }

      if (!this.password || this.password.length < 8) {
        this.errorMessages.password = "Must be at least 8 characters";
        valid = false;
      }

      if (this.password !== this.rePassword) {
        this.errorMessages.rePassword = "Passwords do not match.";
        valid = false;
      }

      // If validation fails, show error and stop submission
      if (!valid) {
        Swal.fire({
          icon: "error",
          title: "Please check your input",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        return;
      }

      // Start loading spinner
      this.isLoading = true;

      // Proceed with the registration process
      try {
        const response = await api.post("/api/auth/check-registration", {
          email: this.email,
          phone: this.phone,
        });

        if (response.data.emailExists) {
          this.errorMessages.email = 'Email is already registered.';
          Swal.fire({
            icon: "warning",
            title: "Email already registered",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          return;
        }

        if (response.data.phoneExists) {
          this.errorMessages.phone = 'Phone number is already registered.';
          Swal.fire({
            icon: "warning",
            title: "Phone number already registered",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          return;
        }

        const dataToSave = {
          email: this.email,
          phone: this.phone,
          password: this.password,
        };
        localStorage.setItem("registrationData", JSON.stringify(dataToSave));

        Swal.fire({
          icon: "success",
          title: "Redirecting to the next step.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        this.$router.push("/registration-two");
      } catch (error) {
        console.error("Error checking registration:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred. Please try again later.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } finally {
        // Stop loading spinner
        this.isLoading = false;
      }
    },

    validateEmail(email) {
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      return regex.test(email);
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