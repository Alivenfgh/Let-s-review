const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdf-lib').PDFDocument; // Install pdf-lib for PDF manipulation

const convertToPDF = async (files) => {
  const pdfPaths = [];
  for (const file of files) {
    const pdfPath = path.join(__dirname, 'uploads', `${file.originalname}.pdf`);
    const result = await mammoth.convertToHtml({ path: file.path });
    fs.writeFileSync(pdfPath, result.value); // Save the PDF (this is just an example)
    pdfPaths.push(pdfPath);
  }
  return pdfPaths; // Return the paths to the converted PDFs
};

const joinPDFs = async (filePaths) => {
  const mergedPdf = await PDFDocument.create();
  for (const filePath of filePaths) {
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  const mergedPdfPath = path.join(__dirname, 'uploads', 'merged.pdf');
  fs.writeFileSync(mergedPdfPath, await mergedPdf.save());
  return mergedPdfPath; // Return the path to the merged PDF
};

module.exports = { convertToPDF, joinPDFs };
