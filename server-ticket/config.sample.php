<?php
/**
 * Αντιγράψε σε config.php και συμπλήρωσε.
 * Το config.php ΜΗΝ το ανεβάσεις δημόσια / ΜΗΝ το βάλεις στο GitHub με κωδικό.
 */
return [
  // SMTP του HMailServer (συνήθως localhost αν το PHP τρέχει στο ίδιο μηχάνημα)
  'smtp_host' => '127.0.0.1',
  'smtp_port' => 25,          // ή 587 αν έχεις auth/TLS
  'smtp_user' => 'info@fitsolutions.gr',
  'smtp_pass' => 'ΒΑΛΕ_ΚΩΔΙΚΟ',
  'smtp_secure' => '',        // '' για port 25 local | 'tls' για 587

  'from_email' => 'info@fitsolutions.gr',
  'from_name'  => 'FITSOLUTIONS',
  'team_to'    => 'info@fitsolutions.gr',

  // Μετά την αποστολή
  'thanks_url' => 'https://fitsolutions.gr/ticket-thanks.html',

  // Προαιρετικά: μόνο από το site σου
  'allowed_origin' => 'https://fitsolutions.gr',
];
