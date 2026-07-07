# Smart Bharat - Code Quality & Standards Guide

## Overview
This document defines coding standards, best practices, and guidelines for maintaining high code quality across the Smart Bharat application.

## Code Quality Metrics
- **Target Code Quality Score:** 85+/100
- **Target Test Coverage:** 80%+
- **Target Performance:** < 2s page load, < 500ms API response
- **Security:** Zero OWASP Top 10 vulnerabilities

---

## 1. JavaScript Code Standards

### 1.1 Variable Naming Conventions
```javascript
// ✅ GOOD - camelCase for variables and functions
const userAge = 25;
const getUserData = () => {};
const isEligible = true;

// ❌ BAD - snake_case or unclear names
const user_age = 25;
const get_user_data = () => {};
const x = true;
```

### 1.2 Function Documentation (JSDoc)
```javascript
/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} str - The input string to escape
 * @returns {string} - HTML-escaped string
 * @example
 * escapeHTML('<script>alert("xss")</script>')
 * // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 */
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[tag] || tag));
}
```

### 1.3 Error Handling
```javascript
// ✅ GOOD - Explicit error handling
try {
  const response = await fetch('/api/gemini', { method: 'POST', body: JSON.stringify(payload) });
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return await response.json();
} catch (error) {
  console.error('Gemini API call failed:', error);
  showToast('Service unavailable. Please try again later.', true);
  return null;
}

// ❌ BAD - Silent failures
fetch('/api/gemini').then(r => r.json()).then(data => processData(data));
```

### 1.4 Async/Await Best Practices
```javascript
// ✅ GOOD - Modern async/await with error handling
async function submitComplaint(data) {
  try {
    const response = await callGeminiAPI('analyze_complaint', data);
    if (response) {
      addGrievance(response);
      return true;
    }
  } catch (error) {
    console.error('Complaint submission failed:', error);
    showToast('Failed to submit complaint', true);
    return false;
  }
}

// ❌ BAD - Promise chains with poor error handling
submitComplaint = (data) => {
  callGeminiAPI('analyze_complaint', data)
    .then(response => addGrievance(response))
    .then(() => showToast('Success'))
    .catch(err => console.log(err));
}
```

---

## 2. Security Best Practices

### 2.1 XSS Prevention
- **Always** escape user input before DOM injection
- Use `escapeHTML()` utility for all user-generated content
- Avoid `innerHTML` when possible; prefer `textContent` or `appendChild()`

```javascript
// ✅ GOOD - Safe DOM update
const titleElement = document.createElement('h1');
titleElement.textContent = userInput; // Safe - text only
document.body.appendChild(titleElement);

// ❌ BAD - XSS vulnerability
document.body.innerHTML += `<h1>${userInput}</h1>`; // Dangerous!
```

### 2.2 Sensitive Data Protection
- **Never** store API keys in client-side code
- Use serverless function relay (`/api/gemini.js`) for all sensitive operations
- Store sensitive data in Vercel environment variables only

```javascript
// ✅ GOOD - Relay through serverless function
const response = await fetch('/api/gemini', {
  method: 'POST',
  body: JSON.stringify({ action: 'analyze_complaint', transcript })
});

// ❌ BAD - Exposing API key
const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {...});
```

### 2.3 Input Validation
```javascript
// ✅ GOOD - Explicit validation
function validateComplaintForm(text, location, category) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('Complaint text required');
  }
  if (!location || typeof location !== 'string' || location.trim().length === 0) {
    throw new Error('Location required');
  }
  if (!category || typeof category !== 'string') {
    throw new Error('Valid category required');
  }
  return true;
}

// ❌ BAD - No validation
function submitForm(text, location) {
  addComplaint(text, location);
}
```

---

## 3. Performance Optimization Guidelines

### 3.1 DOM Query Optimization
```javascript
// ✅ GOOD - Cache DOM query results
const complaintList = document.getElementById('grievances-directory');
complaintList.addEventListener('click', (e) => {
  if (e.target.matches('.complaint-item')) {
    selectComplaint(e.target.id);
  }
});

// ❌ BAD - Repeated DOM queries in loops
for (let i = 0; i < complaints.length; i++) {
  document.getElementById('grievances-directory').appendChild(createComplaintElement(complaints[i]));
}
```

### 3.2 Debouncing User Input
```javascript
// ✅ GOOD - Debounced search
const searchInput = document.getElementById('search-box');
const debouncedSearch = debounce((query) => {
  filterSchemes(query);
}, 300);
searchInput.addEventListener('input', (e) => debouncedSearch(e.target.value));

// ❌ BAD - Search fires on every keystroke
searchInput.addEventListener('input', (e) => filterSchemes(e.target.value));
```

### 3.3 API Response Caching
```javascript
// ✅ GOOD - Cache identical requests
const requestCache = new Map();
async function getEligibilityScore(scheme, age, income) {
  const cacheKey = `${scheme}-${age}-${income}`;
  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey);
  }
  
  const result = await callGeminiAPI('evaluate_scheme', { scheme, age, income });
  requestCache.set(cacheKey, result);
  return result;
}
```

---

## 4. Code Maintainability

### 4.1 Function Size & Complexity
- **Maximum function length:** 50 lines of code (excluding comments)
- **Maximum nesting depth:** 3 levels
- **Maximum cyclomatic complexity:** 10

```javascript
// ✅ GOOD - Simple, focused function
function processComplaint(text, location) {
  const agency = getAgencyNameLocally(detectCategory(text), location);
  const geocode = generateGeocodeID();
  return { text, location, agency, geocode };
}

// ❌ BAD - Too long and complex
function processComplaint(text, location, lang, theme, user, ...) {
  // 100+ lines of mixed logic
  // Multiple responsibilities
  // Deeply nested conditions
}
```

### 4.2 Code Comments
```javascript
// ✅ GOOD - Comments explain WHY, not WHAT
// Cache coordinates to avoid repeated object creation for common cities
const coordinateCache = {};

// Debounce search input to prevent excessive API calls during typing
const debouncedSearch = debounce(search, 300);

// ❌ BAD - Comments state the obvious
// Set age to 25
const age = 25;

// Call the function
submitForm();
```

### 4.3 DRY Principle (Don't Repeat Yourself)
```javascript
// ✅ GOOD - Reusable utility function
function showNotification(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Use everywhere
showNotification('Complaint submitted', 'success');
showNotification('Error occurred', 'error');

// ❌ BAD - Repeated notification code
document.body.innerHTML += `<div class="toast">${msg}</div>`;
setTimeout(() => {...}, 3000);
// ... repeated 10 times in codebase
```

---

## 5. Testing Standards

### 5.1 Test File Structure
```javascript
// test.js - Test suite template
function testFeatureName() {
  const tests = [
    { input: value1, expected: result1, name: 'Test case 1' },
    { input: value2, expected: result2, name: 'Test case 2' }
  ];
  
  let passed = 0;
  tests.forEach(test => {
    if (evaluate(test.input) === test.expected) {
      console.log(`✓ PASS: ${test.name}`);
      passed++;
    } else {
      console.log(`✗ FAIL: ${test.name}`);
    }
  });
  
  return { total: tests.length, passed, section: 'Feature Name' };
}
```

### 5.2 Coverage Requirements
- **Critical functions:** 100% coverage (API calls, security, state management)
- **Utility functions:** 80% coverage
- **UI components:** 50% coverage (interaction testing via manual QA)

---

## 6. Accessibility Standards (WCAG 2.1 AA)

### 6.1 Semantic HTML
```html
<!-- ✅ GOOD - Semantic elements -->
<nav>
  <ul class="nav-tabs">
    <li><a href="#services">Services</a></li>
    <li><a href="#complaints">Complaints</a></li>
  </ul>
</nav>
<main role="main">
  <section id="services" aria-label="Government Services">
    <article>...</article>
  </section>
</main>

<!-- ❌ BAD - Non-semantic divs -->
<div class="nav">
  <div class="nav-item"><div>Services</div></div>
</div>
<div class="content">...</div>
```

### 6.2 ARIA Labels
```html
<!-- ✅ GOOD - Clear ARIA labels -->
<button id="submit-complaint" aria-label="Submit text complaint to local agency">
  Submit Complaint
</button>

<div role="alert" aria-live="polite" class="toast">
  Complaint submitted successfully
</div>

<!-- ❌ BAD - Missing accessibility info -->
<button id="btn">Submit</button>
<div>Complaint submitted</div>
```

---

## 7. Performance Checklist

- [ ] Page load time < 2 seconds on 4G
- [ ] API response time < 500ms
- [ ] Lighthouse score > 85
- [ ] Zero console errors
- [ ] No memory leaks (check DevTools)
- [ ] Smooth animations (60 FPS)
- [ ] Optimized images and assets
- [ ] Minified CSS and JS in production

---

## 8. Security Checklist

- [ ] No hardcoded API keys
- [ ] XSS protection (HTML escaping)
- [ ] CSRF tokens on state-changing operations
- [ ] Content Security Policy headers
- [ ] HTTPS only in production
- [ ] Input validation on all forms
- [ ] Secure API routing through serverless function
- [ ] No sensitive data in localStorage

---

## 9. Git Workflow Standards

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** feat, fix, docs, style, refactor, perf, test, chore  
**Example:**
```
feat(complaints): add text-based complaint submission form
refactor(map): optimize leaflet initialization performance
fix(api): handle missing Gemini API key gracefully
```

---

## 10. Code Review Checklist

Before merging PRs:
- [ ] Code follows naming conventions
- [ ] Functions have JSDoc comments
- [ ] XSS vulnerabilities checked
- [ ] Tests added/updated
- [ ] Performance implications reviewed
- [ ] Accessibility verified
- [ ] Security best practices followed
- [ ] No console errors

---

**Last Updated:** 2026-07-07  
**Version:** 1.0
