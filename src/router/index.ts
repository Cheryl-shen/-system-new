import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/sales-guide',
    name: 'SalesGuide',
    component: () => import('@/views/SalesGuide.vue')
  },
  {
    path: '/discount',
    name: 'Discount',
    component: () => import('@/views/Discount.vue')
  },
  {
    path: '/cost',
    name: 'Cost',
    component: () => import('@/views/Cost.vue')
  },
  {
    path: '/product-guide',
    name: 'ProductGuide',
    component: () => import('@/views/ProductGuide.vue')
  },
  {
    path: '/strategy',
    name: 'Strategy',
    component: () => import('@/views/Strategy.vue')
  },
  {
    path: '/news',
    name: 'News',
    component: () => import('@/views/News.vue')
  },
  {
    path: '/new-products',
    name: 'NewProducts',
    component: () => import('@/views/NewProducts.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
