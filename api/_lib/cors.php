<?php
/**
 * CORS handling
 */

declare(strict_types=1);

const ALLOWED_ORIGINS = [
    'https://checkkub.com',
    'https://www.checkkub.com',
    'https://v-autocar.co.th',
    'https://www.v-autocar.co.th',
    'http://localhost:3000',
    'http://localhost:3001',
];

function send_cors_headers(): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $isAllowed = $origin !== '' && in_array($origin, ALLOWED_ORIGINS, true);

    if ($isAllowed) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
    }

    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 86400');
    header('Vary: Origin');
}

function handle_preflight(): void {
    send_cors_headers();
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
