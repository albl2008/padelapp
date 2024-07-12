import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useMainStore } from '@/stores/main.js';
import { useDarkModeStore } from '@/stores/darkMode.js';
import { useCourtsStore } from '@/stores/courts';
import { useConfigStore } from '@/stores/config';
import { useAuthStore } from '@/stores/auth';
import './css/main.css';
import './api/interceptor'


// Init Pinia
const pinia = createPinia();

// Create Vue app
const app = createApp(App);
app.use(router).use(pinia);



// Init stores

const courtsStore = useCourtsStore(pinia);
const configStore = useConfigStore(pinia);
const authStore = useAuthStore(pinia); 

//const authStore = useAuthStore(pinia); // Initialize the Auth store

// Fetch sample data
// const darkModeStore = useDarkModeStore(pinia)
// console.log('darkMode: ', localStorage.getItem('darkMode'))
// if (
//   (!localStorage.key['darkMode'])
//   || (localStorage.getItem('darkMode') === '0')
// ) {
//   debugger
//   darkModeStore.isEnabled = true
//   darkModeStore.set()
// }

// Initialize authentication state

authStore.initializeAuth();

if (authStore.isLoggedIn) {
  
  //router.push('/dashboard');
  // darkModeStore.isEnabled = true
  // darkModeStore.set()
} else {
  // The user is not authenticated, you can redirect or show a login form
  // For example, you might want to redirect to the login page
  console.log('NO ESTA LOGUEADO')
  authStore.isLoggedIn = false
  router.push('/login');
}

// Dark mode logic...
// If you have a separate darkMode store, initialize and use it here

// Uncomment, if you'd like to restore persisted darkMode setting, or use `prefers-color-scheme: dark`.
// Make sure to uncomment localStorage block in src/stores/darkMode.js
// Dark mode
// Uncomment, if you'd like to restore persisted darkMode setting, or use `prefers-color-scheme: dark`. Make sure to uncomment localStorage block in src/stores/darkMode.js




// Default title tag
const defaultDocumentTitle = 'appadel';

// Set document title from route meta
router.afterEach((to) => {
  document.title = to.meta?.title
    ? `${to.meta.title} — ${defaultDocumentTitle}`
    : defaultDocumentTitle;
});

// Example: Use authStore to check authentication status
// if (authStore.isAuthenticated) {
//   // The user is authenticated, you can perform additional actions if needed
// } else {
//   // The user is not authenticated, you can redirect or show a login form
// }

// Mount the app
app.mount('#app');
