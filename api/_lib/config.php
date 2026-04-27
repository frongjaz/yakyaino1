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
$envCandidates = [];
if (!empty($_SERVER['DOCUMENT_ROOT'])) {
    $envCandidates[] = $_SERVER['DOCUMENT_ROOT'] . '/.env.local';
    $envCandidates[] = dirname($_SERVER['DOCUMENT_ROOT']) . '/.env.local';
}
$envCandidates[] = __DIR__ . '/../../.env.local';     // public_html/.env.local
$envCandidates[] = __DIR__ . '/../.env.local';        // public_html/api/.env.local
$envCandidates[] = __DIR__ . '/.env.local';           // public_html/api/_lib/.env.local

foreach ($envCandidates as $candidate) {
    if (is_file($candidate) && is_readable($candidate)) {
        load_env_file($candidate);
        break;
    }
}

function env(string $key, ?string $default = null): ?string {
    // Try $_ENV first (set by load_env_file or web server)
    if (isset($_ENV[$key]) && $_ENV[$key] !== '') {
        return $_ENV[$key];
    }
    // Fall back to $_SERVER (DirectAdmin/Apache SetEnv stores env vars here)
    if (isset($_SERVER[$key]) && $_SERVER[$key] !== '') {
        return $_SERVER[$key];
    }
    // Fall back to getenv() (CLI / putenv'd values)
    $value = getenv($key);
    if ($value !== false && $value !== '') {
        return $value;
    }
    return $default;
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
