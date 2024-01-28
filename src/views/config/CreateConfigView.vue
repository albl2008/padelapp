<script setup>

import { reactive, ref, onMounted } from 'vue'
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
import { createConfig, getConfigById, updateConfig } from '@/api/config'
import router from '@/router'
import { useConfigStore } from '@/stores/config';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'


const configStore = useConfigStore();


const form = reactive({
  shiftDuration: undefined,
  shiftPrice: undefined,
  tolerance: undefined,
  firstShift: undefined,
  shiftsPerDay: undefined
})

const isEditMode = ref(false);

const submit = async () => {
  try {
    debugger
    const currentDate = new Date();

      // Set the hours, minutes, and seconds based on the given object
    currentDate.setUTCHours(form.firstShift.hours);
    currentDate.setUTCMinutes(form.firstShift.minutes);
    currentDate.setUTCSeconds(0);
    const config = {
      shiftDuration: form.shiftDuration,
      shiftPrice: form.shiftPrice,
      tolerance: form.tolerance,
      firstShift: currentDate,
      shiftsPerDay: form.shiftsPerDay
    }
    if (isEditMode.value) {
      // If in edit mode, update the config
      await updateConfig(router.currentRoute.value.params.idConfig, config);
      configStore.setNotification({ message: 'Configuracion actualizada correctamente', type: 'info' });

    } else {
      // If in create mode, create a new config
      await createConfig(config);
      configStore.setNotification({ message: 'Configuracion creada correctamente', type: 'success' });

      
    }
    router.push('/config');
  } catch (error) {
    console.error('Error creating config:', error);
    // Handle error if needed
  }
};

const backToConfig = () => {
  router.push('/config')
}


onMounted(async () => {
  // Check if an id parameter is present in the URL
  const configId = router.currentRoute.value.params.idConfig;
  if (configId) {
    isEditMode.value = true;

    // Fetch config details based on the id and populate the form
    try {
      const configDetails = await getConfigById(configId);
      const firstShift = new Date(configDetails.data.firstShift)
      
      const minutes = firstShift.getUTCMinutes()
      const hours = firstShift.getUTCHours()
      
      form.shiftDuration = configDetails.data.shiftDuration;
      form.shiftPrice = configDetails.data.shiftPrice;
      form.tolerance = configDetails.data.tolerance;
      form.firstShift = {hours:hours, minutes:minutes}
      form.shiftsPerDay = configDetails.data.shiftsPerDay;
      //form.inUse = configDetails.data.inUse;
    } catch (error) {
      console.error('Error fetching config details:', error);
      // Handle error if needed
    }
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
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" :title="isEditMode ? 'Editar Configuracion' : 'Crear Configuracion'" main>
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
        <FormField label="Duracion Turno" >
          <FormControl v-model="form.shiftDuration" type="number" />
        </FormField>

        <FormField label="Precio Turno">
          <FormControl v-model="form.shiftPrice"  type="number"/>
        </FormField>

        <FormField label="Turnos por dia">
          <FormControl v-model="form.shiftsPerDay" type="number"  />
        </FormField>

        <FormField label="Tolerancia">
          <FormControl v-model="form.tolerance" type="number" />
        </FormField>

        <FormField label="Primer Turno" >
          <VueDatePicker v-model="form.firstShift" time-picker :action-row="{ showNow: false, showPreview: false, showSelect: true}"></VueDatePicker>
        </FormField>
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
        
        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" :label="isEditMode ? 'Editar' : 'Crear'" />
            <BaseButton color="info" outline label="Volver" @click="backToConfig" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
