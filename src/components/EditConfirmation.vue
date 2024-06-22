<!-- DeleteConfirmationModal.vue -->
<script setup>
  import BaseButtons from '@/components/BaseButtons.vue';
  import BaseButton from '@/components/BaseButton.vue';
  import CardBox from '@/components/CardBox.vue';
  import { ref, computed, onMounted } from 'vue';

  import { useCourtsStore } from '@/stores/courts';


  const courtsStore = useCourtsStore();

  const items = computed(() => courtsStore.courts);

  console.log(items.value)
  
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
  
  const confirm = (courtId) => {
    // Emit an event to confirm the action and pass the itemIdToDelete
    
    emit('confirm', courtId);
  };
  
  const cancel = () => {
    // Emit an event to cancel the action
    emit('cancel');
  };

  onMounted( async() => {
    await courtsStore.fetchCourts();
  })
  </script>





<template>
    <div v-if="isActive">
      <CardBox>
        <template #footer>
          <BaseButtons>
            <div v-for="item in items">
              <BaseButton :label="'Cancha: ' + item.number + ''" :color="confirmColor" @click="confirm(item.id)" />
            </div>
            <BaseButton v-if="hasCancel" label="Cancelar" :color="cancelColor" outline @click="cancel" />
          </BaseButtons>
        </template>
      </CardBox>
     
      
    </div>
  </template>
  
  
  