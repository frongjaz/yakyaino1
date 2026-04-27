<?php
/**
 * GET  /api/cars — list with filters/pagination
 * POST /api/cars — create new car (admin only)
 */

declare(strict_types=1);

require_once __DIR__ . '/_lib/cors.php';
require_once __DIR__ . '/_lib/utils.php';
require_once __DIR__ . '/_lib/config.php';
require_once __DIR__ . '/_lib/auth.php';

handle_preflight();
$method = require_methods(['GET', 'POST']);

function compute_photo_count(array $car): int {
    $count = 0;
    foreach (['image', 'image2', 'image3', 'image4', 'image5'] as $field) {
        if (!empty($car[$field]) && trim((string) $car[$field]) !== '') {
            $count++;
        }
    }
    return $count;
}

if ($method === 'GET') {
    try {
        $searchQuery = trim($_GET['q'] ?? '');
        $brand = trim($_GET['brand'] ?? '');
        $minPrice = $_GET['minPrice'] ?? null;
        $maxPrice = $_GET['maxPrice'] ?? null;
        $page = max(1, (int) ($_GET['page'] ?? 1));
        $limit = max(1, min(100, (int) ($_GET['limit'] ?? 12)));
        $offset = ($page - 1) * $limit;

        $whereSql = 'WHERE (status = ? OR status IS NULL)';
        $whereParams = ['available'];

        if ($brand !== '' && $brand !== 'ทั้งหมด') {
            $whereSql .= ' AND LOWER(brand) = ?';
            $whereParams[] = mb_strtolower($brand);
        }

        if ($minPrice !== null && $minPrice !== '' && is_numeric($minPrice)) {
            $whereSql .= ' AND price >= ?';
            $whereParams[] = (int) $minPrice;
        }

        if ($maxPrice !== null && $maxPrice !== '' && is_numeric($maxPrice)) {
            $whereSql .= ' AND price <= ?';
            $whereParams[] = (int) $maxPrice;
        }

        $hasSearch = $searchQuery !== '' && $brand === '';
        if ($hasSearch) {
            $searchLower = mb_strtolower($searchQuery);
            $containsTerm = "%$searchLower%";
            $brandStartsWith = "$searchLower%";
            $whereSql .= ' AND (LOWER(brand) = ? OR LOWER(brand) LIKE ? OR LOWER(model) LIKE ? OR LOWER(CONCAT(brand, \' \', model)) LIKE ?)';
            $whereParams[] = $searchLower;
            $whereParams[] = $brandStartsWith;
            $whereParams[] = $containsTerm;
            $whereParams[] = $containsTerm;
        }

        // Total count
        $countRows = db_query("SELECT COUNT(*) as total FROM cars $whereSql", $whereParams);
        $total = (int) ($countRows[0]['total'] ?? 0);

        // Build SELECT with ORDER BY
        $sql = "SELECT * FROM cars $whereSql";
        $params = $whereParams;

        if ($hasSearch) {
            $searchLower = mb_strtolower($searchQuery);
            $containsTerm = "%$searchLower%";
            $brandStartsWith = "$searchLower%";
            $sql .= ' ORDER BY CASE
                WHEN LOWER(brand) = ? THEN 1
                WHEN LOWER(brand) LIKE ? THEN 2
                WHEN LOWER(model) LIKE ? THEN 3
                WHEN LOWER(CONCAT(brand, \' \', model)) LIKE ? THEN 4
                ELSE 5
            END, created_at DESC';
            $params[] = $searchLower;
            $params[] = $brandStartsWith;
            $params[] = $containsTerm;
            $params[] = $containsTerm;
        } else {
            $sql .= ' ORDER BY created_at DESC';
        }

        $sql .= ' LIMIT ? OFFSET ?';
        $params[] = $limit;
        $params[] = $offset;

        $cars = db_query($sql, $params);
        foreach ($cars as &$car) {
            $car['photo_count'] = compute_photo_count($car);
        }
        unset($car);

        $totalPages = $limit > 0 ? (int) ceil($total / $limit) : 1;

        json_success([
            'data' => $cars,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'totalPages' => $totalPages,
            ],
        ]);
    } catch (Throwable $e) {
        json_error('เกิดข้อผิดพลาด', 500, $e->getMessage());
    }
}

if ($method === 'POST') {
    require_auth();
    try {
        $body = get_json_body();
        $required = ['brand', 'model', 'year', 'price', 'image'];
        foreach ($required as $field) {
            if (empty($body[$field])) {
                json_error('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (ยี่ห้อ, รุ่น, ปี, ราคา, รูปภาพหลัก)', 400);
            }
        }

        $params = [
            $body['brand'],
            $body['model'],
            (int) $body['year'],
            (float) $body['price'],
            $body['image'],
            $body['image2'] ?? null,
            $body['image3'] ?? null,
            $body['image4'] ?? null,
            $body['image5'] ?? null,
            (int) ($body['photo_count'] ?? 0),
            $body['description'] ?? null,
            isset($body['mileage']) && is_numeric($body['mileage']) ? (int) $body['mileage'] : null,
            $body['color'] ?? null,
            $body['transmission'] ?? null,
            $body['fuel_type'] ?? null,
            $body['engine_size'] ?? null,
            $body['license_plate'] ?? null,
            $body['status'] ?? 'available',
        ];

        $result = db_execute(
            "INSERT INTO cars (
                brand, model, year, price, image, image2, image3, image4, image5, photo_count, description,
                mileage, color, transmission, fuel_type, engine_size, license_plate, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            $params
        );

        json_success([
            'message' => 'เพิ่มข้อมูลรถสำเร็จ',
            'data' => ['id' => $result['insert_id']],
        ]);
    } catch (Throwable $e) {
        json_error('เกิดข้อผิดพลาด', 500, $e->getMessage());
    }
}
