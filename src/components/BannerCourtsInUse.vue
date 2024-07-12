<script setup>
import { mdiClock,mdiGithub } from '@mdi/js'
import BaseButton from '@/components/BaseButton.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import SectionBanner from '@/components/SectionBanner.vue'
import { gradientBgPinkRed } from '@/colors'
import { ref, onMounted, onUnmounted, defineProps, handleError } from 'vue'
import { useRouter } from 'vue-router'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import CardBoxTransaction from '@/components/CardBoxTransaction.vue'
import { getAllConfig } from '@/api/config'
import dayjs from 'dayjs'


const props = defineProps({
  shifts: {
    type: Object,
  }
})

const router = useRouter()

const config = ref({})

const actualShifts = ref([])
const nextShifts = ref([])

const getNextShifts = (shifts) => {
  debugger
  if (!shifts || shifts.length === 0) return null;

  // Get the current time and local time offset in hours
  const currentTime = new Date();
 
  let hour = currentTime.getHours();

  const localeOffSet = currentTime.getTimezoneOffset() / 60;
  const minutes = currentTime.getMinutes();
  hour = hour + (localeOffSet / 60) + (minutes / 60)
  // Filter shifts to only those starting in the future
  const futureShifts = shifts.filter(shift => {
    const shiftStart = new Date(shift.start);
    
    let startHour = shiftStart.getHours();
    const shiftMinutes = shiftStart.getMinutes();

    startHour = startHour + (shiftMinutes / 60)
    
    return startHour + localeOffSet > hour;
  });
  return futureShifts
}

const getActualShifts = (shifts) => {
  
  
  if (!shifts || shifts.length === 0) return [];
  const currentDate = new Date();
  const localeOffSet = currentDate.getTimezoneOffset() / 60;
  let hour = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  hour = hour + (localeOffSet / 60) + (minutes / 60)
  
  
  // Get the local time offset in hours
  
  // Filter shifts by date and hour
  const actual =  shifts.filter(shift => {
    // Convert shift start and end times to local time
    const shiftStart = new Date(shift.start);
    const shiftEnd = new Date(shift.end);

    
    
    let shiftHour = shiftStart.getHours();
    let shiftEndHour = shiftEnd.getHours();
    const shiftMinutes = shiftStart.getMinutes();
    const shiftEndMinutes = shiftEnd.getMinutes();

    shiftHour = shiftHour + (shiftMinutes / 60)  + localeOffSet
    shiftEndHour = shiftEndHour + (shiftEndMinutes / 60)  + localeOffSet

    

    return shiftHour <= hour && shiftEndHour >= hour
  });
  
  return actual
}
// Reactive property for the current time
const currentTime = ref(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))

// Function to update the time
const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const getConfig = async () => {
    const configResult = await getAllConfig()
    config.value = configResult.data.results[0]
}

const handleClick = (shiftId) => {
  router.push(`/book-shift/${shiftId}`)
}

// Update time every minute
onMounted(async() => {
  const interval = setInterval(updateTime, 60000)
  updateTime() // Initial update
  await getConfig()
  const shifts = props.shifts 
  console.log(shifts)
  if (props.shifts) {
    actualShifts.value = getActualShifts(props.shifts) 
    nextShifts.value = getNextShifts(props.shifts)
  } else {
    Vue.nextTick(() => {
      if (props.shifts) {
        actualShifts.value = getActualShifts(props.shifts) 
        nextShifts.value = getNextShifts(props.shifts)
      }
    })
  }
  
  console.log(nextShifts.value)
  console.log(actualShifts.value)
  
  
  
})
</script>

<template>
  <SectionBanner :class="gradientBgPinkRed">
    <BaseIcon :path="mdiClock" size="48" class="text-white" />
    <h1 class="text-3xl text-white mb-6"> {{ currentTime }}</h1>
    
    <div v-if="config" >
        <div class="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
        <Carousel v-if="actualShifts.length > 0" >
        <Slide v-for="court of config.courtsQuantity" :key="court">
            <div>
              <p class="text-2xl text-gray-500 dark:text-black mb-3">Ahora - <span class="text-white">Cancha: {{ court }}</span></p>
                <div
                    class="mb-3"
                    v-for="shift in actualShifts"
                    :key="shift.id"
                    @click="handleClick(shift.id)"
                    style="cursor: pointer;"
                >
                    <CardBoxTransaction
                        v-if="court === shift.court.number"
                        :title="new Date(shift.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',  timeZone: 'UTC'}) "
                        :date="dayjs(shift.date).format('DD-MM-YYYY')"
                        :type="shift.status.sta"
                        :name="shift.client ? shift.client : ''"
                        :account="dayjs(shift.date).format('DD-MM-YYYY')"
                    />
                    
                </div>
            </div>
              
            
        </Slide>
        <template #addons>
            <Navigation />
            <Pagination />
        </template>
    </Carousel>

    <Carousel v-if="nextShifts.length > 0" >
        <Slide v-for="court of config.courtsQuantity" :key="court">
            <div>
              <p class="text-2xl text-gray-500 dark:text-black mb-3">Proximos - <span class="text-white">Cancha: {{ court }}</span></p>
                <div
                    class="mb-3"
                    v-for="shift in nextShifts"
                    :key="shift.id"
                    @click="handleClick(shift.id)"
                    style="cursor: pointer;"
                >
                    <CardBoxTransaction
                        v-if="court === shift.court.number"
                        :title="new Date(shift.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',  timeZone: 'UTC'}) "
                        :date="dayjs(shift.date).format('DD-MM-YYYY')"
                        :type="shift.status.sta"
                        :name="shift.client ? shift.client : ''"
                        :account="dayjs(shift.date).format('DD-MM-YYYY')"
                    />
                    
                </div>
            </div>
              
            
        </Slide>
        <template #addons>
            <Navigation />
            <Pagination />
        </template>
    </Carousel>
  </div>
    </div>
   
    </SectionBanner>

    
</template>
