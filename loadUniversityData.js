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
  var threads = GmailApp.search('in:sent after:2023/01/01');
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

        if (university !== null) {
          var sheet = getOrCreateSheet(university);
          sheet.appendRow([recipient, dateSent, subject, body, responseReceived, responseSummary]);
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
    sheet.appendRow(["Recipient", "Date Sent", "Subject", "Body", "Response Received", "Response Summary"]);
  }
  
  return sheet;
}
