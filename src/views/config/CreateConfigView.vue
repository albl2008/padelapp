<script setup>

import { reactive, ref, onMounted, computed } from 'vue'
import { mdiBallotOutline, mdiTools } from '@mdi/js'
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
import { useConfigStore } from '@/stores/config';
import NotificationBar from '@/components/NotificationBar.vue'
import router from '@/router'
import VueDatePicker from '@vuepic/vue-datepicker';
import Multiselect from 'vue-multiselect'
import '@vuepic/vue-datepicker/dist/main.css'
import 'vue-multiselect/dist/vue-multiselect.css'
import '@vuepic/vue-datepicker/dist/main.css'
import { valid } from 'joi'
import { useClubStore } from '@/stores/club'
import { useNotificationStore } from '@/stores/notifications'
import { getAllShifts } from '@/api/shifts'



const configStore = useConfigStore();
const clubStore = useClubStore();
const notificationStore = useNotificationStore();
const colorEdit = ref('info')

const notification = computed(() => configStore.notification);



const form = reactive({
  shiftDuration: undefined,
  shiftPrice: undefined,
  tolerance: undefined,
  firstShift: undefined,
  shiftsPerDay: undefined,
  workingDays: undefined,
  courtsQuantity: undefined
})

const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

const durations = [ 1, 1.5, 2, 2.5, 3 ];

const dailyShifts = [ 1, 2, 3, 4, 5, 6, 7 ];

const toleranceTimes = [ 10,15,20 ];

const isEditMode = ref(false);

const submit = async () => {
  try {
    debugger
    const formValidation = validateForm(form);
    if (!formValidation) {
      return;
    }



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
      shiftsPerDay: form.shiftsPerDay,
      operativeDays: convertDays(form.workingDays),
      courtsQuantity: form.courtsQuantity
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
    notificationStore.getNotifications();
    

  } catch (error) {
    configStore.setNotification({ message: 'Error creando configuracion:' + error, type: 'danger' });
    console.error('Error creating config:', error);
    // Handle error if needed
  }
};

const backToConfig = () => {
  router.push('/config')
}

const dismissNotifications = () => {
  configStore.resetNotification();
};

const convertDays = (selectedDays) => {
  const realDays = Array.isArray(selectedDays) ? selectedDays : Object.values(selectedDays); // Handle both array and object cases
  debugger;
  console.log(realDays);
  return Object.values(selectedDays).map(day => days.indexOf(day));
}

onMounted(async () => {
  //get activeClub

  const activeClub = await clubStore.getActiveClub();

  if (!activeClub) {
    configStore.setNotification({ message: 'No hay club activo. Debe asignar un club', type: 'danger' });
  } else {
    form.courtsQuantity = activeClub.courtsQuantity;
  }

  // Check if an id parameter is present in the URL
  const configId = router.currentRoute.value.params.idConfig;
  debugger
  if (configId) {
    isEditMode.value = true;
    const shifts = await getAllShifts();
    if (shifts.data.results.length > 0) {
      configStore.setNotification({ message: 'Se eliminaran los turnos cuando edite la configuracion', type: 'warning' });
      colorEdit.value = 'warning';
    }

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
      form.workingDays = configDetails.data.operativeDays.map(dayIndex => days[dayIndex]);
      form.courtsQuantity = activeClub.courtsQuantity;
      //form.inUse = configDetails.data.inUse;
    } catch (error) {
      console.error('Error fetching config details:', error);
      // Handle error if needed
    }
  }
});

const validateForm = (form) => {
  let isValid = { field: '', message: '' };
  let validations = []

  if (!form.shiftDuration) {
    isValid.field = 'shiftDuration';
    isValid.message = 'La duración del turno es requerida';
    validations.push(isValid)
  }
  if (!form.shiftPrice) {
    isValid.field = 'shiftPrice';
    isValid.message = 'El precio del turno es requerido';
    validations.push(isValid)
  }
  if (!form.shiftsPerDay) {
    isValid.field = 'shiftsPerDay';
    isValid.message = 'La cantidad de turnos por dia es requerida';
    validations.push(isValid)
  }
  if (!form.tolerance) {
    isValid.field = 'tolerance';
    isValid.message = 'La tolerancia es requerida';
    validations.push(isValid)
  }
  if (!form.workingDays) {
    isValid.field = 'workingDays';
    isValid.message = 'Los dias de trabajo son requeridos';
    validations.push(isValid)
  }
  if (!form.courtsQuantity) {
    isValid.field = 'courtsQuantity';
    isValid.message = 'La cantidad de canchas es requerida';
    validations.push(isValid)
  }

  if (!form.firstShift) {
    isValid.field = 'firstShift';
    isValid.message = 'La hora de inicio es requerida';
    validations.push(isValid)
  }

  if (validations.length > 0) {
    if (validations.length > 3){
      configStore.setNotification({ message: 'Hay campos requeridos en el formulario', type: 'danger' });
    } else {
      configStore.setNotification({ message: validations[0].message, type: 'danger' });
    }
    return false
  }
  return true
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
      <SectionTitleLineWithButton :icon="mdiTools" :title="isEditMode ? 'Editar Configuracion' : 'Crear Configuracion'" main>
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
      <NotificationBar v-if="notification" :color="notification.type" @close="configStore.resetNotification()" :dismissCallback="dismissNotifications">
        <b>{{ notification.message }}</b>
      </NotificationBar>

      <CardBox is-form @submit.prevent="submit">
        <div class="w-full flex grid md:grid-cols-2 grid-cols-1 place-items-center">


          <div class="w-2/3">
        <FormField label="Duracion">
          
              <multiselect v-model="form.shiftDuration" :options="durations" :multiple="false" :close-on-select="true" :clear-on-select="false" :preserve-search="true" placeholder="(horas)">
              </multiselect>
          
        </FormField>

        <FormField label="Precio Turno">
          <FormControl v-model="form.shiftPrice"  type="number"/>
        </FormField>

        <FormField label="Cantidad de canchas">
          <FormControl v-model="form.courtsQuantity" disabled  type="number"/>
        </FormField>

        
        <FormField label="Turnos por dia">
          
          <multiselect v-model="form.shiftsPerDay" :options="dailyShifts" :multiple="false" :close-on-select="true" :clear-on-select="false" :preserve-search="true" placeholder="Turnos por dia">
          </multiselect>
      
        </FormField>
      </div>
      <div class="w-2/3">

        <FormField label="Tolerancia">
          
          <multiselect v-model="form.tolerance" :options="toleranceTimes" :multiple="false" :close-on-select="true" :clear-on-select="false" :preserve-search="true" placeholder="(minutos)">
          </multiselect>
      
        </FormField>
        <FormField label="Primer Turno" >
          <VueDatePicker v-model="form.firstShift" time-picker :action-row="{ showNow: false, showPreview: false, showSelect: true}" dark></VueDatePicker>
        </FormField>
        <FormField label="Dias operativos">
          <div class="bg-slate-800">
              <multiselect v-model="form.workingDays" :options="days" :multiple="true" :close-on-select="false" :clear-on-select="false" :preserve-search="true" placeholder="(dias)">
              </multiselect>
          </div>
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
            <BaseButton type="submit" :color="colorEdit" outline :label="isEditMode ? 'Editar' : 'Crear'" />
            <BaseButton color="info" outline label="Volver" @click="backToConfig" />
          </BaseButtons>
          </div>
          
        </template>
        
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<style scoped>
.custom-multiselect {
  --multiselect-bg: #1e293b !important;
  --multiselect-border-color: #334155 !important;
  --multiselect-text-color: white !important;
}

:deep(.multiselect__option), 
:deep(.multiselect__tags),
:deep(.multiselect__single), 
:deep(.multiselect__input) {
  background-color: var(--multiselect-bg) !important;
  border-color: var(--multiselect-border-color) !important;
}

:deep(.multiselect__option),
:deep(.multiselect__tags) {
  color:white !important;
  border-color: #334155 !important;
}


:deep(.multiselect--active .multiselect__select),
:deep(.multiselect--active .multiselect__single), 
:deep(.multiselect--active .multiselect__input) {
  border-color: #334155 !important; /* Change the border color when active */
  box-shadow: 0 0 0 1px #334155 !important; /* Remove blue outline and add custom color */
}


:deep(.multiselect__content-wrapper) {
  background-color: #334155;
  color: white;
}

:deep(.multiselect__select) {
  background-color: #334155;
  color: white;
  border: none; /* Remove border to blend it with the background */
}

:deep(.multiselect__option) {
  background-color: #334155;
  color: white;
}


:deep(.multiselect__tag) {
  background-color: #334155;
  color: white;
}

:deep(.multiselect__option--highlight){
  background-color: #64748b !important; /* Highlight color */
}

:deep(.multiselect__option--selected){
  background-color: #334155 !important; /* Selected color */
}

:deep(.multiselect__option:hover) {
  background-color: #64748b !important; /* Hover color */
}

:deep(.dp__theme_dark) {
  --dp-background-color: #1e293b;
  --dp-text-color: #ffffff;
  --dp-hover-color: #334155;
  --dp-hover-text-color: #ffffff;
  --dp-hover-icon-color: #a0aec0;
  --dp-primary-color: #005cb2;
  --dp-primary-disabled-color: #61a8ea;
  --dp-primary-text-color: #a9a9a9;
  --dp-secondary-color: #a9a9a9;
  --dp-border-color: #334155;
  --dp-menu-border-color: #2d2d2d;
  --dp-border-color-hover: #aaaeb7;
  --dp-disabled-color: #737373;
  --dp-disabled-color-text: #d0d0d0;
  --dp-scroll-bar-background: #1e293b;
  --dp-scroll-bar-color: #334155;
  --dp-success-color: #00701a;
  --dp-success-color-disabled: #428f59;
  --dp-icon-color: #a0aec0;
  --dp-danger-color: #e53935;
  --dp-marker-color: #e53935;
  --dp-tooltip-color: #3e3e3e;
  --dp-highlight-color: rgba(0, 92, 178, 0.2);
  --dp-range-between-dates-background-color: var(--dp-hover-color, #334155);
  --dp-range-between-dates-text-color: var(--dp-hover-text-color, #ffffff);
  --dp-range-between-border-color: var(--dp-hover-color, #ffffff);
}

:deep(.dp__theme_dark .dp__pointer),
:deep(.dp__theme_dark .dp__icon),
:deep(.dp__theme_dark .dp__button),
:deep(.dp__theme_dark .dp__button:hover),
:deep(.dp__theme_dark .dp__button_bottom),
:deep(.dp__theme_dark .dp__flex),
:deep(.dp__theme_dark .dp__btn),
:deep(.dp__theme_dark .dp__main),
:deep(.dp__theme_dark .dp__relative),
:deep(.dp__theme_dark .dp--highlighted),
:deep(.dp__theme_dark .dp--arrow-btn-nav) {
  background-color: var(--dp-background-color) !important;
  color: var(--dp-text-color) !important;
  border-color: var(--dp-border-color) !important;
}

:deep(.dp__theme_dark .dp__input) {
  padding-left: 50px;
  height: 45px !important;
}

:deep(.dp__theme_dark .dp__icon) {
  color: var(--dp-icon-color) !important;
  border-left : 1px solid var(--dp-border-color) !important;
  border-right: 1px solid var(--dp-border-color) !important;
}

:deep(.dp__theme_dark .dp__button:hover) {
  background-color: var(--dp-hover-color) !important;
  color: var(--dp-hover-icon-color) !important;
}

:deep(.dp__theme_dark .dp__highlighted),
:deep(.dp__theme_dark .dp--highlighted) {
  background-color: var(--dp-highlight-color) !important;
}
</style>