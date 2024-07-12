<!-- DeleteConfirmationModal.vue -->
<script setup>
  import BaseButtons from '@/components/BaseButtons.vue';
  import BaseButton from '@/components/BaseButton.vue';
  import CardBox from '@/components/CardBox.vue';

  const props = defineProps({
    isActive: Boolean,
    confirmLabel: {
      type: String,
      default: 'Confirmar',
    },
    confirmColor: {
      type: String,
      default: 'warning',
    },
    hasCancel: {
      type: Boolean,
      default: true,
    },
    cancelColor: {
      type: String,
      default: 'info',
    },
    confirmationMessage: {
      type: String,
      default: 'Asignar este turno?',
    },
    events: {
      type: Array,
      default: () => [],
    },
    
  });
  
  const emit = defineEmits();
  
  const confirm = (shiftId) => {
    // Emit an event to confirm the action and pass the itemIdToDelete
    console.log(shiftId)
    emit('confirm', shiftId);
  };
  
  const cancel = () => {
    // Emit an event to cancel the action
    emit('cancel');
  };

  
  </script>





<template>
    <div v-if="isActive">
      <CardBox>
        <template #footer>
          <BaseButtons class="flex" >
            <div class="" v-for="item in events">
              <BaseButton :label="'Cancha: ' + item.court.number + ''" :color="item.status.id === 0 ? 'success' : confirmColor" @click="confirm(item.id)" />
            </div>
            
            
          </BaseButtons>

          
        </template>
        
      </CardBox>
      <div class="flex items-center justify-end p-6">
              <BaseButton v-if="hasCancel" label="Cancelar" :color="cancelColor" outline @click="cancel" />
            </div>
      
    </div>
  </template>
  
  
  