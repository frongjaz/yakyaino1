<?php
/**
 * GET /api/auth/check — verify current session token
 */

declare(strict_types=1);

require_once __DIR__ . '/../_lib/cors.php';
require_once __DIR__ . '/../_lib/utils.php';
require_once __DIR__ . '/../_lib/config.php';
require_once __DIR__ . '/../_lib/auth.php';

handle_preflight();
require_method('GET');

$auth = check_auth();
if (!$auth['authenticated']) {
    json_response(['success' => false, 'authenticated' => false], 200);
}

json_response([
    'success' => true,
    'authenticated' => true,
    'user' => $auth['user'],
], 200);
