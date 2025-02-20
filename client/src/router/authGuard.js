import api from '../api';
import Cookies from 'js-cookie';

export async function checkAdminRole(to, from, next) {
  const token = Cookies.get('authToken');
  if (token) {
    try {
      const response = await api.get('/api/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userRole = response.data.data.role;
      if (userRole === 'Manager') {
        next();
      } else {
        next({ name: 'Unauthorized' });
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      next({ name: 'Unauthorized' });
    }
  } else {
    next({ name: 'Unauthorized' }); // Redirect if no token is found
  }
}
