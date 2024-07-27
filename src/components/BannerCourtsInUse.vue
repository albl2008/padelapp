<script setup>
import { mdiClock, mdiGithub } from '@mdi/js'
import BaseButton from '@/components/BaseButton.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import SectionBanner from '@/components/SectionBanner.vue'
import { gradientBgPinkRed } from '@/colors'
import { ref, onMounted, onUnmounted, defineProps } from 'vue'
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
const interval = ref(null);
const nextShifts = ref([])
const currentTime = ref(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))

const redColor = 'text-red-500'
const greenColor = 'text-green-500'

const getNextShifts = (shifts) => {
  if (!shifts || shifts.length === 0) return null;

  const currentTime = new Date();
  let hour = currentTime.getHours();
  const localeOffSet = currentTime.getTimezoneOffset() / 60;
  const minutes = currentTime.getMinutes();
  hour = hour + (localeOffSet / 60) + (minutes / 60);

  const futureShifts = shifts.filter(shift => {
    const shiftStart = new Date(shift.start);
    let startHour = shiftStart.getHours();
    const shiftMinutes = shiftStart.getMinutes();
    startHour = startHour + (shiftMinutes / 60);

    return startHour + localeOffSet > hour;
  });
  return futureShifts;
}

const getActualShifts = (shifts) => {
  if (!shifts || shifts.length === 0) return [];
  const currentDate = new Date();
  const localeOffSet = currentDate.getTimezoneOffset() / 60;
  let hour = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  hour = hour + (localeOffSet / 60) + (minutes / 60);

  const actual = shifts.filter(shift => {
    const shiftStart = new Date(shift.start);
    const shiftEnd = new Date(shift.end);

    let shiftHour = shiftStart.getHours();
    let shiftEndHour = shiftEnd.getHours();
    const shiftMinutes = shiftStart.getMinutes();
    const shiftEndMinutes = shiftEnd.getMinutes();

    shiftHour = shiftHour + (shiftMinutes / 60) + localeOffSet;
    shiftEndHour = shiftEndHour + (shiftEndMinutes / 60) + localeOffSet;

    return shiftHour <= hour && shiftEndHour >= hour;
  });

  return actual;
}

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const getConfig = async () => {
  const configResult = await getAllConfig();
  config.value = configResult.data.results[0];
}

const handleClick = (shiftId) => {
  router.push(`/book-shift/${shiftId}`);
}

const counterDown = (start, duration) => {
  const startDate = new Date(start);
  const durationMinutes = duration * 60;
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

  const now = new Date();

  const localTimeOffset = now.getTimezoneOffset();
  const adjustedNow = new Date(now.getTime() - (localTimeOffset) * 60000);

  const timeRemaining = endDate.getTime() - adjustedNow.getTime();
  const minutesRemaining = Math.floor(timeRemaining / 60000) + 1;

  return minutesRemaining > 0 ? minutesRemaining : 0;
}

const getBusinessStyle = (minutesLeft) => {
  if (minutesLeft < 5) {
    return redColor
  } else if (minutesLeft > 90) {
    return greenColor
  } else {
    return ''
  }
}

onMounted(async () => {
  interval.value = setInterval(updateTime, 60000);
  updateTime();
  await getConfig();

  if (props.shifts) {
    actualShifts.value = getActualShifts(props.shifts);
    nextShifts.value = getNextShifts(props.shifts);
  } else {
    Vue.nextTick(() => {
      if (props.shifts) {
        actualShifts.value = getActualShifts(props.shifts);
        nextShifts.value = getNextShifts(props.shifts);
      }
    });
  }

  // Update the countdowns every minute
  setInterval(() => {
    if (props.shifts) {
      actualShifts.value = getActualShifts(props.shifts);
      nextShifts.value = getNextShifts(props.shifts);
    }
  }, 60000);
})

onUnmounted(() => {
  clearInterval(interval.value);
})

</script>

<template>
  <SectionBanner :class="gradientBgPinkRed">
    <BaseIcon :path="mdiClock" size="48" class="text-white" />
    <h1 class="text-3xl text-white mb-6"> HOY {{ currentTime }}</h1>
    
    <div v-if="config">
      <div class="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
        <Carousel v-if="actualShifts.length > 0">
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
                  :title="new Date(shift.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',  timeZone: 'UTC'})"
                  :date="'Hoy'"
                  :business="`Restan: ${counterDown(new Date(shift.start), shift.duration) } min`"
                  :businessStyle="getBusinessStyle(counterDown(new Date(shift.start), shift.duration))"
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

        <Carousel v-if="nextShifts.length > 0">
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
                  :title="new Date(shift.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',  timeZone: 'UTC'})"
                  :date="'Hoy'"
                  :business="shift.duration * 60 + ' min'"
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
