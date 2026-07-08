import React from 'react';
import { CheckCircle, RefreshCcw } from 'lucide-react';
import { InvoiceViewer } from './InvoiceViewer';
import { InvoiceDownloadButton } from './InvoiceDownloadButton';

export function InvoiceReceipt({ invoice, onDownload, onReset }) {
  if (!invoice) return null;

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-10 w-full">
      {/* Success Banner */}
      <div className="flex flex-col items-center justify-center text-center space-y-3">
        <div className="h-14 w-14 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center shadow-xs">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-black text-charcoal tracking-wide">Payment Successful</h2>
          <p className="text-sm font-medium text-slate-gray mt-1">Your manuscript has been submitted for review</p>
        </div>
      </div>

      {/* Invoice Viewer */}
      <InvoiceViewer invoice={invoice} />

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-2xl mx-auto pt-4 border-t border-platinum-silver/60">
        <button
          onClick={onReset}
          className="px-6 py-3 text-xs font-bold text-white bg-charcoal hover:bg-steel-gray border border-transparent rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2.5 cursor-pointer w-full sm:w-auto"
        >
          <RefreshCcw className="h-4 w-4" />
          <span>Upload Another Manuscript</span>
        </button>
        <InvoiceDownloadButton 
          onDownload={onDownload} 
          invoiceId={invoice.invoiceNumber} 
        />
      </div>
    </div>
  );
}
