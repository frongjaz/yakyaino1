<?php
/**
 * Common utilities: JSON response helpers and request body parsing
 */

declare(strict_types=1);

function json_response(array $payload, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function json_success(array $extras = [], int $status = 200): void {
    json_response(array_merge(['success' => true], $extras), $status);
}

function json_error(string $message, int $status = 500, ?string $errorDetail = null): void {
    $payload = ['success' => false, 'message' => $message];
    if ($errorDetail !== null) {
        $payload['error'] = $errorDetail;
    }
    json_response($payload, $status);
}

function get_json_body(): array {
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function require_method(string $method): void {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== $method) {
        json_error('Method not allowed', 405);
    }
}

function require_methods(array $methods): string {
    $current = $_SERVER['REQUEST_METHOD'] ?? '';
    if (!in_array($current, $methods, true)) {
        json_error('Method not allowed', 405);
    }
    return $current;
}
