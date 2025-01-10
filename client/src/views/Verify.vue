<template>
    <div class="bg-white min-h-screen flex items-center justify-center text-center">
      <div class="container max-w-lg p-8 bg-white">
        
        <div class="grid place-items-center">
          <img src="../assets/time.png" alt="Code" class="w-[256px] h-[259px]">
        </div>
        
        <h2 class="text-[32px] mb-[10px] font-bold text-center font-poppins">Please wait!</h2>
        <p class="text-[22px] mb-[24px] text-gray-400 font-Roboto font-normal text-center">We’re checking your data to ensure 
            everything is accurate</p>
  
        <button
            type="submit"
            class="w-[470px] h-[62px] mt-[37px] text-[36px] flex items-center justify-center font-bold text-white bg-[#133E87] rounded-lg transition hover:bg-[#1e61d6]"
        >
        Sign Out
        </button>
      </div>
  </div>
</template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const isLogin = ref(true);
  const Code = ref('');
  
  const router = useRouter();
  
  const goToRegisterPage = () => {
    router.push('/registration'); // Navigate to the register page
  };
  </script>
  