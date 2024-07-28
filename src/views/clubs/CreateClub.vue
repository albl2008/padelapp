<script setup>
import { reactive, computed, onMounted, ref } from 'vue'
import { useMainStore } from '@/stores/main'
import { mdiAccount, mdiMail, mdiAsterisk, mdiFormTextboxPassword, mdiGithub, mdiCheck, mdiEye} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import FormFilePicker from '@/components/FormFilePicker.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import UserCard from '@/components/UserCard.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import Maps from '@/components/maps/Maps.vue'
import { updateUser, getUser } from '@/api/user'
import NotificationBar from '@/components/NotificationBar.vue'
import { useClubStore } from '@/stores/club'
import { createClub, updateClub, getClubById } from '@/api/club'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'
import { getFile } from '@/api/files'




const authStore = useAuthStore()
const clubStore = useClubStore()
const emit = defineEmits()

const locationValue = ref(null)
const addressValue = ref(null)
const isEditMode = ref(false);
const urlLogo = ref(null);

const notification = computed(() => clubStore.notification);

const clubForm = reactive({
  //name: mainStore.userName,
  //email: mainStore.userEmail,
  location: null,
  address: null,
  phone: null,
  name: null,
  logo: null,
  courtsQuantity: null,
})



const submit = async () => {
  
  try {

    const body = {
    location: clubForm.location,
    address: clubForm.address,
    phone: clubForm.phone,
    name: clubForm.name,
    logo: clubForm.logo,
    courtsQuantity: clubForm.courtsQuantity
  }
  debugger

  if (isEditMode.value) {
    await updateClub(router.currentRoute.value.params.idClub, body)
    clubStore.setNotification({ message: 'Club actualizado correctamente', type: 'info' });
  } else {
    await createClub(body)
    clubStore.setNotification({ message: 'Club creado correctamente', type: 'success' });
  }

  router.push('/club')

  } catch (error) {
    console.error('Error updating club:', error);
    clubStore.setNotification({ message: 'Error:' + error, type: 'danger' });
  }




}

onMounted(async() => {
  const clubId = router.currentRoute.value.params.idClub;
  
  if (clubId) {
    isEditMode.value = true;

    // Fetch club details based on the id and populate the form
    try {
      const clubDetails = await getClubById(clubId);
      const active = authStore.activeClub
      if (clubDetails.data.logo){
        urlLogo.value = await getFile(clubDetails.data.logo)
      }
      debugger
      clubForm.location = clubDetails.data.location;
      locationValue.value = clubDetails.data.location
      addressValue.value = clubDetails.data.address
      clubForm.address = clubDetails.data.address;
      clubForm.phone = clubDetails.data.phone;
      clubForm.name = clubDetails.data.name;
      clubForm.logo = clubDetails.data.logo ? clubDetails.data.logo : null;
      clubForm.courtsQuantity = clubDetails.data.courtsQuantity;
      //form.inUse = clubDetails.data.inUse;
    } catch (error) {
      console.error('Error fetching club details:', error);
      // Handle error if needed
    }
  }
})

const setLocation = (lacation) => {
  clubForm.location = lacation
}

const setAddress = (address) => {
  debugger
  clubForm.address = address
}

const getLocation = () => {
  return locationValue.value
}

const getAddress = () => {
  return addressValue.value
}


const dismissNotifications = () => {
  clubStore.resetNotification();
};

const setLogoUrl = async (event) => {
  debugger
  clubForm.logo = event
  urlLogo.value = await getFile(event)
}

const submitPass = () => {
  //
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton  :title="isEditMode ? clubForm.name : 'Crear club'" main>
        <BaseButton
          target="_blank"
          :icon="isEditMode && authStore.activeClub === router.currentRoute.value.params.idClub ? mdiCheck : mdiEye"
          :label="isEditMode && authStore.activeClub === router.currentRoute.value.params.idClub ? 'Activo' : 'No activo'"
          color="contrast"
          rounded-full
          small
        />
      </SectionTitleLineWithButton>
      <NotificationBar v-if="notification" :color="notification.type" @close="clubStore.resetNotification"  :dismissCallback="dismissNotifications">
        <b>{{ notification.message }}</b>
        </NotificationBar>
      
      <div class="gap-6 ">
        
        <CardBox is-form @submit.prevent="submit" class="">
          <div v-if="clubForm.logo" class="flex justify-center mb-6"> 
            <img
            :src="urlLogo"
            class="rounded-full h-24 w-24 max-w-24 bg-gray-100 dark:bg-slate-800"
            />
          </div>
          
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div> 
              <FormField label="Nombre" help="Nombre de tu club">
                <FormControl
                  v-model="clubForm.name"
                  
                  name="name"
                  autocomplete="name"
                  required
                />
              </FormField>
    
              <FormField label="Telefono" help="Telefono de tu club">
                <FormControl
                  v-model="clubForm.phone"
                  
                  name="phone"
                  autocomplete="phone"
                  required
                  type="number"
                />
              </FormField>
            </div>
           
  
            <!-- <FormField label="Dirección" help="Dirección de tu club">
              <FormControl
                v-model="clubForm.address"
                
                name="address"
                autocomplete="address"
                required
              />
            </FormField> -->
          
          
          <div>

            <FormField label="Canchas" help="Canchas de tu club">
              <FormControl
                v-model="clubForm.courtsQuantity"
                
                name="courtsQuantity"
                autocomplete="courtsQuantity"
                required
                type="number"
              />
            </FormField>

            <FormField label="Logo" help="Logo de tu club">
              <FormFilePicker :label="isEditMode && clubForm.logo ? 'Cambiar' : 'Subir'" v-model="clubForm.logo" @url="setLogoUrl($event)" :color="isEditMode && clubForm.logo ? 'success' : 'info'" accept="image/*"/>
            </FormField>
  
            
           
          </div>
          

          

          
            
          </div>
          <BaseDivider />

          <label class="block font-bold mb-2"> Ubicacion </label>

          <Maps @location-selected="setLocation($event)" :locationSaved="getLocation()" :addressSaved="getAddress()" @address-selected="setAddress($event)"/>

      

          <template #footer>
            <BaseButtons>
              <BaseButton color="info" outline type="submit" :label="isEditMode ? 'Actualizar' : 'Crear'" />
              <BaseButton color="info" label="Volver"  @click="router.go(-1)" outline />
            </BaseButtons>
          </template>
        </CardBox>

        

        <!-- <CardBox is-form @submit.prevent="submitPass">
          <FormField label="Current password" help="Required. Your current password">
            <FormControl
              v-model="passwordForm.password_current"
              :icon="mdiAsterisk"
              name="password_current"
              type="password"
              required
              autocomplete="current-password"
            />
          </FormField>

          <BaseDivider />

          <FormField label="New password" help="Required. New password">
            <FormControl
              v-model="passwordForm.password"
              :icon="mdiFormTextboxPassword"
              name="password"
              type="password"
              required
              autocomplete="new-password"
            />
          </FormField>

          <FormField label="Confirm password" help="Required. New password one more time">
            <FormControl
              v-model="passwordForm.password_confirmation"
              :icon="mdiFormTextboxPassword"
              name="password_confirmation"
              type="password"
              required
              autocomplete="new-password"
            />
          </FormField>

          

          <template #footer>
            <BaseButtons>
              <BaseButton type="submit" color="info" label="Submit" />
              <BaseButton color="info" label="Options" outline />
            </BaseButtons>
          </template>
        </CardBox> -->
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>