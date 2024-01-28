<script setup>
import { mdiTableBorder, mdiTableOff, mdiGithub, mdiPlus } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import TableConfig from '@/views/config/TableConfig.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/BaseButton.vue'
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue'

import { onMounted, ref, computed, watch } from 'vue';
import { useConfigStore } from '@/stores/config';

import router from '../../router/index'


const configStore = useConfigStore();
const config = ref([]);

onMounted(async () => {
  console.log('Component mounted!');
  await fetchConfig();
}); 

const handleConfigDeleted = () => {
  console.log('Config deleted:');
  fetchConfig(); // Refresh the config after deletion
  configStore.setNotification({ message: 'Configuracion eliminada correctamente', type: 'danger' });
};

const fetchConfig = async () => {
  config.value = await configStore.fetchConfig();
};

const createConfig = () => {
  // Redirect to /forms when the button is clicked
  router.push('/new-config');
};

const notification = computed(() => configStore.notification);

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
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="Configuracion" main>
        <!-- <BaseButton
          href="https://github.com/justboil/admin-one-vue-tailwind"
          target="_blank"
          :icon="mdiGithub"
          label="Star on GitHub"
          color="contrast"
          rounded-full
          small
        /> -->
        <BaseButton v-if="!configStore.config.length > 0" :icon="mdiPlus" label="Create Config" color="primary" @click="createConfig" />

      </SectionTitleLineWithButton>
      <NotificationBar v-if="notification" :color="notification.type" @close="configStore.resetNotification()">
        <b>{{ notification.message }}</b>
      </NotificationBar>

      <CardBox class="mb-6" has-table>
        <TableConfig />
      </CardBox>

      <!-- <SectionTitleLineWithButton v-if="config.length === 0" :icon="mdiTableOff" title="Empty variation" />

      <NotificationBar v-if="config.length === 0" color="danger" :icon="mdiTableOff">
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