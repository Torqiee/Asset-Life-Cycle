<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100 min-vw-100" style="background-color: #ececec;">
    <div class="row border rounded-5 p-3 bg-white box-area justify-content-center">
      <div class="d-flex align-items-center mb-4 pt-4 ps-4">
        <img src="../assets/logo.png" alt="Logo" style="width: 45px;">
        <h2 class="fw-bolder fs-4 ps-4">Set a new password</h2>
      </div>

      <h2 class="ps-4 fs-6 fw-medium text-muted">
        Ensure it differs from previous ones for security.
      </h2>

      <div class="col-md-6 box">
        <div class="row align-items-center">
          <div class="mb-3">
            <label for="Input1" class="form-label fw-semibold">New password</label>
            <input
              type="password"
              id="Input1"
              v-model="password"
              class="form-control form-control-lg text-start fs-6 w-100"
              style="background-color: #E4E2E4; height: 3rem;"
            />
          </div>
          <div class="mb-3">
            <label for="Input2" class="form-label fw-semibold">Re-type new password</label>
            <input
              type="password"
              id="Input2"
              v-model="confirmPassword"
              class="form-control form-control-lg text-start fs-6 w-100"
              style="background-color: #E4E2E4; height: 3rem;"
            />
          </div>
          <div class="input-group my-3">
            <button
              @click="submitNewPassword"
              type="button"
              class="btn btn-lg w-100 fs-5 text-white fw-semibold"
              style="background-color: #133E87;"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2"; // Import SweetAlert2
import api from "../api"; // Axios instance for backend communication

const password = ref("");
const confirmPassword = ref("");
const router = useRouter();
const email = ref(localStorage.getItem("currentUserEmail") || "");

const submitNewPassword = async () => {
  if (!password.value || !confirmPassword.value) {
    Swal.fire({
      icon: "warning",
      title: "Incomplete Fields",
      text: "Please fill in all the fields.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    return;
  }

  if (password.value !== confirmPassword.value) {
    Swal.fire({
      icon: "error",
      title: "Password Mismatch",
      text: "Passwords do not match.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    return;
  }

  if (!email.value) {
    Swal.fire({
      icon: "error",
      title: "Email Not Found",
      text: "Email not found. Please try again.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    return;
  }

  try {
    const response = await api.patch("/api/auth/change-password", {
      email: email.value,
      newPassword: password.value,
    });

    if (response.data.success) {
      Swal.fire({
        icon: "success",
        title: "Password Updated",
        text: "Password updated successfully!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      localStorage.removeItem("currentUserEmail");
      router.push("/updated-password-success"); // Redirect to the success page
    } else {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: response.data.message || "Failed to update password.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  } catch (error) {
    console.error("Error updating password:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred while updating the password.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }
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
  padding: 60px 0;
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