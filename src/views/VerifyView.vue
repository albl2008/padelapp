<script setup>
import { useRouter } from 'vue-router'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import { onMounted, computed, ref, reactive } from 'vue'
import NotificationBar from '@/components/NotificationBar.vue'
import { useAuthStore } from '@/stores/auth'
import { verifyNewClub} from '@/api/auth';
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import { mdiAsterisk } from '@mdi/js'


const authStore = useAuthStore()


const isLoading = ref(false)

const form = reactive({
  password: '',
  password_confirmation: '',
})

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
    if (form.password !== form.password_confirmation) {
      console.error('Passwords do not match')
      authStore.setNotification({ message: 'Las contraseñas no coinciden', type: 'danger' });
      return
    }
    // Capture the token from the URL
    isLoading.value = true

    await new Promise(resolve => setTimeout(resolve, 2000));

    const token = getTokenFromURL()

    if (!token) {
      console.error('Token not found in URL')
      isLoading.value = false
      return
    }

    const body = {
      password: form.password
    }

    

    const response = await verifyNewClub(token, body);
    debugger
    // Handle the response as needed
    if (response.status === 204){
        isLoading.value = false
        authStore.setNotification({ message: `Email verificado. Puede iniciar sesion `, type: 'success' });
        router.push('/login');
    }
  } catch (error) {
    // Handle errors
    authStore.setNotification({ message: 'Error al verificar. Por favor, intenta de nuevo.', type: 'danger' });
    console.error('Registration failed:', error);
    isLoading.value = false
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
        <CardBox :class="cardClass" is-form @submit.prevent="submit" class="w-11/12 md:w-1/3 ">
            <NotificationBar v-if="notification" :color="notification.type" @close="authStore.resetNotification"  :dismissCallback="dismissNotifications">
            <b>{{ notification.message }}</b>
            </NotificationBar>
            <div v-if="isLoading" class="flex justify-center w-full">
              <img src="https://cdn.dribbble.com/users/3337757/screenshots/6825268/076_-loading_animated_dribbble_copy.gif" class="w-48" alt="Loading..." />
            </div>

            <FormField label="Password" help="Ingrese su contraseña">
              <FormControl
                v-model="form.password"
                :icon="mdiAsterisk"
                name="password"
                type="password"
                required
              />
            </FormField>
            <FormField label="Confirm Password" help="Confirme su contraseña">
              <FormControl
                v-model="form.password_confirmation"
                :icon="mdiAsterisk"
                name="password_confirmation"
                type="password"
                required
              />
            </FormField>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Register" />
            <BaseButton to="/dashboard" color="info" outline label="Back" />
          </BaseButtons>
        </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
