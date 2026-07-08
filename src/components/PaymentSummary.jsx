import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Smartphone } from 'lucide-react';

export function PaymentSummary({ category, amount, onBack, onPay, loading, error }) {
  const [upiId, setUpiId] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onPay();
  };

  return (
    <div className="bg-pure-white rounded-2xl border border-platinum-silver shadow-xs overflow-hidden w-full max-w-xl mx-auto font-sans">
      {/* Razorpay header band */}
      <div className="flex items-center justify-between bg-[#2d2d2d] px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded border border-white/20 bg-[#3395FF] flex items-center justify-center">
            <span className="text-white font-black text-xs">R</span>
          </div>
          <span className="text-white font-bold text-sm tracking-tight">Razorpay Secure Checkout</span>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider mb-0.5">Payment Amount</p>
          <p className="text-white font-black text-xl font-mono">₹{amount}</p>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        <div className="bg-ice-gray p-4 rounded-xl border border-platinum-silver">
          <span className="block text-[10px] font-extrabold uppercase text-slate-gray mb-1">Paying For</span>
          <span className="text-sm font-bold text-charcoal">{category?.name}</span>
        </div>

        {(error || localError) && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl p-4">
            {error || localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border border-platinum-silver rounded-2xl p-8 bg-arctic-white flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3395FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            </div>
            <div className="text-center">
              <h4 className="text-sm font-bold text-charcoal">Secure Online Payment</h4>
              <p className="text-xs text-slate-gray mt-1">You will be redirected to Razorpay to complete your payment securely.</p>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-platinum-silver/60">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-1/3 px-4 py-3.5 text-xs font-bold text-charcoal hover:bg-mist-silver border border-platinum-silver rounded-xl transition-colors cursor-pointer flex justify-center items-center"
              disabled={loading}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-2/3 px-6 py-3.5 bg-[#3395FF] hover:bg-[#1a7ee0] disabled:opacity-70 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center space-x-2.5 cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <span>Pay with Razorpay</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
