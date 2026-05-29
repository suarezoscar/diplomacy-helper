import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/game/:code',
    name: 'Lobby',
    component: () => import('@/views/LobbyView.vue'),
  },
  {
    path: '/game/:code/play',
    name: 'Game',
    component: () => import('@/views/GameView.vue'),
  },
  {
    path: '/game/:code/history',
    name: 'History',
    component: () => import('@/views/HistoryView.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
