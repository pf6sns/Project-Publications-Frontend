import React from 'react';
import { Receipt } from 'lucide-react';

export function InvoiceViewer({ invoice }) {
  if (!invoice) return null;

  return (
    <div className="border border-platinum-silver rounded-2xl overflow-hidden bg-pure-white shadow-xs max-w-2xl mx-auto w-full font-sans print-area">
      <div className="bg-ice-gray px-6 py-4 flex items-center justify-between border-b border-platinum-silver">
        <div className="flex items-center gap-2.5">
          <Receipt className="h-5 w-5 text-steel-gray" />
          <span className="text-sm font-black uppercase tracking-widest text-charcoal">Invoice / Receipt</span>
        </div>
        <span className="text-xs font-mono font-bold text-slate-gray">{invoice.invoiceNumber}</span>
      </div>

      <div className="p-6 md:p-8 space-y-4 text-sm">
        <div className="flex flex-col items-center justify-center text-center pb-6 border-b border-platinum-silver">
          <p className="text-[10px] font-extrabold uppercase text-slate-gray mb-1 tracking-widest">Billed To</p>
          <p className="font-black text-charcoal text-lg tracking-tight">{invoice.facultyName}</p>
          <p className="text-slate-gray text-xs font-medium mt-1">{invoice.department}</p>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex justify-between py-1.5 border-b border-platinum-silver/40">
            <span className="text-slate-gray font-bold text-xs uppercase tracking-wider">Date & Time</span>
            <span className="font-bold text-charcoal font-mono text-xs">
              {new Date(invoice.paymentDate).toLocaleString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
              })}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-platinum-silver/40">
            <span className="text-slate-gray font-bold text-xs uppercase tracking-wider">Order ID</span>
            <span className="font-bold text-charcoal font-mono text-xs">{invoice.orderId || 'ORD-N/A'}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-platinum-silver/40">
            <span className="text-slate-gray font-bold text-xs uppercase tracking-wider">Transaction ID (Receipt)</span>
            <span className="font-bold text-charcoal font-mono text-xs">{invoice.receiptNumber}</span>
          </div>
        </div>

        <div className="flex justify-between items-center bg-frost-gray border border-platinum-silver rounded-xl px-5 py-4 mt-6">
          <span className="font-black text-charcoal uppercase text-xs tracking-widest">Total Paid</span>
          <span className="text-2xl font-black text-charcoal font-mono tracking-tight">₹{invoice.amount}</span>
        </div>
      </div>
    </div>
  );
}
