<script setup>
import { computed, ref, onMounted } from 'vue';
import { useClubStore } from '@/stores/club';
import { mdiEye, mdiTrashCan, mdiPencil } from '@mdi/js';
import CardBoxModal from '@/components/CardBoxModal.vue';
import TableCheckboxCell from '@/components/TableCheckboxCell.vue';
import BaseLevel from '@/components/BaseLevel.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import BaseButton from '@/components/BaseButton.vue';
import UserAvatar from '@/components/UserAvatar.vue';
import { deleteClub } from '@/api/club';
import DeleteConfirmation from '@/components/DeleteConfirmation.vue'
import router from '@/router';
 import NotificationBar from '@/components/NotificationBar.vue'
 import { useAuthStore } from '@/stores/auth';

const clubsStore = useClubStore();
const authStore = useAuthStore();

const items = computed(() => clubsStore.clubs);

const emit = defineEmits();

const clubIdToDelete = ref(null);
const clubDeleted = ref(false);
const club = ref(null);
const isDeleting = ref(false);
const deletionError = ref(null);
const notification = computed(() => clubsStore.notification);

const cancelDelete = () => {
    isModalDangerActive.value = false
}

const confirmDelete = async () => {
  isDeleting.value = true;
  try {
    // Perform the deletion
    await deleteClub(clubIdToDelete.value);
    emit('club-deleted', true);
    // Reset state and close the modal after successful deletion
    isModalDangerActive.value = false;
    isDeleting.value = false;
    clubIdToDelete.value = null;
    
    // Optionally, you can trigger a refresh or update the clubs list
    await clubsStore.fetchClubs();
    clubsStore.setNotification({ message: 'Club eliminado correctamente', type: 'danger' });
  } catch (error) {
    // Handle deletion error
    console.error('Error deleting club:', error);
    clubsStore.setNotification({ message: 'Error eliminando club' + error, type: 'danger' });
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

const clubToDelete = (club) => {
  clubIdToDelete.value = club.id;
  isModalDangerActive.value = true;
};

const clubToEdit = (club) => {
  club.value = club;
  router.push(`/edit-club/${club.id}`)
};

onMounted(async () => {
  await clubsStore.fetchClubs();
  const active = authStore.activeClub
  debugger
});



</script>

<template>
  <CardBoxModal v-model="isModalActive" title="Sample modal">
    <p>Lorem ipsum dolor sit amet <b>adipiscing elit</b></p>
    <p>This is sample modal</p>
  </CardBoxModal>

  <CardBoxModal v-model="isModalDangerActive" title="Eliminar Club">
    <DeleteConfirmation
      v-if="isModalDangerActive"
      v-model:isActive="isModalDangerActive"
      :itemIdToDelete="clubIdToDelete"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </CardBoxModal>

  <table>
  <thead>
    <tr>
      <th>Nombre</th>
      <th>Direccion</th>
      <th>Telefono</th>
      <th>Activo</th>
      <th>Cantidad de canchas</th>
      <th />
    </tr>
  </thead>
  <tbody>
    <tr v-for="club in itemsPaginated" :key="club.id">

      <td data-label="Name">
        {{ club.name }}
      </td>
      <td data-label="Address">
        {{ club.address }} 
      </td>
      <td data-label="Phone">
        {{ club.phone }}
      </td>
      <td data-label="Active">
        {{ authStore.activeClub === club.id ? 'Activo' : 'Inactivo' }}
      </td>
      <td data-label="Courts">
        {{ club.courtsQuantity }}
      </td>
      <td class="before:hidden lg:w-1 whitespace-nowrap">
        <!-- Adjust the buttons or actions based on your requirements -->
        <BaseButtons type="justify-start lg:justify-end" no-wrap>
          <BaseButton color="info" :icon="mdiPencil" small @click="clubToEdit(club)" />
          <BaseButton
            v-if="authStore.activeClub !== club.id"
            color="danger"
            :icon="mdiTrashCan"
            small
            @click="clubToDelete(club)"
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
