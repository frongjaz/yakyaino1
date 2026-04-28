<?php
/**
 * GET    /api/blogs       — list blog posts
 * GET    /api/blogs/{id}  — single blog (routed here by .htaccess as ?id=)
 * POST   /api/blogs       — create (admin only)
 * PUT    /api/blogs/{id}  — update (admin only)
 * DELETE /api/blogs/{id}  — delete (admin only)
 */

declare(strict_types=1);

require_once __DIR__ . '/_lib/cors.php';
require_once __DIR__ . '/_lib/utils.php';
require_once __DIR__ . '/_lib/config.php';
require_once __DIR__ . '/_lib/auth.php';

handle_preflight();

function transform_blog(array $blog): array {
    $tags = [];
    if (!empty($blog['tags'])) {
        $decoded = json_decode($blog['tags'], true);
        if (is_array($decoded)) {
            $tags = $decoded;
        }
    }
    return [
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
}

// ── Detail / Update / Delete: /api/blogs/{id} ────────────────────────────────
if (isset($_GET['id']) && $_GET['id'] !== '') {
    $blogId = $_GET['id'];
    if (preg_match('/^\d+$/', $blogId) !== 1) {
        json_error('ID ไม่ถูกต้อง', 400);
    }

    $method = require_methods(['GET', 'PUT', 'DELETE']);

    if ($method === 'GET') {
        try {
            $rows = db_query('SELECT * FROM blogs WHERE id = ?', [$blogId]);
            if (empty($rows)) {
                json_error('ไม่พบข้อมูลบทความ', 404);
            }
            json_success(['data' => transform_blog($rows[0])]);
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
}

// ── List / Create ─────────────────────────────────────────────────────────────
$method = require_methods(['GET', 'POST']);

if ($method === 'GET') {
    try {
        $status = $_GET['status'] ?? 'published';
        $admin = ($_GET['admin'] ?? '') === 'true';

        $sql = 'SELECT * FROM blogs';
        $params = [];

        if (!$admin) {
            $sql .= ' WHERE status = ?';
            $params[] = 'published';
        } elseif ($status !== 'all') {
            $sql .= ' WHERE status = ?';
            $params[] = $status;
        }

        $sql .= ' ORDER BY date_published DESC, created_at DESC';
        $blogs = db_query($sql, $params);

        if (empty($blogs) && !$admin) {
            $blogs = db_query('SELECT * FROM blogs ORDER BY created_at DESC', []);
        }

        json_success(['data' => array_map('transform_blog', $blogs)]);
    } catch (Throwable $e) {
        json_error('เกิดข้อผิดพลาด', 500, $e->getMessage());
    }
}

if ($method === 'POST') {
    require_auth();
    try {
        $body = get_json_body();
        $required = ['title', 'paragraph', 'image', 'author_name'];
        foreach ($required as $field) {
            if (empty($body[$field])) {
                json_error('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (หัวข้อ, เนื้อหาย่อ, รูปภาพ, ชื่อผู้เขียน)', 400);
            }
        }

        $tagsJson = null;
        if (!empty($body['tags']) && is_array($body['tags'])) {
            $tagsJson = json_encode($body['tags'], JSON_UNESCAPED_UNICODE);
        }
        $datePublished = null;
        if (!empty($body['date_published'])) {
            $ts = strtotime($body['date_published']);
            $datePublished = $ts !== false ? date('Y-m-d H:i:s', $ts) : null;
        }

        $result = db_execute(
            "INSERT INTO blogs (
                title, paragraph, content, image,
                author_name, author_image, author_designation,
                tags, publish_date, date_published, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $body['title'],
                $body['paragraph'],
                $body['content'] ?? null,
                $body['image'],
                $body['author_name'],
                $body['author_image'] ?? null,
                $body['author_designation'] ?? null,
                $tagsJson,
                $body['publish_date'] ?? null,
                $datePublished,
                $body['status'] ?? 'draft',
            ]
        );

        json_success([
            'message' => 'เพิ่มบทความสำเร็จ',
            'data' => ['id' => $result['insert_id']],
        ]);
    } catch (Throwable $e) {
        json_error('เกิดข้อผิดพลาด', 500, $e->getMessage());
    }
}
