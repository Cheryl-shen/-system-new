<template>
  <div v-if="hasPermission" class="permission-guard">
    <slot />
  </div>
  <div v-else class="permission-denied">
    <div class="denied-icon">🔒</div>
    <h3>权限不足</h3>
    <p>{{ message }}</p>
    <button v-if="showContact" class="contact-btn" @click="handleContact">
      联系管理员
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  requiredRole?: string
  message?: string
  showContact?: boolean
}>(), {
  requiredRole: 'EDITOR',
  message: '您没有权限访问此内容，请联系管理员',
  showContact: true
})

// 模拟用户角色（实际项目中从 store 获取）
const userRole = computed(() => {
  // TODO: 从 auth store 获取实际角色
  return 'VIEWER'
})

const hasPermission = computed(() => {
  const roleHierarchy: Record<string, number> = {
    ADMIN: 3,
    EDITOR: 2,
    VIEWER: 1
  }
  
  const requiredLevel = roleHierarchy[props.requiredRole] || 2
  const userLevel = roleHierarchy[userRole.value] || 1
  
  return userLevel >= requiredLevel
})

const handleContact = () => {
  // TODO: 打开联系管理员对话框
  console.log('Contact admin')
}
</script>

<style scoped>
.permission-denied {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  text-align: center;
}

.denied-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.permission-denied h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 8px 0;
}

.permission-denied p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 24px 0;
  line-height: 1.6;
}

.contact-btn {
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

.contact-btn:hover {
  background: var(--primary-hover);
}
</style>
