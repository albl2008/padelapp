<!-- DeleteConfirmationModal.vue -->
<template>
    <div v-if="isActive">
      <CardBox>
        <p>{{ confirmationMessage }}</p>
        <template #footer>
          <BaseButtons>
            <BaseButton :label="confirmLabel" :color="confirmColor" @click="confirm" />
            <BaseButton v-if="hasCancel" label="Cancelar" :color="cancelColor" outline @click="cancel" />
          </BaseButtons>
        </template>
      </CardBox>
    </div>
  </template>
  
  <script setup>
  import BaseButtons from '@/components/BaseButtons.vue';
  import BaseButton from '@/components/BaseButton.vue';
  import CardBox from '@/components/CardBox.vue';
  
  const props = defineProps({
    isActive: Boolean,
    item: {
      type: String,
      required: true,
    },
    confirmLabel: {
      type: String,
      default: 'Confirmar',
    },
    confirmColor: {
      type: String,
      default: 'info',
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
  });
  
  const emit = defineEmits();
  
  const confirm = () => {
    // Emit an event to confirm the action and pass the itemIdToDelete
    emit('confirm', props.item);
  };
  
  const cancel = () => {
    // Emit an event to cancel the action
    emit('cancel');
  };
  </script>
  