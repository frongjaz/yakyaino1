<?php
/**
 * POST /api/auth/login — admin login with bcrypt + signed session
 */

declare(strict_types=1);

require_once __DIR__ . '/../_lib/cors.php';
require_once __DIR__ . '/../_lib/utils.php';
require_once __DIR__ . '/../_lib/config.php';
require_once __DIR__ . '/../_lib/auth.php';

handle_preflight();
require_method('POST');

try {
    $body = get_json_body();
    $username = trim($body['username'] ?? '');
    $password = $body['password'] ?? '';

    if ($username === '' || $password === '') {
        json_error('กรุณากรอก username และ password', 400);
    }

    $rows = db_query(
        'SELECT * FROM users WHERE username = ? AND status = ?',
        [$username, 'active']
    );

    if (empty($rows)) {
        json_error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', 401);
    }

    $user = $rows[0];

    // bcrypt hashes from MariaDB may use $2b$ prefix; password_verify supports it.
    if (!password_verify($password, $user['password'])) {
        json_error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', 401);
    }

    if (($user['role'] ?? '') !== 'admin') {
        json_error('คุณไม่มีสิทธิ์เข้าถึง', 403);
    }

    db_execute('UPDATE users SET last_login = NOW() WHERE id = ?', [$user['id']]);

    $sessionPayload = [
        'userId' => (int) $user['id'],
        'username' => $user['username'],
        'role' => $user['role'],
        'loginTime' => (int) (microtime(true) * 1000), // ms epoch like JS Date.now()
    ];

    $signedSession = sign_session($sessionPayload);

    // Set HttpOnly cookie so the browser sends it automatically on same-domain requests.
    // This is the primary auth mechanism — no need to manage Bearer tokens in JS.
    setcookie('admin_session', $signedSession, [
        'expires'  => time() + (7 * 24 * 3600),
        'path'     => '/',
        'secure'   => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    json_success([
        'message' => 'เข้าสู่ระบบสำเร็จ',
        'user' => [
            'id' => (int) $user['id'],
            'username' => $user['username'],
            'role' => $user['role'],
        ],
        'session' => $signedSession,
    ]);
} catch (Throwable $e) {
    json_error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ', 500, $e->getMessage());
}
