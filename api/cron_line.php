<?php
/**
 * PHP CLI cron — ส่ง LINE notification สำหรับ lead ที่ยังไม่ได้แจ้ง
 * รัน: php /domains/checkkub.com/public_html/api/cron_line.php
 */
declare(strict_types=1);

// Load env from .env.local (support CLI where DOCUMENT_ROOT not set)
$envPaths = [
    __DIR__ . '/../.env.local',
    __DIR__ . '/../../.env.local',
    dirname(__DIR__) . '/.env.local',
];
foreach ($envPaths as $envPath) {
    if (is_readable($envPath)) {
        foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
            $line = trim($line);
            if (!$line || $line[0] === '#' || strpos($line, '=') === false) continue;
            [$k, $v] = explode('=', $line, 2);
            $v = trim(trim($v), '"\'');
            putenv(trim($k) . '=' . $v);
        }
        break;
    }
}

$lineToken   = getenv('LINE_CHANNEL_TOKEN');
$lineGroupId = getenv('LINE_GROUP_ID');
$dbHost      = getenv('DB_HOST');
$dbName      = getenv('DB_NAME');
$dbUser      = getenv('DB_USER');
$dbPass      = getenv('DB_PASSWORD');
$dbPort      = (int)(getenv('DB_PORT') ?: 3306);

if (!$lineToken || !$lineGroupId || !$dbHost || !$dbName) {
    echo "Missing env vars\n";
    exit(1);
}

// Connect to DB
try {
    $pdo = new PDO(
        "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4",
        $dbUser, $dbPass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (Exception $e) {
    echo "DB error: " . $e->getMessage() . "\n";
    exit(1);
}

// Ensure line_notified column exists
try {
    $pdo->exec("ALTER TABLE tb_lead ADD COLUMN IF NOT EXISTS line_notified TINYINT(1) NOT NULL DEFAULT 0");
} catch (Exception $e) { /* already exists */ }

// Fetch unnotified leads
$leads = $pdo->query("SELECT * FROM tb_lead WHERE line_notified = 0 ORDER BY id ASC LIMIT 20")->fetchAll(PDO::FETCH_ASSOC);

foreach ($leads as $lead) {
    $mileageText = $lead['mileage'] ? "\nไมล์: " . number_format((int)$lead['mileage']) . " km" : '';
    $priceText   = $lead['asking_price'] ? "\nราคาที่ต้องการ: " . number_format((int)$lead['asking_price']) . " บาท" : '';
    $msg = "🚗 Lead ใหม่ #{$lead['id']}\nยี่ห้อ: {$lead['brand']} {$lead['model']} ({$lead['year']}){$mileageText}\nจังหวัด: {$lead['province']}\nโทร: {$lead['phone']}{$priceText}";

    $ch = curl_init('https://api.line.me/v2/bot/message/push');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $lineToken,
        ],
        CURLOPT_POSTFIELDS => json_encode([
            'to'       => $lineGroupId,
            'messages' => [['type' => 'text', 'text' => $msg]],
        ]),
        CURLOPT_TIMEOUT => 10,
    ]);
    $res  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($code === 200) {
        $pdo->prepare("UPDATE tb_lead SET line_notified = 1 WHERE id = ?")->execute([$lead['id']]);
        echo "Sent lead #{$lead['id']}\n";
    } else {
        echo "Failed lead #{$lead['id']}: HTTP {$code} — {$res}\n";
    }
}

echo "Done. Processed " . count($leads) . " leads.\n";
