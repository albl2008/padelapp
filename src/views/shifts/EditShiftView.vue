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
import { getShiftById, updateShift, bookShift } from '@/api/shifts'
import router from '@/router'
import { useShiftsStore } from '@/stores/shifts';
import { useCourtsStore } from '@/stores/courts'
import { config } from '@fullcalendar/core/internal'
import { useConfigStore } from '@/stores/config'
import { getCourtById } from '@/api/courts'



const shiftsStore = useShiftsStore();
const configStore = useConfigStore();
const courtsStore = useCourtsStore();

const courtId = ref(null);
const start = ref(null);


const form = reactive({
  date: '',
  start: '',
  end: '',
  duration: '',
  tolerance: '',
  court: '',
  client:'',
  price: '',
  fixShift: false
})

const isEditMode = ref(false);


const submit = async () => {
  debugger
  try {
    const shift = {
      fixed: form.fixShift,
      client: form.client,
      price: form.price,
      court: courtId.value,
      start: start.value,
    }
    if (isEditMode.value) {
      // If in edit mode, update the court
      debugger
      await bookShift(router.currentRoute.value.params.idShift, shift);
      shiftsStore.setNotification({ message: 'Turno asginado correctamente', type: 'info' });

    } else {
      console.log('No hay id de turno')
      // If in create mode, create a new court
    //   await createCourt(court);
    //   courtsStore.setNotification({ message: 'Cancha creada correctamente', type: 'success' });
    }
    router.push('/calendar');
  } catch (error) {
    console.error('Error updating shift:', error);
    // Handle error if needed
  }
};

const backToCalendar = () => {
  router.push('/calendar')
}

function courtsOptions(){
  const courts = courtsStore.courts

  const courtsNumbers = courtsStore.courts.map(court => court.number)
  
  return courtsNumbers
}


onMounted(async () => {
  // Check if an id parameter is present in the URL
  const shiftId = router.currentRoute.value.params.idShift;
  await configStore.fetchConfig();
  
  if (shiftId && configStore.config[0]) {
    isEditMode.value = true;

    // Fetch court details based on the id and populate the form
    try {
      const shift = await getShiftById(shiftId);
      courtId.value = shift.data.court.id
      start.value = shift.data.start
      form.date = new Date(shift.data.date).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit', timeZone: 'UTC' });
      form.start = new Date(shift.data.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',  timeZone: 'UTC'}) 
      form.end = new Date(shift.data.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',  timeZone: 'UTC'})
      form.tolerance = shift.data.tolerance ? shift.data.tolerance + ' min' : configStore.config[0].tolerance + ' min'
      form.price = shift.data.price ? shift.data.price : configStore.config[0].shiftPrice
      form.court = shift.data.court.number
      form.fixShift = shift.data.fixed
      form.client = shift.data.client ? shift.data.client : ''
    } catch (error) {
      console.error('Error fetching shift details:', error);
      // Handle error if needed
    }
  } else {
    isEditMode.value = false
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
      <SectionTitleLineWithButton :icon="mdiBallotOutline" :title="isEditMode ? 'Editar Turno' : 'Crear Turno'" main>
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
        <FormField label="Fecha">
          <FormControl v-model="form.date" :disabled="true" />
        </FormField>
        <FormField label="Inicio">
          <FormControl v-model="form.start"  :disabled="true" />
        </FormField>
        <FormField label="Fin">
          <FormControl v-model="form.end" :disabled="true" />
        </FormField>

        <FormField label="Tolerancia">
          <FormControl v-model="form.tolerance"  />
        </FormField>
        </div>
        <div class="w-2/3">
        <FormField label="Precio">
          <FormControl v-model="form.price" type="number"/>
        </FormField>

        <FormField label="Cliente">
          <FormControl v-model="form.client"  />
        </FormField>

        <FormField label="Fijo">
          <FormCheckRadioGroup
          v-model="form.fixShift"
          type="switch"
          name="fix-shift-switch"
          :options="{ outline: form.fixShift ? 'Si' : 'No' }"
        />
        </FormField>

        <FormField label="Cancha">
          <FormControl v-model="form.court" disabled="true" />
        </FormField>
        </div>
        <!-- <FormField label="Superficie">
          <FormCheckRadioGroup
            v-model="form.surface"
            name="superficie-radio"
            type="radio"
            :options="{ sintetico: 'Sintetico', cemento: 'Cemento' }"
          />
        </FormField> -->

        </div>  
        <BaseDivider />
        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" :label="isEditMode ? 'Editar' : 'Crear'" />
            <BaseButton color="info" outline label="Volver" @click="backToCalendar" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
