<template>
  <div class="app-container">
    <Topbar />
    <Sidebar />
    <MainArea>
      <router-view />
    </MainArea>
    <div class="overlay" :class="{ show: sidebarOpen }" @click="closeSidebar"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import Topbar from '@/components/layout/Topbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import MainArea from '@/components/layout/MainArea.vue'

const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

provide('sidebarOpen', sidebarOpen)
provide('toggleSidebar', toggleSidebar)
provide('closeSidebar', closeSidebar)
</script>

<style scoped>
.app-container {
  height: 100vh;
  overflow: hidden;
}

.overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 140;
}

.overlay.show {
  display: block;
}

@media (max-width: 768px) {
  :deep(.sidebar) {
    transform: translateX(-100%);
  }
  
  :deep(.sidebar.open) {
    transform: translateX(0);
    box-shadow: var(--shadow-lg);
  }
}
</style>
