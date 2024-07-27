import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useCourtsStore } from './courts'
import { useShiftsStore } from './shifts';
import { useConfigStore } from './config';
import { useAuthStore } from './auth';
import { useAddonStore } from './addons';
import { useClubStore } from './club';
import { useNotificationStore } from './notifications';


export const useMainStore = defineStore('main', () => {
  const userName = ref('John Doe')
  const userEmail = ref('doe.doe.doe@example.com')

  const userAvatar = computed(
    () =>
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail.value.replace(
        /[^a-z0-9]+/gi,
        '-'
      )}`
  )

  const isFieldFocusRegistered = ref(false)

  const courtsStore = useCourtsStore()

  const clients = ref([])
  const history = ref([])

  function fetchNotifications() {
    useNotificationStore().getNotifications()
  }

  function resetAllNotifications(){
    useCourtsStore().resetNotification()
    useShiftsStore().resetNotification()
    useConfigStore().resetNotification()
    useAuthStore().resetNotification()
    useAddonStore().resetNotification()
    useClubStore().resetNotification()
  }

  function setUser(payload) {
    if (payload.name) {
      userName.value = payload.name
    }
    if (payload.email) {
      userEmail.value = payload.email
    }
  }

  function fetchSampleClients() {
    axios
      .get(`data-sources/clients.json?v=3`)
      .then((result) => {
        clients.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function fetchSampleHistory() {
    axios
      .get(`data-sources/history.json`)
      .then((result) => {
        history.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function initializeFromLocalStorage() {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }

    // You can similarly initialize other state properties from localStorage if needed
  }

  // Call the initialization method when the store is created
  initializeFromLocalStorage();

  return {
    userName,
    userEmail,
    userAvatar,
    isFieldFocusRegistered,
    clients,
    history,
    setUser,
    fetchSampleClients,
    fetchSampleHistory,
    resetAllNotifications,
    fetchNotifications
  }
})
