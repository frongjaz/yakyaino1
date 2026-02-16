<?php
/**
 * PHP Script to restart PM2 process on DirectAdmin
 * Upload this file to your public_html folder and access it via browser
 * Example: https://checkkub.com/restart-pm2.php
 */

header('Content-Type: text/plain; charset=utf-8');

echo "--- PM2 Restart Trigger ---\n\n";

// Function to run command and show output
function run_cmd($cmd) {
    echo "Running: $cmd\n";
    $output = shell_exec($cmd . " 2>&1");
    echo "Output:\n" . ($output ?: "(No output)") . "\n";
    echo "---------------------------\n\n";
}

// Check if shell_exec is available
if (!function_exists('shell_exec')) {
    die("Error: shell_exec() is disabled on this server. Please use DirectAdmin UI or Cron Jobs instead.");
}

// Try to find PM2 path or add common paths
$path = 'export PATH=$PATH:/usr/local/bin:/usr/bin:/bin:/home/' . get_current_user() . '/bin; ';

// 1. Check PM2 status
run_cmd($path . "pm2 status");

// 2. Restart your app
// Change 'nextjs-app' to the name in your ecosystem.config.js if different
run_cmd($path . "pm2 restart nextjs-app || pm2 start ecosystem.config.js");

// 3. Check status again
run_cmd($path . "pm2 status");

echo "Process completed. Please check your website.";
?>
