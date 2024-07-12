// auth.js in stores folder
import { defineStore } from 'pinia';
import { useMainStore } from './main';
import { useDarkModeStore } from './darkMode';
import { login as apiLogin, logout as apiLogout, forgotPassword as apiForgotPassword } from '@/api/auth';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: null,
    isLoggedIn: false,
    notification: null,
  }),
  actions: {
    initializeAuth() {
        // Check for user information in local storage during initialization
        const storedUser = localStorage.getItem('user');
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
  
        if (storedUser && storedAccessToken && storedRefreshToken) {
          // If user information is found, set the user and isLoggedIn
          const mainStore = useMainStore();
          debugger
          const darkModeStore = useDarkModeStore();
          darkModeStore.set(true);
          this.setUser(JSON.parse(storedUser));
          mainStore.setUser(JSON.parse(storedUser));
          this.setLoggedIn(true);
        }
      },

    async login({ email, password }) {
      try {
        const mainStore = useMainStore();
        const darkModeStore = useDarkModeStore();
        

        const response = await apiLogin({ email, password });
        const { user, tokens } = response.data;


        if (response.status === 200){
          this.setUser(user);
          mainStore.setUser(user);
          this.setLoggedIn(true);
          darkModeStore.set(true);
  
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
  
          return true;
        }

        
      } catch (error) {
        console.error('Login failed:', error);
        return error; // Login failed
      }
    },
    async forgotPassword({ email }) {
      try {
        const response = await apiForgotPassword({ email });
        console.log(response)
        return true; // Login successful
      } catch (error) {
        console.error('forgot password failed:', error);
        return false; // Login failed
      }
    },

    async logout() {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const body = {
          refreshToken: refreshToken
        }
        await apiLogout(body);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        this.setUser(null);
        this.setLoggedIn(false);
      
        return true; 
        
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

    setNotification({ message, type }) {
      
      this.notification = { message, type };
    },
    // Add resetNotification method
    resetNotification() {
      
      this.notification = null;
    },
  },
});
