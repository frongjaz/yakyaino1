<?php
if ($_GET['key'] !== 'ck2024deploy') { http_response_code(403); exit('Forbidden'); }

header('Content-Type: text/plain; charset=utf-8');

$AW_ID  = 'AW-18454436997';
$GA_ID  = 'G-FYBXY405LR';
$TAG    = '<script async src="https://www.googletagmanager.com/gtag/js?id=' . $AW_ID . '"></script>'
        . '<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag(\'js\',new Date());gtag(\'config\',\'' . $AW_ID . '\');gtag(\'config\',\'' . $GA_ID . '\');</script>';

// หา document root จริงๆ
$roots = [
    $_SERVER['DOCUMENT_ROOT'],
    dirname(__DIR__),
    '/domains/checkkub.com/public_html',
];

echo "DOCUMENT_ROOT: " . $_SERVER['DOCUMENT_ROOT'] . "\n";
echo "Script dir:    " . __DIR__ . "\n\n";

$injected = 0;

foreach ($roots as $root) {
    $root = rtrim($root, '/');
    $html = $root . '/index.html';
    if (!file_exists($html)) {
        echo "ไม่พบ: $html\n";
        continue;
    }

    $content = file_get_contents($html);

    // ถ้ามี tag แล้ว
    if (strpos($content, $AW_ID) !== false) {
        echo "✅ มี Google tag แล้วใน: $html\n";
        $injected++;
        continue;
    }

    // inject ก่อน </head>
    $new = str_replace('</head>', $TAG . '</head>', $content, $count);
    if ($count === 0) {
        // fallback: inject หลัง <head>
        $new = str_replace('<head>', '<head>' . $TAG, $content, $count);
    }

    if ($count > 0 && file_put_contents($html, $new) !== false) {
        echo "✅ Injected Google tag → $html\n";
        $injected++;
    } else {
        echo "❌ เขียนไม่ได้: $html\n";
    }
    break; // inject แค่ root แรกที่เจอ
}

echo "\nDone. injected=$injected\n";
unlink(__FILE__);
echo "Script deleted.\n";
