<?php
if (function_exists('opcache_reset')) {
    opcache_reset();
    echo json_encode(['opcache_reset' => true]);
} else {
    echo json_encode(['opcache_reset' => false, 'note' => 'opcache not available']);
}
