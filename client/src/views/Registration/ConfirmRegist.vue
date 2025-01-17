<template>
  <div class="bg-white min-h-screen flex flex-col items-center justify-center text-center">
    <h2 class="text-[32px] font-bold">Review and Submit Your Data</h2>

    <div class="mt-8 text-left w-[80%] bg-gray-100 p-4 rounded-lg">
      <p class="text-lg font-bold text-gray-700">Collected Data:</p>
      <ul class="mt-4 space-y-2 text-gray-700">
        <!-- Display only non-image data -->
        <li v-for="(value, key) in filteredData" :key="key">
          <span class="font-bold">{{ key }}:</span> {{ value }}
        </li>
      </ul>

      <!-- Image Preview for idCardImage -->
      <div v-if="idCardImagePreview" class="mt-6">
        <p class="text-lg font-bold text-gray-700">ID Card Image Preview:</p>
        <div class="flex justify-center items-center mt-4">
          <img
            :src="idCardImagePreview"
            alt="ID Card Preview"
            class="rounded-lg shadow-lg border border-gray-300"
            style="width: auto; height: auto; max-width: 100%; max-height: 300px; object-fit: contain;"
          />
        </div>
      </div>

      <!-- Image Preview for selfieIdCardImage -->
      <div v-if="selfieIdCardImagePreview" class="mt-6">
        <p class="text-lg font-bold text-gray-700">Selfie Image Preview:</p>
        <div class="flex justify-center items-center mt-4">
          <img
            :src="selfieIdCardImagePreview"
            alt="Selfie Preview"
            class="rounded-lg shadow-lg border border-gray-300"
            style="width: auto; height: auto; max-width: 100%; max-height: 300px; object-fit: contain;"
          />
        </div>
      </div>
    </div>

    <button
      @click="submitData"
      class="w-[470px] h-[60px] pb-1 text-3xl mt-[37px] font-bold text-white bg-[#133E87] rounded-lg transition hover:bg-[#1e61d6]"
    >
      Submit
    </button>
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
