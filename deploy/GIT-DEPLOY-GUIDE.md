# Git Deploy Guide - Deploy via Git Clone

> Target Server: `21.214.41.205`
> Domain: `strategicsouth.woa.com`
> Git Repo: `https://github.com/Cheryl-shen/-system-new.git`

---

## Overview

Deploy flow:
1. Push code to GitHub from local machine
2. On the server, clone the repo via git
3. Run the deploy script on the server to build and start services

---

## Step 0: Push Latest Code to GitHub (Local Machine)

```bash
cd /Users/cherylshen/Desktop/platform
git add -A
git commit -m "deploy: ready for server deployment"
git push origin main
```

---

## Step 1: Install Git on Server (WebShell)

```bash
# Check if git is installed
if ! command -v git &>/dev/null; then
  dnf install -y git || yum install -y git
fi
git --version
```

---

## Step 2: Clone the Repository (WebShell)

```bash
# Create project base directory
mkdir -p /opt/strategic-platform

# Clone the repo
cd /opt
git clone https://github.com/Cheryl-shen/-system-new.git strategic-platform-src

# Verify
ls /opt/strategic-platform-src/
```

> If the repo is private, use a Personal Access Token:
> ```bash
> git clone https://<YOUR_TOKEN>@github.com/Cheryl-shen/-system-new.git strategic-platform-src
> ```
> Generate token at: https://github.com/settings/tokens

---

## Step 3: Install Dependencies on Server (WebShell)

```bash
# Install Node.js 20.x
if ! command -v node &>/dev/null || [[ "$(node -v | cut -d. -f1 | tr -d 'v')" -lt 18 ]]; then
  curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
  dnf install -y nodejs || yum install -y nodejs
fi

# Install Nginx
if ! command -v nginx &>/dev/null; then
  dnf install -y nginx || yum install -y nginx
fi

# Install build tools (for better-sqlite3)
dnf install -y gcc gcc-c++ make python3 || yum install -y gcc gcc-c++ make python3

# Verify
echo "Node: $(node -v)"
echo "Nginx: $(nginx -v 2>&1)"
```

---

## Step 4: Build Frontend on Server (WebShell)

```bash
cd /opt/strategic-platform-src

# Install frontend dependencies and build
npm install
npm run build

# Copy build output to serve directory
mkdir -p /opt/strategic-platform/dist
cp -r dist/* /opt/strategic-platform/dist/

echo "Frontend build complete"
```

---

## Step 5: Setup Backend (WebShell)

```bash
# Copy server files
mkdir -p /opt/strategic-platform/server/data

cp /opt/strategic-platform-src/deploy/server/package.json /opt/strategic-platform/server/
cp /opt/strategic-platform-src/deploy/server/server.js /opt/strategic-platform/server/
cp /opt/strategic-platform-src/deploy/server/db.js /opt/strategic-platform/server/
cp /opt/strategic-platform-src/deploy/server/tof.js /opt/strategic-platform/server/

# Install backend dependencies
cd /opt/strategic-platform/server
npm install --production

echo "Backend setup complete"
```

---

## Step 6: Configure Environment Variables (WebShell)

> Replace YOUR_APP_TOKEN and YOUR_JWT_SECRET with real values

```bash
cat > /opt/strategic-platform/server/.env << 'EOF'
TAI_APP_TOKEN=YOUR_APP_TOKEN
AUTH_MODE=auto
TOF_ALLOWED_USERS=
JWT_SECRET=YOUR_JWT_SECRET
PORT=3000
DB_PATH=/opt/strategic-platform/server/data/strategic.db
EOF

chmod 600 /opt/strategic-platform/server/.env
echo "Environment configured"
```

---

## Step 7: Create systemd Service (WebShell)

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

systemctl daemon-reload
systemctl enable strategic-platform
systemctl restart strategic-platform

sleep 3
systemctl is-active strategic-platform && echo "API server started OK" || echo "FAILED - check: journalctl -u strategic-platform --no-pager -n 20"
```

---

## Step 8: Configure Nginx (WebShell)

```bash
cat > /etc/nginx/conf.d/strategic-platform.conf << 'EOF'
upstream backend {
    server 127.0.0.1:3000;
}

server {
    listen       80;
    server_name  strategicsouth.woa.com _;

    root /opt/strategic-platform/dist;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 1024;

    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass_request_headers on;
        proxy_connect_timeout 60s;
        proxy_read_timeout 60s;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location ~ /\. {
        deny all;
    }
}
EOF

# Remove default config if exists
[ -f /etc/nginx/conf.d/default.conf ] && mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bak
[ -f /etc/nginx/sites-enabled/default ] && rm -f /etc/nginx/sites-enabled/default

# Test and reload
nginx -t && systemctl reload nginx && echo "Nginx OK" || echo "Nginx config ERROR"
systemctl enable nginx
```

---

## Step 9: Verify Deployment (WebShell)

```bash
echo "=== Health Check ==="
curl -s http://localhost/api/health
echo ""

echo "=== Service Status ==="
systemctl is-active strategic-platform
systemctl is-active nginx

echo "=== Ports ==="
ss -tlnp | grep -E ':(80|3000)\s'

echo ""
echo "=============================="
echo " Deploy complete!"
echo " URL: http://strategicsouth.woa.com"
echo "=============================="
```

---

## Future Updates (Git Pull)

After pushing new code to GitHub, update the server:

### Frontend Only Update:
```bash
cd /opt/strategic-platform-src
git pull origin main
npm run build
cp -r dist/* /opt/strategic-platform/dist/
systemctl reload nginx
echo "Frontend updated"
```

### Backend Update:
```bash
cd /opt/strategic-platform-src
git pull origin main
cp deploy/server/*.js /opt/strategic-platform/server/
cd /opt/strategic-platform/server
npm install --production
systemctl restart strategic-platform
echo "Backend updated"
```

### Full Update (one-liner):
```bash
cd /opt/strategic-platform-src && git pull origin main && npm run build && cp -r dist/* /opt/strategic-platform/dist/ && cp deploy/server/*.js /opt/strategic-platform/server/ && cd /opt/strategic-platform/server && npm install --production && systemctl restart strategic-platform && systemctl reload nginx && echo "Full update done"
```

---

## Troubleshooting

### Git clone fails (network issue)
```bash
# If GitHub is slow from server, try mirror or shallow clone
git clone --depth 1 https://github.com/Cheryl-shen/-system-new.git strategic-platform-src

# Or use Gitee mirror (if you mirror the repo to Gitee)
git clone https://gitee.com/YOUR_USER/YOUR_REPO.git strategic-platform-src
```

### npm install fails
```bash
# Use taobao registry for faster download in China
npm config set registry https://registry.npmmirror.com
cd /opt/strategic-platform-src && npm install
```

### Permission denied
```bash
# Make sure you are running as root or with sudo
whoami
```
