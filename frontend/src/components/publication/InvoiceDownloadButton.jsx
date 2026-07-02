import React from 'react';
import { Download } from 'lucide-react';

export function InvoiceDownloadButton({ onDownload, invoiceId, disabled }) {
  return (
    <button
      onClick={() => onDownload(invoiceId)}
      disabled={disabled}
      className="px-6 py-3 text-xs font-bold text-charcoal bg-pure-white border border-platinum-silver hover:bg-mist-silver hover:border-brushed-silver rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2.5 cursor-pointer w-full sm:w-auto"
    >
      <Download className="h-4 w-4" />
      <span>Download PDF Invoice</span>
    </button>
  );
}
