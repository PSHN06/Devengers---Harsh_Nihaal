/**
 * Smart Bharat Architecture & Module Structure
 * Refactored for maintainability, testability, and code quality
 * 
 * @module SmartBharatArchitecture
 * @description Defines modular architecture for Smart Bharat application
 */

/**
 * ============================================================================
 * MODULE 1: STATE MANAGEMENT
 * ============================================================================
 * Centralized state container with getters and setters for data consistency
 */

class AppStateManager {
  constructor() {
    this.state = {
      currentLanguage: 'en',
      activeTab: 'guide',
      activeView: 'home-view',
      activeDirectoryTab: 'services',
      activeServiceId: 'pm-kisan',
      searchQuery: '',
      activeCategory: 'all',
      leafletMap: null,
      leafletMarker: null,
      services: [],
      grievances: [],
      uiTheme: localStorage.getItem('smartbharat-theme') || 'dark'
    };
  }

  /**
   * Get current state value
   * @param {string} key - State property key
   * @returns {any} - Current state value
   */
  get(key) {
    return this.state[key];
  }

  /**
   * Set state value with validation
   * @param {string} key - State property key
   * @param {any} value - New value
   * @returns {boolean} - Success status
   */
  set(key, value) {
    if (key in this.state) {
      this.state[key] = value;
      this.persistState(key, value);
      return true;
    }
    console.warn(`State key "${key}" does not exist`);
    return false;
  }

  /**
   * Persist state to localStorage for recovery
   * @param {string} key - State property
   * @param {any} value - Value to persist
   */
  persistState(key, value) {
    try {
      localStorage.setItem(`smartbharat-${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('localStorage unavailable:', e);
    }
  }

  /**
   * Reset entire state to defaults
   */
  reset() {
    const keysToReset = ['activeTab', 'activeView', 'searchQuery', 'activeCategory'];
    keysToReset.forEach(key => this.set(key, ''));
  }
}

/**
 * ============================================================================
 * MODULE 2: API GATEWAY (Gemini Integration)
 * ============================================================================
 * Centralized API communication layer with retry logic and error handling
 */

class GeminiAPIGateway {
  constructor(options = {}) {
    this.baseUrl = '/api/gemini';
    this.timeout = options.timeout || 10000;
    this.retryAttempts = options.retryAttempts || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.responseCache = new Map();
  }

  /**
   * Make API call with retry logic and caching
   * @param {string} action - API action type
   * @param {Object} payload - Request payload
   * @returns {Promise<Object>} - API response
   */
  async call(action, payload) {
    const cacheKey = `${action}-${JSON.stringify(payload)}`;
    
    // Check cache
    if (this.responseCache.has(cacheKey)) {
      console.log(`[API CACHE HIT] ${action}`);
      return this.responseCache.get(cacheKey);
    }

    let lastError;
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await this.fetchWithTimeout(
          this.baseUrl,
          { action, ...payload },
          this.timeout
        );

        // Cache successful response
        this.responseCache.set(cacheKey, response);
        return response;
      } catch (error) {
        lastError = error;
        if (attempt < this.retryAttempts) {
          console.warn(`[API RETRY ${attempt}/${this.retryAttempts}] ${action}`);
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    throw new Error(`API call failed after ${this.retryAttempts} attempts: ${lastError.message}`);
  }

  /**
   * Fetch with timeout protection
   * @param {string} url - Endpoint URL
   * @param {Object} body - Request body
   * @param {number} timeout - Timeout in ms
   * @returns {Promise<Object>} - Response JSON
   */
  async fetchWithTimeout(url, body, timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Helper: Promise delay
   * @param {number} ms - Milliseconds
   * @returns {Promise} - Resolves after delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clear response cache
   */
  clearCache() {
    this.responseCache.clear();
  }
}

/**
 * ============================================================================
 * MODULE 3: UTILITIES & HELPERS
 * ============================================================================
 * Pure utility functions with no side effects
 */

/**
 * Security: Escape HTML entities to prevent XSS
 * @param {string} str - Input string
 * @returns {string} - Escaped string
 */
function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

/**
 * Utility: Get city coordinates from location string
 * @param {string} location - Location name
 * @returns {Object} - { lat, lng } coordinates
 */
function getCityCoords(location) {
  const coordsMap = {
    'delhi': { lat: 28.6139, lng: 77.2090 },
    'bangalore': { lat: 12.9716, lng: 77.5946 },
    'chennai': { lat: 13.0827, lng: 80.2707 },
    'hyderabad': { lat: 17.3850, lng: 78.4867 },
    'mumbai': { lat: 19.0760, lng: 72.8777 },
    'kolkata': { lat: 22.5726, lng: 88.3639 },
    'pune': { lat: 18.5204, lng: 73.8567 }
  };

  const lower = (location || '').toLowerCase();
  for (const [city, coords] of Object.entries(coordsMap)) {
    if (lower.includes(city)) return coords;
  }
  return { lat: 28.6139, lng: 77.2090 }; // Default: Delhi
}

/**
 * Utility: Map category and location to government agency
 * @param {string} category - Complaint category
 * @param {string} location - Location name
 * @returns {string} - Agency name with department
 */
function getAgencyNameLocally(category, location) {
  const cityMap = {
    'delhi': 'Delhi Municipal Corporation (MCD)',
    'bangalore': 'Bruhat Bengaluru Mahanagara Palike (BBMP)',
    'chennai': 'Greater Chennai Corporation (GCC)',
    'hyderabad': 'Greater Hyderabad Municipal Corporation (GHMC)',
    'mumbai': 'Brihanmumbai Municipal Corporation (BMC)',
    'kolkata': 'Kolkata Municipal Corporation (KMC)',
    'pune': 'Pune Municipal Corporation (PMC)'
  };

  const deptMap = {
    'Streetlight': 'Electrical Division',
    'Roads': 'Roads & Engineering Division',
    'Waste': 'Solid Waste Management Dept',
    'Sewage': 'Drainage & Sewage Division',
    'Water': 'Water Supply Division',
    'General': 'General Services Division'
  };

  const lower = (location || '').toLowerCase();
  let city = 'Default Authority';
  for (const [key, val] of Object.entries(cityMap)) {
    if (lower.includes(key)) {
      city = val;
      break;
    }
  }

  const dept = deptMap[category] || deptMap['General'];
  return `${city} - ${dept}`;
}

/**
 * ============================================================================
 * MODULE 4: UI COMPONENTS
 * ============================================================================
 * Reusable UI component factory functions
 */

/**
 * Toast notification component
 * @param {string} message - Notification message
 * @param {boolean} isError - Error flag (default: false)
 * @param {number} duration - Display duration in ms (default: 3000)
 */
function showToast(message, isError = false, duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast ${isError ? 'toast-error' : 'toast-success'}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = escapeHTML(message);

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * ============================================================================
 * MODULE 5: VALIDATION LAYER
 * ============================================================================
 * Input validation and data sanitization
 */

/**
 * Validate complaint form inputs
 * @param {string} text - Complaint description
 * @param {string} location - Location
 * @param {string} category - Category
 * @returns {Object} - { isValid, errors[] }
 */
function validateComplaintForm(text, location, category) {
  const errors = [];

  if (!text || typeof text !== 'string' || text.trim().length < 10) {
    errors.push('Complaint description must be at least 10 characters');
  }

  if (!location || typeof location !== 'string' || location.trim().length < 2) {
    errors.push('Valid location required');
  }

  if (!category || typeof category !== 'string') {
    errors.push('Valid category required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate Gemini API response structure
 * @param {Object} response - API response
 * @param {string} expectedAction - Expected action type
 * @returns {boolean} - Validity status
 */
function validateAPIResponse(response, expectedAction) {
  if (!response || typeof response !== 'object') return false;

  const requiredFields = {
    'analyze_complaint': ['title', 'category', 'agency', 'geocode', 'lat', 'lng'],
    'evaluate_scheme': ['percentage', 'probabilityText', 'brief', 'documents'],
    'chat': ['text'],
    'translate_draft': ['translatedDraft']
  };

  const fields = requiredFields[expectedAction] || [];
  return fields.every(field => field in response);
}

/**
 * ============================================================================
 * EXPORTS (for modular use)
 * ============================================================================
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AppStateManager,
    GeminiAPIGateway,
    escapeHTML,
    getCityCoords,
    getAgencyNameLocally,
    showToast,
    validateComplaintForm,
    validateAPIResponse
  };
}

console.log('[SMART BHARAT] Modular architecture loaded successfully');
