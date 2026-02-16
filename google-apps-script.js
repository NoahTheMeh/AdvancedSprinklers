// =============================================================
// Google Apps Script — paste this into script.google.com
// =============================================================
//
// SETUP:
//  1. Go to https://script.google.com and click "New project"
//  2. Delete the default code and paste this entire file
//  3. Click Deploy > New deployment
//  4. Type = "Web app"
//  5. Execute as = "Me"
//  6. Who has access = "Anyone"
//  7. Click Deploy, authorize when prompted
//  8. Copy the Web app URL
//  9. Paste it into js/main.js where it says APPS_SCRIPT_URL
//
// =============================================================

var TO_EMAIL = 'advancedsprinklersidaho@gmail.com';
var SUBJECT_PREFIX = 'Advanced Sprinklers Inquiry';
var MAX_SUBMISSIONS_PER_HOUR = 100;

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Honeypot check — if the hidden field has a value, it's a bot
    if (data.website) {
      // Return success so bots think it worked
      return ContentService
        .createTextOutput(JSON.stringify({ result: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Rate limiting — cap submissions per hour
    var props = PropertiesService.getScriptProperties();
    var now = Math.floor(Date.now() / 1000);
    var windowStart = Number(props.getProperty('rl_window') || 0);
    var count = Number(props.getProperty('rl_count') || 0);

    if (now - windowStart > 3600) {
      // Reset the window
      windowStart = now;
      count = 0;
    }

    count++;
    props.setProperty('rl_window', String(windowStart));
    props.setProperty('rl_count', String(count));

    if (count > MAX_SUBMISSIONS_PER_HOUR) {
      return ContentService
        .createTextOutput(JSON.stringify({ result: 'error', error: 'Too many submissions. Please try again later or call us.' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var name = data.name || 'No name';
    var phone = data.phone || 'Not provided';
    var email = data.email || 'Not provided';
    var service = data.service || 'Not specified';
    var message = data.message || 'No message';

    var subject = SUBJECT_PREFIX + ': ' + service + ' — ' + name;

    var body = 'New inquiry from the Advanced Sprinklers website:\n\n'
      + 'Name:    ' + name + '\n'
      + 'Phone:   ' + phone + '\n'
      + 'Email:   ' + email + '\n'
      + 'Service: ' + service + '\n\n'
      + 'Message:\n' + message + '\n';

    // 1) Notification to the business with all form details
    MailApp.sendEmail({
      to: TO_EMAIL,
      subject: subject,
      body: body,
      replyTo: email,
      name: 'Advanced Sprinklers Website'
    });

    // 2) Confirmation to the customer
    var confirmSubject = 'Thanks for contacting Advanced Sprinklers!';
    var confirmBody = 'Hi ' + name + ',\n\n'
      + 'Thank you for reaching out to Advanced Sprinklers! We received your inquiry and a member of our team will follow up with you shortly.\n\n'
      + 'Here\'s a summary of what you submitted:\n'
      + '  Service: ' + service + '\n'
      + '  Message: ' + message + '\n\n'
      + 'If you need immediate assistance, give us a call at (208) 687-1955.\n\n'
      + 'We appreciate your interest and look forward to working with you!\n\n'
      + '— The Advanced Sprinklers Team\n'
      + 'advancedsprinklersidaho@gmail.com\n'
      + '(208) 687-1955';

    MailApp.sendEmail({
      to: email,
      subject: confirmSubject,
      body: confirmBody,
      name: 'Advanced Sprinklers Inc.'
    });

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Required for CORS preflight (browsers may send OPTIONS)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
