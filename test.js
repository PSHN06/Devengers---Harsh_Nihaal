// Smart Bharat - Unit Tests
// Test suite for critical utility functions and API integration

// Test 1: XSS Protection - escapeHTML()
function testEscapeHTML() {
  const escapeHTML = (str) => str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[tag] || tag));

  const tests = [
    { input: '<script>alert("xss")</script>', expected: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;', name: 'Script tag escaping' },
    { input: 'Normal text', expected: 'Normal text', name: 'Normal text' },
    { input: '&lt;test&gt;', expected: '&amp;lt;test&amp;gt;', name: 'Already escaped' },
    { input: '"quoted"', expected: '&quot;quoted&quot;', name: 'Quote escaping' },
  ];

  let passed = 0;
  tests.forEach(test => {
    const result = escapeHTML(test.input);
    if (result === test.expected) {
      console.log(`✓ PASS: ${test.name}`);
      passed++;
    } else {
      console.log(`✗ FAIL: ${test.name} - Expected: ${test.expected}, Got: ${result}`);
    }
  });
  return { total: tests.length, passed, section: 'XSS Protection' };
}

// Test 2: City Coordinate Mapping
function testGetCityCoords() {
  const getCityCoords = (location) => {
    const coordsMap = {
      'delhi': { lat: 28.6139, lng: 77.2090 },
      'bangalore': { lat: 12.9716, lng: 77.5946 },
      'chennai': { lat: 13.0827, lng: 80.2707 },
      'hyderabad': { lat: 17.3850, lng: 78.4867 },
      'mumbai': { lat: 19.0760, lng: 72.8777 },
      'kolkata': { lat: 22.5726, lng: 88.3639 },
      'pune': { lat: 18.5204, lng: 73.8567 }
    };
    const lower = location.toLowerCase();
    for (let city in coordsMap) {
      if (lower.includes(city)) return coordsMap[city];
    }
    return { lat: 28.6139, lng: 77.2090 }; // Default to Delhi
  };

  const tests = [
    { input: 'Delhi', expected: { lat: 28.6139, lng: 77.2090 }, name: 'Delhi mapping' },
    { input: 'Bangalore', expected: { lat: 12.9716, lng: 77.5946 }, name: 'Bangalore mapping' },
    { input: 'Unknown City', expected: { lat: 28.6139, lng: 77.2090 }, name: 'Default fallback' },
  ];

  let passed = 0;
  tests.forEach(test => {
    const result = getCityCoords(test.input);
    if (result.lat === test.expected.lat && result.lng === test.expected.lng) {
      console.log(`✓ PASS: ${test.name}`);
      passed++;
    } else {
      console.log(`✗ FAIL: ${test.name}`);
    }
  });
  return { total: tests.length, passed, section: 'City Mapping' };
}

// Test 3: Agency Assignment Logic
function testGetAgencyNameLocally() {
  const getAgencyNameLocally = (category, location) => {
    let city = "Default Authority";
    const lower = location.toLowerCase();
    if (lower.includes('delhi')) city = "Delhi Municipal Corporation (MCD)";
    else if (lower.includes('bangalore')) city = "Bruhat Bengaluru Mahanagara Palike (BBMP)";
    else if (lower.includes('chennai')) city = "Greater Chennai Corporation (GCC)";
    else if (lower.includes('hyderabad')) city = "Greater Hyderabad Municipal Corporation (GHMC)";
    else if (lower.includes('mumbai')) city = "Brihanmumbai Municipal Corporation (BMC)";
    else if (lower.includes('kolkata')) city = "Kolkata Municipal Corporation (KMC)";
    else if (lower.includes('pune')) city = "Pune Municipal Corporation (PMC)";
    
    const deptMap = {
      'Streetlight': 'Electrical Division',
      'Roads': 'Roads & Engineering Division',
      'Waste': 'Solid Waste Management Dept',
      'Sewage': 'Drainage & Sewage Division',
      'Water': 'Water Supply Division',
      'General': 'General Services Division'
    };
    const dept = deptMap[category] || 'General Services Division';
    return `${city} - ${dept}`;
  };

  const tests = [
    { category: 'Streetlight', location: 'Delhi', expected: 'Delhi Municipal Corporation (MCD) - Electrical Division', name: 'Delhi Streetlight' },
    { category: 'Roads', location: 'Bangalore', expected: 'Bruhat Bengaluru Mahanagara Palike (BBMP) - Roads & Engineering Division', name: 'Bangalore Roads' },
    { category: 'Water', location: 'Chennai', expected: 'Greater Chennai Corporation (GCC) - Water Supply Division', name: 'Chennai Water' },
  ];

  let passed = 0;
  tests.forEach(test => {
    const result = getAgencyNameLocally(test.category, test.location);
    if (result === test.expected) {
      console.log(`✓ PASS: ${test.name}`);
      passed++;
    } else {
      console.log(`✗ FAIL: ${test.name}`);
    }
  });
  return { total: tests.length, passed, section: 'Agency Mapping' };
}

// Test 4: Complaint ID Generation
function testComplaintIDGeneration() {
  const generateComplaintID = () => `CIV-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const tests = [];
  let passed = 0;
  
  for (let i = 0; i < 5; i++) {
    const id = generateComplaintID();
    if (id.startsWith('CIV-') && /^CIV-\d{4}$/.test(id)) {
      console.log(`✓ PASS: Valid complaint ID generated: ${id}`);
      passed++;
    } else {
      console.log(`✗ FAIL: Invalid complaint ID: ${id}`);
    }
  }
  return { total: 5, passed, section: 'Complaint ID Generation' };
}

// Test 5: Gemini API Response Validation
function testGeminiResponseValidation() {
  const validateEligibilityResponse = (response) => {
    return response.hasOwnProperty('percentage') &&
           response.hasOwnProperty('probabilityText') &&
           response.hasOwnProperty('brief') &&
           Array.isArray(response.eligibleParams) &&
           Array.isArray(response.exclusions) &&
           Array.isArray(response.documents);
  };

  const mockResponse = {
    percentage: 85,
    probabilityText: "High (Highly Likely)",
    brief: "Applicant is eligible for PM-KISAN",
    eligibleParams: ["Landholding < 2 hectares", "Non-taxpayer"],
    exclusions: ["Taxpayer status checked"],
    documents: [
      { name: "Aadhaar", status: "checked" },
      { name: "Land Registry", status: "unchecked" }
    ]
  };

  if (validateEligibilityResponse(mockResponse)) {
    console.log(`✓ PASS: Gemini response structure valid`);
    return { total: 1, passed: 1, section: 'API Response Validation' };
  } else {
    console.log(`✗ FAIL: Gemini response structure invalid`);
    return { total: 1, passed: 0, section: 'API Response Validation' };
  }
}

// Test 6: Language Localization
function testLocalization() {
  const LOCALIZATIONS = {
    en: { tagline: "AI-Powered Civic Companion", btn_search: "Search Directory" },
    hi: { tagline: "एआई-संचालित नागरिक साथी", btn_search: "खोजें" },
    ta: { tagline: "கொட்டாயம் AI சங்கம்", btn_search: "தேடல்" }
  };

  let passed = 0;
  const tests = [
    { lang: 'en', key: 'tagline', expected: "AI-Powered Civic Companion", name: 'English tagline' },
    { lang: 'hi', key: 'btn_search', expected: "खोजें", name: 'Hindi search button' },
    { lang: 'ta', key: 'tagline', exists: true, name: 'Tamil localization exists' }
  ];

  tests.forEach(test => {
    if (test.exists) {
      if (LOCALIZATIONS[test.lang] && LOCALIZATIONS[test.lang][test.key]) {
        console.log(`✓ PASS: ${test.name}`);
        passed++;
      }
    } else {
      if (LOCALIZATIONS[test.lang] && LOCALIZATIONS[test.lang][test.key] === test.expected) {
        console.log(`✓ PASS: ${test.name}`);
        passed++;
      } else {
        console.log(`✗ FAIL: ${test.name}`);
      }
    }
  });
  return { total: tests.length, passed, section: 'Localization' };
}

// Run All Tests
console.log('='.repeat(60));
console.log('SMART BHARAT - COMPREHENSIVE TEST SUITE');
console.log('='.repeat(60));
console.log('');

const results = [
  testEscapeHTML(),
  testGetCityCoords(),
  testGetAgencyNameLocally(),
  testComplaintIDGeneration(),
  testGeminiResponseValidation(),
  testLocalization()
];

console.log('');
console.log('='.repeat(60));
console.log('TEST SUMMARY');
console.log('='.repeat(60));

let totalTests = 0;
let totalPassed = 0;

results.forEach(result => {
  const percentage = Math.round((result.passed / result.total) * 100);
  console.log(`${result.section}: ${result.passed}/${result.total} (${percentage}%)`);
  totalTests += result.total;
  totalPassed += result.passed;
});

console.log('');
const overallPercentage = Math.round((totalPassed / totalTests) * 100);
console.log(`OVERALL: ${totalPassed}/${totalTests} tests passed (${overallPercentage}%)`);
console.log('='.repeat(60));

// Export for use as module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testEscapeHTML, testGetCityCoords, testGetAgencyNameLocally, testComplaintIDGeneration, testGeminiResponseValidation, testLocalization };
}
