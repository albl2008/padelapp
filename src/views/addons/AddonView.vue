<script setup>
import { mdiTableBorder, mdiTableOff, mdiGithub, mdiPlus } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import TableAddon from '@/views/addons/TableAddon.vue'
import CreateAddonView from './CreateAddonView.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/BaseButton.vue'
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue'
import { onMounted, ref, computed, watch } from 'vue';
import { useAddonStore } from '@/stores/addons';
import router from '@/router'
import { getShiftById, updateShift } from '@/api/shifts'




const addonStore = useAddonStore();

const addon = ref([]);
const addonsToEdit = ref([]);
const reload = ref(false);
const addonId = ref(null);

onMounted(async () => {
  console.log('Component mounted!');
  const idShift = router.currentRoute.value.params.idShift;

  if (idShift) {
    const completeShift = await getShiftById(idShift);

    if (completeShift.data) {
      debugger
      setAddons(completeShift.data.addons)
    }
  }

}); 


const setAddons = (addons) => {
  addonsToEdit.value = addons
}

const handleAddonDeleted = () => {
  console.log('Addon deleted:');
  fetchAddon(); // Refresh the addon after deletion
  addonStore.setNotification({ message: 'Addonuracion eliminada correctamente', type: 'danger' });
};

const fetchAddon = async () => {
  addon.value = await addonStore.fetchAddon();
};


const notification = computed(() => addonStore.notification);

const dismissNotifications = () => {
  addonStore.resetNotification();
};


// Watch changes in the notification and perform actions accordingly
// You might want to customize this based on your notification handling logic
watch(notification, (newNotification) => {
  if (newNotification) {
    
  }
});

const getAddons = () => {
    debugger
    reload.value = true
};

const sendIdAddon = (id) => {
  debugger
  addonId.value = id
}

const addonsForShift = async (addons) => {
  debugger
  addons
  const idShift = router.currentRoute.value.params.idShift;

  if (idShift) {
    let body = {
      addons: []
    }
    if (addons.length > 0) {
      body.addons = addons.map((addon) => addon.id)
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
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="Extras" main>
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
      <NotificationBar v-if="notification" :color="notification.type" @close="addonStore.resetNotification()" :dismissCallback="dismissNotifications">
        <b>{{ notification.message }}</b>
      </NotificationBar>

      <CardBox class="mb-6" has-table>
        <TableAddon :reload="reload" :addonsForEdit="addonsToEdit" @update-addon="sendIdAddon($event)" @addons-for-shift="addonsForShift($event)"/>
      </CardBox>

      <CardBox class="mb-6" has-form @submit.prevent>
        <CreateAddonView @submit="getAddons" :updateAddon="addonId"  />
      </CardBox>

     

      <!-- <SectionTitleLineWithButton v-if="addon.length === 0" :icon="mdiTableOff" title="Empty variation" />

      <NotificationBar v-if="addon.length === 0" color="danger" :icon="mdiTableOff">
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