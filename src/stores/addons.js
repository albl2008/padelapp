import { defineStore } from 'pinia';
import { getAllAddons } from '@/api/addons';

export const useAddonStore = defineStore({
  id: 'addons',
  state: () => ({
    addons: [],
    notification: null,
  }),
  actions: {
    async fetchAddon() {
      try {
        const response = await getAllAddons();
        this.setAddon(response.data.results);
      } catch (error) {
        console.error('Error fetching addons:', error);
      }
    },
    setAddon(addons) {
      this.addons = addons;
    },

    getAddon() {
      if (this.addons){
        return this.addons
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