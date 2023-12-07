  <script setup>
  import NavBarItem from '@/components/NavBarItem.vue'
  import axios from 'axios';
  import { useRouter } from 'vue-router'
  import { logout } from '@/api/auth';
  import { setLastVisitedURL } from '@/api/interceptor';
  import { ref } from 'vue'
  import { useDarkModeStore } from '@/stores/darkMode';

  defineProps({
    menu: {
      type: Array,
      default: () => []
    }
  })

  const darkModeStore = useDarkModeStore()

  const router = useRouter()

  const performLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      const body = {
        refreshToken: refreshToken
      }
      // Make a request to the logout endpoint using the imported function
      await logout(body);

      // Clear user-related information from local storage
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      setLastVisitedURL(null);
      // Redirect to the login page or another appropriate page
      router.push('/');
    } catch (error) {
      // Handle logout error
      console.error('Logout failed:', error);
    }
  }

  let flag = ref(false)

  const emit = defineEmits(['menu-click'])

  const menuClick = async (event, item) => {
  emit('menu-click', event, item);
  
  if (item.isLogout && !flag) {
    flag = true
    await performLogout();
  }

  if (item.isToggleLightDark){
    darkModeStore.set()
  }
}
  </script>

  <template>
    <NavBarItem v-for="(item, index) in menu" :key="index" :item="item" @menu-click="menuClick" />
  </template>
