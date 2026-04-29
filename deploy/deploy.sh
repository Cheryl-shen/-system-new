#!/bin/bash
# deploy/deploy.sh — 一键部署脚本（适配 TencentOS 4）
# 用法: bash deploy.sh [SSH用户@IP]
# 示例: bash deploy.sh root@21.214.41.205

set -e

# ============================================================
# 配置
# ============================================================
REMOTE="${1:-root@21.214.41.205}"
SSH_PORT="${SSH_PORT:-22}"
PROJECT_DIR="/opt/strategic-platform"
LOCAL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SSH_OPTS=(-p "$SSH_PORT")
SCP_OPTS=(-P "$SSH_PORT")

remote_exec() {
  ssh "${SSH_OPTS[@]}" "$REMOTE" "$@"
}

remote_copy() {
  scp "${SCP_OPTS[@]}" "$@"
}

echo "========================================"
echo " 战略客户部数据平台 - CVM 部署脚本"
echo "========================================"
echo "远程服务器: $REMOTE"
echo "SSH 端口:   $SSH_PORT"
echo "项目目录:   $PROJECT_DIR"
echo ""

# ============================================================
# Step 0: 检测服务器系统并安装基础依赖
# ============================================================
echo "[0/7] 检测服务器系统并安装基础依赖..."
remote_exec '
# 检测系统类型
if command -v dnf &>/dev/null; then
  PKG="dnf"
elif command -v yum &>/dev/null; then
  PKG="yum"
elif command -v apt-get &>/dev/null; then
  PKG="apt"
else
  echo "无法识别包管理器"
  exit 1
fi
echo "包管理器: $PKG"

# 安装 Nginx + Node.js + 编译工具（TencentOS 用 dnf）
if [ "$PKG" = "dnf" ] || [ "$PKG" = "yum" ]; then
  # 安装 Nginx
  if ! command -v nginx &>/dev/null; then
    echo "安装 Nginx..."
    dnf install -y nginx || yum install -y nginx
  fi

  # 安装 Node.js 20.x
  if ! command -v node &>/dev/null || [ "$(node -v | cut -d. -f1)" -lt 18 ]; then
    echo "安装 Node.js 20..."
    curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
    dnf install -y nodejs || yum install -y nodejs
  fi

  # 安装编译工具（better-sqlite3 原生模块需要）
  echo "安装编译工具..."
  dnf install -y gcc gcc-c++ make python3 || yum install -y gcc gcc-c++ make python3

elif [ "$PKG" = "apt" ]; then
  if ! command -v nginx &>/dev/null; then
    apt-get update -qq && apt-get install -y -qq nginx
  fi
  if ! command -v node &>/dev/null || [ "$(node -v | cut -d. -f1)" -lt 18 ]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y -qq nodejs
  fi
  apt-get install -y -qq gcc g++ make python3
fi

# 确认版本
echo "Node.js: $(node -v)"
echo "Nginx: $(nginx -v 2>&1)"
echo "基础依赖安装完成"
'
echo ""

# ============================================================
# Step 1: 构建前端
# ============================================================
echo "[1/7] 构建前端..."
cd "$LOCAL_DIR"
npm run build
echo "前端构建完成: dist/"
echo ""

# ============================================================
# Step 2: 上传文件到服务器
# ============================================================
echo "[2/7] 上传文件到服务器..."

# 创建服务器目录
remote_exec "mkdir -p $PROJECT_DIR/{dist,server/data,logs}"

# 上传前端构建产物
remote_copy -r dist/* "$REMOTE:$PROJECT_DIR/dist/"

# 上传后端服务
remote_copy deploy/server/package.json "$REMOTE:$PROJECT_DIR/server/"
remote_copy deploy/server/server.js "$REMOTE:$PROJECT_DIR/server/"
remote_copy deploy/server/db.js "$REMOTE:$PROJECT_DIR/server/"
remote_copy deploy/server/tof.js "$REMOTE:$PROJECT_DIR/server/"

# 上传 Nginx 配置（先备份旧的）
remote_exec "mkdir -p /etc/nginx/conf.d /etc/nginx/backup 2>/dev/null; \
  [ -f /etc/nginx/conf.d/strategic-platform.conf ] && cp /etc/nginx/conf.d/strategic-platform.conf /etc/nginx/backup/strategic-platform.conf.bak; \
  true"
remote_copy deploy/nginx.conf "$REMOTE:/etc/nginx/conf.d/strategic-platform.conf"

echo "文件上传完成"
echo ""

# ============================================================
# Step 3: 安装后端依赖
# ============================================================
echo "[3/7] 安装后端依赖..."
remote_exec "cd $PROJECT_DIR/server && npm install --production 2>&1 | tail -5"
echo "依赖安装完成"
echo ""

# ============================================================
# Step 4: 配置环境变量
# ============================================================
echo "[4/7] 配置环境变量..."

# 迁移安全：如果服务器已存在 .env，则默认保留，避免覆盖生产 Token/JWT 密钥
if remote_exec "test -f $PROJECT_DIR/server/.env"; then
  echo "检测到服务器已存在 $PROJECT_DIR/server/.env，保留现有环境变量。"
else
  if [ -z "${TAI_APP_TOKEN:-}" ] || [ -z "${JWT_SECRET:-}" ]; then
    echo "首次部署需要在本地 shell 先导出 TAI_APP_TOKEN 和 JWT_SECRET："
    echo "  export TAI_APP_TOKEN='你的太湖APP_TOKEN'"
    echo "  export JWT_SECRET='32位以上随机字符串'"
    echo "  export TOF_ALLOWED_USERS='可选，英文名逗号分隔'"
    exit 1
  fi

  AUTH_MODE_VALUE="${AUTH_MODE:-auto}"
  TOF_ALLOWED_USERS_VALUE="${TOF_ALLOWED_USERS:-}"
  PORT_VALUE="${PORT:-3000}"

  {
    printf '# 太湖鉴权配置\n'
    printf 'TAI_APP_TOKEN=%s\n' "$TAI_APP_TOKEN"
    printf 'AUTH_MODE=%s\n' "$AUTH_MODE_VALUE"
    printf 'TOF_ALLOWED_USERS=%s\n' "$TOF_ALLOWED_USERS_VALUE"
    printf '\n# JWT 密钥\n'
    printf 'JWT_SECRET=%s\n' "$JWT_SECRET"
    printf '\n# 服务端口\n'
    printf 'PORT=%s\n' "$PORT_VALUE"
    printf '\n# 数据库路径\n'
    printf 'DB_PATH=%s/server/data/strategic.db\n' "$PROJECT_DIR"
  } | remote_exec "cat > $PROJECT_DIR/server/.env && chmod 600 $PROJECT_DIR/server/.env"
  echo "已创建服务器环境变量文件：$PROJECT_DIR/server/.env"
fi
echo "环境变量配置完成"
echo ""

# ============================================================
# Step 5: 配置 systemd 服务
# ============================================================
echo "[5/7] 配置 systemd 服务..."
remote_exec "cat > /etc/systemd/system/strategic-platform.service << 'SVCEOF'
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
SVCEOF"

remote_exec "systemctl daemon-reload && systemctl enable strategic-platform && systemctl restart strategic-platform"
sleep 3
remote_exec "systemctl is-active strategic-platform && echo '服务启动成功' || (echo '服务启动失败，查看日志:' && journalctl -u strategic-platform --no-pager -n 20)"
echo ""

# ============================================================
# Step 6: 配置 Nginx
# ============================================================
echo "[6/7] 配置 Nginx..."

# 确保没有默认 server block 冲突
remote_exec '
# 备份并移除默认 server 配置（如果存在）
if [ -f /etc/nginx/conf.d/default.conf ]; then
  mv /etc/nginx/conf.d/default.conf /etc/nginx/backup/default.conf.bak 2>/dev/null || true
fi
if [ -f /etc/nginx/sites-enabled/default ]; then
  rm -f /etc/nginx/sites-enabled/default
fi
'

remote_exec "nginx -t 2>&1 && systemctl reload nginx && echo 'Nginx 配置完成'" || echo "Nginx 配置有问题，请检查"
echo ""

# ============================================================
# Step 7: 验证部署
# ============================================================
echo "[7/7] 验证部署..."
echo ""

echo "--- 健康检查 ---"
remote_exec "curl -s http://localhost/api/health 2>&1" || echo "健康检查失败"
echo ""

echo "--- TOF 检查 ---"
remote_exec "curl -s http://localhost/api/auth/check 2>&1" || echo "TOF 检查失败"
echo ""

echo "--- 服务状态 ---"
remote_exec "systemctl is-active strategic-platform nginx"
echo ""

# ============================================================
# 完成
# ============================================================
echo "========================================"
echo " 部署完成！"
echo "========================================"
echo ""
echo "常用命令："
echo "  查看服务状态:  ssh -p $SSH_PORT $REMOTE 'systemctl status strategic-platform'"
echo "  查看日志:      ssh -p $SSH_PORT $REMOTE 'journalctl -u strategic-platform -f'"
echo "  重启服务:      ssh -p $SSH_PORT $REMOTE 'systemctl restart strategic-platform'"
echo "  查看 Nginx:    ssh -p $SSH_PORT $REMOTE 'nginx -t && systemctl status nginx'"
echo ""
echo "下一步："
echo "  1. 验证网络连通: curl http://rio.woa.com/opp/ws/SmartProxyCheck.aspx?targetHost=strategicsouth.woa.com"
echo "  2. 太湖平台配置站点（如已配置，等待生效）"
echo "  3. 浏览器访问 strategicsouth.woa.com 测试"
