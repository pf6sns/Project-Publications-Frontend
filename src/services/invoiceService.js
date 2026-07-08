/**
 * services/invoiceService.js
 *
 * Invoice Service.
 * All invoice generation and download operations go through here.
 *
 * Current: mock invoice generation (generates invoice data in-memory)
 * Future:  POST /api/invoices → backend generates PDF → stores in S3 → returns URL
 *          Only this file changes when backend is ready.
 */

/**
 * Generates an invoice for a completed payment.
 * Future: POST /api/invoices → { invoiceNumber, orderId, s3Url, ... }
 *
 * @param {object} paymentDetails - { transactionId, amount, date }
 * @param {object} publicationDetails - { category, title }
 * @param {object} facultyDetails - { name, department }
 * @returns {object} Invoice data
 */
export const generateInvoice = async (paymentDetails, publicationDetails, facultyDetails) => {
  // Simulate backend generating an Invoice PDF and uploading it to AWS S3
  await new Promise(resolve => setTimeout(resolve, 1000));

  const invoiceNumber = 'INV-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);
  const orderId = 'ORD-' + Math.floor(1000000 + Math.random() * 9000000);
  const s3UrlMock = `https://s3.amazonaws.com/sns-rpms-bucket/invoices/${invoiceNumber}.pdf`;

  return {
    invoiceNumber,
    orderId,
    receiptNumber: paymentDetails.transactionId,
    category: publicationDetails.category,
    title: publicationDetails.title,
    facultyName: facultyDetails.name,
    department: facultyDetails.department,
    amount: paymentDetails.amount,
    paymentDate: new Date().toISOString(),
    paymentStatus: 'Paid',
    s3Url: s3UrlMock,
  };
};

/**
 * Returns the download URL for an existing invoice.
 * Future: GET /api/invoices/:invoiceId/download-url → AWS S3 signed URL
 *
 * @param {string} invoiceId
 * @returns {string} Download URL
 */
export const fetchInvoiceUrl = async (invoiceId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return `https://s3.amazonaws.com/sns-rpms-bucket/invoices/${invoiceId}.pdf`;
};

/**
 * Downloads an invoice PDF.
 * Future: Fetches signed URL from backend and triggers browser download.
 *
 * @param {string} invoiceId
 * @param {string} invoiceNumber - Used as the download filename
 */
export const downloadInvoice = async (invoiceId, invoiceNumber) => {
  console.info(`[invoiceService] Triggering print for invoice PDF download`);
  // Use browser's print-to-pdf functionality to generate the PDF natively
  window.print();
};
