<script setup>
import { useRouter } from 'vue-router'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import { onMounted, computed } from 'vue'
import NotificationBar from '@/components/NotificationBar.vue'
import { useAuthStore } from '@/stores/auth'
import { verify } from '@/api/auth';


const authStore = useAuthStore()



const router = useRouter()

// Function to capture the token from the URL
const getTokenFromURL = () => {
  debugger
  const url = new URL(window.location.href);
  const token = url.hash.split('token=')[1];
  return token;
}

const submit = async () => {
  try {
    // Capture the token from the URL
    const token = getTokenFromURL()

    if (!token) {
      console.error('Token not found in URL')
      return
    }

    

    const response = await verify(token);
    debugger
    // Handle the response as needed
    if (response.status === 204){
      const timeout = setTimeout(() => {
        authStore.setNotification({ message: `Email verificado. Redirigiendo en ${timeout/1000} `, type: 'success' });
      },3000)
     
      router.push('/login');
    }
  } catch (error) {
    // Handle errors
    authStore.setNotification({ message: 'Error al verificar. Por favor, intenta de nuevo.', type: 'danger' });
    console.error('Registration failed:', error);
  }
}

onMounted(() => {
  getTokenFromURL()
});

const dismissNotifications = () => {
  authStore.resetNotification();
};

const notification = computed(() => authStore.notification);



</script>

<template>
  <LayoutGuest>
    <SectionFullScreen  bg="purplePink">
        <CardBox :class="cardClass" is-form @submit.prevent="submit">
            <NotificationBar v-if="notification" :color="notification.type" @close="authStore.resetNotification"  :dismissCallback="dismissNotifications">
            <b>{{ notification.message }}</b>
            </NotificationBar>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Register" />
            <BaseButton to="/dashboard" color="info" outline label="Back" />
          </BaseButtons>
        </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
