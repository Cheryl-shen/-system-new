# DevCloud WebShell 部署指南

> 适用于无法从本机 SSH 直连服务器，需通过 DevCloud WebShell 手动操作的场景。
> 目标服务器: `21.214.41.205`  
> 域名: `strategicsouth.woa.com`（DNS 已配置）

---

## 前置条件

1. 在本机先构建前端产物（在项目根目录执行）：
```bash
cd /Users/cherylshen/Desktop/platform
npm run build
```

2. 将构建产物和后端代码打包上传到 DevCloud：
```bash
# 在项目根目录执行，生成部署包
tar -czf strategic-platform-deploy.tar.gz \
  dist/ \
  deploy/server/ \
  deploy/nginx.conf
```

3. 通过 DevCloud 将 `strategic-platform-deploy.tar.gz` 传输到服务器 `/tmp/` 目录。

---

## 在 WebShell 中逐步执行

### Step 1: 安装基础依赖

```bash
# 检测并安装 Nginx
if ! command -v nginx &>/dev/null; then
  echo "安装 Nginx..."
  dnf install -y nginx || yum install -y nginx
fi

# 安装 Node.js 20.x
if ! command -v node &>/dev/null || [[ "$(node -v | cut -d. -f1 | tr -d 'v')" -lt 18 ]]; then
  echo "安装 Node.js 20..."
  curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
  dnf install -y nodejs || yum install -y nodejs
fi

# 安装编译工具（better-sqlite3 需要）
dnf install -y gcc gcc-c++ make python3 || yum install -y gcc gcc-c++ make python3

# 确认版本
echo "Node.js: $(node -v)"
echo "Nginx: $(nginx -v 2>&1)"
```

### Step 2: 创建项目目录并解压部署包

```bash
# 创建项目目录
mkdir -p /opt/strategic-platform/{dist,server/data,logs}

# 解压部署包
cd /tmp
tar -xzf strategic-platform-deploy.tar.gz

# 复制前端产物
cp -r dist/* /opt/strategic-platform/dist/

# 复制后端代码
cp deploy/server/package.json /opt/strategic-platform/server/
cp deploy/server/server.js /opt/strategic-platform/server/
cp deploy/server/db.js /opt/strategic-platform/server/
cp deploy/server/tof.js /opt/strategic-platform/server/

echo "文件部署完成"
```

### Step 3: 安装后端依赖

```bash
cd /opt/strategic-platform/server
npm install --production
echo "后端依赖安装完成"
```

### Step 4: 配置环境变量

> ⚠️ **请将下面的 `你的APP_TOKEN` 和 `你的JWT_SECRET` 替换为你实际的值**

```bash
cat > /opt/strategic-platform/server/.env << 'EOF'
# 太湖鉴权配置
TAI_APP_TOKEN=你的APP_TOKEN
AUTH_MODE=auto
TOF_ALLOWED_USERS=

# JWT 密钥（32位以上随机字符串）
JWT_SECRET=你的JWT_SECRET

# 服务端口
PORT=3000

# 数据库路径
DB_PATH=/opt/strategic-platform/server/data/strategic.db
EOF

chmod 600 /opt/strategic-platform/server/.env
echo "环境变量配置完成"
```

### Step 5: 配置 systemd 服务

```bash
cat > /etc/systemd/system/strategic-platform.service << 'EOF'
[Unit]
Description=Strategic Platform API Server
After=network.target nginx.service

[Service]
Type=simple
WorkingDirectory=/opt/strategic-platform/server
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5
EnvironmentFile=/opt/strategic-platform/server/.env
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# 重载并启动服务
systemctl daemon-reload
systemctl enable strategic-platform
systemctl restart strategic-platform

# 等待 3 秒后检查状态
sleep 3
systemctl is-active strategic-platform && echo "✅ API 服务启动成功" || echo "❌ 服务启动失败，执行: journalctl -u strategic-platform --no-pager -n 20"
```

### Step 6: 配置 Nginx

```bash
# 备份旧配置（如有）
mkdir -p /etc/nginx/backup
[ -f /etc/nginx/conf.d/strategic-platform.conf ] && \
  cp /etc/nginx/conf.d/strategic-platform.conf /etc/nginx/backup/strategic-platform.conf.bak

# 写入新 Nginx 配置
cat > /etc/nginx/conf.d/strategic-platform.conf << 'EOF'
upstream backend {
    server 127.0.0.1:3000;
}

server {
    listen       80;
    server_name  strategicsouth.woa.com _;

    root /opt/strategic-platform/dist;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 1024;

    # API 请求 → Node.js 后端
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 太湖注入的头必须透传
        proxy_pass_request_headers on;

        # 超时设置
        proxy_connect_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Vue Router History 模式 → 所有非文件请求回 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
    }
}
EOF

# 移除默认配置（如有）
[ -f /etc/nginx/conf.d/default.conf ] && mv /etc/nginx/conf.d/default.conf /etc/nginx/backup/default.conf.bak
[ -f /etc/nginx/sites-enabled/default ] && rm -f /etc/nginx/sites-enabled/default

# 验证并重载 Nginx
nginx -t && systemctl reload nginx && echo "✅ Nginx 配置完成" || echo "❌ Nginx 配置有误"

# 启用 Nginx 开机自启
systemctl enable nginx
```

### Step 7: 验证部署

```bash
echo "=== 健康检查 ==="
curl -s http://localhost/api/health
echo ""

echo "=== TOF 鉴权检查 ==="
curl -s http://localhost/api/auth/check
echo ""

echo "=== 服务状态 ==="
systemctl is-active strategic-platform
systemctl is-active nginx
echo ""

echo "=== 端口监听 ==="
ss -tlnp | grep -E ':(80|3000)\s'
echo ""

echo "=========================================="
echo " ✅ 部署完成！"
echo " 访问地址: http://strategicsouth.woa.com"
echo "=========================================="
```

---

## 常用运维命令

| 操作 | 命令 |
|------|------|
| 查看 API 服务状态 | `systemctl status strategic-platform` |
| 查看 API 日志 | `journalctl -u strategic-platform -f` |
| 重启 API 服务 | `systemctl restart strategic-platform` |
| 查看 Nginx 状态 | `systemctl status nginx` |
| 查看 Nginx 错误日志 | `tail -f /var/log/nginx/error.log` |
| 检查 Nginx 配置 | `nginx -t` |
| 重载 Nginx | `systemctl reload nginx` |

---

## 后续更新部署（仅前端更新时）

1. 本机重新构建：`npm run build`
2. 打包：`tar -czf dist-update.tar.gz dist/`
3. 上传到服务器后执行：
```bash
cd /tmp
tar -xzf dist-update.tar.gz
cp -r dist/* /opt/strategic-platform/dist/
systemctl reload nginx
echo "前端更新完成"
```

## 后续更新部署（后端更新时）

1. 打包：`tar -czf server-update.tar.gz deploy/server/`
2. 上传到服务器后执行：
```bash
cd /tmp
tar -xzf server-update.tar.gz
cp deploy/server/*.js /opt/strategic-platform/server/
cd /opt/strategic-platform/server && npm install --production
systemctl restart strategic-platform
echo "后端更新完成"
```

---

## 故障排查

### API 服务启动失败
```bash
journalctl -u strategic-platform --no-pager -n 50
# 检查 .env 是否正确
cat /opt/strategic-platform/server/.env
# 手动运行调试
cd /opt/strategic-platform/server && node server.js
```

### Nginx 502 Bad Gateway
```bash
# 确认 API 服务在运行
systemctl is-active strategic-platform
# 确认 3000 端口正在监听
ss -tlnp | grep 3000
# 查看 Nginx 错误日志
tail -20 /var/log/nginx/error.log
```

### 域名无法访问
```bash
# 确认 DNS 解析
nslookup strategicsouth.woa.com
# 确认 Nginx 监听 80 端口
ss -tlnp | grep :80
# 检查防火墙
firewall-cmd --list-ports 2>/dev/null || iptables -L -n | grep 80
```
