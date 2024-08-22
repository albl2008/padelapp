<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useMainStore } from '@/stores/main'
import FormControlIcon from '@/components/FormControlIcon.vue'
import { mdiEye, mdiEyeOff } from '@mdi/js';

const props = defineProps({
  name: {
    type: String,
    default: null
  },
  id: {
    type: String,
    default: null
  },
  disabled: Boolean, 
  autocomplete: {
    type: String,
    default: null
  },
  maxlength: {
    type: String,
    default: null
  },
  placeholder: {
    type: String,
    default: null
  },
  inputmode: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: null
  },
  options: {
    type: Array,
    default: null
  },
  type: {
    type: String,
    default: 'text'
  },
  modelValue: {
    type: [String, Number, Boolean, Array, Object],
    default: ''
  },
  error: Boolean,
  required: Boolean,
  borderless: Boolean,
  transparent: Boolean,
  ctrlKFocus: Boolean
})

const emit = defineEmits(['update:modelValue', 'setRef'])

const showPassword = ref(false)

const computedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

const inputElClass = computed(() => {
  const base = [
    'px-3 py-2 max-w-full focus:ring focus:outline-none border-gray-700 rounded w-full',
    'dark:placeholder-gray-400',
    computedType.value === 'textarea' ? 'h-24' : 'h-12',
    props.borderless ? 'border-0' : 'border',
    props.transparent ? 'bg-transparent' : 'bg-white dark:bg-slate-800',
    props.error ? 'border-red-500' : ''
  ]

  if (props.icon) {
    base.push('pl-10')
  }

  return base
})



const computedType = computed(() => (props.options ? 'select' : props.type))

const controlIconH = computed(() => (props.type === 'textarea' ? 'h-full' : 'h-12'))

const mainStore = useMainStore()

const selectEl = ref(null)

const textareaEl = ref(null)

const inputEl = ref(null)

// Toggle password visibility
const togglePasswordVisibility = () => {
  const newType = computedType.value === 'password' ? 'text' : 'password';
  showPassword.value = !showPassword.value
  
}

onMounted(() => {
  if (selectEl.value) {
    emit('setRef', selectEl.value)
  } else if (textareaEl.value) {
    emit('setRef', textareaEl.value)
  } else {
    emit('setRef', inputEl.value)
  }
})

if (props.ctrlKFocus) {
  const fieldFocusHook = (e) => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault()
      inputEl.value.focus()
    } else if (e.key === 'Escape') {
      inputEl.value.blur()
    }
  }

  onMounted(() => {
    if (!mainStore.isFieldFocusRegistered) {
      window.addEventListener('keydown', fieldFocusHook)
      mainStore.isFieldFocusRegistered = true
    } else {
      // console.error('Duplicate field focus event')
    }
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', fieldFocusHook)
    mainStore.isFieldFocusRegistered = false
  })
}
</script>

<template>
  <div class="relative">
    <select
      v-if="computedType === 'select'"
      :id="id"
      v-model="computedValue"
      :name="name"
      :class="inputElClass"
      :disabled="disabled"
    >
      <option v-for="option in options" :key="option.id ?? option" :value="option">
        {{ option.label ?? option }}
      </option>
    </select>
    <textarea
      v-else-if="computedType === 'textarea'"
      :id="id"
      v-model="computedValue"
      :class="inputElClass"
      :name="name"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
    />
    <input
      v-else
      :id="id"
      ref="inputEl"
      v-model="computedValue"
      :name="name"
      :maxlength="maxlength"
      :inputmode="inputmode"
      :autocomplete="autocomplete"
      :required="required"
      :placeholder="placeholder"
      :type="computedType === 'password' ? (showPassword ? 'text' : 'password') : computedType"
      :class="inputElClass"
      :disabled="disabled"
    />
    <FormControlIcon v-if="icon" :icon="icon" :h="controlIconH" />
    <button
        v-if="computedType === 'password' || (showPassword && computedType === 'text')"
        type="button"
        class="absolute inset-y-0 pl-10 mt-4 right-0 pr-3 flex items-center text-gray-500"
        @click="togglePasswordVisibility"
      >
        <span v-if="computedType === 'password' && !showPassword">
          <FormControlIcon :icon="mdiEyeOff" />
        </span>
        <span v-else>
          <FormControlIcon :icon="mdiEye" />
        </span>
    </button>
  </div>
</template>


<style scoped>
/* Add your styles here */
.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background: none;
  border: none;
  cursor: pointer;
}
</style>