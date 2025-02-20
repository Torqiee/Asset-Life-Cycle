<template>
    <div class="container d-flex justify-content-center align-items-center min-vh-100 min-vw-100" style="background-color: #ececec;">
        <div class="row border rounded-5 p-3 bg-white box-area justify-content-center">
            <div class="col-md-6 box">
                <div class="row justify-content-center align-items-center">
                    <img src="../assets/checkmark.svg" class="mb-5" alt="" style="width: 135px; height: 110px;">
                    <div class="text-center mb-3">
                        <h3 class="fs-4 mb-4 fw-bold">Password updated</h3>
                        <p class="fw-semibold" style="color: #989898;">Your password has been successfully changed.</p>
                    </div> 
                    <div class="input-group my-3">
                        <button 
                            class="btn btn-lg w-100 fs-5 text-white fw-semibold" 
                            style="background-color: #133E87;" 
                            @click="redirectToLogin"
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
import { useRouter } from 'vue-router';

const router = useRouter();

localStorage.removeItem("otpVerified");

const redirectToLogin = () => {
    router.push('/');
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