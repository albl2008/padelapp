<script setup>
import { computed, ref, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import {
  mdiAccountMultiple,
  mdiCartOutline,
  mdiChartTimelineVariant,
  mdiMonitorCellphone,
  mdiReload,
  mdiGithub,
  mdiChartPie,
  mdiCalendar,
  mdiClock,
  mdiBook,
  mdiBookAccount,
  mdiBookAlert,
  mdiClosedCaption,
  mdiSwitch,
  mdiHeadLightbulbOutline,
  mdiCloseCircle
} from '@mdi/js'
import * as chartConfig from '@/components/Charts/chart.config.js'
import LineChart from '@/components/Charts/LineChart.vue'
import SectionMain from '@/components/SectionMain.vue'
import CardBoxWidget from '@/components/CardBoxWidget.vue'
import CardBox from '@/components/CardBox.vue'
import TableSampleClients from '@/components/TableSampleClients.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import BaseButton from '@/components/BaseButton.vue'
import CardBoxTransaction from '@/components/CardBoxTransaction.vue'
import CardBoxClient from '@/components/CardBoxClient.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BannerCourtsInUse from '@/components/BannerCourtsInUse.vue'
import { useAuthStore } from '@/stores/auth'
import { useCourtsStore } from '@/stores/courts'
import { useRouter } from 'vue-router'
import { useShiftsStore } from '@/stores/shifts';
import dayjs from 'dayjs'
import { getShiftsWeek, getShiftsNextDays } from '@/api/shifts'
import { getAllConfig } from '@/api/config'
import { useConfigStore } from '@/stores/config'
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'



const authStore = useAuthStore()
const courtsStore = useCourtsStore()
const shiftsStore = useShiftsStore()
const configStore = useConfigStore()

const thisWeek = ref(0)
const thisWeekBooked = ref(0)
const today = ref(0)
const todayBooked = ref(0)
const totalThisWeek = ref(0)
const tomorrowBooked = ref(0)
const tomorrow = ref(0)
const tomorrowShifts = ref([])
const totalTomorrow = ref(0)
const todayShifts = ref([])
const courts = ref([]);
const config = ref(null)
const router = useRouter()
const chartData = ref(null)
const isLoggedIn = computed(() => authStore.isLoggedIn);



onMounted( async() => {
  getPercents()
  getConfig()
})

const getConfig = async() => {
  const configs = await getAllConfig()
  config.value = configs.data.results[0]
  console.log(configs.data.results[0])
}



const getPercents = async (shifts) => {
  const todayDate = dayjs().format('MM-DD-YYYY')
  const weekShifts = await getShiftsWeek(todayDate)
  const next7daysShifts = await getNextDays(7)
  console.log(next7daysShifts)
  console.log(weekShifts.data)
  next7daysShifts.data.forEach(element => {
    thisWeek.value += 1
    if (element.status.id === 1){
      thisWeekBooked.value += 1
    }
  })
  const tomorrowDate = dayjs().add(1, 'day')
  next7daysShifts.data.forEach(element => {
    if (element.date.split('T')[0] === tomorrowDate.format('YYYY-MM-DD')){
      tomorrow.value += 1
      tomorrowShifts.value.push(element)
      if (element.status.id === 1){
        tomorrowBooked.value += 1
      }
    }
  })
  console.log(dayjs().format('YYYY-MM-DD'))
  weekShifts.data.forEach(element => {
    if (element.date.split('T')[0] === dayjs().format('YYYY-MM-DD')){
      today.value += 1
      todayShifts.value.push(element)
      if (element.status.id === 1){
        todayBooked.value += 1
      }
    }
  })
 
  
}

const getNextDays = async (limit) => {
  
  const body = {
    today: dayjs().toDate(),
    limit: limit
    
  }
  const shifts = await getShiftsNextDays(body)
  console.log(shifts)
  return shifts
 
}

const mainStore = useMainStore()
const fetchCourts = async () => {
  courts.value = await courtsStore.fetchCourts();
};

const convertToMinutes = (time) => {
  return time * 60;
}

const handleClick = (shiftId) => {
  router.push(`/book-shift/${shiftId}`)
}



</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiChartTimelineVariant" title="Overview" main>
        <BaseButton
          :icon="mdiCalendar"
          label="Calendario"
          color="contrast"
          rounded-full
          small
          to="/calendar"
        />
      </SectionTitleLineWithButton>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
        <CardBoxWidget
          :trend="today !== 0 ? (todayBooked/today * 100).toFixed(2) + '%' : 'Cerrado'" 
          :trend-type="todayBooked/today * 100 > 50 ? 'up' : 'down'"
          :color="today === 0 ? 'text-red-500' : 'text-emerald-500'"
          :icon="today === 0 ? mdiCloseCircle : mdiClock"
          suffix="/"
          :number="today"
          :total="todayBooked"
          label="Hoy"
        />
        <CardBoxWidget
          :trend="tomorrow !== 0 ? (tomorrowBooked/tomorrow * 100).toFixed(2) + '%' : 'Cerrado'" 
          :trend-type="tomorrowBooked/tomorrow * 100 > 50 ? 'up' : 'down'"  
          :color="tomorrow === 0 ? 'text-red-500' : 'text-emerald-500'"
          :icon="tomorrow === 0 ? mdiCloseCircle : mdiClock"
          :number="tomorrow"
          :total="tomorrowBooked"
          label="Mañana"
        />
        <CardBoxWidget
          :trend="thisWeek !== 0 ? (thisWeekBooked/thisWeek * 100).toFixed(2) + '%' : 'Cerrado'"
          :trend-type="thisWeekBooked/thisWeek * 100 > 50 ? 'up' : 'down'"
          :color="thisWeekBooked/thisWeek * 100 > 50 ? 'text-emerald-500' : 'text-red-500'"
          :icon="mdiCalendar"
          :number="thisWeek"
          :total="thisWeekBooked"
          label="Proximos 7 dias"
        />
        <!-- <CardBoxWidget
          trend="Overflow"
          trend-type="alert"
          color="text-red-500"
          :icon="mdiChartTimelineVariant"
          :number="256"
          suffix="%"
          label="Performance"
        /> -->
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
    <div v-if="config" class="flex flex-col justify-between ">
        
        <Carousel  v-if="todayShifts.length > 0">
            <Slide v-for="court of config.courtsQuantity" :key="court">
                <div class="">
                  <p class="text-2xl text-gray-500 dark:text-slate-400 mb-3">Hoy - <span class="text-yellow-500">Cancha: {{ court }}</span></p>
                    <div
                        class="mb-3"
                        v-if="todayShifts.length > 0"
                        v-for="shift in todayShifts"
                        :key="shift.id"
                        @click="handleClick(shift.id)"
                        style="cursor: pointer;"
                    >
                        <CardBoxTransaction
                            v-if="court === shift.court.number"
                            :title="new Date(shift.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',  timeZone: 'UTC'}) "
                            :date="dayjs(shift.date).format('DD-MM-YYYY')"
                            :business="convertToMinutes(shift.duration) + ' min'"
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
        <div v-if="todayShifts.length === 0"> No hay turnos programados para hoy</div>
    </div>
    <div v-if="config" class="flex flex-col justify-between">
       
        <Carousel v-if="tomorrowShifts.length > 0">
            <Slide v-for="court of config.courtsQuantity" :key="court">
                <div class="">
                  <p class="text-2xl text-gray-500 dark:text-slate-400 mb-3">Mañana - <span class="text-yellow-500">Cancha: {{ court }}</span></p>
                    <div
                        class="mb-3"
                        v-if="tomorrowShifts.length > 0"
                        v-for="shift in tomorrowShifts"
                        :key="shift.id"
                        @click="handleClick(shift.id)"
                        style="cursor: pointer;"
                    >
                        <CardBoxTransaction
                            v-if="court === shift.court.number"
                            :title="new Date(shift.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',  timeZone: 'UTC'}) "
                            :date="dayjs(shift.date).format('DD-MM-YYYY')"
                            :business="convertToMinutes(shift.duration) + ' min'"
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
        <div v-if="tomorrowShifts.length === 0"> No hay turnos programados para mañana</div>
    </div>
</div>
      
  <div v-if="config && todayShifts && todayShifts.length > 0">
    <BannerCourtsInUse class="mt-6 mb-6"  :shifts="todayShifts"/>
  </div>
     


      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">


      </div>

      <!-- <SectionTitleLineWithButton :icon="mdiChartPie" title="Trends overview">
        <BaseButton :icon="mdiReload" color="whiteDark" @click="fillChartData" />
      </SectionTitleLineWithButton>

      <CardBox class="mb-6">
        <div v-if="chartData">
          <line-chart :data="chartData" class="h-96" />
        </div>
      </CardBox>

      <SectionTitleLineWithButton :icon="mdiAccountMultiple" title="Clients" />

      <NotificationBar color="info" :icon="mdiMonitorCellphone">
        <b>Responsive table.</b> Collapses on mobile
      </NotificationBar>

      <CardBox has-table>
        <TableSampleClients />
      </CardBox> -->
    </SectionMain>
  </LayoutAuthenticated>
</template>
