<?php
/**
 * GET  /api/blogs — list blog posts
 * POST /api/blogs — create new blog post (admin only)
 */

declare(strict_types=1);

require_once __DIR__ . '/_lib/cors.php';
require_once __DIR__ . '/_lib/utils.php';
require_once __DIR__ . '/_lib/config.php';
require_once __DIR__ . '/_lib/auth.php';

handle_preflight();
$method = require_methods(['GET', 'POST']);

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

        // Fallback: if no published blogs, show all blogs (for non-admin)
        if (empty($blogs) && !$admin) {
            $blogs = db_query('SELECT * FROM blogs ORDER BY created_at DESC', []);
        }

        $transformed = array_map('transform_blog', $blogs);
        json_success(['data' => $transformed]);
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
