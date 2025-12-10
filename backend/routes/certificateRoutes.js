/**
 * MarkSure Academic Ledger
 * Author: John Mark Fornah
 * Description: All certificate-related API endpoints and route definitions
 */

import express from 'express';
import {
  issueCertificateController,
  verifyCertificateController,
  getLedgerController
} from '../controllers/certificateController.js';

const router = express.Router();

// Issue a new certificate
router.post('/issue', issueCertificateController);

// Verify a certificate by code
router.get('/verify/:code', verifyCertificateController);

// Get all ledger records
router.get('/ledger', getLedgerController);

export default router;

