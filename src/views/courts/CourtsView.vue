<script setup>
import { mdiTableBorder, mdiTableOff, mdiGithub, mdiPlus } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import TableCourts from '@/components/courts/TableCourts.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/BaseButton.vue'
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue'

import { onMounted, ref, computed, watch } from 'vue';
import { useCourtsStore } from '@/stores/courts';

import router from '../../router/index'


const courtsStore = useCourtsStore();
const courts = ref([]);

onMounted(async () => {
  console.log('Component mounted!');
  await fetchCourts();
}); 

const handleCourtDeleted = () => {
  console.log('Court deleted:');
  fetchCourts(); // Refresh the courts after deletion
  courtsStore.setNotification({ message: 'Cancha eliminada correctamente', type: 'danger' });
};

const fetchCourts = async () => {
  courts.value = await courtsStore.fetchCourts();
};

const createCourt = () => {
  // Redirect to /forms when the button is clicked
  router.push('/new-court');
};

const notification = computed(() => courtsStore.notification);

const dismissNotifications = () => {
  configStore.resetNotification();
};

// Watch changes in the notification and perform actions accordingly
// You might want to customize this based on your notification handling logic
watch(notification, (newNotification) => {
  if (newNotification) {
    
  }
});
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
        <BaseButton :icon="mdiPlus" label="Create Court" color="primary" @click="createCourt" />

      </SectionTitleLineWithButton>
      <NotificationBar v-if="notification" :color="notification.type" @close="courtsStore.resetNotification()" :dismissCallback="dismissNotifications">
        <b>{{ notification.message }}</b>
      </NotificationBar>

      <CardBox class="mb-6" has-table>
        <TableCourts />
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