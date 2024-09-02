function loadUniversityData() {
  var fileId = "Your-file-id"; 
  var file = DriveApp.getFileById(fileId);
  var content = file.getBlob().getDataAsString();
  return JSON.parse(content);
}

function getUniversityFromDomain(domain, universityData) {
  for (var i = 0; i < universityData.length; i++) {
    if (universityData[i].domains.includes(domain)) {
      return universityData[i].name;
    }
  }
  return null; 
}

function logEmails() {
  var threads = GmailApp.search('in:sent after:2024/08/08');
  var universityData = loadUniversityData();
  
  threads.forEach(function(thread) {
    var messages = thread.getMessages();
    messages.forEach(function(message) {
      if (message.getFrom().includes(Session.getActiveUser().getEmail())) {
        var recipient = message.getTo();
        var dateSent = message.getDate().toLocaleString();
        var subject = message.getSubject();
        var body = message.getPlainBody().substring(0, 100);
        var emailDomain = recipient.split('@')[1];
        var responseReceived = "No";
        var responseSummary = "";
        var responses = thread.getMessages().filter(msg => !msg.getFrom().includes(Session.getActiveUser().getEmail()));

        if (responses.length > 0) {
          responseReceived = "Yes";
          responseSummary = responses[0].getPlainBody().substring(0, 100);
        }

        var university = getUniversityFromDomain(emailDomain, universityData);
        var rowData = [recipient, dateSent, subject, body, responseReceived, responseSummary];

        if (university !== null) {
          var sheet = getOrCreateSheet(university);
          var lastRow = sheet.getLastRow();
          
          // Add reminder columns if response is No
          if (responseReceived === "No") {
            var reminderDate1 = new Date(message.getDate());
            reminderDate1.setDate(reminderDate1.getDate() + 3);
            rowData.push(reminderDate1.toLocaleDateString());

            if (lastRow > 1) {
              var prevReminder1 = sheet.getRange(lastRow, 7).getValue();
              if (prevReminder1 !== "") {
                var reminderDate2 = new Date(prevReminder1);
                reminderDate2.setDate(reminderDate2.getDate() + 3);
                rowData.push(reminderDate2.toLocaleDateString());
              }
            }

            if (lastRow > 1 && rowData.length > 7) {
              var prevReminder2 = sheet.getRange(lastRow, 8).getValue();
              if (prevReminder2 !== "") {
                var reminderDate3 = new Date(prevReminder2);
                reminderDate3.setDate(reminderDate3.getDate() + 3);
                rowData.push(reminderDate3.toLocaleDateString());
              }
            }

            // Send reminder email to your email address
            sendReminderEmail(Session.getActiveUser().getEmail(), recipient, subject);
          }

          sheet.appendRow(rowData);
        } else {
          var unknownDomainsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("UnknownDomains");
          if (!unknownDomainsSheet) {
            unknownDomainsSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("UnknownDomains");
          }
          unknownDomainsSheet.appendRow([recipient, dateSent, subject, body, emailDomain, "Unknown"]);
        }
      }
    });
  });
}

function getOrCreateSheet(sheetName) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    sheet.appendRow(["Recipient", "Date Sent", "Subject", "Body", "Response Received", "Response Summary", "Reminder1", "Reminder2", "Reminder3"]);
  }
  
  return sheet;
}

function sendReminderEmail(yourEmail, recipient, subject) {
  var reminderSubject = "Reminder: Follow up on email sent to " + recipient;
  var reminderBody = "This is a reminder to follow up on the email you sent to " + recipient + " regarding the subject: " + subject + ". Please ensure to get in touch.";
  MailApp.sendEmail(yourEmail, reminderSubject, reminderBody);
}

function setupTrigger() {
  // Clear existing triggers on the logEmails function
  var existingTriggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < existingTriggers.length; i++) {
    if (existingTriggers[i].getHandlerFunction() == 'logEmails') {
      ScriptApp.deleteTrigger(existingTriggers[i]);
    }
  }

  // Set a new time-driven trigger to run logEmails at the desired interval
  ScriptApp.newTrigger('logEmails')
    .timeBased()
    .everyHours(24)  // Change this value to your desired interval
    .create();
}
