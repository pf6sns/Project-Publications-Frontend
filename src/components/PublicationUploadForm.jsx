import React, { useRef, useState } from 'react';
import { Upload, FileText, AlertCircle, ArrowRight } from 'lucide-react';

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

export function PublicationUploadForm({ 
  currentUser, 
  selectedCategory, 
  publicationDetails, 
  onUpdateDetails, 
  onNext,
  isSubmitting,
  isPaymentEnabled = true
}) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const titleCharLimit = 200;

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
    if (extension !== 'pdf') {
      setErrorMsg('Unsupported file format. Only PDF files are allowed.');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMsg('File exceeds the 10 MB upload limit.');
      return;
    }
    const readableSize = (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB';
    onUpdateDetails({ 
      file: { name: selectedFile.name, size: readableSize }, 
      rawFile: selectedFile 
    });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!publicationDetails.title.trim()) {
      setErrorMsg('Publication Title is required.');
      return;
    }
    
    if (!publicationDetails.department) {
      onUpdateDetails({ department: currentUser.department || ALL_DEPARTMENTS[0] });
    }

    if (!publicationDetails.file) {
      setErrorMsg('Please select or drop a valid PDF manuscript file.');
      return;
    }

    onNext();
  };

  const currentDepartment = publicationDetails.department || currentUser.department || ALL_DEPARTMENTS[0];

  return (
    <div className="bg-pure-white rounded-2xl border border-platinum-silver shadow-xs p-4 sm:p-6 md:p-8 w-full max-w-4xl mx-auto font-sans">
      <div className="mb-6">
        <h2 className="text-xl font-black text-charcoal uppercase tracking-wide">Upload Manuscript</h2>
        <p className="text-xs font-medium text-slate-gray mt-1">Provide the details of your publication</p>
      </div>

      {errorMsg && (
        <div className="mb-6 bg-red-50 border border-red-200/50 rounded-lg p-3 text-xs text-red-700 flex items-start space-x-2">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Read Only Category Details */}
        <div className={`grid grid-cols-1 ${isPaymentEnabled ? 'md:grid-cols-2' : ''} gap-4`}>
          <div className="bg-ice-gray p-4 rounded-xl border border-platinum-silver">
            <span className="block text-[10px] font-extrabold uppercase text-slate-gray mb-1">Selected Category</span>
            <span className="text-sm font-bold text-charcoal">{selectedCategory?.name}</span>
          </div>
          {isPaymentEnabled && (
            <div className="bg-ice-gray p-4 rounded-xl border border-platinum-silver">
              <span className="block text-[10px] font-extrabold uppercase text-slate-gray mb-1">Category Fee</span>
              <span className="text-sm font-bold text-charcoal">₹{selectedCategory?.amount}</span>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold uppercase text-charcoal mb-1.5">
              Publication Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter full publication title..."
              value={publicationDetails.title}
              onChange={(e) => onUpdateDetails({ title: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-arctic-white border border-platinum-silver rounded-xl text-xs font-medium text-charcoal placeholder-slate-gray outline-none focus:border-charcoal transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-charcoal mb-1.5">
              Department
            </label>
            <input
              type="text"
              readOnly
              value={currentDepartment}
              className="w-full px-3.5 py-2.5 bg-ice-gray border border-platinum-silver rounded-xl text-xs font-bold text-slate-gray cursor-not-allowed outline-none"
            />
          </div>
        </div>

        {/* File Upload Box */}
        <div>
          <label className="block text-xs font-bold uppercase text-charcoal mb-1.5">
            Manuscript File <span className="text-red-500">*</span>
          </label>
          {!publicationDetails.file ? (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 sm:p-6 md:p-8 text-center transition-all cursor-pointer select-none ${
                dragActive ? 'border-charcoal bg-ice-gray scale-[1.01]' : 'border-platinum-silver bg-arctic-white hover:bg-ice-gray hover:border-charcoal'
              }`}
            >
              <Upload className="h-10 w-10 text-slate-gray mx-auto mb-3 pointer-events-none transition-colors group-hover:text-charcoal" />
              <p className="text-sm font-bold text-charcoal mb-1.5 pointer-events-none">Click or Drag &amp; Drop to upload</p>
              <p className="text-xs font-medium text-slate-gray pointer-events-none">Only PDF allowed (Max 10 MB)</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="bg-ice-gray border border-platinum-silver rounded-xl p-4 flex items-center justify-between animate-fade-in">
              <div className="flex items-center space-x-3 text-xs">
                <span className="p-2.5 bg-pure-white text-charcoal border border-platinum-silver rounded-lg shadow-xs">
                  <FileText className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-bold text-charcoal truncate max-w-45 sm:max-w-60 md:max-w-md">{publicationDetails.file.name}</p>
                  <p className="text-slate-gray font-medium mt-0.5">{publicationDetails.file.size}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onUpdateDetails({ file: null, rawFile: null })}
                className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline cursor-pointer px-2 py-1"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-platinum-silver/50 flex flex-col sm:flex-row items-stretch sm:justify-end gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 text-sm font-bold text-white bg-charcoal hover:bg-steel-gray disabled:opacity-70 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Uploading & Saving...</span>
              </>
            ) : (
              <>
                <span>{isPaymentEnabled && Number(selectedCategory?.amount) > 0 ? "Save & Proceed to Payment" : "Submit"}</span>
                {isPaymentEnabled && Number(selectedCategory?.amount) > 0 && <ArrowRight className="h-4 w-4" />}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
