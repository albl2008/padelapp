<script setup>
import { ref } from 'vue'
import { mdiClose, mdiDotsVertical } from '@mdi/js'
import { containerMaxW } from '@/config.js'
import BaseIcon from '@/components/BaseIcon.vue'
import NavBarMenuList from '@/components/NavBarMenuList.vue'
import NavBarItemPlain from '@/components/NavBarItemPlain.vue'
import axios from 'axios';
//import { authStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { logout } from '@/api/auth';
import { setLastVisitedURL } from '@/api/interceptor';
import { useAuthStore } from '@/stores/auth';



defineProps({
  menu: {
    type: Array,
    required: true
  }
})

const authStore = useAuthStore()

const router = useRouter()

const performLogout = async () => {
  try {
    // const refreshToken = localStorage.getItem('refreshToken');

    // const body = {
    //   refreshToken: refreshToken
    // }
    // // Make a request to the logout endpoint using the imported function
    // await logout(body);
    await authStore.logout()
    
    setLastVisitedURL(null);
    // Redirect to the login page or another appropriate page
    router.push('/');
  } catch (error) {
    // Handle logout error
    console.error('Logout failed:', error);
  }
}

const emit = defineEmits(['menu-click'])

const menuClick = async (event, item) => {
  emit('menu-click', event, item)

  if (item.isLogout) {
    await performLogout();
  }
}

const isMenuNavBarActive = ref(false)
</script>

<template>
  <nav
    class="top-0 inset-x-0 fixed bg-gray-50 h-14 z-30 transition-position w-screen lg:w-auto dark:bg-slate-800"
  >
    <div class="flex lg:items-stretch" :class="containerMaxW">
      <div class="flex flex-1 items-stretch h-14">
        <slot />
      </div>
      <div class="flex-none items-stretch flex h-14 lg:hidden">
        <NavBarItemPlain @click.prevent="isMenuNavBarActive = !isMenuNavBarActive">
          <BaseIcon :path="isMenuNavBarActive ? mdiClose : mdiDotsVertical" size="24" />
        </NavBarItemPlain>
      </div>
      <div
        class="max-h-screen-menu overflow-y-auto lg:overflow-visible absolute w-screen top-14 left-0 bg-gray-50 shadow-lg lg:w-auto lg:flex lg:static lg:shadow-none dark:bg-slate-800"
        :class="[isMenuNavBarActive ? 'block' : 'hidden']"
      >
        <NavBarMenuList :menu="menu" @menu-click="menuClick" />
      </div>
    </div>
  </nav>
</template>
