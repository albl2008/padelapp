<script setup>
import { reactive, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { register } from '@/api/auth'


const authStore = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
  remember: true
})

const isLoading = ref(false)

const router = useRouter()

const submit = async() => {
    try {
          isLoading.value = true
          const body = {
            name: form.name,
            email: form.email,
            password: form.password,
          };

          const response = await register(body);
          debugger
          if (response.status === 201) {
            isLoading.value = false
            authStore.setNotification({ message: 'Registro exitoso. Se envio un email para confirmar la cuenta.', type: 'info' });
            router.push('/login')
            
          }
          // Handle the response as needed
          
        } catch (error) {
          isLoading.value = false
          debugger
          // Handle errors
          console.error('Registration failed:', error.response);
          if (error.response.data.code === 400 && error.response.data.message === 'password must contain at least 1 letter and 1 number' ){
            authStore.setNotification({ message: 'La contraseña debe contener al menos 1 letra y 1 número', type: 'danger' });
          } else if (error.response.data.code === 400 && error.response.data.message === 'Email already taken' ){
            authStore.setNotification({ message: 'Error al registrar. El email ya esta registrado.', type: 'danger' });
          } else {
            authStore.setNotification({ message: 'Error al registrar. Por favor, intenta de nuevo.', type: 'danger' });
          }
          
        } 
 
}

const notification = computed(() => authStore.notification);

const dismissNotifications = () => {
  authStore.resetNotification();
};

</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <NotificationBar v-if="notification" :color="notification.type" @close="courtsStore.resetNotification()" :dismissCallback="dismissNotifications">
          <b>{{ notification.message }}</b>
        </NotificationBar> 

        <div v-if="isLoading" class="flex justify-center w-full">
          <img src="https://cdn.dribbble.com/users/3337757/screenshots/6825268/076_-loading_animated_dribbble_copy.gif" class="w-48" alt="Loading..." />
        </div>
        
        <FormField label="Nombre" help="Ingrese su nombre">
          <FormControl
            v-model="form.name"
            :icon="mdiAccount"
            name="name"
            autocomplete="name"
          />
        </FormField>

        <FormField label="Email" help="Ingrese su email">
          <FormControl
            v-model="form.email"
            :icon="mdiAccount"
            type="email"
            name="email"
            autocomplete="email"
          />
        </FormField>

        <FormField label="Password" help="Ingrese su contraseña">
          <FormControl
            v-model="form.password"
            :icon="mdiAsterisk"
            type="password"
            name="password"
            autocomplete="current-password"
          />
        </FormField>

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Register" />
            <BaseButton to="/dashboard" color="info" outline label="Back" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
