<?php
/**
 * GET /api/cars/{id} — fetch single car (id may be encoded with "checkkub" salt)
 */

declare(strict_types=1);

require_once __DIR__ . '/../_lib/cors.php';
require_once __DIR__ . '/../_lib/utils.php';
require_once __DIR__ . '/../_lib/config.php';
require_once __DIR__ . '/../_lib/id-encoder.php';

handle_preflight();
require_method('GET');

try {
    $encodedId = $_GET['id'] ?? '';
    if ($encodedId === '') {
        json_error('ID ไม่ถูกต้อง', 400);
    }

    $carId = decode_car_id($encodedId);
    if ($carId === null) {
        json_error('ID ไม่ถูกต้อง', 400);
    }

    $rows = db_query('SELECT * FROM cars WHERE id = ?', [$carId]);
    if (empty($rows)) {
        json_error('ไม่พบข้อมูลรถ', 404);
    }

    $car = $rows[0];
    $photoCount = 0;
    foreach (['image', 'image2', 'image3', 'image4', 'image5'] as $field) {
        if (!empty($car[$field]) && trim((string) $car[$field]) !== '') {
            $photoCount++;
        }
    }
    $car['photo_count'] = $photoCount;

    json_success(['data' => $car]);
} catch (Throwable $e) {
    json_error('เกิดข้อผิดพลาด', 500, $e->getMessage());
}
