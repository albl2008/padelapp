// menuNavBar.js
import {
  mdiAccount,
  mdiBell,
  mdiCogOutline,
  mdiLogout,
  mdiBellOutline,
  mdiThemeLightDark,
  mdiBellAlertOutline,
} from '@mdi/js'

import { useNotificationStore } from '@/stores/notifications'
import { watch, ref, onMounted} from 'vue'

export default function useMenuNavBar() {
  const notificationStore = useNotificationStore()
  const notifications = notificationStore.notifications
  const notificationsArray = ref([])

  watch(notifications, () => {
    debugger
    notifications.value = notifications
  })

  onMounted(async () => {
    await notificationStore.getNotifications()
  })
  

  return [
    {
      isCurrentUser: true,
      menu: [
        {
          icon: mdiAccount,
          label: 'My Profile',
          to: '/profile'
        },
        {
          isDivider: true
        },
        {
          icon: mdiLogout,
          label: 'Log Out',
          isLogout: true
        }
      ]
    },
    {
      name: 'notification',
      icon: notificationStore.notifications.length > 0 ? mdiBellAlertOutline : mdiBell ,
      menu: notifications && notifications.length > 0 ? notifications.map(notification => ({
        label: notification.message,
        to: `/${notification.type.id}` 
      })) : [{label: 'Sin notificaciones'}]
    },
    {
      icon: mdiThemeLightDark,
      label: 'Light/Dark',
      isDesktopNoLabel: true,
      isToggleLightDark: true
    },
    {
      icon: mdiLogout,
      label: 'Log out',
      isDesktopNoLabel: true,
      isLogout: true
    }
  ]
}
