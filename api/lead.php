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

// ── Validate required fields ──────────────────────────────────────────────────
$brand    = trim($_POST['brand']    ?? '');
$model    = trim($_POST['model']    ?? '');
$year     = trim($_POST['year']     ?? '');
$mileage  = trim($_POST['mileage']  ?? '');
$province = trim($_POST['province'] ?? '');
$phone    = trim($_POST['phone']    ?? '');

if (!$brand || !$model || !$year || !$province || !$phone) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'กรุณากรอกข้อมูลที่จำเป็นให้ครบ']);
    exit;
}

// ── Create table if needed ────────────────────────────────────────────────────
try {
    get_pdo()->exec("
        CREATE TABLE IF NOT EXISTS leads (
            id          INT AUTO_INCREMENT PRIMARY KEY,
            brand       VARCHAR(100) NOT NULL,
            model       VARCHAR(150) NOT NULL,
            year        SMALLINT     NOT NULL,
            mileage     INT          NULL,
            province    VARCHAR(100) NOT NULL,
            phone       VARCHAR(20)  NOT NULL,
            photo_url   VARCHAR(500) NULL,
            created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error']);
    exit;
}

// ── Handle photo upload ───────────────────────────────────────────────────────
$photoUrl = null;
if (!empty($_FILES['photo']['tmp_name'])) {
    $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/uploads/leads/';
    if (!is_dir($uploadDir)) {
        @mkdir($uploadDir, 0755, true);
    }
    $ext      = strtolower(pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION));
    $allowed  = ['jpg', 'jpeg', 'png', 'webp', 'heic'];
    if (in_array($ext, $allowed, true) && $_FILES['photo']['size'] < 10 * 1024 * 1024) {
        $filename = 'lead_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
        if (move_uploaded_file($_FILES['photo']['tmp_name'], $uploadDir . $filename)) {
            $photoUrl = '/uploads/leads/' . $filename;
        }
    }
}

// ── Save to database ──────────────────────────────────────────────────────────
try {
    $result = db_execute(
        "INSERT INTO leads (brand, model, year, mileage, province, phone, photo_url)
         VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
            $brand,
            $model,
            (int) $year,
            $mileage !== '' ? (int) $mileage : null,
            $province,
            $phone,
            $photoUrl,
        ]
    );
    $leadId = $result['insert_id'];
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'บันทึกข้อมูลไม่สำเร็จ']);
    exit;
}

// ── LINE Notify ───────────────────────────────────────────────────────────────
$lineToken = env('LINE_NOTIFY_TOKEN');
if ($lineToken) {
    $msg = "\n🚗 Lead ใหม่ #$leadId\n"
         . "ยี่ห้อ: $brand $model ($year)\n"
         . ($mileage ? "ไมล์: " . number_format((int)$mileage) . " km\n" : '')
         . "จังหวัด: $province\n"
         . "โทร: $phone";

    $ch = curl_init('https://notify-api.line.me/api/notify');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => ["Authorization: Bearer $lineToken"],
        CURLOPT_POSTFIELDS     => ['message' => $msg],
        CURLOPT_TIMEOUT        => 5,
    ]);
    curl_exec($ch);
    curl_close($ch);
}

echo json_encode(['success' => true, 'id' => $leadId]);
