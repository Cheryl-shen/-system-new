<template>
  <div class="sidebar" :class="{ open: sidebarOpen }">
    <div class="sidebar-header">
      <h3>导航菜单</h3>
    </div>
    <nav class="sidebar-nav">
      <div
        v-for="item in menuItems"
        :key="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        @click="navigate(item.path)"
      >
        <span class="nav-icon" v-html="item.icon"></span>
        <span class="nav-label">{{ item.label }}</span>
        <span v-if="item.badge" class="nav-badge" :class="item.badgeClass">{{ item.badge }}</span>
      </div>
    </nav>
    <div class="sidebar-footer">
      战略客户部 · 华南拓展中心<br>数据&文档汇总平台
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const sidebarOpen = inject<boolean>('sidebarOpen')!
const closeSidebar = inject<() => void>('closeSidebar')!

const menuItems = [
  { path: '/', label: '首页概览', icon: '&#127968;' },
  { path: '/sales-guide', label: '售卖弹药', icon: '&#127919;', badge: 'AI', badgeClass: 'info' },
  { path: '/cost', label: '成本变化', icon: '&#128200;', badge: 'NEW' },
  { path: '/product-guide', label: '产品售卖指引', icon: '&#128230;' },
  { path: '/strategy', label: '客户战略分析', icon: '&#127919;' },
  { path: '/news', label: 'AI 与云商动态', icon: '&#128240;', badge: 'HOT', badgeClass: '' },
  { path: '/new-products', label: '官网上新', icon: '&#127381;', badge: 'NEW' }
]

const isActive = (path: string) => {
  return route.path === path
}

const navigate = (path: string) => {
  router.push(path)
  closeSidebar()
}
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-w);
  position: fixed;
  left: 0;
  top: var(--topbar-h);
  bottom: 0;
  background: var(--bg-white);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  z-index: 150;
  transition: transform 0.25s ease;
}

.sidebar-header {
  padding: 18px 18px 12px;
  border-bottom: 1px solid var(--border-light);
}

.sidebar-header h3 {
  font-size: 11px;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 8px 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-secondary);
  transition: all 0.15s;
  margin-bottom: 2px;
  user-select: none;
  position: relative;
}

.nav-item:hover {
  background: var(--bg);
  color: var(--text);
}

.nav-item.active {
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 600;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  background: var(--primary);
  border-radius: 0 3px 3px 0;
}

.nav-icon {
  width: 20px;
  text-align: center;
  font-size: 16px;
  flex-shrink: 0;
}

.nav-label {
  flex: 1;
}

.nav-badge {
  font-size: 10px;
  padding: 1px 7px;
  border-radius: 10px;
  background: var(--red);
  color: #fff;
  font-weight: 500;
}

.nav-badge.info {
  background: var(--primary-light);
  color: var(--primary);
}

.sidebar-footer {
  padding: 14px 18px;
  border-top: 1px solid var(--border-light);
  font-size: 11px;
  color: var(--text-light);
  text-align: center;
}
</style>
