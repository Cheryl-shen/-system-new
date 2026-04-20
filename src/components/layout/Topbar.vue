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

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: block;
  }
  
  .topbar-title span {
    display: none;
  }
}
</style>
