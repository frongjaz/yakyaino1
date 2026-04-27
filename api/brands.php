<?php
/**
 * GET /api/brands — distinct car brands
 */

declare(strict_types=1);

require_once __DIR__ . '/_lib/cors.php';
require_once __DIR__ . '/_lib/utils.php';
require_once __DIR__ . '/_lib/config.php';

handle_preflight();
require_method('GET');

try {
    $rows = db_query(
        "SELECT DISTINCT brand FROM cars
         WHERE (status = ? OR status IS NULL)
           AND brand IS NOT NULL AND brand != ''
         ORDER BY brand ASC",
        ['available']
    );
    $brands = array_values(array_filter(array_map(fn($r) => $r['brand'], $rows)));
    json_success(['data' => $brands]);
} catch (Throwable $e) {
    json_error('เกิดข้อผิดพลาด', 500, $e->getMessage());
}
