const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const { SendEmail } = require("../utils/mailer");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

// Utility function to generate QR code as a promise
function generateQRCode(data, outputPath) {
  return new Promise((resolve, reject) => {
    QRCode.toFile(outputPath, data, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
async function sendMail(email, outputPath) {
  const subject = "Your Youthopia Documents";
  const content =
    "Dear Participant,\n\nPlease find attached your documents for the Youthopia event.\n\nBest regards,\nYouthopia Team";
  const emailStatus = await SendEmail(email, subject, content, outputPath);
  console.log(`Email status for ${email}: ${emailStatus}`);
  if (emailStatus == "Mail Sent Successfully") {
    return true;
  }
}

async function editPdf(data) {
  for (const event of data) {
    const existingPdfPath = path.join(__dirname, "../input.pdf");
    const pdfBytes = fs.readFileSync(existingPdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Generate QR code and wait for it to finish
    const qrCodePath = path.join(__dirname, "../qrcode.png");
    await generateQRCode(
      JSON.stringify(event, ["email", "regID", "eventID"]),
      qrCodePath
    );

    let yPosition = 627;
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
      `This is to certify that the below mentioned student(s) is/are bona fide student(s) of ${event.collegeName}.\n I confirm that the provided College ID(s) are valid and belong to the listed student(s).`,
      { x: 70, y: yPosition - 70, size: 10, color: rgb(0, 0, 0) }
    );

    // Load the QR code image
    const imageBytes = fs.readFileSync(qrCodePath);
    const image = await pdfDoc.embedPng(imageBytes);
    const imageDims = image.scale(0.45);

    // Draw the QR code image on the PDF
    firstPage.drawImage(image, {
      x: 420,
      y: 587,
      width: imageDims.width,
      height: imageDims.height,
    });

    let participantYPosition = yPosition - 170;
    for (const participant of event.participants) {
      firstPage.drawText(participant.Sno.toString(), {
        x: 85,
        y: participantYPosition,
        size: 12,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(participant.name, {
        x: 145,
        y: participantYPosition,
        size: 12,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(participant.collegeId, {
        x: 305,
        y: participantYPosition,
        size: 12,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(participant.governmentId, {
        x: 450,
        y: participantYPosition,
        size: 12,
        color: rgb(0, 0, 0),
      });
      participantYPosition -= 15;
    }
    firstPage.drawText("Name of Certifying Authority:", {
      x: 85,
      y: participantYPosition - 20,
      size: 12,
      font: timesRomanFont,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText("Designation:", {
      x: 85,
      y: participantYPosition - 40,
      size: 12,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText("Official Contact Information:", {
      x: 85,
      y: participantYPosition - 60,
      size: 12,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText("Signature/Seal:", {
      x: 85,
      y: participantYPosition - 80,
      size: 12,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText("Date:", {
      x: 450,
      y: participantYPosition - 80,
      size: 12,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    const outputPdfPath = path.join(
      __dirname,
      `../${event.email.split("@")[0]}-gate pass.pdf`
    );
    if (!fs.existsSync(path.dirname(outputPdfPath))) {
      fs.mkdirSync(path.dirname(outputPdfPath), { recursive: true });
    }

    const pdfBytesNew = await pdfDoc.save();
    fs.writeFileSync(outputPdfPath, pdfBytesNew);
    console.log(
      `PDF for ${event.email.split("@")[0]} edited and saved successfully.`
    );
    const mailstatus = await sendMail(event.email, outputPdfPath);
    if (mailstatus) {
      fs.unlink(qrCodePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
      fs.unlink(outputPdfPath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
    }
  }
}

exports.getData = async (req, res) => {
  const { data } = req.body;
  try {
    await editPdf(data);
    res.status(200).json({ message: "Documents processed successfully" });
  } catch (error) {
    console.error("Error processing documents:", error);
    res.status(500).json({ message: "Error processing request", error });
  }
};
