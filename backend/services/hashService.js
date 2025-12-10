/**
 * MarkSure Academic Ledger
 * Author: John Mark Fornah
 * Description: Generates SHA256 hashes for certificate integrity and unique certificate codes
 */

import crypto from 'crypto';

/**
 * Generate SHA256 hash from input string
 * @param {string} input - String to hash
 * @returns {string} - Hexadecimal hash
 */
export const generateHash = (input) => {
  return crypto.createHash('sha256').update(input).digest('hex');
};

/**
 * Generate unique certificate code
 * Format: MSAL-XXXXXXXX (8 character hash)
 * @param {string} studentName - Student name
 * @param {string} institution - Institution name
 * @param {string} program - Program name
 * @param {string} issueDate - Issue date
 * @returns {string} - Unique certificate code
 */
export const generateCertificateCode = (studentName, institution, program, issueDate) => {
  const combined = `${studentName}-${institution}-${program}-${issueDate}-${Date.now()}`;
  const hash = generateHash(combined);
  const shortHash = hash.substring(0, 8).toUpperCase();
  return `MSAL-${shortHash}`;
};

/**
 * Generate block hash for ledger entry
 * Combines previous hash with current record data
 * @param {object} record - Current record data
 * @param {string} previousHash - Previous block hash (optional)
 * @returns {string} - Block hash
 */
export const generateBlockHash = (record, previousHash = '') => {
  const recordString = JSON.stringify(record);
  const combined = previousHash + recordString;
  return generateHash(combined);
};

