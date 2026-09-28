<?php
ini_set('display_errors', '1');
error_reporting(E_ALL);

if (($_GET['key'] ?? '') !== 'ck2024restart') {
    http_response_code(403);
    exit('Forbidden');
}

set_time_limit(60);
header('Content-Type: text/plain; charset=utf-8');

// Try to determine home directory
$home = '';
foreach (['/home/checkk', '/home/users/checkk', '/home/czfrongz'] as $h) {
    if (is_dir($h)) { $home = $h; break; }
}
if (!$home) $home = trim(shell_exec('echo $HOME 2>/dev/null') ?: exec('echo $HOME'));

$dir = $home . '/domains/checkkub.com/public_html';

echo "home: $home\n";
echo "dir: $dir\n";
echo "dir_exists: " . (is_dir($dir) ? 'yes' : 'no') . "\n";

// build PATH with nvm node bins
$nodeBins = [];
if (is_dir("$home/.nvm/versions/node")) {
    $versions = glob("$home/.nvm/versions/node/*/bin");
    if ($versions) {
        rsort($versions); // newest first
        $nodeBins = array_slice($versions, 0, 3);
    }
}
$path = implode(':', array_merge($nodeBins, ['/usr/local/bin', '/usr/bin', '/bin']));
$env  = "HOME=$home PATH=$path";

echo "path: $path\n";

// find pm2
$pm2 = '';
$directPaths = [
    "$home/.nvm/versions/node",
    "$home/.npm-global/bin/pm2",
    '/usr/local/bin/pm2',
    '/usr/bin/pm2',
];
foreach (["$home/.npm-global/bin/pm2", '/usr/local/bin/pm2', '/usr/bin/pm2'] as $p) {
    if (file_exists($p)) { $pm2 = $p; break; }
}
if (!$pm2 && is_dir("$home/.nvm/versions/node")) {
    exec("find $home/.nvm/versions/node -name 'pm2' -type f 2>/dev/null | sort -rV | head -1", $out);
    $pm2 = trim(implode('', $out));
}

echo "pm2: " . ($pm2 ?: 'NOT FOUND') . "\n\n";

if ($pm2) {
    $nodeDir = dirname($pm2);
    $fullEnv  = "HOME=$home PATH=$nodeDir:$path";

    // try restart by name first (no need for correct cwd)
    exec("$fullEnv $pm2 restart nextjs-app 2>&1", $out1, $rc1);
    echo "restart nextjs-app: rc=$rc1\n" . implode("\n", $out1) . "\n\n";

    if ($rc1 !== 0) {
        // try start via ecosystem config
        exec("cd $dir && $fullEnv $pm2 start $dir/ecosystem.config.js 2>&1", $out2, $rc2);
        echo "start ecosystem: rc=$rc2\n" . implode("\n", $out2) . "\n\n";

        if ($rc2 !== 0) {
            // last resort: direct node
            exec("cd $dir && $fullEnv nohup node server.js > $dir/server.log 2>&1 &", $out3, $rc3);
            echo "nohup start: rc=$rc3\n" . implode("\n", $out3) . "\n";
        }
    }
} else {
    // no pm2 found — check if node exists at all
    exec("$env which node 2>&1", $nodeOut, $nodeRc);
    echo "node: " . implode('', $nodeOut) . " (rc=$nodeRc)\n";

    if ($nodeRc === 0) {
        $node = trim(implode('', $nodeOut));
        exec("cd $dir && $env nohup $node server.js > $dir/server.log 2>&1 &", $out, $rc);
        echo "nohup with node: rc=$rc\n" . implode("\n", $out) . "\n";
    } else {
        echo "ERROR: cannot find node or pm2\n";
    }
}

echo "\nDone.\n";
