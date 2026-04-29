#!/bin/bash
# setup-transfer.sh - Generate transfer chunks for server deployment
# Run this LOCALLY, then paste chunks into DevCloud WebShell

set -e

LOCAL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$LOCAL_DIR"

echo "=== Building frontend ==="
npm run build

echo "=== Packaging files ==="
tar czf /tmp/deploy-dist.tar.gz -C dist .
tar czf /tmp/deploy-server.tar.gz -C deploy server/package.json server/server.js server/db.js server/tof.js nginx.conf

DIST_B64=$(base64 < /tmp/deploy-dist.tar.gz)
SERVER_B64=$(base64 < /tmp/deploy-server.tar.gz)

# Split dist into 4000-char chunks
CHUNK_SIZE=4000
TOTAL_DIST=${#DIST_B64}
DIST_CHUNKS=$(( (TOTAL_DIST + CHUNK_SIZE - 1) / CHUNK_SIZE ))

echo ""
echo "============================================"
echo " DIST: ${TOTAL_DIST} chars -> ${DIST_CHUNKS} chunks"
echo " SERVER: ${#SERVER_B64} chars -> 1 chunk"
echo "============================================"
echo ""

OUT_DIR="/tmp/deploy-chunks"
mkdir -p "$OUT_DIR"

# Write chunk 0: server + env + nginx config
cat > "$OUT_DIR/chunk-00-server.sh" << 'HEADER'
#!/bin/bash
mkdir -p /opt/strategic-platform/{dist,server/data,logs}
HEADER

echo "echo '${SERVER_B64}' | base64 -d | tar xzf - -C /opt/strategic-platform/" >> "$OUT_DIR/chunk-00-server.sh"

cat >> "$OUT_DIR/chunk-00-server.sh" << 'FOOTER'
cp /opt/strategic-platform/nginx.conf /etc/nginx/conf.d/strategic-platform.conf
FOOTER

# Write dist chunks
OFFSET=0
CHUNK_NUM=0
while [ $OFFSET -lt $TOTAL_DIST ]; do
  CHUNK=${DIST_B64:$OFFSET:$CHUNK_SIZE}
  PADNUM=$(printf "%02d" $CHUNK_NUM)
  echo "echo '${CHUNK}' >> /tmp/dist.b64" > "$OUT_DIR/chunk-dist-${PADNUM}.sh"
  OFFSET=$((OFFSET + CHUNK_SIZE))
  CHUNK_NUM=$((CHUNK_NUM + 1))
done

# Write final assemble script
cat > "$OUT_DIR/chunk-final.sh" << 'FINAL'
echo '=== Extracting dist ==='
base64 -d /tmp/dist.b64 | tar xzf - -C /opt/strategic-platform/dist/
rm -f /tmp/dist.b64

echo '=== Installing dependencies ==='
cd /opt/strategic-platform/server && npm install --production 2>&1 | tail -3

echo '=== Setting up env ==='
cat > /opt/strategic-platform/server/.env << 'ENVEOF'
TAI_APP_TOKEN=your-tai-app-token
AUTH_MODE=auto
TOF_ALLOWED_USERS=
JWT_SECRET=your-32-character-random-secret
PORT=3000
DB_PATH=/opt/strategic-platform/server/data/strategic.db
ENVEOF

echo '=== Setting up systemd service ==='
cat > /etc/systemd/system/strategic-platform.service << 'SVCEOF'
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

[Install]
WantedBy=multi-user.target
SVCEOF

# Find node binary path
NODE_BIN=$(which node)
sed -i "s|/usr/bin/node|${NODE_BIN}|g" /etc/systemd/system/strategic-platform.service

systemctl daemon-reload
systemctl enable strategic-platform
systemctl restart strategic-platform
sleep 2

echo '=== Configuring Nginx ==='
[ -f /etc/nginx/conf.d/default.conf ] && mv /etc/nginx/conf.d/default.conf /etc/nginx/backup/ 2>/dev/null
nginx -t 2>&1 && systemctl reload nginx

echo '=== Verifying ==='
curl -s http://localhost/api/health
echo ''
curl -s http://localhost/api/auth/check
echo ''
systemctl is-active strategic-platform nginx
echo ''
echo '=== DONE ==='
FINAL

echo "=== Chunks generated in $OUT_DIR ==="
ls -la "$OUT_DIR/"
echo ""
echo "=== Total chunks to paste: $((DIST_CHUNKS + 2)) ==="
echo "Order: chunk-00-server.sh, chunk-dist-00.sh ... chunk-dist-$((DIST_CHUNKS-1)).sh, chunk-final.sh"
