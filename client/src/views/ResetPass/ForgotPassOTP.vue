<template>
  <div id="otpPage" class="container d-flex justify-content-center align-items-center min-vh-100 min-vw-100" style="background-color: #ececec;">
    <div class="row border rounded-5 p-3 bg-white box-area justify-content-center">
        <div class="col-md-6 box">
            <div class="d-flex justify-content-center flex-column align-items-center">
                <div class="text-center mb-3">
                  <div class="row justify-content-center">
                    <img src="../assets/mail.png" class="mb-3" alt="" style="width: 190px; height: 150px;">
                  </div>
                    <h3 class="fs-3 mb-2 fw-semibold">Check your Inbox</h3>
                    <p class="mb-3" style="color: #989898;">We have sent the OTP to your email <span class="fw-semibold">{{ userEmail }}</span></p>
                </div>
                
                <!-- OTP Input Fields -->
                <div class="d-flex justify-content-center space-x-2 mb-3">
                    <input
                        v-for="(digit, index) in otp"
                        :key="index"
                        type="text"
                        maxlength="1"
                        class="form-control form-control-lg fs-6 rounded-3"
                        style="background-color: #E4E2E4; height: 3rem; color: #555; width: 3.2rem; text-align: center;"
                        v-model="otp[index]"
                        @input="handleInput(index, $event)"
                        @keydown.backspace="handleBackspace(index, $event)"
                    />
                </div>

                <!-- Verify Button -->
                <div class="input-group justify-content-center my-3">
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
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../../api";
import Swal from "sweetalert2"; // Import SweetAlert2

const router = useRouter();
const otp = ref(new Array(6).fill("")); // Array for 6-digit OTP
const userEmail = ref(localStorage.getItem("currentUserEmail"));
const token = localStorage.getItem("authToken");
const isLoading = ref(false); // Loading state for the button

const handleInput = (index, event) => {
  const value = event.target.value;
  if (value.match(/^\d$/)) {
    otp.value[index] = value; // Set the current digit
    if (index < otp.value.length - 1) {
      // Move to the next input field
      event.target.nextElementSibling?.focus();
    }
  } else {
    otp.value[index] = ""; // Clear invalid input
  }
};

const handleBackspace = (index, event) => {
  if (!otp.value[index] && index > 0) {
    // Move to the previous input field
    event.target.previousElementSibling?.focus();
  }
};

const verifyOTP = async () => {
  const enteredOTP = otp.value.join(""); // Combine all digits into a single string
  if (enteredOTP.length !== 6) {
    Swal.fire({
      icon: "info",
      title: "Please enter all 6 digits of the OTP",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true, // Show a progress bar
    });
    return;
  }

  isLoading.value = true; // Set loading state to true

  try {
    const response = await api.patch(
      "/api/auth/verify-forgot-password-code",
      {
        email: userEmail.value,
        providedCode: enteredOTP,
      },
      {
        headers: {
          client: `not-browser`,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      Swal.fire({
        icon: "success",
        title: "Verified!",
        text: "OTP verified successfully.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      localStorage.setItem("otpVerified", "true"); // Set the flag
      router.push("/NewPass");
    } else {
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: response.data.message || "The OTP you entered is incorrect.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  } catch (error) {
    console.error("OTP verification failed:", error);
    Swal.fire({
      icon: "error",
      title: "Incorrect OTP",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  } finally {
    isLoading.value = false; // Reset loading state
  }
};

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}
.box-area {
  width: 730px;
}

/*------------ Right box ------------*/

.box {
  padding: 65px 0px 65px 0px;
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

/*------------ For small screens------------*/

@media only screen and (max-width: 768px) {
  .box-area {
    margin: 50px;
  }
  .box {
    padding: 20px;
  }
  .form-control {
    width: 2.7rem;
  }
}
</style>
