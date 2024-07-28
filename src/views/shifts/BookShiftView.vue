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
import PillTag from '@/components/PillTag.vue'
import UpdateConfirmation from '@/components/UpdateConfirmation.vue'
import CardBoxModal from '@/components/CardBoxModal.vue'



const shiftsStore = useShiftsStore();
const configStore = useConfigStore();
const courtsStore = useCourtsStore();


const shiftStatus = ref(null);
const completeShift = ref(null);
const totalPriceAddons = ref(0);

const form = reactive({
  date: '',
  start: '',
  end: '',
  duration: '',
  tolerance: '',
  court: '',
  client:'',
  price: ''
})

const isEditMode = ref(false);

const idShift = router.currentRoute.value.params.idShift;
const isCancellingShift = ref(false);

const submit = async () => {
  try {
    const shift = {
      court: form.court.id,
      client: form.client,
      price: form.price
    }
    if (isEditMode.value) {
      // If in edit mode, update the court
      await bookShift(router.currentRoute.value.params.idShift, shift);
      shiftsStore.setNotification({ message: 'Turno asginado correctamente', type: 'info' });

    } else {
      // If in create mode, create a new court
      await createCourt(court);
      courtsStore.setNotification({ message: 'Cancha creada correctamente', type: 'success' });
    }
    router.push('/dashboard');
  } catch (error) {
    console.error('Error updating shift:', error);
    // Handle error if needed
  }
};

const backToCalendar = () => {
  router.push('/dashboard')
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
      completeShift.value = shift.data
      if (completeShift.value.addons && completeShift.value.addons.length > 0) {
        totalPriceAddons.value = calculateTotal(completeShift.value.addons)
      }
      console.log(shift)
      shiftStatus.value = shift.data.status
      form.date = new Date(shift.data.date).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit', timeZone: 'UTC' });
      form.start = new Date(shift.data.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',  timeZone: 'UTC'}) 
      form.end = new Date(shift.data.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',  timeZone: 'UTC'})
      form.tolerance = shift.data.tolerance ? shift.data.tolerance + ' min' : configStore.config[0].tolerance + ' min'
      form.price = totalPriceAddons.value ? totalPriceAddons.value + shift.data.price : shift.data.price ? shift.data.price : configStore.config[0].shiftPrice
      form.court = shift.data.court.number
      form.client = shift.data.client ? shift.data.client : ''
    } catch (error) {
      console.error('Error fetching shift details:', error);
      // Handle error if needed
    }
  }
});

const redirectToAddons = () => {
  router.push('/addons/' + idShift)
}

const calculateTotal = (addons) => {
  let total = 0
  addons.forEach(addon => {
    total += addon.price
  })
  form.price = total
  return total

}

const cancel = () => {
  isCancellingShift.value = true
}

const cancelModal = () => {
  isCancellingShift.value = false
}

const cancelShift = async () => {

  

  try {
    const body = {
      status: {
        id: 0,
        sta: 'available'
      },
      addons: [],
      client: null
      
    }
    await updateShift(idShift, body);
    shiftsStore.setNotification({ message: 'Turno cancelado correctamente', type: 'info' });
    router.push('/calendar')
  } catch (error) {
    console.error('Error canceling shift:', error);
  }
}


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
      <SectionTitleLineWithButton :icon="mdiBallotOutline" :title="isEditMode ? 'Agendar Turno' : 'Crear Turno'" main>
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

      <CardBoxModal v-model="isCancellingShift" title="Cancelar Turno">
        <UpdateConfirmation
            v-if="isCancellingShift"
            v-model:isActive="isCancellingShift"
            confirmation-message="Confirme la cancelacion del turno."
            @confirm="cancelShift($event)"
            @cancel="cancelModal"
          />
      </CardBoxModal>

      <CardBox is-form @submit.prevent="submit">
        <div class="w-full flex grid md:grid-cols-2 grid-cols-1 place-items-center">
          <div class="w-2/3">
        <FormField label="Fecha">
          <FormControl v-model="form.date" disabled />
        </FormField>
        <FormField label="Inicio">
          <FormControl v-model="form.start"  disabled />
        </FormField>
        <FormField label="Fin">
          <FormControl v-model="form.end" disabled />
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

        <FormField label="Cancha">
          <FormControl v-model="form.court" disabled/>
        </FormField>

        <div v-if="completeShift && completeShift.addons.length > 0" class="flex">
            <p class="w-1/3">Adicionales:</p>
            <div v-for="addon in completeShift.addons" :key="addon" class="ml-2" >
              <PillTag  type="info" :label="addon.description" />
            </div>
          </div>
          <div v-if="completeShift && completeShift.addons.length > 0" class="flex mt-4 ">
            <PillTag  type="success" :label="'$'+totalPriceAddons " />
          </div>

        <div v-if="shiftStatus && shiftStatus.id === 1" class="flex justify-end mt-4">
          
          <BaseButton  type="button" color="info" outline label="+Adicionales" @click="redirectToAddons" />
          
        </div>
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
          <div class="flex justify-between">
          
          <div>
          <BaseButtons>
            <BaseButton type="submit" color="info" outline :label="isEditMode ? shiftStatus.id === 1 ? 'Actualizar' : 'Reservar' : 'Crear'" />
            <BaseButton color="info" outline label="Volver" @click="backToCalendar" />
          </BaseButtons>
          </div>

          <div>
            <BaseButton v-if="shiftStatus && shiftStatus.id === 1" class="ml-2" type="button" color="danger" label="Cancelar" @click="cancel" />
          </div>
          </div>
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
