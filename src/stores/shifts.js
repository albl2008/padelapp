import { defineStore } from 'pinia';
import { getAllShifts, getShiftsNextDays } from '@/api/shifts';

export const useShiftsStore = defineStore({
  id: 'shifts',
  state: () => ({
    shifts: [],
    notification: null,
  }),
  actions: {
    async fetchShifts() {
      try {
        const response = await getAllShifts();
        this.setShifts(response.data.results);
      } catch (error) {
        console.error('Error fetching shifts:', error);
      }
    },
    async getNextShifts(body) {
      try {
        const response = await getShiftsNextDays(body);
        this.setShifts(response.data);
      } catch (error) {
        console.error('Error fetching shifts:', error);
      } 
    },
    setShifts(shifts) {
      this.shifts = shifts;
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