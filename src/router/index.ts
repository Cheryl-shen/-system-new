import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// ============================================================
// 认证配置
// ============================================================
// 启用统一认证（支持 TOF + JWT 双模式）
// - TOF 模式：通过 NGate 网关，自动从 Header 读取用户信息
// - JWT 模式：本地 OAuth2 登录，从 Authorization Header 读取 Token
const AUTH_ENABLED = true;

// 本地简易登录开关（开发调试用）
// 账号：strategic  密码：strategic 2026
const LOCAL_AUTH_ENABLED = false;
const LOCAL_AUTH_KEY = 'sc.local.auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { layout: 'blank', public: true }
  },
  {
    path: '/login/confirm',
    name: 'LoginConfirm',
    component: () => import('@/views/LoginConfirm.vue'),
    meta: { layout: 'blank', public: true }
  },
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
  },
  {
    path: '/model-price',
    name: 'ModelPrice',
    component: () => import('@/views/ModelPrice.vue')
  },
  {
    path: '/model-ranking',
    name: 'ModelRanking',
    component: () => import('@/views/ModelRanking.vue')
  },
  // 兜底：任何未匹配路径回首页
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

/**
 * 全局登录守卫
 * - /login 与带 meta.public 的路由允许匿名
 * - 其余路由必须已登录；未登录跳 /login?next=...
 * - 若已登录访问 /login，自动回首页
 */
router.beforeEach(async (to) => {
  // 本地简易登录：没登录过 → 踹到 /login；登录过进 /login → 回首页
  if (LOCAL_AUTH_ENABLED) {
    const logged = localStorage.getItem(LOCAL_AUTH_KEY) === '1';
    if (!logged && to.name !== 'Login') {
      return {
        path: '/login',
        query: to.fullPath && to.fullPath !== '/' ? { next: to.fullPath } : {}
      };
    }
    if (logged && to.name === 'Login') {
      const next = (to.query.next as string | undefined) || '/';
      return next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/login')
        ? next
        : '/';
    }
    return true;
  }

  // 总开关关闭时，直接放行所有路由
  // 同时，如果用户主动进了 /login 页，也把他送回首页，避免看到登录界面
  if (!AUTH_ENABLED) {
    if (to.name === 'Login') return '/';
    return true;
  }

  const auth = useAuthStore();
  // 首次进入时，基于 localStorage 里的 token 做一次 /api/auth/me 验活
  if (!auth.bootstrapped) {
    await auth.bootstrap();
  }

  const isPublic = to.meta?.public === true || to.name === 'Login';

  if (!auth.isLoggedIn && !isPublic) {
    return {
      path: '/login',
      query: to.fullPath && to.fullPath !== '/' ? { next: to.fullPath } : {}
    };
  }

  if (auth.isLoggedIn && to.name === 'Login') {
    const next = (to.query.next as string | undefined) || '/';
    return next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/login')
      ? next
      : '/';
  }

  return true;
});

export default router;
