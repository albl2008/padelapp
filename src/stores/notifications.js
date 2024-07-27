import { defineStore } from 'pinia'
import { useConfigStore } from './config';
import { useCourtsStore } from './courts';
import { useClubStore } from './club';


export const useNotificationStore = defineStore({
    id: 'notifications',
  state: () => ({
    notifications: [],
    notification: null,
    types: ['config', 'club', 'courts', 'shifts' ]
  }),

  actions: {
    resetNotification() {
      
      this.notification = null;
    },
    setNotification({ message, type }) {
      
        this.notification = { message, type };
        this.notifications.push({ message, type });
    },

    async getNotifications() {
        try {
           debugger
            const configStore = useConfigStore();
            const courtStore = useCourtsStore();
            const clubStore = useClubStore();
    
            const config = await configStore.fetchConfig();
            if (!config || config.length === 0) {
                if (!this.notifications.some(notification => notification.type.id === 'config' && notification.type.name === 'not_found')) {
                    this.notifications.push({ message: 'Cargue Configuracion', type: { id: 'config', name: 'not_found' } });
                }
            } else {
                if (this.notifications.some(notification => notification.type.id === 'config' && notification.type.name === 'not_found')) {
                  this.notifications = this.notifications.filter(notification => notification.type.id === 'config' && notification.type.name !== 'not_found');
                }
            }
    
            const courts = await courtStore.fetchCourts();
            if (!courts || courts.length === 0) {
                if (!this.notifications.some(notification => notification.type.id === 'courts' && notification.type.name === 'not_found')) {
                    this.notifications.push({ message: 'Genere sus canchas', type: { id: 'courts', name: 'not_found' } });
                }
            } else {
                if (this.notifications.some(notification => notification.type.id === 'courts' && notification.type.name === 'not_found')) {
                  this.notifications = this.notifications.filter(notification => notification.type.id === 'courts' && notification.type.name !== 'not_found');
                }
                if ((config && courts ) && courts.length < config.courtsQuantity) {
                  if (!this.notifications.some(notification => notification.type.id === 'courts' && notification.type.name === 'incomplete')) {
                      this.notifications.push({ message: 'Canchas incompletas', type: { id: 'courts', name: 'incomplete' } });
                  }
                } else if ((config && courts ) && courts.length === config.courtsQuantity) {
                  if (this.notifications.some(notification => notification.type.id === 'courts' && notification.type.name === 'incomplete')) {
                    this.notifications = this.notifications.filter(notification => notification.type.id === 'courts' && notification.type.name !== 'incomplete');
                  }
                }
            }
            
    
            const clubs = await clubStore.fetchClubs();
            debugger
            if (!clubs || clubs.length === 0) {
                if (!this.notifications.some(notification => notification.type.id === 'club' && notification.type.name === 'not_found'))  {
                    this.notifications.push({ message: 'Club no encontrado. Cargue su club.', type: { id: 'club', name: 'not_found' } });
                }
            } else {
              if (this.notifications.some(notification => notification.type.id === 'club' && notification.type.name === 'not_found')) {
                this.notifications = this.notifications.filter(notification => notification.type.id === 'club' && notification.type.name !== 'not_found');
              }
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
   
      
    }
  }
})
