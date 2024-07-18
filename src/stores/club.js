import { defineStore } from 'pinia';
import { getAllClubs } from '@/api/club';

export const useClubStore = defineStore({
  id: 'club',
  state: () => ({
    clubs: [],
    notification: null,
  }),
  actions: {
    async fetchClubs() {
      try {
        const response = await getAllClubs();
        this.setClubs(response.data.results);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      }
    },
    setClubs(clubs) {
      this.clubs = clubs;
    },

    getClub() {
      if (this.clubs){
        return this.clubs
      }
     
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