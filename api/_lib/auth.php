<?php
/**
 * Auth helpers — must produce identical signatures to TypeScript lib/crypto-utils.ts
 * so existing localStorage sessions stay valid.
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

function get_app_secret(): string {
    $secret = env('APP_SECRET');
    return $secret !== null && $secret !== '' ? $secret : 'yakyai_default_secret_key_change_me';
}

/**
 * Mirror of JavaScript simpleHash():
 *   hash = ((hash << 5) - hash) + charCode
 *   force 32-bit signed integer each step
 *   return hex string (with leading '-' for negative)
 */
function simple_hash(string $str): string {
    $hash = 0;
    $len = strlen($str);
    for ($i = 0; $i < $len; $i++) {
        $char = ord($str[$i]);
        $hash = (($hash << 5) - $hash) + $char;
        // Force 32-bit signed integer (mirror JS `hash & hash`)
        $hash = $hash & 0xFFFFFFFF;
        if ($hash & 0x80000000) {
            $hash = $hash - 0x100000000;
        }
    }
    if ($hash < 0) {
        return '-' . dechex(-$hash);
    }
    return dechex($hash);
}

function sign_session(array $data): string {
    $payload = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $signature = simple_hash($payload . get_app_secret());
    return base64_encode($payload . '|' . $signature);
}

function verify_session(string $token): ?array {
    $decoded = base64_decode($token, true);
    if ($decoded === false) {
        return null;
    }
    $parts = explode('|', $decoded);
    if (count($parts) < 2) {
        return null;
    }
    $signature = array_pop($parts);
    $payload = implode('|', $parts);
    $expected = simple_hash($payload . get_app_secret());
    if (!hash_equals($expected, $signature)) {
        return null;
    }
    $data = json_decode($payload, true);
    return is_array($data) ? $data : null;
}

function get_authorization_header(): string {
    if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
        return $_SERVER['HTTP_AUTHORIZATION'];
    }
    if (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        return $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }
    if (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        if (isset($headers['Authorization'])) {
            return $headers['Authorization'];
        }
        if (isset($headers['authorization'])) {
            return $headers['authorization'];
        }
    }
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            return $headers['Authorization'];
        }
        if (isset($headers['authorization'])) {
            return $headers['authorization'];
        }
    }
    return '';
}

function check_auth(): array {
    $authHeader = get_authorization_header();
    $session = null;

    if (strpos($authHeader, 'Bearer ') === 0) {
        $token = urldecode(substr($authHeader, 7));
        $session = verify_session($token);
    }

    if ($session === null && isset($_COOKIE['admin_session'])) {
        $session = verify_session($_COOKIE['admin_session']);
    }

    if (!is_array($session) || ($session['role'] ?? '') !== 'admin') {
        return ['authenticated' => false];
    }

    return [
        'authenticated' => true,
        'user' => [
            'userId' => $session['userId'] ?? $session['id'] ?? null,
            'username' => $session['username'] ?? '',
            'role' => $session['role'],
        ],
    ];
}

function require_auth(): array {
    $auth = check_auth();
    if (!$auth['authenticated']) {
        json_error('ไม่มีสิทธิ์เข้าถึง', 401);
    }
    return $auth;
}
