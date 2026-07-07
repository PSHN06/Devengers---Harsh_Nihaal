# JanVaani.ai 🏛️
> **Vaani-to-Action AI:** Translating colloquial vernacular voice descriptions into geo-tagged, administrative-grade complaints, tracking public issues, and simplifying government schemes for digital inclusion.

[![Deployment Status](https://img.shields.io/badge/Vercel-Deployed-emerald?style=flat-square&logo=vercel)](https://github.com/PSHN06/Devengers---Harsh_Nihaal.git)
[![AI Engine](https://img.shields.io/badge/GenAI-Gemini%203.5%20Flash-blue?style=flat-square&logo=google)](https://ai.google.dev/)
[![Stack](https://img.shields.io/badge/Stack-Vanilla%20HTML%20/%20CSS%20/%20JS-success?style=flat-square)](https://developer.mozilla.org/)

---

## ⚡ Deployed Application Link
**Live Preview URL:** *[Insert Deployed Link Here]*

---

## 💡 The Core Problem & Strategic Angle
Navigating public administration in India is hindered by bureaucratic jargon, spelling mismatches in files, and a language barrier. For low-literacy or mobile-first citizens, reporting a basic issue is intimidating.

**JanVaani.ai** addresses this pain point with the **Voice-to-Action Hyper-Local Pipeline**. It allows users to speak naturally in their regional Indian dialect. JanVaani.ai automatically translates the statement, auto-detects the administrative department, generates a formal administrative-grade official draft in English, resolves coordinate geo-tags, and links the complaint to an interactive pipeline tracker.

---

## 🚀 Key Features

*   🎙️ **Hyper-Local Voice-to-Administrative Draft Pipeline:** Dynamic speech recorder simulator which captures colloquial voice reports in regional languages (Hindi, Tamil, Telugu, Kannada, etc.) and uses **Gemini 3.5 Flash** to draft formal English petition letters.
*   🗺️ **Geo-Tag & Department Mapper:** Resolves colloquial location landmarks into coordinate pairs and maps tickets to municipal bodies (like MCD Delhi, GCC Chennai, BBMP Bangalore).
*   📊 **Dynamic Status Timeline:** Visual step-by-step progress tracker indicating assigned ULB divisions, milestones (Lodge ➡️ Assign ➡️ Verify ➡️ Action ➡️ Resolve), and automatic resolution ETA.
*   ⚖️ **Intelligent Scheme Eligibility Evaluator:** AI-driven pre-screening check confirming citizen criteria (age, income, landholdings) against major welfare schemes (PM-Kisan, PM-JAY, PMAY) and providing a simplified document checklist.
*   🛡️ **Document Pre-Screener & Guide:** Step-by-step guidelines on formatting requirements, physical validation criteria, and how to correct spelling or address mismatches on official cards (Aadhaar, PAN, Ration Card).
*   💬 **Civic Companion AI:** Conversational interface giving citizens administrative assistance, details on offline procedures, and resolving complex questions in their local language.

---

## 🛡️ Security & Performance Focus
1.  **Secret Redirection:** Uses Vercel serverless function (`/api/gemini.js`) to secure `GEMINI_API_KEY`, avoiding exposing private API credentials to client scripts.
2.  **Strict Security Headers:** Implements CSP restrictions, clickjacking blocks (`X-Frame-Options`), and script sniffing preventions inside `vercel.json`.
3.  **XSS Protection:** Meticulously sanitizes all input strings prior to injecting content into the DOM using safe browser API bindings.
4.  **Graceful Degrades:** Implements an offline rule-based simulation engine to ensure fully functional interfaces and mock operations if API quotas fail.

---

## 🛠️ Local Setup (3 Steps Max)

### 1. Clone the Repository
```bash
git clone https://github.com/PSHN06/Devengers---Harsh_Nihaal.git
cd Devengers---Harsh_Nihaal
```

### 2. Configure Environment Variable
Create a `.env` file in the root folder or set it in your local terminal:
```bash
GEMINI_API_KEY="your_api_key_here"
```

### 3. Run Dev Server
Launch via Vercel CLI to support serverless functions:
```bash
vercel dev
```

---

## 📸 Application Preview
*(UI Screenshots mapping glassmorphism layout, animated workflows, and mobile responsiveness)*

![Dashboard Preview](https://via.placeholder.com/1200x600/0d1626/10b981?text=JanVaani.ai+Dashboard+Preview)
