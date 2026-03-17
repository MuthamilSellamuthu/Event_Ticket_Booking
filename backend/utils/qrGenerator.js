const QRCode = require('qrcode');

/**
 * Generate a QR code as a base64 data URL
 * @param {string} data - The data to encode in QR
 * @returns {Promise<string>} - Base64 encoded QR image
 */
const generateQRCode = async (data) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 2,
      color: {
        dark: '#1a1a2e',
        light: '#ffffff',
      },
      width: 300,
    });
    return qrCodeDataURL;
  } catch (error) {
    throw new Error('QR code generation failed: ' + error.message);
  }
};

module.exports = { generateQRCode };
