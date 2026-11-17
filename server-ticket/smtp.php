<?php
/**
 * Minimal SMTP sender for HMailServer (no Composer).
 */
function smtp_send(array $cfg, string $to, string $subject, string $body, ?string $replyTo = null): void {
  $host = $cfg['smtp_host'];
  $port = (int)$cfg['smtp_port'];
  $timeout = 20;
  $errno = 0;
  $errstr = '';

  $remote = ($cfg['smtp_secure'] === 'ssl' ? 'ssl://' : '') . $host;
  $fp = @fsockopen($remote, $port, $errno, $errstr, $timeout);
  if (!$fp) {
    throw new RuntimeException("SMTP connect failed: $errstr ($errno)");
  }
  stream_set_timeout($fp, $timeout);

  $read = function () use ($fp) {
    $data = '';
    while ($str = fgets($fp, 515)) {
      $data .= $str;
      if (isset($str[3]) && $str[3] === ' ') break;
    }
    return $data;
  };
  $write = function ($cmd) use ($fp) {
    fwrite($fp, $cmd . "\r\n");
  };
  $expect = function ($code) use ($read) {
    $resp = $read();
    if (strpos($resp, (string)$code) !== 0) {
      throw new RuntimeException("SMTP unexpected reply: $resp");
    }
    return $resp;
  };

  $expect(220);
  $write('EHLO fitsolutions.gr');
  $ehlo = $read();
  if (strpos($ehlo, '250') !== 0) {
    $write('HELO fitsolutions.gr');
    $expect(250);
  }

  if (!empty($cfg['smtp_secure']) && $cfg['smtp_secure'] === 'tls') {
    $write('STARTTLS');
    $expect(220);
    if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
      throw new RuntimeException('STARTTLS failed');
    }
    $write('EHLO fitsolutions.gr');
    $expect(250);
  }

  if ($cfg['smtp_user'] !== '' && $cfg['smtp_pass'] !== '') {
    $write('AUTH LOGIN');
    $expect(334);
    $write(base64_encode($cfg['smtp_user']));
    $expect(334);
    $write(base64_encode($cfg['smtp_pass']));
    $expect(235);
  }

  $from = $cfg['from_email'];
  $write('MAIL FROM:<' . $from . '>');
  $expect(250);
  $write('RCPT TO:<' . $to . '>');
  $expect(250);
  $write('DATA');
  $expect(354);

  $headers = [];
  $headers[] = 'From: ' . encode_address($cfg['from_name'], $from);
  $headers[] = 'To: <' . $to . '>';
  if ($replyTo) {
    $headers[] = 'Reply-To: <' . $replyTo . '>';
  }
  $headers[] = 'Subject: ' . encode_header($subject);
  $headers[] = 'MIME-Version: 1.0';
  $headers[] = 'Content-Type: text/plain; charset=UTF-8';
  $headers[] = 'Content-Transfer-Encoding: 8bit';
  $headers[] = 'Date: ' . date('r');
  $headers[] = 'Message-ID: <' . bin2hex(random_bytes(12)) . '@fitsolutions.gr>';

  $data = implode("\r\n", $headers) . "\r\n\r\n" . str_replace(["\r\n.", "\n."], ["\r\n..", "\n.."], $body) . "\r\n.";
  $write($data);
  $expect(250);
  $write('QUIT');
  fclose($fp);
}

function encode_header(string $text): string {
  if (preg_match('/[^\x20-\x7E]/', $text)) {
    return '=?UTF-8?B?' . base64_encode($text) . '?=';
  }
  return $text;
}

function encode_address(string $name, string $email): string {
  $n = encode_header($name);
  return sprintf('%s <%s>', $n, $email);
}
