<?php
/**
 * Export leads as Google Customer Match CSV
 * Format: Phone Number (E.164: +66XXXXXXXXX)
 *
 * Query params:
 *   from=YYYY-MM-DD   filter created_at >= date (default: all)
 *   status=new|contacted|closed|all  (default: all)
 *   format=csv|preview  preview returns JSON count (default: csv)
 */
declare(strict_types=1);
require_once __DIR__ . '/_lib/config.php';
require_once __DIR__ . '/_lib/cors.php';
require_once __DIR__ . '/_lib/auth.php';

handle_preflight();
require_auth();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$from   = isset($_GET['from'])   && preg_match('/^\d{4}-\d{2}-\d{2}$/', $_GET['from'])
          ? $_GET['from'] : null;
$status = isset($_GET['status']) && in_array($_GET['status'], ['new', 'contacted', 'closed', 'all'], true)
          ? $_GET['status'] : 'all';
$format = isset($_GET['format']) && $_GET['format'] === 'preview' ? 'preview' : 'csv';

// Build query
$where  = [];
$params = [];

if ($from !== null) {
    $where[]  = 'created_at >= ?';
    $params[] = $from . ' 00:00:00';
}
if ($status !== 'all') {
    $where[]  = 'tracking_status = ?';
    $params[] = $status;
}

$whereClause = count($where) ? 'WHERE ' . implode(' AND ', $where) : '';
$rows = db_query(
    "SELECT phone, created_at FROM tb_lead $whereClause ORDER BY id DESC",
    $params
);

/**
 * Convert Thai phone number to E.164 format (+66XXXXXXXXX)
 * Handles: 0812345678, 66812345678, +66812345678
 */
function to_e164(string $phone): ?string {
    $digits = preg_replace('/\D/', '', $phone);
    if ($digits === null || strlen($digits) < 9) {
        return null;
    }
    if (str_starts_with($digits, '66') && strlen($digits) === 11) {
        return '+' . $digits;
    }
    if (str_starts_with($digits, '0') && strlen($digits) === 10) {
        return '+66' . substr($digits, 1);
    }
    if (strlen($digits) === 9) {
        return '+66' . $digits;
    }
    return null;
}

// Convert and deduplicate phone numbers
$phones = [];
foreach ($rows as $row) {
    $e164 = to_e164((string) ($row['phone'] ?? ''));
    if ($e164 !== null) {
        $phones[$e164] = true;
    }
}
$uniquePhones = array_keys($phones);

if ($format === 'preview') {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success'      => true,
        'total_leads'  => count($rows),
        'valid_phones' => count($uniquePhones),
        'skipped'      => count($rows) - count($uniquePhones),
        'filters'      => ['from' => $from, 'status' => $status],
    ]);
    exit;
}

// Output CSV for Google Customer Match
$filename = 'customer-match-' . date('Ymd-His') . '.csv';
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');

$out = fopen('php://output', 'w');

// Google Customer Match header (phone-only list)
fputcsv($out, ['Phone Number']);

foreach ($uniquePhones as $phone) {
    fputcsv($out, [$phone]);
}

fclose($out);
