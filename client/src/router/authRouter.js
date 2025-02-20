import UserAccount from '@/views/User/UserAccount.vue';
import Login from '../views/Authenticate/Login.vue';
import SendOTP from '../views/Authenticate/SendOTP.vue';
import RegisterOne from '../views/Registration/RegisterOne.vue';
import RegisterTwo from '../views/Registration/RegisterTwo.vue';
import ForgotPass from '../views/ResetPass/ForgotPass.vue';
import ForgotPassOTP from '../views/ResetPass/ForgotPassOTP.vue';
import SetPass from '../views/ResetPass/SetPass.vue';
import UpdatedPasswordSuccess from '../views/ResetPass/UpdatedPasswordSuccess.vue';
import Swal from 'sweetalert2';

// Utility to read cookies
function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

const authRouter = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => {
      const token = getCookie('authToken');
      if (token) {
        next('/dashboard'); // Redirect to dashboard if already logged in
      } else {
        next(); // Continue to login page if not logged in
      }
    },
  },
  {
    path: '/registration-one',
    name: 'First Register',
    component: RegisterOne,
    beforeEnter: (to, from, next) => {
      const token = getCookie('authToken');
      if (token) {
        next('/dashboard'); // Redirect to dashboard if already logged in
      } else {
        next(); // Continue to registration page if not logged in
      }
    },
  },
  {
    path: '/registration-two',
    name: 'Second Register',
    component: RegisterTwo,
    beforeEnter: (to, from, next) => {
      const token = getCookie('authToken');
      if (token) {
        next('/dashboard'); // Redirect to dashboard if already logged in
      } else {
        next(); // Continue to registration page if not logged in
      }
    },
  },
  {
    path: '/ForgotPass',
    name: 'ForgotPass',
    component: ForgotPass,
    beforeEnter: (to, from, next) => {
      const token = getCookie('authToken');
      if (token) {
        next('/dashboard'); // Redirect to dashboard if already logged in
      } else {
        next(); // Continue to forgot password page if not logged in
      }
    },
  },
  {
    path: '/ForgotPassOTP',
    name: 'ForgotPassOTP',
    component: ForgotPassOTP,
    beforeEnter: (to, from, next) => {
      const token = getCookie('authToken');
      if (token) {
        next('/dashboard'); // Redirect to dashboard if already logged in
      } else {
        const email = localStorage.getItem('currentUserEmail');
        if (email) {
          next();
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Email required',
            text: 'Please provide your email first.',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          next('/ForgotPass'); // Redirect to the email submission page
        }
      }
    },
  },
  {
    path: '/NewPass',
    name: 'NewPass',
    component: SetPass,
    beforeEnter: (to, from, next) => {
      const token = getCookie('authToken');
      if (token) {
        next('/dashboard'); // Redirect to dashboard if already logged in
      } else {
        const otpVerified = localStorage.getItem('otpVerified');
        if (otpVerified === 'true') {
          next();
        } else {
          Swal.fire({
            icon: 'info',
            title: 'Complete OTP verification',
            text: 'You must verify your credentials before setting a new password.',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 8000,
            timerProgressBar: true,
          });
          next('/ForgotPassOTP'); // Redirect to OTP page
        }
      }
    },
  },
  {
    path: '/updated-password-success',
    name: 'Updated Password Success',
    component: UpdatedPasswordSuccess,
  },
  {
    path: '/account',
    name: 'Account Credentials',
    component: UserAccount,
  },
  {
    path: '/OTPSend',
    name: 'SendOTP',
    component: SendOTP,
  },
];

export default authRouter;
