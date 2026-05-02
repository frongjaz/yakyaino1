<?php
/**
 * GET    /api/banners           — list active banners (public)
 * GET    /api/banners?admin=true — list all banners (public, for admin UI)
 * GET    /api/banners/{id}      — single banner
 * POST   /api/banners           — create banner (admin only)
 * PUT    /api/banners/{id}      — update banner (admin only)
 * DELETE /api/banners/{id}      — delete banner (admin only)
 */

declare(strict_types=1);

require_once __DIR__ . '/_lib/cors.php';
require_once __DIR__ . '/_lib/utils.php';
require_once __DIR__ . '/_lib/config.php';
require_once __DIR__ . '/_lib/auth.php';

handle_preflight();

// Apache blocks PUT/DELETE on shared hosting — support X-HTTP-Method-Override tunneled via POST
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'POST') {
    $override = $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] ?? '';
    if ($override !== '') {
        $method = strtoupper($override);
    }
}
$id     = isset($_GET['id']) && $_GET['id'] !== '' ? (int) $_GET['id'] : null;

// ── Single banner: GET|PUT|DELETE /api/banners/{id} ─────────────────────────
if ($id !== null) {
    $method = require_methods(['GET', 'PUT', 'DELETE']);

    if ($method === 'GET') {
        try {
            $rows = db_query('SELECT * FROM banners WHERE id = ?', [$id]);
            if (empty($rows)) {
                json_error('ไม่พบ banner', 404);
            }
            json_success(['data' => $rows[0]]);
        } catch (Throwable $e) {
            json_error('เกิดข้อผิดพลาด', 500, $e->getMessage());
        }
    }

    if ($method === 'PUT') {
        require_auth();
        try {
            $body = get_json_body();
            $allowed = ['image_url', 'alt_text', 'sort_order', 'is_active'];
            $sets = []; $params = [];
            foreach ($allowed as $f) {
                if (array_key_exists($f, $body)) {
                    $sets[] = "$f = ?";
                    if (in_array($f, ['sort_order', 'is_active'], true)) {
                        $params[] = (int) $body[$f];
                    } else {
                        $params[] = $body[$f];
                    }
                }
            }
            if (empty($sets)) {
                json_error('ไม่มีข้อมูลที่จะอัพเดท', 400);
            }
            $params[] = $id;
            db_execute('UPDATE banners SET ' . implode(', ', $sets) . ' WHERE id = ?', $params);
            $rows = db_query('SELECT * FROM banners WHERE id = ?', [$id]);
            json_success(['data' => $rows[0] ?? null]);
        } catch (Throwable $e) {
            json_error('เกิดข้อผิดพลาด', 500, $e->getMessage());
        }
    }

    if ($method === 'DELETE') {
        require_auth();
        try {
            $rows = db_query('SELECT id FROM banners WHERE id = ?', [$id]);
            if (empty($rows)) {
                json_error('ไม่พบ banner', 404);
            }
            db_execute('DELETE FROM banners WHERE id = ?', [$id]);
            json_success(['message' => 'ลบ banner เรียบร้อย']);
        } catch (Throwable $e) {
            json_error('เกิดข้อผิดพลาด', 500, $e->getMessage());
        }
    }
}

// ── List: GET /api/banners ───────────────────────────────────────────────────
if ($method === 'GET') {
    try {
        $admin = ($_GET['admin'] ?? '') === 'true';
        if ($admin) {
            $rows = db_query('SELECT * FROM banners ORDER BY sort_order ASC, id ASC');
        } else {
            $rows = db_query('SELECT * FROM banners WHERE is_active = 1 ORDER BY sort_order ASC, id ASC');
        }
        json_success(['data' => $rows]);
    } catch (Throwable $e) {
        json_error('เกิดข้อผิดพลาด', 500, $e->getMessage());
    }
}

// ── Create: POST /api/banners ────────────────────────────────────────────────
if ($method === 'POST') {
    require_auth();
    try {
        $body = get_json_body();
        $image_url  = trim((string) ($body['image_url'] ?? ''));
        $alt_text   = trim((string) ($body['alt_text']  ?? ''));
        $sort_order = (int) ($body['sort_order'] ?? 0);
        $is_active  = (int) ($body['is_active']  ?? 1);

        if ($image_url === '') {
            json_error('กรุณาระบุ image_url', 400);
        }

        $result = db_execute(
            'INSERT INTO banners (image_url, alt_text, sort_order, is_active) VALUES (?, ?, ?, ?)',
            [$image_url, $alt_text, $sort_order, $is_active]
        );
        $rows = db_query('SELECT * FROM banners WHERE id = ?', [$result['insert_id']]);
        json_success(['data' => $rows[0] ?? null], 201);
    } catch (Throwable $e) {
        json_error('เกิดข้อผิดพลาด', 500, $e->getMessage());
    }
}

json_error('Method not allowed', 405);
