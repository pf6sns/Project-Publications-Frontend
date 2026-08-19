// src/utils/mapFields.js

// Branch ID → Institution name mapping (matches backend BRANCH_MAP)
const BRANCH_MAP = {
    1: 'SNSCT',
    2: 'SNSCE',
    3: 'DRSNSRCAS',
    4: 'SNSCPHS',
    5: 'SNSCAHS',
    6: 'SNSCPHYSIO',
    7: 'DRSNSCEDU',
    8: 'SNSBSPINE',
    9: 'SNSACADEMY',
    10: 'SNSCNURSING'
};

const FULL_INSTITUTION_MAP = {
    'SNSCT': 'SNS College of Technology',
    'SNSCE': 'SNS College of Engineering',
    'SNSRCAS': 'Dr. SNS Rajalakshmi College of Arts and Science',
    'DRSNSRCAS': 'Dr. SNS Rajalakshmi College of Arts and Science',
    'SNSCAHS': 'SNS College of Allied Health Sciences',
    'SNSCNURSING': 'SNS College of Nursing',
    'SNSCPHYSIO': 'SNS College of Physiotherapy',
    'SNSCPHS': 'SNS College of Pharmacy and Health Sciences',
    'DRSNSCEDU': 'Dr. SNS College of Education',
    'SNSBSPINE': 'SNS B-Spine',
    'SNSACADEMY': 'SNS Academy'
};

/**
 * Determines the RPMS role from a backend row.
 * - admin: true → 'Admin'
 * - role: 'student' → 'Developer'
 * - Otherwise capitalize the Okrion role (e.g. 'faculty' → 'Faculty')
 */
const resolveRole = (row) => {
    const raw = String(row.role || '').toLowerCase().trim();
    if (raw === 'developer') return 'Developer';
    if (row.admin === true || raw === 'admin') return 'Admin';
    return 'Faculty';
};

/** Maps a submissions-table row (any of the several shapes the backend returns) into
 *  the shape used across pages/components. */
export const mapSubmission = (row) => {
    const rawInst = row.institution_name || row.institution || BRANCH_MAP[row.branchId] || BRANCH_MAP[row.institution_id] || '';
    return {
        id: row.custom_publication_id || row.publication_id,
        title: row.title,
        author: row.name || row.faculty_name || undefined,
        authorEmail: row.email,
        department: row.department,
        institution: FULL_INSTITUTION_MAP[rawInst] || FULL_INSTITUTION_MAP[rawInst.toUpperCase()] || rawInst,
        category: row.category_name,
        categoryId: row.category_id,
        status: row.status,                       // 'Submitted' | 'Completed'
        submissionDate: row.submission_date || row.uploaded_date,
        lastUpdated: row.updated_at || row.reviewed_date,
        manuscriptUrl: row.manuscript_pdf_url,
        reviewUrl: row.review_pdf_url,
        sno: row.sno,
    };
};

export const mapCategory = (row) => ({
    id: row.category_id,
    name: row.category_name,
    amount: Number(row.fees),
    is_disabled: !!row.is_disabled,
});



export const mapFacultyListItem = (row) => {
    const rawInst = row.institution_name || row.institution || BRANCH_MAP[row.branchId] || BRANCH_MAP[row.institution_id] || '';
    return {
        id: row.user_id,
        user_id: row.user_id,
        sno: row.sno,
        name: row.name || '',
        email: row.email || '',
        role: resolveRole(row),
        department: row.department || '',
        institution: FULL_INSTITUTION_MAP[rawInst] || FULL_INSTITUTION_MAP[rawInst.toUpperCase()] || rawInst,
        publications: Number(row.publication_count) || 0,
    };
};

export const mapUser = (row) => {
    const rawInst = row.institution_name || row.institution || BRANCH_MAP[row.branchId] || BRANCH_MAP[row.institution_id] || '';
    const phoneVal = row.phone || row.phone_number || row.phoneNumber || row.mobile || row.mobileNumber || row.contact || row.contactNo || row.phoneNo || '';
    return {
        id: row.user_id,
        user_id: row.user_id,
        name: row.name || '',
        email: row.email || '',
        role: resolveRole(row),
        department: row.department || '',
        phone: phoneVal,
        phone_number: phoneVal,
        phoneNumber: phoneVal,
        mobile: phoneVal,
        institution: FULL_INSTITUTION_MAP[rawInst] || FULL_INSTITUTION_MAP[rawInst.toUpperCase()] || rawInst,
        institutionId: row.institution_id || row.branchId || '',
        admin: row.admin || false,
        tempAdmin: row.temp_admin || false,
        // Temp admin permission booleans (from temp_admin_permissions table)
        permissions: row.temp_admin ? {
            dashboard: row.dashboard,
            evaluation_console: row.evaluation_console,
            my_publications: row.my_publications,
            submissions_queue: row.submissions_queue,
            upload_manuscript: row.upload_manuscript,
            assign_access: row.assign_access,
            evaluate_manuscript: row.evaluate_manuscript,
            export_data: row.export_data,
            delete_manuscript: row.delete_manuscript,
            manage_users: row.manage_users,
        } : null,
    };
};