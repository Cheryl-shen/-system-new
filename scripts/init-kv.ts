/**
 * 初始化 KV 数据（本地脚本）
 *
 * 用法：
 *   1. 先把项目部署到 EdgeOne Pages，或本地启 edgeone pages dev
 *   2. 把下面的 BASE_URL 改成你的部署地址
 *   3. 把 INIT_SECRET 改成 EdgeOne 环境变量里 JWT_SECRET 的值
 *   4. 运行：npm run init-kv
 *
 * 幂等：重复跑不会覆盖已有数据；加 --force 会全部覆盖。
 */

const BASE_URL = process.env.BASE_URL || 'https://your-edgeone-site.example';
const INIT_SECRET = process.env.JWT_SECRET || '请先设置环境变量 JWT_SECRET';
const force = process.argv.includes('--force');

async function main() {
  if (!INIT_SECRET || INIT_SECRET.startsWith('请先设置')) {
    console.error('❌ 请先设置环境变量 JWT_SECRET（与 EdgeOne 控制台配置一致）');
    process.exit(1);
  }
  if (!BASE_URL || BASE_URL.includes('your-edgeone-site')) {
    console.error('❌ 请先设置环境变量 BASE_URL（指向已部署的 Pages 站点）');
    console.error('   例如：BASE_URL=https://strategic-platform.pages.edgeone.cn npm run init-kv');
    process.exit(1);
  }

  const url = `${BASE_URL.replace(/\/$/, '')}/api/admin/init${force ? '?force=1' : ''}`;
  console.log(`📡 调用 ${url} ...`);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'x-init-secret': INIT_SECRET,
      'Content-Type': 'application/json'
    }
  });

  const body = await res.text();
  if (!res.ok) {
    console.error(`❌ 失败 (${res.status}):`, body);
    process.exit(1);
  }

  console.log('✅ 初始化成功：');
  try {
    console.log(JSON.stringify(JSON.parse(body), null, 2));
  } catch {
    console.log(body);
  }
  console.log('\n🔑 占位账号（请上线后替换）：');
  console.log('   admin     / Admin@2026     （管理员，所有客户）');
  console.log('   manager1  / Manager@2026   （唯品会, 小红书）');
  console.log('   manager2  / Manager@2026   （拼多多, TME）');
  console.log('   manager3  / Manager@2026   （虎牙, 酷狗, 顺丰控股）');
}

main().catch((err) => {
  console.error('❌ 调用失败：', err);
  process.exit(1);
});
