import React, { useEffect, useState } from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { useFacultyList, useGlobalFields } from '../../hooks/useFaculty';
import { FacultySearch } from '../../components/facultyProfile/FacultySearch';
import { FacultyTable } from '../../components/facultyProfile/FacultyTable';
import { ManageFieldsModal } from '../../components/facultyProfile/ManageFieldsModal';
import { ProfilePage } from '../Shared/Profile';

export function AdminFacultyProfilesPage() {
  const { data, loading, pagination, fetchFaculty } = useFacultyList();
  const { fields, fetchFields } = useGlobalFields();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingFaculty, setViewingFaculty] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  useEffect(() => {
    fetchFaculty(1, 20, searchQuery);
    fetchFields();
  }, [fetchFaculty, fetchFields, searchQuery]);

  const handlePageChange = (newPage) => {
    fetchFaculty(newPage, 20, searchQuery);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleViewProfile = (faculty) => {
    setViewingFaculty(faculty);
  };

  const handleBack = () => {
    setViewingFaculty(null);
  };

  if (viewingFaculty) {
    return (
      <div className="w-full mx-auto font-sans">
        {/* Match the padding and max-width of the profile card below */}
        <div className="w-full flex justify-center pt-8 px-4">
          <div className="w-full max-w-2xl flex justify-between items-center bg-pure-white p-4 rounded-2xl border border-platinum-silver shadow-xs transition-all duration-300 hover:scale-[1.005] hover:shadow-md">
            <button
              onClick={handleBack}
              className="px-4 py-2 text-xs font-bold text-charcoal bg-frost-gray hover:bg-mist-silver border border-platinum-silver rounded-lg flex items-center space-x-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Directory</span>
            </button>
          </div>
        </div>
        
        {/* Reusing existing ProfilePage Component */}
        <ProfilePage 
          currentUser={viewingFaculty}
          globalFields={fields} 
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsManageModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-pure-white border border-platinum-silver text-charcoal text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Settings className="w-4 h-4 mr-2 text-slate-gray" />
            Manage Profile Fields
          </button>
        </div>
      </div>

      <div className="bg-pure-white p-4 rounded-2xl border border-platinum-silver shadow-xs">
        <div className="mb-4">
          <FacultySearch onSearch={handleSearch} />
        </div>
        
        <FacultyTable
          data={data}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onViewProfile={handleViewProfile}
        />
      </div>

      <ManageFieldsModal 
        isOpen={isManageModalOpen} 
        onClose={() => setIsManageModalOpen(false)} 
      />
    </div>
  );
}
