import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('./pages/Home.vue')
const Catalog = () => import('./pages/Catalog.vue')
const MovieDetail = () => import('./pages/MovieDetail.vue')
const Admin = () => import('./pages/Admin.vue')

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/catalog', name: 'catalog', component: Catalog },
    { path: '/movie/:id', name: 'movie', component: MovieDetail, props: true },
    { path: '/admin', name: 'admin', component: Admin },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})
