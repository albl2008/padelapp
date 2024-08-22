<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import { useRequestStore } from '@/stores/requests';
import { mdiPlus, mdiTrashCan, mdiPencil, mdiCheck, mdiAccountArrowRight, mdiAccountPlus } from '@mdi/js';
import BaseLevel from '@/components/BaseLevel.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import BaseButton from '@/components/BaseButton.vue';
import { deleteRequest, getAllRequests, verify, sendInvitation } from '@/api/requests';
import DeleteConfirmation from '@/components/DeleteConfirmation.vue'
import PillTag from '@/components/PillTag.vue';

const requestsStore = useRequestStore();

const items = computed(() => requestsStore.requests);

const emit = defineEmits();




const requestsForShift = ref([]);

const requestIdToDelete = ref(null);
const requestDeleted = ref(false);
const requestsArray = ref([]);
const isDeleting = ref(false);
const deletionError = ref(null);
const notification = computed(() => requestsStore.notification);

const cancelDelete = () => {
    isModalDangerActive.value = false
}

const confirmDelete = async () => {
  isDeleting.value = true;
  try {
    // Perform the deletion
    await deleteRequest(requestIdToDelete.value);
    emit('request-deleted', true);
    // Reset state and close the modal after successful deletion
    isModalDangerActive.value = false;
    isDeleting.value = false;
    requestIdToDelete.value = null;
    
    // Optionally, you can trigger a refresh or update the requests list
    await getRequests();
    requestsStore.setNotification({ message: 'Extra eliminado correctamente', type: 'danger' });
  } catch (error) {
    // Handle deletion error
    console.error('Error deleting request:', error);
    deletionError.value = 'An error occurred while deleting the request.';
    isDeleting.value = false;
  }
};


const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = ref(5);

const currentPage = ref(0);



const itemsPaginated = computed(() =>
  items.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
);

const numPages = computed(() => Math.ceil(items.value.length / perPage.value));

const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }computed(() => {
  if (props.reload) {
    requestsStore.fetchRequest();
  }
});

  return pagesList;
});



const requestToDelete = (request) => {
  requestIdToDelete.value = request.id;
  isModalDangerActive.value = true;
};

const invite = async (request) => {
  debugger
  const idRequest = request.id
  await sendInvitation(idRequest);
  await getRequests()
  
  
};



const getRequests = async () => {
  requestsArray.value = []
  const response =await getAllRequests();
  requestsArray.value = response.data.results
}


const verifyClub = async (request) => {
  
  const idRequest = request.id
  const body = {
    verified: true
  }
  
  await verify(idRequest, body);
  await getRequests()
}







onMounted(async () => {
  
  await getRequests()

});

watch ( async () => {
  //if (props.reload) {
    //await getRequests()
  //}
  //if (props.requestsForEdit) {
   // requestsForShift.value = props.requestsForEdit
  //}
})
</script>

<template>
  

  <CardBoxModal v-model="isModalDangerActive" title="Eliminar extra">
    <DeleteConfirmation
      v-if="isModalDangerActive"
      v-model:isActive="isModalDangerActive"
      :itemIdToDelete="requestIdToDelete"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </CardBoxModal>

  <table>
  <thead>
    <tr>
      <th>Nombre</th>
      <th>Club</th>
      <th>Telefono</th>
      <th>Email</th>
      <th>Direccion</th>
      <th>N° Canchas</th>
      <th>Varias sucursales?</th>
      <th>Verificado</th>
      <th>Invitado</th>
      <th />
    </tr>
  </thead>
  <tbody>
    <tr v-for="request in requestsArray" :key="request.id">
      <td data-label="Nombre">
        {{ request.displayName }}
      </td>
     
      <td data-label="Club">
        {{ request.clubName }}
      </td>
      <td data-label="Telefono">
        {{ request.phone }}
      </td>
      <td data-label="Email">
        {{ request.email }}
      </td>
      <td data-label="Direccion">
        {{ request.address }}
      </td>
      <td data-label="N° Canchas">
        {{ request.courtsQuantity }}
      </td>
      <td data-label="Sucursales?">
        {{ request.moreLocations ? 'Si' : 'No' }}
      </td>
      <td data-label="Verificado">
        {{ request.verified ? 'Si' : 'No' }}
      </td>
      <td data-label="Invitado">
        {{ request.invited ? 'Si' : 'No' }}
      </td>
     
      <td class="before:hidden lg:w-1 whitespace-nowrap">
        <!-- Adjust the buttons or actions based on your requirements -->
        <BaseButtons type="justify-start lg:justify-end" no-wrap>
          <BaseButton v-if="request.verified" color="warning" :icon="mdiAccountPlus" small @click="invite(request)"/>
          <BaseButton v-if="!request.verified" color="success" :icon="mdiCheck" small @click="verifyClub(request)" />
          <!-- <BaseButton color="info" :icon="mdiPencil" small @click="requestToEdit(request)" /> -->
          <BaseButton
            color="danger"
            :icon="mdiTrashCan"
            small
            @click="requestToDelete(request) "
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


