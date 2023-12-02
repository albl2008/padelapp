<script setup>
import { mdiLogout, mdiClose } from '@mdi/js'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import axios from 'axios';
import AsideMenuList from '@/components/AsideMenuList.vue'
import AsideMenuItem from '@/components/AsideMenuItem.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import { logout } from '@/api/auth';
import { setLastVisitedURL } from '@/api/interceptor';

defineProps({
  menu: {
    type: Array,
    required: true
  }
})

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

const emit = defineEmits(['menu-click', 'aside-lg-close-click'])

const logoutItem = computed(() => ({
  label: 'Logout',
  icon: mdiLogout,
  color: 'info',
  isLogout: true
}))

const menuClick = async (event, item) => {
  emit('menu-click', event, item)
  if (item.isLogout) {
    await performLogout();
  }
}

const asideLgCloseClick = (event) => {
  emit('aside-lg-close-click', event)
}
</script>

<template>
  <aside
    id="aside"
    class="lg:py-2 lg:pl-2 w-60 fixed flex z-40 top-0 h-screen transition-position overflow-hidden"
  >
    <div class="aside lg:rounded-2xl flex-1 flex flex-col overflow-hidden dark:bg-slate-900">
      <div class="aside-brand flex flex-row h-14 items-center justify-between dark:bg-slate-900">
        <div class="text-center flex-1 lg:text-left lg:pl-6 xl:text-center xl:pl-0">
          <b class="font-black">One</b>
        </div>
        <button class="hidden lg:inline-block xl:hidden p-3" @click.prevent="asideLgCloseClick">
          <BaseIcon :path="mdiClose" />
        </button>
      </div>
      <div
        class="flex-1 overflow-y-auto overflow-x-hidden aside-scrollbars dark:aside-scrollbars-[slate]"
      >
        <AsideMenuList :menu="menu" @menu-click="menuClick" />
      </div>

      <ul>
        <AsideMenuItem :item="logoutItem" @menu-click="menuClick" />
      </ul>
    </div>
  </aside>
</template>
