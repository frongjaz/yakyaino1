<?php
/**
 * One-time admin user creation script.
 * DELETE THIS FILE after use.
 * Usage: GET /api/add-user.php?key=setup9x2k
 */
declare(strict_types=1);

require_once __DIR__ . '/_lib/cors.php';
require_once __DIR__ . '/_lib/config.php';
require_once __DIR__ . '/_lib/utils.php';

handle_preflight();

header('Content-Type: application/json');

// Simple access key — prevents random visitors from triggering this
$SECRET_KEY = 'setup9x2k';
if (($_GET['key'] ?? '') !== $SECRET_KEY) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'forbidden']);
    exit;
}

$username = 'Lslot';
$password = 'Lslot123!';
$role     = 'admin';

// Check if already exists
$existing = db_query('SELECT id FROM users WHERE username = ?', [$username]);
if (!empty($existing)) {
    echo json_encode(['success' => false, 'message' => "User '$username' already exists (id={$existing[0]['id']})"]);
    exit;
}

$hash   = password_hash($password, PASSWORD_BCRYPT);
$result = db_execute(
    "INSERT INTO users (username, password, role, status, created_at) VALUES (?, ?, ?, 'active', NOW())",
    [$username, $hash, $role]
);

echo json_encode([
    'success' => true,
    'message' => "User '$username' created successfully",
    'id'      => $result['insert_id'],
]);
