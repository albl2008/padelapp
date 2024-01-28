<script setup>
import { computed, ref } from 'vue';
import { useCourtsStore } from '@/stores/courts';
import { mdiEye, mdiTrashCan, mdiPencil } from '@mdi/js';
import CardBoxModal from '@/components/CardBoxModal.vue';
import TableCheckboxCell from '@/components/TableCheckboxCell.vue';
import BaseLevel from '@/components/BaseLevel.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import BaseButton from '@/components/BaseButton.vue';
import UserAvatar from '@/components/UserAvatar.vue';
import { deleteCourt } from '@/api/courts';
import DeleteConfirmation from '@/components/DeleteConfirmation.vue'
import router from '@/router';

const courtsStore = useCourtsStore();

const items = computed(() => courtsStore.courts);

const emit = defineEmits();

const courtIdToDelete = ref(null);
const courtDeleted = ref(false);
const court = ref(null);
const isDeleting = ref(false);
const deletionError = ref(null);

const cancelDelete = () => {
    isModalDangerActive.value = false
}

const confirmDelete = async () => {
  isDeleting.value = true;
  try {
    // Perform the deletion
    await deleteCourt(courtIdToDelete.value);
    emit('court-deleted', true);
    // Reset state and close the modal after successful deletion
    isModalDangerActive.value = false;
    isDeleting.value = false;
    courtIdToDelete.value = null;
    
    // Optionally, you can trigger a refresh or update the courts list
    await courtsStore.fetchCourts();
    courtsStore.setNotification({ message: 'Cancha eliminada correctamente', type: 'danger' });
  } catch (error) {
    // Handle deletion error
    console.error('Error deleting court:', error);
    deletionError.value = 'An error occurred while deleting the court.';
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

const courtToDelete = (court) => {
  courtIdToDelete.value = court.id;
  isModalDangerActive.value = true;
};

const courtToEdit = (court) => {
  court.value = court;
  router.push(`/edit-court/${court.id}`)
};


const checked = (isChecked, court) => {
  if (isChecked) {
    checkedRows.value.push(court);
  } else {
    checkedRows.value = remove(checkedRows.value, (row) => row.id === court.id);
  }
};
</script>

<template>
  <CardBoxModal v-model="isModalActive" title="Sample modal">
    <p>Lorem ipsum dolor sit amet <b>adipiscing elit</b></p>
    <p>This is sample modal</p>
  </CardBoxModal>

  <CardBoxModal v-model="isModalDangerActive" title="Eliminar Cancha">
    <DeleteConfirmation
      v-if="isModalDangerActive"
      v-model:isActive="isModalDangerActive"
      :itemIdToDelete="courtIdToDelete"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </CardBoxModal>

  <table>
  <thead>
    <tr>
     
      <th>Name</th>
      <th>Number</th>
      <th>Surface</th>
      <th>Walls</th>
      <th>In Use</th>
      <th />
    </tr>
  </thead>
  <tbody>
    <tr v-for="court in itemsPaginated" :key="court.id">
      
      <td data-label="Name">
        {{ court.name }}
      </td>
      <td data-label="Number">
        {{ court.number }}
      </td>
      <td data-label="Surface">
        {{ court.surface }}
      </td>
      <td data-label="Walls">
        {{ court.walls }}
      </td>
      <td data-label="In Use">
        {{ court.inUse }}
      </td>
      <td class="before:hidden lg:w-1 whitespace-nowrap">
        <!-- Adjust the buttons or actions based on your requirements -->
        <BaseButtons type="justify-start lg:justify-end" no-wrap>
          <BaseButton color="info" :icon="mdiPencil" small @click="courtToEdit(court)" />
          <BaseButton
            color="danger"
            :icon="mdiTrashCan"
            small
            @click="courtToDelete(court) "
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
