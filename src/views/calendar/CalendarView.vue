  <script setup>
  import FullCalendar from '@fullcalendar/vue3'
  import dayGridPlugin from '@fullcalendar/daygrid'
  import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
  import SectionMain from '@/components/SectionMain.vue'
  import { ref, onMounted, watch } from 'vue';
  import { useConfigStore } from '@/stores/config';
  import CardBoxModal from '@/components/CardBoxModal.vue';
  import BaseButton from '@/components/BaseButton.vue';
  import BaseButtons from '@/components/BaseButtons.vue';
  import { createShiftsMonth } from '@/api/shifts'
import { useShiftsStore } from '@/stores/shifts';

  const configStore = useConfigStore()
  const shiftsStore = useShiftsStore()


  const emit = defineEmits();

  const isModalActive = ref(false);
  const event = ref(null)

  const calendarOptions = ref({
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    events: [
      { title: 'Meeting', start: new Date() }
    ],
    
    eventClick: handleEventClick
  });

  const displayShifts = () => {
  const shifts = shiftsStore.shifts;
  if (!shifts || shifts.length === 0) return [];
  
  const events = shifts.map((shift,index) => {
    let i = index % configStore.config[0].shiftsPerDay;
    return {
      title: `Turno ${i+1}`,
      start: shift.start,
      end: shift.end,
      // Add other properties as needed
    };
  });

  return events;
};

function handleEventClick(eventInfo) {
  // Handle the event click here
  console.log('Event clicked:', eventInfo);

 isModalActive.value = true
 event.value= eventInfo.event
}


  watch(() => configStore.getConfig(), (newConfig) => {
    if (newConfig) {
      calendarOptions.value.events = displayShifts()
    }
  });

  onMounted(() => {
    // Fetch config data when the component is mounted
    configStore.fetchConfig();
    shiftsStore.fetchShifts();
    if (shiftsStore.shifts.length > 0){
      displayShifts()
    }
  });

  const createShifts = async () => {
  try {
    const config = configStore.config[0];
    if (!config) {
      console.error('Config not available');
      return;
    }
    delete config.id
    delete config.shiftPrice
    delete config.tolerance

    // Make API call to create shifts on the backend
    await createShiftsMonth(config);

    console.log('Shifts created successfully');
    

  } catch (error) {
    console.error('Error creating shifts:', error);
  }
};
  </script>

  <template>
    <LayoutAuthenticated>
      <SectionMain>
        <h1>Turnos</h1>
        <BaseButtons>
            <BaseButton color="info" outline label="Crear Mes" @click="createShifts" />
        </BaseButtons>
        {{ configStore.config[0] }}
        <FullCalendar :options='calendarOptions' />

        <CardBoxModal v-model="isModalActive" title="Event Details">
          {{ event }}
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
          <BaseButton color="info" :icon="mdiPencil" @click="shiftToEdit(configStore.config[0])" />
          </BaseButtons>
        </CardBoxModal>
      </SectionMain>
    </LayoutAuthenticated>
  </template>
