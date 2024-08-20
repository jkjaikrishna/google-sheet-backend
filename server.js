const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const app = express();
require('dotenv').config();


app.use(express.json());
app.use(cors());

const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
// const serviceAccount = require('./google-sheet-service-account.json.json');

// Set up Google Sheets API client
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

app.post('/saveProfile', async (req, res) => {
  const { email, username, password, dob, gender, address, mobile } = req.body;

  const spreadsheetId = '1c4XQoR79x3kL_YdjYgKEsiOKLejkDl98gtAPdAtSf5Q';
  const range = 'Sheet1!A2:G2';

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [
          [email, username, password, dob, gender, address, mobile],
        ],
      },
    });
    res.status(200).send('Profile saved successfully!');
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).send('Failed to save profile');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
