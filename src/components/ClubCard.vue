<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useClubStore } from '@/stores/club'
import { mdiCheckDecagram } from '@mdi/js'
import BaseLevel from '@/components/BaseLevel.vue'
import { useNotificationStore } from '@/stores/notifications'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadio from '@/components/FormCheckRadio.vue'
import PillTag from '@/components/PillTag.vue'
import { getClubById } from '@/api/club'
import { getFile } from '@/api/files'

const authStore = useAuthStore()
const clubsStore = useClubStore()
const notificationStore = useNotificationStore()
const club = ref(null)
const activeClub = computed(() => authStore.activeClub)
const clubName = ref(null)
const urlLogo = ref(null)

const props = defineProps({
    reload: {
        type: Boolean,
        default: false
    }
})

onMounted(async () => {
    club.value = await clubsStore.getActiveClub();
    console.log('Club en perfil: ', club.value)
    debugger
    if (club.value) {
        clubName.value = club.value.name
        if (club.value.logo){
            urlLogo.value = await getFile(club.value.logo)
        }
    }
})

watch(props , async () => {
    if (props.reload) {
        club.value = await clubsStore.getActiveClub();
        console.log('Club en perfil: ', club.value)
        debugger
        if (club.value) {
            clubName.value = club.value.name
            if (club.value.logo){
                urlLogo.value = await getFile(club.value.logo)
            }
        }
       
    }
})

const userSwitchVal = ref(false)
</script>

<template>
  <CardBox>
    <BaseLevel type="justify-around lg:justify-center">
        <div v-if="club" class="flex justify-center mb-6"> 
            <img
            :src="urlLogo"
            class="rounded-full h-48 w-48 max-w-48 bg-gray-100 dark:bg-slate-800"
            />
          </div>
      <div class="space-y-3 text-center md:text-left lg:mx-12">
        <div class="flex justify-center md:block">
          <FormCheckRadio
            v-model="userSwitchVal"
            name="notifications-switch"
            type="switch"
            label="Notifications"
            :input-value="true"
          />
        </div>
        <h1 class="text-2xl">
          Club Activo: , <b>{{ clubName }}</b
          >!
        </h1>
        
      </div>
    </BaseLevel>
  </CardBox>
</template>
