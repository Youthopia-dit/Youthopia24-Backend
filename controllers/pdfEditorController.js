const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const { PDFDocument, rgb } = require("pdf-lib");

// Utility function to generate QR code as a promise
function generateQRCode(data, outputPath) {
  return new Promise((resolve, reject) => {
    QRCode.toFile(outputPath, data, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function editPdf(data) {
  const pdfPaths = [];

  for (const event of data) {
    const existingPdfPath = path.join(__dirname, "../input.pdf"); // Path to your existing PDF template
    const pdfBytes = fs.readFileSync(existingPdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Generate QR code and wait for it to finish
    const qrCodePath = path.join(__dirname, "qrcode.png");
    await generateQRCode(JSON.stringify(event.email), qrCodePath);

    let yPosition = 630; // Using existing alignment without changing it
    firstPage.drawText(event.eventName, {
      x: 175,
      y: yPosition,
      size: 14,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(event.eventDate, {
      x: 175,
      y: yPosition - 20,
      size: 14,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(event.Venue, {
      x: 175,
      y: yPosition - 40,
      size: 14,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(
      `This is to certify that the below mentioned student(s) is/are bona fide student(s)\n of ${event.collegeName}.\n I confirm that the provided College ID(s) are valid and belong to the listed student(s).`,
      { x: 70, y: yPosition - 70, size: 14, color: rgb(0, 0, 0) }
    );

    // Load the QR code image
    const imageBytes = fs.readFileSync(qrCodePath);
    const image = await pdfDoc.embedPng(imageBytes);
    const imageDims = image.scale(0.5);

    // Draw the QR code image on the PDF
    firstPage.drawImage(image, {
      x: 425,
      y: 590,
      width: imageDims.width,
      height: imageDims.height,
    });

    // Participant section positioning (No changes to alignment)
    let participantYPosition = yPosition - 165;
    for (const participant of event.participants) {
      firstPage.drawText(participant.Sno.toString(), {
        x: 85,
        y: participantYPosition,
        size: 14,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(participant.name, {
        x: 145,
        y: participantYPosition,
        size: 14,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(participant.collegeId, {
        x: 305,
        y: participantYPosition,
        size: 14,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(participant.governmentId, {
        x: 450,
        y: participantYPosition,
        size: 14,
        color: rgb(0, 0, 0),
      });
      participantYPosition -= 20;
    }

    const outputPdfPath = path.join(
      __dirname,
      `../${event.email.split("@")[0]}-document.pdf`
    );

    // Ensure the output directory exists
    if (!fs.existsSync(path.dirname(outputPdfPath))) {
      fs.mkdirSync(path.dirname(outputPdfPath), { recursive: true });
    }

    const pdfBytesNew = await pdfDoc.save();
    fs.writeFileSync(outputPdfPath, pdfBytesNew);

    // Clean up QR code file after embedding it
    fs.unlink(qrCodePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });

    // Add the output PDF path to the results
    pdfPaths.push(outputPdfPath);
    console.log(
      `PDF for ${
        event.email.split("@")[0]
      } edited and saved at ${outputPdfPath}`
    );
  }

  return pdfPaths; // Return the paths of the generated PDFs
}

exports.getData = async (data) => {
//   const { data } = req.body
console.log(typeof data)
  try {
    const pdfPaths = await editPdf(data);
    res
      .status(200)
      .json({ message: "Documents processed successfully", pdfPaths });
  } catch (error) {
    console.error("Error processing documents:", error);
    res.status(500).json({ message: "Error processing request", error });
  }
};
