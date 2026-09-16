<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib/config.php';
require_once __DIR__ . '/_lib/cors.php';
require_once __DIR__ . '/_lib/auth.php';

handle_preflight();
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

require_auth();

// สร้าง table ถ้ายังไม่มี
get_pdo()->exec("
    CREATE TABLE IF NOT EXISTS tb_lead (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        brand       VARCHAR(100) NOT NULL,
        model       VARCHAR(150) NOT NULL,
        year        SMALLINT     NOT NULL,
        mileage     INT          NULL,
        province    VARCHAR(100) NOT NULL,
        phone       VARCHAR(20)  NOT NULL,
        photo_url    VARCHAR(500) NULL,
        asking_price INT          NULL,
        created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ALTER TABLE tb_lead ADD COLUMN IF NOT EXISTS asking_price INT NULL AFTER photo_url;
");

try {
    $rows = db_query(
        "SELECT id, brand, model, year, mileage, province, phone, photo_url, asking_price, created_at
         FROM tb_lead
         ORDER BY id DESC
         LIMIT 500"
    );
    echo json_encode(['success' => true, 'data' => $rows]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'ไม่พบข้อมูล']);
}
