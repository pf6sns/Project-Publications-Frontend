export const INSTITUTION_OPTIONS = [
  'All Institutions',
  'SNS College of Technology',                   // 1: SNSCT
  'SNS College of Engineering',                  // 2: SNSCE
  'Dr. SNS Rajalakshmi College of Arts and Science', // 3: DRSNSRCAS
  'SNS College of Pharmacy and Health Sciences', // 4: SNSCPHS
  'SNS College of Allied Health Sciences',       // 5: SNSCAHS
  'SNS College of Physiotherapy',                // 6: SNSCPHYSIO
  'Dr. SNS College of Education',                // 7: DRSNSCEDU
  'SNS B-Spine',                                 // 8: SNSBSPINE
  'SNS Academy',                                 // 9: SNSACADEMY
  'SNS College of Nursing'                       // 10: SNSCNURSING
];

export const INSTITUTION_MAP = {
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
 * Submission status constants.
 * Backend creates new submissions as 'Submitted' (not 'Pending').
 */
export const STATUS = {
  SUBMITTED: 'Submitted',
  COMPLETED: 'Completed',
};
