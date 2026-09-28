<?php
if (($_GET['key'] ?? '') !== 'ck2024restart') {
    http_response_code(403);
    exit('Forbidden');
}

header('Content-Type: text/plain; charset=utf-8');

$trigger = '/home/checkk/pm2-restart-trigger.txt';

if (file_put_contents($trigger, date('Y-m-d H:i:s') . "\n") !== false) {
    echo "OK: restart trigger written. Cron will restart pm2 within 1 minute.\n";
} else {
    http_response_code(500);
    echo "ERROR: could not write trigger file to $trigger\n";
    echo "open_basedir: " . ini_get('open_basedir') . "\n";
}
