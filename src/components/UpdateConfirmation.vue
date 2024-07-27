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
    item: {
      type: String,
      default: undefined,
    },
    
  });
  
  const emit = defineEmits();
  
  const confirm = (itemId) => {
    // Emit an event to confirm the action and pass the itemIdToDelete
    
    emit('confirm', itemId);
  };
  
  const cancel = () => {
    // Emit an event to cancel the action
    emit('cancel');
  };

  
  </script>





<template>
    <div v-if="isActive">
      <CardBox>
        <p>{{ confirmationMessage }}</p>
        <template #footer>
          <BaseButtons class="flex" >
            <div class="flex items-center justify-end p-6">
                <BaseButton label="Confirmar" color="success" @click="confirm(item)" />
                <BaseButton v-if="hasCancel" label="Cancelar" :color="cancelColor" outline @click="cancel" />
            </div>
          </BaseButtons>
        </template>
      </CardBox>      
    </div>
</template>
  
  
  