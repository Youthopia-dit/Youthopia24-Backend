const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

function generateQRCode(data, outputPath) {
  return new Promise((resolve, reject) => {
    QRCode.toFile(outputPath, data, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function editticket(data) {
  let files = [];
  for (const event of data) {
    ev = event[0];
    const existingPdfPath = path.join(__dirname, "../ticket.pdf");
    const pdfBytes = fs.readFileSync(existingPdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    console.log("gsfgsfb");
    console.log(ev);
    let xPosition = 400;
    firstPage.drawText(`Name: ${ev.teamName}`, {
      x: xPosition,
      y: 242,
      size: 15,
      color: rgb(1, 1, 1),
    });
    firstPage.drawText(
      `College Name: ${ev.collegeName.length > 42
        ? ev.collegeName.slice(0, 42) + "\n" + ev.collegeName.slice(42)
        : ev.collegeName
      }`,
      {
        x: xPosition,
        y: 192,
        size: 15,
        color: rgb(1, 1, 1),
      }
    );
    firstPage.drawText(`Members:  ${ev.participants.length}`, {
      x: xPosition,
      y: 142,
      size: 15,
      color: rgb(1, 1, 1),
    });
    firstPage.drawText(`Ticket ID: ${ev.orderID}`, {
      x: xPosition,
      y: 102,
      size: 15,
      color: rgb(1, 1, 1),
    });
    firstPage.drawText(`Name: ${ev.eventName}`, {
      x: xPosition + 470,
      y: 242,
      size: 15,
      color: rgb(1, 1, 1),
    });
    firstPage.drawText(
      `Date:  ${ev.eventDate}`,
      {
        x: xPosition + 470,
        y: 202,
        size: 15,
        color: rgb(1, 1, 1),
      }
    );
    firstPage.drawText(
      `Time:  ${ev.eventTime}`,
      {
        x: xPosition + 470,
        y: 162,
        size: 15,
        color: rgb(1, 1, 1),
      }
    );
    firstPage.drawText(`Venue:  ${ev.Venue}`, {
      x: xPosition + 470,
      y: 122,
      size: 15,
      color: rgb(1, 1, 1),
    });

    const outputPdfPath = path.join(
      __dirname,
      `../${ev.email.split("@")[0]}-ticket.pdf`
    );
    if (!fs.existsSync(path.dirname(outputPdfPath))) {
      fs.mkdirSync(path.dirname(outputPdfPath), { recursive: true });
    }

    const pdfBytesNew = await pdfDoc.save();
    fs.writeFileSync(outputPdfPath, pdfBytesNew);
    console.log(
      `PDF for ${ev.email.split("@")[0]} edited and saved successfully.`
    );
    files.push(outputPdfPath);
    return files;
  }
}

async function editPdf(data) {
  let files = [];
  for (const event of data) {
    ev = event[0];
    console.log("Event data:");
    console.log(ev);
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
    firstPage.drawText(ev.eventName, {
      x: 175,
      y: yPosition,
      size: 12,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(ev.eventDate, {
      x: 175,
      y: yPosition - 20,
      size: 12,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(ev.Venue, {
      x: 175,
      y: yPosition - 40,
      size: 12,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(
      `This is to certify that the below mentioned student(s) is/are bona fide student(s) of ${ev.collegeName}.\n I confirm that the provided College ID(s) are valid and belong to the listed student(s).`,
      { x: 70, y: yPosition - 70, size: 10, color: rgb(0, 0, 0) }
    );

    // Load the QR code image
    const imageBytes = fs.readFileSync(qrCodePath);
    const image = await pdfDoc.embedPng(imageBytes);
    const imageDims = image.scale(0.45);

    // Draw the QR code image on the PDF
    firstPage.drawImage(image, {
      x: 440,
      y: 587,
      width: imageDims.width,
      height: imageDims.height,
    });

    let participantYPosition = yPosition - 170;
    for (const participant of ev.participants) {
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
      `../${ev.email.split("@")[0]}-gate pass.pdf`
    );
    if (!fs.existsSync(path.dirname(outputPdfPath))) {
      fs.mkdirSync(path.dirname(outputPdfPath), { recursive: true });
    }

    const pdfBytesNew = await pdfDoc.save();
    fs.writeFileSync(outputPdfPath, pdfBytesNew);
    console.log(
      `PDF for ${ev.email.split("@")[0]} edited and saved successfully.`
    );
    files.push(outputPdfPath);
    // const mailstatus = await sendMail(ev.email, outputPdfPath);
    // if (mailstatus) {
    //   fs.unlink(qrCodePath, (err) => {
    //     if (err) {
    //       console.error("Error deleting file:", err);
    //     }
    //   });
    //   fs.unlink(outputPdfPath, (err) => {
    //     if (err) {
    //       console.error("Error deleting file:", err);
    //     }
    //   });
    // }
  }
  return files;
}

exports.getData = async (data) => {
  try {
    const pdfPaths = await editPdf(data); // Assuming editPdf generates and returns the paths
    // const ticketPaths = await editticket(data); // Assuming editPdf generates and returns the paths
    return pdfPaths; // Return the generated PDF paths
  } catch (error) {
    console.error("Error generating PDFs:", error);
    throw new Error("Error generating PDFs");
  }
};

// exports.getData = async (req, res) => {
//   const { data } = req.body;
//   try {
//     await editticket(data);
//     res.status(200).json({ message: "Documents processed successfully" });
//   } catch (error) {
//     console.error("Error processing documents:", error);
//     res.status(500).json({ message: "Error processing request", error });
//   }
// };
