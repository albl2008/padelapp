  <script setup>
  import FullCalendar from '@fullcalendar/vue3'
  import dayGridPlugin from '@fullcalendar/daygrid'
  import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
  import NotificationBar from '@/components/NotificationBar.vue'
  import SectionMain from '@/components/SectionMain.vue'
  import { ref, onMounted, watch, computed } from 'vue';
  import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
  import { mdiTableBorder, mdiTableOff, mdiCalendar, mdiPlus } from '@mdi/js'
  import { useConfigStore } from '@/stores/config';
  import CardBoxModal from '@/components/CardBoxModal.vue';
  import EditConfirmation from '@/components/EditConfirmation.vue'
  import BaseButton from '@/components/BaseButton.vue';
  import BaseButtons from '@/components/BaseButtons.vue';
  import { createShiftsMonth, getShiftsMonth } from '@/api/shifts'
  import { useShiftsStore } from '@/stores/shifts';
  import dayjs from 'dayjs';
  import timezone from 'dayjs/plugin/timezone';
  import utc from 'dayjs/plugin/utc';
  import router from '@/router';
  import GenerateShifts from './GenerateShifts.vue'
import { Calendar } from '@fullcalendar/core'
import { getAllConfig } from '@/api/config'
import esLocale from '@fullcalendar/core/locales/es'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('UTC')
  const configStore = useConfigStore()
  const shiftsStore = useShiftsStore()

  const currentMonth = ref(null);
  const firstDayOfMonth = ref(null);
  const isDataLoaded = ref(false);
  const actualMonth = ref(null);

  const emit = defineEmits();

  const isModalActive = ref(false);
  const isCreatingShifts = ref(false);
  const isModalDangerActive = ref(false);
  const shiftsOnClick = ref([]);
  const exists = ref(false)
  const createMessage = ref('');
  const alertMessage = ref(null);
  const eventClicked = ref(null)
  const eventInfoTitle = ref('')

  const notification = computed(() => shiftsStore.notification);
  const handleDatesSet = async ({ view }) => {
    debugger
  // Update the current month when the view changes
  currentMonth.value = view.currentStart;
  const currentDate = dayjs(view.currentStart);
  actualMonth.value = (view.title).split(' ')[0];
  firstDayOfMonth.value = currentDate.startOf('month');
  await getAlertMessage()
  const body = {
    today: firstDayOfMonth.value.format('MM-DD-YYYY'),
    limit:30
  }
  await shiftsStore.getNextShifts(body)
  const secondDayOfMonth = firstDayOfMonth.value.add(1, 'month');
  console.log('First day of the month:', secondDayOfMonth.format('MM-DD-YYYY'));
};

function titleTurno(number, dailyShifts){
  const actualCase = number
  switch (number) {
      case actualCase: return `${number === 0 ? dailyShifts : number}° - `
  }
}

  
  const calendarOptions = ref({
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    events: [],
    themeSystem: 'bootstrap5',
    locale: esLocale,
    datesSet: handleDatesSet,
    eventClick: handleEventClick,
    dayMaxEventRows: 4,
    moreLinkClick: 'popover',
    moreLinkClick: handleMoreLinkClick,
    eventContent: function (info) {
            var eventBackgroundColor = info.event.backgroundColor // Change to your desired background color
            var eventTextColor = 'black'; // Change to your desired text color
          
            // Create the HTML structure with a rectangular background shape
            var html =
              '<div class="overflow-hidden cursor-pointer w-full m-2" style="background-color: ' +
              eventBackgroundColor +
              '; color: ' +
              eventTextColor +
              '; padding: 5px; border-radius: 5px; font-weight: bold;">' + info.event.title +
              dayjs(info.event.start).tz('UTC').format('HH:mm') +
              '</div>';
          
            return { html: html };
          },

    moreLinkContent: function(arg) {
    return `+${arg.num} mas`; // customize the "view more" button text
  }
  });

  const displayShifts = () => {
   
  const config = configStore.config[0];
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

  let shiftNumber = 0
  
  
  
  // Map the filtered shifts to events
  const events = filteredShifts.map((shift, index) => {
    const shiftsByDay = getShiftsByDateAndHour(shift.date, new Date(shift.start).getHours());
    const lengthByDay = shiftsByDay.length
    const dailyShifts = config.shiftsPerDay
    let color = '#FFFFFF';
    let cont = 0
    shiftNumber = shiftNumber + 1
    
    for (const shift of shiftsByDay) {
      
      if (shift.status.id === 0){
        cont ++
      }
      
      
     
    }
    shiftNumber = shiftNumber % dailyShifts
    

    if (cont === lengthByDay){
      color = '#51976B'
    } else if (cont > 0 && cont < lengthByDay){
      color = '#F1EF2E'
    } else if (cont === 0){
      color = '#FF0000'
    }
    return {
      title: `${titleTurno(shiftNumber,dailyShifts)}`,
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
  eventClicked.value = eventInfo.event.extendedProps
  eventInfoTitle.value = `Agendar turno ${dayjs(eventClicked.value.start).format('DD-MM-YYYY HH:mm')} - ${dayjs(eventClicked.value.end).format('HH:mm')}`
  console.log(eventInfo.value)
  const clickedDate = eventInfo.event.extendedProps.date;
  const clickedHour = new Date(eventInfo.event.start).getHours();
  const shiftsForDayAndHour = getShiftsByDateAndHour(clickedDate, clickedHour);

  console.log('Shifts for the day and hour:', shiftsForDayAndHour);

  isModalDangerActive.value = true;
  shiftsOnClick.value = shiftsForDayAndHour

  const popover = eventInfo.el.closest('.fc-popover');
  if (popover) {
    popover.style.display = 'none';
  }
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

    let calendarInstance = null;

  try {
    calendarInstance = new Calendar(document.getElementById('calendar'), calendarOptions.value);
 
    // Fetch config data when the component is mounted
    await configStore.fetchConfig();
    await shiftsStore.fetchShifts();

    // Check if both config and shifts data are available
    if (configStore.config && shiftsStore.shifts) {
      calendarOptions.value.events = displayShifts();
      isDataLoaded.value = true;
    }

    await getAlertMessage()
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

function handleMoreLinkClick(arg) {
  const popover = document.querySelector('.fc-popover');
  if (popover) {
    popover.style.display = 'none';
  }
  return 'popover';
}

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
      //const secondDayOfMonth = firstDayOfMonth.value.add(1, 'month');
      delete config.club
      await createShiftsMonth(firstDayOfMonth.value.format('MM-DD-YYYY'),config);
      shiftsStore.setNotification({ message: 'Se crearon los turnos correctamente', type: 'success' });
      const body = {
        today: firstDayOfMonth.value.format('MM-DD-YYYY'),
        limit:30
      }
      await shiftsStore.getNextShifts(body);
      await getAlertMessage()
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
    //const secondDayOfMonth = firstDayOfMonth.value.add(1, 'month');
    exists.value = await getShiftsMonth(firstDayOfMonth.value.format('MM-DD-YYYY'))
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

const getAlertMessage = async () => {
  try {
    const configsData = await getAllConfig();
    const config = configsData.data.results[0];
    if (!config) {
      console.error('Config not available');
      return;
    }
    delete config.id
    delete config.shiftPrice
    delete config.user
    //const secondDayOfMonth = firstDayOfMonth.value.add(1, 'month');
    exists.value = await getShiftsMonth(firstDayOfMonth.value.format('MM-DD-YYYY'))
    console.log(exists.value.data)
    if (exists.value.data === true){
      alertMessage.value =`Ya existen turnos para ${actualMonth.value}, desea generarlos nuevamente?`
      console.log('ya estan creados')
      
    } else {
      alertMessage.value = `¿Deseas generar los turnos para ${actualMonth.value} ?`
     
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
        <SectionTitleLineWithButton :icon="mdiCalendar"  title="Calendario" main>
          <div v-if="alertMessage" class="flex justify-center items-center">
          <p class = "mr-4">{{ alertMessage }}</p>
          <BaseButtons>
            <BaseButton color="info" outline label="Generar" @click="getShifts" />
        </BaseButtons>


        </div>
        </SectionTitleLineWithButton>
        <NotificationBar v-if="notification" :color="notification.type" @close="shiftsStore.resetNotification()" :dismissCallback="dismissNotifications">
        <b>{{ notification.message }}</b>
      </NotificationBar>

        

        
        <div id="calendar" class="calendar-container">
          <FullCalendar :options='calendarOptions' />
        </div>
        
        
          <CardBoxModal v-model="isCreatingShifts" :has-cancel="false" title="Generar turnos">
            <GenerateShifts
              v-if="isCreatingShifts"
              v-model:isActive="isCreatingShifts"
              :confirmation-message="createMessage"
              @confirm="confirmCreateTurnos()"
              @cancel="cancelCreate()"
          />

        </CardBoxModal>
        <CardBoxModal v-model="isModalDangerActive" :title="eventInfoTitle">
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

<style scoped>

.custom-event {
    display: block; 
    width: 100%; /* Ensure full width */
    box-sizing: border-box; /* Include padding in width calculation */
}

/* Ensure the event container takes full width */
:deep(.fc-daygrid-event-harness) {
    width: 100%;
}

/* Ensure the entire cell background changes */
:deep(.fc-daygrid-day) {
    background-color: inherit;
}

:deep(.fc-daygrid-day.fc-day-today) {
    background-color: inherit;
}

:deep(.fc-daygrid-day.fc-day-past) {
    background-color: inherit;
}

:deep(.fc-daygrid-day.fc-day-future) {
    background-color: inherit;
}

:deep(.fc-daygrid-day-events) {
    width: 100%;
}

:deep(.fc-daygrid-event) {
    width: 100%;
}

/* Existing styles */
:deep(.fc-more-popover) {
  max-width: 300px;
}

:deep(.fc-more) {
  background-color: #007bff;
  color: white;
  padding: 2px 5px;
  border-radius: 3px;
  cursor: pointer;
}

:deep(.fc-popover) {
  background-color: #334155;
  color: #ffffff;
  border: 1px solid #1e293b;
}

:deep(.fc-popover-header) {
  background-color: #1e293b;
  color: #ffffff;
  border-bottom: 1px solid #1e293b;
}

:deep(.fc-popover-body) {
  background-color: #334155;
  color: #ffffff;
}

:deep(.fc-popover .fc-daygrid-event) {
  background-color: #1e293b;
  padding: 5px;
  border: 3px solid #1e293b;
  color: #ffffff;
}

:deep(.fc-popover .fc-more-popover) {
  background-color: #334155;
  color: #ffffff;
  border: 1px solid #1e293b;
}

/* Change border color of day cells to black */
:deep(.fc-daygrid-day-frame) {
    border: 1px solid 1e293b; /* Set border color to 1e293b */
}

/* Ensure other relevant elements have the border color applied */
:deep(.fc-col-header-cell) {
    border: 1px solid 1e293b; /* Set border color for header cells */
}

:deep(.fc-daygrid-day-top) {
    border-bottom: 1px solid 1e293b; /* Set bottom border for day top */
}

/* Optional: Ensure background color changes are consistent */
:deep(.fc-daygrid-day) {
    background-color: inherit;
}

:deep(.fc-daygrid-day.fc-day-today) {
    background-color: inherit;
}

:deep(.fc-daygrid-day.fc-day-past) {
    background-color: inherit;
}

:deep(.fc-daygrid-day.fc-day-future) {
    background-color: inherit;
}

:deep(.fc-view-harness) {
    border-color: #1e293b; 
}

:deep(.fc-daygrid-day-frame) {
    border: 1px solid #1e293b; /* Set border color to #1e293b */
    
}

/* Change border color for header cells to #1e293b */
:deep(.fc-col-header-cell) {
    border: 1px solid #334155; /* Set border color for header cells to #1e293b */
}

/* Change bottom border for day top to #1e293b */
:deep(.fc-daygrid-day-top) {
    border-bottom: 1px solid #1e293b; /* Set bottom border for day top to #1e293b */
}

/* Optional: Ensure background color changes are consistent */
:deep(.fc-daygrid-day) {
    background-color: inherit; /* Inherit from parent */
}

:deep(.fc-daygrid-day.fc-day-today) {
    background-color: inherit; /* Inherit from parent */
}

:deep(.fc-daygrid-day.fc-day-past) {
    background-color: inherit; /* Inherit from parent */
}

:deep(.fc-daygrid-day.fc-day-future) {
    background-color: inherit; /* Inherit from parent */
}

:deep(.fc-scrollgrid){
  border-color: #334155 !important;
}


</style>
