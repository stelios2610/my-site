/**
 * FITSOLUTIONS – Ticket mail FROM info@fitsolutions.gr
 *
 * Τρέξε το ΜΟΝΟ ενώ είσαι συνδεδεμένος ως info@fitsolutions.gr
 * (Google Workspace ή Gmail).
 *
 * Deploy → New deployment → Web app
 *   Execute as: Me
 *   Who has access: Anyone
 *
 * Μετά στείλε το Web app URL στον agent να το βάλει στο ticket.html
 */

var TEAM_TO = 'info@fitsolutions.gr';
var FROM_NAME = 'FITSOLUTIONS';
var THANKS_URL = 'https://fitsolutions.gr/ticket-thanks.html';

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
      return page_('Missing email or message.', false);
    }

    MailApp.sendEmail({
      to: TEAM_TO,
      replyTo: email,
      name: FROM_NAME,
      subject: 'New IT Support Ticket – ' + (name || email),
      body:
        'New IT Support ticket\n\n' +
        'Name: ' + name + '\n' +
        'Company: ' + company + '\n' +
        'Email: ' + email + '\n' +
        'Phone: ' + phone + '\n' +
        'Urgency: ' + urgency + '\n' +
        'Remote OK: ' + remoteOk + '\n' +
        'Device: ' + device + '\n\n' +
        'Message:\n' + message + '\n'
    });

    MailApp.sendEmail({
      to: email,
      replyTo: TEAM_TO,
      name: FROM_NAME,
      subject: 'Your ticket has been opened – FITSOLUTIONS',
      body:
        'Hello' + (name ? ' ' + name.split(/\s+/)[0] : '') + ',\n\n' +
        'Your support ticket has been opened and is being reviewed by our team. ' +
        'We will update you shortly.\n\n' +
        'If this is urgent, call +30 6947 308 511.\n\n' +
        '—\n' +
        'FITSOLUTIONS\n' +
        'info@fitsolutions.gr\n' +
        'https://fitsolutions.gr\n'
    });

    return page_('OK', true);
  } catch (err) {
    return page_('Error: ' + err, false);
  }
}

function doGet() {
  return ContentService
    .createTextOutput('FITSOLUTIONS ticket endpoint OK')
    .setMimeType(ContentService.MimeType.TEXT);
}

function page_(msg, ok) {
  var html = ok
    ? '<!DOCTYPE html><html><head><meta charset="utf-8">' +
      '<meta http-equiv="refresh" content="0;url=' + THANKS_URL + '">' +
      '<script>location.replace(' + JSON.stringify(THANKS_URL) + ');</script>' +
      '</head><body>Ticket sent. Redirecting…</body></html>'
    : '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>' +
      '<p>' + msg + '</p><p><a href="https://fitsolutions.gr/ticket.html">Back</a></p></body></html>';
  return HtmlService.createHtmlOutput(html);
}
