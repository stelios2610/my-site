/**
 * FITSOLUTIONS – Ticket mail handler (Google Apps Script)
 *
 * SETUP (κάνε το με λογαριασμό info@fitsolutions.gr):
 * 1) https://script.google.com → New project
 * 2) Κόλλα αυτό το αρχείο, Save
 * 3) Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4) Αντίγραψε το Web app URL
 * 5) Βάλ’ το στο ticket.html ως TICKET_ENDPOINT
 *
 * Αποτέλεσμα:
 * - Εσύ παίρνεις το ticket στο info@fitsolutions.gr
 * - Ο πελάτης παίρνει αγγλική επιβεβαίωση FROM info@fitsolutions.gr
 */

var TEAM_TO = 'info@fitsolutions.gr';
var FROM_NAME = 'FITSOLUTIONS';

function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};
    var name = String(p.name || '').trim();
    var email = String(p.email || '').trim();
    var company = String(p.company || '').trim();
    var phone = String(p.phone || '').trim();
    var urgency = String(p.urgency || '').trim();
    var remoteOk = String(p.remote_ok || '').trim();
    var device = String(p.device || '').trim();
    var message = String(p.message || '').trim();

    if (!email || !message) {
      return json_({ ok: false, error: 'missing_fields' });
    }

    var ticketBody =
      'New IT Support ticket\n\n' +
      'Name: ' + name + '\n' +
      'Company: ' + company + '\n' +
      'Email: ' + email + '\n' +
      'Phone: ' + phone + '\n' +
      'Urgency: ' + urgency + '\n' +
      'Remote OK: ' + remoteOk + '\n' +
      'Device: ' + device + '\n\n' +
      'Message:\n' + message + '\n';

    MailApp.sendEmail({
      to: TEAM_TO,
      replyTo: email,
      name: FROM_NAME,
      subject: 'New IT Support Ticket – ' + (name || email),
      body: ticketBody
    });

    var clientBody =
      'Hello' + (name ? ' ' + name.split(' ')[0] : '') + ',\n\n' +
      'Your support ticket has been opened and is being reviewed by our team. ' +
      'We will update you shortly.\n\n' +
      'If this is urgent, call +30 6947 308 511.\n\n' +
      '—\n' +
      'FITSOLUTIONS\n' +
      'info@fitsolutions.gr\n' +
      'https://fitsolutions.gr\n';

    MailApp.sendEmail({
      to: email,
      replyTo: TEAM_TO,
      name: FROM_NAME,
      subject: 'Your ticket has been opened – FITSOLUTIONS',
      body: clientBody
    });

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return ContentService
    .createTextOutput('FITSOLUTIONS ticket endpoint OK')
    .setMimeType(ContentService.MimeType.TEXT);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
