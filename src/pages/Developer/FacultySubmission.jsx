import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CalendarDays, CheckCircle, FileText, Search, Trash2, Upload, X } from 'lucide-react';
import { usePublicationCategory } from '../../hooks/usePublicationCategory';
import { createDeveloperFacultySubmission, deleteDeveloperPublication, fetchDeveloperFacultyList } from '../../api/developerApi';
import { INSTITUTION_MAP } from '../../utils/constants';

const today = new Date().toISOString().slice(0, 10);

export const DeveloperFacultySubmissionPage = () => {
  const { categories, loading: categoriesLoading } = usePublicationCategory();
  const fileInputRef = useRef(null);

  const [facultyQuery, setFacultyQuery] = useState('');
  const [facultyResults, setFacultyResults] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [facultyLoading, setFacultyLoading] = useState(false);

  const [categoryId, setCategoryId] = useState('');
  const [uploadDate, setUploadDate] = useState(today);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletePublicationId, setDeletePublicationId] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const query = facultyQuery.trim();
    if (selectedFaculty || query.length < 2) {
      setFacultyResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setFacultyLoading(true);
      setError('');
      try {
        const data = await fetchDeveloperFacultyList(1, 8, undefined, undefined, query);
        setFacultyResults(data.faculties || []);
      } catch (err) {
        setError(err.message || 'Failed to search faculty.');
      } finally {
        setFacultyLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [facultyQuery, selectedFaculty]);

  const selectedCategory = useMemo(
    () => categories.find((category) => String(category.id) === String(categoryId)),
    [categories, categoryId]
  );

  const handleFile = (selectedFile) => {
    setError('');
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf' || selectedFile.name.split('.').pop()?.toLowerCase() !== 'pdf') {
      setError('Only PDF manuscript files are allowed.');
      return;
    }
    if (selectedFile.size > 20 * 1024 * 1024) {
      setError('File exceeds the 20 MB upload limit.');
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess(null);

    if (!selectedFaculty) {
      setError('Please select a faculty member.');
      return;
    }
    if (!categoryId) {
      setError('Please select a publication category.');
      return;
    }
    if (!uploadDate) {
      setError('Please select the upload date.');
      return;
    }
    if (!title.trim()) {
      setError('Publication title is required.');
      return;
    }
    if (!file) {
      setError('Please select a PDF manuscript.');
      return;
    }

    setSubmitting(true);
    try {
      const submission = await createDeveloperFacultySubmission({
        facultyUserId: selectedFaculty.user_id,
        title: title.trim(),
        categoryId,
        uploadDate,
        file
      });

      setSuccess(submission);
      setSelectedFaculty(null);
      setFacultyQuery('');
      setCategoryId('');
      setUploadDate(today);
      setTitle('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    const trimmedId = deletePublicationId.trim();

    setDeleteError('');
    setDeleteSuccess(null);

    if (!trimmedId) {
      setDeleteError('Enter a publication ID to delete.');
      return;
    }

    if (deleteConfirmation.trim() !== trimmedId) {
      setDeleteError('Confirmation must exactly match the publication ID.');
      return;
    }

    setDeleting(true);
    try {
      const result = await deleteDeveloperPublication(trimmedId);
      setDeleteSuccess(result);
      setDeletePublicationId('');
      setDeleteConfirmation('');
    } catch (err) {
      setDeleteError(err.response?.data?.message || err.message || 'Delete failed.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto text-left space-y-6">
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6 space-y-6">
        <div>
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide">Submit for Faculty</h2>
          <p className="text-xs font-medium text-slate-500 mt-1">Developer submission is saved directly as the selected faculty's submitted manuscript.</p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Submission saved successfully: {success.id}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-2 relative">
            <label className="block text-xs font-bold uppercase text-slate-800">Faculty</label>
            {selectedFaculty ? (
              <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900 truncate">{selectedFaculty.name}</p>
                  <p className="text-xs text-slate-600 truncate">{selectedFaculty.email || 'No email'}</p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {selectedFaculty.department || 'No department'} · {INSTITUTION_MAP[selectedFaculty.institution] || selectedFaculty.institution || 'No institution'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFaculty(null)}
                  className="h-8 w-8 rounded-lg border border-emerald-200 bg-white text-slate-500 hover:text-red-600 flex items-center justify-center shrink-0"
                  title="Change faculty"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    value={facultyQuery}
                    onChange={(event) => setFacultyQuery(event.target.value)}
                    placeholder="Search faculty by name or department..."
                    className="w-full h-11 rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                {(facultyLoading || facultyResults.length > 0 || facultyQuery.trim().length >= 2) && (
                  <div className="absolute z-40 left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                    {facultyLoading ? (
                      <div className="p-4 text-xs text-slate-400 font-semibold">Searching faculty...</div>
                    ) : facultyResults.length === 0 ? (
                      <div className="p-4 text-xs text-slate-400 font-semibold">No faculty found.</div>
                    ) : (
                      facultyResults.map((faculty) => (
                        <button
                          key={faculty.user_id}
                          type="button"
                          onClick={() => {
                            setSelectedFaculty(faculty);
                            setFacultyQuery('');
                            setFacultyResults([]);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
                        >
                          <p className="text-sm font-black text-slate-800">{faculty.name}</p>
                          <p className="text-xs text-slate-500">{faculty.department || 'No department'} · {faculty.email || 'No email'}</p>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-slate-800">Upload Date</label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="date"
                value={uploadDate}
                onChange={(event) => setUploadDate(event.target.value)}
                className="w-full h-11 rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-slate-800">Publication Category</label>
            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              disabled={categoriesLoading}
              className="w-full h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-60"
            >
              <option value="">{categoriesLoading ? 'Loading categories...' : 'Select category'}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {selectedCategory && (
              <p className="text-[11px] text-slate-500 font-semibold">
                Developer submission records a dummy paid payment for ₹{selectedCategory.amount}.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-slate-800">Publication Title</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={200}
              placeholder="Enter complete research publication title..."
              className="w-full h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase text-slate-800">Manuscript PDF</label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={(event) => handleFile(event.target.files?.[0])}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full min-h-28 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 transition-colors flex flex-col items-center justify-center gap-2 text-center px-4"
          >
            {file ? (
              <>
                <FileText className="h-8 w-8 text-slate-700" />
                <span className="text-sm font-black text-slate-800">{file.name}</span>
                <span className="text-xs font-semibold text-slate-500">{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-slate-500" />
                <span className="text-sm font-black text-slate-800">Select manuscript PDF</span>
                <span className="text-xs font-semibold text-slate-500">Maximum 20 MB</span>
              </>
            )}
          </button>
        </div>

        <div className="border-t border-slate-200 pt-5 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-xl bg-charcoal hover:bg-steel-gray disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-black shadow-sm"
          >
            {submitting ? 'Submitting...' : 'Submit Without Payment'}
          </button>
        </div>
      </form>

      <form onSubmit={handleDelete} className="bg-white border border-red-200 rounded-xl shadow-sm p-5 sm:p-6 space-y-5">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide">Delete Publication</h2>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Developer hard delete removes the submission, payments, notifications, audit traces, and stored PDFs when available.
            </p>
          </div>
        </div>

        {deleteError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
            {deleteError}
          </div>
        )}

        {deleteSuccess && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Deleted publication {deleteSuccess.custom_publication_id || deleteSuccess.publication_id}.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-slate-800">Publication ID</label>
            <input
              value={deletePublicationId}
              onChange={(event) => setDeletePublicationId(event.target.value)}
              placeholder="SNSCT-1-1-1 or numeric ID"
              className="w-full h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-slate-800">Confirm Publication ID</label>
            <input
              value={deleteConfirmation}
              onChange={(event) => setDeleteConfirmation(event.target.value)}
              placeholder="Type the same ID again"
              className="w-full h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="border-t border-red-100 pt-5 flex justify-end">
          <button
            type="submit"
            disabled={deleting}
            className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-black shadow-sm flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? 'Deleting...' : 'Delete Without Trace'}
          </button>
        </div>
      </form>
    </div>
  );
};
