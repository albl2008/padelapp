<script setup>
import { useRouter } from 'vue-router'
import { useDarkModeStore } from '@/stores/darkMode.js'
import { gradientBgBase, gradientBgDark, gradientBgPurplePink } from '@/colors.js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import BaseButton from '@/components/BaseButton.vue'
import { mdiEmail, mdiLogin, mdiPhone, mdiAccount, mdiNumeric, mdiAccountGroup } from '@mdi/js'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import { reactive, computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { requestAccess } from '@/api/requests'
import FormCheckRadio from '@/components/FormCheckRadio.vue'
import { useNotificationStore } from '@/stores/notifications'
import Maps from '@/components/maps/Maps.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import Recaptcha from '@/components/Recaptcha/Recaptcha.vue'

const notificationStore = useNotificationStore()


const styles = ['white', 'basic']

const darkModeStore = useDarkModeStore()

const authStore = useAuthStore()

const isLoading = ref(false)






const form = reactive({
  club: '',
  email: '',
  address: null,
  phone: null,
  location: null,
  courtsQuantity: null,
  moreLocations: false,
  displayName: null
})

darkModeStore.set(false)

const router = useRouter()

const handleStyleChange = (slug) => {
  document.documentElement.classList.forEach((token) => {
    if (token.indexOf('style') === 0) {
      document.documentElement.classList.replace(token, `style-${slug}`)
    }
  })

  router.push('/dashboard')
}

const setAddress = (address) => {
  form.address = address
}



const setLocation = (location) => {
  debugger
  form.location = location
}

const submit = async() => {

    if (!form.address || !form.location) {
      authStore.setNotification({ message: 'Por favor, selecciona una ubicacion.', type: 'danger' });
      return
    }

    try {

          isLoading.value = true
          const body = {
            displayName: form.displayName,
            clubName: form.club,
            email: form.email,
            address: form.address,
            phone: form.phone,
            location: form.location,
            courtsQuantity: form.courtsQuantity,
            moreLocations: form.moreLocations
          };
          debugger
          const response = await requestAccess(body);
          
          if (response.status === 201) {
            isLoading.value = false
            authStore.setNotification({ message: 'Solicitud exitosa. Revisaremos los datos y le enviaremos un email.', type: 'info' });
            clearForm()
            router.push('/')
            
          }
          // Handle the response as needed
          
        } catch (error) {
          isLoading.value = false
          debugger
          // Handle errors
          console.error('Registration failed:', error.response);
          authStore.setNotification({ message: 'Error en la solicitud. Por favor, intenta de nuevo.', type: 'danger' });
          
          
        } 
 
}

const clearForm = () => {
  form.club = ''
  form.email = ''
  form.address = null
  form.phone = null
  form.location = null
  form.courtsQuantity = null
  form.moreLocations = false
  form.displayName = null
}

const notification = computed(() => authStore.notification);

const dismissNotifications = () => {
  authStore.resetNotification();
};

const setValueCapcha = (value) => {
  debugger
  console.log('RESULTADO CAPTCHA: ',value)
}

const login = () => {
  // Redirect to /forms when the button is clicked
  router.push('/login');
};

</script>

<template>
  <LayoutGuest>
    <div :class="gradientBgDark" class="w-full h-full items-center justify-center">
      <SectionMain>
        <nav class="flex justify-between">
          <img
            :src="'/favicon.png'"
            class="w-12 md:w-12 h-12 md:h-12"
          />
          <div class="">
            <BaseButton class="mr-3" :icon="mdiLogin" label="Login" @click="login" />
            <!-- <BaseButton  :icon="mdiLogin" label="Registrarse" @click="register" /> -->
          </div>
         
        </nav>
        
        <div class="flex justify-center">
          <h1 class="text-4xl md:text-5xl text-center text-white font-bold mt-12 mb-3 lg:mt-0">
            <img
             :src="'/appadel-refined.png'"
             class=""
             /> 
         </h1>
        </div>

        
        <div>
          <h1 class="text-2xl md:text-2xl text-center text-white font-bold mt-12 mb-3 lg:mt-0">
            Me interesa
         </h1>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-1 max-w-6xl mx-auto">
          <CardBox is-form @submit.prevent="submit">
            <NotificationBar v-if="notification" :color="notification.type" @close="courtsStore.resetNotification()" :dismissCallback="dismissNotifications">
              <b>{{ notification.message }}</b>
            </NotificationBar> 
    
            <div v-if="isLoading" class="flex justify-center w-full">
              <img src="https://cdn.dribbble.com/users/3337757/screenshots/6825268/076_-loading_animated_dribbble_copy.gif" class="w-48" alt="Loading..." />
            </div>


            <div class="flex justify-center grid grid-cols-2 gap-6">
              <FormField label="Tu nombre">
                <FormControl
                  v-model="form.displayName"
                  :icon="mdiAccount"
                  name="displayName"
                  autocomplete="displayName"
                  required
                />
              </FormField>
              <FormField label="Club" help="Nombre del Club">
                <FormControl
                  v-model="form.club"
                  :icon="mdiAccountGroup"
                  name="club"
                  autocomplete="club"
                  required
                />
              </FormField>
      
              <FormField label="Email" help="Ingrese su email">
                <FormControl
                  v-model="form.email"
                  :icon="mdiEmail"
                  type="email"
                  name="email"
                  autocomplete="email"
                  required
                />
              </FormField>
  
              <FormField label="Telefono" help="">
                <FormControl
                  v-model="form.phone"
                  :icon="mdiPhone"
                  name="phone"
                  autocomplete="phone"
                  type="number"
                  required
                />
              </FormField>
      
              <FormField label="Cantidad de canchas" help="">
                <FormControl
                  v-model="form.courtsQuantity"
                  :icon="mdiNumeric"
                  name="courtsQuantity"
                  autocomplete="courtsQuantity"
                  type="number"
                  required
                />
              </FormField>
  
              <FormField label="Otras ubicaciones" help="¿Mas de una sucursal?">
                <FormCheckRadio
                  v-model="form.moreLocations"
                  name="moreLocations"
                  type:="switch"
                  
                />
              </FormField>

            
              
            </div>
           

            <BaseDivider />

            <label class="block font-bold mb-2"> Ubicacion </label>

            <Maps @address-selected="setAddress($event)" @location-selected="setLocation($event)" :light="true"/>

          
            <Recaptcha @captcha-verified="setValueCapcha($event)"/>

    
            <template #footer>
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Solicitar" />
                
              </BaseButtons>
            </template>
          </CardBox>
        </div>
      </SectionMain>
    </div>
  </LayoutGuest>
</template>
