<script setup>
import { computed, ref } from 'vue';
import { useConfigStore } from '@/stores/config';
import { mdiEye, mdiTrashCan, mdiPencil } from '@mdi/js';
import CardBoxModal from '@/components/CardBoxModal.vue';
import TableCheckboxCell from '@/components/TableCheckboxCell.vue';
import BaseLevel from '@/components/BaseLevel.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import BaseButton from '@/components/BaseButton.vue';
import UserAvatar from '@/components/UserAvatar.vue';
import { deleteConfig } from '@/api/config';
import DeleteConfirmation from '@/components/DeleteConfirmation.vue'
import router from '@/router';
 import NotificationBar from '@/components/NotificationBar.vue'

const configsStore = useConfigStore();

const items = computed(() => configsStore.config);

const emit = defineEmits();

const configIdToDelete = ref(null);
const configDeleted = ref(false);
const config = ref(null);
const isDeleting = ref(false);
const deletionError = ref(null);
const notification = computed(() => configsStore.notification);

const cancelDelete = () => {
    isModalDangerActive.value = false
}

const confirmDelete = async () => {
  isDeleting.value = true;
  try {
    // Perform the deletion
    await deleteConfig(configIdToDelete.value);
    emit('config-deleted', true);
    // Reset state and close the modal after successful deletion
    isModalDangerActive.value = false;
    isDeleting.value = false;
    configIdToDelete.value = null;
    
    // Optionally, you can trigger a refresh or update the configs list
    await configsStore.fetchConfig();
    configsStore.setNotification({ message: 'Configuracion eliminada correctamente', type: 'danger' });
  } catch (error) {
    // Handle deletion error
    console.error('Error deleting config:', error);
    deletionError.value = 'An error occurred while deleting the config.';
    isDeleting.value = false;
  }
};


const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = ref(5);

const currentPage = ref(0);

const checkedRows = ref([]);

const itemsPaginated = computed(() =>
  items.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
);

const numPages = computed(() => Math.ceil(items.value.length / perPage.value));

const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }

  return pagesList;
});

const remove = (arr, cb) => {
  const newArr = [];

  arr.forEach((item) => {
    if (!cb(item)) {
      newArr.push(item);
    }
  });

  return newArr;
};

const configToDelete = (config) => {
  configIdToDelete.value = config.id;
  isModalDangerActive.value = true;
};

const configToEdit = (config) => {
  config.value = config;
  router.push(`/edit-config/${config.id}`)
};

const convertDays = (days) => {
  const daysOfWeek = ['D','L', 'M', 'M', 'J', 'V', 'S'];
  return days.map((day) => daysOfWeek[day]).join(', ');
};


const checked = (isChecked, config) => {
  if (isChecked) {
    checkedRows.value.push(config);
  } else {
    checkedRows.value = remove(checkedRows.value, (row) => row.id === config.id);
  }
};
</script>

<template>
  <CardBoxModal v-model="isModalActive" title="Sample modal">
    <p>Lorem ipsum dolor sit amet <b>adipiscing elit</b></p>
    <p>This is sample modal</p>
  </CardBoxModal>

  <CardBoxModal v-model="isModalDangerActive" title="Eliminar Configuracion">
    <DeleteConfirmation
      v-if="isModalDangerActive"
      v-model:isActive="isModalDangerActive"
      :itemIdToDelete="configIdToDelete"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </CardBoxModal>

  <table>
  <thead>
    <tr>
      <th>Cantidad de canchas</th>
      <th>Duracion (h)</th>
      <th>Precio $</th>
      <th>Tolerancia (min)</th>
      <th>Primer Turno</th>
      <th>Turnos por dia</th>
      <th>Dias operativos</th>
      <th />
    </tr>
  </thead>
  <tbody>
    <tr v-for="config in itemsPaginated" :key="config.id">

      <td data-label="Shift Duration">
        {{ config.courtsQuantity }}
      </td>
      <td data-label="Shift Duration">
        {{ config.shiftDuration }}
      </td>
      <td data-label="Shift Price">
        {{ config.shiftPrice }}
      </td>
      <td data-label="Tolerance">
        {{ config.tolerance }}
      </td>
      <td data-label="First Shift">
        {{ new Date(config.firstShift).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',  timeZone: 'UTC'}) }}
      </td>
      <td data-label="Shifts per day">
        {{ config.shiftsPerDay }}
      </td>
      <td data-label="Working Days">
        {{ convertDays(config.operativeDays) }}
      </td>
      <td class="before:hidden lg:w-1 whitespace-nowrap">
        <!-- Adjust the buttons or actions based on your requirements -->
        <BaseButtons type="justify-start lg:justify-end" no-wrap>
          <BaseButton color="info" :icon="mdiPencil" small @click="configToEdit(config)" />
          <BaseButton
            color="danger"
            :icon="mdiTrashCan"
            small
            @click="configToDelete(config) "
          />
        </BaseButtons>
      </td>
    </tr>
  </tbody>
</table>

  <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
    <BaseLevel>
      <BaseButtons>
        <BaseButton
          v-for="page in pagesList"
          :key="page"
          :active="page === currentPage"
          :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="currentPage = page"
        />
      </BaseButtons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </BaseLevel>
  </div>
</template>
