// Smart Bharat AI Civic Companion - Complete Frontend Logic
// Handled defensively with full transitions, real Leaflet maps, and 6 welfare schemes.

// Localized UI text mappings
const LOCALIZATIONS = {
  en: {
    tagline: "AI-Powered Civic Companion",
    btn_search: "Search Directory",
    search_placeholder: "Search schemes & services (e.g. PM-Kisan, Ayushman Bharat, Pothole, Aadhaar update)...",
    tab_guide: "Guidelines",
    tab_eligibility: "Eligibility Evaluator",
    tab_preaudit: "Document OCR Pre-Audit",
    chat_input_placeholder: "Ask about schemes..."
  },
  hi: {
    tagline: "एआई-संचालित नागरिक साथी",
    btn_search: "खोजें",
    search_placeholder: "सेवाएं या शिकायतें खोजें (जैसे कि पीएम-किसान, आयुष्मान भारत, गड्ढा, आधार)...",
    tab_guide: "दिशानिर्देश",
    tab_eligibility: "पात्रता मूल्यांकन",
    tab_preaudit: "दस्तावेज़ ओसीआर जांच",
    chat_input_placeholder: "योजनाओं के बारे में पूछें..."
  }
};

// Global App State Store
let appState = {
  currentLanguage: 'en',
  activeTab: 'guide',
  activeView: 'home-view', // views: 'home-view', 'services-view', 'complaints-view', 'resources-view'
  activeDirectoryTab: 'services', // 'services' or 'grievances'
  activeServiceId: 'pm-kisan',
  searchQuery: '',
  activeCategory: 'all',
  
  // Real Leaflet Map instances
  leafletMap: null,
  leafletMarker: null,
  
  // 1. Mapped Government Schemes & Services (Smart Hub Core Directory - 7 Schemes total)
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
      defaultAge: 25,
      defaultIncome: 0,
      defaultLand: 0,
      defaultOccupation: "self-employed"
    },
    {
      id: "pan-card",
      name: "PAN Card (Income Tax Seeding)",
      subtitle: "Permanent Account Number updates and mandatory linkage with Aadhaar database.",
      category: "identification",
      categoryDisplay: "Identification",
      agency: "Income Tax Department of India / NSDL & UTITSL Nodes",
      defaultAge: 30,
      defaultIncome: 350000,
      defaultLand: 0,
      defaultOccupation: "salaried"
    },
    {
      id: "ration-card",
      name: "National Ration Card (PDS Seeding)",
      subtitle: "PDS ration card registration and biometric member seeding under the National Food Security Act.",
      category: "welfare",
      categoryDisplay: "Welfare",
      agency: "State Food & Civil Supplies Department / PDS Fair Price Shop",
      defaultAge: 52,
      defaultIncome: 95000,
      defaultLand: 0.5,
      defaultOccupation: "unemployed"
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
    },
    {
      id: "pm-awas",
      name: "Pradhan Mantri Awas Yojana (PMAY-U)",
      subtitle: "Affordable housing scheme providing interest subsidies and construction grants for urban/rural poor.",
      category: "welfare",
      categoryDisplay: "Welfare",
      agency: "Ministry of Housing and Urban Affairs / State Housing Boards",
      eta: "Sanction Complete: Processing",
      geocode: "PMA-229",
      lat: "22.5726",
      lng: "88.3639",
      stage: 3,
      docType: "ration",
      log: "Central registry verify complete. Local housing inspector site map audit scheduled.",
      formats: [
        "Applicant family must not own a pucca (all-weather) house in any part of India.",
        "Annual household income must fall within category limits: EWS (up to ₹3L) or LIG (₹3L-₹6L).",
        "Preferred co-ownership must list an adult female family member."
      ],
      resolutions: [
        "<strong>Pucca House Check:</strong> Real-estate holdings registry is scanned. Even shared family ancestral homes may trigger exclusions.",
        "<strong>Income Certificate:</strong> EWS category requires dynamic revenue department income certificate not older than 6 months.",
        "<strong>Credit Subsidy limits:</strong> Bank loans receive interest subsidies mapped through Nodal banks up to 6.5%."
      ],
      steps: [
        { num: 1, title: "Income Verification", desc: "Submit self-affidavit and revenue officer income verification report." },
        { num: 2, title: "Field Geo-Tagging", desc: "Surveyor visits coordinates to map existing kutcha structure." },
        { num: 3, title: "DBT Housing Credit", desc: "Direct disbursement of construction grants to linked bank node." }
      ],
      defaultAge: 40,
      defaultIncome: 180000,
      defaultLand: 0,
      defaultOccupation: "laborer",
      draft: `To,
The Municipal Commissioner (Housing Division),
State Development Authority.

Subject: Request for housing grant under Pradhan Mantri Awas Yojana (PMAY-U 2.0).

Dear Sir/Madam,
I request verification of my family parameters for inclusion under the PMAY housing subsidy program. We do not own any pucca structure in India. My family income is ₹1,800,000 (EWS category). 

Please authorize the local surveyor geo-tag check to release the building credit.

Sincerely,
Citizen Applicant`
    },
    {
      id: "atal-pension",
      name: "Atal Pension Yojana (APY)",
      subtitle: "Guaranteed minimum monthly pension scheme for workers in the unorganized sectors.",
      category: "welfare",
      categoryDisplay: "Welfare",
      agency: "Pension Fund Regulatory and Development Authority (PFRDA)",
      eta: "Ledger Seeding: Active",
      geocode: "APY-104",
      lat: "19.0760",
      lng: "72.8777",
      stage: 4,
      docType: "aadhaar",
      log: "Bank account mapped to APY registry. Initial auto-debit contribution clearance initialized.",
      formats: [
        "Applicant age must be between 18 and 40 years of age.",
        "Must possess active savings bank account linked with auto-debit mandate features.",
        "Applicant must not be a registered income tax payer or covered under social security schemes."
      ],
      resolutions: [
        "<strong>Delayed Contribution:</strong> Ensure sufficient balance in bank on auto-debit dates. Delayed payments attract standard interest penalties.",
        "<strong>Taxpayer Ineligibility:</strong> Taxpayers are legally barred from joining. Active audits clear profiles against Income Tax registries.",
        "<strong>Spouse Coverage:</strong> Pension is guaranteed to spouse upon death of subscriber, and corpus is returned to nominee."
      ],
      steps: [
        { num: 1, title: "Age & Bank Audit", desc: "Confirm age limit metrics and fetch auto-debit consent details." },
        { num: 2, title: "Pension Slab Select", desc: "Choose monthly pension targets (₹1,000 - ₹5,000) mapping contributions." },
        { num: 3, title: "PRAN Card Dispatch", desc: "PFRDA maps PRAN (Permanent Retirement Account Number) profile." }
      ],
      defaultAge: 28,
      defaultIncome: 95000,
      defaultLand: 0,
      defaultOccupation: "self-employed",
      draft: `To,
The Branch Manager,
[Name of Savings Account Bank Node].

Subject: Authorization for auto-debit contribution under Atal Pension Yojana.

Dear Sir/Madam,
I am submitting my enrollment profile for the Atal Pension Yojana targeting a monthly pension of ₹5,000 at age 60. I am 28 years of age and do not pay income tax. 

I authorize your branch to initiate auto-debit contributions from my savings account.

Sincerely,
Subscriber Applicant`
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
  setupLetterControls();
  setupDirectorySwitcher();
  setupStaticNavBarLinks();
  setupThemeToggle();
  setupViewRouting();
  setupFloatingChat();
  setupDeleteComplaintBtn();
  
  // Render lists and select default card
  renderServicesDirectory();
  renderGrievancesDirectory();
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

// Main View Routing Controller
function setupViewRouting() {
  const tabs = document.querySelectorAll(".nav-view-tab");
  
  const switchView = (targetViewId) => {
    appState.activeView = targetViewId;
    
    // Toggle active link tags
    tabs.forEach(t => {
      if (t.getAttribute("data-view") === targetViewId) {
        t.className = "text-primary font-bold border-b-2 border-primary pb-1 transition-all duration-300 nav-view-tab active";
      } else {
        t.className = "text-on-surface-variant font-medium hover:text-white transition-all duration-300 nav-view-tab";
      }
    });
    
    // Toggle main views
    document.querySelectorAll(".view-frame").forEach(vf => {
      if (vf.id === targetViewId) {
        vf.classList.remove("hidden");
      } else {
        vf.classList.add("hidden");
      }
    });
    
    // Handle Leaflet map refresh when complaints tab is switched to
    if (targetViewId === 'complaints-view' && appState.activeServiceId.startsWith("complaint-")) {
      setTimeout(() => {
        const ticket = appState.grievances.find(g => g.id === appState.activeServiceId);
        if (ticket) initLeafletMap(parseFloat(ticket.lat), parseFloat(ticket.lng));
      }, 100);
    }
  };
  
  tabs.forEach(t => {
    t.addEventListener("click", (e) => {
      e.preventDefault();
      switchView(t.getAttribute("data-view"));
    });
  });
  
  // Bento Action Cards binding
  const bentoServices = document.getElementById("bento-card-services");
  if (bentoServices) {
    bentoServices.addEventListener("click", () => {
      switchView("services-view");
      selectService("pm-kisan");
    });
  }
  
  const bentoReport = document.getElementById("bento-card-report");
  if (bentoReport) {
    bentoReport.addEventListener("click", () => {
      if (typeof window.openVoiceModal === 'function') {
        window.openVoiceModal();
      } else {
        const modal = document.getElementById("voice-modal");
        if (modal) modal.classList.remove("hidden");
      }
    });
  }
  
  const bentoComplaints = document.getElementById("bento-card-complaints");
  if (bentoComplaints) {
    bentoComplaints.addEventListener("click", () => {
      switchView("complaints-view");
      if (appState.grievances.length > 0) {
        selectService(appState.grievances[0].id);
      }
    });
  }
  
  const bentoSchemes = document.getElementById("bento-card-schemes");
  if (bentoSchemes) {
    bentoSchemes.addEventListener("click", () => {
      switchView("services-view");
      selectService("pm-kisan");
      const evalBtn = document.getElementById("btn-tab-eligibility");
      if (evalBtn) evalBtn.click();
    });
  }
}

// Floating Expandable Chat Assistant Widget
function setupFloatingChat() {
  const triggerBtn = document.getElementById("trigger-floating-chat-btn");
  const closeBtn = document.getElementById("close-floating-chat-btn");
  const chatWindow = document.getElementById("floating-chat-window");
  const chatInput = document.getElementById("floating-chat-input");
  const sendBtn = document.getElementById("send-floating-chat-btn");
  
  if (!triggerBtn || !chatWindow) return;
  
  const toggleChat = () => {
    if (chatWindow.classList.contains("hidden")) {
      chatWindow.classList.remove("hidden");
      setTimeout(() => chatWindow.classList.add("active"), 10);
    } else {
      chatWindow.classList.remove("active");
      setTimeout(() => chatWindow.classList.add("hidden"), 300);
    }
  };
  
  triggerBtn.addEventListener("click", toggleChat);
  if (closeBtn) closeBtn.addEventListener("click", toggleChat);
  
  // Floating Send actions
  const handleFloatingSend = async () => {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;
    
    appendFloatingMessage("user", text);
    chatInput.value = "";
    
    const loader = appendFloatingMessage("bot", `<span class="material-symbols-outlined text-[10px] animate-spin">sync</span> Thinking...`);
    
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          history: [{ role: 'user', parts: [{ text: text }] }],
          language: appState.currentLanguage
        })
      });
      
      if (!response.ok) throw new Error('API failed');
      const data = await response.json();
      
      if (loader) {
        const textEl = loader.querySelector(".message-text");
        if (textEl) textEl.innerHTML = data.reply;
      }
    } catch (err) {
      console.warn("API Failed, simulating locally:", err);
      setTimeout(() => {
        const fallback = generateChatFallback(text);
        if (loader) {
          const textEl = loader.querySelector(".message-text");
          if (textEl) textEl.innerHTML = fallback;
        }
      }, 1000);
    }
  };
  
  if (sendBtn) sendBtn.addEventListener("click", handleFloatingSend);
  if (chatInput) {
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleFloatingSend();
    });
  }
  
  // Home Page query inputs link to expandable chat bubble
  const homeSearchInput = document.getElementById("home-search-input");
  const homeSearchBtn = document.getElementById("home-search-btn");
  
  const handleHomeQuery = () => {
    if (!homeSearchInput) return;
    const query = homeSearchInput.value.trim();
    if (!query) return;
    
    homeSearchInput.value = "";
    
    // Open chat window
    if (chatWindow.classList.contains("hidden")) {
      toggleChat();
    }
    
    // Auto submit to chatbot
    chatInput.value = query;
    handleFloatingSend();
  };
  
  if (homeSearchBtn) homeSearchBtn.addEventListener("click", handleHomeQuery);
  if (homeSearchInput) {
    homeSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleHomeQuery();
    });
  }
  
  // Try asking pills hooks
  document.querySelectorAll(".home-prompt-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      const promptText = pill.getAttribute("data-prompt");
      if (chatWindow.classList.contains("hidden")) {
        toggleChat();
      }
      if (chatInput) {
        chatInput.value = promptText;
        handleFloatingSend();
      }
    });
  });
}

function appendFloatingMessage(role, text) {
  const history = document.getElementById("floating-chat-history");
  if (!history) return null;
  
  const msg = document.createElement("div");
  const isUser = role === "user";
  
  msg.className = `p-2 rounded-lg text-[10px] leading-relaxed flex flex-col ${
    isUser 
      ? "bg-primary/10 ml-4 self-end text-white text-right border border-primary/20" 
      : "bg-white/5 mr-4 self-start text-on-surface-variant border border-white/5"
  }`;
  
  const label = isUser ? "You" : "Companion";
  const labelColor = isUser ? "text-primary" : "text-primary/60";
  
  msg.innerHTML = `
    <span class="block font-bold mb-0.5 ${labelColor} uppercase text-[8px]">${label}</span>
    <div class="message-text">${text}</div>
  `;
  
  history.appendChild(msg);
  history.scrollTop = history.scrollHeight;
  return msg;
}

// Leaflet.js Mapping Initializer Node
function initLeafletMap(lat, lng) {
  const container = document.getElementById("mock-map-canvas");
  if (!container) return;
  
  // Clear layout placeholders
  container.innerHTML = "";
  
  try {
    if (appState.leafletMap) {
      appState.leafletMap.remove();
      appState.leafletMap = null;
    }
    
    appState.leafletMap = L.map('mock-map-canvas', {
      zoomControl: true,
      scrollWheelZoom: false
    }).setView([lat, lng], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(appState.leafletMap);
    
    appState.leafletMarker = L.marker([lat, lng]).addTo(appState.leafletMap);
    
    // Refresh sizing layouts
    setTimeout(() => {
      if (appState.leafletMap) appState.leafletMap.invalidateSize();
    }, 150);
    
  } catch (err) {
    console.warn("Leaflet loading error:", err);
    container.innerHTML = `
      <div class="absolute inset-0 bg-[#111827] flex items-center justify-center text-xs text-on-surface-variant font-mono">
        GIS MAP ERROR: Check network logs
      </div>
    `;
  }
}

// Workspace Tab Navigation
function setupTabs() {
  const triggers = document.querySelectorAll(".tab-trigger");
  triggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      const targetTabId = trigger.getAttribute("aria-controls");
      appState.activeTab = targetTabId.replace("tab-", "");
      
      triggers.forEach(t => {
        t.className = "flex items-center gap-1.5 px-3 py-2 text-on-surface-variant text-xs font-medium hover:bg-white/5 rounded-lg transition-all tab-trigger";
        t.setAttribute("aria-selected", "false");
      });
      
      trigger.className = "flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/10 border border-primary/40 text-primary text-xs font-bold ice-glow transition-all tab-trigger active";
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
    
    const tagline = document.querySelector(".logo-text p");
    if (tagline) tagline.textContent = local.tagline;
    
    const searchInput = document.getElementById("services-search-input");
    if (searchInput) searchInput.setAttribute("placeholder", local.search_placeholder);
    
    const tabGuide = document.getElementById("btn-tab-guide");
    if (tabGuide) tabGuide.innerHTML = `<span class="material-symbols-outlined text-xs">description</span> ${local.tab_guide}`;
    
    const tabEval = document.getElementById("btn-tab-eligibility");
    if (tabEval) tabEval.innerHTML = `<span class="material-symbols-outlined text-xs">fact_check</span> ${local.tab_eligibility}`;
    
    const tabAudit = document.getElementById("btn-tab-preaudit");
    if (tabAudit) tabAudit.innerHTML = `<span class="material-symbols-outlined text-xs">qr_code_scanner</span> ${local.tab_preaudit}`;
    
    const chatInput = document.getElementById("floating-chat-input");
    if (chatInput) chatInput.setAttribute("placeholder", local.chat_input_placeholder);
    
    showToast(`Language updated to ${selector.options[selector.selectedIndex].text}`);
  });
}

// Sidebar Directory switcher (no-op – elements removed in new HTML)
function setupDirectorySwitcher() {}

// Wire workspace-level Delete button
function setupDeleteComplaintBtn() {
  const btn = document.getElementById("delete-complaint-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    if (appState.activeServiceId && appState.activeServiceId.startsWith("complaint-")) {
      deleteGrievance(appState.activeServiceId);
    }
  });
}

// Top Navbar header trigger hooks
function setupStaticNavBarLinks() {
  setupNotificationsPanel();
  setupSensorsPanel();
}

// ─── Notifications Bell ───────────────────────────────────────────────────────
function setupNotificationsPanel() {
  const btn = document.getElementById('btn-notifications');
  if (!btn) return;

  // Build the dropdown panel once and append to body
  const panel = document.createElement('div');
  panel.id = 'notifications-panel';
  panel.className = 'hidden fixed top-20 right-6 z-[999] w-80 glass-panel rounded-xl border border-white/10 shadow-2xl overflow-hidden';
  panel.innerHTML = `
    <div class="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-primary/5">
      <div class="flex items-center gap-2 text-xs font-bold text-white">
        <span class="material-symbols-outlined text-sm text-primary">notifications_active</span>
        Government Alerts
      </div>
      <span class="px-2 py-0.5 rounded-full bg-error/20 text-error text-[9px] font-bold border border-error/20">3 New</span>
    </div>
    <div class="flex flex-col divide-y divide-white/5 max-h-72 overflow-y-auto custom-scrollbar">
      ${[
        { icon: 'campaign', color: 'text-amber-400', bg: 'bg-amber-500/10', title: 'PM-Kisan 17th Instalment', desc: 'Funds disbursed to 93M farmers. Check your bank account for ₹2,000 credit.', time: '2h ago', tag: 'Agriculture' },
        { icon: 'health_and_safety', color: 'text-emerald-400', bg: 'bg-emerald-500/10', title: 'Ayushman Bharat Camp', desc: 'Free health screening camp at your nearest empanelled hospital this Saturday.', time: '5h ago', tag: 'Healthcare' },
        { icon: 'gavel', color: 'text-primary', bg: 'bg-primary/10', title: 'Aadhaar Update Deadline', desc: 'UIDAI has extended free Aadhaar demographic update deadline to Dec 2025.', time: '1d ago', tag: 'Identification' }
      ].map(n => `
        <div class="flex gap-3 items-start px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer">
          <div class="w-8 h-8 rounded-lg ${n.bg} flex items-center justify-center shrink-0 mt-0.5">
            <span class="material-symbols-outlined text-sm ${n.color}">${n.icon}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-center mb-0.5">
              <span class="text-[10px] font-bold text-white truncate">${n.title}</span>
              <span class="text-[8px] text-on-surface-variant ml-2 shrink-0">${n.time}</span>
            </div>
            <p class="text-[9px] text-on-surface-variant leading-relaxed">${n.desc}</p>
            <span class="inline-block mt-1 px-1.5 py-0.5 rounded bg-white/5 text-[8px] text-on-surface-variant">${n.tag}</span>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="px-4 py-2.5 border-t border-white/5 bg-white/5">
      <button class="text-[10px] text-primary hover:underline font-medium w-full text-center" id="mark-all-read-btn">Mark all as read</button>
    </div>
  `;
  document.body.appendChild(panel);

  // Badge dot on the bell
  btn.style.position = 'relative';
  const badge = document.createElement('span');
  badge.id = 'notif-badge';
  badge.className = 'absolute -top-1 -right-1 w-2 h-2 rounded-full bg-error border border-background';
  btn.style.display = 'inline-flex';
  btn.appendChild(badge);

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    sensorsPanel && sensorsPanel.classList.add('hidden');
    panel.classList.toggle('hidden');
  });

  document.addEventListener('click', () => panel.classList.add('hidden'));
  panel.addEventListener('click', e => e.stopPropagation());

  const markAllBtn = document.getElementById('mark-all-read-btn');
  if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
      badge.classList.add('hidden');
      panel.classList.add('hidden');
      showToast('All notifications marked as read.');
    });
  }
}

// ─── Live Sensor / System Status ─────────────────────────────────────────────
let sensorsPanel = null;
function setupSensorsPanel() {
  const btn = document.getElementById('btn-sensors');
  if (!btn) return;

  sensorsPanel = document.createElement('div');
  sensorsPanel.id = 'sensors-panel';
  sensorsPanel.className = 'hidden fixed top-20 right-6 z-[999] w-80 glass-panel rounded-xl border border-white/10 shadow-2xl overflow-hidden';

  const services = [
    { name: 'Gemini AI Gateway',      status: 'Operational',  color: 'bg-emerald-400', ping: '42ms' },
    { name: 'myScheme Portal',         status: 'Operational',  color: 'bg-emerald-400', ping: '81ms' },
    { name: 'UIDAI Aadhaar API',       status: 'Operational',  color: 'bg-emerald-400', ping: '130ms' },
    { name: 'Leaflet Maps CDN',        status: 'Operational',  color: 'bg-emerald-400', ping: '28ms' },
    { name: 'Income Tax e-Filing',     status: 'Degraded',     color: 'bg-amber-400',   ping: '320ms' },
    { name: 'PFMS DBT Gateway',        status: 'Operational',  color: 'bg-emerald-400', ping: '95ms' },
  ];

  sensorsPanel.innerHTML = `
    <div class="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-primary/5">
      <div class="flex items-center gap-2 text-xs font-bold text-white">
        <span class="material-symbols-outlined text-sm text-primary">sensors</span>
        Live System Status
      </div>
      <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold border border-emerald-500/20 flex items-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
        5/6 Online
      </span>
    </div>
    <div class="flex flex-col divide-y divide-white/5">
      ${services.map(s => `
        <div class="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors">
          <span class="w-2 h-2 rounded-full ${s.color} shrink-0 ${s.status === 'Operational' ? 'shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'shadow-[0_0_6px_rgba(251,191,36,0.8)]'}"></span>
          <span class="flex-1 text-[10px] text-white font-medium">${s.name}</span>
          <span class="text-[9px] ${s.status === 'Operational' ? 'text-emerald-400' : 'text-amber-400'} font-semibold">${s.status}</span>
          <span class="text-[9px] text-on-surface-variant font-mono">${s.ping}</span>
        </div>
      `).join('')}
    </div>
    <div class="px-4 py-2.5 border-t border-white/5 bg-white/5 flex justify-between items-center">
      <span class="text-[9px] text-on-surface-variant">Last checked: just now</span>
      <button id="refresh-status-btn" class="text-[10px] text-primary hover:underline font-medium flex items-center gap-1">
        <span class="material-symbols-outlined text-[11px]">refresh</span> Refresh
      </button>
    </div>
  `;
  document.body.appendChild(sensorsPanel);

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const notifPanel = document.getElementById('notifications-panel');
    if (notifPanel) notifPanel.classList.add('hidden');
    sensorsPanel.classList.toggle('hidden');
  });

  document.addEventListener('click', () => { if (sensorsPanel) sensorsPanel.classList.add('hidden'); });
  sensorsPanel.addEventListener('click', e => e.stopPropagation());

  const refreshBtn = document.getElementById('refresh-status-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      refreshBtn.innerHTML = `<span class="material-symbols-outlined text-[11px] animate-spin">sync</span> Checking...`;
      setTimeout(() => {
        refreshBtn.innerHTML = `<span class="material-symbols-outlined text-[11px]">refresh</span> Refresh`;
        showToast('All system statuses refreshed!');
      }, 1200);
    });
  }
}

// Search and Category filtering modules
function setupServicesSearch() {
  const searchInput = document.getElementById("services-search-input");
  const categoryChips = document.querySelectorAll(".category-chip");
  
  if (!searchInput) return;
  
  const handleFilter = () => {
    appState.searchQuery = searchInput.value.toLowerCase().trim();
    renderServicesDirectory();
  };
  
  searchInput.addEventListener("input", handleFilter);
  
  categoryChips.forEach(chip => {
    chip.addEventListener("click", () => {
      categoryChips.forEach(c => {
        c.className = "category-chip bg-white/5 border border-white/5 text-on-surface-variant text-[9px] px-2.5 py-1 rounded-full hover:bg-white/10";
      });
      chip.className = "category-chip bg-primary/10 border border-primary/20 text-primary text-[9px] px-2.5 py-1 rounded-full font-semibold";
      
      appState.activeCategory = chip.getAttribute("data-category");
      renderServicesDirectory();
      showToast(`Showing: ${chip.textContent.trim()}`);
    });
  });
}

// Render dynamic directory cards (Services)
function renderServicesDirectory() {
  const container = document.getElementById("services-list-container");
  if (!container) return;
  
  container.innerHTML = "";
  
  const filtered = appState.services.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(appState.searchQuery) || 
                          item.subtitle.toLowerCase().includes(appState.searchQuery) ||
                          item.categoryDisplay.toLowerCase().includes(appState.searchQuery);
                          
    const matchesCategory = appState.activeCategory === 'all' || item.category === appState.activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  if (filtered.length === 0) {
    container.innerHTML = `<div class="p-3 text-center text-[10px] text-on-surface-variant">No schemes match.</div>`;
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
    
    card.innerHTML = `
      <div class="flex justify-between items-center w-full">
        <span class="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-on-surface-variant'}">${escapeHTML(item.categoryDisplay)}</span>
        <span class="text-[9px] opacity-75">${item.id.toUpperCase()}</span>
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

// Render dynamic directory cards (Grievances)
function renderGrievancesDirectory() {
  const container = document.getElementById("grievances-list-container");
  if (!container) return;
  
  container.innerHTML = "";

  if (appState.grievances.length === 0) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-10 text-center gap-2">
        <span class="material-symbols-outlined text-3xl text-on-surface-variant/40">assignment_late</span>
        <p class="text-[10px] text-on-surface-variant">No complaints lodged yet.</p>
        <p class="text-[10px] text-on-surface-variant/60">Use "Lodge Voice Complaint" below.</p>
      </div>
    `;
    return;
  }
  
  appState.grievances.forEach(item => {
    const wrapper = document.createElement("div");
    wrapper.className = "relative group";

    const isActive = appState.activeServiceId === item.id;
    const activeClass = isActive 
      ? "bg-primary/10 border-primary/30 text-primary" 
      : "bg-white/5 border-white/5 hover:bg-white/10 text-on-surface-variant";
    
    const card = document.createElement("button");
    card.type = "button";
    card.className = `w-full text-left p-3 rounded-lg border transition-all text-xs flex flex-col gap-1.5 service-item-card ${activeClass} pr-8`;
    
    card.innerHTML = `
      <div class="flex justify-between items-center w-full">
        <span class="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-white/5 text-on-surface-variant">${escapeHTML(item.categoryDisplay)}</span>
        <span class="text-[9px] opacity-75">${item.geocode || item.id.toUpperCase()}</span>
      </div>
      <h4 class="font-bold text-white leading-tight truncate w-full">${escapeHTML(item.name)}</h4>
      <p class="text-[10px] text-on-surface-variant truncate w-full">${escapeHTML(item.location || "")}</p>
    `;
    card.addEventListener("click", () => selectService(item.id));

    // Small trash button overlaid top-right of each card
    const trashBtn = document.createElement("button");
    trashBtn.type = "button";
    trashBtn.title = "Delete complaint";
    trashBtn.className = "absolute top-2 right-2 w-6 h-6 rounded flex items-center justify-center text-on-surface-variant/40 hover:text-error hover:bg-error/10 transition-all opacity-0 group-hover:opacity-100";
    trashBtn.innerHTML = `<span class="material-symbols-outlined text-[13px]">delete</span>`;
    trashBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteGrievance(item.id);
    });

    wrapper.appendChild(card);
    wrapper.appendChild(trashBtn);
    container.appendChild(wrapper);
  });
}

// ── Delete a grievance with confirmation ─────────────────────────────────────
function deleteGrievance(id) {
  const item = appState.grievances.find(g => g.id === id);
  if (!item) return;

  // Build a lightweight in-page confirmation dialog
  const overlay = document.createElement("div");
  overlay.id = "delete-confirm-overlay";
  overlay.className = "fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm";
  overlay.innerHTML = `
    <div class="glass-panel border border-error/20 rounded-2xl p-6 w-80 shadow-2xl flex flex-col gap-4 animate-[fadeIn_0.2s_ease]">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-error/15 border border-error/20 flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-error">delete_forever</span>
        </div>
        <div>
          <h4 class="text-sm font-bold text-white">Delete Complaint?</h4>
          <p class="text-[10px] text-on-surface-variant mt-0.5">This action cannot be undone.</p>
        </div>
      </div>
      <div class="bg-white/5 border border-white/5 rounded-lg px-3 py-2">
        <p class="text-[10px] text-on-surface font-medium leading-relaxed truncate" title="${escapeHTML(item.name)}">${escapeHTML(item.name)}</p>
        <p class="text-[9px] text-on-surface-variant mt-0.5">${escapeHTML(item.geocode || id)}</p>
      </div>
      <div class="flex gap-2 justify-end">
        <button id="delete-cancel-btn" class="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-[10px] font-semibold hover:bg-white/10 transition-all">
          Cancel
        </button>
        <button id="delete-confirm-btn" class="px-4 py-1.5 rounded-lg bg-error/20 border border-error/30 text-error text-[10px] font-bold hover:bg-error/30 transition-all flex items-center gap-1">
          <span class="material-symbols-outlined text-[12px]">delete</span> Delete
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Cancel
  document.getElementById("delete-cancel-btn").addEventListener("click", () => {
    overlay.remove();
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });

  // Confirm delete
  document.getElementById("delete-confirm-btn").addEventListener("click", () => {
    overlay.remove();

    // Remove from state
    appState.grievances = appState.grievances.filter(g => g.id !== id);

    // Destroy Leaflet map if it was showing
    if (appState.leafletMap) {
      appState.leafletMap.remove();
      appState.leafletMap = null;
    }

    // Re-render sidebar
    renderGrievancesDirectory();

    // Show empty state or select next complaint
    const content = document.getElementById("grievance-workspace-content");
    const empty   = document.getElementById("grievance-workspace-empty");

    if (appState.grievances.length > 0) {
      selectService(appState.grievances[0].id);
    } else {
      appState.activeServiceId = null;
      if (content) content.classList.add("hidden");
      if (empty)   empty.classList.remove("hidden");
    }

    showToast("Complaint deleted successfully.");
  });
}

// Router select details visual swapper
function selectService(serviceId) {
  appState.activeServiceId = serviceId;
  
  const isGrievance = serviceId.startsWith("complaint-");
  
  // Re-highlight cards
  renderServicesDirectory();
  renderGrievancesDirectory();
  
  const empty = document.getElementById(isGrievance ? "grievance-workspace-empty" : "service-workspace-empty");
  const content = document.getElementById(isGrievance ? "grievance-workspace-content" : "service-workspace-content");
  
  if (isGrievance) {
    const activeEmpty = document.getElementById("service-workspace-empty");
    const activeContent = document.getElementById("service-workspace-content");
    if (activeEmpty) activeEmpty.classList.remove("hidden");
    if (activeContent) activeContent.classList.add("hidden");
  } else {
    const activeEmpty = document.getElementById("grievance-workspace-empty");
    const activeContent = document.getElementById("grievance-workspace-content");
    if (activeEmpty) activeEmpty.classList.remove("hidden");
    if (activeContent) activeContent.classList.add("hidden");
  }
  
  if (empty) empty.classList.add("hidden");
  if (content) content.classList.remove("hidden");
  
  renderActiveServiceDetails();
}

// Render dynamic elements to pane components
function renderActiveServiceDetails() {
  const isGrievance = appState.activeServiceId.startsWith("complaint-");
  const pool = isGrievance ? appState.grievances : appState.services;

  const item = pool.find(i => i.id === appState.activeServiceId);
  if (!item) return;

  // Safe helpers
  const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
  const setHtml = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };

  // ── Shared fields that exist in BOTH service and grievance workspaces ─────
  setText("detail-assigned-agency", item.agency || "—");
  setHtml("detail-agency-log", item.log || "Transaction logged.");
  setText("detail-draft-text", item.draft || "Representation text pending.");
  setText("detail-lat-lng", `Lat: ${item.lat || "--"}, Lng: ${item.lng || "--"}`);
  setText("detail-geocode", item.geocode || "---");

  // ── Grievance-specific fields ─────────────────────────────────────────────
  if (isGrievance) {
    setText("grievance-service-tag", item.categoryDisplay || "Municipal");
    setText("grievance-service-title", item.name || "Complaint");
    setText("grievance-service-subtitle", item.subtitle || item.location || "");
    setText("assigned-agency-header", "Assigned Municipal Department");

    // Initialise Leaflet map (must be visible first)
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lng);
    if (!isNaN(lat) && !isNaN(lng)) {
      // Use requestAnimationFrame to ensure the container is visible/sized
      requestAnimationFrame(() => {
        setTimeout(() => initLeafletMap(lat, lng), 80);
      });
    }

  // ── Service-specific fields ───────────────────────────────────────────────
  } else {
    setText("active-service-tag", item.categoryDisplay || "");
    setText("active-service-title", item.name || "");
    setText("active-service-subtitle", item.subtitle || "");
    setText("assigned-agency-header", "Assigned Department Office");

    // Guidelines list
    const formatsList = document.getElementById("active-guide-formats");
    if (formatsList) {
      if (item.formats && item.formats.length) {
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
      } else {
        formatsList.innerHTML = `<li class="text-on-surface-variant">General information and updates.</li>`;
      }
    }

    const resolutionsList = document.getElementById("active-guide-resolutions");
    if (resolutionsList) {
      if (item.resolutions && item.resolutions.length) {
        resolutionsList.innerHTML = "";
        item.resolutions.forEach(r => {
          const li = document.createElement("li");
          li.className = "flex gap-4";
          li.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-error mt-2.5 shrink-0"></span><div>${r}</div>`;
          resolutionsList.appendChild(li);
        });
      } else {
        resolutionsList.innerHTML = `<li class="text-on-surface-variant">Check official portal.</li>`;
      }
    }

    const stepsContainer = document.getElementById("active-guide-steps");
    if (stepsContainer) {
      if (item.steps && item.steps.length) {
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
      } else {
        stepsContainer.innerHTML = `<div class="glass-panel p-5 rounded-xl border border-white/5 text-xs text-on-surface-variant">Follow guidelines in previous tabs.</div>`;
      }
    }

    // Default evaluator inputs
    const inputAge = document.getElementById("scheme-age");
    if (inputAge) inputAge.value = item.defaultAge || 35;

    const inputIncome = document.getElementById("scheme-income");
    if (inputIncome) inputIncome.value = item.defaultIncome || 120000;

    const inputLand = document.getElementById("scheme-land");
    if (inputLand) {
      inputLand.value = item.defaultLand || 0;
      inputLand.disabled = item.category !== 'agriculture';
    }

    const selectOcc = document.getElementById("scheme-occupation");
    if (selectOcc) selectOcc.value = item.defaultOccupation || "salaried";

    resetEvaluatorDisplay(item);
    resetOCRScannerDisplay(item);
  }

  // ── Pipeline timeline (shared, exists in grievance workspace) ─────────────
  const pipelineStages = document.getElementById("pipeline-stages-container");
  if (pipelineStages) {
    pipelineStages.innerHTML = "";
    const stageCount = 5;
    for (let num = 1; num <= stageCount; num++) {
      const isCompleted = num < item.stage;
      const isCurrent   = num === item.stage;

      let stateClass = "text-on-surface-variant";
      let dotClass   = "bg-surface-container border-white/5 text-on-surface-variant";

      if (isCompleted) {
        stateClass = "text-primary font-semibold";
        dotClass   = "bg-primary border-primary text-background shadow-[0_0_15px_rgba(125,211,252,0.4)]";
      } else if (isCurrent) {
        if (item.stage === 5) {
          stateClass = "text-primary font-semibold";
          dotClass   = "bg-primary border-primary text-background shadow-[0_0_15px_rgba(125,211,252,0.4)]";
        } else {
          stateClass = "text-amber-500 font-semibold";
          dotClass   = "bg-amber-500 border-amber-500 text-background shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-pulse";
        }
      }

      const stageName = isGrievance
        ? { 1: "Lodge", 2: "Assign", 3: "Verify", 4: "Action", 5: "Resolved" }[num]
        : { 1: "Lodge", 2: "Audit",  3: "Sanction", 4: "Release", 5: "Complete" }[num];

      const dateText = num <= item.stage ? "07 Jul" : "--";
      const iconName = isGrievance
        ? { 1: "assignment", 2: "person_search", 3: "verified_user", 4: "engineering", 5: "task_alt" }[num]
        : { 1: "assignment", 2: "find_in_page",  3: "gavel",        4: "payments",   5: "task_alt" }[num];

      const stepDiv = document.createElement("div");
      stepDiv.className = `stage-step flex flex-col items-center w-12 ${stateClass}`;
      stepDiv.innerHTML = `
        <div class="stage-dot w-9 h-9 rounded-full border flex items-center justify-center text-sm shrink-0 transition-all ${dotClass}">
          <span class="material-symbols-outlined text-xs">${iconName}</span>
        </div>
        <span class="stage-label text-[10px] mt-2">${stageName}</span>
        <span class="stage-date text-[8px] opacity-75 mt-0.5">${dateText}</span>
      `;
      pipelineStages.appendChild(stepDiv);
    }
  }

  // Progress bar fill
  const fill = document.getElementById("pipeline-progress-fill");
  if (fill) {
    const pctMap = { 1: 5, 2: 25, 3: 50, 4: 75, 5: 100 };
    fill.style.width = `${pctMap[item.stage] || 5}%`;
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
  if (briefEl) briefEl.textContent = "Adjust parameters and run checks.";
  if (meter) meter.style.background = `conic-gradient(rgba(255,255,255,0.06) 360deg, transparent 0deg)`;
  
  if (checkedList) checkedList.innerHTML = `<li>Awaiting evaluator activation...</li>`;
  if (exclusionsList) exclusionsList.innerHTML = `<li>Awaiting parameters check...</li>`;
  
  if (checklist) {
    checklist.innerHTML = `
      <label class="flex items-center gap-2 text-[10px] text-on-surface-variant">
        <input type="checkbox" disabled class="rounded border-white/10 bg-transparent text-primary focus:ring-0">
        <span>Awaiting calculations.</span>
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

// Document OCR pre-screener (With Real Dropzone upload triggers)
function setupDocumentOCRScanner() {
  const simAadhaar = document.getElementById("sim-aadhaar-btn");
  const simPan = document.getElementById("sim-pan-btn");
  const prompt = document.getElementById("dropzone-prompt");
  const box = document.getElementById("ocr-results-box");
  const zone = document.getElementById("ocr-dropzone");
  const laser = document.getElementById("scanner-laser");
  const resetBtn = document.getElementById("reset-ocr-btn");
  const fileInput = document.getElementById("ocr-file-input");
  
  const handleOcrSimulation = (docType) => {
    if (zone) zone.classList.add("scanning");
    if (laser) laser.classList.remove("hidden");
    showToast("Scanning: Extracting document parameters with OCR...");
    
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
          badge.className = "px-2 py-0.5 rounded bg-error/20 text-error text-[9px] font-bold uppercase border border-error/25";
        }
        if (findings) findings.innerHTML = `<strong>Aadhaar Demographic Scan:</strong> Name spelling discrepancy. Document states <strong>"Rajesh Kumar"</strong>, which does not match active service registry listing of <strong>"Rajesh K. Sharma"</strong>.`;
        if (resolutions) resolutions.innerHTML = `<strong>Suggested Action:</strong> Request demographic name correction via UIDAI online portal or submit Gazetted affidavit.`;
        showToast("Scanner Alert: spelling discrepancy found.", true);
      } else {
        if (badge) {
          badge.textContent = "Database Link Warning";
          badge.className = "px-2 py-0.5 rounded bg-error/20 text-error text-[9px] font-bold uppercase border border-error/25";
        }
        if (findings) findings.innerHTML = `<strong>PAN Registry Linkage:</strong> Linking failure. Card is active but lacks mapped biometric validation mapping to Aadhaar database.`;
        if (resolutions) resolutions.innerHTML = `<strong>Suggested Action:</strong> Visit e-filing portal and submit PAN-Aadhaar linking request (requires seeding fee).`;
        showToast("Scanner Alert: database linkage required.", true);
      }
    }, 2000);
  };
  
  if (simAadhaar) {
    simAadhaar.addEventListener("click", (e) => {
      e.stopPropagation(); // Avoid triggering parent click
      handleOcrSimulation('aadhaar');
    });
  }
  if (simPan) {
    simPan.addEventListener("click", (e) => {
      e.stopPropagation(); // Avoid triggering parent click
      handleOcrSimulation('pan');
    });
  }
  
  // Real File Pick Click Trigger
  if (zone && fileInput) {
    zone.addEventListener("click", () => {
      fileInput.click();
    });
    
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        showToast(`Document uploaded: "${file.name}"`);
        handleOcrSimulation('aadhaar'); // Run audit simulation
      }
    });
    
    // Drag-and-drop triggers
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("dragover");
    });
    zone.addEventListener("dragenter", (e) => {
      e.preventDefault();
      zone.classList.add("dragover");
    });
    zone.addEventListener("dragleave", () => {
      zone.classList.remove("dragover");
    });
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("dragover");
      const file = e.dataTransfer.files[0];
      if (file) {
        showToast(`Dropped file: "${file.name}"`);
        handleOcrSimulation('aadhaar');
      }
    });
  }
  
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const service = appState.services.find(s => s.id === appState.activeServiceId);
      if (service) resetOCRScannerDisplay(service);
    });
  }
}

// Scheme Eligibility Calculations (Supports all 6 schemes dynamically)
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
    const income = incomeEl ? parseInt(incomeEl.value) : 120000;
    const land = landEl ? parseFloat(landEl.value) : 1.5;
    
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
        } else if (service.id === 'pm-awas') {
          if (income > 300000) {
            pct = 25;
            prob = "Low (Ineligible)";
            explanation = "Applicant family income exceeds the threshold for EWS/LIG housing grants.";
            exclusions.push("Income exceeds EWS/LIG category limit.");
          } else {
            pct = 92;
            prob = "Very High (Eligible)";
            explanation = "Applicant fits under PMAY low-income category rules with no registered house.";
            eligible.push("Household income within EWS bounds.");
            eligible.push("No pucca house registered in India.");
          }
          docs = [
            { name: "Identity Proof (Aadhaar Card of all members)", status: "checked" },
            { name: "Income Certificate issued by Revenue Authority", status: "unchecked" },
            { name: "Self-Affidavit of zero property ownership", status: "checked" }
          ];
        } else if (service.id === 'atal-pension') {
          if (age < 18 || age > 40) {
            pct = 10;
            prob = "Low (Ineligible)";
            explanation = "Subscriber must be between 18 and 40 years of age at joining.";
            exclusions.push("Age falls outside the 18-40 window.");
          } else {
            pct = 96;
            prob = "Very High (Eligible)";
            explanation = "Subscriber complies with age boundaries and is not an active taxpayer.";
            eligible.push("Age is within 18-40 window.");
            eligible.push("Non-taxpayer profile verified.");
          }
          docs = [
            { name: "Bank Passbook with auto-debit consent", status: "checked" },
            { name: "Aadhaar Card of Subscriber", status: "checked" }
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
          } else if (item.id === 'pm-awas') {
            detailDraft.textContent = `सेवा में,
नगर आयुक्त (आवास प्रभाग),
राज्य विकास प्राधिकरण।

विषय: प्रधानमंत्री आवास योजना (PMAY-U) के तहत आवास अनुदान के लिए अनुरोध।

महोदय/महोदया,
मैं आवास योजना सब्सिडी के लिए अपने परिवार की पात्रता प्रस्तुत कर रहा हूँ। हमारे पास कोई पक्का मकान नहीं है।

कृपया आवास सर्वेक्षण अधिकृत करें।

भवदीय,
आवेदक`;
          } else if (item.id === 'atal-pension') {
            detailDraft.textContent = `सेवा में,
शाखा प्रबंधक,
[बचत खाता बैंक]।

विषय: अटल पेंशन योजना के तहत ऑटो-डेबिट के लिए सहमति।

महोदय/महोदया,
मैं अपनी आयु 28 वर्ष के अनुकूल प्रति माह ₹5,000 की पेंशन के लिए आवेदन पत्र जमा कर रहा हूँ।

कृपया मेरे बचत खाते से मासिक योगदान शुरू करें।

भवदीय,
आवेदक`;
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

// Conversational AI Copilot Companion
function setupChatCompanion() {
  // Configured inside setupFloatingChat() to run dynamically inside the expandable widget panel
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
  if (text.includes("awas") || text.includes("home") || text.includes("house")) {
    return `PM Awas Yojana (PMAY):
    - Grants for EWS/LIG families without pucca housing.
    - Submit Aadhaar of all members, Income Certificate, and property self-affidavit.`;
  }
  if (text.includes("pension") || text.includes("atal")) {
    return `Atal Pension Yojana (APY):
    - Guaranteed monthly pension for unorganized sector workers (age 18-40).
    - Must possess active savings bank account for auto-debit contribution.`;
  }
  return `I have registered your query: "${escapeHTML(q)}". Ask me about "Aadhaar correction", "Ujjwala LPG", "Sukanya girl child account", "Awas house grants", or "Atal Pension registration".`;
}

// SECONDARY FEATURE: Voice Grievance Modal Overlay (MORPHS UI LIVE)
function setupVoiceModalRecorder() {
  const openBtn = document.getElementById("open-voice-modal-btn");
  const closeBtn = document.getElementById("close-voice-modal-btn");
  const modal = document.getElementById("voice-modal");
  
  if (!modal) return;

  // Open modal from sidebar button (complaints view)
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");
      showToast("Opened Voice Grievance modal.");
    });
  }

  // Also expose a global opener for bento card and other triggers
  window.openVoiceModal = () => {
    modal.classList.remove("hidden");
    showToast("Opened Voice Grievance modal.");
  };
  
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
  
  // Modal form submit (MORPHS UI LIVE)
  const submitBtn = document.getElementById("modal-submit-btn");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const textVal = textInput ? textInput.value.trim() : "";
      const locInput = document.getElementById("modal-location-input");
      const locVal = locInput ? locInput.value.trim() : "";
      const catSelect = document.getElementById("modal-category-select");
      const categoryVal = catSelect ? catSelect.value : "auto";
      
      if (!textVal) {
        showToast("Error: Please describe your issue before submitting.", true);
        return;
      }
      if (!locVal) {
        showToast("Error: Please enter a location landmark.", true);
        return;
      }
      
      // Disable button to prevent double-submit
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="material-symbols-outlined text-[14px] align-middle mr-1 animate-spin">sync</span> Processing...`;
      showToast("Geocoding coordinates and linking municipal agency...");
      
      setTimeout(() => {
        // Smart auto-detect category from transcript text
        let detectedCategory = categoryVal;
        if (categoryVal === 'auto') {
          const lower = textVal.toLowerCase();
          if (lower.includes('street') || lower.includes('light') || lower.includes('lamp') || lower.includes('electric') || lower.includes('bijli') || lower.includes('bulb')) {
            detectedCategory = 'Streetlight';
          } else if (lower.includes('pothole') || lower.includes('road') || lower.includes('sadak') || lower.includes('gaddha') || lower.includes('pit')) {
            detectedCategory = 'Roads';
          } else if (lower.includes('garbage') || lower.includes('waste') || lower.includes('kachra') || lower.includes('trash') || lower.includes('dustbin')) {
            detectedCategory = 'Waste';
          } else if (lower.includes('sewage') || lower.includes('drain') || lower.includes('naali') || lower.includes('overflow') || lower.includes('nali')) {
            detectedCategory = 'Sewage';
          } else if (lower.includes('water') || lower.includes('pani') || lower.includes('pipe') || lower.includes('supply')) {
            detectedCategory = 'Water';
          } else {
            detectedCategory = 'General';
          }
        }

        const agencyName = getAgencyNameLocally(detectedCategory, locVal);
        const geocode = `JW-GRI-${Math.floor(100 + Math.random() * 900)}`;
        const localDraft = generateDraftLocally(detectedCategory, locVal, textVal);
        
        // Generate valid random coordinates near Indian cities
        const cityCoords = getCityCoords(locVal);
        const latOffset = (Math.random() - 0.5) * 0.08;
        const lngOffset = (Math.random() - 0.5) * 0.08;
        const finalLat = (cityCoords.lat + latOffset).toFixed(6);
        const finalLng = (cityCoords.lng + lngOffset).toFixed(6);

        const newId = `complaint-${Date.now()}`;
        const newGrievance = {
          id: newId,
          name: textVal.length > 45 ? textVal.substring(0, 45) + "..." : textVal,
          subtitle: textVal,
          category: detectedCategory.toLowerCase(),
          categoryDisplay: detectedCategory,
          location: locVal,
          agency: agencyName,
          eta: "3-5 Business Days",
          geocode: geocode,
          lat: finalLat,
          lng: finalLng,
          stage: 2,
          log: `Grievance registered at <strong>${escapeHTML(locVal)}</strong>. Department linked: <strong>${escapeHTML(agencyName)}</strong>. Scheduled for field audit.`,
          draft: localDraft
        };
        
        // Append to state
        appState.grievances.unshift(newGrievance);
        renderGrievancesDirectory();
        
        // Switch to complaints view first, then select the new card
        appState.activeView = 'complaints-view';
        document.querySelectorAll(".view-frame").forEach(vf => {
          vf.classList.toggle('hidden', vf.id !== 'complaints-view');
        });
        document.querySelectorAll(".nav-view-tab").forEach(t => {
          if (t.getAttribute('data-view') === 'complaints-view') {
            t.className = "text-primary font-bold border-b-2 border-primary pb-1 transition-all duration-300 nav-view-tab active";
          } else {
            t.className = "text-on-surface-variant font-medium hover:text-white transition-all duration-300 nav-view-tab";
          }
        });

        // Select the new complaint card
        selectService(newId);

        // Init map with real coords
        setTimeout(() => {
          initLeafletMap(parseFloat(finalLat), parseFloat(finalLng));
        }, 200);
        
        // Hide Modal and reset
        modal.classList.add("hidden");
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span class="material-symbols-outlined text-[14px] align-middle mr-1">check_circle</span> Submit Grievance`;
        showToast(`✓ Grievance registered! Tracking ID: ${geocode}`);
        
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

// City coordinate lookup for real Leaflet map placement
function getCityCoords(location) {
  const lower = location.toLowerCase();
  if (lower.includes('delhi') || lower.includes('dwarka') || lower.includes('noida') || lower.includes('gurgaon')) return { lat: 28.6139, lng: 77.2090 };
  if (lower.includes('chennai') || lower.includes('anna nagar') || lower.includes('tambaram')) return { lat: 13.0827, lng: 80.2707 };
  if (lower.includes('bengaluru') || lower.includes('bangalore') || lower.includes('indiranagar') || lower.includes('whitefield')) return { lat: 12.9716, lng: 77.5946 };
  if (lower.includes('hyderabad') || lower.includes('ameerpet') || lower.includes('secunderabad')) return { lat: 17.3850, lng: 78.4867 };
  if (lower.includes('mumbai') || lower.includes('pune') || lower.includes('thane')) return { lat: 19.0760, lng: 72.8777 };
  if (lower.includes('kolkata') || lower.includes('howrah')) return { lat: 22.5726, lng: 88.3639 };
  if (lower.includes('lucknow') || lower.includes('kanpur')) return { lat: 26.8467, lng: 80.9462 };
  if (lower.includes('jaipur') || lower.includes('rajasthan')) return { lat: 26.9124, lng: 75.7873 };
  if (lower.includes('ahmedabad') || lower.includes('surat') || lower.includes('gujarat')) return { lat: 23.0225, lng: 72.5714 };
  // Default to centre of India
  return { lat: 20.5937, lng: 78.9629 };
}

// Local Fallbacks
function getAgencyNameLocally(category, location) {
  const lower = location.toLowerCase();
  let city = "Municipal Council";
  if (lower.includes("delhi") || lower.includes("dwarka") || lower.includes("noida")) city = "Delhi Municipal Corporation (MCD)";
  else if (lower.includes("chennai") || lower.includes("anna nagar")) city = "Greater Chennai Corporation (GCC)";
  else if (lower.includes("bengaluru") || lower.includes("bangalore") || lower.includes("indiranagar")) city = "Bruhat Bengaluru Mahanagara Palike (BBMP)";
  else if (lower.includes("hyderabad") || lower.includes("ameerpet")) city = "Greater Hyderabad Municipal Corporation (GHMC)";
  else if (lower.includes("mumbai") || lower.includes("thane")) city = "Brihanmumbai Municipal Corporation (BMC)";
  else if (lower.includes("kolkata") || lower.includes("howrah")) city = "Kolkata Municipal Corporation (KMC)";
  else if (lower.includes("pune")) city = "Pune Municipal Corporation (PMC)";
  
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
