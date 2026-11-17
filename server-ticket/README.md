# Ticket endpoint για HMailServer

Στέλνει στον πελάτη mail **From: info@fitsolutions.gr** μέσω του HMail σου.

## Τι χρειάζεσαι στο server
- Windows server με **HMailServer**
- **IIS** (ή Apache) + **PHP 8+** στο ίδιο μηχάνημα (ιδανικά) ώστε SMTP = `127.0.0.1:25`

## Εγκατάσταση
1. Αντιγράψε τον φάκελο `server-ticket` στο web root, π.χ.  
   `C:\inetpub\wwwroot\fitsolutions-ticket\`
2. Αντιγράψε `config.sample.php` → `config.php`
3. Συμπλήρωσε στο `config.php`:
   - `smtp_user` / `smtp_pass` = info@fitsolutions.gr
   - Αν το PHP είναι στο ίδιο PC με HMail: `smtp_host=127.0.0.1`, `smtp_port=25`, `smtp_secure=''`
4. Στο HMailServer:
   - Settings → Protocols → SMTP → επιτρέψτε local relay / auth όπως το έχεις
   - Το account `info@fitsolutions.gr` να μπορεί να στείλει (SMTP auth)
5. Δοκίμασε στο browser:  
   `https://IP-ή-hostname/ticket.php` → πρέπει να πει Method not allowed (OK)
6. Στείλε στον agent το δημόσιο URL, π.χ.  
   `https://mail.fitsolutions.gr/ticket.php`  
   για να το βάλει στο `ticket-config.js`

## Firewall
Αν το PHP δεν είναι στο ίδιο μηχάνημα, άνοιξε SMTP μόνο από το IP του web server προς το HMail — όχι ανοιχτά στο internet χωρίς auth.
