import { defineStore } from 'pinia';
import { getAllConfig } from '@/api/config';

export const useConfigStore = defineStore({
  id: 'config',
  state: () => ({
    config: [],
    notification: null,
  }),
  actions: {
    async fetchConfig() {
      try {
        const response = await getAllConfig();
        this.setConfig(response.data.results);
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    },
    setConfig(config) {
      this.config = config;
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