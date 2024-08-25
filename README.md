# Academic Email Tracker

## Description
This Google Apps Script automates the tracking of emails sent to university professors during the academic application process. It logs details such as the recipient, date sent, subject, and response status into a Google Sheet, providing a detailed record of communications.

## Features
- **Automated Email Logging:** Logs every email sent, including details like the recipient's email, subject, and the date the email was sent.
- **Response Tracking:** Captures responses from professors to provide insights into follow-ups.
- **Google Sheets Integration:** Utilizes Google Sheets to organize and visualize the data effectively.

## Data Source
The script utilizes a comprehensive JSON file that includes university names and their associated email domains. This file is sourced from the following GitHub repository:
- [University Domains List](https://github.com/Hipo/university-domains-list)

### Downloading and Using the JSON Data
1. Download the JSON file from the repository.
2. Upload the downloaded file to your Google Drive.
3. Right-click on the file in Google Drive, select `Get shareable link`, and note the file ID from the URL.

## Setup Instructions
### Google Apps Script
1. Go to [Google Apps Script](https://script.google.com) and create a new project.
2. Copy the provided script into the script editor.
3. Replace `'YOUR_FILE_ID_HERE'` in the script with the file ID of your JSON file stored in Google Drive.
4. Save and name your project.

### Google Sheets
- Create a new Google Sheet to log the email data.
- Note the name of the sheet (default is 'Sheet1') or change it as per your preference in the script.

### Permissions
- Run the script initially from the script editor to authorize it to access your Gmail and Google Sheets.

## Usage
- Manually: Run the script from the Google Apps Script interface whenever needed.
- Automatically: Set up a time-driven trigger in Google Apps Script to execute the script at regular intervals (daily, weekly, etc.).

## Contributing
Feel free to fork this repository and contribute to the project by submitting pull requests with improvements or new features.

## Contact
For support or to report issues, please file an issue through the GitHub issue tracker associated with this repository.
