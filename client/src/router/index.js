import { createRouter, createWebHistory } from 'vue-router';
import authRouter from './authRouter'; // Import the auth routes
import projectRouter from './projectRouter'; // Import the project routes
import Dashboard from '@/views/Dashboard.vue';
import IdCardPhoto from '@/views/Registration/IdCardPhoto.vue';
import SelfieId from '@/views/Registration/SelfieId.vue';
import ConfirmRegist from '@/views/Registration/ConfirmRegist.vue';
import NotFound from '@/views/components/NotFound.vue';
import Sidebar from '@/views/components/Sidebar.vue';
import Unauthorized from '@/views/components/Unauthorized.vue';
import Swal from 'sweetalert2'; // Import SweetAlert2
import Mcreatehw from '@/views/Mcreatehw.vue';
import WaitingRole from '@/views/Authenticate/WaitingRole.vue';

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
    path: '/sidebar',
    name: 'Sidebar',
    component: Sidebar,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: Unauthorized,
  },
  {
    path: '/testing',
    name: 'Testing',
    component: Mcreatehw,
  },
  {
    path: '/waiting-approval',
    name: 'WaitingApproval',
    component: WaitingRole
  }
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...authRouter, ...projectRouter, ...otherRoutes], // Merge auth routes with other routes
});

// Add a navigation guard
router.beforeEach((to, _from, next) => {
  const token = getCookie('authToken'); // Get auth token
  const userRole = localStorage.getItem('userRole'); // Retrieve user role from local storage

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
    next({ path: '/' }); // Redirect to login page
  } else if (userRole === 'New' && to.path !== '/waiting-approval') {
    Swal.fire({
      icon: 'warning',
      title: 'Account Pending Approval',
      text: 'Please wait for your account to be approved.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
    });
    next({ path: '/waiting-approval' }); // Redirect "New" users to custom page
  } else {
    next(); // Allow navigation
  }
});

export default router;