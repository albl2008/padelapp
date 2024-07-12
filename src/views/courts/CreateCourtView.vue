<script setup>

import { reactive, ref, onMounted, watch, computed } from 'vue'
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
import { createCourt, getAllCourts, getCourtById, updateCourt } from '@/api/courts'
import NotificationBar from '@/components/NotificationBar.vue'
import router from '@/router'
import { useCourtsStore } from '@/stores/courts';
import { getAllConfig } from '@/api/config'
import includes from 'lodash/includes'


import joi from 'joi'


const courtsStore = useCourtsStore();

const courts = ref([])

const config = ref([]);


const form = reactive({
  name: '',
  number: null,
  surface: '',
  walls: '',
})

const touchedFields = reactive({
  name: false,
  number: false,
  surface: false,
  walls: false
})


const schema = joi.object({
  name: joi.string().required(),
  number: joi.number().required(),
  surface: joi.string().valid('cemento').valid('sintetico').required(),
  walls: joi.string().valid('cemento').valid('blindex').required(),
});


const validateField = (field) => {
  debugger
  const { error } = schema.validate({ [field]: form[field] }, { abortEarly: false })
  return error ? error.details.some(detail => detail.context.key === field) : false
}

const isEditMode = ref(false);

const submit = async () => {
  debugger
  const { error } = schema.validate(form, { abortEarly: false })
  if (error) {
    console.log(error)
    Object.keys(touchedFields).forEach(field => {
      touchedFields[field] = true
    })
    Object.keys(form).forEach(field => {
      validateField(field)
    })
    courtsStore.setNotification({ message: error, type: 'danger' });
    return
  }

  try {
    const court = {
        name: form.name,
        number: form.number,
        surface: form.surface,
        walls: form.walls
    }
    if (isEditMode.value) {
      // If in edit mode, update the court
      await updateCourt(router.currentRoute.value.params.idCourt, court);
      courtsStore.setNotification({ message: 'Cancha actualizada correctamente', type: 'info' });

    } else {
      // If in create mode, create a new court
      await createCourt(court);
      courtsStore.setNotification({ message: 'Cancha creada correctamente', type: 'success' });

      
    }
    router.push('/courts');
  } catch (error) {
    console.error('Error creating court:', error);
    debugger
    courtsStore.setNotification({ message: 'Error al crear la cancha' + error.response.data.message, type: 'danger' });
    // Handle error if needed
  }
};

const backToCurts = () => {
  router.push('/courts')
}


onMounted(async () => {
  
  
  // Check if an id parameter is present in the URL
  const courtId = router.currentRoute.value.params.idCourt;
  if (courtId) {
    isEditMode.value = true;
    debugger

    // Fetch court details based on the id and populate the form
    try {
      const courtDetails = await getCourtById(courtId);
      form.name = courtDetails.data.name;
      form.number = courtDetails.data.number;
      form.surface = courtDetails.data.surface;
      form.walls = courtDetails.data.walls;
      //form.inUse = courtDetails.data.inUse;
    } catch (error) {
      console.error('Error fetching court details:', error);
      // Handle error if needed
    }
  } else {
    await getCourts()
    await getConfig()
    form.number = getCourtNumber(courts.value, config.value)
    form.name = 'C'+form.number
  }
  
  
});

const getCourts = async() => {
  const courtsData = await getAllCourts()
  courts.value = courtsData.data.results

}

const getConfig = async () => {
  const configData = await getAllConfig()
  config.value = configData.data.results[0]
}



const getCourtNumber = (courtsArray, configArray) => {
  debugger
  const actualNumbers = courtsArray.map(court => court.number)
  
  for (let i=0; i < configArray.courtsQuantity; i++) {
    debugger
    if (!includes(actualNumbers, i+1)) {
      return i+1
    }

  }



  
}


const notification = computed(() => courtsStore.notification);

const dismissNotifications = () => {
  courtsStore.resetNotification();
};


watch(form, (newForm) => {
  Object.keys(touchedFields).forEach(field => {
    if (newForm[field] !== '') {
      touchedFields[field] = true
    }
  })
}, { deep: true })

</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" :title="isEditMode ? 'Editar Cancha' : 'Crear Cancha'" main>
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
        <NotificationBar v-if="notification" :color="notification.type" @close="courtsStore.resetNotification()" :dismissCallback="dismissNotifications">
            <b>{{ notification.message }}</b>
        </NotificationBar>
        <div class="w-full flex grid md:grid-cols-2 grid-cols-1 place-items-center">
         
        <div class="w-2/3">

          <FormField label="Nombre">
            <FormControl 
              v-model="form.name" 
              :error="touchedFields.name && validateField('name')" 
              @blur="touchedFields.name = true" 
            />
          </FormField>
          <FormField label="Numero">
            <FormControl 
              v-model="form.number" 
              type="number" 
              :error="touchedFields.number && validateField('number')"
              :disabled="true"
              @blur="touchedFields.number = true" 
            />
          </FormField>

        </div>
        <div class="w-2/3 mt-4">
          <FormField label="Superficie">
  <FormCheckRadioGroup
    v-model="form.surface"
    name="superficie-radio"
    type="radio"
    :options="{ sintetico: 'Sintetico', cemento: 'Cemento' }"
    :class="{ 'border-red-500': touchedFields.surface && validateField('surface') }"
    :error="touchedFields.surface && validateField('surface')" 
    @change="touchedFields.surface = true"
  />
</FormField>


<FormField label="Paredes">
  <FormCheckRadioGroup
    v-model="form.walls"
    name="paredes-radio"
    type="radio"
    :options="{ blindex: 'Blindex', cemento: 'Cemento' }"
    :class="{ 'border-red-500': touchedFields.walls && validateField('walls') }"
    :error="touchedFields.surface && validateField('surface')" 
    @change="touchedFields.walls = true"
  />
</FormField>
        </div>

        

      </div>
        <BaseDivider />
        <template #footer>
          <div class="flex justify-end">
            <BaseButtons>
            <BaseButton type="submit" color="info" :label="isEditMode ? 'Editar' : 'Crear'" />
            <BaseButton color="info" outline label="Volver" @click="backToCurts" />
          </BaseButtons>
          </div>
          
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>


<style>
.error {
  border: 1px solid red;
}

.error-message {
  color: red;
}
</style>