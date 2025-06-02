const express = require('express');
const multer = require('multer');
const { convertToPDF, joinPDFs } = require('./pdfService'); // Your service for handling PDF operations
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json()); // Middleware to parse JSON bodies

app.post('/api/convert-to-pdf', upload.array('files'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded.' });
    }
    const pdfPaths = await convertToPDF(req.files); // Implement this function
    res.json({ success: true, filePath: pdfPaths[0] }); // Return the first converted PDF path
  } catch (error) {
    console.error('Conversion error:', error); // Log the error
    res.status(500).json({ success: false, message: 'Conversion failed: ' + error.message });
  }
});

app.post('/api/join-pdfs', async (req, res) => {
  try {
    const pdfPath = await joinPDFs(req.body.files); // Implement this function
    res.json({ success: true, filePath: pdfPath });
  } catch (error) {
    console.error('Joining error:', error); // Log the error
    res.status(500).json({ success: false, message: 'Joining failed: ' + error.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
