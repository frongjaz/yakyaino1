<?php
/**
 * GET    /api/blogs/{id} — fetch single blog
 * PUT    /api/blogs/{id} — update blog (admin only)
 * DELETE /api/blogs/{id} — delete blog (admin only)
 */

declare(strict_types=1);

require_once __DIR__ . '/../_lib/cors.php';
require_once __DIR__ . '/../_lib/utils.php';
require_once __DIR__ . '/../_lib/config.php';
require_once __DIR__ . '/../_lib/auth.php';

handle_preflight();
$method = require_methods(['GET', 'PUT', 'DELETE']);

$blogId = $_GET['id'] ?? '';
if ($blogId === '' || preg_match('/^\d+$/', $blogId) !== 1) {
    json_error('ID ไม่ถูกต้อง', 400);
}

if ($method === 'GET') {
    try {
        $rows = db_query('SELECT * FROM blogs WHERE id = ?', [$blogId]);
        if (empty($rows)) {
            json_error('ไม่พบข้อมูลบทความ', 404);
        }

        $blog = $rows[0];
        $tags = [];
        if (!empty($blog['tags'])) {
            $decoded = json_decode($blog['tags'], true);
            if (is_array($decoded)) {
                $tags = $decoded;
            }
        }

        $transformed = [
            'id' => $blog['id'],
            'title' => $blog['title'],
            'paragraph' => $blog['paragraph'],
            'content' => $blog['content'],
            'image' => $blog['image'],
            'author' => [
                'name' => $blog['author_name'],
                'image' => $blog['author_image'] ?? '',
                'designation' => $blog['author_designation'] ?? '',
            ],
            'tags' => $tags,
            'publishDate' => $blog['publish_date'] ?? '',
            'datePublished' => !empty($blog['date_published']) ? date('c', strtotime($blog['date_published'])) : null,
            'dateModified' => !empty($blog['date_modified']) ? date('c', strtotime($blog['date_modified'])) : null,
            'status' => $blog['status'],
            'createdAt' => $blog['created_at'],
            'updatedAt' => $blog['updated_at'],
        ];

        json_success(['data' => $transformed]);
    } catch (Throwable $e) {
        json_error('เกิดข้อผิดพลาด', 500, $e->getMessage());
    }
}

if ($method === 'PUT') {
    require_auth();
    try {
        $body = get_json_body();

        $tagsJson = null;
        if (!empty($body['tags']) && is_array($body['tags'])) {
            $tagsJson = json_encode($body['tags'], JSON_UNESCAPED_UNICODE);
        }

        $datePublished = null;
        if (!empty($body['date_published'])) {
            $ts = strtotime($body['date_published']);
            $datePublished = $ts !== false ? date('Y-m-d H:i:s', $ts) : null;
        }

        db_execute(
            "UPDATE blogs SET
                title = ?, paragraph = ?, content = ?, image = ?,
                author_name = ?, author_image = ?, author_designation = ?,
                tags = ?, publish_date = ?, date_published = ?, date_modified = NOW(), status = ?
            WHERE id = ?",
            [
                $body['title'] ?? '',
                $body['paragraph'] ?? '',
                $body['content'] ?? null,
                $body['image'] ?? '',
                $body['author_name'] ?? '',
                $body['author_image'] ?? null,
                $body['author_designation'] ?? null,
                $tagsJson,
                $body['publish_date'] ?? null,
                $datePublished,
                $body['status'] ?? 'draft',
                $blogId,
            ]
        );

        json_success(['message' => 'อัปเดตบทความสำเร็จ']);
    } catch (Throwable $e) {
        json_error('เกิดข้อผิดพลาด', 500, $e->getMessage());
    }
}

if ($method === 'DELETE') {
    require_auth();
    try {
        db_execute('DELETE FROM blogs WHERE id = ?', [$blogId]);
        json_success(['message' => 'ลบบทความสำเร็จ']);
    } catch (Throwable $e) {
        json_error('เกิดข้อผิดพลาด', 500, $e->getMessage());
    }
}
