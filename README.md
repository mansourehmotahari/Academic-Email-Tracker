# Academic Email Tracker

## Description
This Google Apps Script automates the tracking of emails sent to university professors during the academic application process. It logs details such as the recipient, date sent, subject, and response status into a Google Sheet, with each university's emails organized into separate sheets. Additionally, the script automatically updates the logs every four hours, though this interval is adjustable. This version contains reminder part.

## Features
- **Automated Email Logging:** Logs every email sent to professors, including details like the recipient's email, subject, and the date the email was sent.
- **Separate Sheets for Each University:** Emails are organized into individual sheets for each university, ensuring a clear and organized record for each institution.
- **Response Tracking:** Captures responses from professors to provide insights into follow-ups.
- **Google Sheets Integration:** Utilizes Google Sheets to organize and visualize the data effectively.
- **Automatic Updates:** The script is set to run every four hours, automatically updating the logs. This interval can be customized to meet your specific needs.

## Data Source
The script utilizes a comprehensive JSON file that includes university names and their associated email domains. This file is sourced from the following GitHub repository:
- [University Domains List](https://github.com/Hipo/university-domains-list)

### Downloading and Using the JSON Data
1. Download the JSON file from the repository.
2. Upload the downloaded file to your Google Drive.
3. Right-click on the file in Google Drive, select `Get shareable link`, and note the file ID from the URL.
   
   (https://drive.google.com/file/d/1IX-8EFWvl1rfTYkA-tCyh0C9GVe/view?usp=drive_link) The file ID in the example URL is: 1IX-8EFWvl1rfTYkA-tCyh0C9GVe
   
5. Right-click on the Google Drive and create a Google Sheet.
6. On the Google Sheet, from the Extention in Navigation Bar select Apps Script. 

## Setup Instructions
### Google Apps Script
1. In the created Apps Script do the following steps.
2. Copy the provided script into the script editor.
3. Replace `'YOUR_FILE_ID_HERE'` in the script with the file ID of your JSON file stored in Google Drive.
4. Save and name your project.
5. Run LogEmails in your script.

### Permissions
- Run the script initially from the script editor to authorize it to access your Gmail and Google Sheets.

## Usage
- **Manual Execution:** You can run the script manually from the Google Apps Script interface whenever needed.
- **Automatic Updates:** The script is configured to run automatically every four hours. You can adjust the frequency by modifying the trigger settings in the `setupTrigger` function.

## Customizing the Update Frequency
To change the frequency of the automatic updates, modify the `setupTrigger` function in the script:
```javascript
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
    .everyHours(4)  // Change this value to your desired interval
    .create();
}
