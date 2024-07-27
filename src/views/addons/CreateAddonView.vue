<script setup>

import { reactive, ref, onMounted, computed, watch } from 'vue'
import { mdiBallotOutline } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadioGroup from '@/components/FormCheckRadioGroup.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import { createAddon, updateAddon, getAllAddons, getAddonById } from '@/api/addons'
import { useAddonStore } from '@/stores/addons';
import NotificationBar from '@/components/NotificationBar.vue'
import router from '@/router'
import VueDatePicker from '@vuepic/vue-datepicker';
import Multiselect from 'vue-multiselect'
import '@vuepic/vue-datepicker/dist/main.css'
import 'vue-multiselect/dist/vue-multiselect.css'
import '@vuepic/vue-datepicker/dist/main.css'



const addonStore = useAddonStore();

const emit = defineEmits();

const props = defineProps({
  updateAddon: {
    type: String,
    default: null
  }
})



const updateId = computed(() => props.updateAddon);

const notification = computed(() => addonStore.notification);



const form = reactive({
  price: undefined,
  description: undefined,
  unit: false,
  type: false
})

const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

const durations = [ 1, 1.5, 2, 2.5, 3 ];

const dailyShifts = [ 1, 2, 3, 4, 5, 6, 7 ];

const toleranceTimes = [ 10,15,20 ];

const isEditMode = ref(false);

const submit = async () => {
  try {
    debugger
      // Set the hours, minutes, and seconds based on the given object
    
    const addon = {
      price: form.price,
      description: form.description,
      unit: form.unit,
      type: form.type
    }
    if (isEditMode.value) {
      // If in edit mode, update the addon
      await updateAddon(updateId.value, addon);
      addonStore.setNotification({ message: 'Extra actualizado correctamente', type: 'info' });

    } else {
      // If in create mode, create a new addon
      await createAddon(addon);
      addonStore.setNotification({ message: 'Extra creado correctamente', type: 'success' });

      
    }
    cleanForm();
    emit('submit',true)
    
  } catch (error) {
    addonStore.setNotification({ message: 'Error creando addonuracion:' + error, type: 'danger' });
    console.error('Error creating addon:', error);
    // Handle error if needed
  }
};


const cleanForm = () => {
  form.price = undefined
  form.description = undefined
  form.unit = false
  form.type = false
}

const backToAddon = () => {
  router.push('/addon')
}

const dismissNotifications = () => {
  addonStore.resetNotification();
};

const patchForm = async (id) => {
  const addon = await getAddonById(id);
  form.price = addon.data.price
  form.description = addon.data.description
  form.unit = addon.data.unit
  form.type = addon.data.type
}

onMounted(async () => {
  // Check if an id parameter is present in the URL
  
});

watch(updateId, () => {
  if (updateId.value) {
    isEditMode.value = true;
    patchForm(updateId.value);
  } else {
    isEditMode.value = false;
  }
});




// const formStatusWithHeader = ref(true)

// const formStatusCurrent = ref(0)

// const formStatusOptions = ['info', 'success', 'danger', 'warning']

// const formStatusSubmit = () => {
//   formStatusCurrent.value = formStatusOptions[formStatusCurrent.value + 1]
//     ? formStatusCurrent.value + 1
//     : 0
// }

  
</script>

<template>
 
    
      <SectionTitleLineWithButton :icon="mdiBallotOutline" :title="isEditMode ? 'Editar Extra' : 'Crear Extra'" main>
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
      

      <CardBox is-form @submit.prevent="submit">
        <div class="w-full flex grid md:grid-cols-2 grid-cols-1 place-items-center">


          <div class="w-2/3">

        <FormField label="Descripción">
          <FormControl v-model="form.description" required  type="text"/>
        </FormField>
        
        <FormField label="Precio">
          <FormControl v-model="form.price" required  type="number"/>
        </FormField>

        
      </div>
      <div class="w-2/3">

        <FormField label="Unidad">
          <FormCheckRadioGroup
          v-model="form.unit"
          type="switch"
          name="type-addon-switch"
          :options="{ outline: form.unit ? '$/un' : '$/turno' }"
        />
        </FormField>

        <FormField label="Tipo">
          <FormCheckRadioGroup
          v-model="form.type"
          type="switch"
          name="type-addon-switch"
          :options="{ outline: form.type ? 'Alquiler' : 'Venta' }"
        />
        </FormField>
        
      </div>
        </div>
        <BaseDivider />
        <!-- <FormField label="Duracion Turno">
          <FormCheckRadioGroup
            v-model="form.surface"
            name="superficie-radio"
            type="radio"
            :options="{ sintetico: 'Sintetico', cemento: 'Cemento' }"
          />
        </FormField> -->


        <!-- <FormField label="Paredes">
          <FormCheckRadioGroup
            v-model="form.walls"
            name="paredes-radio"
            type="radio"
            :options="{ blindex: 'Blindex', cemento: 'Cemento' }"
          />
        </FormField> -->
        
        <template #footer >
          <div class="flex justify-end">
            <BaseButtons>
            <BaseButton type="submit" color="info" :label="isEditMode ? 'Editar' : 'Crear'" />
            <BaseButton color="info" outline label="Volver" @click="backToAddon" />
          </BaseButtons>
          </div>
          
        </template>
        
      </CardBox>
    
 
</template>

<style scoped>

</style>