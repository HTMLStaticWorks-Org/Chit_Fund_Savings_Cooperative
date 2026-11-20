/**
 * SAHAYOG CHIT FUND & SAVINGS COOPERATIVE — MAIN INTERACTIVE CONTROLLER
 * Handles Theme Toggle, RTL Direction Toggle, Sticky Header on Scroll,
 * Responsive Navbar, Dropdowns, Scheme Filtering/Sorting, Home 2 Estimator,
 * Modals, FAQ Accordions, Rules Document Download, Forms & Dashboard.
 */

(function () {
  "use strict";

  /* ==========================================================================
     1. THEME MANAGEMENT (LIGHT / DARK MODE)
     ========================================================================== */
  const THEME_STORAGE_KEY = "sahayog_cooperative_theme";
  const RTL_STORAGE_KEY = "sahayog_cooperative_rtl";

  function getInitialTheme() {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === "dark" || saved === "light") {
        return saved;
      }
    } catch (e) {}
    return "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {}
    const toggleBtns = document.querySelectorAll("[data-theme-toggle]");
    toggleBtns.forEach((btn) => {
      const nextMode = theme === "dark" ? "light" : "dark";
      btn.setAttribute("aria-label", `Switch to ${nextMode} theme`);
      btn.setAttribute("title", `Switch to ${nextMode} theme`);
    });
  }

  /* ==========================================================================
     2. RTL (RIGHT-TO-LEFT) DIRECTION TOGGLE
     ========================================================================== */
  function getInitialDir() {
    try {
      const saved = localStorage.getItem(RTL_STORAGE_KEY);
      if (saved === "rtl" || saved === "ltr") {
        return saved;
      }
    } catch (e) {}
    return "ltr";
  }

  function applyDir(dir) {
    document.documentElement.setAttribute("dir", dir);
    try {
      localStorage.setItem(RTL_STORAGE_KEY, dir);
    } catch (e) {}
    const rtlBtns = document.querySelectorAll("[data-rtl-toggle]");
    rtlBtns.forEach((btn) => {
      btn.textContent = "RTL"; // User requested: inside rtl button only rtl text should be there
      btn.setAttribute("aria-label", dir === "rtl" ? "Switch to LTR layout" : "Switch to RTL layout");
      btn.setAttribute("title", dir === "rtl" ? "Switch to LTR layout" : "Switch to RTL layout");
    });
  }

  // Apply immediately before DOM render
  applyTheme(getInitialTheme());
  applyDir(getInitialDir());

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(document.documentElement.getAttribute("data-theme") || "light");
    applyDir(document.documentElement.getAttribute("dir") || "ltr");

    // Theme Toggle Listeners
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme") || "light";
        applyTheme(current === "dark" ? "light" : "dark");
      });
    });

    // RTL Toggle Listeners (inside rtl button only rtl text should be there)
    document.querySelectorAll("[data-rtl-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const currentDir = document.documentElement.getAttribute("dir") || "ltr";
        applyDir(currentDir === "rtl" ? "ltr" : "rtl");
      });
    });

    /* ==========================================================================
       3. STICKY HEADER (HEADER COMES DOWN WHILE SCROLLING)
       ========================================================================== */
    const siteHeader = document.querySelector(".site-header");
    if (siteHeader) {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 30) {
          siteHeader.classList.add("is-scrolled");
        } else {
          siteHeader.classList.remove("is-scrolled");
        }
      }, { passive: true });
    }

    /* ==========================================================================
       4. NAVBAR, MOBILE MENU & HOME DROPDOWN
       ========================================================================== */
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const navMenuWrapper = document.getElementById("navMenuWrapper");
    const dropdownItems = document.querySelectorAll(".nav-item.dropdown");

    if (hamburgerBtn && navMenuWrapper) {
      hamburgerBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isExpanded = hamburgerBtn.getAttribute("aria-expanded") === "true";
        hamburgerBtn.setAttribute("aria-expanded", String(!isExpanded));
        navMenuWrapper.classList.toggle("active", !isExpanded);
      });
    }

    dropdownItems.forEach((item) => {
      const toggle = item.querySelector(".dropdown-toggle");
      if (!toggle) return;

      toggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = item.classList.contains("open");
        dropdownItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove("open");
            const otherBtn = other.querySelector(".dropdown-toggle");
            if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
          }
        });
        item.classList.toggle("open", !isOpen);
        toggle.setAttribute("aria-expanded", String(!isOpen));
      });
    });

    document.addEventListener("click", (e) => {
      dropdownItems.forEach((item) => {
        if (!item.contains(e.target)) {
          item.classList.remove("open");
          const btn = item.querySelector(".dropdown-toggle");
          if (btn) btn.setAttribute("aria-expanded", "false");
        }
      });

      if (
        navMenuWrapper &&
        navMenuWrapper.classList.contains("active") &&
        !navMenuWrapper.contains(e.target) &&
        hamburgerBtn &&
        !hamburgerBtn.contains(e.target)
      ) {
        navMenuWrapper.classList.remove("active");
        hamburgerBtn.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        dropdownItems.forEach((item) => {
          item.classList.remove("open");
          const btn = item.querySelector(".dropdown-toggle");
          if (btn) btn.setAttribute("aria-expanded", "false");
        });
        if (navMenuWrapper && navMenuWrapper.classList.contains("active")) {
          navMenuWrapper.classList.remove("active");
          if (hamburgerBtn) hamburgerBtn.setAttribute("aria-expanded", "false");
        }
        closeAllModals();
      }
    });

    /* ==========================================================================
       5. FAQ ACCORDIONS
       ========================================================================== */
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
      const trigger = item.querySelector(".faq-trigger");
      if (!trigger) return;
      trigger.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        item.classList.toggle("open", !isOpen);
        trigger.setAttribute("aria-expanded", String(!isOpen));
      });
    });

    /* ==========================================================================
       6. HOME 2 — INTERACTIVE CHIT INSTALMENT & PARTICIPATION ESTIMATOR
       ========================================================================== */
    const estimatorContainer = document.getElementById("home2Estimator");
    if (estimatorContainer && window.SAHAYOG_SCHEMES) {
      const pillBtns = estimatorContainer.querySelectorAll("[data-scheme-id]");
      const elName = document.getElementById("estSchemeName");
      const elCode = document.getElementById("estSchemeCode");
      const elChitVal = document.getElementById("estChitValue");
      const elMonthly = document.getElementById("estMonthly");
      const elDuration = document.getElementById("estDuration");
      const elMembers = document.getElementById("estMembers");
      const elForeman = document.getElementById("estForeman");
      const elCap = document.getElementById("estDiscountCap");
      const elEnquireBtn = document.getElementById("estEnquireLink");
      const elDetailBtn = document.getElementById("estDetailLink");

      function updateEstimator(schemeId) {
        const scheme =
          window.SAHAYOG_SCHEMES.find((s) => s.id === schemeId) ||
          window.SAHAYOG_SCHEMES[0];
        if (!scheme) return;

        pillBtns.forEach((btn) => {
          const active = btn.getAttribute("data-scheme-id") === scheme.id;
          btn.classList.toggle("active", active);
          btn.setAttribute("aria-pressed", String(active));
        });

        if (elName) elName.textContent = scheme.name;
        if (elCode) elCode.textContent = `Sample Code: ${scheme.code}`;
        if (elChitVal) elChitVal.textContent = scheme.chitValueFormatted;
        if (elMonthly) elMonthly.textContent = `${scheme.monthlyInstalmentFormatted} / month`;
        if (elDuration) elDuration.textContent = scheme.durationFormatted;
        if (elMembers) elMembers.textContent = `${scheme.members} Subscribers`;
        if (elForeman) elForeman.textContent = scheme.foremanCommission;
        if (elCap) elCap.textContent = scheme.maxDiscountCap;
        if (elEnquireBtn) elEnquireBtn.setAttribute("href", `contact.html?scheme=${scheme.id}`);
        if (elDetailBtn) elDetailBtn.setAttribute("href", `schemes.html?highlight=${scheme.id}#scheme-details-section`);
      }

      pillBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          updateEstimator(btn.getAttribute("data-scheme-id"));
        });
      });

      updateEstimator("pragati-3l");
    }

    /* ==========================================================================
       7. SCHEMES PAGE — FILTERING, SORTING, COMPARISON & DETAIL TABS
       ========================================================================== */
    const schemesDirectoryGrid = document.getElementById("schemesDirectoryGrid");
    const schemesComparisonBody = document.getElementById("schemesComparisonBody");
    const schemeDetailInspector = document.getElementById("schemeDetailInspector");

    if (schemesDirectoryGrid && window.SAHAYOG_SCHEMES) {
      let activeCategory = "all";
      let activeDuration = "all";
      let activeSort = "value-asc";
      let selectedDetailId = "pratham-1l";

      const params = new URLSearchParams(window.location.search);
      const highlightParam = params.get("highlight") || params.get("scheme");
      if (highlightParam && window.SAHAYOG_SCHEMES.some((s) => s.id === highlightParam)) {
        selectedDetailId = highlightParam;
      }

      const categoryBtns = document.querySelectorAll("[data-filter-category]");
      const durationSelect = document.getElementById("filterDurationSelect");
      const sortSelect = document.getElementById("sortSchemesSelect");
      const countBadge = document.getElementById("filteredSchemesCount");

      function getFilteredSchemes() {
        let list = window.SAHAYOG_SCHEMES.slice();

        if (activeCategory !== "all") {
          list = list.filter((s) => s.category === activeCategory);
        }

        if (activeDuration !== "all") {
          if (activeDuration === "25") {
            list = list.filter((s) => s.durationMonths <= 25);
          } else if (activeDuration === "30-40") {
            list = list.filter((s) => s.durationMonths >= 30 && s.durationMonths <= 40);
          } else if (activeDuration === "50") {
            list = list.filter((s) => s.durationMonths >= 50);
          }
        }

        list.sort((a, b) => {
          if (activeSort === "value-asc") return a.chitValue - b.chitValue;
          if (activeSort === "value-desc") return b.chitValue - a.chitValue;
          if (activeSort === "instalment-asc") return a.monthlyInstalment - b.monthlyInstalment;
          if (activeSort === "duration-asc") return a.durationMonths - b.durationMonths;
          return 0;
        });

        return list;
      }

      function renderSchemesDirectory() {
        const filtered = getFilteredSchemes();
        if (countBadge) {
          countBadge.textContent = `Showing ${filtered.length} of ${window.SAHAYOG_SCHEMES.length} sample schemes`;
        }

        if (filtered.length === 0) {
          schemesDirectoryGrid.innerHTML = `
            <div class="feature-card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
              <h3>No Sample Schemes Match Your Current Filter Combination</h3>
              <p style="margin: 0.75rem auto 1.5rem; max-width: 520px;">
                Try resetting the category or duration filter to view all editable demonstration chit schemes.
              </p>
              <button type="button" class="btn btn-primary" id="resetFiltersBtn">Reset All Filters</button>
            </div>
          `;
          const resetBtn = document.getElementById("resetFiltersBtn");
          if (resetBtn) {
            resetBtn.addEventListener("click", () => {
              activeCategory = "all";
              activeDuration = "all";
              if (durationSelect) durationSelect.value = "all";
              categoryBtns.forEach((b) =>
                b.classList.toggle("active", b.getAttribute("data-filter-category") === "all")
              );
              renderSchemesDirectory();
            });
          }
          return;
        }

        schemesDirectoryGrid.innerHTML = filtered
          .map(
            (s) => `
          <article class="scheme-card" data-scheme-card="${s.id}">
            <div class="scheme-card-top">
              <div class="scheme-meta-bar">
                <span class="scheme-category-tag">${s.categoryLabel}</span>
                <span class="scheme-demo-tag">Sample Data • ${s.code}</span>
              </div>
              <h3 class="scheme-name">${s.name}</h3>
              <div class="scheme-value-box">
                <span class="scheme-value-label">Total Chit Value (INR)</span>
                <span class="scheme-value-amount">${s.chitValueFormatted}</span>
              </div>
              <div class="scheme-specs-list">
                <div class="scheme-spec-item">
                  <span class="spec-label">Gross Monthly Instalment</span>
                  <span class="spec-val">${s.monthlyInstalmentFormatted} / mo</span>
                </div>
                <div class="scheme-spec-item">
                  <span class="spec-label">Scheme Duration</span>
                  <span class="spec-val">${s.durationFormatted}</span>
                </div>
                <div class="scheme-spec-item">
                  <span class="spec-label">Group Strength</span>
                  <span class="spec-val">${s.members} Members</span>
                </div>
                <div class="scheme-spec-item">
                  <span class="spec-label">Foreman Commission</span>
                  <span class="spec-val">5% (${s.foremanCommission.split("(")[1] || "5%"})</span>
                </div>
              </div>
              <div class="scheme-eligibility-box">
                <strong>Eligibility Summary:</strong> ${s.eligibilitySummary}
              </div>
            </div>
            <div class="scheme-card-actions">
              <button type="button" class="btn btn-outline btn-sm" data-inspect-scheme="${s.id}">
                View Scheme Details
              </button>
              <a href="contact.html?scheme=${s.id}" class="btn btn-primary btn-sm">
                Enquire Now
              </a>
            </div>
          </article>
        `
          )
          .join("");

        schemesDirectoryGrid.querySelectorAll("[data-inspect-scheme]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-inspect-scheme");
            renderSchemeDetailInspector(id, true);
          });
        });
      }

      function renderComparisonTable() {
        if (!schemesComparisonBody) return;
        schemesComparisonBody.innerHTML = window.SAHAYOG_SCHEMES.map(
          (s) => `
          <tr>
            <td>
              <strong style="color: var(--text-primary); display: block;">${s.name}</strong>
              <span style="font-size: 0.78rem; color: var(--text-muted);">${s.code} • ${s.categoryLabel}</span>
            </td>
            <td class="num-tabular"><strong>${s.chitValueFormatted}</strong></td>
            <td class="num-tabular">${s.monthlyInstalmentFormatted} / mo</td>
            <td class="num-tabular">${s.durationFormatted}</td>
            <td class="num-tabular">${s.members} Members</td>
            <td>${s.foremanCommission}</td>
            <td>${s.maxDiscountCap}</td>
            <td>
              <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                <button type="button" class="btn btn-outline btn-sm" style="padding: 6px 10px; font-size: 0.78rem;" data-table-inspect="${s.id}">
                  Breakdown
                </button>
                <a href="contact.html?scheme=${s.id}" class="btn btn-primary btn-sm" style="padding: 6px 10px; font-size: 0.78rem;">
                  Enquire
                </a>
              </div>
            </td>
          </tr>
        `
        ).join("");

        schemesComparisonBody.querySelectorAll("[data-table-inspect]").forEach((btn) => {
          btn.addEventListener("click", () => {
            renderSchemeDetailInspector(btn.getAttribute("data-table-inspect"), true);
          });
        });
      }

      function renderSchemeDetailInspector(schemeId, scrollIntoView) {
        if (!schemeDetailInspector) return;
        selectedDetailId = schemeId;
        const scheme =
          window.SAHAYOG_SCHEMES.find((s) => s.id === schemeId) ||
          window.SAHAYOG_SCHEMES[0];

        document.querySelectorAll("[data-detail-tab]").forEach((tab) => {
          const isMatch = tab.getAttribute("data-detail-tab") === scheme.id;
          tab.classList.toggle("active", isMatch);
        });

        schemeDetailInspector.innerHTML = `
          <div class="form-card" style="border-top: 4px solid var(--brand-gold);">
            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 1rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-subtle); margin-bottom: 1.5rem;">
              <div>
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 6px;">
                  <span class="scheme-category-tag">${scheme.categoryLabel}</span>
                  <span class="scheme-demo-tag">Editable Sample Breakdown • ${scheme.code}</span>
                </div>
                <h3 style="font-size: 1.6rem; display: block; margin-bottom: 4px;">${scheme.name} — Complete Participation Terms</h3>
              </div>
              <div class="scheme-inspector-actions" style="display: flex; gap: 10px; flex-wrap: wrap;">
                <a href="rules.html" class="btn btn-outline btn-sm">Review Governing Rules</a>
                <a href="contact.html?scheme=${scheme.id}" class="btn btn-primary btn-sm">Enquire About ${scheme.name}</a>
              </div>
            </div>

            <div class="features-grid-3" style="margin-bottom: 1.5rem;">
              <div style="background: var(--bg-secondary); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); display: block;">Sample Chit Pool Value</span>
                <strong class="num-tabular" style="font-size: 1.75rem; font-family: var(--font-heading); color: var(--text-primary); display: block;">${scheme.chitValueFormatted}</strong>
                <span style="font-size: 0.82rem; color: var(--text-secondary); display: block; margin-top: 4px;">Pooled monthly across ${scheme.members} subscribers</span>
              </div>
              <div style="background: var(--bg-secondary); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); display: block;">Gross Monthly Instalment</span>
                <strong class="num-tabular" style="font-size: 1.75rem; font-family: var(--font-heading); color: var(--text-primary); display: block;">${scheme.monthlyInstalmentFormatted} / mo</strong>
                <span style="font-size: 0.82rem; color: var(--text-secondary); display: block; margin-top: 4px;">Duration: ${scheme.durationFormatted} (${scheme.instalments} cycles)</span>
              </div>
              <div style="background: var(--bg-secondary); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); display: block;">Auction & Bidding Bounds</span>
                <strong style="font-size: 1.35rem; font-family: var(--font-heading); color: var(--text-primary); display: block; margin-top: 4px;">${scheme.minDiscountFloor} to ${scheme.maxDiscountCap}</strong>
                <span style="font-size: 0.82rem; color: var(--text-secondary); display: block; margin-top: 4px;">Schedule: ${scheme.auctionSchedule}</span>
              </div>
            </div>

            <div class="features-grid-2">
              <div style="background: var(--bg-primary); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                <h4 style="margin-bottom: 0.5rem; display: block;">1. Participation & Eligibility Requirements</h4>
                <p style="font-size: 0.9rem; margin-bottom: 0.75rem; display: block;">${scheme.eligibilitySummary}</p>
                <h4 style="margin-bottom: 0.5rem; display: block;">2. Surety & Prize Disbursal Norms</h4>
                <p style="font-size: 0.9rem; display: block;">${scheme.suretyNorms}</p>
              </div>
              <div style="background: var(--bg-primary); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                <h4 style="margin-bottom: 0.5rem; display: block;">3. Applicable Charges & Foreman Fee (Sample Data)</h4>
                <ul class="rule-points-list" style="margin-top: 0;">
                  <li><strong>Foreman Commission:</strong> ${scheme.foremanCommission} deducted from gross pool upon prize settlement.</li>
                  <li><strong>Enrolment / Documentation Charge:</strong> ${scheme.documentationFee}</li>
                  <li><strong>Late Payment Provision:</strong> ${scheme.lateFeeRule}</li>
                  <li><strong>Dividend Mechanism:</strong> ${scheme.sampleDividendNote}</li>
                </ul>
              </div>
            </div>
          </div>
        `;

        if (scrollIntoView) {
          const section = document.getElementById("scheme-details-section");
          if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }

      categoryBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          activeCategory = btn.getAttribute("data-filter-category") || "all";
          categoryBtns.forEach((b) =>
            b.classList.toggle("active", b.getAttribute("data-filter-category") === activeCategory)
          );
          renderSchemesDirectory();
        });
      });

      if (durationSelect) {
        durationSelect.addEventListener("change", () => {
          activeDuration = durationSelect.value;
          renderSchemesDirectory();
        });
      }

      if (sortSelect) {
        sortSelect.addEventListener("change", () => {
          activeSort = sortSelect.value;
          renderSchemesDirectory();
        });
      }

      document.querySelectorAll("[data-detail-tab]").forEach((tab) => {
        tab.addEventListener("click", () => {
          renderSchemeDetailInspector(tab.getAttribute("data-detail-tab"), false);
        });
      });

      renderSchemesDirectory();
      renderComparisonTable();
      renderSchemeDetailInspector(selectedDetailId, Boolean(highlightParam));
    }

    /* ==========================================================================
       8. RULES PAGE — DOWNLOADABLE CHECKLIST & PRINTABLE MODAL
       ========================================================================== */
    const downloadRulesBtn = document.getElementById("downloadRulesChecklistBtn");
    if (downloadRulesBtn) {
      downloadRulesBtn.addEventListener("click", () => {
        const sampleText = [
          "==========================================================================",
          "SAHAYOG CHIT FUND & SAVINGS COOPERATIVE — SAMPLE BYLAWS & RULES TEMPLATE",
          "==========================================================================",
          "NOTICE: This document is an editable template placeholder for demonstration",
          "purposes. Replace all clauses with your cooperative's registered scheme",
          "bylaws and jurisdiction-compliant terms before member distribution.",
          "",
          "1. MEMBERSHIP ELIGIBILITY",
          "   - Open to adult individuals (18+ years) residing within the operational",
          "     jurisdiction who complete KYC and cooperative membership admission.",
          "",
          "2. REGISTRATION & DOCUMENTATION",
          "   - Requires signed Chit Agreement, Government Photo ID, Address Proof,",
          "     recent bank statement, and nominee declaration.",
          "",
          "3. CONTRIBUTION & INSTALMENT DEADLINES",
          "   - Monthly subscriptions are payable on or before the 5th working day",
          "     prior to the scheduled monthly auction date.",
          "",
          "4. LATE PAYMENT RULES & APPLICABLE CHARGES (SAMPLE)",
          "   - Grace window of 7 days from due date; overdue amounts attract sample",
          "     administrative notice charges and overdue interest per registered bylaws.",
          "",
          "5. AUCTION OR DRAW PROCEDURES",
          "   - Conducted monthly at the designated hour. Minimum discount floor: 5%",
          "     (Foreman Commission). Maximum discount cap: 25% to 35% per scheme tier.",
          "   - If multiple members bid the maximum cap, selection is determined by a",
          "     transparent documented lot draw in the presence of participating members.",
          "",
          "6. PRIZE AMOUNT & APPLICABLE DEDUCTIONS",
          "   - Prize Amount = Gross Chit Value minus Approved Bid Discount.",
          "   - Dividend = Approved Bid Discount minus 5% Foreman Commission, shared",
          "     equally among all subscribers in the group.",
          "",
          "7. MEMBER & FOREMAN RESPONSIBILITIES",
          "   - Prized and non-prized members must remit monthly instalments until the",
          "     termination of the scheme. The Foreman maintains segregated accounts,",
          "     minutes of auctions, and timely prize disbursement upon surety verification.",
          "=========================================================================="
        ].join("\r\n");

        const blob = new Blob([sampleText], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Sahayog-Sample-Chit-Rules-Checklist.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        const feedbackEl = document.getElementById("rulesDownloadFeedback");
        if (feedbackEl) {
          feedbackEl.style.display = "block";
          feedbackEl.textContent =
            "Sample rules document (Sahayog-Sample-Chit-Rules-Checklist.txt) downloaded successfully.";
        }
      });
    }

    /* ==========================================================================
       9. CONTACT FORM VALIDATION & URL PRE-FILL
       ========================================================================== */
    const contactForm = document.getElementById("cooperativeEnquiryForm");
    if (contactForm) {
      const urlParams = new URLSearchParams(window.location.search);
      const schemeParam = urlParams.get("scheme");
      const schemeSelect = document.getElementById("enqScheme");
      if (schemeParam && schemeSelect) {
        const optionExists = Array.from(schemeSelect.options).some((opt) => opt.value === schemeParam);
        if (optionExists) {
          schemeSelect.value = schemeParam;
        }
      }

      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let isValid = true;

        const requiredFields = [
          { id: "enqName", check: (v) => v.trim().length >= 2 },
          { id: "enqEmail", check: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
          { id: "enqPhone", check: (v) => /^[0-9+\-\s()]{8,16}$/.test(v.trim()) },
          { id: "enqCity", check: (v) => v.trim().length >= 2 },
          { id: "enqScheme", check: (v) => v.trim() !== "" },
          { id: "enqCategory", check: (v) => v.trim() !== "" },
          { id: "enqMessage", check: (v) => v.trim().length >= 10 }
        ];

        requiredFields.forEach((field) => {
          const input = document.getElementById(field.id);
          if (!input) return;
          const group = input.closest(".form-group") || input.closest(".form-group-single");
          const ok = field.check(input.value);
          if (!ok) {
            isValid = false;
            input.classList.add("invalid");
            if (group) group.classList.add("has-error");
          } else {
            input.classList.remove("invalid");
            if (group) group.classList.remove("has-error");
          }
        });

        const feedbackBanner = document.getElementById("enquiryFormFeedback");
        if (isValid && feedbackBanner) {
          const nameVal = document.getElementById("enqName").value.trim();
          const schemeText =
            schemeSelect && schemeSelect.selectedIndex >= 0
              ? schemeSelect.options[schemeSelect.selectedIndex].text
              : "Selected Scheme";

          feedbackBanner.className = "form-feedback-banner success";
          feedbackBanner.innerHTML = `
            <strong>Enquiry Recorded (Frontend Template Demonstration):</strong><br/>
            Thank you, <strong>${escapeHtml(nameVal)}</strong>. Your membership enquiry regarding
            <em>${escapeHtml(schemeText)}</em> has been recorded. Our member relations team will get in touch with you shortly.
          `;
          contactForm.reset();
        }
      });

      contactForm.querySelectorAll(".form-control").forEach((input) => {
        input.addEventListener("input", () => {
          input.classList.remove("invalid");
          const group = input.closest(".form-group") || input.closest(".form-group-single");
          if (group) group.classList.remove("has-error");
        });
      });
    }

    /* ==========================================================================
       10. LOGIN & SIGN UP FRONTEND UI INTERACTIONS
       ========================================================================== */
    // Show / Hide Password toggles
    document.querySelectorAll("[data-toggle-password]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-toggle-password");
        const input = document.getElementById(targetId);
        if (!input) return;
        const isPwd = input.getAttribute("type") === "password";
        input.setAttribute("type", isPwd ? "text" : "password");
        btn.textContent = isPwd ? "Hide" : "Show";
      });
    });

    // Login Form Handler
    const loginForm = document.getElementById("memberLoginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const idInput = document.getElementById("loginMemberId");
        const pwdInput = document.getElementById("loginPassword");
        let valid = true;

        if (!idInput || idInput.value.trim().length < 3) {
          valid = false;
          if (idInput) {
            idInput.classList.add("invalid");
            (idInput.closest(".form-group") || idInput.closest(".form-group-single"))?.classList.add("has-error");
          }
        } else {
          idInput.classList.remove("invalid");
          (idInput.closest(".form-group") || idInput.closest(".form-group-single"))?.classList.remove("has-error");
        }

        if (!pwdInput || pwdInput.value.length < 6) {
          valid = false;
          if (pwdInput) {
            pwdInput.classList.add("invalid");
            (pwdInput.closest(".form-group") || pwdInput.closest(".form-group-single"))?.classList.add("has-error");
          }
        } else {
          pwdInput.classList.remove("invalid");
          (pwdInput.closest(".form-group") || pwdInput.closest(".form-group-single"))?.classList.remove("has-error");
        }

        const feedback = document.getElementById("loginFeedbackBanner");
        if (valid && feedback) {
          feedback.className = "form-feedback-banner success";
          feedback.innerHTML = `
            <strong>Login Successful (Demo):</strong> Welcome back, <strong>${escapeHtml(idInput.value.trim())}</strong>! Redirecting to your member dashboard...
          `;
          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 1200);
        }
      });
    }

    // Sign Up Form Handler
    const signupForm = document.getElementById("memberSignupForm");
    if (signupForm) {
      signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let valid = true;

        const nameInput = document.getElementById("regFullName");
        const emailInput = document.getElementById("regEmail");
        const mobileInput = document.getElementById("regMobile");
        const cityInput = document.getElementById("regCity");
        const schemeInput = document.getElementById("regScheme");
        const pwdInput = document.getElementById("regPassword");
        const confirmInput = document.getElementById("regConfirmPassword");
        const consentInput = document.getElementById("regConsent");

        const checks = [
          { el: nameInput, ok: nameInput && nameInput.value.trim().length >= 2 },
          { el: emailInput, ok: emailInput && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim()) },
          { el: mobileInput, ok: mobileInput && /^[0-9+\-\s()]{8,15}$/.test(mobileInput.value.trim()) },
          { el: cityInput, ok: cityInput && cityInput.value.trim().length >= 2 },
          { el: schemeInput, ok: schemeInput && schemeInput.value.trim() !== "" },
          { el: pwdInput, ok: pwdInput && pwdInput.value.length >= 8 },
          {
            el: confirmInput,
            ok: confirmInput && pwdInput && confirmInput.value === pwdInput.value && confirmInput.value.length >= 8
          }
        ];

        checks.forEach((item) => {
          if (!item.el) return;
          const group = item.el.closest(".form-group") || item.el.closest(".form-group-single");
          if (!item.ok) {
            valid = false;
            item.el.classList.add("invalid");
            if (group) group.classList.add("has-error");
          } else {
            item.el.classList.remove("invalid");
            if (group) group.classList.remove("has-error");
          }
        });

        if (consentInput) {
          const group = consentInput.closest(".form-group") || consentInput.closest(".form-group-single");
          if (!consentInput.checked) {
            valid = false;
            if (group) group.classList.add("has-error");
          } else if (group) {
            group.classList.remove("has-error");
          }
        }

        const feedback = document.getElementById("signupFeedbackBanner");
        if (valid && feedback) {
          feedback.className = "form-feedback-banner success";
          feedback.innerHTML = `
            <strong>Prospective Member Profile Created:</strong> Thank you, <strong>${escapeHtml(nameInput.value.trim())}</strong>. Your profile has been registered successfully.
          `;
          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 1500);
        }
      });
    }

    /* ==========================================================================
       11. UNIVERSAL MODALS
       ========================================================================== */
    document.querySelectorAll("[data-open-modal]").forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const modalId = trigger.getAttribute("data-open-modal");
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.classList.add("open");
          modal.setAttribute("aria-hidden", "false");
        }
      });
    });

    document.querySelectorAll("[data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        closeAllModals();
      });
    });

    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) {
          closeAllModals();
        }
      });
    });

    const resetPwdForm = document.getElementById("forgotPasswordModalForm");
    if (resetPwdForm) {
      resetPwdForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("resetIdentifierInput");
        const feedback = document.getElementById("resetModalFeedback");
        if (input && input.value.trim().length >= 3 && feedback) {
          feedback.className = "form-feedback-banner success";
          feedback.textContent =
            "Password recovery instructions have been sent to " + input.value.trim() + " (Template Demo).";
        }
      });
    }

    /* ==========================================================================
       12. DASHBOARD TABS & HAMBURGER SIDEBAR (MOBILE / TABLET / 1024px)
       ========================================================================== */
    const dashSidebarToggle = document.getElementById("dashboardSidebarToggle");
    const dashSidebar = document.getElementById("dashboardSidebar");
    const dashSidebarClose = document.getElementById("dashboardSidebarClose");
    const dashSidebarBackdrop = document.getElementById("dashboardSidebarBackdrop");

    function closeDashboardDrawer() {
      if (dashSidebar) dashSidebar.classList.remove("is-open");
      if (dashSidebarBackdrop) dashSidebarBackdrop.classList.remove("active");
      if (dashSidebarToggle) dashSidebarToggle.setAttribute("aria-expanded", "false");
    }

    function openDashboardDrawer() {
      if (dashSidebar) dashSidebar.classList.add("is-open");
      if (dashSidebarBackdrop) dashSidebarBackdrop.classList.add("active");
      if (dashSidebarToggle) dashSidebarToggle.setAttribute("aria-expanded", "true");
    }

    if (dashSidebarToggle) {
      dashSidebarToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        if (dashSidebar && dashSidebar.classList.contains("is-open")) {
          closeDashboardDrawer();
        } else {
          openDashboardDrawer();
        }
      });
    }

    if (dashSidebarClose) {
      dashSidebarClose.addEventListener("click", closeDashboardDrawer);
    }

    if (dashSidebarBackdrop) {
      dashSidebarBackdrop.addEventListener("click", closeDashboardDrawer);
    }

    const dashTabs = document.querySelectorAll("[data-dash-tab]");
    dashTabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = tab.getAttribute("data-dash-tab");
        dashTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        document.querySelectorAll(".dashboard-section-panel").forEach((panel) => {
          panel.style.display = panel.id === targetId ? "block" : "none";
        });

        // Close sidebar drawer on mobile/tablet if opened
        if (window.innerWidth <= 1024) {
          closeDashboardDrawer();
        }
      });
    });

    /* ==========================================================================
       13. BACK TO TOP BUTTON (ALL PAGES)
       ========================================================================== */
    if (!document.getElementById("backToTopBtn")) {
      const backBtn = document.createElement("button");
      backBtn.type = "button";
      backBtn.id = "backToTopBtn";
      backBtn.className = "back-to-top-btn";
      backBtn.setAttribute("aria-label", "Back to top");
      backBtn.setAttribute("title", "Back to top");
      backBtn.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>';
      document.body.appendChild(backBtn);

      const toggleBackToTop = () => {
        if (window.scrollY > 280) {
          backBtn.classList.add("visible");
        } else {
          backBtn.classList.remove("visible");
        }
      };

      window.addEventListener("scroll", toggleBackToTop, { passive: true });
      toggleBackToTop();

      backBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  });

  function closeAllModals() {
    document.querySelectorAll(".modal-backdrop.open").forEach((modal) => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
