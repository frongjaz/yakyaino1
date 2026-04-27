<?php
/**
 * POST /api/auth/logout — clear session cookie (token in localStorage handled client-side)
 */

declare(strict_types=1);

require_once __DIR__ . '/../_lib/cors.php';
require_once __DIR__ . '/../_lib/utils.php';

handle_preflight();
require_method('POST');

// Expire cookie if present
setcookie('admin_session', '', [
    'expires' => time() - 3600,
    'path' => '/',
    'secure' => isset($_SERVER['HTTPS']),
    'httponly' => true,
    'samesite' => 'Lax',
]);

json_success(['message' => 'ออกจากระบบสำเร็จ']);
