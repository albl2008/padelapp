<script setup>
import { mdiTableBorder, mdiTableOff, mdiGithub, mdiPlus } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import TableRequest from '@/views/requests/TableRequest.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/BaseButton.vue'
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue'
import { onMounted, ref, computed, watch } from 'vue';
import { useRequestStore } from '@/stores/requests';
import router from '@/router'
import { getShiftById, updateShift } from '@/api/shifts'




const requestStore = useRequestStore();

const request = ref([]);
const requestsToEdit = ref([]);
const reload = ref(false);
const requestId = ref(null);

onMounted(async () => {
  console.log('Component mounted!');
  const idShift = router.currentRoute.value.params.idShift;

  if (idShift) {
    const completeShift = await getShiftById(idShift);

    if (completeShift.data) {
      debugger
      setRequests(completeShift.data.requests)
    }
  }

}); 


const setRequests = (requests) => {
  requestsToEdit.value = requests
}

const handleRequestDeleted = () => {
  console.log('Request deleted:');
  fetchRequest(); // Refresh the request after deletion
  requestStore.setNotification({ message: 'Requesturacion eliminada correctamente', type: 'danger' });
};

const fetchRequest = async () => {
  request.value = await requestStore.fetchRequest();
};


const notification = computed(() => requestStore.notification);

const dismissNotifications = () => {
  requestStore.resetNotification();
};


// Watch changes in the notification and perform actions accordingly
// You might want to customize this based on your notification handling logic
watch(notification, (newNotification) => {
  if (newNotification) {
    
  }
});

const getRequests = () => {
    debugger
    reload.value = true
};

const sendIdRequest = (id) => {
  debugger
  requestId.value = id
}

const requestsForShift = async (requests) => {
  debugger
  requests
  const idShift = router.currentRoute.value.params.idShift;

  if (idShift) {
    let body = {
      requests: []
    }
    if (requests.length > 0) {
      body.requests = requests.map((request) => request.id)
    }
    try {
      await updateShift(idShift, body);
      router.push(`/book-shift/${idShift}`)
    } catch (error) {
      console.error('Error updating shift:', error);
    }
  }
  

}

</script>

<template>
  <LayoutGuest>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="Solicitudes" main>
        <!-- <BaseButton
          href="https://github.com/justboil/admin-one-vue-tailwind"
          target="_blank"
          :icon="mdiGithub"
          label="Star on GitHub"
          color="contrast"
          rounded-full
          small
        /> -->

      </SectionTitleLineWithButton>
      <NotificationBar v-if="notification" :color="notification.type" @close="requestStore.resetNotification()" :dismissCallback="dismissNotifications">
        <b>{{ notification.message }}</b>
      </NotificationBar>

      <CardBox class="mb-6" has-table>
        <TableRequest :reload="reload" :requestsForEdit="requestsToEdit" @update-request="sendIdRequest($event)" @requests-for-shift="requestsForShift($event)"/>
      </CardBox>

      <CardBox class="mb-6" has-form @submit.prevent>
        <CreateRequestView @submit="getRequests" :updateRequest="requestId"  />
      </CardBox>

     

      <!-- <SectionTitleLineWithButton v-if="request.length === 0" :icon="mdiTableOff" title="Empty variation" />

      <NotificationBar v-if="request.length === 0" color="danger" :icon="mdiTableOff">
        <b>Empty table.</b> When there's nothing to show
      </NotificationBar> -->

      <!-- <CardBox>
        <CardBoxComponentEmpty />
      </CardBox> -->
    </SectionMain>
  </LayoutGuest>
</template>

<script>



</script>