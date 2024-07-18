<script setup>
import { mdiTableBorder, mdiTableOff, mdiGithub, mdiPlus } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import TableClubs from '@/views/clubs/TableClubs.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/BaseButton.vue'
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue'
import { onMounted, ref, computed, watch } from 'vue';
import { useClubStore } from '@/stores/club';

import router from '../../router/index'


const clubStore = useClubStore();

const club = ref([]);

onMounted(async () => {
  console.log('Component mounted!');
  await fetchClubs();
}); 

const handleClubDeleted = () => {
  console.log('Club deleted:');
  fetchClubs(); // Refresh the club after deletion
  clubStore.setNotification({ message: 'Cluburacion eliminada correctamente', type: 'danger' });
};

const fetchClubs = async () => {
  club.value = await clubStore.fetchClubs();
};

const createClub = () => {
  // Redirect to /forms when the button is clicked
  router.push('/new-club');
};

const notification = computed(() => clubStore.notification);

const dismissNotifications = () => {
  clubStore.resetNotification();
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
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="Club" main>
        <!-- <BaseButton
          href="https://github.com/justboil/admin-one-vue-tailwind"
          target="_blank"
          :icon="mdiGithub"
          label="Star on GitHub"
          color="contrast"
          rounded-full
          small
        /> -->
        <BaseButton :icon="mdiPlus" label="Create Club" color="primary" @click="createClub" />

      </SectionTitleLineWithButton>
      <NotificationBar v-if="notification" :color="notification.type" @close="clubStore.resetNotification()" :dismissCallback="dismissNotifications">
        <b>{{ notification.message }}</b>
      </NotificationBar>

      <CardBox class="mb-6" has-table>
        <TableClubs />
      </CardBox>

      <!-- <SectionTitleLineWithButton v-if="club.length === 0" :icon="mdiTableOff" title="Empty variation" />

      <NotificationBar v-if="club.length === 0" color="danger" :icon="mdiTableOff">
        <b>Empty table.</b> When there's nothing to show
      </NotificationBar> -->

      <!-- <CardBox>
        <CardBoxComponentEmpty />
      </CardBox> -->
    </SectionMain>
  </LayoutAuthenticated>
</template>

