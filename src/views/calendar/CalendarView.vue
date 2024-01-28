  <script setup>
  import FullCalendar from '@fullcalendar/vue3'
  import dayGridPlugin from '@fullcalendar/daygrid'
  import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
  import NotificationBar from '@/components/NotificationBar.vue'
  import SectionMain from '@/components/SectionMain.vue'
  import { ref, onMounted, watch, computed } from 'vue';
  import { useConfigStore } from '@/stores/config';
  import CardBoxModal from '@/components/CardBoxModal.vue';
  import EditConfirmation from '@/components/EditConfirmation.vue'
  import BaseButton from '@/components/BaseButton.vue';
  import BaseButtons from '@/components/BaseButtons.vue';
  import { createShiftsMonth, getShiftsMonth } from '@/api/shifts'
  import { useShiftsStore } from '@/stores/shifts';
  import dayjs from 'dayjs';
  import router from '@/router';

  const configStore = useConfigStore()
  const shiftsStore = useShiftsStore()

  const currentMonth = ref(null);
  const firstDayOfMonth = ref(null);
  const isDataLoaded = ref(false);

  const emit = defineEmits();

  const isModalActive = ref(false);
  const isModalDangerActive = ref(false);
  const event = ref(null)

  const notification = computed(() => shiftsStore.notification);
  const handleDatesSet = ({ view }) => {
  // Update the current month when the view changes
  currentMonth.value = view.title;
  const currentDate = dayjs(view.title);
  firstDayOfMonth.value = currentDate.startOf('month');
  const secondDayOfMonth = firstDayOfMonth.value.add(1, 'month');
  console.log('First day of the month:', secondDayOfMonth.format('MM-DD-YYYY'));
};

function titleTurno(number){
  switch (number) {
    case 1: return 'PRIMERO'
    case 2: return 'SEGUNDO'
    case 3: return 'TERCERO'
    case 4: return 'CUARTO'
  }
}

  
  const calendarOptions = ref({
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    events: [
      { title: 'Meeting', start: new Date() }
    ],
    
    datesSet: handleDatesSet,
    eventClick: handleEventClick,
    timezone: 'UTC',
    eventRender: function (info) {
    // Modify the rendering of each event here
    info
    debugger
  }
  });

  const displayShifts = () => {
  const shifts = shiftsStore.shifts;
  debugger
  if (!shifts || shifts.length === 0) return [];
  
  const events = shifts.map((shift,index) => {
    let i = index % configStore.config[0].shiftsPerDay;
    return {
      title: `${titleTurno(i+1)}`,
      color: shift.status.id === 1 ? '#3633FF' : '#6BFF33',
      start: shift.start,
      end: shift.end,
      extendedProps:{
        shiftId: shift.id,
        date: shift.date,
        start: shift.start,
        end: shift.end,
        tolerance: shift.tolerance
      }
    };
  });

  return events;
};



function handleEventClick(eventInfo) {
  // Handle the event click here
  console.log('Event clicked:', eventInfo);

 isModalDangerActive.value = true
 event.value= eventInfo.event
}


const cancel = () => {
    isModalDangerActive.value = false
}

const cancelModal = () => {
    isModalActive.value = false
}

watch([() => configStore.config, () => shiftsStore.shifts], ([newConfig, newShifts]) => {
  // Check if both config and shifts data are available
  if (newConfig && newShifts && isDataLoaded.value) {
    calendarOptions.value.events = displayShifts();
  }
});


  onMounted(async () => {
  try {
    // Fetch config data when the component is mounted
    await configStore.fetchConfig();
    await shiftsStore.fetchShifts();

    // Check if both config and shifts data are available
    if (configStore.config && shiftsStore.shifts) {
      calendarOptions.value.events = displayShifts();
      isDataLoaded.value = true;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

const confirmEdit = (shift) => {
  debugger
  const shiftId = shift.shiftId
  router.push(`/edit-shift/${shiftId}`)
};

const confirmCreateTurnos = async () => {
      const config = configStore.config[0];
  debugger
      const secondDayOfMonth = firstDayOfMonth.value.add(1, 'month');
      await createShiftsMonth(secondDayOfMonth.format('MM-DD-YYYY'),config);
      cancelModal()
      shiftsStore.setNotification({ message: 'Se volvieron a crear los turnos correctamente', type: 'info' });
      await shiftsStore.fetchShifts();
      calendarOptions.value.events = displayShifts();
};

const dismissNotifications = () => {
  shiftsStore.resetNotification();
};

  const createShifts = async () => {
  try {
    const config = configStore.config[0];
    if (!config) {
      console.error('Config not available');
      return;
    }
    delete config.id
    delete config.shiftPrice
    const secondDayOfMonth = firstDayOfMonth.value.add(1, 'month');
    const exists = await getShiftsMonth(secondDayOfMonth.format('MM-DD-YYYY'))

    if (exists.data === true){
      console.log('ya estan creados')
      isModalActive.value = true
    } else {
      const secondDayOfMonth = firstDayOfMonth.value.add(1, 'month');
      await createShiftsMonth(secondDayOfMonth.format('MM-DD-YYYY'),config);
      shiftsStore.setNotification({ message: 'Se crearon los turnos correctamente', type: 'success' });
      await shiftsStore.fetchShifts();
      calendarOptions.value.events = displayShifts();
    }

    
    

  } catch (error) {
    if (error.code="ERR_BAD_REQUEST"){
      
    }
    console.error('Error creating shifts:', error);
  }
};
  </script>

  <template>
    <LayoutAuthenticated>
      <SectionMain>
        <h1>Turnos</h1>
        <NotificationBar v-if="notification" :color="notification.type" @close="shiftsStore.resetNotification()" :dismissCallback="dismissNotifications">
        <b>{{ notification.message }}</b>
      </NotificationBar>
        <BaseButtons>
            <BaseButton color="info" outline label="Crear Mes" @click="createShifts" />
        </BaseButtons>
        
        <FullCalendar :options='calendarOptions' />
        
          <CardBoxModal v-model="isModalActive" :has-cancel="false" title="Event Details">
            <EditConfirmation
              v-if="isModalActive"
              v-model:isActive="isModalActive"
              :confirmation-message="'Existen turnos creados para este mes. Desea generarlos nuevamente?'"
              @confirm="confirmCreateTurnos()"
              @cancel="cancelModal()"
          />
        </CardBoxModal>
        <CardBoxModal v-model="isModalDangerActive" title="Editar Turno">
          <EditConfirmation
              v-if="isModalDangerActive"
              v-model:isActive="isModalDangerActive"
              :item="event.shiftId"
              @confirm="confirmEdit(event.extendedProps)"
              @cancel="cancel"
          />
  </CardBoxModal>


        
      </SectionMain>
    </LayoutAuthenticated>
  </template>
