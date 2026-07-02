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
  onNext 
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
    if (extension !== 'pdf' && extension !== 'docx') {
      setErrorMsg('Unsupported file format. Only PDF or DOCX allowed.');
      return;
    }
    if (selectedFile.size > 100 * 1024 * 1024) {
      setErrorMsg('File exceeds the 100 MB upload limit.');
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

    if (!publicationDetails.title.trim() || publicationDetails.title.length < 15) {
      setErrorMsg('Publication Title is required and must be at least 15 characters.');
      return;
    }
    
    if (!publicationDetails.department) {
      onUpdateDetails({ department: currentUser.department || ALL_DEPARTMENTS[0] });
    }

    if (!publicationDetails.file) {
      setErrorMsg('Please select or drop a valid PDF or DOCX manuscript file.');
      return;
    }

    onNext();
  };

  const currentDepartment = publicationDetails.department || currentUser.department || ALL_DEPARTMENTS[0];

  return (
    <div className="bg-pure-white rounded-2xl border border-platinum-silver shadow-xs p-6 md:p-8 w-full max-w-4xl mx-auto font-sans">
      <div className="mb-6">
        <h2 className="text-xl font-black text-charcoal uppercase tracking-wide">Upload Manuscript</h2>
        <p className="text-xs font-medium text-slate-gray mt-1">Provide the details of your publication</p>
      </div>

      {errorMsg && (
        <div className="mb-6 bg-red-50 border border-red-200/50 rounded-lg p-3 text-xs text-red-700 flex items-start space-x-2">
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Read Only Category Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-ice-gray p-4 rounded-xl border border-platinum-silver">
            <span className="block text-[10px] font-extrabold uppercase text-slate-gray mb-1">Selected Category</span>
            <span className="text-sm font-bold text-charcoal">{selectedCategory?.name}</span>
          </div>
          <div className="bg-ice-gray p-4 rounded-xl border border-platinum-silver">
            <span className="block text-[10px] font-extrabold uppercase text-slate-gray mb-1">Publication Fee</span>
            <span className="text-sm font-black text-charcoal font-mono">₹{selectedCategory?.amount}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-charcoal mb-1.5">
            Publication Title <span className="text-red-500">*</span>
          </label>
          <textarea
            value={publicationDetails.title}
            onChange={(e) => onUpdateDetails({ title: e.target.value })}
            placeholder="Enter complete research publication title..."
            className="w-full text-sm border border-platinum-silver rounded-xl p-3 focus:ring-2 focus:ring-steel-gray focus:outline-none min-h-[80px] bg-pure-white text-charcoal"
            maxLength={titleCharLimit}
          />
          <div className="flex justify-between text-[10px] font-medium text-slate-gray mt-1.5">
            <span>Minimum 15 characters</span>
            <span className={publicationDetails.title.length > titleCharLimit ? 'text-red-600' : ''}>
              {publicationDetails.title.length} / {titleCharLimit} chars
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-charcoal mb-1.5">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            value={currentDepartment}
            onChange={(e) => onUpdateDetails({ department: e.target.value })}
            className="w-full text-sm border border-platinum-silver rounded-xl p-3 focus:ring-2 focus:ring-steel-gray focus:outline-none bg-pure-white text-charcoal"
          >
            {ALL_DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-charcoal mb-1.5">
            Manuscript File <span className="text-red-500">*</span>
          </label>
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer select-none ${
              dragActive ? 'border-charcoal bg-ice-gray scale-[1.01]' : 'border-platinum-silver bg-arctic-white hover:bg-ice-gray hover:border-charcoal'
            }`}
          >
            <Upload className="h-10 w-10 text-slate-gray mx-auto mb-3 pointer-events-none transition-colors group-hover:text-charcoal" />
            <p className="text-sm font-bold text-charcoal mb-1.5 pointer-events-none">Click or Drag &amp; Drop to upload</p>
            <p className="text-xs font-medium text-slate-gray pointer-events-none">Only PDF or DOCX allowed (Max 100 MB)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {publicationDetails.file && (
            <div className="mt-4 bg-ice-gray border border-platinum-silver rounded-xl p-4 flex items-center justify-between animate-fade-in">
              <div className="flex items-center space-x-3 text-xs">
                <span className="p-2.5 bg-pure-white text-charcoal border border-platinum-silver rounded-lg shadow-xs">
                  <FileText className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-bold text-charcoal truncate max-w-[240px] md:max-w-md">{publicationDetails.file.name}</p>
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

        <div className="pt-6 border-t border-platinum-silver/50 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 text-sm font-bold text-white bg-charcoal hover:bg-steel-gray rounded-xl shadow-xs transition-colors flex items-center space-x-2 cursor-pointer"
          >
            <span>Proceed to Payment</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
