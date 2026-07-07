// JanVaani.ai Application Logic - 100% complete vanilla JS + Tailwind CSS

// Localized UI text mappings (for instant UI language toggle)
const LOCALIZATIONS = {
  en: {
    tagline: "Smart Bharat Civic Companion",
    btn_search: "Search Directory",
    search_placeholder: "Search schemes & services (e.g. PM-Kisan, Ayushman Bharat, Pothole, Aadhaar update)...",
    tab_guide: "Service Guidelines",
    tab_eligibility: "Eligibility Evaluator",
    tab_preaudit: "Document OCR Pre-Audit",
    tab_timeline: "Progress Tracker",
    chat_input_placeholder: "Ask about schemes..."
  },
  hi: {
    tagline: "स्मार्ट भारत नागरिक साथी",
    btn_search: "खोजें",
    search_placeholder: "सेवाएं या शिकायतें खोजें (जैसे कि पीएम-किसान, आयुष्मान भारत, गड्ढा, आधार)...",
    tab_guide: "सेवा दिशानिर्देश",
    tab_eligibility: "पात्रता मूल्यांकन",
    tab_preaudit: "दस्तावेज़ ओसीआर जांच",
    tab_timeline: "प्रगति ट्रैकर",
    chat_input_placeholder: "योजनाओं के बारे में पूछें..."
  }
};

// Global App State Store
let appState = {
  currentLanguage: 'en',
  activeTab: 'guide',
  activeDirectoryTab: 'services', // can be 'services' or 'grievances'
  activeServiceId: 'pm-kisan',
  searchQuery: '',
  activeCategory: 'all',
  isRecording: false,
  recordingTimeout: null,
  
  // 1. Mapped Welfare Schemes & Services (Smart Hub Core Directory)
  services: [
    {
      id: "pm-kisan",
      name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      subtitle: "Direct financial benefit transfer scheme of ₹6,000 per year for cultivator families.",
      category: "agriculture",
      categoryDisplay: "Agriculture",
      agency: "Ministry of Agriculture & Farmers Welfare, Revenue Dept",
      eta: "Fund Dispersion pending Tahsildar Audit",
      geocode: "PMK-904",
      lat: "28.6139",
      lng: "77.2090",
      stage: 2,
      docType: "aadhaar",
      log: "Registry upload authenticated. Tahsildar verification node pending for land division survey.",
      formats: [
        "Applicant landholding must not exceed 2 hectares (5 acres) as verified in State Jamabandi records.",
        "Land registry (Khatauni/Khata) copy must show matching name spellings letter-for-letter.",
        "Bank account must be active, NPCI-mapped, and seeded with Aadhaar for Direct Benefit Transfer (DBT)."
      ],
      resolutions: [
        "<strong>Spelling Discrepancy:</strong> If names differ across Aadhaar and Land ledger, upload e-District self-declaration affidavit.",
        "<strong>Aadhaar Seeding:</strong> In case of DBT rejection code 'Aadhaar Not Seeded', visit local post office to open an IPPB account.",
        "<strong>Taxpayer Exclusion:</strong> Individuals who paid income tax in the last assessment year are automatically ineligible."
      ],
      steps: [
        { num: 1, title: "Land Ledger Matching", desc: "Verify registry survey numbers match the digital database records across state land portals." },
        { num: 2, title: "Patwari Verification", desc: "State revenue officer conducts on-site checks to validate physical possession and cultivation status." },
        { num: 3, title: "DBT Direct Dispatch", desc: "Central fund disbursed through direct clearing house to validated beneficiary bank accounts." }
      ],
      defaultAge: 45,
      defaultIncome: 120000,
      defaultLand: 2.2,
      defaultOccupation: "farmer",
      draft: `To,
The Welfare Administrator (PM-Kisan Cell),
Department of Agriculture & State Revenue.

Subject: Request for inclusion under PM-KISAN scheme benefits.

Dear Sir/Madam,
I am submitting my application parameters for enrollment under the Pradhan Mantri Kisan Samman Nidhi scheme. I possess agricultural landholdings of 2.2 acres, which complies with the 2-hectare ceiling. My Aadhaar credential is seeded with my active bank node for DBT transfers. 

I request your office to authorize the Patwari field audit and activate my beneficiary ID.

Sincerely,
Applicant Farmer`
    },
    {
      id: "ayushman-bharat",
      name: "Ayushman Bharat - PM Jan Arogya Yojana (PM-JAY)",
      subtitle: "National health protection scheme providing coverage of up to ₹5 Lakh per family per year.",
      category: "healthcare",
      categoryDisplay: "Healthcare",
      agency: "National Health Authority (NHA) / State Empanelled Centers",
      eta: "Card Issuance: 2-3 Business Days",
      geocode: "PMJ-281",
      lat: "13.0827",
      lng: "80.2707",
      stage: 1,
      docType: "ration",
      log: "Aadhaar e-KYC parameter match verified. Ration card seeding pending at state health center.",
      formats: [
        "Identification required via active Aadhaar Card or State Ration Card.",
        "Household details must be listed in the Socio-Economic Caste Census (SECC 2011) database.",
        "No family members must hold institutional employment."
      ],
      resolutions: [
        "<strong>Name Missing in SECC:</strong> If name is missing from SECC lists, check eligibility using active Ration Card (PHH/AAY categories).",
        "<strong>Card Activation:</strong> Visit nearest Government Hospital or Common Service Center (CSC) with Aadhaar for biometric check.",
        "<strong>Empanelled Status:</strong> Health card covers secondary/tertiary hospitalization exclusively at NHA empanelled public/private nodes."
      ],
      steps: [
        { num: 1, title: "SECC/NFSA Search", desc: "Identify household index number via registry nodes." },
        { num: 2, title: "Biometric e-KYC", desc: "Fingerprint verification at hospital reception desk." },
        { num: 3, title: "Golden Card Issuance", desc: "AI pre-checks complete, e-card generated." }
      ],
      defaultAge: 38,
      defaultIncome: 85000,
      defaultLand: 0,
      defaultOccupation: "laborer",
      draft: `To,
The District Health Officer,
State National Health Authority Cell.

Subject: Application check for Ayushman Bharat PM-JAY Golden Card.

Dear Sir/Madam,
I request verification of my family parameters for inclusion under the PM-JAY health coverage program. My household is registered under the low-income Daily Wage Laborer category with annual family income of ₹85,000. 

Please authorize the e-KYC biometric check to generate our family health e-card.

Sincerely,
Applicant Beneficiary`
    },
    {
      id: "aadhaar-card",
      name: "Aadhaar Card (UIDAI Updates)",
      subtitle: "Demographic name, mobile, address, and biometric updates on your primary identity card.",
      category: "identification",
      categoryDisplay: "Identification",
      agency: "Unique Identification Authority of India (UIDAI)",
      eta: "Verification Complete: Active",
      geocode: "UID-882",
      lat: "28.5921",
      lng: "77.0620",
      stage: 5,
      docType: "aadhaar",
      log: "Demographic updates verified via OTP check. Card reprint dispatched via Speed Post.",
      formats: [
        "Official proof of address (POA) scans must match UIDAI specifications exactly.",
        "Mobile number must be active to authorize validation OTP codes.",
        "Biometric changes require local Aadhaar Seva Kendra appointment verification."
      ],
      resolutions: [
        "<strong>Address Updates:</strong> Upload registered rent agreements, utility bills (less than 3 months old), or bank statements.",
        "<strong>Mobile Linkage:</strong> Mobile updates require active fingerprint iris scanning at physical kiosks. Online updates without mobile linkage are disabled.",
        "<strong>Spelling Corrections:</strong> Restrict update attempts. Maximum 2 spelling updates allowed per citizen card database record."
      ],
      steps: [
        { num: 1, title: "OTP Validation", desc: "Authorize demographic adjustments via registered mobile Node." },
        { num: 2, title: "Document Verifier", desc: "UIDAI registrar approves POA upload files." },
        { num: 3, title: "Database Sync", desc: "Update is pushed to live national ID registry." }
      ],
      defaultAge: 25,
      defaultIncome: 0,
      defaultLand: 0,
      defaultOccupation: "self-employed",
      draft: `To,
The Registrar Office (UIDAI Hub),
Regional Identity Center.

Subject: Application regarding correction of demographic address spelling.

Dear Sir/Madam,
I am submitting a request for correction of address spelling on my Aadhaar card record. My utility bills show the correct layout. 

I have authenticated the transaction via OTP verification. Kindly approve the change request.

Sincerely,
Citizen Applicant`
    },
    {
      id: "pan-card",
      name: "PAN Card (Income Tax Seeding)",
      subtitle: "Permanent Account Number updates and mandatory linkage with Aadhaar database.",
      category: "identification",
      categoryDisplay: "Identification",
      agency: "Income Tax Department of India / NSDL & UTITSL Nodes",
      eta: "Resolution: July 15, 2026",
      geocode: "PAN-331",
      lat: "12.9716",
      lng: "77.5946",
      stage: 3,
      docType: "pan",
      log: "Aadhaar linking request submitted to e-filing portal. Awaiting validation loop from UIDAI registry.",
      formats: [
        "Alphanumeric card must show clear signature and photograph.",
        "Applicant's Name, DOB, and Gender must match Aadhaar card database letter-for-letter.",
        "MIME format scans of documents must be clearly legible for OCR validation."
      ],
      resolutions: [
        "<strong>Linking Failures:</strong> Name discrepancy blocks linking. Submit a PAN correction form (Form 49A) first via NSDL portal.",
        "<strong>Lost PAN Card:</strong> Apply for reprint using original PAN number without editing basic details.",
        "<strong>Minor PAN:</strong> Requires guardian credentials and signature verification check."
      ],
      steps: [
        { num: 1, title: "Linkage Request", desc: "Submit matching parameters on e-filing portal." },
        { num: 2, title: "Fee Payment", desc: "Pay statutory penalty fee of ₹1,000 for delayed linkage." },
        { num: 3, title: "UIDAI Validation", desc: "Central database maps Aadhaar biometrics to PAN." }
      ],
      defaultAge: 30,
      defaultIncome: 350000,
      defaultLand: 0,
      defaultOccupation: "salaried",
      draft: `To,
The Assessing Officer (Income Tax Dept),
PAN Correction & Database Linking Cell.

Subject: Request regarding Aadhaar-PAN database linkage mapping.

Dear Sir/Madam,
I have initiated a database mapping request between my PAN card and Aadhaar card record. The required fees have been seeded on the portal. 

I request your department to complete the verification checks to prevent PAN status inactivation.

Sincerely,
Taxpayer Applicant`
    },
    {
      id: "ration-card",
      name: "National Ration Card (PDS Seeding)",
      subtitle: "PDS ration card registration and biometric member seeding under the National Food Security Act.",
      category: "welfare",
      categoryDisplay: "Welfare",
      agency: "State Food & Civil Supplies Department / PDS Fair Price Shop",
      eta: "Lodge Complete: Processing",
      geocode: "RAT-048",
      lat: "17.3850",
      lng: "78.4867",
      stage: 2,
      docType: "ration",
      log: "Family registry records submitted. Scheduled for local Food Inspector audit survey.",
      formats: [
        "Classified into PHH (Priority Households) or AAY (Antyodaya Anna Yojana) based on state income criteria.",
        "All family members' Aadhaar cards must be linked to prevent disbursement blocks.",
        "Active mobile number required for OTP verification at PDS POS devices."
      ],
      resolutions: [
        "<strong>Disbursement Denials:</strong> If grains are denied, verify biometric linkage online. FPS dealers must use POS override codes for seniors.",
        "<strong>Adding Family Members:</strong> Submit birth certificate or marriage declaration to Food Department portal.",
        "<strong>Address Transfer:</strong> Submit surrender certificate from previous block before registering in a new zone."
      ],
      steps: [
        { num: 1, title: "Family Data Audit", desc: "Submit family list and matching Aadhaar cards." },
        { num: 2, title: "Inspector Survey", desc: "Welfare officer checks income bounds." },
        { num: 3, title: "POS Machine Seeding", desc: "Map biometrics to local Fair Price Shop registry." }
      ],
      defaultAge: 52,
      defaultIncome: 95000,
      defaultLand: 0.5,
      defaultOccupation: "unemployed",
      draft: `To,
The District Food & Civil Supplies Controller,
State Food Department Office.

Subject: Request for inclusion of family member in Ration Card database.

Dear Sir/Madam,
I submit my application for verification of my family ration registry card. Our family income falls under the Priority Household category. 

I request the Food Inspector block office to approve our member list to authorize subsidized grain distribution.

Sincerely,
Head of Household`
    },
    {
      id: "pm-ujjwala",
      name: "Pradhan Mantri Ujjwala Yojana (PMUY)",
      subtitle: "Free LPG connections for women from BPL families to promote clean cooking fuel.",
      category: "welfare",
      categoryDisplay: "Welfare",
      agency: "Ministry of Petroleum and Natural Gas / LPG Distributors",
      eta: "Sanction Pending: 4-5 Business Days",
      geocode: "PMU-552",
      lat: "26.8467",
      lng: "80.9462",
      stage: 2,
      docType: "ration",
      log: "Application submitted. Awaiting LPG distributor biometric and address check.",
      formats: [
        "Applicant must be a woman of minimum 18 years of age.",
        "Must hold a valid BPL/AAY/PHH Ration Card issued by the state.",
        "No existing LPG connection must be registered in the name of any member of the household."
      ],
      resolutions: [
        "<strong>Existing Connection Block:</strong> If a family member holds a connection, surrender it or apply under general LPG connection scheme.",
        "<strong>Migrant Applicant:</strong> Migrant families can upload a simplified Self-Declaration Form as valid address proof.",
        "<strong>Name Discrepancy:</strong> Verify names match perfectly between Ration Card and Aadhaar database before submission."
      ],
      steps: [
        { num: 1, title: "Distributor Selection", desc: "Choose local LPG distributor (Indane, HP, Bharat Gas) in your zone." },
        { num: 2, title: "KYC & De-duplication Check", desc: "Portal runs biometric checks to verify no prior LPG connection exists." },
        { num: 3, title: "Stove & Cylinder Dispatch", desc: "First cylinder and gas stove supplied free of charge to approved beneficiary." }
      ],
      defaultAge: 32,
      defaultIncome: 65000,
      defaultLand: 0.2,
      defaultOccupation: "unemployed",
      draft: `To,
The Agency Manager,
[Indane/HP/Bharat Gas Distributor Office].

Subject: Request for new LPG connection under PMUY 2.0.

Dear Sir/Madam,
I am submitting my KYC application details for a new clean energy gas connection under the Pradhan Mantri Ujjwala Yojana. I am a resident woman above 18 years of age, and my family belongs to the low-income group with no other LPG cylinder mapping. 

I request you to verify our Ration Card and seed our Aadhaar profile to authorize the dispatch.

Sincerely,
Applicant Beneficiary`
    },
    {
      id: "sukanya-samriddhi",
      name: "Sukanya Samriddhi Yojana (SSY)",
      subtitle: "Government backed girl child prosperity savings scheme with tax-exempt interest benefits.",
      category: "welfare",
      categoryDisplay: "Welfare",
      agency: "Department of Posts (India Post) / RBI Authorized Banks",
      eta: "Account Seeding Pending: Processing",
      geocode: "SSY-701",
      lat: "12.9716",
      lng: "77.5946",
      stage: 1,
      docType: "aadhaar",
      log: "Account opening request registered. Awaiting physical birth certificate audit at the post office.",
      formats: [
        "Account can only be opened by the parent/guardian in the name of a girl child under 10 years of age.",
        "Maximum of two accounts are permitted per household family unit.",
        "Minimum initial deposit of ₹250 is required to seed the account ledger."
      ],
      resolutions: [
        "<strong>Third Daughter Exception:</strong> If twins or triplets are born, submit a medical birth certificate and legal affidavit to authorize a third account.",
        "<strong>Interest Rate Sync:</strong> Accounts receive compounding sovereign interest rates which are fully tax-free under Sec 80C.",
        "<strong>Maturity Period:</strong> Active for 21 years from opening date or until the girl child reaches 18 and gets married."
      ],
      steps: [
        { num: 1, title: "Birth Registry Audit", desc: "Verify girl child birth certificate registry number." },
        { num: 2, title: "Guardian KYC Linkage", desc: "Link legal guardian's PAN and Aadhaar identity cards." },
        { num: 3, title: "Ledger Activation", desc: "Deposit minimum balance to activate account and passbook." }
      ],
      defaultAge: 6,
      defaultIncome: 150000,
      defaultLand: 0,
      defaultOccupation: "self-employed",
      draft: `To,
The Postmaster / Branch Manager,
India Post Office / Authorized Bank Branch.

Subject: Request to open savings account under Sukanya Samriddhi Yojana.

Dear Sir/Madam,
I request to open an SSY savings account for my daughter, who is 6 years of age. I have attached her registered municipal Birth Certificate along with my PAN and Aadhaar identity cards as her legal guardian.

I request your office to activate the savings account passbook and ledger mapping.

Sincerely,
Parent/Guardian Applicant`
    }
  ],
  
  // 2. Tracked Municipal Grievances (Problem Statement Complaints Tracking)
  grievances: [
    {
      id: "complaint-1",
      name: "Flickering Streetlights Public Hazard",
      subtitle: "Streetlighting infrastructure in Sector 15 corridor is defunct, raising safety concerns.",
      category: "streetlight",
      categoryDisplay: "Streetlight",
      agency: "Delhi Development Authority (DDA) - Electrical Division 3",
      eta: "July 12, 2026",
      geocode: "DW15-882",
      lat: "28.5921",
      lng: "77.0620",
      location: "Sector 15, Dwarka, Delhi",
      stage: 2,
      log: "Grievance registered. Target Department linked: <strong>Delhi Development Authority (DDA)</strong>.",
      draft: `To,
The Executive Engineer (Electrical),
Delhi Development Authority, Zone-5, Dwarka, Delhi.

Subject: Formal Grievance regarding defunct street lighting in Sector 15.

Dear Sir/Madam,
I am writing to draw your attention to a critical public hazard in Sector 15, Dwarka. The municipal street lighting has been defunct for approximately two weeks. The lack of street illumination creates a security risk, particularly for senior citizens and women during late evening hours, and poses an immediate risk of minor vehicular accidents.

Therefore, we request your office to inspect the electrical pole infrastructure in the Sector 15 corridor and reinstate operational street lighting on priority.

Sincerely,
Citizen Portal Grievance`
    },
    {
      id: "complaint-2",
      name: "Hazardous Road Pothole at Metro Junction",
      subtitle: "Large and deep crater near Metro station causing minor vehicular accidents.",
      category: "roads",
      categoryDisplay: "Roads",
      agency: "Greater Chennai Corporation (GCC) - Ward 104 Roadways Section",
      eta: "July 15, 2026",
      geocode: "GCC-AN-449",
      lat: "13.0850",
      lng: "80.2101",
      location: "Anna Nagar Metro, Chennai",
      stage: 3,
      log: "Field verification inspector dispatched. Pothole volume classified: Medium.",
      draft: `To,
The Assistant Commissioner,
Greater Chennai Corporation, Anna Nagar Zone, Chennai.

Subject: Urgent road repair work requirement at Anna Nagar Main Road.

Dear Sir/Madam,
This is to bring to your urgent notice the dangerous road condition on Anna Nagar Main Road, near the metro station junction. A large and deep pothole has formed which filled with rainwater during yesterday's precipitation. Multiple two-wheeler riders have lost balance attempting to navigate around it.

We request the GCC roadways repair division to patch this crater immediately to prevent any severe accidents.

Sincerely,
Citizen Portal Grievance`
    },
    {
      id: "complaint-3",
      name: "Overflowing Garbage Secondary Depot",
      subtitle: "Solid waste spillage near station staircase creating severe health hazard.",
      category: "waste",
      categoryDisplay: "Waste",
      agency: "Bruhat Bengaluru Mahanagara Palike (BBMP) - Solid Waste Management",
      eta: "Resolved",
      geocode: "BBMP-IN-03",
      lat: "12.9784",
      lng: "77.6408",
      location: "Indiranagar Metro, Bengaluru",
      stage: 5,
      log: "Compactor vehicle dispatched. Clearing verified by geo-tagged timestamped image at 16:30.",
      draft: `To,
The Joint Commissioner (SWM),
Bruhat Bengaluru Mahanagara Palike, East Zone, Bengaluru.

Subject: Complaint regarding unattended secondary waste dumping depot at Indiranagar Metro Station.

Dear Sir/Madam,
We are submitting this grievance regarding the community waste bins located adjacent to the Indiranagar Metro Station staircase. The bins have not been cleared by the sanitation trucks for the past four days, leading to solid waste spilling onto the public footway. This is attracting stray animals and generating a severe health hazard.

Please direct the local SWM supervisor to clear this station and restore cleanliness.

Sincerely,
Citizen Portal Grievance`
    }
  ]
};

// Start UI Logic binding
document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  setupLanguageSelector();
  setupServicesSearch();
  setupDocumentOCRScanner();
  setupSchemeEligibility();
  setupChatCompanion();
  setupVoiceModalRecorder();
  setupLetterControls();
  setupDirectorySwitcher();
  setupStaticNavBarLinks();
  setupThemeToggle();
  
  // Render
  renderServicesDirectory();
  selectService('pm-kisan');
});

// Toast notification module (Sanitized XSS mitigation)
function showToast(message, isError = false) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${isError ? 'error' : ''}`;
  toast.setAttribute("role", "alert");
  
  const safeMessage = document.createTextNode(message);
  
  const icon = document.createElement("i");
  icon.className = isError ? "fa-solid fa-circle-exclamation toast-icon-error" : "fa-solid fa-circle-check toast-icon-success";
  icon.setAttribute("aria-hidden", "true");

  toast.appendChild(icon);
  toast.appendChild(safeMessage);
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = "toast-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards";
    setTimeout(() => {
      if (toast.parentNode === container) {
        container.removeChild(toast);
      }
    }, 300);
  }, 3500);
}

// Theme Toggle Integration (Dark / Light switcher)
function setupThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle-btn");
  if (!toggleBtn) return;
  
  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.remove("light-theme");
      toggleBtn.textContent = "light_mode";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.add("light-theme");
      toggleBtn.textContent = "dark_mode";
    }
    // Refresh display inputs and checklists to draw correct theme styling colors
    if (appState.activeServiceId) {
      renderActiveServiceDetails();
    }
  };

  // Retrieve saved preference (default to light)
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);
  
  toggleBtn.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      localStorage.setItem("theme", "light");
      applyTheme("light");
      showToast("Light Mode Active");
    } else {
      localStorage.setItem("theme", "dark");
      applyTheme("dark");
      showToast("Dark Mode Active");
    }
  });
}

// Workspace Tab Navigation (Refined visual classes swapper)
function setupTabs() {
  const triggers = document.querySelectorAll(".tab-trigger");
  triggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      const targetTabId = trigger.getAttribute("aria-controls");
      appState.activeTab = targetTabId.replace("tab-", "");
      
      triggers.forEach(t => {
        t.className = "flex items-center gap-2 px-4 py-2.5 text-on-surface-variant text-xs font-medium hover:bg-white/5 rounded-lg transition-all tab-trigger";
        t.setAttribute("aria-selected", "false");
      });
      
      trigger.className = "flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary/10 border border-primary/40 text-primary text-xs font-bold ice-glow transition-all tab-trigger active";
      trigger.setAttribute("aria-selected", "true");
      
      document.querySelectorAll(".service-tab-pane").forEach(pane => {
        pane.classList.add("hidden");
      });
      const targetPane = document.getElementById(targetTabId);
      if (targetPane) {
        targetPane.classList.remove("hidden");
      }
    });
  });
}

// Language selector module
function setupLanguageSelector() {
  const selector = document.getElementById("ui-lang-select");
  if (!selector) return;
  
  selector.addEventListener("change", (e) => {
    const lang = e.target.value;
    appState.currentLanguage = lang;
    
    const local = LOCALIZATIONS[lang] || LOCALIZATIONS['en'];
    
    // Update labels
    const tagline = document.querySelector(".logo-text p");
    if (tagline) tagline.textContent = local.tagline;
    
    const searchBtn = document.getElementById("services-search-btn");
    if (searchBtn) searchBtn.textContent = local.btn_search;
    
    const searchInput = document.getElementById("services-search-input");
    if (searchInput) searchInput.setAttribute("placeholder", local.search_placeholder);
    
    const tabGuide = document.getElementById("btn-tab-guide");
    if (tabGuide) tabGuide.innerHTML = `<span class="material-symbols-outlined text-sm">description</span> ${local.tab_guide}`;
    
    const tabEval = document.getElementById("btn-tab-eligibility");
    if (tabEval) tabEval.innerHTML = `<span class="material-symbols-outlined text-sm">fact_check</span> ${local.tab_eligibility}`;
    
    const tabAudit = document.getElementById("btn-tab-preaudit");
    if (tabAudit) tabAudit.innerHTML = `<span class="material-symbols-outlined text-sm">qr_code_scanner</span> ${local.tab_preaudit}`;
    
    const tabTracker = document.getElementById("btn-tab-timeline");
    if (tabTracker) tabTracker.innerHTML = `<span class="material-symbols-outlined text-sm">analytics</span> ${local.tab_timeline}`;
    
    const chatInput = document.getElementById("chat-input");
    if (chatInput) chatInput.setAttribute("placeholder", local.chat_input_placeholder);
    
    showToast(`Language updated to ${selector.options[selector.selectedIndex].text}`);
  });
}

// Sidebar Directory switcher (active-nav-tab toggles)
function setupDirectorySwitcher() {
  const btnServices = document.getElementById("btn-show-services");
  const btnGrievances = document.getElementById("btn-show-grievances");
  const grievanceCount = document.getElementById("grievance-count");
  
  if (!btnServices || !btnGrievances) return;
  
  if (grievanceCount) {
    grievanceCount.textContent = appState.grievances.length;
  }
  
  const toggleClasses = (activeBtn, inactiveBtn) => {
    activeBtn.classList.add("active-nav-tab");
    activeBtn.classList.remove("text-on-surface-variant");
    inactiveBtn.classList.remove("active-nav-tab");
    inactiveBtn.classList.add("text-on-surface-variant");
  };
  
  const updateTitle = (titleText) => {
    const el = document.getElementById("directory-list-title");
    if (el) el.textContent = titleText;
  };
  
  btnServices.addEventListener("click", () => {
    toggleClasses(btnServices, btnGrievances);
    appState.activeDirectoryTab = 'services';
    updateTitle("Services Directory");
    renderServicesDirectory();
    if (appState.services.length > 0) {
      selectService(appState.services[0].id);
    }
  });
  
  btnGrievances.addEventListener("click", () => {
    toggleClasses(btnGrievances, btnServices);
    appState.activeDirectoryTab = 'grievances';
    updateTitle("Complaints Track");
    renderServicesDirectory();
    if (appState.grievances.length > 0) {
      selectService(appState.grievances[0].id);
    }
  });
}

// Top Navbar header trigger hooks
function setupStaticNavBarLinks() {
  const navServices = document.getElementById("nav-btn-services");
  const navGrievances = document.getElementById("nav-btn-grievances");
  
  if (navServices) {
    navServices.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById("btn-show-services");
      if (target) target.click();
    });
  }
  
  if (navGrievances) {
    navGrievances.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById("btn-show-grievances");
      if (target) target.click();
    });
  }
}

// Search and Category filtering modules
function setupServicesSearch() {
  const searchInput = document.getElementById("services-search-input");
  const searchBtn = document.getElementById("services-search-btn");
  const categoryChips = document.querySelectorAll(".category-chip");
  
  if (!searchInput) return;
  
  const handleFilter = () => {
    appState.searchQuery = searchInput.value.toLowerCase().trim();
    renderServicesDirectory();
  };
  
  searchInput.addEventListener("input", handleFilter);
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      showToast(`AI directory query executed for: "${searchInput.value}"`);
      handleFilter();
    });
  }
  
  categoryChips.forEach(chip => {
    chip.addEventListener("click", () => {
      categoryChips.forEach(c => {
        c.className = "category-chip bg-white/5 border border-white/5 text-on-surface-variant text-xs px-3 py-1.5 rounded-full hover:bg-white/10";
      });
      chip.className = "category-chip bg-primary/10 border border-primary/20 text-primary text-xs px-3 py-1.5 rounded-full font-semibold";
      
      appState.activeCategory = chip.getAttribute("data-category");
      renderServicesDirectory();
      showToast(`Showing category: ${chip.textContent.trim()}`);
    });
  });
}

// Render dynamic directory cards matching selection states
function renderServicesDirectory() {
  const container = document.getElementById("services-list-container");
  if (!container) return;
  
  container.innerHTML = "";
  
  const isServices = appState.activeDirectoryTab === 'services';
  const dataPool = isServices ? appState.services : appState.grievances;
  
  const filtered = dataPool.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(appState.searchQuery) || 
                          item.subtitle.toLowerCase().includes(appState.searchQuery) ||
                          item.categoryDisplay.toLowerCase().includes(appState.searchQuery);
                          
    const matchesCategory = !isServices || appState.activeCategory === 'all' || item.category === appState.activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Update badge count
  const badgeCount = document.getElementById("grievance-count");
  if (badgeCount) {
    badgeCount.textContent = appState.grievances.length;
  }
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="p-3 text-center text-[10px] text-on-surface-variant">
        No records match.
      </div>
    `;
    return;
  }
  
  filtered.forEach(item => {
    const card = document.createElement("button");
    card.type = "button";
    
    const isActive = appState.activeServiceId === item.id;
    const activeClass = isActive 
      ? "bg-primary/10 border-primary/30 text-primary" 
      : "bg-white/5 border-white/5 hover:bg-white/10 text-on-surface-variant";
    
    card.className = `w-full text-left p-3 rounded-lg border transition-all text-xs flex flex-col gap-1.5 service-item-card ${activeClass}`;
    
    let tagHtml = `<span class="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-on-surface-variant'}">${escapeHTML(item.categoryDisplay)}</span>`;
    let subVal = isServices ? item.geocode : escapeHTML(item.location.split(',')[0]);
    
    card.innerHTML = `
      <div class="flex justify-between items-center w-full">
        ${tagHtml}
        <span class="text-[9px] opacity-75">${subVal}</span>
      </div>
      <h4 class="font-bold text-white leading-tight truncate w-full">${escapeHTML(item.name)}</h4>
      <p class="text-[10px] text-on-surface-variant truncate w-full">${escapeHTML(item.subtitle)}</p>
    `;
    
    card.addEventListener("click", () => {
      selectService(item.id);
    });
    
    container.appendChild(card);
  });
}

// Router select details visual swapper
function selectService(serviceId) {
  appState.activeServiceId = serviceId;
  
  // Re-highlight cards
  renderServicesDirectory();
  
  const empty = document.getElementById("service-workspace-empty");
  const content = document.getElementById("service-workspace-content");
  if (empty) empty.classList.add("hidden");
  if (content) content.classList.remove("hidden");
  
  const isGrievance = serviceId.startsWith("complaint-");
  const tabsWrapper = document.getElementById("tabs-nav-wrapper");
  
  if (isGrievance) {
    // Morph UI: Hide tabs, force timeline active
    if (tabsWrapper) tabsWrapper.classList.add("hidden");
    
    document.querySelectorAll(".service-tab-pane").forEach(pane => pane.classList.add("hidden"));
    const timelinePane = document.getElementById("tab-timeline");
    if (timelinePane) timelinePane.classList.remove("hidden");
    appState.activeTab = 'timeline';
  } else {
    // Morph UI: Restore tabs, Guidelines default active
    if (tabsWrapper) tabsWrapper.classList.remove("hidden");
    
    const triggers = document.querySelectorAll(".tab-trigger");
    triggers.forEach(t => {
      t.className = "flex items-center gap-2 px-4 py-2.5 text-on-surface-variant text-xs font-medium hover:bg-white/5 rounded-lg transition-all tab-trigger";
      t.setAttribute("aria-selected", "false");
    });
    
    const guideTrigger = document.getElementById("btn-tab-guide");
    if (guideTrigger) {
      guideTrigger.className = "flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary/10 border border-primary/40 text-primary text-xs font-bold ice-glow transition-all tab-trigger active";
      guideTrigger.setAttribute("aria-selected", "true");
    }
    
    document.querySelectorAll(".service-tab-pane").forEach(pane => pane.classList.add("hidden"));
    const guidePane = document.getElementById("tab-guide");
    if (guidePane) guidePane.classList.remove("hidden");
    appState.activeTab = 'guide';
  }
  
  renderActiveServiceDetails();
}

// Render dynamic elements to pane components (Guarded Defensively against null nodes)
function renderActiveServiceDetails() {
  const isGrievance = appState.activeServiceId.startsWith("complaint-");
  const pool = isGrievance ? appState.grievances : appState.services;
  
  const item = pool.find(i => i.id === appState.activeServiceId);
  if (!item) return;
  
  // Safe helper to set text content of element by ID
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  
  // Safe helper to set innerHTML of element by ID
  const setHtml = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  };
  
  // Set headers
  setText("active-service-tag", item.categoryDisplay);
  setText("active-service-title", item.name);
  setText("active-service-subtitle", item.subtitle);
  
  if (isGrievance) {
    setText("timeline-title-label", "Grievance Progress Pipeline");
    setText("assigned-agency-header", "Assigned Municipal Department Node");
    setText("draft-title-label", "AI Generated Grievance Letter");
    setText("draft-desc-label", "Official representation complaint letter routed automatically into administrative-grade English.");
    setText("map-title-label", "Municipal GIS Network Overlay");
    setText("draft-icon-type", "mark_email_read");
    setText("assignment-icon", "lan");
    setHtml("map-meta-label", `
      <p><strong>Lattice Code:</strong> CP-GEO-${item.geocode}</p>
      <p><strong>Network Node:</strong> P2P Grid Node dw-elec-90</p>
    `);
  } else {
    setText("timeline-title-label", "Administrative Progress Pipeline");
    setText("assigned-agency-header", "Assigned Department Office");
    setText("draft-title-label", "AI Generated Representation Draft");
    setText("draft-desc-label", "Formal administrative representational letter compiled in English.");
    setText("map-title-label", "GIS Location Network Overlay");
    setText("draft-icon-type", "draft");
    setText("assignment-icon", "account_balance");
    setHtml("map-meta-label", `
      <p><strong>Lattice Identifier:</strong> JW-GEO-${item.geocode}</p>
      <p><strong>Municipal Grid Node:</strong> Sector 15 block-node registry mapping</p>
    `);
  }
  
  // Set Guidelines if it is a service
  if (!isGrievance) {
    const formatsList = document.getElementById("active-guide-formats");
    if (formatsList) {
      formatsList.innerHTML = "";
      item.formats.forEach(f => {
        const li = document.createElement("li");
        li.className = "flex gap-4";
        li.innerHTML = `
          <span class="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0 shadow-[0_0_8px_rgba(125,211,252,0.8)]"></span>
          <p class="text-on-surface/90">${escapeHTML(f)}</p>
        `;
        formatsList.appendChild(li);
      });
    }
    
    const resolutionsList = document.getElementById("active-guide-resolutions");
    if (resolutionsList) {
      resolutionsList.innerHTML = "";
      item.resolutions.forEach(r => {
        const li = document.createElement("li");
        li.className = "flex gap-4";
        li.innerHTML = `
          <span class="w-1.5 h-1.5 rounded-full bg-error mt-2.5 shrink-0"></span>
          <div>${r}</div>
        `;
        resolutionsList.appendChild(li);
      });
    }
    
    const stepsContainer = document.getElementById("active-guide-steps");
    if (stepsContainer) {
      stepsContainer.innerHTML = "";
      item.steps.forEach(step => {
        const div = document.createElement("div");
        div.className = "glass-panel p-5 rounded-xl relative group transition-all cursor-default overflow-hidden border border-white/5 hover:border-primary/30";
        div.innerHTML = `
          <span class="absolute -bottom-4 -right-2 text-6xl font-extrabold text-primary/5 select-none transition-colors group-hover:text-primary/10">${step.num}</span>
          <h4 class="text-sm font-bold mb-2 text-white">${escapeHTML(step.title)}</h4>
          <p class="text-[10px] text-on-surface-variant leading-relaxed">${escapeHTML(step.desc)}</p>
          <div class="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div class="w-full h-full bg-primary origin-left"></div>
          </div>
        `;
        stepsContainer.appendChild(div);
      });
    }
    
    const inputAge = document.getElementById("scheme-age");
    if (inputAge) inputAge.value = item.defaultAge;
    
    const inputIncome = document.getElementById("scheme-income");
    if (inputIncome) inputIncome.value = item.defaultIncome;
    
    const inputLand = document.getElementById("scheme-land");
    if (inputLand) {
      inputLand.value = item.defaultLand;
      if (item.category !== 'agriculture') {
        inputLand.value = 0;
        inputLand.disabled = true;
      } else {
        inputLand.disabled = false;
      }
    }
    
    const selectOcc = document.getElementById("scheme-occupation");
    if (selectOcc) selectOcc.value = item.defaultOccupation;
    
    resetEvaluatorDisplay(item);
    resetOCRScannerDisplay(item);
  }
  
  // Renders tracking elements
  setText("detail-assigned-agency", item.agency);
  setHtml("detail-agency-log", item.log);
  setText("detail-draft-text", item.draft);
  setText("detail-lat-lng", `Lat: ${item.lat}, Lng: ${item.lng}`);
  setText("detail-geocode", item.geocode);
  
  // Pipeline stages timeline construction
  const pipelineStages = document.getElementById("pipeline-stages-container");
  if (pipelineStages) {
    pipelineStages.innerHTML = "";
    for (let num = 1; num <= 5; num++) {
      const isCompleted = num < item.stage;
      const isCurrent = num === item.stage;
      
      let stateClass = "text-on-surface-variant";
      let dotClass = "bg-[#111a2d] border-white/5 text-on-surface-variant";
      
      if (isCompleted) {
        stateClass = "text-primary font-semibold";
        dotClass = "bg-primary border-primary text-background shadow-[0_0_15px_rgba(125,211,252,0.4)]";
      } else if (isCurrent) {
        if (item.stage === 5) {
          stateClass = "text-primary font-semibold";
          dotClass = "bg-primary border-primary text-background shadow-[0_0_15px_rgba(125,211,252,0.4)]";
        } else {
          stateClass = "text-amber-500 font-semibold";
          dotClass = "bg-amber-500 border-amber-500 text-background shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-pulse";
        }
      }
      
      const stageName = isGrievance
        ? { 1: "Lodge", 2: "Assign", 3: "Verify", 4: "Action", 5: "Resolved" }[num]
        : { 1: "Lodge", 2: "Audit", 3: "Sanction", 4: "Release", 5: "Complete" }[num];
        
      const dateText = num <= item.stage ? "07 Jul" : "--";
      
      const stepDiv = document.createElement("div");
      stepDiv.className = `stage-step flex flex-col items-center w-12 ${stateClass}`;
      stepDiv.innerHTML = `
        <div class="stage-dot w-9 h-9 rounded-full border flex items-center justify-center text-sm shrink-0 transition-all ${dotClass}">
          <span class="material-symbols-outlined text-xs">
            ${isGrievance 
              ? { 1: "assignment", 2: "person_search", 3: "verified_user", 4: "engineering", 5: "task_alt" }[num]
              : { 1: "assignment", 2: "find_in_page", 3: "gavel", 4: "payments", 5: "task_alt" }[num]
            }
          </span>
        </div>
        <span class="stage-label text-[10px] mt-2">${stageName}</span>
        <span class="stage-date text-[8px] opacity-75 mt-0.5">${dateText}</span>
      `;
      pipelineStages.appendChild(stepDiv);
    }
  }
  
  // Fill progress line
  const fill = document.getElementById("pipeline-progress-fill");
  if (fill) {
    const percentageMap = { 1: 5, 2: 25, 3: 50, 4: 75, 5: 100 };
    const fillVal = percentageMap[item.stage] || 5;
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      fill.style.width = "100%";
      fill.style.height = `${fillVal}%`;
    } else {
      fill.style.height = "100%";
      fill.style.width = `${fillVal}%`;
    }
  }
}

function resetEvaluatorDisplay(service) {
  const percentageEl = document.getElementById("eligibility-percentage");
  const textEl = document.getElementById("probability-text");
  const briefEl = document.getElementById("eligibility-brief");
  const meter = document.getElementById("eligibility-meter");
  const checkedList = document.getElementById("eligible-params-list");
  const exclusionsList = document.getElementById("exclusion-params-list");
  const checklist = document.getElementById("scheme-document-checklist");
  
  if (percentageEl) percentageEl.textContent = "--";
  if (textEl) {
    textEl.textContent = "Click Evaluate";
    textEl.className = "text-on-surface-variant text-sm font-semibold";
    textEl.style.color = "";
  }
  if (briefEl) briefEl.textContent = "Adjust parameters above and check status.";
  if (meter) meter.style.background = `conic-gradient(rgba(255,255,255,0.06) 360deg, transparent 0deg)`;
  
  if (checkedList) checkedList.innerHTML = `<li>Awaiting evaluation checklist...</li>`;
  if (exclusionsList) exclusionsList.innerHTML = `<li>Awaiting evaluation audit...</li>`;
  
  if (checklist) {
    checklist.innerHTML = `
      <label class="flex items-center gap-2 text-[10px] text-on-surface-variant">
        <input type="checkbox" disabled class="rounded border-white/10 bg-transparent text-primary focus:ring-0">
        <span>Awaiting calculation.</span>
      </label>
    `;
  }
}

function resetOCRScannerDisplay(service) {
  const box = document.getElementById("ocr-results-box");
  const prompt = document.getElementById("dropzone-prompt");
  const zone = document.getElementById("ocr-dropzone");
  const laser = document.getElementById("scanner-laser");
  const title = document.getElementById("preaudit-dropzone-title");
  
  if (box) box.classList.add("hidden");
  if (prompt) prompt.classList.remove("hidden");
  if (zone) zone.classList.remove("scanning");
  if (laser) laser.classList.add("hidden");
  
  if (title) {
    const docName = service.docType === 'aadhaar' ? 'Aadhaar Card' : (service.docType === 'ration' ? 'Ration Card' : 'PAN Card');
    title.textContent = `Upload ${docName} to Pre-Audit`;
  }
}

// Document OCR pre-screener
function setupDocumentOCRScanner() {
  const simAadhaar = document.getElementById("sim-aadhaar-btn");
  const simPan = document.getElementById("sim-pan-btn");
  const prompt = document.getElementById("dropzone-prompt");
  const box = document.getElementById("ocr-results-box");
  const zone = document.getElementById("ocr-dropzone");
  const laser = document.getElementById("scanner-laser");
  const resetBtn = document.getElementById("reset-ocr-btn");
  
  const handleOcrSimulation = (docType) => {
    if (zone) zone.classList.add("scanning");
    if (laser) laser.classList.remove("hidden");
    showToast("Simulation: Initializing AI Document Pre-Scanner OCR...");
    
    setTimeout(() => {
      if (zone) zone.classList.remove("scanning");
      if (laser) laser.classList.add("hidden");
      if (prompt) prompt.classList.add("hidden");
      if (box) box.classList.remove("hidden");
      
      const badge = document.getElementById("ocr-status-badge");
      const findings = document.getElementById("ocr-findings-text");
      const resolutions = document.getElementById("ocr-resolution-text");
      
      if (docType === 'aadhaar') {
        if (badge) {
          badge.textContent = "Mismatch Flagged";
          badge.className = "px-2 py-0.5 rounded bg-error/20 text-error text-[10px] font-bold uppercase tracking-wider border border-error/25";
        }
        if (findings) findings.innerHTML = `<strong>Aadhaar Demographic Scan:</strong> Spelling discrepant. Document states <strong>"Rajesh Kumar"</strong>, which does not match active service registry listing of <strong>"Rajesh K. Sharma"</strong>.`;
        if (resolutions) resolutions.innerHTML = `<strong>Corrective Guideline:</strong> Submit Gazetted spelling declaration or request demographic update on UIDAI e-Seva portal.`;
        showToast("Simulation Diagnostic: spelling gap identified.", true);
      } else {
        if (badge) {
          badge.textContent = "Database Link Warning";
          badge.className = "px-2 py-0.5 rounded bg-error/20 text-error text-[10px] font-bold uppercase tracking-wider border border-error/25";
        }
        if (findings) findings.innerHTML = `<strong>PAN Registry Linkage:</strong> Seeding failure. PAN <strong>"XXXXX1234X"</strong> is active but lacks mapped connection to Aadhaar registry database.`;
        if (resolutions) resolutions.innerHTML = `<strong>Corrective Guideline:</strong> Access e-filing portal and complete PAN-Aadhaar verification seeding to prevent card inoperability.`;
        showToast("Simulation Diagnostic: linking gap identified.", true);
      }
    }, 2000);
  };
  
  if (simAadhaar) simAadhaar.addEventListener("click", () => handleOcrSimulation('aadhaar'));
  if (simPan) simPan.addEventListener("click", () => handleOcrSimulation('pan'));
  
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const service = appState.services.find(s => s.id === appState.activeServiceId);
      if (service) resetOCRScannerDisplay(service);
    });
  }
}

// Scheme Eligibility Calculations
function setupSchemeEligibility() {
  const btn = document.getElementById("check-eligibility-btn");
  if (!btn) return;
  
  btn.addEventListener("click", async () => {
    const service = appState.services.find(s => s.id === appState.activeServiceId);
    if (!service) return;
    
    const stateEl = document.getElementById("scheme-state");
    const occEl = document.getElementById("scheme-occupation");
    const ageEl = document.getElementById("scheme-age");
    const incomeEl = document.getElementById("scheme-income");
    const landEl = document.getElementById("scheme-land");
    
    const state = stateEl ? stateEl.value : 'delhi';
    const occ = occEl ? occEl.value : 'farmer';
    const age = ageEl ? parseInt(ageEl.value) : 42;
    const income = incomeEl ? parseInt(incomeEl.value) : 180000;
    const land = landEl ? parseFloat(landEl.value) : 1.8;
    
    btn.disabled = true;
    btn.innerHTML = `<span class="material-symbols-outlined text-sm animate-spin">sync</span> Evaluating...`;
    showToast("Processing eligibility metrics with Gemini 3.5 Flash...");
    
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate_scheme',
          scheme: service.id,
          state: state,
          occupation: occ,
          age: age,
          income: income,
          land: land,
          language: appState.currentLanguage
        })
      });
      
      if (!response.ok) throw new Error('Network eval error');
      const data = await response.json();
      
      renderSchemeEligibilityResults(data);
      showToast("Evaluation processed successfully!");
      
    } catch (err) {
      console.warn("API Failed, simulating locally:", err);
      showToast("API Offline Mode: Simulating calculations locally...", false);
      
      setTimeout(() => {
        let pct = 85;
        let prob = "High (Highly Likely)";
        let explanation = "";
        let eligible = [];
        let exclusions = [];
        let docs = [];
        
        if (service.id === 'pm-kisan') {
          if (land > 5) {
            pct = 10;
            prob = "Low (Ineligible)";
            explanation = "Farmer landholdings exceed the 5-acre (2-hectare) PM-Kisan policy limit.";
            exclusions.push("Land size parameter triggers structural ceiling limit.");
          } else if (occ === 'salaried') {
            pct = 15;
            prob = "Low (Ineligible)";
            explanation = "Regular salaried professionals/taxpayers are excluded from claiming farming welfare support.";
            exclusions.push("Salaried professional occupation is an exclusion.");
          } else {
            pct = 95;
            prob = "Very High (Eligible)";
            explanation = "Applicant parameters match PM-Kisan cultivation rules and landholding limits.";
            eligible.push("Landholdings comply with 5-acre ceiling.");
            eligible.push("Primary occupation matches cultivator status.");
          }
          docs = [
            { name: "Aadhaar Card: Linked to active mobile node for e-KYC", status: "checked" },
            { name: "Verified Land Registry Copy (Khata/Jamabandi)", status: "checked" },
            { name: "Aadhaar-seeded Bank Passbook (Direct Benefit Transfer)", status: "unchecked" }
          ];
        } else if (service.id === 'ayushman-bharat') {
          if (income > 250000) {
            pct = 20;
            prob = "Low (Ineligible)";
            explanation = "Annual family income exceeds low-income limits for SECC healthcare eligibility.";
            exclusions.push("Income exceeds maximum limit.");
          } else {
            pct = 90;
            prob = "High (Eligible)";
            explanation = "Income and occupation category conform to SECC health coverage parameters.";
            eligible.push("Annual income matches low-income classification.");
            eligible.push("Occupation is listed under priority classifications.");
          }
          docs = [
            { name: "Identity Proof (Aadhaar/Voter Card)", status: "checked" },
            { name: "Ration Card (PHH/BPL category)", status: "unchecked" }
          ];
        } else if (service.id === 'pm-ujjwala') {
          if (income > 100000) {
            pct = 15;
            prob = "Low (Ineligible)";
            explanation = "Family income exceeds poor household bounds for Ujjwala support.";
            exclusions.push("Income exceeds maximum limit.");
          } else {
            pct = 95;
            prob = "Very High (Eligible)";
            explanation = "Applicant meets woman age standard and low-income criteria.";
            eligible.push("Applicant is an adult woman.");
            eligible.push("Income conforms to poor household bounds.");
          }
          docs = [
            { name: "Aadhaar Card of Applicant", status: "checked" },
            { name: "State Ration Card (BPL/AAY)", status: "checked" },
            { name: "Self-declaration of zero LPG connections", status: "unchecked" }
          ];
        } else if (service.id === 'sukanya-samriddhi') {
          if (age > 10) {
            pct = 5;
            prob = "Low (Ineligible)";
            explanation = "The girl child's age exceeds the 10-year limit for account opening.";
            exclusions.push("Age exceeds 10 years limit.");
          } else {
            pct = 98;
            prob = "Very High (Eligible)";
            explanation = "Child is eligible for Sukanya Samriddhi prosperity account.";
            eligible.push("Girl child is under 10 years of age.");
            eligible.push("Guardian KYC documents conform.");
          }
          docs = [
            { name: "Birth Certificate of Girl Child", status: "checked" },
            { name: "Guardian PAN & Aadhaar Cards", status: "checked" },
            { name: "Initial Account Deposit (min ₹250)", status: "unchecked" }
          ];
        } else {
          pct = 90;
          prob = "High (Eligible)";
          explanation = "Demographic parameters align with standard application requirements.";
          eligible.push("Age requirements conform.");
          docs = [
            { name: "Aadhaar Card (UIDAI Verification)", status: "checked" },
            { name: "Standard Address Proof document", status: "checked" }
          ];
        }
        
        const localData = {
          percentage: pct,
          probabilityText: prob,
          brief: explanation,
          eligibleParams: eligible.length > 0 ? eligible : ["Residency matches standard guidelines."],
          exclusions: exclusions.length > 0 ? exclusions : ["No institutional exclusions flagged."],
          documents: docs
        };
        
        renderSchemeEligibilityResults(localData);
        showToast("Simulation: Evaluated eligibility metrics.");
      }, 1000);
      
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<span class="material-symbols-outlined text-sm">sync</span> Evaluate Eligibility with AI`;
    }
  });
}

function renderSchemeEligibilityResults(data) {
  const percentageEl = document.getElementById("eligibility-percentage");
  const textEl = document.getElementById("probability-text");
  const briefEl = document.getElementById("eligibility-brief");
  const meter = document.getElementById("eligibility-meter");
  const checkedList = document.getElementById("eligible-params-list");
  const exclusionsList = document.getElementById("exclusion-params-list");
  const checklist = document.getElementById("scheme-document-checklist");
  
  if (percentageEl) percentageEl.textContent = `${data.percentage}%`;
  
  const color = data.percentage > 70 ? 'var(--primary-color)' : (data.percentage > 40 ? '#d97706' : 'var(--error-color)');
  if (textEl) {
    textEl.textContent = data.probabilityText;
    textEl.style.color = color;
  }
  
  if (briefEl) briefEl.textContent = data.brief;
  
  if (meter) {
    const deg = (data.percentage / 100) * 360;
    const emptyColor = document.documentElement.classList.contains("dark") ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
    meter.style.background = `conic-gradient(${color} ${deg}deg, ${emptyColor} 0deg)`;
  }
  
  if (checkedList) {
    checkedList.innerHTML = "";
    data.eligibleParams.forEach(p => {
      const li = document.createElement("li");
      li.textContent = p;
      checkedList.appendChild(li);
    });
  }
  
  if (exclusionsList) {
    exclusionsList.innerHTML = "";
    data.exclusions.forEach(e => {
      const li = document.createElement("li");
      li.textContent = e;
      exclusionsList.appendChild(li);
    });
  }
  
  if (checklist) {
    checklist.innerHTML = "";
    if (data.documents && data.documents.length > 0) {
      data.documents.forEach(d => {
        const checkedStr = d.status === 'checked' ? 'checked' : '';
        const label = document.createElement("label");
        label.className = "flex items-center gap-2 text-[10px] text-on-surface";
        label.innerHTML = `
          <input type="checkbox" ${checkedStr} disabled class="rounded border-white/10 bg-transparent text-primary focus:ring-0">
          <span>${escapeHTML(d.name)}</span>
        `;
        checklist.appendChild(label);
      });
    } else {
      checklist.innerHTML = `<p class="text-[10px] text-on-surface-variant">No documents specified.</p>`;
    }
  }
}

// Letter controls (Copy and View Translation)
function setupLetterControls() {
  const copy = document.getElementById("copy-draft-btn");
  const trans = document.getElementById("translate-draft-btn");
  
  if (copy) {
    copy.addEventListener("click", () => {
      const detailDraft = document.getElementById("detail-draft-text");
      if (detailDraft) {
        const text = detailDraft.textContent;
        navigator.clipboard.writeText(text).then(() => {
          showToast("Application draft text copied!");
        });
      }
    });
  }
  
  if (trans) {
    trans.addEventListener("click", async () => {
      const detailDraft = document.getElementById("detail-draft-text");
      if (!detailDraft) return;
      
      const text = detailDraft.textContent;
      const isGrievance = appState.activeServiceId.startsWith("complaint-");
      const pool = isGrievance ? appState.grievances : appState.services;
      const item = pool.find(i => i.id === appState.activeServiceId);
      if (!item) return;
      
      const label = trans.textContent.trim();
      
      if (label.includes("View in Hindi")) {
        trans.innerHTML = `<span class="material-symbols-outlined text-xs animate-spin">sync</span> Translating...`;
        
        try {
          const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'translate_draft',
              draft: text,
              language: 'hi'
            })
          });
          
          if (!response.ok) throw new Error('Translation failed');
          const data = await response.json();
          
          detailDraft.textContent = data.translatedDraft;
          trans.innerHTML = `<span class="material-symbols-outlined text-xs">translate</span> View in English`;
          showToast("Draft translated successfully!");
        } catch (err) {
          console.warn("Translation failed, running local mock:", err);
          showToast("API Offline Mode: Translating locally...", false);
          
          if (item.id === 'pm-kisan') {
            detailDraft.textContent = `सेवा में,
कल्याण प्रशासक (पीएम-किसान सेल),
कृषि और राज्य राजस्व विभाग।

विषय: पीएम-किसान योजना लाभ के तहत शामिल करने का अनुरोध।

महोदय/महोदया,
मैं पीएम-किसान योजना के तहत नामांकन के लिए अपने आवेदन दस्तावेज प्रस्तुत कर रहा हूँ। मेरे पास 2.2 एकड़ कृषि भूमि है, जो कि 5 एकड़ की सीमा के अनुकूल है।

कृपया पटवारी क्षेत्र लेखा परीक्षा को अधिकृत करें और मेरा लाभार्थी आईडी चालू करें।

भवदीय,
आवेदक किसान`;
          } else if (item.id === 'pm-ujjwala') {
            detailDraft.textContent = `सेवा में,
एजेंसी प्रबंधक,
[इण्डेन/एचपी/भारत गैस वितरक कार्यालय]।

विषय: पीएमयूवाई 2.0 के तहत नए एलपीजी कनेक्शन के लिए अनुरोध।

महोदय/महोदया,
मैं प्रधानमंत्री उज्ज्वला योजना के तहत नए स्वच्छ रसोई गैस कनेक्शन के लिए अपना केवाईसी आवेदन विवरण जमा कर रही हूँ। मैं 18 वर्ष से अधिक आयु की महिला हूँ और मेरा परिवार कम आय वर्ग से संबंधित है।

कृपया आवेदन स्वीकृत करें।

भवदीय,
आवेदक लाभार्थी`;
          } else if (item.id === 'sukanya-samriddhi') {
            detailDraft.textContent = `सेवा में,
पोस्टमास्टर / शाखा प्रबंधक,
भारतीय डाकघर / अधिकृत बैंक शाखा।

विषय: सुकन्या समृद्धि योजना के तहत बचत खाता खोलने का अनुरोध।

महोदय/महोदया,
मैं अपनी पुत्री (आयु 6 वर्ष) के लिए सुकन्या समृद्धि बचत खाता खोलने का अनुरोध करता हूँ। मैंने उसकी जन्म प्रमाण पत्र प्रति और अपने पैन व आधार कार्ड दस्तावेज संलग्न किए हैं।

कृपया खाता पासबुक चालू करने की कृपा करें।

भवदीय,
अभिभावक आवेदक`;
          } else if (item.id === 'complaint-1') {
            detailDraft.textContent = `सेवा में,
अधिशासी अभियंता (विद्युत),
दिल्ली विकास प्राधिकरण (DDA), द्वारका, दिल्ली।

विषय: सेक्टर 15 में स्ट्रीट लाइट खराब होने के संबंध में शिकायत।

महोदय/महोदया,
मैं आपका ध्यान सेक्टर 15, द्वारका में खराब स्ट्रीट लाइटों की गंभीर समस्या की ओर आकर्षित करना चाहता हूँ। पिछले दो सप्ताह से यह स्ट्रीट लाइटें बंद पड़ी हैं। रात में अत्यधिक अंधेरा होने के कारण महिलाओं और बुजुर्गों की सुरक्षा का खतरा बढ़ गया है और दुर्घटनाओं की आशंका है।

अतः आपसे अनुरोध है कि जल्द से जल्द विद्युत खंभों की मरम्मत कर स्ट्रीट लाइटों को सुचारू रूप से चालू कराने की कृपा करें।

भवदीय,
नागरिक पोर्टल शिकायत`;
          } else {
            detailDraft.textContent = `[सेवा प्रदाता अधिकारी]
विषय: आवेदन प्रतिनिधित्व पत्र।

महोदय,
मैं इस योजना के तहत अपना नाम जोड़ने का अनुरोध करता हूँ। मेरे समस्त दस्तावेज सत्यापित हैं। कृपया आवेदन स्वीकृत करें।

भवदीय,
आवेदक`;
          }
          trans.innerHTML = `<span class="material-symbols-outlined text-xs">translate</span> View in English`;
        }
      } else {
        detailDraft.textContent = item.draft;
        trans.innerHTML = `<span class="material-symbols-outlined text-xs">translate</span> View in Hindi`;
        showToast("Restored English draft.");
      }
    });
  }
}

// Conversational AI Copilot Companion (Sidebar widgets binding)
function setupChatCompanion() {
  const input = document.getElementById("chat-input");
  const btn = document.getElementById("send-chat-btn");
  const history = document.getElementById("chat-history");
  
  if (!btn || !input || !history) return;
  
  const handleChat = async () => {
    const q = input.value.trim();
    if (!q) return;
    
    appendChatMessage("user", q);
    input.value = "";
    history.scrollTop = history.scrollHeight;
    
    const loader = appendChatMessage("bot", `<span class="material-symbols-outlined text-[10px] animate-spin">sync</span> Thinking...`);
    
    try {
      const messages = [];
      const messageBlocks = history.children;
      for (let i = 0; i < messageBlocks.length - 1; i++) {
        const block = messageBlocks[i];
        const isUser = block.classList.contains("self-end");
        const msgTextEl = block.querySelector(".message-text");
        if (msgTextEl) {
          messages.push({
            role: isUser ? "user" : "model",
            parts: [{ text: msgTextEl.innerText }]
          });
        }
      }
      
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          history: messages,
          language: appState.currentLanguage
        })
      });
      
      if (!response.ok) throw new Error('API failed');
      const data = await response.json();
      
      if (loader) {
        const loaderTextEl = loader.querySelector(".message-text");
        if (loaderTextEl) loaderTextEl.innerHTML = data.reply;
      }
      
    } catch (err) {
      console.warn("Companion API failed, simulating locally:", err);
      showToast("API Offline Mode: Simulating companion response...", false);
      
      setTimeout(() => {
        const fallback = generateChatFallback(q);
        if (loader) {
          const loaderTextEl = loader.querySelector(".message-text");
          if (loaderTextEl) loaderTextEl.innerHTML = fallback;
        }
        history.scrollTop = history.scrollHeight;
      }, 1000);
    }
    
    history.scrollTop = history.scrollHeight;
  };
  
  btn.addEventListener("click", handleChat);
  input.addEventListener("keydown", (e) => {
    if (e.key === 'Enter') handleChat();
  });
}

function appendChatMessage(role, text) {
  const chatBox = document.getElementById("chat-history");
  if (!chatBox) return null;
  
  const messageDiv = document.createElement("div");
  
  const isUser = role === "user";
  messageDiv.className = `p-2 rounded-lg text-[10px] leading-relaxed flex flex-col ${
    isUser 
      ? "bg-primary/10 ml-4 self-end text-white text-right border border-primary/20" 
      : "bg-white/5 mr-4 self-start text-on-surface-variant border border-white/5"
  }`;
  
  const roleLabel = isUser ? "You" : "Companion";
  const colorLabel = isUser ? "text-primary" : "text-primary/60";
  
  messageDiv.innerHTML = `
    <span class="block font-bold mb-0.5 ${colorLabel} uppercase text-[8px]">${roleLabel}</span>
    <div class="message-text">${text}</div>
  `;
  
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  return messageDiv;
}

function generateChatFallback(q) {
  const text = q.toLowerCase();
  if (text.includes("aadhaar") && text.includes("address")) {
    return `To resolve address updates on your Aadhaar card (UIDAI):
    1. Online: Visit myAadhaar e-service portal.
    2. Upload scan: Proof of Address (Rent Agreement, electricity bill, etc.)
    3. Fee: Pay statutory fee of ₹50.`;
  }
  
  if (text.includes("pm-kisan") || text.includes("eligible")) {
    return `Under PM-KISAN guidelines:
    - Land holdings must be under 2 hectares (5 acres).
    - Exclusions: regular tax payers or government employee families.`;
  }
  
  if (text.includes("ujjwala") || text.includes("gas")) {
    return `PM Ujjwala Yojana (PMUY) supports:
    - LPG connections for adult women of BPL/low-income families.
    - Submit Aadhaar, state Ration Card, and bank details.`;
  }
  
  if (text.includes("sukanya") || text.includes("girl")) {
    return `Sukanya Samriddhi Yojana (SSY):
    - Open savings accounts for girls under 10 years of age.
    - Submit Birth Certificate and Guardian KYC.`;
  }
  
  return `I have registered your query: "${escapeHTML(q)}". Ask me about "Aadhaar correction", "Ujjwala LPG guidelines", or "Sukanya account details".`;
}

// SECONDARY FEATURE: Voice Grievance Modal Overlay (MORPHS UI LIVE)
function setupVoiceModalRecorder() {
  const openBtn = document.getElementById("open-voice-modal-btn");
  const closeBtn = document.getElementById("close-voice-modal-btn");
  const modal = document.getElementById("voice-modal");
  
  if (!openBtn || !modal) return;
  
  openBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    showToast("Opened Voice Grievance modal.");
  });
  
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
      if (appState.isRecording) stopModalRecording();
    });
  }
  
  // Modal voice recording simulation
  const recBtn = document.getElementById("modal-record-btn");
  const recTxt = document.getElementById("modal-record-btn-text");
  const waves = document.getElementById("modal-audio-waves");
  const placeholder = document.getElementById("modal-waveform-placeholder");
  const textInput = document.getElementById("modal-transcript-textarea");
  
  if (!recBtn) return;
  
  recBtn.addEventListener("click", () => {
    if (appState.isRecording) {
      stopModalRecording();
    } else {
      appState.isRecording = true;
      recBtn.classList.add("recording");
      if (recTxt) recTxt.textContent = "Recording...";
      if (placeholder) placeholder.classList.add("hidden");
      if (waves) waves.classList.remove("hidden");
      
      showToast("Simulation: Recording grievance audio input...");
      
      appState.recordingTimeout = setTimeout(() => {
        stopModalRecording(true);
      }, 3500);
    }
  });
  
  const stopModalRecording = (finishedAuto = false) => {
    clearTimeout(appState.recordingTimeout);
    appState.isRecording = false;
    
    recBtn.classList.remove("recording");
    if (recTxt) recTxt.textContent = "Record Voice";
    if (waves) waves.classList.add("hidden");
    if (placeholder) placeholder.classList.remove("hidden");
    
    if (finishedAuto && textInput) {
      textInput.value = "The street drainage pipeline is overflowing, flooding the road with waste sewage. (Ameerpet, Hyderabad)";
      const locInput = document.getElementById("modal-location-input");
      if (locInput) locInput.value = "Ameerpet Metro, Hyderabad";
      showToast("Simulation: Voice recorded and parsed successfully!");
    } else {
      showToast("Recording stopped.");
    }
  };
  
  // Modal form submit (MORHP UI LIVE)
  const submitBtn = document.getElementById("modal-submit-btn");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const textVal = textInput ? textInput.value.trim() : "";
      const locInput = document.getElementById("modal-location-input");
      const locVal = locInput ? locInput.value.trim() : "";
      const catSelect = document.getElementById("modal-category-select");
      const categoryVal = catSelect ? catSelect.value : "auto";
      
      if (!textVal || !locVal) {
        showToast("Error: Description and Location are mandatory.", true);
        return;
      }
      
      showToast("Simulation: Geocoding coordinates and linking municipal agency...");
      
      setTimeout(() => {
        const detectedCategory = categoryVal === 'auto' ? 'Sewage' : categoryVal;
        const agencyName = getAgencyNameLocally(detectedCategory, locVal);
        const geocode = `JW-GRI-${Math.floor(100 + Math.random() * 900)}`;
        const localDraft = generateDraftLocally(detectedCategory, locVal, textVal);
        
        const newId = `complaint-${appState.grievances.length + 1}`;
        const newGrievance = {
          id: newId,
          name: textVal.length > 40 ? textVal.substring(0, 40) + "..." : textVal,
          subtitle: textVal,
          category: detectedCategory.toLowerCase(),
          categoryDisplay: detectedCategory,
          location: locVal,
          agency: agencyName,
          eta: "3-5 Business Days",
          geocode: geocode,
          lat: "28.5" + Math.floor(1000+Math.random()*8999),
          lng: "77.0" + Math.floor(1000+Math.random()*8999),
          stage: 2,
          log: `Grievance registered. Target Department linked: <strong>${escapeHTML(agencyName)}</strong>. Scheduled for field audit.`,
          draft: localDraft
        };
        
        // Append grievance
        appState.grievances.unshift(newGrievance);
        
        // Toggle directory switcher to Grievances
        const btnServices = document.getElementById("btn-show-services");
        const btnGrievances = document.getElementById("btn-show-grievances");
        
        if (btnServices && btnGrievances) {
          btnServices.classList.remove("active-nav-tab");
          btnServices.classList.add("text-on-surface-variant");
          btnGrievances.classList.add("active-nav-tab");
          btnGrievances.classList.remove("text-on-surface-variant");
        }
        
        appState.activeDirectoryTab = 'grievances';
        const listTitleEl = document.getElementById("directory-list-title");
        if (listTitleEl) listTitleEl.textContent = "Complaints Track";
        
        // Re-render
        renderServicesDirectory();
        
        // Select complaint card (morphs timeline layout)
        selectService(newId);
        
        // Hide Modal
        modal.classList.add("hidden");
        showToast("Grievance registered and timeline tracking is now active!");
        
        // Reset fields
        if (textInput) textInput.value = "";
        if (locInput) locInput.value = "";
        if (catSelect) catSelect.value = "auto";
      }, 1200);
    });
  }
  
  // Modal demo buttons
  const demoBtns = modal.querySelectorAll(".demo-btn");
  demoBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const sample = btn.getAttribute("data-text");
      const lang = btn.getAttribute("data-lang");
      
      showToast(`Simulation: Loading ${btn.textContent.trim()} prompt...`);
      
      if (appState.isRecording) stopModalRecording();
      appState.isRecording = true;
      recBtn.className = "bg-error/10 border border-error/20 text-error font-bold px-5 py-2 rounded-full text-xs flex items-center gap-1.5 transition-all shadow-md recording";
      if (recTxt) recTxt.textContent = "Processing...";
      if (placeholder) placeholder.classList.add("hidden");
      if (waves) waves.classList.remove("hidden");
      
      setTimeout(() => {
        appState.isRecording = false;
        recBtn.className = "bg-error/10 border border-error/20 hover:bg-error/20 text-error font-bold px-5 py-2 rounded-full text-xs flex items-center gap-1.5 transition-all shadow-md";
        if (recTxt) recTxt.textContent = "Record Voice";
        if (waves) waves.classList.add("hidden");
        if (placeholder) placeholder.classList.remove("hidden");
        
        if (textInput) textInput.value = sample;
        const locInput = document.getElementById("modal-location-input");
        if (locInput) {
          if (lang === 'hi') locInput.value = "Sector 15, Dwarka, Delhi";
          if (lang === 'ta') locInput.value = "Anna Nagar Main Road, Chennai";
          if (lang === 'kn') locInput.value = "Indiranagar Metro, Bengaluru";
        }
        
        showToast("Simulation: Vernacular text loaded successfully!");
      }, 1000);
    });
  });
}

// Local Fallbacks
function getAgencyNameLocally(category, location) {
  let area = location.toLowerCase();
  let city = "Municipal Council";
  if (area.includes("delhi")) city = "Delhi Municipal Corporation (MCD)";
  else if (area.includes("chennai")) city = "Greater Chennai Corporation (GCC)";
  else if (area.includes("bengaluru") || area.includes("bangalore")) city = "Bruhat Bengaluru Mahanagara Palike (BBMP)";
  else if (area.includes("hyderabad")) city = "Greater Hyderabad Municipal Corporation (GHMC)";
  
  return `${city} - ${category} Maintenance Dept`;
}

// Local Document Draft compiles
function generateDraftLocally(category, location, transcript) {
  return `To,
The Executive Engineer (Infrastructure Development),
Local Municipal Department, ${location}.

Subject: Representation for urgent mitigation of local issue.

Dear Sir/Madam,
We write to raise a grievance on behalf of the community members residing near ${location}. The resident population is currently experiencing severe inconvenience due to: "${transcript}".

This situation constitutes a public nuisance and presents structural safety risks if left unaddressed. We solicit your intervention to arrange an inspection team and execute the necessary repairs or clearances at the earliest possible juncture.

Sincerely,
Citizen Portal Grievance`;
}

// XSS Mitigation Security Utility
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
