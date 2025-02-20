<template>
    <div class="p-3 mx-2 mt-4 rounded-4 d-flex justify-between" style="background-color: #EFEDEF;">
      <p class="text-dark">
        <span class="fw-semibold">Project Name:</span> {{ projectData.projectName }}
      </p>
      <!-- <p class="text-dark">Created By: {{ projectData.createdBy }}</p> -->
      <p class="text-dark">
        <span class="fw-semibold">Created At:</span> {{ formatDate(projectData.createdAt) }}
      </p>
      <p class="text-dark">
        <span class="fw-semibold">Status:</span> {{ projectData.status }}
      </p>
    </div>
</template>
  
<script>
import api from '../../api';
import Cookies from 'js-cookie';

export default {
    name: "ProjectInfo",
    props: ["projectId"], // Accept folder ID as a prop
    data() {
        return {
        projectData: {}, // Store folder details
        };
    },
    methods: {
        fetchProjectData() {
        const token = Cookies.get('authToken');
        if (token && this.projectId) {
            api.get(`/api/project/${this.projectId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(response => {
            this.projectData = response.data.data; // Store project data
            })
            .catch(error => console.error("Error fetching project data:", error));
        }
        },
        formatDate(dateString) {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
        }
    },
    mounted() {
        this.fetchProjectData(); // Fetch data when the component is mounted
    }
};
</script>