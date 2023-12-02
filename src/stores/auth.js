// auth.js in stores folder
import { defineStore } from 'pinia';
import { login as apiLogin, logout as apiLogout } from '@/api/auth';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: null,
    isLoggedIn: false,
  }),
  actions: {
    initializeAuth() {
        // Check for user information in local storage during initialization
        const storedUser = localStorage.getItem('user');
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
  
        if (storedUser && storedAccessToken && storedRefreshToken) {
          // If user information is found, set the user and isLoggedIn
          this.setUser(JSON.parse(storedUser));
          this.setLoggedIn(true);
        }
      },

    async login({ email, password }) {
      try {
        const response = await apiLogin({ email, password });
        const { user, tokens } = response.data;

        this.setUser(user);
        this.setLoggedIn(true);

        // Save user and tokens to local storage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', tokens.access.token);
        localStorage.setItem('refreshToken', tokens.refresh.token);

        // Handle permissions based on the user's role (example)
        if (user.role === 'admin') {
          // Handle admin permissions
        } else {
          // Handle regular user permissions
        }

        return true; // Login successful
      } catch (error) {
        console.error('Login failed:', error);
        return false; // Login failed
      }
    },
    async logout() {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        await apiLogout(refreshToken);

        // Clear user-related information from local storage
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        this.setUser(null);
        this.setLoggedIn(false);

        return true; // Logout successful
      } catch (error) {
        console.error('Logout failed:', error);
        return false; // Logout failed
      }
    },
    setUser(user) {
      this.user = user;
    },
    setLoggedIn(isLoggedIn) {
      this.isLoggedIn = isLoggedIn;
    },
  },
});
