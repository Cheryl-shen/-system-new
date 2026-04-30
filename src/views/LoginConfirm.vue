<!--
  登录确认页面
  当后端返回 449 状态码时显示此页面
  用户需要点击确认才能进入系统
-->
<template>
  <div class="confirm-page">
    <div class="confirm-card">
      <div class="avatar">
        {{ user?.displayName?.charAt(0) || user?.loginName?.charAt(0) || '👤' }}
      </div>
      
      <h2>登录确认</h2>
      
      <p class="user-info">
        您正在以 <span class="user-name">{{ displayName }}</span> 的身份登录
        <br>
        <span class="user-detail">员工账号: {{ user?.loginName }}</span>
      </p>
      
      <button 
        class="confirm-btn" 
        :disabled="loading"
        @click="onConfirm"
      >
        {{ loading ? '确认中...' : '确认登录' }}
      </button>
      
      <div 
        v-if="statusMessage" 
        class="status-message"
        :class="{ error: statusType === 'error', success: statusType === 'success' }"
      >
        {{ statusMessage }}
      </div>
      
      <div class="notice">
        仅限内部成员访问 · 内部资料严禁外传
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/api/auth';

interface TofUser {
  loginName: string;
  staffId: string;
  displayName: string;
  chineseName?: string;
}

const router = useRouter();
const auth = useAuthStore();
const loading = ref(false);
const user = ref<TofUser | null>(null);
const statusMessage = ref('');
const statusType = ref<'error' | 'success' | ''>('');

const displayName = computed(() => {
  if (!user.value) return '加载中...';
  return user.value.chineseName || user.value.displayName || user.value.loginName;
});

/** 获取认证状态 */
async function checkAuth() {
  try {
    const result = await authApi.checkAuthStatus();
    
    if (result.authenticated && result.user) {
      user.value = result.user;
      
      // 如果已有有效会话，直接跳转
      if (result.sessionValid) {
        handleLoginSuccess(result.user);
        return;
      }
      // 否则显示确认页面，等待用户点击确认
    } else {
      // 未认证，跳转到登录页
      router.replace('/login');
    }
  } catch (e) {
    statusMessage.value = '无法获取用户信息，请确认通过内网访问';
    statusType.value = 'error';
  }
}

/** 确认登录 */
async function onConfirm() {
  if (loading.value) return;
  loading.value = true;
  statusMessage.value = '';
  
  try {
    const result = await authApi.confirmLogin();
    
    if (result.success) {
      statusMessage.value = '✓ 登录成功，正在跳转...';
      statusType.value = 'success';
      
      // 延迟跳转
      setTimeout(() => {
        if (result.user) {
          handleLoginSuccess(result.user);
        } else {
          router.replace('/');
        }
      }, 800);
    } else {
      statusMessage.value = result.message || '登录失败';
      statusType.value = 'error';
      loading.value = false;
    }
  } catch (e: any) {
    statusMessage.value = e?.message || '网络错误，请重试';
    statusType.value = 'error';
    loading.value = false;
  }
}

/** 处理登录成功 */
function handleLoginSuccess(userData: any) {
  // 更新 auth store
  if (userData) {
    auth.updateUser({
      username: userData.loginName || userData.username,
      displayName: userData.displayName || userData.chineseName || userData.loginName,
      role: userData.role || 'manager',
      customerIds: userData.customerIds || [],
      authMode: 'tof'
    }, 'tof');
    // 设置一个 token 标记（TOF 模式不需要真正的 JWT token，但 store 需要 token 存在来判断 isLoggedIn）
    if (!auth.token) {
      auth.setAuth('tof-session-active', {
        username: userData.loginName || userData.username,
        displayName: userData.displayName || userData.chineseName || userData.loginName,
        role: userData.role || 'manager',
        customerIds: userData.customerIds || [],
        authMode: 'tof'
      }, 'tof');
    }
  }
  
  // 跳转
  const returnUrl = new URLSearchParams(window.location.search).get('return') || '/';
  router.replace(returnUrl);
}

onMounted(() => {
  checkAuth();
});
</script>

<style scoped>
.confirm-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.confirm-card {
  background: white;
  border-radius: 16px;
  padding: 48px 40px;
  max-width: 420px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

h2 {
  color: #333;
  margin: 0 0 8px;
  font-size: 24px;
}

.user-info {
  color: #666;
  margin-bottom: 32px;
  font-size: 14px;
  line-height: 1.6;
}

.user-name {
  font-weight: 600;
  color: #333;
  font-size: 18px;
}

.user-detail {
  color: #999;
  font-size: 12px;
}

.confirm-btn {
  display: inline-block;
  padding: 14px 48px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 8px 18px rgba(102, 126, 234, 0.28);
}

.confirm-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(102, 126, 234, 0.4);
}

.confirm-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.status-message {
  margin-top: 16px;
  font-size: 14px;
  min-height: 20px;
  color: #666;
}

.status-message.error {
  color: #e74c3c;
}

.status-message.success {
  color: #27ae60;
}

.notice {
  margin-top: 24px;
  font-size: 11.5px;
  color: #94a3b8;
}
</style>
