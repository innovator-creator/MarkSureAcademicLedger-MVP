/**
 * MarkSure Academic Ledger
 * Author: John Mark Fornah
 * Description: Generates PDF certificates with embedded QR codes
 */

import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

/**
 * Generate PDF certificate
 * @param {object} certificateData - Certificate data
 * @param {string} qrDataUrl - QR code as Data URL
 * @returns {Promise<string>} - PDF as base64 string
 */
export const generatePDF = async (certificateData, qrDataUrl) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        margin: 50,
        info: {
          Title: 'Academic Certificate',
          Author: 'John Mark Fornah - MarkSure Academic Ledger',
          Subject: 'Certificate of Achievement'
        }
      });

      const chunks = [];
      
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        const pdfBase64 = pdfBuffer.toString('base64');
        resolve(pdfBase64);
      });
      doc.on('error', (error) => reject(error));

      // Header
      doc.fontSize(24)
         .fillColor('#1a1a1a')
         .text('CERTIFICATE OF ACHIEVEMENT', { align: 'center' })
         .moveDown(2);

      // Decorative line
      doc.strokeColor('#333333')
         .lineWidth(2)
         .moveTo(50, doc.y)
         .lineTo(562, doc.y)
         .stroke()
         .moveDown(2);

      // Certificate body
      doc.fontSize(16)
         .fillColor('#2c2c2c')
         .text('This is to certify that', { align: 'center' })
         .moveDown(1);

      doc.fontSize(28)
         .fillColor('#000000')
         .font('Helvetica-Bold')
         .text(certificateData.studentName, { align: 'center' })
         .moveDown(1);

      doc.fontSize(16)
         .font('Helvetica')
         .fillColor('#2c2c2c')
         .text('has successfully completed the program', { align: 'center' })
         .moveDown(1);

      doc.fontSize(20)
         .fillColor('#000000')
         .font('Helvetica-Bold')
         .text(certificateData.program, { align: 'center' })
         .moveDown(1);

      doc.fontSize(16)
         .font('Helvetica')
         .fillColor('#2c2c2c')
         .text('at', { align: 'center' })
         .moveDown(1);

      doc.fontSize(18)
         .fillColor('#000000')
         .font('Helvetica-Bold')
         .text(certificateData.institution, { align: 'center' })
         .moveDown(2);

      // Issue date
      doc.fontSize(14)
         .font('Helvetica')
         .fillColor('#666666')
         .text(`Issued on: ${certificateData.issueDate}`, { align: 'center' })
         .moveDown(2);

      // Certificate code
      doc.fontSize(12)
         .fillColor('#333333')
         .font('Helvetica-Bold')
         .text(`Certificate Code: ${certificateData.certificateCode}`, { align: 'center' })
         .moveDown(3);

      // QR Code
      if (qrDataUrl) {
        try {
          // Convert Data URL to buffer
          const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
          const qrBuffer = Buffer.from(base64Data, 'base64');
          
          // Position QR code at bottom center
          const qrSize = 120;
          const pageWidth = doc.page.width;
          const qrX = (pageWidth - qrSize) / 2;
          const qrY = doc.page.height - 150;
          
          doc.image(qrBuffer, qrX, qrY, {
            fit: [qrSize, qrSize],
            align: 'center'
          });

          // Verification text below QR
          doc.fontSize(10)
             .fillColor('#666666')
             .font('Helvetica')
             .text('Scan QR code to verify authenticity', qrX, qrY + qrSize + 10, {
               width: qrSize,
               align: 'center'
             });
        } catch (qrError) {
          console.error('Error embedding QR code in PDF:', qrError);
          // Continue without QR code if embedding fails
        }
      }

      // Footer
      doc.fontSize(10)
         .fillColor('#999999')
         .text('MarkSure Academic Ledger - Built by John Mark Fornah', 50, doc.page.height - 50, {
           align: 'center',
           width: 512
         });

      doc.end();
    } catch (error) {
      reject(new Error(`Failed to generate PDF: ${error.message}`));
    }
  });
};

