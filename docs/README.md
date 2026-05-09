# 📚 文档目录

> 战略客户部 · 华南拓展中心 · 华南AI智策数据平台 - 操作文档汇总

---

## 日常操作

| 文档 | 说明 | 适用场景 |
|------|------|----------|
| [内容更新 SOP](./内容更新SOP.md) | 各模块数据更新指南 | 更新 AI 动态、售卖弹药、成本变化等数据 |
| [开发模式登录 SOP](./开发模式登录SOP.md) | 本地开发环境登录 | 本地开发调试时使用 |

---

## 部署运维

| 文档 | 说明 | 适用场景 |
|------|------|----------|
| [正式环境部署 SOP](./正式环境部署SOP.md) | 生产环境更新流程 | 日常代码更新部署（推荐） |
| [Git 部署指南](../deploy/GIT-DEPLOY-GUIDE.md) | Git 克隆首次部署 | 新服务器首次部署 |
| [WebShell 部署指南](../deploy/WEBSHELL-DEPLOY-GUIDE.md) | DevCloud 手动部署 | 无法 SSH 直连时使用 |
| [部署脚本说明](../deploy/README.md) | deploy.sh 使用说明 | 一键部署脚本参考 |

---

## 快速链接

### 常用命令

```bash
# 本地开发
npm run dev

# 构建生产版本
npm run build

# 一键部署
bash deploy/deploy.sh root@21.214.41.205
```

### 服务器常用命令

```bash
# 查看服务状态
systemctl status strategic-platform

# 查看实时日志
journalctl -u strategic-platform -f

# 健康检查
curl http://localhost/api/health
```

### 关键路径

| 项目 | 路径 |
|------|------|
| 线上地址 | https://strategicsouth.woa.com |
| 服务器 IP | 21.214.41.205 |
| 前端目录 | `/opt/strategic-platform/dist/` |
| 后端目录 | `/opt/strategic-platform/server/` |
| 源码目录 | `/opt/strategic-platform-src/` |
| Nginx 配置 | `/etc/nginx/conf.d/strategic-platform.conf` |

---

*最后更新: 2026-05-09*
