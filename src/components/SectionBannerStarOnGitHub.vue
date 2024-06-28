<script setup>
import { mdiClock,mdiGithub } from '@mdi/js'
import BaseButton from '@/components/BaseButton.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import SectionBanner from '@/components/SectionBanner.vue'
import { gradientBgPinkRed } from '@/colors'
import { ref, onMounted, onUnmounted } from 'vue'

// Reactive property for the current time
const currentTime = ref(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))

// Function to update the time
const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Update time every minute
onMounted(() => {
  const interval = setInterval(updateTime, 60000)
  updateTime() // Initial update

  // Clean up interval on unmount
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<template>
  <SectionBanner :class="gradientBgPinkRed">
    <BaseIcon :path="mdiClock" size="48" class="text-white" />
    <h1 class="text-3xl text-white mb-6"> {{ currentTime }}</h1>
    <!-- <div>
      <BaseButton
        href="https://github.com/justboil/admin-one-vue-tailwind"
        :icon="mdiGithub"
        label="GitHub"
        target="_blank"
        rounded-full
      />
    </div> -->
    
  </SectionBanner>
</template>
