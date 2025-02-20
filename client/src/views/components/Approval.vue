<template>
    <div class="mx-3 p-3 mb-4 rounded-4 d-flex justify-between" style="background-color: #EAE8EA;">
      <p class="fw-semibold text-dark">Project Name: {{ folderData.projectName }}</p>
      <!-- <p class="mb-1 text-dark">Created By: {{ folderData.createdBy }}</p> -->
      <p class="fw-semibold text-dark">Created At: {{ formatDate(folderData.createdAt) }}</p>
      <p class="fw-semibold text-dark">Status: {{ folderData.status }}</p>
    </div>
</template>
  
<script>
import api from '../../api';
import Cookies from 'js-cookie';

export default {
    name: "FolderInfo",
    props: ["folderId"], // Accept folder ID as a prop
    data() {
        return {
        folderData: {}, // Store folder details
        };
    },
    methods: {
        fetchFolderData() {
        const token = Cookies.get('authToken');
        if (token && this.folderId) {
            api.get(`/api/folder/${this.folderId}`, {
            headers: { Authorization: `Bearer ${token}` },
            })
            .then(response => {
            this.folderData = response.data.data; // Store folder data
            })
            .catch(error => console.error("Error fetching folder data:", error));
        }
        },
        formatDate(dateString) {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
        }
    },
    mounted() {
        this.fetchFolderData(); // Fetch data when the component is mounted
    }
};
</script>