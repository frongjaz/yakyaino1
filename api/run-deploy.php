<?php
// Security key — ลบไฟล์นี้ออกหลังใช้งาน
if ($_GET['key'] !== 'ck2024deploy') {
    http_response_code(403); exit('Forbidden');
}

set_time_limit(300);
header('Content-Type: text/plain; charset=utf-8');
header('X-Accel-Buffering: no');

$dir = '/domains/checkkub.com/public_html';

function run($cmd) {
    echo "$ $cmd\n";
    flush();
    $out = shell_exec("$cmd 2>&1");
    echo $out . "\n";
    flush();
    return $out;
}

echo "=== CheckKub Deploy ===\n\n";

// 1. Git pull
echo "--- git pull ---\n";
run("cd $dir && git pull origin main");

// 2. pnpm install
echo "--- pnpm install ---\n";
run("cd $dir && pnpm install --frozen-lockfile");

// 3. Build
echo "--- pnpm build ---\n";
run("cd $dir && pnpm run build");

// 4. Restart Node.js — ลอง pm2 หลาย path
echo "--- restart ---\n";
$restarted = false;
$pm2_paths = [
    'pm2',
    '/usr/local/bin/pm2',
    '/usr/bin/pm2',
];
foreach ($pm2_paths as $pm2) {
    $check = shell_exec("which $pm2 2>/dev/null || [ -f $pm2 ] && echo found");
    if ($check) {
        run("$pm2 restart nextjs-app");
        $restarted = true;
        break;
    }
}
// ลอง nvm pm2
$nvm_pm2 = shell_exec("ls ~/.nvm/versions/node/*/bin/pm2 2>/dev/null | head -1");
if (!$restarted && trim($nvm_pm2)) {
    run(trim($nvm_pm2) . " restart nextjs-app");
    $restarted = true;
}
// Fallback: kill + nohup
if (!$restarted) {
    run("pkill -f 'server.js' || true");
    sleep(1);
    run("cd $dir && nohup node server.js > server.log 2>&1 &");
}

echo "\n=== Done! ===\n";

// ลบตัวเองหลังรัน
unlink(__FILE__);
echo "Script deleted.\n";
