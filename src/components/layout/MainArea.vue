<template>
  <div class="main-area">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.main-area {
  margin-left: var(--sidebar-w);
  margin-top: var(--topbar-h);
  height: calc(100vh - var(--topbar-h));
  overflow-y: auto;
  padding: 24px;
}

@media (max-width: 768px) {
  .main-area {
    margin-left: 0;
    padding: 16px;
  }
}
</style>
