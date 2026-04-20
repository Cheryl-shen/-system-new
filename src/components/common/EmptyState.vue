<template>
  <div class="empty-state" :class="{ 'full-screen': fullscreen }">
    <div class="empty-icon">
      <span v-html="icon"></span>
    </div>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <slot name="action">
      <button v-if="showAction" class="action-btn" @click="handleAction">
        {{ actionText }}
      </button>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  icon?: string
  showAction?: boolean
  actionText?: string
  fullscreen?: boolean
}>(), {
  title: '暂无数据',
  description: '当有新数据时会在此显示',
  icon: '&#128196;',
  showAction: false,
  actionText: '立即添加',
  fullscreen: false
})

const emit = defineEmits<{
  (e: 'action'): void
}>()

const handleAction = () => {
  emit('action')
}
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  text-align: center;
}

.empty-state.full-screen {
  min-height: 400px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 24px 0;
  line-height: 1.6;
}

.action-btn {
  padding: 10px 24px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}
</style>
