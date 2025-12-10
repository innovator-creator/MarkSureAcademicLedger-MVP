/**
 * MarkSure Academic Ledger
 * Author: John Mark Fornah
 * Description: Handles HTTP requests for certificate operations
 */

import { issueCertificate } from '../services/certificateService.js';
import { findRecordByCode, getAllRecords } from '../services/ledgerService.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * Issue a new certificate
 * POST /api/issue
 */
export const issueCertificateController = async (req, res) => {
  try {
    const { studentName, institution, program, issueDate, certificateBase64 } = req.body;
    
    // Validate input
    if (!studentName || !institution || !program || !issueDate) {
      return sendError(res, 'Missing required fields: studentName, institution, program, issueDate', 400);
    }
    
    // Issue certificate
    const result = await issueCertificate({
      studentName,
      institution,
      program,
      issueDate,
      certificateBase64: certificateBase64 || null
    });
    
    return sendSuccess(res, {
      record: result.record,
      pdfBase64: result.pdfBase64,
      qrDataUrl: result.qrDataUrl
    }, 'Certificate issued successfully', 201);
    
  } catch (error) {
    console.error('Error issuing certificate:', error);
    return sendError(res, error.message || 'Failed to issue certificate', 500);
  }
};

/**
 * Verify a certificate by code
 * GET /api/verify/:code
 */
export const verifyCertificateController = async (req, res) => {
  try {
    const { code } = req.params;
    
    if (!code) {
      return sendError(res, 'Certificate code is required', 400);
    }
    
    // Find record in ledger
    const record = await findRecordByCode(code);
    
    if (!record) {
      return sendSuccess(res, {
        verified: false,
        message: 'Certificate not found'
      }, 'Verification complete', 200);
    }
    
    return sendSuccess(res, {
      verified: true,
      record: {
        certificateCode: record.certificateCode,
        studentName: record.studentName,
        institution: record.institution,
        program: record.program,
        issueDate: record.issueDate,
        timestamp: record.timestamp,
        blockHash: record.blockHash
      }
    }, 'Certificate verified successfully', 200);
    
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return sendError(res, error.message || 'Failed to verify certificate', 500);
  }
};

/**
 * Get all ledger records
 * GET /api/ledger
 */
export const getLedgerController = async (req, res) => {
  try {
    const records = await getAllRecords();
    
    return sendSuccess(res, {
      records,
      totalRecords: records.length
    }, 'Ledger retrieved successfully', 200);
    
  } catch (error) {
    console.error('Error retrieving ledger:', error);
    return sendError(res, error.message || 'Failed to retrieve ledger', 500);
  }
};

