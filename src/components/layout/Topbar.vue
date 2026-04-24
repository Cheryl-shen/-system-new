<template>
  <div class="topbar">
    <button class="mobile-menu-btn" @click="toggleSidebar">☰</button>
    <div class="topbar-brand">
      <div class="topbar-logo">战</div>
      <div class="topbar-title">
        战略客户部<span>·</span>华南拓展中心
      </div>
    </div>
    <div class="topbar-right">
      <span class="topbar-tag">内部资料</span>
      <span class="topbar-time">{{ currentTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject } from 'vue'

const currentTime = ref('')
const toggleSidebar = inject<() => void>('toggleSidebar')!

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0') + ' ' +
    String(now.getHours()).padStart(2, '0') + ':' +
    String(now.getMinutes()).padStart(2, '0')
}

let timer: ReturnType<typeof setInterval>

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 30000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.topbar {
  height: var(--topbar-h);
  background: var(--bg-white);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 24px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  box-shadow: var(--shadow-sm);
}

.topbar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.topbar-logo {
  width: 34px;
  height: 34px;
  background: linear-gradient(135deg, #2b5aed, #6366f1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
}

.topbar-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
}

.topbar-title span {
  color: var(--text-light);
  font-weight: 400;
  margin: 0 6px;
}

.topbar-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 14px;
}

.topbar-tag {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 12px;
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 500;
}

.topbar-time {
  font-size: 12px;
  color: var(--text-light);
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 4px;
}

/* 用户区 */
.user-area {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 4px 4px;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.15s;
  user-select: none;
  margin-left: 4px;
}

.user-area:hover {
  background: var(--bg);
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.user-meta {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.user-name {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text);
}

.user-role {
  font-size: 10.5px;
  color: var(--text-light);
  margin-top: 2px;
}

.user-role.admin {
  color: #b45309;
  font-weight: 600;
}

.user-caret {
  font-size: 10px;
  color: var(--text-light);
  transition: transform 0.2s;
}

.user-caret.open {
  transform: rotate(180deg);
}

.user-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 220px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
  padding: 6px;
  z-index: 250;
  cursor: default;
}

.menu-header {
  padding: 10px 12px 8px;
}

.mh-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.mh-sub {
  font-size: 11px;
  color: var(--text-light);
  margin-top: 2px;
}

.mh-customers {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.menu-divider {
  height: 1px;
  background: var(--border-light);
  margin: 4px 0;
}

.menu-item {
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  background: transparent;
  font-size: 13px;
  color: var(--text);
  cursor: pointer;
  transition: background 0.1s;
}

.menu-item:hover {
  background: var(--bg);
}

.menu-item.danger {
  color: #dc2626;
}

.menu-item.danger:hover {
  background: #fef2f2;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: block;
  }
  
  .topbar-title span {
    display: none;
  }

  .topbar-time,
  .user-meta {
    display: none;
  }

  .topbar-tag {
    display: none;
  }
}
</style>
