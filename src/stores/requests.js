import { defineStore } from 'pinia';
import { getAllRequests } from '@/api/requests';

export const useRequestStore = defineStore({
  id: 'requests',
  state: () => ({
    requests: [],
    notification: null,
  }),
  actions: {
    async fetchRequest() {
      try {
        const response = await getAllRequests();
        this.setRequest(response.data.results);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    },
    setRequest(requests) {
      this.requests = requests;
    },

    getRequest() {
      if (this.requests){
        return this.requests
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