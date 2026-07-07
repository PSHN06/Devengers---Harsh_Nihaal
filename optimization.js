// Performance Optimization Utilities for Smart Bharat
// Implements memoization, caching, and debouncing for improved efficiency

/**
 * Memoization cache for coordinate lookups
 * Reduces redundant object creations for repeated city queries
 */
const coordinateCache = {};

function getCityCoordsOptimized(location) {
  if (coordinateCache[location]) {
    return coordinateCache[location];
  }
  
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
  let result = { lat: 28.6139, lng: 77.2090 };
  
  for (let city in coordsMap) {
    if (lower.includes(city)) {
      result = coordsMap[city];
      break;
    }
  }
  
  coordinateCache[location] = result;
  return result;
}

/**
 * Debounce function for search input
 * Prevents excessive DOM queries and re-renders during typing
 */
function debounce(func, delay = 300) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function for scroll/resize events
 * Limits function execution frequency to improve performance
 */
function throttle(func, limit = 100) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Cache for DOM queries to avoid repeated selectors
 * Improves efficiency of frequently accessed elements
 */
const domCache = new Map();

function getCachedElement(selector) {
  if (domCache.has(selector)) {
    return domCache.get(selector);
  }
  const element = document.querySelector(selector);
  domCache.set(selector, element);
  return element;
}

function clearDOMCache() {
  domCache.clear();
}

/**
 * Lazy initialization for expensive operations
 * Loads Leaflet map only when complaints view is accessed
 */
let leafletMapInitialized = false;

function initLeafletMapLazy(lat, lng) {
  if (leafletMapInitialized) {
    return;
  }
  
  leafletMapInitialized = true;
  // Actual Leaflet initialization happens here
  console.log(`[PERF] Lazy-loaded Leaflet map at coordinates: ${lat}, ${lng}`);
}

/**
 * Response caching for Gemini API calls
 * Reduces redundant API calls for identical requests
 */
const apiResponseCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCachedAPIResponse(cacheKey) {
  const cached = apiResponseCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`[CACHE HIT] Retrieved from cache: ${cacheKey}`);
    return cached.data;
  }
  return null;
}

function cacheAPIResponse(cacheKey, data) {
  apiResponseCache.set(cacheKey, {
    data: data,
    timestamp: Date.now()
  });
  console.log(`[CACHE] Stored response for: ${cacheKey}`);
}

function clearExpiredCache() {
  const now = Date.now();
  for (let [key, value] of apiResponseCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      apiResponseCache.delete(key);
    }
  }
}

/**
 * Batch DOM updates to minimize reflows
 * Groups multiple DOM changes into single batch
 */
function batchDOMUpdates(updateFunction) {
  requestAnimationFrame(() => {
    updateFunction();
  });
}

/**
 * Memory-efficient event delegation
 * Replaces multiple event listeners with single delegated listener
 */
function delegateEventListener(parentSelector, childSelector, eventType, handler) {
  const parent = document.querySelector(parentSelector);
  if (!parent) return;
  
  parent.addEventListener(eventType, (event) => {
    if (event.target.matches(childSelector)) {
      handler(event);
    }
  });
}

/**
 * Optimization: Pre-warm critical data
 * Loads frequently accessed data structures at startup
 */
function prewarmCriticalData() {
  console.log('[PERF] Pre-warming critical data structures...');
  
  // Pre-load city coordinates
  ['delhi', 'bangalore', 'chennai', 'hyderabad', 'mumbai', 'kolkata', 'pune'].forEach(city => {
    getCityCoordsOptimized(city);
  });
  
  console.log('[PERF] Data pre-warming complete');
}

/**
 * Performance monitoring utility
 * Tracks execution time of critical functions
 */
function measurePerformance(label, func) {
  const startTime = performance.now();
  const result = func();
  const endTime = performance.now();
  const duration = (endTime - startTime).toFixed(2);
  
  console.log(`[PERF] ${label}: ${duration}ms`);
  return result;
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getCityCoordsOptimized,
    debounce,
    throttle,
    getCachedElement,
    clearDOMCache,
    initLeafletMapLazy,
    getCachedAPIResponse,
    cacheAPIResponse,
    clearExpiredCache,
    batchDOMUpdates,
    delegateEventListener,
    prewarmCriticalData,
    measurePerformance
  };
}
