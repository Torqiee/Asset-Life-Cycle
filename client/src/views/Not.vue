<template>
    <div class="container d-flex justify-content-center align-items-center min-vh-100 min-vw-100" style="background-color: #ececec;">
      <div class="row border rounded-5 p-3 bg-white box-area justify-content-center">
        <div class="col-md-6 box">
          <div class="row align-items-center">
            <img src="../assets/logo.png" style="width: 30px;" alt="" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>

  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  
  * {
    font-family: 'Poppins', sans-serif;
  }
  
  .spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #fff;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  .spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .box-area {
    width: 730px;
  }
  
  .box {
    padding: 80px 0px 80px 0px;
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
  