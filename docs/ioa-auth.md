# IOA 登录 · 待续说明

> 状态：**暂缓启用**（2026-04-20）
> 负责人：cheryl
> 代码保留，仅用总开关临时关闭，确认接入方案后打开即可。

---

## 为什么暂缓

目前代码里已经写了一套基于 **OAuth2 授权码模式** 的 IOA 登录（前端 `/login` 页 + EdgeOne Functions 做回调换 token + 前端存 token + 路由守卫）。暂缓原因：

1. CSIG 内部推荐的做法是走 **IAS（接入服务）**，由 IAS 统一拦截并注入 `staffname` 等 Header，应用本身不需要自己跑 OAuth2 流程。走 IAS 对我们来说更省事、更合规、也更容易过安全评审。
2. 自己手写 OAuth2 的话，需要申请 CSIG 的 SSO 应用注册入口（`IOA_CLIENT_ID` / `IOA_CLIENT_SECRET`），这个入口不明显，得找同 BG 已经接过的同事要。
3. 现在处于内部试用阶段，没有外网访问场景，先用"无登录"版本演示功能更快。

---

## 临时关闭方式

**只改了一处**：`src/router/index.ts` 顶部的开关常量。

```ts
// src/router/index.ts
const AUTH_ENABLED = false;  // <- 过几天把这里改回 true 即可
```

守卫里做了：
- `AUTH_ENABLED = false` 时：直接放行所有路由；如果用户手动访问 `/login` 也会被送回首页
- `AUTH_ENABLED = true` 时：恢复原有的登录校验逻辑

**没有删任何登录相关代码**，全部保留。

---

## 相关代码位置清单

过几天恢复时，按这个清单 review 一遍即可：

| 位置 | 作用 | 恢复时要做什么 |
|---|---|---|
| `src/router/index.ts` | 路由守卫 + 开关 | 把 `AUTH_ENABLED` 改回 `true` |
| `src/views/Login.vue` | 登录页（点击按钮跳 IOA） | 确认跳转 URL 配置 |
| `src/stores/auth.ts` | Pinia 认证状态（token、user、isLoggedIn） | 无需改动 |
| `src/api/auth.ts` | 前端调 `/api/auth/me`、`/api/auth/login` 等 | 根据最终方案调整接口路径 |
| `functions/api/auth/*` | EdgeOne Functions 的 OAuth 回调、token 交换 | **如果走 IAS，这里大部分可以删**；如果坚持走 OAuth2，补齐环境变量 |
| `shared/*` | 前后端共享类型（`AuthUser` 等） | 无需改动 |

快速定位：`grep -r "TODO(IOA)" src/` 能找到所有标记点。

---

## 恢复前的待决策清单

**接入方式二选一**：

### 方案 A：走 IAS（推荐）

1. 去 `safety.woa.com` 把 EdgeOne 部署的域名接进来
2. 配置"需要 IOA 登录"
3. 后端（EdgeOne Functions）从请求 Header 读 `staffname`、`rtx` 等字段
4. **前端不再需要 `/login` 页**，`Login.vue`、`auth.ts` 大部分可以简化甚至删除
5. `functions/api/auth/callback` 等 OAuth 回调可以删除

优点：
- 无需自己管 token 生命周期
- CSIG 标准做法，安全评审容易过
- 不用申请 SSO 应用

缺点：
- 需要域名接入 IAS，外网访问受限

### 方案 B：手写 OAuth2（当前代码架构）

1. 找到 CSIG 对应的 SSO 应用注册入口，申请 `IOA_CLIENT_ID` / `IOA_CLIENT_SECRET`
2. 在 EdgeOne Functions 环境变量里配上：
   - `IOA_CLIENT_ID`
   - `IOA_CLIENT_SECRET`
   - `IOA_AUTHORIZE_URL`
   - `IOA_TOKEN_URL`
   - `IOA_USERINFO_URL`
   - `IOA_REDIRECT_URI`（EdgeOne 部署后的回调地址）
3. `AUTH_ENABLED = true`
4. 本地 mock 用户先跑通前端
5. 部署到 EdgeOne 预览环境，确认回调 URL 能正确命中
6. 线上灰度

优点：
- 灵活，外网也能用
- 现有代码基本可用

缺点：
- 需要申请 SSO 注册
- 自己管 token 续期、刷新、过期
- 安全评审相对麻烦

---

## 恢复步骤（方案 A · IAS）

```bash
# 1. 确认 safety.woa.com 已接入成功
# 2. 前端路由守卫：改成依赖后端注入的 Header，而不是 token
#    - src/router/index.ts 的 AUTH_ENABLED 可以继续保持 false（因为 IAS 层已经拦截了）
#    - 或者改成从 /api/auth/me（读 Header 返回用户）校验登录态
# 3. 清理无用代码：
#    - 删 functions/api/auth/callback、token 交换相关
#    - Login.vue 简化为"加载中"或直接 301 到首页
# 4. 部署验证
```

## 恢复步骤（方案 B · OAuth2）

```bash
# 1. 拿到 SSO 应用凭据
# 2. 在 EdgeOne 控制台配环境变量
# 3. src/router/index.ts: AUTH_ENABLED = true
# 4. 本地 npm run dev，用 mock 先验
# 5. 部署 EdgeOne，浏览器走一遍：首页 -> 跳 /login -> 跳 IOA -> 回调 -> 拿到 token -> 回首页
# 6. 刷新页面，确认 token 持久化、/api/auth/me 能正确返回用户
```

---

## 变更记录

- 2026-04-20：创建此文档；用 `AUTH_ENABLED` 开关临时关闭登录；保留全部代码。
