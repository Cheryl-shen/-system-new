<!--
  统一登录页
  支持两种认证模式：
  1. TOF 模式：通过 NGate 网关，自动从 Header 读取用户信息
  2. JWT 模式：本地 OAuth2 登录，从 Authorization Header 读取 Token
-->
<template>
  <div class="login-page">
    <!-- TOF 认证中状态 -->
    <div v-if="tofChecking" class="login-card tof-checking">
      <div class="spinner"></div>
      <p>正在验证登录状态...</p>
    </div>
    
    <!-- TOF 认证失败，显示登录表单 -->
    <template v-else>
      <div class="login-bg"></div>
      <div class="login-card">
        <div class="login-brand">
          <div class="login-logo">战</div>
          <div class="login-brand-text">
            <h1>战略客户部 · 华南拓展中心</h1>
            <p>数据 &amp; 文档汇总平台</p>
          </div>
        </div>

        <h2 class="login-title">登录</h2>
        <p class="login-subtitle">仅限内部成员访问</p>

        <div v-if="errorMsg" class="form-error">{{ errorMsg }}</div>

        <form class="login-form" @submit.prevent="onSubmit">
          <div class="form-item">
            <label>账号</label>
            <input
              v-model="username"
              type="text"
              autocomplete="username"
              placeholder="请输入账号"
              :disabled="loading"
              @input="errorMsg = ''"
            />
          </div>
          <div class="form-item">
            <label>密码</label>
            <input
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="请输入密码"
              :disabled="loading"
              @input="errorMsg = ''"
            />
          </div>

          <button
            type="submit"
            class="login-btn login-btn-pwd"
            :disabled="loading || !canSubmit"
          >
            {{ loading ? '登录中…' : '登 录' }}
          </button>
        </form>

        <div class="login-footer">
          忘记密码请联系管理员 · 内部资料严禁外传
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

const username = ref('');
const password = ref('');
const loading = ref(false);
const tofChecking = ref(true);
const errorMsg = ref('');

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const canSubmit = computed(
  () => username.value.trim().length > 0 && password.value.length > 0
);

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
 */
async function checkTofAuth() {
  try {
    const result = await authApi.checkTofAuth();
    if (result.authenticated) {
      // 已通过 TOF 认证，检查是否需要登录确认
      const authStatus = await authApi.checkAuthStatus();
      
      if (authStatus.authenticated) {
        if (authStatus.sessionValid) {
          // 已有有效会话，直接进入系统
          const user = await authApi.me();
          auth.updateUser(user, 'tof');
          router.replace(safeNext());
          return;
        } else {
          // 需要登录确认，跳转到确认页面
          const returnUrl = encodeURIComponent(safeNext());
          router.replace(`/login/confirm?return=${returnUrl}`);
          return;
        }
      }
    }
  } catch (e) {
    console.error('TOF 认证检查失败:', e);
  } finally {
    tofChecking.value = false;
  }
}

/**
 * 账密登录
 */
async function onSubmit() {
  if (!canSubmit.value || loading.value) return;
  loading.value = true;
  errorMsg.value = '';

  const u = username.value.trim();
  const p = password.value;

  try {
    const res = await authApi.login(u, p);
    auth.setAuth(res.token, res.user, 'jwt');
    router.replace(safeNext());
  } catch (e: any) {
    errorMsg.value = e?.message || '登录失败，请检查账号密码';
  } finally {
    loading.value = false;
  }
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

.login-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-item label {
  display: block;
  font-size: 12px;
  color: #475569;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-item input {
  width: 100%;
  box-sizing: border-box;
  height: 42px;
  padding: 0 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #0f172a;
  background: #fff;
  transition: all 0.15s;
  outline: none;
}

.form-item input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.form-item input:disabled {
  background: #f8fafc;
  color: #94a3b8;
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
}

.login-btn-pwd {
  background: linear-gradient(135deg, #2b5aed, #6366f1);
  box-shadow: 0 8px 18px rgba(99, 102, 241, 0.28);
}

.login-btn-pwd:hover:not(:disabled) {
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

@media (max-width: 480px) {
  .login-card {
    padding: 28px 22px;
  }
  .login-brand-text h1 {
    font-size: 14px;
  }
}
</style>