<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue'
import { ref } from 'vue';

const calendarOptions = ref({
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  weekends: false,
  events: [
    { title: 'Meeting', start: new Date() }
  ]
});
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <h1>Turnos</h1>
      <FullCalendar :options='calendarOptions' />
    </SectionMain>
  </LayoutAuthenticated>
</template>
