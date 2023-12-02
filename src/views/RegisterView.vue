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
import axios from 'axios'

const form = reactive({
  name: '',
  email: '',
  password: '',
  remember: true
})

const router = useRouter()

const submit = async() => {
    try {
          const response = await axios.post('http://localhost:3000/v1/auth/register', {
            name: "Alvaro",
            email: "alvaroblanco10@gmail.com",
            password: "101201230a",
          });
  
          // Handle the response as needed
          console.log('Registration successful:', response.data);
          router.push('/login')
        } catch (error) {
          // Handle errors
          console.error('Registration failed:', error);
        }
 
}
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <FormField label="Name" help="Please enter your name">
          <FormControl
            v-model="form.name"
            :icon="mdiAccount"
            name="name"
            autocomplete="name"
          />
        </FormField>

        <FormField label="Email" help="Please enter your email">
          <FormControl
            v-model="form.email"
            :icon="mdiAccount"
            type="email"
            name="email"
            autocomplete="email"
          />
        </FormField>

        <FormField label="Password" help="Please enter your password">
          <FormControl
            v-model="form.password"
            :icon="mdiAsterisk"
            type="password"
            name="password"
            autocomplete="current-password"
          />
        </FormField>

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Register" />
            <BaseButton to="/dashboard" color="info" outline label="Back" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
