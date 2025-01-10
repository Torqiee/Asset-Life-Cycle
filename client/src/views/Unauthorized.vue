<!-- src/views/Unauthorized.vue -->
<template>
    <div class="error-container">
      <h1>Unauthorized</h1>
      <p>You are not authorized to access this page.</p>
      <router-link to="/">Go back to Login</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Unauthorized',
  };
  </script>
  
  <style scoped>
  .error-container {
    text-align: center;
    padding: 50px;
    background-color: #f8d7da;
    color: #721c24;
  }
  </style>
  