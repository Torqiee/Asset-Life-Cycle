<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100 min-vw-100 p-0" style="background-color: #ececec;">
      <div class="row border rounded-5 p-3 bg-white box-area justify-content-center">
          <div class="col-md-7 box">
              <div class="row justify-content-center align-items-center">
                  <img src="./assets/unauthorized.svg" class="mb-5" alt="" style="width: 135px; height: 110px;">
                  <div class="text-center mb-3">
                      <h3 class="fs-2 mb-4 fw-bold">Oh.. its locked</h3>
                      <p class="fw-semibold" style="color: #989898;">You're unauthorized to enter this page.</p>
                  </div> 
                  <div class="row input-group my-3 justify-center">
                      <button 
                          class="btn btn-lg w-75 fs-5 text-white fw-semibold" 
                          style="background-color: #133E87;" 
                          @click="goBack"
                      >
                          Return
                      </button>
                  </div>
              </div>
          </div> 
      </div>
  </div>
</template>


<script>
import { useRouter } from 'vue-router';

export default {
name: 'Unauthorized',
setup() {
  const router = useRouter();

  const goBack = () => {
    router.go(-1); // Navigate back to the previous page
  };

  return {
    goBack,
  };
},
};
</script>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 50px;
}
</style>
