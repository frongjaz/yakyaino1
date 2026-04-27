<?php
/**
 * Database connection (PDO)
 * Reads credentials from .env.local one directory above public_html (or env vars)
 */

declare(strict_types=1);

if (!defined('API_LIB_LOADED')) {
    define('API_LIB_LOADED', true);
}

// Load .env.local if present (simple parser, no dotenv dependency)
function load_env_file(string $path): void {
    if (!is_file($path) || !is_readable($path)) {
        return;
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') {
            continue;
        }
        if (strpos($line, '=') === false) {
            continue;
        }
        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        // Strip surrounding quotes
        if (strlen($value) >= 2) {
            $first = $value[0];
            $last = $value[strlen($value) - 1];
            if (($first === '"' && $last === '"') || ($first === "'" && $last === "'")) {
                $value = substr($value, 1, -1);
            }
        }
        if (getenv($key) === false) {
            putenv("$key=$value");
            $_ENV[$key] = $value;
        }
    }
}

// Try common locations for .env.local
$envCandidates = [
    __DIR__ . '/../../.env.local',     // public_html/.env.local
    __DIR__ . '/../.env.local',        // public_html/api/.env.local
    dirname($_SERVER['DOCUMENT_ROOT'] ?? '') . '/.env.local', // sibling of public_html
];
foreach ($envCandidates as $candidate) {
    if (is_file($candidate)) {
        load_env_file($candidate);
        break;
    }
}

function env(string $key, ?string $default = null): ?string {
    $value = getenv($key);
    if ($value === false || $value === '') {
        return $_ENV[$key] ?? $default;
    }
    return $value;
}

function get_pdo(): PDO {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $host = env('DB_HOST', 'localhost');
    $port = env('DB_PORT', '3306');
    $dbname = env('DB_NAME', '');
    $user = env('DB_USER', '');
    $password = env('DB_PASSWORD', '');
    $socket = env('DB_SOCKET_PATH');

    if ($dbname === '' || $user === '') {
        throw new RuntimeException('Database credentials not configured (DB_NAME / DB_USER missing)');
    }

    if ($socket) {
        $dsn = "mysql:unix_socket=$socket;dbname=$dbname;charset=utf8mb4";
    } else {
        $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
    }

    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
    ]);

    return $pdo;
}

function db_query(string $sql, array $params = []): array {
    $stmt = get_pdo()->prepare($sql);
    $stmt->execute($params);
    if (stripos(ltrim($sql), 'SELECT') === 0 || stripos(ltrim($sql), 'SHOW') === 0) {
        return $stmt->fetchAll();
    }
    return [];
}

function db_execute(string $sql, array $params = []): array {
    $pdo = get_pdo();
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return [
        'affected_rows' => $stmt->rowCount(),
        'insert_id' => (int) $pdo->lastInsertId(),
    ];
}
