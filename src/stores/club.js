import { defineStore } from 'pinia';
import { getAllClubs } from '@/api/club';
import { getActiveClub } from '@/api/club';
import { useAuthStore } from './auth';

export const useClubStore = defineStore({
  id: 'club',
  state: () => ({
    clubs: [],
    notification: null,
    activeClubId: null,
    activeClub:null
  }),
  actions: {
    async fetchClubs() {
      try {
        const response = await getAllClubs();
        this.setClubs(response.data.results);
        return response.data.results
      } catch (error) {
        console.error('Error fetching clubs:', error);
      }
    },

    async getActiveClub() {
      try {
        const authStore = useAuthStore();
        const response = await getActiveClub();
        this.setActiveClub(response.data.id, response.data);
        authStore.setActiveClub(response.data.id);
        return response.data
      } catch (error) {
        console.error('Error fetching active club:', error);
      } 
    },
    setClubs(clubs) {
      this.clubs = clubs;
    },

    setActiveClub(clubId, club) {
      const authStore = useAuthStore();
      authStore.setActiveClub(clubId);
      this.activeClubId = clubId;
      this.activeClub = club;
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