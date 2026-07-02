/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const mockUsers = {
  FAC001: {
    id: 'FAC001',
    name: 'Dr. A. Kumar',
    email: 'kumar@snsgroups.com',
    role: 'Faculty',
    department: 'Computer Science and Engineering',
    designation: 'Faculty member',
    grantCount: 0,
  },
  FAC002: {
    id: 'FAC002',
    name: 'Prof. M. Priya',
    email: 'priya@snsgroups.com',
    role: 'Faculty',
    department: 'Electronics and Communication Engineering',
    designation: 'Faculty member',
    grantCount: 0,
  },
  ADMIN01: {
    id: 'ADMIN01',
    name: 'Dr. S. Vignesh',
    email: 'vignesh@snsgroups.com',
    role: 'Admin',
    department: 'Office of Dean (Research)',
    designation: 'Dean - Research & Development',
  },
};

export const historicalPublicationsForStats = [
  // Faculty A (FAC001) - Strong Record, Approved papers
  {
    id: 'PUB-2026-001',
    title: 'Advanced Deep Learning Architectures for IoT Energy Optimization in Smart Cities',
    author: 'Dr. A. Kumar',
    authorId: 'FAC001',
    department: 'Computer Science and Engineering',
    category: 'International Journal (Scopus Indexed)',
    abstract: 'This research proposes an end-to-end framework for optimizing power-consumption in Internet-of-Things (IoT) edge devices using compressed neural networks. High-density urban systems rely heavily on sensors that suffer from battery depletion. By introducing dynamic pruning and spatial clustering on convolutional kernels, we achieve a 42% reduction in mathematical operations with less than 1.5% accuracy loss on standard city-monitoring datasets.',
    status: 'Approved',
    currentVersion: 1,
    submissionDate: '2026-04-12T09:30:00Z',
    lastUpdated: '2026-04-18T14:15:00Z',
    paymentStatus: 'Paid',
    paymentDetails: {
      transactionId: 'TXN-9023412',
      amount: 150,
      date: '2026-04-12T09:35:00Z',
    },
    citations: 18,
    versions: [
      {
        version: 1,
        fileName: 'sns_rpms_dl_iot_energy_v1.pdf',
        fileSize: '3.2 MB',
        uploadDate: '2026-04-12T09:30:00Z',
        reviewDate: '2026-04-18T14:15:00Z',
        status: 'Approved',
        feedback: 'Excellent work in addressing edge resource limits. The performance metrics are thoroughly detailed. Recommended for immediate Scopus submission.',
        rejectionReason: null,
      },
    ],
  },
  {
    id: 'PUB-2026-002',
    title: 'Optimizing Query Execution in Scalable Distributed Spanner Databases with Hybrid Indexing',
    author: 'Dr. A. Kumar',
    authorId: 'FAC001',
    department: 'Computer Science and Engineering',
    category: 'IEEE Conference',
    abstract: 'Distributed SQL databases face immense latency bottlenecks while resolving secondary indexes across remote server clusters. This paper details a hybrid geo-distributed index schema which merges primary shard metrics with adaptive local caches. Simulation workloads using Google Spanner standard telemetry prove a 35% reduction in cross-region lock holdtimes and roundtrip database lookups.',
    status: 'Approved',
    currentVersion: 1,
    submissionDate: '2026-05-02T11:20:00Z',
    lastUpdated: '2026-05-08T16:40:00Z',
    paymentStatus: 'Paid',
    paymentDetails: {
      transactionId: 'TXN-9182374',
      amount: 150,
      date: '2026-05-02T11:22:00Z',
    },
    citations: 6,
    versions: [
      {
        version: 1,
        fileName: 'spanner_query_opt_kumar_v1.pdf',
        fileSize: '1.8 MB',
        uploadDate: '2026-05-02T11:20:00Z',
        reviewDate: '2026-05-08T16:40:00Z',
        status: 'Approved',
        feedback: 'Well-researched methodology. The database tuning charts align perfectly with theoretical expectations. Approved.',
        rejectionReason: null,
      },
    ],
  },
  {
    id: 'PUB-2026-003',
    title: 'A High-Performance Parallel Cryptography Accelerator for Resource-Constrained UAV Nodes',
    author: 'Dr. A. Kumar',
    authorId: 'FAC001',
    department: 'Computer Science and Engineering',
    category: 'International Journal (Scopus Indexed)',
    abstract: 'UAV communication nodes require cryptographic operations to secure sensory feeds but face tight spatial/computational budgets. This paper designs a fully pipelined, side-channel attack resistant hardware accelerator for AES-GCM 256. It scales based on live voltage frequency scaling, offering stable cryptographic operations even during low-power descent phases.',
    status: 'Approved',
    currentVersion: 1,
    submissionDate: '2026-05-20T14:15:00Z',
    lastUpdated: '2026-05-25T10:05:00Z',
    paymentStatus: 'Paid',
    paymentDetails: {
      transactionId: 'TXN-9328471',
      amount: 150,
      date: '2026-05-20T14:18:00Z',
    },
    citations: 2,
    versions: [
      {
        version: 1,
        fileName: 'uav_uav_crypto_accelerator_v1.docx',
        fileSize: '4.1 MB',
        uploadDate: '2026-05-20T14:15:00Z',
        reviewDate: '2026-05-25T10:05:00Z',
        status: 'Approved',
        feedback: 'The UAV power scenario modeling is highly unique. FPGA verification metrics look solid and complete. Accepted.',
        rejectionReason: null,
      },
    ],
  },
  {
    id: 'PUB-2026-004',
    title: 'Blockchain-Based Secured Patient Record Management for Multidisciplinary Hospitals',
    author: 'Dr. A. Kumar',
    authorId: 'FAC001',
    department: 'Computer Science and Engineering',
    category: 'National Journal',
    abstract: 'With hospital databases becoming primary targets for ransomware, this study outlines a decentralized patient portal. Electronic Health Records (EHRs) are stored in local secure server instances with metadata hashes anchored to a custom private Ethereum network. Role-based smart contracts govern immediate physician data handoffs and ensure patient-consented records decryption.',
    status: 'Pending',
    currentVersion: 1,
    submissionDate: '2026-06-18T08:00:00Z',
    lastUpdated: '2026-06-18T08:05:00Z',
    paymentStatus: 'Paid',
    paymentDetails: {
      transactionId: 'TXN-9821364',
      amount: 150,
      date: '2026-06-18T08:05:00Z',
    },
    citations: 0,
    versions: [
      {
        version: 1,
        fileName: 'blockchain_ehr_system_kumar_v1.pdf',
        fileSize: '4.8 MB',
        uploadDate: '2026-06-18T08:00:00Z',
        reviewDate: null,
        status: 'Pending',
        feedback: null,
        rejectionReason: null,
      },
    ],
  },

  // Faculty B (FAC002) - Multiple Resubmissions, active Rejection setup
  {
    id: 'PUB-2026-005',
    title: 'Multi-layered Security Framework in Geo-Distributed Vehicular Ad-hoc Networks (VANETs)',
    author: 'Prof. M. Priya',
    authorId: 'FAC002',
    department: 'Electronics and Communication Engineering',
    category: 'International Journal (Scopus Indexed)',
    abstract: 'Vehicular networks encounter severe spoofing attacks and routing congestion during coordinate exchanges. We construct a multi-layered filter combining ECDSA signatures with dynamic spatial validation nodes. Real-time traffic models verify high protection levels with small packet delays even under dense packet collision situations.',
    status: 'Approved',
    currentVersion: 3,
    submissionDate: '2026-05-10T10:00:00Z',
    lastUpdated: '2026-05-24T15:30:00Z',
    paymentStatus: 'Paid',
    paymentDetails: {
      transactionId: 'TXN-9204856',
      amount: 150,
      date: '2026-05-10T10:04:00Z',
    },
    citations: 4,
    versions: [
      {
        version: 1,
        fileName: 'vanet_security_priya_v1.pdf',
        fileSize: '2.9 MB',
        uploadDate: '2026-05-10T10:00:00Z',
        reviewDate: '2026-05-14T11:00:00Z',
        status: 'Rejected',
        feedback: 'The literature review is extremely outdated. Research from 2024 and 2025 has been neglected. Please include standard dynamic routing models in your citations and resubmit.',
        rejectionReason: 'Literature review is incomplete and missing papers from 2024-2025.',
      },
      {
        version: 2,
        fileName: 'vanet_security_priya_v2.pdf',
        fileSize: '3.1 MB',
        uploadDate: '2026-05-17T11:30:00Z',
        reviewDate: '2026-05-20T14:00:00Z',
        status: 'Rejected',
        feedback: 'While the citations are expanded, Section 4.2 contains duplicate equations straight from standard textbooks. Please specify your mathematical contributions clearly.',
        rejectionReason: 'Duplicate equations and lack of distinct mathematical proofs in dynamic filtering sections.',
      },
      {
        version: 3,
        fileName: 'vanet_security_priya_v3.pdf',
        fileSize: '3.3 MB',
        uploadDate: '2026-05-22T09:12:00Z',
        reviewDate: '2026-05-24T15:30:00Z',
        status: 'Approved',
        feedback: 'The mathematical derivations in Section 4 are now accurate, distinct, and complete. All bibliographic comments were successfully incorporated.',
        rejectionReason: null,
      },
    ],
  },
  {
    id: 'PUB-2026-006',
    title: 'Deep Learning Based Diabetic Retinopathy Detection and Stage Classification using Fundus Images',
    author: 'Prof. M. Priya',
    authorId: 'FAC002',
    department: 'Electronics and Communication Engineering',
    category: 'International Journal (Scopus Indexed)',
    abstract: 'Early detection of diabetic retinopathy is critical to prevent blindness in diabetic patients. This research implements a deep residual neural network (ResNet101) with customized spatial attention layers to analyze and identify microaneurysms, hemorrhages, and exudates. The network categorizes fundus scans into five stages ranging from normal to proliferative retinopathy.',
    status: 'Rejected',
    currentVersion: 1,
    submissionDate: '2026-06-15T11:45:00Z',
    lastUpdated: '2026-06-17T16:20:00Z',
    paymentStatus: 'Paid',
    paymentDetails: {
      transactionId: 'TXN-9721389',
      amount: 150,
      date: '2026-06-15T11:51:00Z',
    },
    citations: 0,
    versions: [
      {
        version: 1,
        fileName: 'diabetic_retinopathy_resnet_v1.pdf',
        fileSize: '5.2 MB',
        uploadDate: '2026-06-15T11:45:00Z',
        reviewDate: '2026-06-17T16:20:00Z',
        status: 'Rejected',
        feedback: 'The image pre-processing pipeline is highly generic. Please clarify your specific filter configurations (e.g., CLAHE settings, Green channel extraction details) and provide a comparative validation chart against state-of-the-art models.',
        rejectionReason: 'Image pre-processing parameters are details-deficient and lack performance benchmarks against leading solutions.',
      },
    ],
  },
];

const initialActivitiesMock = [
  {
    id: 'ACT-001',
    userId: 'FAC001',
    userName: 'Dr. A. Kumar',
    userRole: 'Faculty',
    publicationId: 'PUB-2026-001',
    publicationTitle: 'Advanced Deep Learning Architectures for IoT Energy Optimization in Smart Cities',
    action: 'Publication Submitted',
    details: 'Submitted Version 1 of the publication to the CSE Research Committee.',
    timestamp: '2026-04-12T09:30:00Z',
  },
  {
    id: 'ACT-002',
    userId: 'FAC001',
    userName: 'Dr. A. Kumar',
    userRole: 'Faculty',
    publicationId: 'PUB-2026-001',
    publicationTitle: 'Advanced Deep Learning Architectures for IoT Energy Optimization in Smart Cities',
    action: 'Payment Successful',
    details: 'Completed processing fee payment of ₹150 (TXN-9023412).',
    timestamp: '2026-04-12T09:35:00Z',
  },
  {
    id: 'ACT-003',
    userId: 'ADMIN01',
    userName: 'Dr. S. Vignesh',
    userRole: 'Admin',
    publicationId: 'PUB-2026-001',
    publicationTitle: 'Advanced Deep Learning Architectures for IoT Energy Optimization in Smart Cities',
    action: 'Publication Approved',
    details: 'Approved submission PUB-2026-001 after positive external review feedback.',
    timestamp: '2026-04-18T14:15:00Z',
  },
  {
    id: 'ACT-004',
    userId: 'FAC002',
    userName: 'Prof. M. Priya',
    userRole: 'Faculty',
    publicationId: 'PUB-2026-005',
    publicationTitle: 'Multi-layered Security Framework in Geo-Distributed Vehicular Ad-hoc Networks (VANETs)',
    action: 'Publication Submitted',
    details: 'Submitted Version 1 of the publication to ECE Research Committee.',
    timestamp: '2026-05-10T10:00:00Z',
  },
  {
    id: 'ACT-005',
    userId: 'ADMIN01',
    userName: 'Dr. S. Vignesh',
    userRole: 'Admin',
    publicationId: 'PUB-2026-005',
    publicationTitle: 'Multi-layered Security Framework in Geo-Distributed Vehicular Ad-hoc Networks (VANETs)',
    action: 'Publication Rejected',
    details: 'Rejected Version 1 of PUB-2026-005. Requested literature updates.',
    timestamp: '2026-05-14T11:00:00Z',
  },
  {
    id: 'ACT-006',
    userId: 'FAC002',
    userName: 'Prof. M. Priya',
    userRole: 'Faculty',
    publicationId: 'PUB-2026-005',
    publicationTitle: 'Multi-layered Security Framework in Geo-Distributed Vehicular Ad-hoc Networks (VANETs)',
    action: 'Resubmission Uploaded',
    details: 'Uploaded corrected Version 2 incorporating 2024-2025 literary findings.',
    timestamp: '2026-05-17T11:30:00Z',
  },
  {
    id: 'ACT-007',
    userId: 'ADMIN01',
    userName: 'Dr. S. Vignesh',
    userRole: 'Admin',
    publicationId: 'PUB-2026-005',
    publicationTitle: 'Multi-layered Security Framework in Geo-Distributed Vehicular Ad-hoc Networks (VANETs)',
    action: 'Publication Rejected',
    details: 'Rejected Version 2 of PUB-2026-005 due to equation overlaps in Section 4.2.',
    timestamp: '2026-05-20T14:00:00Z',
  },
  {
    id: 'ACT-008',
    userId: 'FAC002',
    userName: 'Prof. M. Priya',
    userRole: 'Faculty',
    publicationId: 'PUB-2026-005',
    publicationTitle: 'Multi-layered Security Framework in Geo-Distributed Vehicular Ad-hoc Networks (VANETs)',
    action: 'Resubmission Uploaded',
    details: 'Uploaded Version 3 detailing dedicated mathematical algorithms.',
    timestamp: '2026-05-22T09:12:00Z',
  },
  {
    id: 'ACT-009',
    userId: 'ADMIN01',
    userName: 'Dr. S. Vignesh',
    userRole: 'Admin',
    publicationId: 'PUB-2026-005',
    publicationTitle: 'Multi-layered Security Framework in Geo-Distributed Vehicular Ad-hoc Networks (VANETs)',
    action: 'Publication Approved',
    details: 'Surgically approved Version 3. Complete revision guidelines satisfied.',
    timestamp: '2026-05-24T15:30:00Z',
  },
  {
    id: 'ACT-010',
    userId: 'FAC002',
    userName: 'Prof. M. Priya',
    userRole: 'Faculty',
    publicationId: 'PUB-2026-006',
    publicationTitle: 'Deep Learning Based Diabetic Retinopathy Detection and Stage Classification using Fundus Images',
    action: 'Publication Submitted',
    details: 'Uploaded Version 1 of Retinopathy classification proposal.',
    timestamp: '2026-06-15T11:45:00Z',
  },
  {
    id: 'ACT-011',
    userId: 'ADMIN01',
    userName: 'Dr. S. Vignesh',
    userRole: 'Admin',
    publicationId: 'PUB-2026-006',
    publicationTitle: 'Deep Learning Based Diabetic Retinopathy Detection and Stage Classification using Fundus Images',
    action: 'Publication Rejected',
    details: 'Rejected Version 1 of Retinopathy paper. Demanded clear image pre-processing configurations.',
    timestamp: '2026-06-17T16:20:00Z',
  },
  {
    id: 'ACT-012',
    userId: 'FAC001',
    userName: 'Dr. A. Kumar',
    userRole: 'Faculty',
    publicationId: 'PUB-2026-004',
    publicationTitle: 'Blockchain-Based Secured Patient Record Management for Multidisciplinary Hospitals',
    action: 'Publication Submitted',
    details: 'Submitted dynamic distributed ledger Patient Record proposal.',
    timestamp: '2026-06-18T08:00:00Z',
  },
];

export const initialNotifications = [];

const initialEmailsMock = [
  {
    id: 'EML-001',
    to: 'kumar@snsgroups.com',
    recipientName: 'Dr. A. Kumar',
    subject: 'RPMS Fee Payment Successful: PUB-2026-001',
    body: `Dear Dr. A. Kumar,

Your payment of ₹150 for publication ID "PUB-2026-001" (Advanced Deep Learning Architectures for IoT Energy Optimization in Smart Cities) has been successfully verified. 

Transaction ID: TXN-9023412
Date: 2026-04-12 09:35 AM

This research paper is now assigned to the Dean (Research) office review queue.

Regards,
SNS RPMS Finance Desk`,
    sentAt: '2026-04-12T09:35:00Z',
    category: 'Payment',
  },
  {
    id: 'EML-002',
    to: 'kumar@snsgroups.com',
    recipientName: 'Dr. A. Kumar',
    subject: 'RPMS Notification: Publication Approved - PUB-2026-001',
    body: `Dear Dr. A. Kumar,

We are pleased to inform you that your publication titled "Advanced Deep Learning Architectures for IoT Energy Optimization in Smart Cities" has been REVIEWED and APPROVED by the Dean (Research) Dr. S. Vignesh.

Feedback Summary:
"Excellent work in addressing edge resource limits. The performance metrics are thoroughly detailed."

You can access the approval certificate and Scopus filing clearance guidelines in the RPMS Portal.

Best wishes,
Office of Dean Research
SNS Institutions`,
    sentAt: '2026-04-18T14:15:00Z',
    category: 'Approved',
  },
  {
    id: 'EML-003',
    to: 'vignesh@snsgroups.com',
    recipientName: 'Dr. S. Vignesh',
    subject: 'RPMS Security Alert: New Publication Submitted (PUB-2026-004)',
    body: `Dear Dr. S. Vignesh,

A new research publication proposal has been uploaded to the RPMS portal and is pending your immediate action.

Author: Dr. A. Kumar (CSE Department)
Title: Blockchain-Based Secured Patient Record Management for Multidisciplinary Hospitals
Fee Paid: ₹150 (TXN-9821364)

Please login to the Admin Dashboard to review the PDF and record comments.

RPMS Portal System Mailer`,
    sentAt: '2026-06-18T08:05:00Z',
    category: 'Submission',
  },
  {
    id: 'EML-004',
    to: 'priya@snsgroups.com',
    recipientName: 'Prof. M. Priya',
    subject: 'RPMS Action Required: Publication Rejected - PUB-2026-006',
    body: `Dear Prof. M. Priya,

Your recent publication submission "Deep Learning Based Diabetic Retinopathy Detection and Stage Classification using Fundus Images" has been rejected on Version 1. 

Reviewer Comments:
"The image pre-processing pipeline is highly generic. Please clarify your specific filter configurations (CLAHE settings, Green channel extraction details) and provide a comparative validation chart."

Please review the detailed feedback page and submit your corrected paper as Version 2 within the RPMS Portal. You will NOT be charged any additional payment for this resubmission.

Sincerely,
Office of Dean Research
SNS Institutions`,
    sentAt: '2026-06-17T16:21:00Z',
    category: 'Rejected',
  },
];

export const initialPublications = [];
export const initialActivities = [];
export const initialEmails = [];
