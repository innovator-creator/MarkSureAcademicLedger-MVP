/**
 * MarkSure Academic Ledger
 * Author: John Mark Fornah
 * Description: Manages tamper-proof certificate ledger with blockchain-like integrity
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBlockHash } from './hashService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LEDGER_FILE = path.join(__dirname, '..', 'ledger.json');

/**
 * Initialize ledger file if it doesn't exist
 */
export const initializeLedger = async () => {
  try {
    await fs.access(LEDGER_FILE);
  } catch (error) {
    // File doesn't exist, create it with empty structure
    const initialLedger = {
      records: [],
      lastUpdated: new Date().toISOString(),
      totalRecords: 0
    };
    await fs.writeFile(LEDGER_FILE, JSON.stringify(initialLedger, null, 2));
    console.log('✅ Ledger file initialized');
  }
};

/**
 * Read ledger from file
 * @returns {Promise<object>} - Ledger data
 */
export const readLedger = async () => {
  try {
    const data = await fs.readFile(LEDGER_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Failed to read ledger: ${error.message}`);
  }
};

/**
 * Write record to ledger
 * @param {object} record - Certificate record to add
 * @returns {Promise<object>} - Updated ledger
 */
export const writeToLedger = async (record) => {
  try {
    const ledger = await readLedger();
    
    // Get previous hash for blockchain-like integrity
    const previousHash = ledger.records.length > 0 
      ? ledger.records[ledger.records.length - 1].blockHash 
      : '0';
    
    // Generate block hash for this record
    const blockHash = generateBlockHash(record, previousHash);
    
    // Add block hash and timestamp to record
    const ledgerRecord = {
      ...record,
      blockHash,
      previousHash,
      timestamp: new Date().toISOString(),
      index: ledger.totalRecords
    };
    
    // Add to ledger
    ledger.records.push(ledgerRecord);
    ledger.totalRecords = ledger.records.length;
    ledger.lastUpdated = new Date().toISOString();
    
    // Write back to file
    await fs.writeFile(LEDGER_FILE, JSON.stringify(ledger, null, 2));
    
    return ledgerRecord;
  } catch (error) {
    throw new Error(`Failed to write to ledger: ${error.message}`);
  }
};

/**
 * Find record by certificate code
 * @param {string} code - Certificate code
 * @returns {Promise<object|null>} - Found record or null
 */
export const findRecordByCode = async (code) => {
  try {
    const ledger = await readLedger();
    const record = ledger.records.find(r => r.certificateCode === code);
    return record || null;
  } catch (error) {
    throw new Error(`Failed to find record: ${error.message}`);
  }
};

/**
 * Get all records from ledger
 * @returns {Promise<Array>} - All records
 */
export const getAllRecords = async () => {
  try {
    const ledger = await readLedger();
    return ledger.records;
  } catch (error) {
    throw new Error(`Failed to get records: ${error.message}`);
  }
};

/**
 * Verify ledger integrity
 * Checks if all block hashes are valid
 * @returns {Promise<object>} - Verification result
 */
export const verifyLedgerIntegrity = async () => {
  try {
    const ledger = await readLedger();
    let previousHash = '0';
    let isValid = true;
    const errors = [];
    
    for (let i = 0; i < ledger.records.length; i++) {
      const record = ledger.records[i];
      
      // Verify previous hash matches
      if (record.previousHash !== previousHash) {
        isValid = false;
        errors.push(`Record ${i}: Previous hash mismatch`);
      }
      
      // Verify block hash
      const expectedHash = generateBlockHash(record, previousHash);
      if (record.blockHash !== expectedHash) {
        isValid = false;
        errors.push(`Record ${i}: Block hash mismatch`);
      }
      
      previousHash = record.blockHash;
    }
    
    return {
      isValid,
      totalRecords: ledger.records.length,
      errors
    };
  } catch (error) {
    throw new Error(`Failed to verify ledger: ${error.message}`);
  }
};

