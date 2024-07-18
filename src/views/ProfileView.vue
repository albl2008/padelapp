<script setup>
import { reactive, computed, onMounted, ref } from 'vue'
import { useMainStore } from '@/stores/main'
import { mdiAccount, mdiMail, mdiAsterisk, mdiFormTextboxPassword, mdiGithub } from '@mdi/js'
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
import { useAuthStore } from '@/stores/auth'
import { updateUser, getUser } from '@/api/user'
import NotificationBar from '@/components/NotificationBar.vue'
import { useClubStore } from '@/stores/club'
import { getAllClubs } from '@/api/club'

const mainStore = useMainStore()

const authStore = useAuthStore()

const clubStore = useClubStore()

const emit = defineEmits()

const locationValue = ref(null)
const clubs = ref(null)

const notification = computed(() => authStore.notification);

const profileForm = reactive({
  name: mainStore.userName,
  email: mainStore.userEmail,
  activeClub: null
})

const passwordForm = reactive({
  password_current: '',
  password: '',
  password_confirmation: ''
})

const getClubId = (clubName) => {
  return clubs.value.find(club => club.name === clubName).id
}

const submitProfile = async () => {
  const userId = authStore.userId
  const updateBody = {
    activeClub: getClubId(profileForm.activeClub)
  }

  debugger

  if ( !userId ) {
    return 
  } else{
    await updateUser(userId, updateBody)
    authStore.setActiveClub(getClubId(profileForm.activeClub))
    authStore.setNotification({ message: 'Actualizado exitosamente', type: 'success' });
  }



}

const getClubs = async () => {
  const response = await getAllClubs()
  debugger
  clubs.value = response.data.results
}

onMounted(async() => {

  await getClubs()
  const userId = authStore.userId
  if (userId) {
    debugger
    const userData = await getUser(userId)
    profileForm.activeClub = getClubName(userData.data.activeClub)
  }
})


const getClubName = (clubId) => {
  return clubs.value.find(club => club.id === clubId).name
}

const clubNames = () => {
  return clubs.value.map(club => club.name)
}

const dismissNotifications = () => {
  authStore.resetNotification();
};

const submitPass = () => {
  //
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiAccount" title="Profile" main>
        <BaseButton
          href="https://github.com/justboil/admin-one-vue-tailwind"
          target="_blank"
          :icon="mdiGithub"
          label="Star on GitHub"
          color="contrast"
          rounded-full
          small
        />
      </SectionTitleLineWithButton>
      <NotificationBar v-if="notification" :color="notification.type" @close="authStore.resetNotification"  :dismissCallback="dismissNotifications">
        <b>{{ notification.message }}</b>
        </NotificationBar>

      <UserCard class="mb-6" />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardBox is-form @submit.prevent="submitProfile">
          <FormField label="Avatar" help="Max 500kb">
            <FormFilePicker label="Upload" />
          </FormField>

          <FormField label="Name" help="Required. Your name">
            <FormControl
              v-model="profileForm.name"
              :icon="mdiAccount"
              name="username"
              autocomplete="username"
            />
          </FormField>
          <FormField label="E-mail" help="Required. Your e-mail">
            <FormControl
              v-model="profileForm.email"
              :icon="mdiMail"
              type="email"
              name="email"
              autocomplete="email"
            />
          </FormField>

          
          <FormField v-if="clubs && clubs.length > 0" label="Club Activo" help="Required. Your club">
            <FormControl v-model="profileForm.activeClub" name="club"  :options="clubNames()" />
          </FormField>
          
          

          <template #footer>
            <BaseButtons>
              <BaseButton color="info" type="submit" label="Submit" />
              <BaseButton color="info" label="Options" outline />
            </BaseButtons>
          </template>
        </CardBox>

        

        <CardBox is-form @submit.prevent="submitPass">
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
        </CardBox>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>