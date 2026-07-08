import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { useFacultyList, useGlobalFields } from '../../hooks/useFaculty';
import { FacultySearch } from '../../components/FacultySearch';
import { FacultyTable } from '../../components/FacultyTable';
import { ManageFieldsModal } from '../../components/ManageFieldsModal';
import { SearchableDropdown } from '../../components/SearchableDropdown';
import { ProfilePage } from '../Shared/Profile';
import { facultyService } from '../../services/facultyService';
import { INSTITUTION_OPTIONS } from '../../utils/constants';
import { usePermissions } from '../../hooks/usePermissions';

export function AdminFacultyProfilesPage() {
  const { hasFeatureAccess } = usePermissions();
  const { data, loading, pagination, fetchFaculty } = useFacultyList();
  const { fields, fetchFields } = useGlobalFields();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState('All Institutions');
  const [viewingFaculty, setViewingFaculty] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const { user_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  useEffect(() => {
    fetchFaculty(1, 10, searchQuery, [selectedInstitution]);
  }, [fetchFaculty, searchQuery, selectedInstitution]);

  useEffect(() => {
    if (user_id) {
      const loadProfile = async () => {
        try {
          const fullProfile = await facultyService.getFacultyById(user_id);
          setViewingFaculty(fullProfile);
        } catch (err) {
          console.error('Failed to fetch full faculty profile:', err);
          navigate('/not-found', { replace: true });
        }
      };
      loadProfile();
    } else {
      setViewingFaculty(null);
    }
  }, [user_id, navigate, location.pathname]);

  const handlePageChange = (newPage) => {
    fetchFaculty(newPage, 10, searchQuery, [selectedInstitution]);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleViewProfile = (faculty) => {
    const basePath = location.pathname.includes('/admin/faculty')
      ? '/admin/faculty'
      : '/faculty/faculty-profiles';
    navigate(`${basePath}/${faculty.user_id}`);
  };

  const handleBack = () => {
    const basePath = location.pathname.includes('/admin/faculty')
      ? '/admin/faculty'
      : '/faculty/faculty-profiles';
    navigate(basePath);
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
          isEditable={true}
          onSaveLinks={(links) => facultyService.updateSocialLinksAsAdmin(viewingFaculty.id, links)}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4">
        <div className="flex items-center space-x-3">
          {hasFeatureAccess('manage_profile_fields') && (
            <button
              onClick={() => setIsManageModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-pure-white border border-platinum-silver text-charcoal text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Settings className="w-4 h-4 mr-2 text-slate-gray" />
              Manage Profile Fields
            </button>
          )}
        </div>
      </div>

      <div className="bg-pure-white p-4 rounded-2xl border border-platinum-silver shadow-xs">
        <div className="mb-4 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 w-full">
          <FacultySearch onSearch={handleSearch} />
          
          <div className="w-full sm:w-[210px] shrink-0 relative z-30">
            <SearchableDropdown
              options={INSTITUTION_OPTIONS}
              value={selectedInstitution}
              onChange={setSelectedInstitution}
              placeholder="Search institution..."
              isMulti={false}
            />
          </div>
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
