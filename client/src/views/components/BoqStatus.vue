<template>
    <div v-if="folderStatus == 'Draft'" class="d-md-block d-none px-4 rounded-4 mt-4" style="background-color: #EFEDEF;">
      <ol class="breadcrumb fw-semibold mt-4 mb-3 justify-content-md-center justify-content-start align-items-center custom-breadcrumb" style="--bs-breadcrumb-divider: '';">
        <router-link :to="{ path: `/hardware/${folderId}` }" class="breadcrumb-item" style="color: #133E87;">
          <span class="d-flex align-middle fw-semibold">
            <img src="../assets/step.svg" class="me-3" style="width: 25px;">
            1. <span class="ms-3">Hardware, Software, Service</span>
          </span>
        </router-link>
        <hr class="progress-hr mx-3 rounded-4" style="width: 6rem; border-width: 0.4rem; border-color: #133E87;">
        <a class="breadcrumb-item text-secondary">
            <span class="d-flex align-middle fw-semibold">
                <img src="../assets/step-second.svg" class="me-3" style="width: 25px;">
                2. <span class="ms-3">Review and Submit Data</span>
            </span>
        </a>
      </ol>
    </div>
  </template>
  
  <script>
  export default {
    name: "Breadcrumb",
    props: {
      folderId: {
        type: String,
        required: true
      },
      folderStatus: {
        type: String,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .progress-hr {
    width: 6rem;
    height: 0.400rem;
    border: none;
    background-color: #133E87;
    transform-origin: left;
    animation: progressFill 2s ease-in-out infinite;
  }
  
  @keyframes progressFill {
    0% {
      transform: scaleX(0);
      opacity: 1;
    }
    90% {
      transform: scaleX(1);
      opacity: 1;
    }
    100% {
      transform: scaleX(1);
      opacity: 0;
    }
  }
  </style>