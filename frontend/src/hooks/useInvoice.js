import { useState } from 'react';
import * as invoiceService from '../services/invoiceService';

export function useInvoice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [invoice, setInvoice] = useState(null);

  const generateInvoice = async (paymentDetails, publicationDetails, facultyDetails) => {
    setLoading(true);
    setError(null);
    try {
      const result = await invoiceService.generateInvoice(paymentDetails, publicationDetails, facultyDetails);
      setInvoice(result);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to generate invoice');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (invoiceId) => {
    try {
      const url = await invoiceService.fetchInvoiceUrl(invoiceId);
      // Simulate download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoiceId}.pdf`;
      link.click();
    } catch (err) {
      setError(err.message || 'Failed to download invoice');
    }
  };

  const resetInvoice = () => {
    setInvoice(null);
    setError(null);
    setLoading(false);
  };

  return {
    loading,
    error,
    invoice,
    generateInvoice,
    downloadInvoice,
    resetInvoice
  };
}
