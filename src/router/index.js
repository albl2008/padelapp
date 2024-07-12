import { createRouter, createWebHashHistory } from 'vue-router'
//import Style from '@/views/StyleView.vue'
//import Register from '@/views/RegisterView.vue'


import VerifyView from '@/views/VerifyView.vue'
import ResetPasswordView from '@/views/auth/ResetPasswordView.vue'
import Home from '@/views/HomeView.vue'
import RegisterViewVue from '@/views/RegisterView.vue'
import StyleViewVue from '@/views/StyleView.vue'
import ForgotPasswordView from '@/views/auth/ForgotPasswordView.vue'


const routes = [
  {
    meta: {
      title: 'Select style'
    },
    path: '/',
    name: 'Home',
    component: StyleViewVue
  },
  {
    meta: {
      title: 'Register'
    },
    path: '/register',
    name: 'Register',
    component: RegisterViewVue
  },
  {
    meta: {
      title: 'Verify Email'
    },
    path: '/verify-email/:token/',
    name: 'verify-email',
    component: VerifyView
  },
  {
    meta: {
      title: 'Reset Password'
    },
    path: '/reset-password/:token/',
    name: 'reset-password',
    component: ResetPasswordView
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Dashboard'
    },
    path: '/dashboard',
    name: 'dashboard',
    component: Home,
  },
  {
    meta: {
      title: 'Tables'
    },
    path: '/tables',
    name: 'tables',
    component: () => import('@/views/TablesView.vue')
  },
  {
    meta: {
      title: 'Canchas'
    },
    path: '/courts',
    name: 'courts',
    component: () => import('@/views/courts/CourtsView.vue')
  },
  {
    meta: {
      title: 'Calendario'
    },
    path: '/calendar',
    name: 'calendar',
    component: () => import('@/views/calendar/CalendarView.vue')
  },
  {
    meta: {
      title: 'Configuracion'
    },
    path: '/config',
    name: 'config',
    component: () => import('@/views/config/ConfigView.vue')
  },
  {
    meta: {
      title: 'Extras'
    },
    path: '/addons/:idShift',
    name: 'addons',
    component: () => import('@/views/addons/AddonView.vue')
  },
  {
    meta: {
      title: 'Forms'
    },
    path: '/forms',
    name: 'forms',
    component: () => import('@/views/FormsView.vue')
  },
  {
    meta: {
      title: 'Crear Cancha'
    },
    path: '/new-court',
    name: 'create-court',
    component: () => import('@/views/courts/CreateCourtView.vue')
  },
  {
    meta: {
      title: 'Crear Configuracion'
    },
    path: '/new-config',
    name: 'create-config',
    component: () => import('@/views/config/CreateConfigView.vue')
  },
  {
    meta: {
      title: 'Editar Cancha'
    },
    path: '/edit-court/:idCourt', 
    name: 'edit-court',
    component: () => import('@/views/courts/CreateCourtView.vue')
  },
  {
    meta: {
      title: 'Editar Turno'
    },
    path: '/edit-shift/:idShift', 
    name: 'edit-shift',
    component: () => import('@/views/shifts/EditShiftView.vue')
  },
  {
    meta: {
      title: 'Agendar Turno'
    },
    path: '/book-shift/:idShift', 
    name: 'book-shift',
    component: () => import('@/views/shifts/BookShiftView.vue')
  },
  {
    meta: {
      title: 'Editar Configuracion'
    },
    path: '/edit-config/:idConfig', 
    name: 'edit-config',
    component: () => import('@/views/config/CreateConfigView.vue')
  },
  {
    meta: {
      title: 'Profile'
    },
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue')
  },
  {
    meta: {
      title: 'Ui'
    },
    path: '/ui',
    name: 'ui',
    component: () => import('@/views/UiView.vue')
  },
  {
    meta: {
      title: 'Responsive layout'
    },
    path: '/responsive',
    name: 'responsive',
    component: () => import('@/views/ResponsiveView.vue')
  },
  {
    meta: {
      title: 'Login'
    },
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    meta: {
      title: 'Forgot Password'
    },
    path: '/forgot-password',
    name: 'forgot-password',
    component:ForgotPasswordView
  },
  {
    meta: {
      title: 'Error'
    },
    path: '/error',
    name: 'error',
    component: () => import('@/views/ErrorView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

export default router
