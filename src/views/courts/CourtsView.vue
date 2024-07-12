<script setup>
import { mdiTableBorder, mdiTableOff, mdiGithub, mdiPlus, mdiAlertCircle } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import TableCourts from '@/views/courts/TableCourts.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/BaseButton.vue'
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue'

import { onMounted, ref, computed, watch } from 'vue';
import { useCourtsStore } from '@/stores/courts';
import { useConfigStore } from '@/stores/config'

import router from '../../router/index'
import { getAllCourts, createAllCourts } from '@/api/courts'
import { getAllConfig } from '@/api/config'


const courtsStore = useCourtsStore();
const configStore = useConfigStore();
const config = ref([]);
const courts = ref([]);
const allCourtsCreated = ref(false);
const reloadTable = ref(false);
const showMessage = ref(false);

onMounted(async () => {
  console.log('Component mounted!');
  await getConfig();
  await getCourts();
 

});

watch(courts
, () => {
  
  
}
)


const getConfig = async () => {
  const configData = await getAllConfig()
  config.value = configData.data.results[0]
}

const getCourts = async () => {
  courts.value = []
  const courtsData = await getAllCourts()
  courts.value = courtsData.data.results
  checkCompleteCourts(courts.value)
};


const checkCompleteCourts = (courts) => {
  const totalCourts = config.value.courtsQuantity
  const createdCourts = courts.length
  debugger
  if (totalCourts === createdCourts) {
    
    allCourtsCreated.value = true
    
  } else {
    showMessage.value = true
    allCourtsCreated.value = false
    
  }
}



const createCourt = () => {
  // Redirect to /forms when the button is clicked
  router.push('/new-court');
};

const notification = computed(() => courtsStore.notification);

const cancelMessage = () => {
  showMessage.value = false
}

const dismissNotifications = () => {
  courtsStore.resetNotification();
};

const createCourtsAuto = async() => {
  await createAllCourts(config.value.id)
  reloadTable.value = true
}

</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="Canchas" main>
        <!-- <BaseButton
          href="https://github.com/justboil/admin-one-vue-tailwind"
          target="_blank"
          :icon="mdiGithub"
          label="Star on GitHub"
          color="contrast"
          rounded-full
          small
        /> -->
        <BaseButton v-if="!allCourtsCreated"  :icon="mdiPlus" label="Cancha" color="primary" @click="createCourt" />
        <BaseButton v-if="courts.length === 0"  :icon="mdiPlus" label="Crear automaticamente" color="primary" @click="createCourtsAuto()" />
      </SectionTitleLineWithButton>
      <NotificationBar v-if="notification" :color="notification.type" :dismissCallback="dismissNotifications">
        <b>{{ notification.message }}</b>
      </NotificationBar>
      <NotificationBar v-if="showMessage" color="warning" :icon="mdiAlertCircle" :dismissCallback="cancelMessage" :outline="notificationsOutline">
       
          <p>Aun quedan canchas por cargar</p>
      </NotificationBar>
      <CardBox class="mb-6" has-table>
        
        <TableCourts @court-deleted="getCourts" :reload="reloadTable"/>
      </CardBox>

      <!-- <SectionTitleLineWithButton v-if="courts.length === 0" :icon="mdiTableOff" title="Empty variation" />

      <NotificationBar v-if="courts.length === 0" color="danger" :icon="mdiTableOff">
        <b>Empty table.</b> When there's nothing to show
      </NotificationBar> -->

      <!-- <CardBox>
        <CardBoxComponentEmpty />
      </CardBox> -->
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script>



</script>