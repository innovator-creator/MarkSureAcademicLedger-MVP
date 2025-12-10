/**
 * MarkSure Academic Ledger
 * Author: John Mark Fornah
 * Description: Main business logic for certificate operations including issuance and verification
 */

import { generateCertificateCode } from './hashService.js';
import { generateQRCode } from './qrService.js';
import { generatePDF } from './pdfService.js';
import { writeToLedger } from './ledgerService.js';

/**
 * Issue a new certificate
 * @param {object} certificateData - Certificate data
 * @returns {Promise<object>} - Complete certificate with PDF and QR code
 */
export const issueCertificate = async (certificateData) => {
  try {
    const { studentName, institution, program, issueDate, certificateBase64 } = certificateData;
    
    // Validate required fields
    if (!studentName || !institution || !program || !issueDate) {
      throw new Error('Missing required fields: studentName, institution, program, issueDate');
    }
    
    // Generate unique certificate code
    const certificateCode = generateCertificateCode(studentName, institution, program, issueDate);
    
    // Create record object
    const record = {
      certificateCode,
      studentName,
      institution,
      program,
      issueDate,
      certificateBase64: certificateBase64 || null
    };
    
    // Generate QR code with verification URL
    const verificationUrl = `http://localhost:5000/api/verify/${certificateCode}`;
    const qrDataUrl = await generateQRCode(verificationUrl);
    
    // Generate PDF certificate
    const pdfBase64 = await generatePDF({
      ...record,
      certificateCode
    }, qrDataUrl);
    
    // Save to ledger
    const ledgerRecord = await writeToLedger(record);
    
    return {
      record: ledgerRecord,
      pdfBase64,
      qrDataUrl
    };
  } catch (error) {
    throw new Error(`Failed to issue certificate: ${error.message}`);
  }
};

