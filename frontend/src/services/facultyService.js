import { mockUsers, historicalPublicationsForStats } from '../data';

// Helper to simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate a large list of mock faculty for pagination demo
const generateMockFacultyList = () => {
  const baseFaculty = Object.values(mockUsers).filter(u => u.role === 'Faculty');
  const facultyList = [];
  
  // Create 50 mock faculty members based on the base ones
  for (let i = 1; i <= 50; i++) {
    const base = baseFaculty[i % baseFaculty.length] || baseFaculty[0];
    const pubCount = historicalPublicationsForStats.filter(p => p.authorId === base.id).length;
    
    facultyList.push({
      ...base,
      id: `FAC${String(i).padStart(3, '0')}`,
      name: `${base.name.split(' ')[0]} ${base.name.split(' ')[1]} ${i}`,
      publications: pubCount + (i % 5), // Vary publication counts
      originalId: base.id // To keep track of who they are for the view profile
    });
  }
  return facultyList;
};

let cachedFacultyList = null;

export const facultyService = {
  getFacultyList: async (page = 1, limit = 20, searchQuery = '') => {
    await delay(600); // Simulate network latency

    if (!cachedFacultyList) {
      cachedFacultyList = generateMockFacultyList();
    }

    let filtered = cachedFacultyList;
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        f => 
          f.name.toLowerCase().includes(lowerQuery) || 
          f.department.toLowerCase().includes(lowerQuery) ||
          f.id.toLowerCase().includes(lowerQuery)
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = filtered.slice(startIndex, endIndex);

    return {
      data: paginatedItems,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit)
    };
  },

  getFacultyById: async (id) => {
    await delay(300);
    if (!cachedFacultyList) cachedFacultyList = generateMockFacultyList();
    return cachedFacultyList.find(f => f.id === id) || null;
  },

  getGlobalFields: async () => {
    await delay(400);
    const fields = localStorage.getItem('rpms_global_fields');
    if (fields) {
      return JSON.parse(fields);
    }
    // Default fields
    const defaultFields = [
      { id: 'f1', name: 'Google Scholar' },
      { id: 'f2', name: 'ResearchGate' }
    ];
    localStorage.setItem('rpms_global_fields', JSON.stringify(defaultFields));
    return defaultFields;
  },

  addField: async (name) => {
    await delay(300);
    const fields = await facultyService.getGlobalFields();
    const newField = {
      id: `field_${Date.now()}`,
      name
    };
    fields.push(newField);
    localStorage.setItem('rpms_global_fields', JSON.stringify(fields));
    return newField;
  },

  deleteField: async (id) => {
    await delay(300);
    let fields = await facultyService.getGlobalFields();
    fields = fields.filter(f => f.id !== id);
    localStorage.setItem('rpms_global_fields', JSON.stringify(fields));
    return true;
  }
};
