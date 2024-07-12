<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import { useAddonStore } from '@/stores/addons';
import { mdiPlus, mdiTrashCan, mdiPencil } from '@mdi/js';
import BaseLevel from '@/components/BaseLevel.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import BaseButton from '@/components/BaseButton.vue';
import { deleteAddon, getAllAddons } from '@/api/addons';
import DeleteConfirmation from '@/components/DeleteConfirmation.vue'
import PillTag from '@/components/PillTag.vue';

const addonsStore = useAddonStore();

const items = computed(() => addonsStore.addons);

const emit = defineEmits();


const props = defineProps({
  reload: {
    type: Boolean,
    default: false
  },
  addonsForEdit: {
    type: Array,
    default: () => []
  }
})


const addonsForShift = ref([]);

const addonIdToDelete = ref(null);
const addonDeleted = ref(false);
const addonsArray = ref([]);
const isDeleting = ref(false);
const deletionError = ref(null);
const notification = computed(() => addonsStore.notification);

const cancelDelete = () => {
    isModalDangerActive.value = false
}

const confirmDelete = async () => {
  isDeleting.value = true;
  try {
    // Perform the deletion
    await deleteAddon(addonIdToDelete.value);
    emit('addon-deleted', true);
    // Reset state and close the modal after successful deletion
    isModalDangerActive.value = false;
    isDeleting.value = false;
    addonIdToDelete.value = null;
    
    // Optionally, you can trigger a refresh or update the addons list
    await getAddons();
    addonsStore.setNotification({ message: 'Extra eliminado correctamente', type: 'danger' });
  } catch (error) {
    // Handle deletion error
    console.error('Error deleting addon:', error);
    deletionError.value = 'An error occurred while deleting the addon.';
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
    addonsStore.fetchAddon();
  }
});

  return pagesList;
});



const addonToDelete = (addon) => {
  addonIdToDelete.value = addon.id;
  isModalDangerActive.value = true;
};

const addonToEdit = (addon) => {
  debugger
  addon.value = addon;
  emit('update-addon', addon.id);
};



const getAddons = async () => {
  addonsArray.value = []
  const response =await getAllAddons();
  addonsArray.value = response.data.results
}


const addToShift = (addon) => {
  
  if (!addonsForShift.value.includes(addon)) {
    addonsForShift.value.push(addon);
  }
}


const emitAddons = (addons) => {
  debugger
  emit('addons-for-shift', addons)
}


const spliceAddon = (addon) => {
  addonsForShift.value.splice(addonsForShift.value.indexOf(addon), 1)
}

onMounted(async () => {
  
  await getAddons()

});

watch (props , async () => {
  if (props.reload) {
    await getAddons()
  }
  if (props.addonsForEdit) {
    addonsForShift.value = props.addonsForEdit
  }
})
</script>

<template>
  

  <CardBoxModal v-model="isModalDangerActive" title="Eliminar extra">
    <DeleteConfirmation
      v-if="isModalDangerActive"
      v-model:isActive="isModalDangerActive"
      :itemIdToDelete="addonIdToDelete"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </CardBoxModal>

  <table>
  <thead>
    <tr>
      <th>Precio</th>
      <th>Descripcion</th>
      <th>Unidad</th>
      <th>Tipo</th>
      <th />
    </tr>
  </thead>
  <tbody>
    <tr v-for="addon in addonsArray" :key="addon.id">

     
      <td data-label="Price">
        <div class="lg:ml-4">
          <div class="font-bold">{{ addon.price }}</div>
        </div>
      </td>
      <td data-label="Description">
        {{ addon.description }}
      </td>
      <td data-label="Unit">
        {{ addon.unit ? '$/unidad' : '$/turno' }}
      </td>
      <td data-label="Type">
        {{ addon.type ? 'Alquiler' : 'Venta' }}
      </td>
      <td class="before:hidden lg:w-1 whitespace-nowrap">
        <!-- Adjust the buttons or actions based on your requirements -->
        <BaseButtons type="justify-start lg:justify-end" no-wrap>
          <BaseButton color="success" :icon="mdiPlus" small @click="addToShift(addon)"/>
          <BaseButton color="info" :icon="mdiPencil" small @click="addonToEdit(addon)" />
          <BaseButton
            color="danger"
            :icon="mdiTrashCan"
            small
            @click="addonToDelete(addon) "
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

  <CardBox  title="Sample modal">
    <p class="p-2">Agregar al turno:</p>
    <div v-if="addonsForShift.length > 0" class="flex">
      
    <div v-for="addon in addonsForShift" :key="addon" class="p-2">
      <PillTag :label="addon.description" color="success" @click="spliceAddon(addon)" />
    </div>
  </div>
    <BaseButtons class="p-2">
      <BaseButton v-if="addonsForShift.length > 0" label="Quitar" color="danger" outline @click="addonsForShift = []" />
      <BaseButton label="Confirmar" color="success" @click="emitAddons(addonsForShift)" />
    </BaseButtons>
  
  </CardBox>

</template>


