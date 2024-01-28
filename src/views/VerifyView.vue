<script setup>
import { useRouter } from 'vue-router'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import axios from 'axios'
import { onMounted } from 'vue'


const router = useRouter()

// Function to capture the token from the URL
const getTokenFromURL = () => {
  debugger
  const url = new URL(window.location.href);
  const token = url.hash.split('token=')[1];
  return token;
}

const submit = async () => {
  try {
    // Capture the token from the URL
    const token = getTokenFromURL()

    if (!token) {
      console.error('Token not found in URL')
      return
    }

    

    const response = await axios.post(`http://localhost:3000/v1/auth/verify-email?token=${token}`);

    // Handle the response as needed
    console.log('Registration successful:', response.data);
    router.push('/login');
  } catch (error) {
    // Handle errors
    console.error('Registration failed:', error);
  }
}

onMounted(() => {
  getTokenFromURL()
});



</script>

<template>
  <LayoutGuest>
    <SectionFullScreen  bg="purplePink">
        <CardBox :class="cardClass" is-form @submit.prevent="submit">
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Register" />
            <BaseButton to="/dashboard" color="info" outline label="Back" />
          </BaseButtons>
        </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
