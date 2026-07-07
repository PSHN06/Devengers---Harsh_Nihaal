# SMART BHARAT - Master Development Prompt
## AI-Powered Civic Companion Web Application

**Last Updated:** 2026-07-07  
**Repository:** https://github.com/PSHN06/Devengers---Harsh_Nihaal.git  
**Primary Branch:** `main`

---

## ⚠️ CRITICAL INSTRUCTION
This document defines the **EXACT and COMPLETE** specification of the Smart Bharat application. Follow this prompt precisely to recreate the identical webpage on any system. Use this with an AI agent in your workspace editor to generate the same codebase.

---

## 1. PROJECT OVERVIEW

**Project Name:** Smart Bharat (Formerly JanVaani.ai)  
**Purpose:** AI-Powered Civic Companion for Indian Citizens - Access government services, track complaints, and get scheme recommendations  
**Target Users:** Indian citizens (low-literacy to tech-savvy)  
**Core Value Proposition:** Translate natural language civic issues into formal government complaints; provide scheme eligibility checks; guide citizens through administrative procedures

**Deployment Platform:** Vercel (serverless functions)  
**Live URL:** Deploy using Vercel for production access

---

## 2. WHAT IS INCLUDED IN THE WEBPAGE

### 2.1 Technology Stack
- **Frontend:** Vanilla HTML5, CSS3 (Tailwind CSS), JavaScript (no frameworks)
- **Backend API:** Google Gemini 3.5 Flash API via serverless function
- **Hosting:** Vercel serverless platform
- **Mapping:** Leaflet.js (interactive map library)
- **Icons:** Material Design Symbols
- **Version Control:** Git with GitHub

### 2.2 Core Features - WHAT MUST BE PRESENT

#### A. Multi-Language Support (7 Languages)
- English (en)
- Hindi (hi)
- Tamil (ta)
- Telugu (te)
- Marathi (mr)
- Bengali (bn)
- Kannada (kn)

Language selector in header. All UI text, notifications, and guidance must support all 7 languages through LOCALIZATIONS object in script.js.

#### B. Government Services Directory (7 Schemes)
1. **PM-KISAN** - Pradhan Mantri Kisan Samman Nidhi
   - Direct financial benefit ₹6,000/year for farmers
   - Landholding max 2 hectares
   - Document type: Aadhaar
   
2. **Ayushman Bharat (PM-JAY)** - PM Jan Arogya Yojana
   - Health protection coverage ₹5 Lakh/family/year
   - Target: Below-poverty-line families
   
3. **PM-Awas Yojana** - Housing scheme
   - Home construction benefit
   
4. **Aadhaar Services** - National ID verification
   - Identity authentication
   
5. **PAN Services** - Permanent Account Number
   - Tax identification
   
6. **Ration Card Services** - Food subsidy
   - Grain distribution
   
7. **PM-Ujjwala Yojana** - LPG scheme
   - Free cooking gas cylinders

**Each scheme MUST include:**
- Official scheme name and subtitle
- Category (agriculture, healthcare, housing, etc.)
- Responsible agency
- ETA for processing
- Geographic coordinates (lat/lng)
- Processing stage (1-5)
- Document requirements
- Resolution guidelines
- Eligibility criteria (age, income, landholding, occupation defaults)
- Draft letter template
- Step-by-step application process

#### C. Tab Structure for Each Service
Each service has 4 tabs (MUST be present):
1. **Guidelines** - Full scheme explanation, eligibility rules, document formats
2. **Eligibility Evaluator** - AI-powered assessment using Gemini API
   - Input: Age, Income, Landholding, Occupation, State
   - Output: Approval percentage, probability text, eligible parameters, exclusions list, required documents with verification status
3. **Document OCR Pre-Audit** - Step-by-step document validation guide
   - Explains spelling requirements, format rules, common mistakes
   - Lists corrections for each document type
4. **Agency Letter** - Display formal draft representation letter

#### D. Complaints/Grievances Tracking System
**Features that MUST be present:**

1. **Text-Based Complaint Submission Modal**
   - Button in "My Complaints" section: "Submit a Complaint"
   - Modal form with 3 fields:
     - Textarea for issue description
     - Text input for location
     - Dropdown for category (Streetlight, Roads, Waste, Sewage, Water, General, Auto-detect)
   - Form validation: Description and location required
   - Auto-category detection based on text keywords
   - Geocoding: Converts location name to latitude/longitude coordinates
   - Agency assignment: Maps category and location to local government body
   - Generates unique complaint ID
   - Creates formal administrative representation letter draft
   - Adds complaint to grievances list

2. **Grievances Directory Sidebar**
   - Lists all submitted complaints
   - Displays complaint ID, title, category, agency
   - Selectable to view details in main panel
   - Shows current processing stage

3. **Complaint Timeline View**
   - Interactive pipeline showing 5 stages:
     - Stage 1: Logged
     - Stage 2: Assigned
     - Stage 3: Verification
     - Stage 4: Action
     - Stage 5: Resolved
   - Visual progress indicator
   - Shows current stage status

4. **Leaflet Interactive Map**
   - Displays complaint location with marker
   - Shows latitude/longitude coordinates
   - Centered on complaint location
   - Marker shows agency name and complaint ID

5. **Complaint Details**
   - Unique geocode ID (format: CIV-XXXX or similar)
   - Category and assigned agency
   - ETA for resolution (typically 3-5 business days)
   - Full complaint transcript
   - Processing log
   - Formal letter draft for reference

#### E. Floating Chat Assistant Widget
- Bottom-right corner expandable chat window
- AI-powered civic guidance using Gemini API
- Conversation history maintained during session
- Supports chat queries about:
  - Government schemes
  - Civic procedures
  - Document requirements
  - Complaint status
  - Administrative guidance
- Response format: HTML bulletins with advisory styling
- Language support: Responds in user's selected language
- Graceful degradation if API unavailable

#### F. Search/Directory Interface
- Search bar accepts keywords like "PM-Kisan", "Ayushman", "Pothole", "Aadhaar"
- Returns matching services from directory
- Allows filtering by category (All, Agriculture, Healthcare, Housing, etc.)

#### G. Navigation Structure (4 Main Views)
1. **Home View** - Landing page with bento-grid of schemes overview
2. **Services View** - Full directory of 7 government schemes
3. **Complaints View** - Grievance tracking, list, map, timeline
4. **Resources View** - Additional guidance and documentation

#### H. Theme Toggle
- Dark/Light mode toggle in header
- Persistent theme preference (localStorage)
- Smooth transitions between themes

#### I. Notifications System
- Toast notifications for user feedback
- Appears at bottom of screen
- Auto-dismisses after 3-4 seconds
- Color-coded: Success (green), Error (red), Info (blue)
- Used for: Complaint submission confirmation, API responses, form validation errors

#### J. Security Headers (Vercel Configuration)
- Content-Security-Policy: Restricts script/style sources
- X-Frame-Options: DENY (prevents clickjacking)
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- X-XSS-Protection: 1; mode=block

#### K. Mapping System (City-Based Agency Assignment)
Local rule-based mapping for major Indian cities:
- Delhi → Delhi Municipal Corporation (MCD)
- Bangalore → Bruhat Bengaluru Mahanagara Palike (BBMP)
- Chennai → Greater Chennai Corporation (GCC)
- Hyderabad → Greater Hyderabad Municipal Corporation (GHMC)
- Mumbai → Brihanmumbai Municipal Corporation (BMC)
- Kolkata → Kolkata Municipal Corporation (KMC)
- Pune → Pune Municipal Corporation (PMC)

Department mapping:
- Streetlight → Electrical Division
- Roads → Roads & Engineering Division
- Waste → Solid Waste Management Dept
- Sewage → Drainage & Sewage Division
- Water → Water Supply Division
- General → General Services Division

#### L. XSS Protection
- All user inputs sanitized using `escapeHTML()` function
- HTML entities escaped: &, <, >, ', "
- Applied before DOM injection

---

## 3. WHAT IS NOT INCLUDED (EXPLICITLY DO NOT ADD)

### 3.1 Features to EXCLUDE
- ❌ Voice recording or speech-to-text functionality
- ❌ Backend database (no SQL, MongoDB, or persistent storage server)
- ❌ User authentication/login system
- ❌ File upload functionality
- ❌ Email sending capability
- ❌ SMS notifications
- ❌ Payment gateway integration
- ❌ Admin dashboard or user management panel
- ❌ Server-side session management
- ❌ WebSocket real-time updates
- ❌ Machine learning model training
- ❌ PDF generation or document download
- ❌ Multi-select or bulk operations on complaints
- ❌ Complaint editing after submission
- ❌ User profile or personal account pages
- ❌ Video tutorials or embedded media
- ❌ Analytics or usage tracking (beyond browser console)
- ❌ Offline mode or service workers
- ❌ Third-party integrations (Twitter, Facebook, WhatsApp APIs)

### 3.2 Deprecated/Removed Features
- ❌ Voice modal and voice recording button (removed as of commit 0eb05d9)
- ❌ Flask backend server (not required; Vercel serverless used instead)
- ❌ Any microphone access or audio processing

---

## 4. FILE STRUCTURE

```
Devengers-Devengers---Harsh_Nihaal/
├── index.html                 # Main HTML markup (~850 lines)
├── script.js                  # Core JavaScript logic (~2500 lines)
├── style.css                  # Tailwind CSS styling
├── vercel.json                # Vercel deployment config
├── README.md                  # Project documentation
├── MASTER_PROMPT.md           # This file
├── api/
│   └── gemini.js              # Serverless Gemini API relay (~150 lines)
└── .env (local only, not in repo)  # Environment variables for GEMINI_API_KEY
```

---

## 5. KEY JAVASCRIPT FUNCTIONS

### Global State Management
- `appState` object tracks:
  - `currentLanguage` (default: 'en')
  - `activeTab` ('guide', 'eligibility', 'preaudit', 'letter')
  - `activeView` ('home-view', 'services-view', 'complaints-view', 'resources-view')
  - `leafletMap`, `leafletMarker` (Leaflet.js instances)
  - `services[]` (7 government schemes)
  - `grievances[]` (submitted complaints)

### Critical Functions
1. `setupThemeToggle()` - Dark/Light mode toggle
2. `setupViewRouting()` - Handles view switching between home/services/complaints/resources
3. `switchView(viewId)` - Navigate to specific view
4. `selectService(serviceId)` - Select and display a scheme
5. `setupTextComplaintModal()` - Open/close complaint modal, validate and submit complaints
6. `submitComplaintFlow()` - Process text complaint through geocoding, agency assignment, grievance creation
7. `renderGrievancesDirectory()` - Display list of complaints
8. `initLeafletMap(lat, lng)` - Initialize map with coordinates
9. `setupFloatingChat()` - AI chat widget initialization
10. `callGeminiAPI(action, params)` - Call serverless Gemini API with proper action type
11. `getCityCoords(location)` - Convert city name to latitude/longitude
12. `getAgencyNameLocally(category, location)` - Map category and location to agency
13. `generateDraftLocally(category, location, transcript)` - Create formal complaint letter
14. `escapeHTML(str)` - XSS protection utility

### API Actions (via /api/gemini endpoint)
- `analyze_complaint` - Parse voice/text into structured grievance
- `chat` - Conversational AI assistance
- `evaluate_scheme` - Eligibility assessment for schemes
- `translate_draft` - Translate letters to other languages

---

## 6. GEMINI API INTEGRATION

### Serverless Endpoint: `/api/gemini.js`

**Accepts POST requests with:**
- `action`: 'analyze_complaint', 'chat', 'evaluate_scheme', 'translate_draft'
- `transcript` (for complaints)
- `location` (for complaints)
- `category` (for complaints)
- `language` (for responses)
- `scheme`, `age`, `income`, `land`, `occupation`, `state` (for scheme evaluation)
- `draft` (for translation)
- `history` (for chat conversation history)

**Returns JSON with structured response based on action:**
- Complaint: `{title, category, agency, eta, lat, lng, geocode, draft}`
- Chat: HTML bulletin formatted response
- Scheme: `{percentage, probabilityText, brief, eligibleParams, exclusions, documents[]}`
- Translation: `{translatedDraft}`

**Required Environment Variable:**
- `GEMINI_API_KEY` - Google Gemini API key (set in Vercel environment variables)

**Model Used:** `gemini-3.5-flash`

**Security:** API key never exposed to client; requests go through Vercel serverless function

---

## 7. LOCALIZATION DETAILS

### Supported Languages in LOCALIZATIONS Object
```javascript
const LOCALIZATIONS = {
  en: { /* English strings */ },
  hi: { /* हिन्दी strings */ },
  ta: { /* தமிழ் strings */ },
  te: { /* తెలుగు strings */ },
  mr: { /* मराठी strings */ },
  bn: { /* বাংলা strings */ },
  kn: { /* ಕನ್ನಡ strings */ }
}
```

### Key UI Strings to Localize
- `tagline` - Main heading tagline
- `btn_search` - Search button text
- `search_placeholder` - Search input placeholder
- `tab_guide` - Guidelines tab label
- `tab_eligibility` - Eligibility evaluator tab label
- `tab_preaudit` - Document OCR tab label
- `chat_input_placeholder` - Chat input box placeholder
- All notification messages
- All form labels and validation messages
- All button labels
- All view titles

### Language Switching
- Header contains language selector dropdown
- Clicking language changes `appState.currentLanguage`
- All text re-renders using `LOCALIZATIONS[appState.currentLanguage]`
- Gemini API responses are requested in current language
- LocalStorage persists language preference

---

## 8. VERCEL DEPLOYMENT STEPS

### Step 1: Prepare GitHub Repository
```bash
# Already done but verify:
git remote -v
# Output should show: https://github.com/PSHN06/Devengers---Harsh_Nihaal.git
```

### Step 2: Create Vercel Account
1. Go to https://vercel.com/signup
2. Sign up using GitHub account
3. Verify email

### Step 3: Connect GitHub Repository to Vercel
1. Login to Vercel dashboard (https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Select "GitHub" as source
4. Find and select repository: `Devengers---Harsh_Nihaal`
5. Click "Import"

### Step 4: Configure Environment Variables
1. On Import Project screen, expand "Environment Variables"
2. Add:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** [Your Google Gemini API key from https://aistudio.google.com/apikey]
3. Click "Deploy"

### Step 5: Verify Deployment
1. Wait 2-3 minutes for build to complete
2. Once done, Vercel assigns a .vercel.app domain
3. Click domain to visit deployed site
4. Test features:
   - Switch languages
   - Search schemes
   - Try eligibility calculator (requires GEMINI_API_KEY)
   - Test floating chat
   - Submit a text complaint
   - Verify map displays

### Step 6: Custom Domain (Optional)
1. In Vercel project settings
2. Go to "Domains"
3. Add your custom domain
4. Update DNS records per Vercel instructions

### Step 7: Monitor Deployments
- Every push to `main` branch triggers automatic redeployment
- View build logs and deployments in Vercel dashboard
- Set up preview deployments for pull requests

---

## 9. GIT WORKFLOW & BRANCH MANAGEMENT

### Current Setup
- **Primary Branch:** `main`
- **Repository:** https://github.com/PSHN06/Devengers---Harsh_Nihaal.git

### Development Workflow
```bash
# Fetch latest from remote
git fetch origin

# Check current branch
git branch -a

# Work on main branch (no separate dev/feature branches in current workflow)
git checkout main

# Make code changes
# Edit files in editor

# Commit changes
git add -A
git commit -m "Descriptive message of changes"

# Push to main
git push origin main
```

### Automatic Redeployment
- Any commit pushed to `main` triggers Vercel rebuild
- Site updates automatically within 2-3 minutes
- No manual deployment steps required after Vercel setup

---

## 10. LOCAL DEVELOPMENT SETUP

### Prerequisites
- Python 3.7+ (for http.server)
- Node.js (optional, for npm packages if needed)
- Git installed
- Text editor (VS Code recommended)
- Google Chrome or Firefox

### 1. Clone Repository
```bash
git clone https://github.com/PSHN06/Devengers---Harsh_Nihaal.git
cd Devengers---Harsh_Nihaal
```

### 2. Configure Environment
Create `.env` file in root directory (not tracked in git):
```
GEMINI_API_KEY=your_actual_api_key_here
```

Or set as environment variable in terminal:
```bash
# Windows PowerShell
$env:GEMINI_API_KEY='your_actual_api_key_here'

# Linux/Mac
export GEMINI_API_KEY='your_actual_api_key_here'
```

### 3. Start Local Server
```bash
# From project root directory
python -m http.server 8000

# Or with Python 2 (legacy)
python -m SimpleHTTPServer 8000
```

Server starts on http://localhost:8000

### 4. Access Application
Open browser and navigate to: `http://localhost:8000`

### 5. Test Features
- All static pages load (no API calls needed)
- AI features require valid GEMINI_API_KEY
- If API key not set, graceful degradation shows mock responses
- localStorage persists theme and language preferences across page reloads

### 6. Stop Server
Press `Ctrl+C` in terminal running http.server

---

## 11. COMMON ISSUES & SOLUTIONS

### Issue: Gemini API returns 500 error
**Cause:** Missing or invalid `GEMINI_API_KEY`  
**Solution:** 
1. Get key from https://aistudio.google.com/apikey
2. Set in .env file locally or Vercel environment variables in production
3. Restart server

### Issue: Map not displaying
**Cause:** Leaflet.js library not loaded or coordinates invalid  
**Solution:**
1. Check internet connection (CDN hosted)
2. Verify lat/lng are valid numbers
3. Ensure map container has proper height in CSS

### Issue: Notifications not showing
**Cause:** Toast function not called or CSS hidden  
**Solution:**
1. Check browser console for JS errors
2. Verify CSS for .toast selector exists
3. Ensure showToast() is called with message

### Issue: Styles look broken
**Cause:** Tailwind CSS not loading from CDN  
**Solution:**
1. Check internet connection
2. Verify CDN URL in index.html <link> tag
3. Check browser console for network errors

---

## 12. TESTING CHECKLIST (Before Deployment)

### Functional Tests
- [ ] All 7 government schemes load with correct data
- [ ] Each scheme displays all 4 tabs (Guidelines, Eligibility, Pre-Audit, Letter)
- [ ] Eligibility calculator works and calls Gemini API
- [ ] Chat widget opens, accepts input, returns responses
- [ ] Text complaint form validation works
- [ ] Complaint submission creates new grievance in list
- [ ] Map displays with submitted complaint coordinates
- [ ] Grievance timeline shows correct stage
- [ ] Language switcher changes all UI text
- [ ] Dark/Light theme toggle works
- [ ] Search bar filters schemes by keyword

### API Tests
- [ ] /api/gemini endpoint responds to POST requests
- [ ] analyze_complaint action returns valid JSON
- [ ] chat action returns HTML bulletin formatted response
- [ ] evaluate_scheme action calculates eligibility correctly
- [ ] translate_draft action translates letter to other languages

### Security Tests
- [ ] No API key exposed in client-side code
- [ ] XSS protection: HTML entities escaped in user input
- [ ] Form inputs sanitized before DOM injection
- [ ] Security headers present in response (check browser DevTools)

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest on Mac)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Android)

### Performance Tests
- [ ] Page loads within 2 seconds on 4G connection
- [ ] No console errors or warnings
- [ ] Leaflet map initializes within 500ms
- [ ] API responses complete within 3 seconds

---

## 13. SYSTEM ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                      USER BROWSER                           │
│  (index.html + script.js + style.css + Leaflet.js)         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/AJAX Requests
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   VERCEL SERVERLESS                         │
│  (Route: /api/gemini → /api/gemini.js)                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ POST /api/gemini (with action + params)            │   │
│  │ • Validates request                                │   │
│  │ • Authenticates GEMINI_API_KEY (env var)          │   │
│  │ • Routes to appropriate handler                   │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS
                     │
┌────────────────────▼────────────────────────────────────────┐
│                 GOOGLE GEMINI API                           │
│  (generativelanguage.googleapis.com)                        │
│  Model: gemini-3.5-flash                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 14. RESPONSIVE DESIGN NOTES

The webpage is mobile-first with responsive breakpoints:
- Mobile: < 768px (single column, stacked layout)
- Tablet: 768px - 1024px (2-column, adjusted spacing)
- Desktop: > 1024px (full multi-column, sidebar layout)

Key responsive elements:
- Header: Collapses language selector on mobile
- Navigation: Horizontal tabs transform to hamburger menu on small screens
- Services grid: 1 column → 2 columns → 3+ columns based on screen size
- Leaflet map: Full-width with dynamic sizing
- Chat widget: Positioned bottom-right, scales on mobile

---

## 15. PERFORMANCE OPTIMIZATION

Current optimizations in place:
- Vanilla JS (no framework overhead)
- CSS bundled (no separate stylesheet requests)
- Lazy Leaflet loading (loaded only when complaints view accessed)
- Debounced search input
- Efficient DOM queries using cached selectors
- Minimal re-renders during state changes
- CDN-hosted libraries (Tailwind, Material Symbols, Leaflet)

Potential future optimizations:
- Service Worker for offline mode (not currently implemented)
- Code splitting for API-heavy functions
- Image optimization/compression
- Caching strategy for Gemini API responses

---

## 16. ACCESSIBILITY NOTES

Current accessibility features:
- Semantic HTML elements (<nav>, <main>, <section>, <article>)
- ARIA labels on interactive elements
- Keyboard navigation support (Tab, Enter, Escape keys)
- High contrast dark/light themes
- Color not sole method of conveying information
- Form validation messages visible
- Material Design Symbols have text alternatives

---

## 17. FUTURE ENHANCEMENT IDEAS (NOT CURRENT)

These are suggestions for future development; **NOT currently implemented**:
- SMS notifications for complaint status updates
- Email verification flow
- Complaint status auto-update via scheduled API calls
- Integration with actual municipal APIs
- Complaint search by ID
- Export complaint details as PDF
- Mobile app (React Native or Flutter)
- Advanced analytics dashboard
- AI-powered complaint pattern detection
- Multi-factor authentication
- Complaint sharing on social media
- Push notifications
- Offline complaint drafting

---

## 18. SUMMARY FOR AI AGENT

To recreate this webpage from scratch:

1. **Create 5 files:** index.html, script.js, style.css, vercel.json, api/gemini.js
2. **Implement 7 government schemes** with complete guideline data, eligibility criteria, and draft templates
3. **Build 4 views:** Home, Services Directory, Complaints Tracker, Resources
4. **Add Gemini API integration** via serverless function for eligibility, chat, complaint analysis, translation
5. **Implement text complaint submission** with geocoding and agency assignment
6. **Add Leaflet.js map** for complaint location visualization
7. **Support 7 languages** through LOCALIZATIONS object
8. **Deploy on Vercel** with GEMINI_API_KEY environment variable
9. **Ensure XSS protection** through HTML entity escaping
10. **Test all features** against checklist in Section 12

---

## 19. CONTACTS & REFERENCES

- **Repository:** https://github.com/PSHN06/Devengers---Harsh_Nihaal.git
- **Vercel Docs:** https://vercel.com/docs
- **Gemini API:** https://ai.google.dev/
- **Leaflet.js:** https://leafletjs.com/
- **Tailwind CSS:** https://tailwindcss.com/

---

**END OF MASTER PROMPT**

This document is the source of truth for Smart Bharat development. Any changes to the application should update this prompt to maintain accuracy.
