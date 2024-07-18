import {
  mdiAccountCircle,
  mdiMonitor,
  mdiAccountGroup,
  mdiShieldAccount,
  mdiGithub,
  mdiLock,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTable,
  mdiViewList,
  mdiCalendar,
  // mdiTelevisionGuide,
  // mdiResponsive,
  mdiPalette,
  mdiReact,
  mdiSettingsHelper,
  mdiCardsClub
} from '@mdi/js'

export default [
  {
    to: '/dashboard',
    icon: mdiMonitor,
    label: 'Dashboard'
  },
  {
    to: '/courts',
    label: 'Canchas',
    icon: mdiPalette
  },
  // {
  //   to: '/tables',
  //   label: 'Tables',
  //   icon: mdiTable
  // },
  {
    to: '/calendar',
    label: 'Calendario',
    icon: mdiCalendar
  },
  {
    to: '/config',
    label: 'Config',
    icon: mdiSettingsHelper
  },
  // {
  //   to: '/forms',
  //   label: 'Forms',
  //   icon: mdiSquareEditOutline
  // },
  // {
  //   to: '/ui',
  //   label: 'UI',
  //   icon: mdiTelevisionGuide
  // },
  // {
  //   to: '/responsive',
  //   label: 'Responsive',
  //   icon: mdiResponsive
  // },
  // {
  //   to: '/',
  //   label: 'Styles',
  //   icon: mdiPalette
  // },
  {
    to: '/profile',
    label: 'Profile',
    icon: mdiAccountCircle
  },
  {
    to: '/club',
    label: 'Club',
    icon: mdiAccountGroup
  },
  // {
  //   to: '/login',
  //   label: 'Login',
  //   icon: mdiLock
  // },
  // {
  //   to: '/error',
  //   label: 'Error',
  //   icon: mdiAlertCircle
  // },
  // {
  //   label: 'Dropdown',
  //   icon: mdiViewList,
  //   menu: [
  //     {
  //       label: 'Item One'
  //     },
  //     {
  //       label: 'Item Two'
  //     }
  //   ]
  // },
  // {
  //   href: 'https://github.com/justboil/admin-one-vue-tailwind',
  //   label: 'GitHub',
  //   icon: mdiGithub,
  //   target: '_blank'
  // },
  // {
  //   href: 'https://github.com/justboil/admin-one-react-tailwind',
  //   label: 'React version',
  //   icon: mdiReact,
  //   target: '_blank'
  // }
]
