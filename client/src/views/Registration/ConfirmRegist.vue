<template>
  <div class="container min-vh-100 d-flex flex-column align-items-center justify-content-center">
    <div class="card shadow-lg p-4 w-50">
      <h2 class="text-center fw-bold mb-4">Review and Submit Your Data</h2>

      <div class="mb-3">
        <h5 class="fw-bold">Collected Data</h5>
        <ul class="list-group">
          <li class="list-group-item" v-for="(value, key) in filteredData" :key="key">
            <strong>{{ key }}:</strong> {{ value }}
          </li>
        </ul>
      </div>

      <div v-if="idCardImagePreview" class="mb-3 text-center">
        <h5 class="fw-bold">ID Card Image</h5>
        <img :src="idCardImagePreview" alt="ID Card Preview" class="img-thumbnail shadow-sm" style="max-height: 250px;" />
      </div>

      <div v-if="selfieIdCardImagePreview" class="mb-3 text-center">
        <h5 class="fw-bold">Selfie Image</h5>
        <img :src="selfieIdCardImagePreview" alt="Selfie Preview" class="img-thumbnail shadow-sm" style="max-height: 250px;" />
      </div>

      <button @click="submitData" class="btn btn-primary btn-lg w-100 mt-3">
        Submit
      </button>
    </div>
  </div>
</template>


<script>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const collectedData = ref(null);
    const idCardImagePreview = ref(null); // Store the ID card image preview
    const selfieIdCardImagePreview = ref(null); // Store the selfie ID card image preview
    const router = useRouter();

    // Exclude images from the displayed data
    const filteredData = computed(() => {
      if (collectedData.value) {
        const { idCardImage, selfieIdCardImage, ...rest } = collectedData.value; // Exclude both images
        return rest;
      }
      return {};
    });

    onMounted(() => {
      const data = localStorage.getItem("registrationData");
      if (data) {
        collectedData.value = JSON.parse(data);

        // If idCardImage exists, assign it to the preview ref
        if (collectedData.value.idCardImage) {
          idCardImagePreview.value = collectedData.value.idCardImage;
        }

        // If selfieIdCardImage exists, assign it to the preview ref
        if (collectedData.value.selfieIdCardImage) {
          selfieIdCardImagePreview.value = collectedData.value.selfieIdCardImage;
        }

        console.log("Collected data for submission:", filteredData.value);
      }
    });

    const submitData = () => {
    fetch("http://localhost:8000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(collectedData.value),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.message || "Failed to submit data");
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data submitted successfully:", data);
        alert("Registration completed!");
        
        // Clear registration data from localStorage
        localStorage.removeItem("registrationData");

        // Redirect to the home page or any other page
        router.push('/');
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        alert(error.message);
      });
  };

    return {
      collectedData,
      filteredData,
      idCardImagePreview,
      selfieIdCardImagePreview,
      submitData,
    };
  },
};
</script>
