<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib/config.php';
require_once __DIR__ . '/_lib/cors.php';

handle_preflight();
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$id             = (int) ($_POST['id']             ?? 0);
$tracking_status = trim($_POST['tracking_status'] ?? '');
$note           = trim($_POST['note']             ?? '');

$valid = ['new', 'following', 'closed', 'stopped'];

if (!$id || !in_array($tracking_status, $valid, true)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'ข้อมูลไม่ถูกต้อง']);
    exit;
}

// migrate columns ถ้ายังไม่มี
try { get_pdo()->exec("ALTER TABLE tb_lead ADD COLUMN tracking_status VARCHAR(20) NOT NULL DEFAULT 'new'"); } catch (\Exception $e) {}
try { get_pdo()->exec("ALTER TABLE tb_lead ADD COLUMN note TEXT NULL"); } catch (\Exception $e) {}

try {
    db_execute(
        "UPDATE tb_lead SET tracking_status = ?, note = ? WHERE id = ?",
        [$tracking_status, $note !== '' ? $note : null, $id]
    );
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'บันทึกไม่สำเร็จ']);
    exit;
}

echo json_encode(['success' => true]);
