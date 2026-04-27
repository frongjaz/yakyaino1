<?php
/**
 * Mirrors lib/id-encoder.ts: decode "checkkub" salted base64url car IDs.
 */

declare(strict_types=1);

const ID_ENCODER_SALT = 'checkkub';

function decode_car_id(string $encodedId): ?string {
    if ($encodedId === '') {
        return null;
    }

    // Plain numeric → use as-is
    if (preg_match('/^\d+$/', $encodedId) === 1) {
        return $encodedId;
    }

    // Restore base64 from base64url
    $base64 = strtr($encodedId, '-_', '+/');
    while (strlen($base64) % 4 !== 0) {
        $base64 .= '=';
    }

    $decoded = base64_decode($base64, true);
    if ($decoded === false) {
        return null;
    }

    if (strpos($decoded, ID_ENCODER_SALT) !== 0) {
        return null;
    }

    $idStr = substr($decoded, strlen(ID_ENCODER_SALT));
    if (preg_match('/^\d+$/', $idStr) !== 1) {
        return null;
    }

    return $idStr;
}
