function loadUniversityData() {
  var fileId = "your-file-ID"; // استفاده از ID فایل
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
  return "No result";
}

function logEmails() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Sheet1");
  }
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

        sheet.appendRow([recipient, dateSent, subject, body, responseReceived, responseSummary, university]);
      }
    });
  });
}
