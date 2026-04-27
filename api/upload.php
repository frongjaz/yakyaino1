<?php
/**
 * POST /api/upload — save uploaded image to local filesystem
 * Returns public URL (e.g. /images/cars/car_<ts>_<rand>.jpg)
 */

declare(strict_types=1);

require_once __DIR__ . '/_lib/cors.php';
require_once __DIR__ . '/_lib/utils.php';
require_once __DIR__ . '/_lib/config.php';
require_once __DIR__ . '/_lib/auth.php';

handle_preflight();
require_method('POST');
require_auth();

try {
    if (empty($_FILES['file'])) {
        json_error('กรุณาเลือกไฟล์', 400);
    }

    $file = $_FILES['file'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        $uploadErrors = [
            UPLOAD_ERR_INI_SIZE => 'ไฟล์ใหญ่เกินกว่าค่าที่ระบุใน php.ini',
            UPLOAD_ERR_FORM_SIZE => 'ไฟล์ใหญ่เกินกว่าค่าที่ระบุใน HTML form',
            UPLOAD_ERR_PARTIAL => 'อัพโหลดไม่สมบูรณ์',
            UPLOAD_ERR_NO_FILE => 'ไม่มีไฟล์ที่อัพโหลด',
            UPLOAD_ERR_NO_TMP_DIR => 'ไม่มี temp folder',
            UPLOAD_ERR_CANT_WRITE => 'เขียนไฟล์ลง disk ไม่ได้',
            UPLOAD_ERR_EXTENSION => 'PHP extension หยุดการอัพโหลด',
        ];
        $msg = $uploadErrors[$file['error']] ?? 'อัพโหลดล้มเหลว';
        json_error($msg, 400);
    }

    // Validate file size (10MB)
    if ($file['size'] > 10 * 1024 * 1024) {
        json_error('ขนาดไฟล์ไม่ควรเกิน 10MB', 400);
    }

    // Validate MIME type via finfo (don't trust client-supplied type)
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);
    if (!is_string($mime) || strpos($mime, 'image/') !== 0) {
        json_error('กรุณาเลือกไฟล์รูปภาพเท่านั้น', 400);
    }

    // Resolve target directory under public_html/images/cars/
    $targetDir = realpath(__DIR__ . '/..') . '/images/cars/';
    if (!is_dir($targetDir)) {
        if (!mkdir($targetDir, 0755, true) && !is_dir($targetDir)) {
            json_error('ไม่สามารถสร้างโฟลเดอร์เก็บรูปได้', 500);
        }
    }
    if (!is_writable($targetDir)) {
        json_error('โฟลเดอร์เก็บรูปไม่มีสิทธิ์เขียน', 500);
    }

    // Generate filename
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION) ?: 'jpg');
    // Whitelist common image extensions
    if (!in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'], true)) {
        $extension = 'jpg';
    }
    $timestamp = (int) (microtime(true) * 1000);
    $randomString = bin2hex(random_bytes(6));
    $fileName = "car_{$timestamp}_{$randomString}.{$extension}";
    $targetPath = $targetDir . $fileName;

    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        json_error('บันทึกไฟล์ไม่สำเร็จ', 500);
    }

    @chmod($targetPath, 0644);

    $publicUrl = '/images/cars/' . $fileName;

    json_success([
        'message' => 'อัพโหลดไฟล์สำเร็จ',
        'url' => $publicUrl,
        'fileName' => $fileName,
    ]);
} catch (Throwable $e) {
    json_error('เกิดข้อผิดพลาด', 500, $e->getMessage());
}
