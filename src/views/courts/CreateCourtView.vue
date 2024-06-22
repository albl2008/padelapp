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
import { createCourt, getCourtById, updateCourt } from '@/api/courts'
import router from '@/router'
import { useCourtsStore } from '@/stores/courts';


const courtsStore = useCourtsStore();


const form = reactive({
  name: '',
  number: '',
  surface: '',
  walls: '',
  inUse: false
})

const isEditMode = ref(false);

const submit = async () => {
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
        <div class="w-full flex grid md:grid-cols-2 grid-cols-1 place-items-center">

        <div class="w-2/3">

          <FormField label="Nombre">
          <FormControl v-model="form.name"  />
        </FormField>

        <FormField label="Numero">
          <FormControl v-model="form.number" type="number"/>
        </FormField>
        </div>
        <div class="w-2/3 mt-4">
          <FormField label="Superficie">
          <FormCheckRadioGroup
            v-model="form.surface"
            name="superficie-radio"
            type="radio"
            :options="{ sintetico: 'Sintetico', cemento: 'Cemento' }"
          />
        </FormField>


        <FormField label="Paredes">
          <FormCheckRadioGroup
            v-model="form.walls"
            name="paredes-radio"
            type="radio"
            :options="{ blindex: 'Blindex', cemento: 'Cemento' }"
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
