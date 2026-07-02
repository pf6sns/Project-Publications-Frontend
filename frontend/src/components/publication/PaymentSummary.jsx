import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Smartphone } from 'lucide-react';

export function PaymentSummary({ category, amount, onBack, onPay, loading, error }) {
  const [upiId, setUpiId] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');
    if (!upiId.trim() || !upiId.includes('@')) {
      setLocalError('Please enter a valid UPI ID (e.g. name@upi)');
      return;
    }
    onPay(upiId);
  };

  return (
    <div className="bg-pure-white rounded-2xl border border-platinum-silver shadow-xs overflow-hidden w-full max-w-xl mx-auto font-sans">
      {/* Razorpay header band */}
      <div className="flex items-center justify-between bg-[#2d2d2d] px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded border border-white/20 bg-[#3395FF] flex items-center justify-center">
            <span className="text-white font-black text-xs">R</span>
          </div>
          <span className="text-white font-bold text-sm tracking-tight">Razorpay Mock Gateway</span>
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
          {/* Mock QR Area */}
          <div className="border border-platinum-silver rounded-2xl p-6 bg-arctic-white flex flex-col items-center">
            <div className="w-48 h-48 bg-pure-white border-2 border-charcoal rounded-xl flex items-center justify-center relative p-1 shadow-sm">
              <div className="text-slate-gray text-xs font-bold text-center">
                MOCK QR CODE<br/>
                <span className="text-[10px] font-medium text-platinum-silver/80 mt-2 block">Not real</span>
              </div>
            </div>
            <p className="mt-4 text-xs font-bold text-slate-gray text-center uppercase tracking-wider">
              Scan using any UPI App
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-platinum-silver" />
            <span className="text-[10px] font-black text-slate-gray uppercase tracking-widest">or enter UPI ID</span>
            <div className="flex-1 h-px bg-platinum-silver" />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-charcoal mb-2 tracking-wide">
              Your UPI ID
            </label>
            <div className="relative">
              <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-gray" />
              <input
                type="text"
                placeholder="e.g. username@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full text-sm font-mono border border-platinum-silver rounded-xl pl-10 pr-4 py-3.5 bg-pure-white text-charcoal focus:ring-2 focus:ring-[#3395FF]/40 focus:border-[#3395FF] focus:outline-none transition-all shadow-xs"
                disabled={loading}
              />
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
                <span>Proceed to Pay ₹{amount}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
