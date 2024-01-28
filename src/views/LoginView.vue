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
import { getLastVisitedURL } from '@/api/interceptor'

const form = reactive({
  email: 'alvaroblanco10@gmail.com',
  pass: 'sopa0102',
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
                                                                             
})

const submit = async () => {
  try {
    
    const loginSuccess = await authStore.login({
      email: form.email,
      password: form.pass
    });

    if (loginSuccess) {
      console.log('Login correcto')
      const lastVisitedURL = authStore.getLastVisitedURL;
          if (lastVisitedURL) {
              router.push(lastVisitedURL);
          } else {
              router.push('/dashboard');
          }
    } else {
      // Handle login failure
      console.log('error en inicio de sesion')
      
   
      console.error('Login failed');
    }
  } catch (error) {
    // Handle errors
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
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
