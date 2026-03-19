/**
 * =============================================================================
 * CodeBridge Africa — Shared Components
 * File: js/components.js
 *
 * This file builds and injects three shared components into every page:
 *   1. Announcement Bar  — top strip with contact info, location, enrol link
 *   2. Navbar            — sticky navigation with dropdowns + Student Portal CTA
 *   3. Footer            — links, social media, newsletter, contact info
 *
 * HOW IT WORKS
 * ------------
 * Every HTML page has two placeholder divs:
 *   <div id="site-navbar"></div>   ← announcement bar + navbar injected here
 *   <div id="site-footer"></div>   ← footer injected here
 *
 * When the page loads, DOMContentLoaded fires renderNavbar() and renderFooter(),
 * which write the HTML into those placeholders.
 *
 * TO UPDATE CONTENT (phone, email, links, social URLs etc.)
 * ----------------------------------------------------------
 * All real data is defined in the CONFIG object at the top of this file.
 * Change it there once and it updates everywhere automatically.
 * =============================================================================
 */


/* =============================================================================
   SECTION 1 — SITE CONFIGURATION
   Edit this block to update contact details, social links, and Formspree IDs.
   ============================================================================= */

const CONFIG = {

  /* --- Contact details ---------------------------------------------------- */
  phone:        '+233 245 676 676',
  phoneTel:     'tel:+233245676676',          // href-safe version for <a href>
  whatsapp:     'https://wa.me/233245676676',
  email:        'codebridgeafrica@gmail.com',
  address:      'Ashaley Botwe, Accra, Ghana',
  mapsUrl:      'https://maps.google.com/?q=Ashaley+Botwe+Accra+Ghana',

  /* --- Social media URLs -------------------------------------------------- */
  // Replace '#' with the real URL when the account is ready
  social: {
    facebook:  'https://web.facebook.com/codebridgeafrica',
    instagram: 'https://www.instagram.com/codebridgeafrica',
    tiktok:    'https://www.tiktok.com/@codebridgeafrica',
    youtube:   '#',                                          // ← add URL when ready
    twitter:   'https://x.com/CodebridgeAfric',
    linkedin:  'https://www.linkedin.com/company/codebridge-africa/',
    github:    '#',                                          // ← add URL when ready
  },

  /* --- Formspree form IDs ------------------------------------------------- */
  // 1. Sign up free at https://formspree.io
  // 2. Create a form, copy the ID (e.g. "xpwzknlj")
  // 3. Paste it below replacing the placeholder strings
  formspreeContactId:      'YOUR_FORMSPREE_CONTACT_ID',      // contact + newsletter
  formspreeRegistrationId: 'YOUR_FORMSPREE_REGISTRATION_ID', // enrolment form

};


/* =============================================================================
   SECTION 2 — SITE ROOT RESOLVER
   Figures out the correct relative path prefix so links work from any page,
   whether the file is in the root (index.html) or in /pages/ (about.html).
   Works for both file:// (local preview) and https:// (GitHub Pages).
   ============================================================================= */

function getSiteRoot() {
  // Pages inside /pages/ need to go up one level to reach root assets
  return window.location.pathname.includes('/pages/') ? '../' : '';
}

// ROOT is used throughout as a prefix: e.g. ROOT + 'images/logo.png'
const ROOT = getSiteRoot();


/* =============================================================================
   SECTION 3 — ACTIVE PAGE DETECTION
   Returns a short string identifying which page is currently open.
   Used to add the 'active' class to the correct nav link.
   ============================================================================= */

function getActivePage() {
  const path = window.location.pathname;

  // Root / homepage
  if (path.endsWith('index.html') || path.endsWith('/')) return 'home';

  // Map URL keywords to page identifiers
  const pages = [
    ['about',              'about'],
    ['academy',            'academy'],
    ['courses',            'courses'],
    ['pathway-kids',       'pathway-kids'],
    ['pathway-teens',      'pathway-teens'],
    ['pathway-university', 'pathway-university'],
    ['pathway-adults',     'pathway-adults'],
    ['pathway-career',     'pathway-career'],
    ['services',           'services'],
    ['roadmap',            'roadmap'],
    ['blog',               'blog'],
    ['careers',            'careers'],
    ['contact',            'contact'],
    ['faq',                'faq'],
    ['standards',          'standards'],
    ['projects',           'projects'],
    ['portal',             'portal'],
    ['privacy',            'privacy'],
    ['terms',              'terms'],
    ['sitemap',            'sitemap'],
  ];

  for (const [keyword, id] of pages) {
    if (path.includes(keyword)) return id;
  }

  return ''; // Unknown page — no active state
}


/* =============================================================================
   SECTION 4 — ANNOUNCEMENT BAR + NAVBAR RENDERER
   Builds the HTML string and injects it into #site-navbar, then wires up
   the mobile toggle button and outside-click-to-close behaviour.
   ============================================================================= */

function renderNavbar() {

  // Find the placeholder div — exit silently if not on this page
  const container = document.getElementById('site-navbar');
  if (!container) return;

  // Shorthand for active page (used to highlight the correct nav link)
  const ap = getActivePage();

  // Helper: returns 'active' class string if the given page ID matches current page
  const isActive = (id) => ap === id ? 'active' : '';

  // Helper: returns 'active' if current page is any of the given IDs (for dropdowns)
  const isActiveAny = (...ids) => ids.includes(ap) ? 'active' : '';

  // ── Academy dropdown pages ────────────────────────────────────────────────
  // These pages all live under The Academy dropdown, so that link is highlighted
  // when any of them are open.
  const academyPages = [
    'academy', 'courses',
    'pathway-kids', 'pathway-teens', 'pathway-university',
    'pathway-adults', 'pathway-career',
    'roadmap', 'standards', 'projects',
  ];

  // ── Company dropdown pages ────────────────────────────────────────────────
  const companyPages = ['about', 'blog', 'careers', 'faq'];

  // ── Build and inject the HTML ─────────────────────────────────────────────
  container.innerHTML = `

    <!-- =====================================================================
         ANNOUNCEMENT BAR
         Light-coloured top strip with logo, contact info, and enrol button.
         ===================================================================== -->
    <div class="announcement-bar">
      <div class="announcement-inner">

        <!-- LEFT: Logo -->
        <div class="ann-left">
          <a href="${ROOT}index.html" aria-label="CodeBridge Africa Home">
            <img src="${ROOT}images/logo.png"
                 alt="CodeBridge Africa"
                 style="height:34px;width:auto;display:block;" />
          </a>
        </div>

        <!-- CENTRE: Contact info strip -->
        <div class="ann-center">

          <!-- Admissions notice -->
          <span class="ann-badge">
            <i class="bi bi-megaphone-fill"></i>
            ADMISSIONS OPEN
          </span>

          <span class="ann-divider">|</span>

          <!-- Location -->
          <span class="ann-item">
            <i class="bi bi-geo-alt-fill"></i>
            ${CONFIG.address}
          </span>

          <span class="ann-divider">|</span>

          <!-- Phone -->
          <a href="${CONFIG.phoneTel}" class="ann-item">
            <i class="bi bi-telephone-fill"></i>
            ${CONFIG.phone}
          </a>

          <span class="ann-divider">|</span>

          <!-- WhatsApp -->
          <a href="${CONFIG.whatsapp}" target="_blank" rel="noopener" class="ann-item">
            <i class="bi bi-whatsapp"></i> WhatsApp
          </a>

          <span class="ann-divider">|</span>

          <!-- Email -->
          <a href="mailto:${CONFIG.email}" class="ann-item">
            <i class="bi bi-envelope-fill"></i>
            ${CONFIG.email}
          </a>

        </div>

        <!-- RIGHT: Enrol Now button -->
        <div class="ann-right">
          <a href="${ROOT}index.html#registration" class="ann-enrol-btn">
            <i class="bi bi-person-plus-fill"></i> Enrol Now
          </a>
        </div>

      </div>
    </div><!-- /announcement-bar -->


    <!-- =====================================================================
         MAIN NAVBAR
         Sticky dark nav bar. Links spread evenly. Student Portal pinned right.
         ===================================================================== -->
    <nav class="navbar" id="navbar" role="navigation" aria-label="Main navigation">
      <div class="container">
        <div class="navbar-inner">

          <!-- MOBILE: Hamburger toggle button (hidden on desktop) -->
          <button class="navbar-toggler" id="navToggler"
                  aria-controls="navMenu"
                  aria-expanded="false"
                  aria-label="Toggle navigation">
            <i class="bi bi-list"></i>
          </button>

          <!-- NAV LINKS LIST ─────────────────────────────────────────────── -->
          <ul class="navbar-nav" id="navMenu" role="list">

            <!-- Home -->
            <li>
              <a class="nav-link ${isActive('home')}"
                 href="${ROOT}index.html">
                <i class="bi bi-house-fill"></i> Home
              </a>
            </li>

            <!-- About Us (direct link, no dropdown) -->
            <li>
              <a class="nav-link ${isActive('about')}"
                 href="${ROOT}pages/about.html">
                <i class="bi bi-people-fill"></i> About Us
              </a>
            </li>

            <!-- The Academy — dropdown ──────────────────────────────────── -->
            <li class="has-dropdown">
              <a class="nav-link ${isActiveAny(...academyPages)}"
                 href="${ROOT}pages/academy.html">
                <i class="bi bi-mortarboard-fill"></i> The Academy
              </a>
              <ul class="dropdown-menu" role="list">

                <li><span class="dropdown-header">Programmes</span></li>
                <li>
                  <a href="${ROOT}pages/academy.html">
                    <i class="bi bi-mortarboard" style="color:var(--color-primary)"></i>
                    Academy Overview
                  </a>
                </li>
                <li>
                  <a href="${ROOT}pages/courses.html">
                    <i class="bi bi-grid" style="color:var(--color-primary)"></i>
                    All Courses
                  </a>
                </li>

                <li class="dropdown-divider"></li>
                <li><span class="dropdown-header">Learning Pathways</span></li>

                <li>
                  <a href="${ROOT}pages/pathway-kids.html">
                    <i class="bi bi-stars" style="color:var(--color-primary)"></i>
                    Kids (Ages 6–12)
                  </a>
                </li>
                <li>
                  <a href="${ROOT}pages/pathway-teens.html">
                    <i class="bi bi-lightning" style="color:var(--color-teal)"></i>
                    Teen Techies (13–19)
                  </a>
                </li>
                <li>
                  <a href="${ROOT}pages/pathway-university.html">
                    <i class="bi bi-building" style="color:var(--color-yellow)"></i>
                    University Students
                  </a>
                </li>
                <li>
                  <a href="${ROOT}pages/pathway-adults.html">
                    <i class="bi bi-briefcase" style="color:var(--color-green)"></i>
                    Adults &amp; Professionals
                  </a>
                </li>
                <li>
                  <a href="${ROOT}pages/pathway-career.html">
                    <i class="bi bi-arrow-repeat" style="color:var(--color-navy)"></i>
                    Career Switchers
                  </a>
                </li>

                <li class="dropdown-divider"></li>
                <li><span class="dropdown-header">Resources</span></li>

                <li>
                  <a href="${ROOT}pages/roadmap.html">
                    <i class="bi bi-map" style="color:var(--color-teal)"></i>
                    Degree Roadmap
                  </a>
                </li>
                <li>
                  <a href="${ROOT}pages/standards.html">
                    <i class="bi bi-award" style="color:var(--color-green)"></i>
                    CS Standards
                  </a>
                </li>
                <li>
                  <a href="${ROOT}pages/projects.html">
                    <i class="bi bi-collection" style="color:var(--color-primary)"></i>
                    Student Projects
                  </a>
                </li>

              </ul>
            </li><!-- /academy dropdown -->

            <!-- IT Services — dropdown ──────────────────────────────────── -->
            <li class="has-dropdown">
              <a class="nav-link ${isActive('services')}"
                 href="${ROOT}pages/services.html">
                <i class="bi bi-laptop"></i> IT Services
              </a>
              <ul class="dropdown-menu" role="list">
                <li>
                  <a href="${ROOT}pages/services.html#software">
                    <i class="bi bi-code-slash" style="color:var(--color-primary)"></i>
                    Software Development
                  </a>
                </li>
                <li>
                  <a href="${ROOT}pages/services.html#consulting">
                    <i class="bi bi-graph-up" style="color:var(--color-teal)"></i>
                    IT Consulting
                  </a>
                </li>
                <li>
                  <a href="${ROOT}pages/services.html#network">
                    <i class="bi bi-router" style="color:var(--color-green)"></i>
                    Network Solutions
                  </a>
                </li>
                <li>
                  <a href="${ROOT}pages/services.html#support">
                    <i class="bi bi-headset" style="color:var(--color-navy)"></i>
                    Tech Support
                  </a>
                </li>
                <li class="dropdown-divider"></li>
                <li>
                  <a href="${ROOT}pages/contact.html">
                    <i class="bi bi-chat-dots" style="color:var(--color-primary)"></i>
                    Request a Quote
                  </a>
                </li>
              </ul>
            </li><!-- /it services dropdown -->

            <!-- Company — dropdown ───────────────────────────────────────── -->
            <li class="has-dropdown">
              <a class="nav-link ${isActiveAny(...companyPages)}"
                 href="${ROOT}pages/about.html">
                <i class="bi bi-building"></i> Company
              </a>
              <ul class="dropdown-menu" role="list">
                <li>
                  <a href="${ROOT}pages/about.html">
                    <i class="bi bi-info-circle" style="color:var(--color-primary)"></i>
                    About Us
                  </a>
                </li>
                <li>
                  <a href="${ROOT}pages/roadmap.html">
                    <i class="bi bi-map" style="color:var(--color-teal)"></i>
                    Our Roadmap
                  </a>
                </li>
                <li>
                  <a href="${ROOT}pages/blog.html">
                    <i class="bi bi-newspaper" style="color:var(--color-green)"></i>
                    Blog
                  </a>
                </li>
                <li>
                  <a href="${ROOT}pages/careers.html">
                    <i class="bi bi-person-badge" style="color:var(--color-navy)"></i>
                    Careers
                  </a>
                </li>
                <li>
                  <a href="${ROOT}pages/faq.html">
                    <i class="bi bi-question-circle" style="color:var(--color-yellow)"></i>
                    FAQ
                  </a>
                </li>
                <li class="dropdown-divider"></li>
                <li>
                  <a href="${ROOT}pages/contact.html">
                    <i class="bi bi-envelope" style="color:var(--color-primary)"></i>
                    Contact Us
                  </a>
                </li>
              </ul>
            </li><!-- /company dropdown -->

            <!-- Blog (direct link) -->
            <li>
              <a class="nav-link ${isActive('blog')}"
                 href="${ROOT}pages/blog.html">
                <i class="bi bi-newspaper"></i> Blog
              </a>
            </li>

            <!-- Contact (direct link) -->
            <li>
              <a class="nav-link ${isActive('contact')}"
                 href="${ROOT}pages/contact.html">
                <i class="bi bi-envelope"></i> Contact
              </a>
            </li>

          </ul><!-- /navbar-nav -->

          <!-- STUDENT PORTAL — pinned to extreme right ───────────────────── -->
          <div class="navbar-cta">
            <a href="${ROOT}pages/portal.html" class="btn btn-primary btn-sm">
              <i class="bi bi-person-circle"></i> Student Portal
            </a>
          </div>

        </div><!-- /navbar-inner -->
      </div><!-- /container -->
    </nav><!-- /navbar -->

  `;

  // ── Wire up mobile menu toggle ───────────────────────────────────────────
  // After injecting HTML we can now query the elements we just created
  const toggler = document.getElementById('navToggler');
  const navMenu = document.getElementById('navMenu');

  if (toggler && navMenu) {

    // Open / close the menu when the hamburger icon is clicked
    toggler.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('nav-open');
      toggler.setAttribute('aria-expanded', String(isOpen));
    });

    // Close the menu if the user clicks anywhere outside the navbar
    document.addEventListener('click', (e) => {
      const navbar = document.getElementById('navbar');
      if (navbar && !navbar.contains(e.target)) {
        navMenu.classList.remove('nav-open');
        toggler.setAttribute('aria-expanded', 'false');
      }
    });

    // Close the menu after a nav link is clicked (navigating to new page)
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('nav-open');
        toggler.setAttribute('aria-expanded', 'false');
      });
    });

  }

}// end renderNavbar()


/* =============================================================================
   SECTION 5 — FOOTER RENDERER
   Builds the full footer and injects it into #site-footer.
   Includes: brand column, pathway links, IT services links, company links,
   contact details, social icons, newsletter form, and bottom bar.
   ============================================================================= */

function renderFooter() {

  // Find the placeholder div — exit silently if not on this page
  const container = document.getElementById('site-footer');
  if (!container) return;

  // Current year for copyright line — updates automatically every year
  const year = new Date().getFullYear();

  container.innerHTML = `

    <footer class="footer" role="contentinfo">
      <div class="container">

        <!-- ==================================================================
             FOOTER GRID — four columns
             Col 1: Brand + social   Col 2: Pathways
             Col 3: IT Services      Col 4: Company + contact
             ================================================================== -->
        <div class="footer-grid">

          <!-- Column 1: Brand, tagline, social icons -->
          <div class="footer-brand">
            <img src="${ROOT}images/logo.png"
                 alt="CodeBridge Africa"
                 class="footer-logo" />
            <p>
              Empowering Africa through Computer Science Education.
              Building pathways from kids coding to accredited degrees.
            </p>
            <div class="social-links">
              <a href="${CONFIG.social.facebook}"
                 class="social-link" target="_blank" rel="noopener"
                 aria-label="Facebook">
                <i class="bi bi-facebook"></i>
              </a>
              <a href="${CONFIG.social.instagram}"
                 class="social-link" target="_blank" rel="noopener"
                 aria-label="Instagram">
                <i class="bi bi-instagram"></i>
              </a>
              <a href="${CONFIG.social.tiktok}"
                 class="social-link" target="_blank" rel="noopener"
                 aria-label="TikTok">
                <i class="bi bi-tiktok"></i>
              </a>
              <a href="${CONFIG.social.youtube}"
                 class="social-link" target="_blank" rel="noopener"
                 aria-label="YouTube">
                <i class="bi bi-youtube"></i>
              </a>
              <a href="${CONFIG.social.twitter}"
                 class="social-link" target="_blank" rel="noopener"
                 aria-label="Twitter / X">
                <i class="bi bi-twitter-x"></i>
              </a>
              <a href="${CONFIG.social.linkedin}"
                 class="social-link" target="_blank" rel="noopener"
                 aria-label="LinkedIn">
                <i class="bi bi-linkedin"></i>
              </a>
              <a href="${CONFIG.social.github}"
                 class="social-link" target="_blank" rel="noopener"
                 aria-label="GitHub">
                <i class="bi bi-github"></i>
              </a>
            </div>
          </div>

          <!-- Column 2: Learning Pathways links -->
          <div>
            <span class="footer-heading">Learning Pathways</span>
            <ul class="footer-links">
              <li>
                <a href="${ROOT}pages/pathway-kids.html">
                  <i class="bi bi-stars"></i> Kids (Ages 6–12)
                </a>
              </li>
              <li>
                <a href="${ROOT}pages/pathway-teens.html">
                  <i class="bi bi-lightning"></i> Teen Techies (13–19)
                </a>
              </li>
              <li>
                <a href="${ROOT}pages/pathway-university.html">
                  <i class="bi bi-building"></i> University Students
                </a>
              </li>
              <li>
                <a href="${ROOT}pages/pathway-adults.html">
                  <i class="bi bi-briefcase"></i> Adults &amp; Professionals
                </a>
              </li>
              <li>
                <a href="${ROOT}pages/pathway-career.html">
                  <i class="bi bi-arrow-repeat"></i> Career Switchers
                </a>
              </li>
              <li>
                <a href="${ROOT}pages/courses.html">
                  <i class="bi bi-grid"></i> All Courses
                </a>
              </li>
              <li>
                <a href="${ROOT}pages/roadmap.html">
                  <i class="bi bi-map"></i> Degree Roadmap
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 3: IT Services links -->
          <div>
            <span class="footer-heading">IT Services</span>
            <ul class="footer-links">
              <li>
                <a href="${ROOT}pages/services.html#software">
                  <i class="bi bi-code-slash"></i> Software Development
                </a>
              </li>
              <li>
                <a href="${ROOT}pages/services.html#consulting">
                  <i class="bi bi-graph-up"></i> IT Consulting
                </a>
              </li>
              <li>
                <a href="${ROOT}pages/services.html#network">
                  <i class="bi bi-router"></i> Network Solutions
                </a>
              </li>
              <li>
                <a href="${ROOT}pages/services.html#support">
                  <i class="bi bi-headset"></i> Tech Support
                </a>
              </li>
              <li>
                <a href="${ROOT}pages/contact.html">
                  <i class="bi bi-chat-dots"></i> Request a Quote
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 4: Company links + contact details -->
          <div>
            <span class="footer-heading">Company</span>
            <ul class="footer-links">
              <li>
                <a href="${ROOT}pages/about.html">
                  <i class="bi bi-info-circle"></i> About Us
                </a>
              </li>
              <li>
                <a href="${ROOT}pages/blog.html">
                  <i class="bi bi-newspaper"></i> Blog
                </a>
              </li>
              <li>
                <a href="${ROOT}pages/careers.html">
                  <i class="bi bi-person-badge"></i> Careers
                </a>
              </li>
              <li>
                <a href="${ROOT}pages/faq.html">
                  <i class="bi bi-question-circle"></i> FAQ
                </a>
              </li>
              <li>
                <a href="${ROOT}pages/contact.html">
                  <i class="bi bi-envelope"></i> Contact Us
                </a>
              </li>
              <li>
                <a href="${ROOT}pages/portal.html">
                  <i class="bi bi-person-circle"></i> Student Portal
                </a>
              </li>
            </ul>

            <!-- Contact details block inside Company column -->
            <div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,0.08)">
              <p style="color:rgba(255,255,255,0.6);font-size:0.82rem;margin-bottom:0.4rem;display:flex;align-items:center;gap:6px">
                <i class="bi bi-geo-alt" style="color:var(--color-primary)"></i>
                ${CONFIG.address}
              </p>
              <p style="color:rgba(255,255,255,0.6);font-size:0.82rem;margin-bottom:0.4rem;display:flex;align-items:center;gap:6px">
                <i class="bi bi-telephone" style="color:var(--color-primary)"></i>
                <a href="${CONFIG.phoneTel}"
                   style="color:rgba(255,255,255,0.6)">${CONFIG.phone}</a>
              </p>
              <p style="color:rgba(255,255,255,0.6);font-size:0.82rem;margin-bottom:0.4rem;display:flex;align-items:center;gap:6px">
                <i class="bi bi-whatsapp" style="color:var(--color-primary)"></i>
                <a href="${CONFIG.whatsapp}" target="_blank" rel="noopener"
                   style="color:rgba(255,255,255,0.6)">WhatsApp Us</a>
              </p>
              <p style="color:rgba(255,255,255,0.6);font-size:0.82rem;margin:0;display:flex;align-items:center;gap:6px">
                <i class="bi bi-envelope" style="color:var(--color-primary)"></i>
                <a href="mailto:${CONFIG.email}"
                   style="color:rgba(255,255,255,0.6)">${CONFIG.email}</a>
              </p>
            </div>
          </div>

        </div><!-- /footer-grid -->


        <!-- ==================================================================
             NEWSLETTER STRIP
             Email signup form. Requires a Formspree ID in CONFIG above.
             ================================================================== -->
        <div style="
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:var(--radius-lg);
          padding:var(--space-lg) var(--space-xl);
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:var(--space-md);
          flex-wrap:wrap;
          margin-bottom:var(--space-xl)
        ">
          <div>
            <h4 style="color:#fff;font-size:1rem;margin-bottom:0.2rem;font-family:var(--font-display)">
              <i class="bi bi-envelope-heart" style="color:var(--color-primary);margin-right:6px"></i>
              Stay in the Loop
            </h4>
            <p style="color:rgba(255,255,255,0.55);font-size:0.82rem;margin:0">
              Course updates and tech insights from CodeBridge Africa.
            </p>
          </div>
          <form id="newsletterForm" style="display:flex;gap:0.5rem;flex-wrap:wrap">
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              required
              style="
                padding:0.6rem 1rem;
                border-radius:var(--radius-md);
                border:1px solid rgba(255,255,255,0.2);
                background:rgba(255,255,255,0.1);
                color:#fff;
                font-size:0.88rem;
                min-width:220px;
                outline:none;
                font-family:var(--font-body)
              "
            />
            <button type="submit" class="btn btn-primary btn-sm">
              Subscribe
            </button>
          </form>
        </div>


        <!-- ==================================================================
             FOOTER BOTTOM BAR
             Copyright, legal links, sitemap.
             ================================================================== -->
        <div class="footer-bottom">
          <p>
            &copy; ${year} CodeBridge Africa. All rights reserved.
            Built in Africa <i class="bi bi-globe-africa" style="color:var(--color-green)"></i>
          </p>
          <ul class="footer-bottom-links">
            <li><a href="${ROOT}pages/privacy.html">Privacy Policy</a></li>
            <li><a href="${ROOT}pages/terms.html">Terms of Use</a></li>
            <li><a href="${ROOT}pages/sitemap.html">Sitemap</a></li>
          </ul>
        </div>

      </div>
    </footer>

  `;

  // ── Wire up newsletter form ──────────────────────────────────────────────
  const nlForm = document.getElementById('newsletterForm');
  if (!nlForm) return;

  nlForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email  = nlForm.querySelector('[name="email"]').value;
    const btn    = nlForm.querySelector('button[type="submit"]');
    const id     = 'xpqybqqg';

    // If the Formspree ID hasn't been configured yet, show a friendly message
    // rather than a confusing error, and exit early.
    if (id === 'xpqybqqg') {
      if (typeof showToast === 'function') {
        showToast('Thanks! Newsletter will be live soon.', 'success');
      }
      nlForm.reset();
      return;
    }

    // Disable button while request is in flight
    btn.disabled = true;
    btn.textContent = 'Subscribing…';

    try {
      const res = await fetch(`https://formspree.io/f/${id}`, {
        method:  'POST',
        body:    JSON.stringify({ email, _subject: 'Newsletter Signup — CodeBridge Africa' }),
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      });

      if (res.ok) {
        if (typeof showToast === 'function') {
          showToast('Subscribed! Welcome to the CodeBridge community.', 'success');
        }
        nlForm.reset();
      } else {
        throw new Error('Formspree returned non-OK response');
      }

    } catch (err) {
      console.error('Newsletter error:', err);
      if (typeof showToast === 'function') {
        showToast('Could not subscribe. Please try again.', 'error');
      }
    }

    // Restore button state
    btn.disabled = false;
    btn.textContent = 'Subscribe';

  });

}// end renderFooter()


/* =============================================================================
   SECTION 6 — INITIALISATION
   Wait for the DOM to be ready, then render both components.
   DOMContentLoaded fires before images load but after HTML is parsed,
   which is the correct time to inject shared components.
   ============================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();
});
