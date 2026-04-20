<template>
  <div class="loading-wrapper" :class="{ 'full-screen': fullscreen }">
    <div class="loading-content">
      <div class="loading-spinner"></div>
      <span class="loading-text">{{ text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text?: string
  fullscreen?: boolean
}>()
</script>

<style scoped>
.loading-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 40px;
}

.loading-wrapper.full-screen {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: var(--bg-white);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: loading-spin 0.8s linear infinite;
}

@keyframes loading-spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 14px;
  color: var(--text-secondary);
}
</style>
