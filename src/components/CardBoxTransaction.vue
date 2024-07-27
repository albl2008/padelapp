<script setup>
import { computed } from 'vue'
import { mdiCashMinus, mdiCashPlus, mdiReceipt, mdiCreditCardOutline, mdiCalendar, mdiClock } from '@mdi/js'
import CardBox from '@/components/CardBox.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import PillTag from '@/components/PillTag.vue'
import IconRounded from '@/components/IconRounded.vue'

const props = defineProps({
  amount: {
    type: Number,
  },
  date: {
    type: String,
    required: true
  },
  businessStyle: {
    type: String,
  },
  business: {
    type: String,
  },
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  account: {
    type: String,
    required: true
  }
})

const icon = computed(() => {
  if (props.type === 'booked') {
    return {
      icon: mdiCalendar,
      type: 'warning'
    }
  } else if (props.type === 'available') {
    return {
      icon: mdiClock,
      type: 'success'
    }
  } else if (props.type === 'invoice') {
    return {
      icon: mdiReceipt,
      type: 'warning'
    }
  }

  return {
    icon: mdiCreditCardOutline,
    type: 'info'
  }
})
</script>

<template>
  <CardBox class="mb-6 last:mb-0">
    <BaseLevel>
      <BaseLevel type="justify-start">
        <IconRounded :icon="icon.icon" :color="icon.type" class="md:mr-6" />
        <div class="text-center space-y-1 md:text-left md:mr-6">
          <h4 class="text-xl">{{ title }}</h4>
          <p class="text-gray-500 dark:text-slate-400">
            <b>{{ date }}</b> - <span :class="businessStyle">{{ business }}</span>
          </p>
        </div>
      </BaseLevel>
      <div class="text-center md:text-right space-y-2">
        <p class="text-sm text-gray-500">
          {{ name }}
        </p>
        <div>
          <PillTag :color="icon.type" :label="type === 'booked' ? 'Agendado' : 'Disponible'" small />
        </div>
      </div>
    </BaseLevel>
  </CardBox>
</template>
