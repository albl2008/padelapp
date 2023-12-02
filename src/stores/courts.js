import { defineStore } from 'pinia';
import { getAllCourts } from '@/api/courts';

export const useCourtsStore = defineStore({
  id: 'courts',
  state: () => ({
    courts: [],
    notification: null,
  }),
  actions: {
    async fetchCourts() {
      try {
        const response = await getAllCourts();
        this.setCourts(response.data.results);
      } catch (error) {
        console.error('Error fetching courts:', error);
      }
    },
    setCourts(courts) {
      this.courts = courts;
    },

    setNotification({ message, type }) {
      
      this.notification = { message, type };
    },
    // Add resetNotification method
    resetNotification() {
      
      this.notification = null;
    },
  },
});