<template>
    <!-- <div class="mx-3 p-3 mb-4 rounded-4 d-flex justify-between" style="background-color: #EAE8EA;">
      <p class="fw-semibold text-dark">Project Name: {{ projectData.projectName }}</p> -->
      <!-- <p class="mb-1 text-dark">Created By: {{ projectData.createdBy }}</p> -->
      <!-- <p class="fw-semibold text-dark">Created At: {{ formatDate(projectData.createdAt) }}</p>
      <p class="fw-semibold text-dark">Status: {{ projectData.status }}</p> -->
    <!-- </div> -->
    <div class="row d-flex align-items-center rounded-4 mx-3 mb-4 py-3" style="background-color: #EAE8EA;">
        <div class="col-3">
            <h2>Project name : {{ projectData.projectName }}</h2>
            <h2>Owner name : {{ projectData.createdBy }}</h2>
        </div>
        <div class="col-6">
            <h2>Nodin number : {{ projectData.nodinNumber }}</h2>
            <h2>Nodin date: {{ projectData.nodinDate }}</h2>
            <h2>Nodin file : {{ projectData.nodinFile }}</h2>
        </div>
        <div class="col-3">
            <h2>Start date : {{ formatDate(projectData.startDate) }}</h2>
            <h2>End date : {{ formatDate(projectData.endDate) }}</h2>
        </div>
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