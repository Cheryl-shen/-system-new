<!--
  统一登录页 - 仅支持 TOF 认证
  通过 NGate 网关自动从 Header 读取用户信息
-->
<template>
  <div class="login-page">
    <!-- TOF 认证中状态 -->
    <div v-if="tofChecking" class="login-card tof-checking">
      <div class="spinner"></div>
      <p>正在验证登录状态...</p>
    </div>
    
    <!-- TOF 认证失败，显示提示 -->
    <template v-else>
      <div class="login-bg"></div>
      <div class="login-card">
        <div class="login-brand">
          <div class="login-logo">战</div>
          <div class="login-brand-text">
            <h1>华南智策</h1>
            <p>数据 &amp; 文档汇总平台</p>
          </div>
        </div>

        <div class="login-status">
          <div class="status-icon">🔒</div>
          <h2 class="login-title">需要登录</h2>
          <p class="login-subtitle">请通过公司内网访问，或联系管理员</p>
          
          <div v-if="errorMsg" class="form-error">{{ errorMsg }}</div>
          
          <button
            class="login-btn login-btn-tof"
            @click="retryCheck"
          >
            重新检查登录状态
          </button>

          <!-- 开发模式登录入口 -->
          <div v-if="devLoginEnabled" class="dev-login-section">
            <div class="dev-divider">
              <span>开发模式</span>
            </div>
            <button
              class="login-btn login-btn-dev"
              @click="handleDevLogin"
              :disabled="devLoading"
            >
              🛠️ 开发模式登录 ({{ devUserRole }})
            </button>
            <p class="dev-hint">仅用于本地开发调试，生产环境已禁用</p>
          </div>
        </div>

        <div class="login-footer">
          仅限内部成员访问 · 内部资料严禁外传
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/api/auth';

const loading = ref(false);
const tofChecking = ref(true);
const errorMsg = ref('');
const devLoading = ref(false);

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

// 开发模式是否启用
const devLoginEnabled = computed(() => {
  return import.meta.env.VITE_DEV_LOGIN === 'true';
});

// 开发用户角色
const devUserRole = computed(() => {
  return import.meta.env.VITE_DEV_USER || 'admin';
});

/** 取 next 目标路径；避免 open-redirect */
function safeNext(): string {
  const candidates = [route.query.next, route.query.redirect];
  for (const v of candidates) {
    if (
      typeof v === 'string' &&
      v.startsWith('/') &&
      !v.startsWith('//') &&
      !v.startsWith('/login')
    ) {
      return v;
    }
  }
  return '/';
}

/**
 * 检查 TOF 认证状态
 * 简化版：直接尝试获取用户信息，成功则跳转
 */
async function checkTofAuth() {
  tofChecking.value = true;
  errorMsg.value = '';
  
  try {
    // 直接获取用户信息，TOF 认证通过后端会自动识别
    const user = await authApi.me();
    auth.updateUser(user, 'tof');
    // 设置 token 标识
    if (!auth.token) {
      auth.setAuth('tof-session', user, 'tof');
    }
    router.replace(safeNext());
    return;
  } catch (e: any) {
    // 401 = 未认证，显示提示
    console.log('TOF 认证检查:', e?.response?.status || e);
    errorMsg.value = '未检测到登录信息，请通过公司内网访问';
  } finally {
    tofChecking.value = false;
  }
}

/**
 * 开发模式登录
 */
async function handleDevLogin() {
  devLoading.value = true;
  errorMsg.value = '';
  
  try {
    const result = await auth.devLogin();
    if (result.success) {
      // 开发登录成功，直接进入系统
      router.replace(safeNext());
    } else {
      errorMsg.value = result.message || '开发登录失败';
    }
  } catch (e: any) {
    console.error('开发登录失败:', e);
    errorMsg.value = '开发登录失败，请重试';
  } finally {
    devLoading.value = false;
  }
}

/**
 * 重新检查登录状态
 */
function retryCheck() {
  checkTofAuth();
}

onMounted(() => {
  checkTofAuth();
});
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  position: relative;
  overflow: hidden;
  background: #f5f7fb;
}

.login-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(43, 90, 237, 0.12), transparent 45%),
    radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.14), transparent 50%),
    linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%);
  z-index: 0;
}

.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 16px;
  box-shadow:
    0 20px 60px rgba(30, 41, 80, 0.12),
    0 2px 8px rgba(30, 41, 80, 0.05);
  padding: 36px 36px 28px;
}

/* TOF 检查中状态 */
.login-card.tof-checking {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 48px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.login-card.tof-checking p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.login-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}

.login-logo {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: linear-gradient(135deg, #2b5aed, #6366f1 55%, #8b5cf6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3);
}

.login-brand-text h1 {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.3;
}

.login-brand-text p {
  font-size: 12px;
  color: #64748b;
  margin: 2px 0 0;
}

.login-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin: 24px 0;
}

.status-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.login-title {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.login-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0 22px;
}

.form-error {
  background: #fef2f2;
  color: #b91c1c;
  font-size: 12.5px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #fecaca;
  margin-bottom: 14px;
  word-break: break-word;
}

.login-btn {
  margin-top: 10px;
  height: 44px;
  border-radius: 8px;
  border: none;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.login-btn-tof {
  background: linear-gradient(135deg, #2b5aed, #6366f1);
  box-shadow: 0 8px 18px rgba(99, 102, 241, 0.28);
}

.login-btn-tof:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(99, 102, 241, 0.4);
}

.login-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.login-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 11.5px;
  color: #94a3b8;
  letter-spacing: 0.3px;
}

/* 开发模式登录样式 */
.dev-login-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.dev-divider {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  color: #94a3b8;
  font-size: 12px;
}

.dev-divider::before,
.dev-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.dev-divider span {
  padding: 0 12px;
  background: #fff;
  border-radius: 4px;
  color: #64748b;
  font-weight: 500;
}

.login-btn-dev {
  background: linear-gradient(135deg, #f59e0b, #f97316);
  box-shadow: 0 8px 18px rgba(249, 115, 22, 0.28);
}

.login-btn-dev:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(249, 115, 22, 0.4);
}

.dev-hint {
  margin-top: 8px;
  font-size: 11px;
  color: #94a3b8;
  text-align: center;
}

@media (max-width: 480px) {
  .login-card {
    padding: 28px 22px;
  }
  .login-brand-text h1 {
    font-size: 14px;
  }
}
</style>