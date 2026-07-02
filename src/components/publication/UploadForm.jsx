/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, FileText, ArrowRight, ArrowLeft, RefreshCw, Receipt, Smartphone } from 'lucide-react';
import upiLogo from '../../assets/images/upi_banner.png';

const ALL_DEPARTMENTS = [
  'Computer Science and Engineering',
  'Electronics and Communication Engineering',
  'Electrical and Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Information Technology',
  'Artificial Intelligence and Data Science',
  'Biotechnology',
  'Chemical Engineering',
  'MBA',
  'MCA',
  'Office of Dean (Research)',
];

export function UploadForm({ currentUser, publications, onSuccess }) {
  const [step, setStep] = useState(1);

  // Step 1 state
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState(currentUser.department || ALL_DEPARTMENTS[0]);
  const [file, setFile] = useState(null);
  const [rawFile, setRawFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  // Payment state
  const [upiId, setUpiId] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Invoice state (filled after payment)
  const [invoiceData, setInvoiceData] = useState(null);

  const titleCharLimit = 200;

  // ── Step 1 Validation ──────────────────────────────────────────
  const handleNextStep1 = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim() || title.length < 15) {
      setErrorMsg('Publication Title is required and must be at least 15 characters.');
      return;
    }
    if (title.length > titleCharLimit) {
      setErrorMsg(`Publication Title exceeds the maximum limit of ${titleCharLimit} characters.`);
      return;
    }

    const isDuplicate = publications.some(
      p => p.title.trim().toLowerCase() === title.trim().toLowerCase() && 
           p.status !== 'Closed – Maximum Revision Limit Reached'
    );
    if (isDuplicate) {
      setErrorMsg('This manuscript title matches an active publication in review or archives. Duplicate submission halted.');
      return;
    }

    if (!file) {
      setErrorMsg('Please select or drop a valid PDF or DOCX manuscript file.');
      return;
    }

    setStep(2);
  };

  // ── File Handling ──────────────────────────────────────────────
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (selectedFile) => {
    setErrorMsg('');
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (extension !== 'pdf' && extension !== 'docx') {
      setErrorMsg('Unsupported file format. Only PDF or DOCX allowed.');
      return;
    }
    if (selectedFile.size > 100 * 1024 * 1024) {
      setErrorMsg('File exceeds the 100 MB upload limit.');
      return;
    }
    const readableSize = (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB';
    setFile({ name: selectedFile.name, size: readableSize });
    setRawFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // ── Step 2: Payment ────────────────────────────────────────────
  const executePayment = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!upiId.trim() || !upiId.includes('@')) {
      setErrorMsg('Please enter a valid UPI ID (e.g. name@upi)');
      return;
    }

    setPaymentLoading(true);
    setTimeout(() => {
      setPaymentLoading(false);
      const generatedTxn = 'TXN-' + Math.floor(1000000 + Math.random() * 9000000);
      const dateStr = new Date().toISOString();
      setInvoiceData({ txnId: generatedTxn, date: dateStr });
      setStep(3);

      onSuccess({
        title,
        category: 'International Journal (Scopus Indexed)',
        department,
        abstract: '',
        fileName: file ? file.name : 'manuscript_draft.pdf',
        fileSize: file ? file.size : '2.1 MB',
        transactionId: generatedTxn,
        fileObject: rawFile ?? undefined,
      });
    }, 1500);
  };

  // ── Reset ──────────────────────────────────────────────────────
  const resetForm = () => {
    setTitle('');
    setDepartment(currentUser.department || ALL_DEPARTMENTS[0]);
    setFile(null);
    setRawFile(null);
    setUpiId('');
    setInvoiceData(null);
    setErrorMsg('');
    setStep(1);
  };

  return (
    <div className="bg-pure-white rounded-xl border border-platinum-silver shadow-sm overflow-hidden w-full">

      {/* ── Step Track Header ── */}
      <div className="bg-ice-gray border-b border-platinum-silver px-4 py-3 md:px-6 md:py-4 flex justify-between items-center text-[10px] md:text-xs">
        {[
          { label: 'Upload', idx: 1 },
          { label: 'Payment', idx: 2 },
          { label: 'Invoice', idx: 3 },
        ].map((s) => (
           <div key={s.idx} className="flex items-center space-x-1.5 md:space-x-2">
            <span
              className={`h-5 w-5 md:h-6 md:w-6 font-semibold flex items-center justify-center rounded-full text-[9px] md:text-[10px] ${
                step === s.idx
                  ? 'bg-brushed-silver text-charcoal shadow-xs font-bold scale-110'
                  : step > s.idx
                  ? 'bg-frost-gray text-charcoal border border-platinum-silver'
                  : 'bg-ice-gray text-slate-gray'
              }`}
            >
              {s.idx}
            </span>
            <span
              className={`font-semibold ${
                step === s.idx ? 'inline text-charcoal' : 'hidden sm:inline text-slate-gray'
              }`}
            >
              {s.label}
            </span>
            {s.idx < 3 && <span className="text-platinum-silver text-[9px] md:text-xs ml-1 md:ml-2">/</span>}
          </div>
        ))}
      </div>

      <div className="p-4 sm:p-5 md:p-6">
        {errorMsg && (
          <div className="mb-4 bg-red-50 border border-red-200/50 rounded-lg p-3 text-xs text-red-700 flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            STEP 1 — UPLOAD
        ══════════════════════════════════════════════ */}
        {step === 1 && (
          <form onSubmit={handleNextStep1} className="space-y-5">

            {/* Publication Title */}
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal mb-1">
                Publication Title <span className="text-red-500">*</span>
              </label>
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter complete research publication title..."
                className="w-full text-sm border border-platinum-silver rounded-lg p-2.5 focus:ring-2 focus:ring-steel-gray focus:outline-none min-h-[60px] bg-pure-white text-charcoal"
                maxLength={titleCharLimit}
              />
              <div className="flex justify-between text-[10px] text-slate-gray mt-1">
                <span>Minimum 15 characters</span>
                <span className={title.length > titleCharLimit ? 'text-red-600' : ''}>
                  {title.length} / {titleCharLimit} chars
                </span>
              </div>
            </div>

            {/* Department Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-sm border border-platinum-silver rounded-lg p-2.5 focus:ring-2 focus:ring-steel-gray focus:outline-none bg-pure-white text-charcoal"
              >
                {ALL_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

              {/* File Upload — entire zone is clickable */}
              <div>
              <label className="block text-xs font-bold uppercase text-charcoal mb-2">
                Manuscript File <span className="text-red-500">*</span>
              </label>
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-7 text-center transition-all cursor-pointer select-none ${
                  dragActive ? 'border-brushed-silver bg-ice-gray' : 'border-platinum-silver bg-arctic-white hover:bg-ice-gray hover:border-brushed-silver'
                }`}
              >
                <Upload className="h-9 w-9 text-steel-gray mx-auto mb-2 pointer-events-none" />
                <p className="text-sm font-bold text-charcoal mb-1 pointer-events-none">Click or Drag &amp; Drop to upload</p>
                <p className="text-xs text-slate-gray pointer-events-none">Only PDF or DOCX allowed (Max 100 MB)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {file && (
                <div className="mt-3 bg-ice-gray border border-platinum-silver rounded-lg p-3.5 flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="p-2 bg-frost-gray text-charcoal border border-platinum-silver rounded">
                      <FileText className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="font-bold text-charcoal truncate max-w-[240px]">{file.name}</p>
                      <p className="text-slate-gray font-medium">{file.size}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-bold text-charcoal bg-frost-gray hover:bg-mist-silver border border-platinum-silver rounded-lg shadow-xs transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}

        {/* ══════════════════════════════════════════════
            STEP 2 — PAYMENT
        ══════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="space-y-5">

            {/* Razorpay header band */}
            <div className="flex items-center justify-between bg-[#2d2d2d] rounded-xl px-5 py-3">
              <div className="flex items-center gap-2.5">
                {/* Razorpay logo text */}
                <div className="flex items-center gap-1.5">
                  <div className="h-6 w-6 rounded bg-[#3395FF] flex items-center justify-center">
                    <span className="text-white font-black text-[10px]">R</span>
                  </div>
                  <span className="text-white font-bold text-sm tracking-tight">Razorpay</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-zinc-400 font-medium">Processing Fee</p>
                <p className="text-white font-black text-lg font-mono">₹150</p>
              </div>
            </div>


            {/* UPI section */}
            <form onSubmit={executePayment} className="space-y-4">

              {/* QR code box */}
              <div className="border border-platinum-silver rounded-xl p-5 bg-arctic-white flex flex-col items-center">

                {/* Simulated QR — centered */}
                <div className="w-48 h-48 bg-pure-white border-2 border-charcoal rounded-lg flex items-center justify-center relative overflow-hidden p-1">
                  {/* Grid pattern to simulate QR */}
                  <div className="w-full h-full relative">
                    {/* Corner finders */}
                    <div className="absolute top-0 left-0 w-10 h-10 border-[3px] border-charcoal rounded-sm" />
                    <div className="absolute top-0 right-0 w-10 h-10 border-[3px] border-charcoal rounded-sm" />
                    <div className="absolute bottom-0 left-0 w-10 h-10 border-[3px] border-charcoal rounded-sm" />
                    {/* Inner corner dots */}
                    <div className="absolute top-3 left-3 w-4 h-4 bg-charcoal rounded-sm" />
                    <div className="absolute top-3 right-3 w-4 h-4 bg-charcoal rounded-sm" />
                    <div className="absolute bottom-3 left-3 w-4 h-4 bg-charcoal rounded-sm" />
                    {/* Center logo area */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-pure-white p-1 rounded">
                        <div className="h-8 w-8 rounded bg-[#3395FF] flex items-center justify-center">
                          <span className="text-white font-black text-xs">R</span>
                        </div>
                      </div>
                    </div>
                    {/* Dot noise rows */}
                    {[20,30,40,50,60,70,80].map(top => (
                      <div key={top} className="absolute flex gap-[3px]" style={{top:`${top}%`,left:'28%',right:'28%'}}>
                        {[...Array(8)].map((_,i) => (
                          <div key={i} className={`h-[3px] w-[3px] bg-charcoal rounded-full ${(top+i)%3===0?'opacity-0':''}`} />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visible scan hint below QR */}
                <p className="mt-4 text-sm font-semibold text-slate-600 text-center">
                  Scan using GPay &middot; PhonePe &middot; Paytm &middot; BHIM UPI
                </p>
              </div>


              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-platinum-silver" />
                <span className="text-[10px] font-bold text-slate-gray uppercase">or enter UPI ID</span>
                <div className="flex-1 h-px bg-platinum-silver" />
              </div>

              {/* UPI ID input */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-gray mb-1.5">
                  UPI ID
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-gray" />
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full text-xs font-mono border border-platinum-silver rounded-lg pl-8 pr-3 py-2.5 bg-pure-white text-charcoal focus:ring-2 focus:ring-[#3395FF]/40 focus:border-[#3395FF] focus:outline-none transition-all"
                      disabled={paymentLoading}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (upiId.includes('@')) setErrorMsg('');
                      else setErrorMsg('Please enter a valid UPI ID (e.g. name@upi)');
                    }}
                    className="px-3 py-2 text-[10px] font-bold text-[#3395FF] border border-[#3395FF]/40 rounded-lg hover:bg-[#3395FF]/5 transition-colors cursor-pointer"
                    disabled={paymentLoading}
                  >
                    Verify
                  </button>
                </div>
                <p className="text-[10px] text-slate-gray mt-1">e.g. name@oksbi · name@paytm · name@gpay</p>
              </div>


              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between sm:items-center border-t border-platinum-silver pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-charcoal hover:bg-frost-gray border border-platinum-silver rounded-lg flex items-center justify-center space-x-2 cursor-pointer"
                  disabled={paymentLoading}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-[#3395FF] hover:bg-[#1a7ee0] disabled:opacity-60 text-white rounded-lg text-sm font-bold shadow-sm transition-all flex items-center justify-center space-x-2.5 cursor-pointer"
                  disabled={paymentLoading}
                >
                  {paymentLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Continue</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            STEP 3 — INVOICE
        ══════════════════════════════════════════════ */}
        {step === 3 && invoiceData && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-center gap-3 pb-4 border-b border-platinum-silver">
              <div className="h-10 w-10 bg-ice-gray border border-platinum-silver rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-charcoal" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider">Payment Successful</h3>
                <p className="text-[10px] text-slate-gray">Your manuscript has been submitted for review</p>
              </div>
            </div>

            {/* Invoice card */}
            <div className="border border-platinum-silver rounded-xl overflow-hidden">
              {/* Invoice header band */}
              <div className="bg-ice-gray px-5 py-3 flex items-center justify-between border-b border-platinum-silver">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-steel-gray" />
                  <span className="text-xs font-extrabold uppercase tracking-widest text-charcoal">Invoice</span>
                </div>
                <span className="text-[10px] font-mono text-slate-gray">{invoiceData.txnId}</span>
              </div>

              {/* Invoice body */}
              <div className="p-5 space-y-3 text-xs bg-pure-white">
                {/* Issued to */}
                <div className="flex flex-col items-center justify-center text-center pb-4 border-b border-platinum-silver">
                  <p className="text-[10px] font-extrabold uppercase text-slate-gray mb-1 tracking-wider">Issued To</p>
                  <p className="font-extrabold text-charcoal text-base">{currentUser.name}</p>
                  <p className="text-slate-gray text-xs mt-0.5">{department}</p>
                  <p className="text-slate-gray text-xs mt-0.5">{currentUser.email || 'faculty@snsgroups.com'}</p>
                </div>

                {/* Invoice details rows */}
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-platinum-silver/60">
                    <span className="text-slate-gray font-medium">Invoice Date</span>
                    <span className="font-semibold text-charcoal font-mono">
                      {new Date(invoiceData.date).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-platinum-silver/60">
                    <span className="text-slate-gray font-medium">Transaction ID</span>
                    <span className="font-semibold text-charcoal font-mono">{invoiceData.txnId}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-platinum-silver/60">
                    <span className="text-slate-gray font-medium">Manuscript</span>
                    <span className="font-semibold text-charcoal text-right max-w-[55%] leading-snug">{title}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-platinum-silver/60">
                    <span className="text-slate-gray font-medium">Department</span>
                    <span className="font-semibold text-charcoal">{department}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-platinum-silver/60">
                    <span className="text-slate-gray font-medium">Payment Method</span>
                    <span className="font-semibold text-charcoal">UPI (Razorpay)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-platinum-silver/60">
                    <span className="text-slate-gray font-medium">Status</span>
                    <span className="font-bold text-emerald-700 uppercase tracking-wide">Paid</span>
                  </div>
                </div>

                {/* Total row */}
                <div className="flex justify-between items-center bg-ice-gray rounded-lg px-4 py-3 mt-2">
                  <span className="font-extrabold text-charcoal uppercase text-[10px] tracking-widest">Total Amount Paid</span>
                  <span className="text-xl font-black text-charcoal font-mono">₹150</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-xs font-bold text-charcoal border border-platinum-silver hover:bg-mist-silver rounded-lg cursor-pointer"
              >
                Upload Another Manuscript
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
