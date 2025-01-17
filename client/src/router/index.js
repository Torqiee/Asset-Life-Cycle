import { createRouter, createWebHistory } from 'vue-router';
import authRouter from './authRouter'; // Import the auth routes
import projectRouter from './projectRouter'; // Import the project routes
import Dashboard from '@/views/Dashboard.vue';
import IdCardPhoto from '@/views/Registration/IdCardPhoto.vue';
import SelfieId from '@/views/Registration/SelfieId.vue';
import ConfirmRegist from '@/views/Registration/ConfirmRegist.vue';
import Verify from '@/views/Verify.vue';
import NotFound from '@/views/NotFound.vue';
import Sidebar from '@/views/components/Sidebar.vue';
import Swal from 'sweetalert2'; // Import SweetAlert2

// Utility to read cookies
function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

// Define other routes
const otherRoutes = [
  {
    path: '/IdCardPhoto',
    name: 'ID Card Photo',
    component: IdCardPhoto,
  },
  {
    path: '/SelfieIdCard',
    name: 'Selfie with ID Card',
    component: SelfieId,
  },
  {
    path: '/confirm-registration',
    name: 'Confirm Registration',
    component: ConfirmRegist,
  },
  {
    path: '/Verify',
    name: 'Verify',
    component: Verify,
  },
  {
    path: '/sidebar',
    name: 'Sidebar',
    component: Sidebar,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }, // Mark as a protected route
  },
  {
    path: '/:pathMatch(.*)*', // Catch-all route for undefined paths
    name: 'NotFound',
    component: NotFound, // Display a 404 component
  },
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...authRouter, ...projectRouter, ...otherRoutes], // Merge auth routes with other routes
});

// Add a navigation guard
router.beforeEach((to, _from, next) => {
  const token = getCookie('authToken'); // Check if the user has a token in cookies

  if (to.matched.some((record) => record.meta.requiresAuth) && !token) {
    Swal.fire({
      icon: 'error',
      title: 'Authentication required',
      text: 'You must be logged in to access this page.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 8000,
      timerProgressBar: true,
    });
    next({ path: '/' }); // Redirect to the login page
  } else {
    next(); // Allow navigation
  }
});

export default router;
