<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import { useAuthStore } from '@/stores/auth'


const form = reactive({
  email: '',
})

const router = useRouter()

const authStore = useAuthStore()

const submit = async () => {
  try {
    
    const resetResponse = await authStore.forgotPassword({
      email: form.email,
    });

    if (resetResponse) {
      console.log(resetResponse)
    }
  } catch (error) {
    // Handle errors
    console.error('Reset password failed:', error);
  }
}
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <FormField label="Email" help="Please enter your email">
          <FormControl
            v-model="form.email"
            :icon="mdiAccount"
            name="email"
            autocomplete="email"
          />
        </FormField>

        
        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" outline color="info" label="Send Reset" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
