/**
 * MarkSure Academic Ledger
 * Author: John Mark Fornah
 * Description: Generates QR codes for certificate verification
 */

import QRCode from 'qrcode';

/**
 * Generate QR code as Data URL
 * @param {string} data - Data to encode in QR code
 * @returns {Promise<string>} - QR code as Data URL
 */
export const generateQRCode = async (data) => {
  try {
    const qrDataUrl = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 300
    });
    return qrDataUrl;
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error.message}`);
  }
};

/**
 * Generate QR code buffer
 * @param {string} data - Data to encode
 * @returns {Promise<Buffer>} - QR code as buffer
 */
export const generateQRCodeBuffer = async (data) => {
  try {
    const qrBuffer = await QRCode.toBuffer(data, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 300
    });
    return qrBuffer;
  } catch (error) {
    throw new Error(`Failed to generate QR code buffer: ${error.message}`);
  }
};

