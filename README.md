# Sahayog Financial Cooperative — Chit Fund & Mutual Savings Website Template

A complete, responsive, institutional-grade HTML5/CSS3/JS website template tailored for **Chit Fund & Mutual Savings Cooperatives**, crafted to ThemeForest and Creative Market standards.

---

## 1. Project Overview & Pages Included

This template is engineered around **financial transparency, scheme clarity, documented participation rules, and member trust**. It avoids generic SaaS/crypto aesthetics and instead uses a warm, authoritative institutional design language (Deep Navy, Forest Green, Warm Ivory, Muted Gold, and Subtle Sage) with full Light and Dark mode support.

### Included Pages (8 Complete HTML Templates)
1. **`index.html` (Home 1 — Institutional Overview)**:
   - Institutional consultation hero, 4 Featured INR Chit Scheme cards, *Why Choose Our Cooperative*, 5-step *How It Works* participation journey, 6-pillar *Financial Transparency* framework, clearly labelled fictional sample testimonials, interactive FAQ accordion, and multi-column footer.
2. **`home-2.html` (Home 2 — Editorial & Scheme Matrix)**:
   - Asymmetric editorial masthead with an **Interactive Chit Participation Estimator**, prominent side-by-side 6-scheme comparison matrix, dual-role explanation (Non-Prized Savers vs. Prized Subscribers), 5-stage Member Journey Timeline, and institutional safeguards.
3. **`schemes.html` (Scheme Discovery, Comparison & Deep-Dive)**:
   - Real-time category filtering (`All`, `Entry & Household`, `Education & Family`, `Business & Milestone`), duration filtering, and multi-attribute sorting.
   - Interactive **Scheme-Specific Detail Inspector** showing complete participation requirements, surety norms, foreman fees, and auction schedules.
   - Responsive side-by-side comparison table.
4. **`rules.html` (Rules & Regulations — 12 Clauses)**:
   - Sticky Table of Contents sidebar and 12 structured bylaw clauses covering eligibility, KYC documentation, instalment deadlines, late payment rules, auction/draw procedures, prize deductions, member/foreman duties, default handling, nominees, completion, and two-tier grievance redressal.
   - Working client-side downloadable rules checklist (`Sahayog-Sample-Chit-Rules-Checklist.txt`) and printable summary modal.
5. **`about.html` (Cooperative Profile & Governance)**:
   - Institutional introduction, 6 core values, operational accountability standards, and clearly labelled editable sample leadership profiles.
6. **`contact.html` (Contact & Validated Membership Enquiry Form)**:
   - Editable branch office placeholder, telephone/email channels, business hours, WhatsApp enquiry desk preview modal, stylized branch map block, and a 7-field validated Membership & Scheme Enquiry Form with automatic URL query parameter pre-selection (`?scheme=...`).
7. **`login.html` (Member Login UI — Frontend Demonstration)**:
   - Member ID / Email / Mobile input, password with Show/Hide toggle, Remember Me, interactive Forgot Password modal, and frontend validation feedback.
8. **`signup.html` (Member Registration UI — Frontend Demonstration)**:
   - Prospective member onboarding form with Full Name, Email, Mobile, Address/City, Preferred Scheme selector, Password + Confirm Password validation, and Rules Consent check.

---

## 2. Folder Structure

```text
Chit_Fund_Savings_Cooperative/
├── index.html                  # Home 1 (Institutional)
├── home-2.html                 # Home 2 (Editorial & Interactive Matrix)
├── schemes.html                # Schemes Directory, Filter, Comparison & Breakdown
├── rules.html                  # 12-Section Rules & Bylaws + Downloadable Checklist
├── about.html                  # Cooperative Profile, Values & Sample Leadership
├── contact.html                # Validated Enquiry Form, Map & WhatsApp Desk Modal
├── login.html                  # Member Login Frontend UI
├── signup.html                 # Member Registration Frontend UI
├── README.md                   # Customization & Deployment Documentation
└── assets/
    ├── css/
    │   └── styles.css          # Design System, CSS Variables, 4px/8px Grid, Dark Mode
    ├── js/
    │   ├── schemes-data.js     # Centralized Editable Sample Schemes Data (INR)
    │   └── main.js             # Theme Toggle, Navbar, Filters, Estimator, Modals, Validation
    └── images/
        ├── hero-consultation.svg
        ├── hero-cooperative-meeting.svg
        ├── office-interior.svg
        └── financial-planning.svg
```

---

## 3. Customization Guide

### A. Editing Sample Chit Schemes (`assets/js/schemes-data.js`)
All 6 sample chit schemes are stored in `window.SAHAYOG_SCHEMES` inside `assets/js/schemes-data.js`. Updating an object in this array automatically updates:
- The Schemes Directory cards (`schemes.html`)
- The Side-by-Side Comparison Table (`schemes.html`)
- The Scheme-Specific Detail Inspector (`schemes.html`)
- The Home 2 Interactive Estimator (`home-2.html`)

### B. Customizing Brand Colors & Typography (`assets/css/styles.css`)
Open `assets/css/styles.css` and edit the `:root` and `[data-theme="dark"]` variables at the top of the file:
- `--brand-navy`: Deep Navy (`#0F233C`)
- `--brand-forest`: Forest Green (`#1B4332`)
- `--brand-gold`: Muted Heritage Gold (`#B68D40`)
- `--bg-primary`: Warm Ivory (`#FAF7F2`)
- `--font-heading` and `--font-body`: Configured with `'Fraunces'` (serif headings) and `'Plus Jakarta Sans'` (body & tabular numerals).

### C. Legal & Regulatory Customization Checklist
Before publishing this template for an active financial cooperative:
1. Replace all sample scheme values and foreman commission figures with your registered scheme bylaws.
2. Replace the sample clauses in `rules.html` and the downloadable `.TXT` generator in `assets/js/main.js` with your jurisdiction-approved Chit Agreement documents.
3. Update the placeholder office address, telephone numbers, email addresses, and WhatsApp link in `contact.html` and the global footer.

