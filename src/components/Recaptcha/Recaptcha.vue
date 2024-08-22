<script setup>
import { ref } from 'vue';
import axios from 'axios';




const captchaVerified = ref(false);
const siteKey = import.meta.env.VITE_GOOGLE_RECAPTCHA_SITE_KEY
const secretKey = import.meta.env.VITE_GOOGLE_RECAPTCHA_PRIVATE_KEY

const emit = defineEmits();




const  verifyCaptcha =  async (token) =>{
  const verifyUrl = `https://www.google.env.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
  debugger

  try {
    const response = await axios.post(verifyUrl);
    const data = response.data;

    if (data.success) {
      captchaVerified.value = true;
       // Emit response including success information
    } else {
      captchaVerified.value = false;
      // Handle failed verification (e.g., display error message)
    }

    emit('captcha-verified', response);
  } catch (error) {
    console.error('Error verifying captcha:', error);
    captchaVerified.value = false; // Set to false for error handling
  }
}





</script>


<template>
    <div class="mt-4 flex justify-center">
              
        <div class="g-recaptcha" :data-sitekey="siteKey" @callback="verifyCaptcha($event)"></div>
      </div>
</template>