<?php
/**
 * FITSOLUTIONS ticket endpoint for HMailServer.
 * Βάλε αυτόν τον φάκελο σε IIS/Apache στο server του HMail (ή όπου φτάνει SMTP).
 * Form action: https://YOUR-SERVER/ticket.php
 */
declare(strict_types=1);
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo 'Method not allowed';
  exit;
}

$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) {
  http_response_code(500);
  echo 'Missing config.php – copy config.sample.php to config.php';
  exit;
}

/** @var array $cfg */
$cfg = require $configFile;
require __DIR__ . '/smtp.php';

// Honeypot
if (!empty($_POST['website'])) {
  redirect_thanks($cfg);
}

$name = trim((string)($_POST['name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$company = trim((string)($_POST['company'] ?? ''));
$phone = trim((string)($_POST['phone'] ?? ''));
$urgency = trim((string)($_POST['urgency'] ?? ''));
$remoteOk = trim((string)($_POST['remote_ok'] ?? ''));
$device = trim((string)($_POST['device'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $message === '') {
  http_response_code(400);
  echo 'Invalid ticket data';
  exit;
}

$teamBody =
  "New IT Support ticket\n\n" .
  "Name: {$name}\n" .
  "Company: {$company}\n" .
  "Email: {$email}\n" .
  "Phone: {$phone}\n" .
  "Urgency: {$urgency}\n" .
  "Remote OK: {$remoteOk}\n" .
  "Device: {$device}\n\n" .
  "Message:\n{$message}\n";

$first = $name !== '' ? explode(' ', $name)[0] : '';
$clientBody =
  'Hello' . ($first !== '' ? ' ' . $first : '') . ",\n\n" .
  "Your support ticket has been opened and is being reviewed by our team. " .
  "We will update you shortly.\n\n" .
  "If this is urgent, call +30 6947 308 511.\n\n" .
  "—\n" .
  "FITSOLUTIONS\n" .
  "info@fitsolutions.gr\n" .
  "https://fitsolutions.gr\n";

try {
  // 1) Notify team
  smtp_send($cfg, $cfg['team_to'], 'New IT Support Ticket – ' . ($name !== '' ? $name : $email), $teamBody, $email);
  // 2) Confirm client FROM info@
  smtp_send($cfg, $email, 'Your ticket has been opened – FITSOLUTIONS', $clientBody, $cfg['from_email']);
} catch (Throwable $e) {
  http_response_code(500);
  echo 'Mail error: ' . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8');
  exit;
}

redirect_thanks($cfg);

function redirect_thanks(array $cfg): void {
  $url = $cfg['thanks_url'] ?? 'https://fitsolutions.gr/ticket-thanks.html';
  header('Location: ' . $url, true, 303);
  exit;
}
