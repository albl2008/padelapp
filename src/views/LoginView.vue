<script setup>
import { reactive, computed, watch, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadio from '@/components/FormCheckRadio.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import { useAuthStore } from '@/stores/auth'
import { getLastVisitedURL, setLastVisitedURL } from '@/api/interceptor'

const form = reactive({
  email: 'alvaroblanco10@gmail.com',
  pass: 'locolope1',
  remember: true
})

const router = useRouter()

const authStore = useAuthStore()

const notification = computed(() => authStore.notification);
const isLoggedIn = computed(() => authStore.isLoggedIn);

watch(notification, (newNotification) => {
  if (newNotification) {
    console.log(newNotification)
  }
  
});

onMounted(  () => {
   if (isLoggedIn.value) {
      router.push('/dashboard');
   }                                                       
})

const submit = async () => {
  try {
    
    const loginResponse = await authStore.login({
      email: form.email,
      password: form.pass
    });

    if (loginResponse === true) {
      debugger
      console.log('Login correcto')
      isLoggedIn.value = true
      const lastVisitedURL = getLastVisitedURL()
          if (lastVisitedURL) {
              if (lastVisitedURL.includes('/login')){
                router.push('/dashboard');
              }
              router.push(lastVisitedURL);
          } else {
              router.push('/dashboard');
          }
      authStore.resetNotification();
    } else {
      debugger
      setLastVisitedURL(null);
      const error = loginResponse
      if (error.response.data.code === 401){
        authStore.setNotification({ message: 'Email o contraseña incorrecto', type: 'danger' });
      } else {
        authStore.setNotification({ message: 'Error al iniciar sesión. Por favor, intenta de nuevo.', type: 'danger' });
      }
      // Handle login failure
      
      
      
      
    }
  } catch (error) {
    debugger
    // Handle errors
    authStore.setNotification({ message: 'Error al iniciar sesión. Por favor, intenta de nuevo.', type: 'danger' });
    console.error('Login failed:', error);
  }
}

const dismissNotifications = () => {
  authStore.resetNotification();
};


</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <NotificationBar v-if="notification" :color="notification.type" @close="authStore.resetNotification"  :dismissCallback="dismissNotifications">
        <b>{{ notification.message }}</b>
        </NotificationBar>
        <FormField label="Email" help="Please enter your email">
          <FormControl
            v-model="form.email"
            :icon="mdiAccount"
            name="email"
            autocomplete="email"
          />
        </FormField>

        <FormField label="Password" help="Please enter your password">
          <FormControl
            v-model="form.pass"
            :icon="mdiAsterisk"
            type="password"
            name="password"
            autocomplete="current-password"
          />
        </FormField>

        <FormCheckRadio
          v-model="form.remember"
          name="remember"
          label="Remember"
          :input-value="true"
        />

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Login" />
            <BaseButton to="/forgot-password" color="info" outline label="Forgot Password" />
            <BaseButton to="/register" color="info" outline label="Register" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
