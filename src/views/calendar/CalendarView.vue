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
  import GenerateShifts from './GenerateShifts.vue'

  const configStore = useConfigStore()
  const shiftsStore = useShiftsStore()

  const currentMonth = ref(null);
  const firstDayOfMonth = ref(null);
  const isDataLoaded = ref(false);

  const emit = defineEmits();

  const isModalActive = ref(false);
  const isCreatingShifts = ref(false);
  const isModalDangerActive = ref(false);
  const shiftsOnClick = ref([]);
  const exists = ref(false)
  const createMessage = ref('');
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
    timeZone: 'UTC',
    events: [
      { title: 'Meeting', start: new Date() }
    ],
    
    datesSet: handleDatesSet,
    eventClick: handleEventClick,
    
    
    eventRender: function (info) {
    // Modify the rendering of each event here
    info.el.style.backgroundColor = '#FFFFFF';
  }
  });

  const displayShifts = () => {
  const shifts = shiftsStore.shifts;
  if (!shifts || shifts.length === 0) return [];
  // Create a Map to track shifts per hour
  const shiftMap = new Map();

  // Iterate over shifts and add the first shift of each hour to the Map
  const filteredShifts = shifts.filter(shift => {
    const dateHour = `${shift.date}-${new Date(shift.start).getHours()}`;
    if (!shiftMap.has(dateHour)) {
      shiftMap.set(dateHour, true);
      return true;
    }
    return false;
  });

  // Map the filtered shifts to events
  const events = filteredShifts.map((shift, index) => {
    const shiftsByDay = getShiftsByDateAndHour(shift.date, new Date(shift.start).getHours());
    const lengthByDauy = shiftsByDay.length
    let color = '#FFFFFF';
    let cont = 0
    for (const shift of shiftsByDay) {
      if (shift.status.id === 0){
        cont ++
      }
    }
    if (cont === lengthByDauy){
      color = '#00FF00'
    } else if (cont > 0 && cont < lengthByDauy){
      color = '#FFFF00'
    } else if (cont === 0){
      color = '#FF0000'
    }
    return {
      title: ``,
      color: color,
      start: shift.start,
      end: shift.end,
      extendedProps: {
        shiftId: shift.id,
        date: shift.date,
        start: shift.start,
        end: shift.end,
        tolerance: shift.tolerance,
        court: shift.court
      }
    };
  });

  return events;
};



const getShiftsByDateAndHour = (date, hour) => {
  const shifts = shiftsStore.shifts;
  if (!shifts || shifts.length === 0) return [];
  
  // Filter shifts by date and hour
  return shifts.filter(shift => {
    const shiftHour = new Date(shift.start).getHours();
    return shift.date === date && shiftHour === hour;
  });
};

function handleEventClick(eventInfo) {
  // Handle the event click here
  console.log('Event clicked:', eventInfo);

  const clickedDate = eventInfo.event.extendedProps.date;
  const clickedHour = new Date(eventInfo.event.start).getHours();
  const shiftsForDayAndHour = getShiftsByDateAndHour(clickedDate, clickedHour);

  console.log('Shifts for the day and hour:', shiftsForDayAndHour);

  isModalDangerActive.value = true;
  shiftsOnClick.value = shiftsForDayAndHour
}



const cancel = () => {
    isModalDangerActive.value = false
}

const cancelModal = () => {
    isModalActive.value = false
}

const cancelCreate = () => {
    isCreatingShifts.value = false
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

const selectedCourt = (shiftId) => {
  
  router.push(`/edit-shift/${shiftId}`)
};

const confirmCreateTurnos = async () => {

    try {

      const config = configStore.config[0];
      debugger

      if (!config) {
        console.error('Config not available');
        shiftsStore.setNotification({ message: 'Debe cargar una configuracion para crear turnos', type: 'info' });
        return
      }
      const secondDayOfMonth = firstDayOfMonth.value.add(1, 'month');
      await createShiftsMonth(secondDayOfMonth.format('MM-DD-YYYY'),config);
      shiftsStore.setNotification({ message: 'Se crearon los turnos correctamente', type: 'success' });
      await shiftsStore.fetchShifts();
      calendarOptions.value.events = displayShifts();
      isCreatingShifts.value = false
    

    } catch (error){
      isCreatingShifts.value = false
    shiftsStore.setNotification({ message: 'Error' + error, type: 'danger' });
    console.error('Error creating shifts:', error);
    }
     
};

const dismissNotifications = () => {
  shiftsStore.resetNotification();
};

const getShifts = async () => {
 try {

  const config = configStore.config[0];
    if (!config) {
      console.error('Config not available');
      return;
    }
    delete config.id
    delete config.shiftPrice
    delete config.user
    const secondDayOfMonth = firstDayOfMonth.value.add(1, 'month');
    exists.value = await getShiftsMonth(secondDayOfMonth.format('MM-DD-YYYY'))
    console.log(exists.value.data)
    if (exists.value.data === true){
      createMessage.value ='Ya existen turnos para ese mes, desea generarlos nuevamente?'
      console.log('ya estan creados')
      isCreatingShifts.value = true
    } else {
      createMessage.value = '¿Deseas generar los turnos para este mes?'
      isCreatingShifts.value = true
    }

 } catch (error) {
   console.error('Error fetching shifts:', error);
 }

}

  const createShifts = async () => {
  try {
    const config = configStore.config[0];
    if (!config) {
      console.error('Config not available');
      return;
    }
    delete config.id
    delete config.shiftPrice
    delete config.user
    const secondDayOfMonth = firstDayOfMonth.value.add(1, 'month');
    const exists = await getShiftsMonth(secondDayOfMonth.format('MM-DD-YYYY'))

    if (exists.data === true){
      createMessage.value ='Ya existen turnos para ese mes, desea generarlos nuevamente?'
      console.log('ya estan creados')
      isCreatingShifts.value = true
    } else {
      isCreatingShifts.value = true
      createMessage.value = '¿Deseas generar los turnos para este mes?'
      
      await shiftsStore.fetchShifts();
      calendarOptions.value.events = displayShifts();
      isCreatingShifts.value = false
    }

 

    
    

  } catch (error) {
    
    isCreatingShifts.value = false
    shiftsStore.setNotification({ message: 'Error' + error, type: 'danger' });
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
            <BaseButton color="info" outline label="Crear Mes" @click="getShifts" />
        </BaseButtons>
        
        <FullCalendar :options='calendarOptions' />
        
          <CardBoxModal v-model="isCreatingShifts" :has-cancel="false" title="Generar turnos">
            <GenerateShifts
              v-if="isCreatingShifts"
              v-model:isActive="isCreatingShifts"
              :confirmation-message="createMessage"
              @confirm="confirmCreateTurnos()"
              @cancel="cancelCreate()"
          />

        </CardBoxModal>
        <CardBoxModal v-model="isModalDangerActive" title="Agendar Turno">
          <EditConfirmation
              v-if="isModalDangerActive"
              v-model:isActive="isModalDangerActive"
              :events="shiftsOnClick"
              @confirm="selectedCourt($event)"
              @cancel="cancel"
          />
  </CardBoxModal>


        
      </SectionMain>
    </LayoutAuthenticated>
  </template>
