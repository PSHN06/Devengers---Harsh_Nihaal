// Integration Tests for Smart Bharat
// Tests critical integration points between modules

/**
 * Integration Test 1: State Management + API Gateway
 */
function testStateManagementIntegration() {
  console.log('\n[INTEGRATION TEST] State Management + API Gateway');
  
  // Simulate state manager
  const stateManager = {
    state: { activeLanguage: 'en', grievances: [] },
    get: function(key) { return this.state[key]; },
    set: function(key, val) { this.state[key] = val; return true; }
  };

  // Test state updates
  const testsPassed = [];
  
  try {
    stateManager.set('activeLanguage', 'hi');
    if (stateManager.get('activeLanguage') === 'hi') {
      testsPassed.push('✓ Language state update works');
    }

    stateManager.set('grievances', [{ id: 'comp-1', title: 'Pothole' }]);
    if (stateManager.get('grievances').length === 1) {
      testsPassed.push('✓ Grievance state management works');
    }

    return { passed: testsPassed.length, total: 2, tests: testsPassed };
  } catch (e) {
    console.error('State integration test failed:', e);
    return { passed: 0, total: 2, tests: [] };
  }
}

/**
 * Integration Test 2: Validation + Form Submission
 */
function testValidationIntegration() {
  console.log('\n[INTEGRATION TEST] Form Validation + Submission');
  
  const validateForm = (text, location) => ({
    isValid: text && text.length > 10 && location && location.length > 2,
    errors: []
  });

  const testCases = [
    { text: 'Pothole on main street', location: 'Delhi', shouldPass: true },
    { text: 'Pot', location: 'Delhi', shouldPass: false },
    { text: 'Pothole', location: 'D', shouldPass: false }
  ];

  let passed = 0;
  const results = [];

  testCases.forEach((test, idx) => {
    const validation = validateForm(test.text, test.location);
    if (validation.isValid === test.shouldPass) {
      results.push(`✓ Test ${idx + 1}: Validation correct`);
      passed++;
    } else {
      results.push(`✗ Test ${idx + 1}: Validation failed`);
    }
  });

  return { passed, total: testCases.length, tests: results };
}

/**
 * Integration Test 3: API Response Validation
 */
function testAPIResponseIntegration() {
  console.log('\n[INTEGRATION TEST] API Response Validation');
  
  const validateResponse = (response, expectedType) => {
    const required = {
      'complaint': ['title', 'category', 'agency', 'geocode'],
      'eligibility': ['percentage', 'probabilityText'],
      'chat': ['text']
    };
    
    const fields = required[expectedType] || [];
    return fields.every(f => f in response);
  };

  const mockResponses = {
    validComplaint: { title: 'Pothole', category: 'Roads', agency: 'MCD', geocode: 'CP-001' },
    invalidComplaint: { title: 'Pothole' },
    validEligibility: { percentage: 85, probabilityText: 'High' },
    invalidEligibility: { percentage: 85 }
  };

  let passed = 0;
  const results = [];

  if (validateResponse(mockResponses.validComplaint, 'complaint')) {
    results.push('✓ Valid complaint response accepted');
    passed++;
  }
  if (!validateResponse(mockResponses.invalidComplaint, 'complaint')) {
    results.push('✓ Invalid complaint response rejected');
    passed++;
  }
  if (validateResponse(mockResponses.validEligibility, 'eligibility')) {
    results.push('✓ Valid eligibility response accepted');
    passed++;
  }
  if (!validateResponse(mockResponses.invalidEligibility, 'eligibility')) {
    results.push('✓ Invalid eligibility response rejected');
    passed++;
  }

  return { passed, total: 4, tests: results };
}

/**
 * Integration Test 4: Localization + UI Rendering
 */
function testLocalizationIntegration() {
  console.log('\n[INTEGRATION TEST] Localization + UI Rendering');

  const LOCALIZATIONS = {
    en: { tagline: 'AI-Powered', btn: 'Search' },
    hi: { tagline: 'एआई-संचालित', btn: 'खोजें' },
    ta: { tagline: 'AI-சார்ந்த', btn: 'தேடல்' }
  };

  const currentLanguage = 'en';
  const results = [];
  let passed = 0;

  // Test 1: Language exists
  if (currentLanguage in LOCALIZATIONS) {
    results.push('✓ Language pack loaded');
    passed++;
  }

  // Test 2: Required keys present
  const requiredKeys = ['tagline', 'btn'];
  if (requiredKeys.every(key => key in LOCALIZATIONS[currentLanguage])) {
    results.push('✓ All required strings present');
    passed++;
  }

  // Test 3: Multi-language support
  if (['en', 'hi', 'ta'].every(lang => lang in LOCALIZATIONS)) {
    results.push('✓ Multiple languages supported');
    passed++;
  }

  return { passed, total: 3, tests: results };
}

/**
 * Integration Test 5: Geographic Mapping + Agency Assignment
 */
function testGeoMappingIntegration() {
  console.log('\n[INTEGRATION TEST] Geographic Mapping + Agency Assignment');

  const getCityCoords = (location) => {
    const map = {
      'delhi': { lat: 28.6139, lng: 77.2090 },
      'bangalore': { lat: 12.9716, lng: 77.5946 }
    };
    return map[location.toLowerCase()] || { lat: 0, lng: 0 };
  };

  const getAgency = (location) => {
    const map = {
      'delhi': 'Delhi Municipal Corporation (MCD)',
      'bangalore': 'Bruhat Bengaluru Mahanagara Palike (BBMP)'
    };
    return map[location.toLowerCase()] || 'Default';
  };

  const results = [];
  let passed = 0;

  // Test Delhi mapping
  const delCoords = getCityCoords('delhi');
  if (delCoords.lat === 28.6139 && delCoords.lng === 77.2090) {
    results.push('✓ Delhi coordinates correct');
    passed++;
  }

  // Test agency assignment
  const mcd = getAgency('delhi');
  if (mcd === 'Delhi Municipal Corporation (MCD)') {
    results.push('✓ Delhi agency assigned correctly');
    passed++;
  }

  // Test fallback for unknown location
  const unknown = getAgency('unknown');
  if (unknown === 'Default') {
    results.push('✓ Fallback agency works');
    passed++;
  }

  return { passed, total: 3, tests: results };
}

/**
 * Integration Test 6: Error Handling + Recovery
 */
function testErrorHandlingIntegration() {
  console.log('\n[INTEGRATION TEST] Error Handling + Recovery');

  const safeAPICall = async (data) => {
    try {
      if (!data) throw new Error('No data provided');
      if (typeof data !== 'object') throw new Error('Invalid data type');
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const results = [];
  let passed = 0;

  // Test 1: Valid data
  const validResult = safeAPICall({ action: 'test' });
  if (validResult.success) {
    results.push('✓ Valid data processed');
    passed++;
  }

  // Test 2: No data error
  const noDataResult = safeAPICall(null);
  if (!noDataResult.success && noDataResult.error.includes('No data')) {
    results.push('✓ No data error caught');
    passed++;
  }

  // Test 3: Invalid type error
  const invalidResult = safeAPICall('string');
  if (!invalidResult.success && invalidResult.error.includes('Invalid')) {
    results.push('✓ Invalid type error caught');
    passed++;
  }

  return { passed, total: 3, tests: results };
}

/**
 * Run All Integration Tests
 */
function runIntegrationTests() {
  console.log('='.repeat(70));
  console.log('SMART BHARAT - INTEGRATION TEST SUITE');
  console.log('='.repeat(70));

  const testSuites = [
    testStateManagementIntegration(),
    testValidationIntegration(),
    testAPIResponseIntegration(),
    testLocalizationIntegration(),
    testGeoMappingIntegration(),
    testErrorHandlingIntegration()
  ];

  let totalPassed = 0;
  let totalTests = 0;

  testSuites.forEach((suite, idx) => {
    console.log(`\n[SUITE ${idx + 1}] Results: ${suite.passed}/${suite.total}`);
    suite.tests.forEach(test => console.log('  ' + test));
    totalPassed += suite.passed;
    totalTests += suite.total;
  });

  console.log('\n' + '='.repeat(70));
  const percentage = Math.round((totalPassed / totalTests) * 100);
  console.log(`OVERALL INTEGRATION TEST RESULTS: ${totalPassed}/${totalTests} (${percentage}%)`);
  console.log('='.repeat(70) + '\n');

  return { passed: totalPassed, total: totalTests, percentage };
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testStateManagementIntegration,
    testValidationIntegration,
    testAPIResponseIntegration,
    testLocalizationIntegration,
    testGeoMappingIntegration,
    testErrorHandlingIntegration,
    runIntegrationTests
  };
}

// Auto-run if called directly
if (typeof window === 'undefined') {
  runIntegrationTests();
}
