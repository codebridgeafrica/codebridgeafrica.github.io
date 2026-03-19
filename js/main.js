/**
 * =============================================================================
 * CodeBridge Africa - Main JavaScript
 * File: js/main.js
 * Description: Handles all interactive behaviours for the website including:
 *   - Mobile navigation toggle
 *   - Sticky navbar scroll effects
 *   - Scroll-reveal animations
 *   - Form validation and submission via Formspree (GitHub Pages compatible)
 *   - Toast notifications
 *   - Back-to-top button
 *   - Smooth scroll for anchor links
 * =============================================================================
 */

/* =============================================================================
   IMMEDIATELY INVOKED: Set current year in footer copyright
   ============================================================================= */
document.addEventListener('DOMContentLoaded', () => {
  // Insert current year wherever .js-year appears
  document.querySelectorAll('.js-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});

/* =============================================================================
   1. NAVIGATION - Mobile toggle & scroll effects
   ============================================================================= */
(function initNavigation() {

  const navbar   = document.getElementById('navbar');
  const toggler  = document.getElementById('navToggler');
  const navMenu  = document.getElementById('navMenu');

  if (!navbar) return; // Exit if no navbar on page

  /**
   * Toggle mobile menu open/close
   * Adds/removes the CSS class 'nav-open' which shows the menu
   */
  if (toggler && navMenu) {
    toggler.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('nav-open');
      // Update ARIA attributes for accessibility
      toggler.setAttribute('aria-expanded', isOpen);
      navMenu.setAttribute('aria-hidden', !isOpen);
    });

    // Close menu when a nav link is clicked (single-page navigation)
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('nav-open');
        toggler.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navMenu.classList.remove('nav-open');
        toggler.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /**
   * Highlight active nav link based on current scroll position
   * Loops through all sections and checks if they're in the viewport
   */
  function updateActiveNavLink() {
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
    const scrollPos = window.scrollY + 120; // Offset for sticky header

    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${section.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Listen to scroll for active link updates
  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

})();

/* =============================================================================
   2. BACK TO TOP BUTTON
   ============================================================================= */
(function initBackToTop() {

  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  // Show button after scrolling 400px
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  // Scroll smoothly to top on click
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

})();

/* =============================================================================
   3. SCROLL REVEAL ANIMATIONS
   Uses IntersectionObserver for performance-friendly reveal on scroll
   ============================================================================= */
(function initScrollReveal() {

  // IntersectionObserver triggers when element enters the viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve after reveal so it doesn't re-trigger
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,      // Trigger when 10% of element is visible
    rootMargin: '0px 0px -50px 0px' // Slight offset from bottom
  });

  // Observe all elements with the .reveal class
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

})();

/* =============================================================================
   4. SMOOTH SCROLL for anchor links
   ============================================================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return; // Skip empty hashes

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      // Get sticky navbar height dynamically to offset scroll
      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 72;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});

/* =============================================================================
   5. TOAST NOTIFICATION SYSTEM
   Shows dismissible toast messages at the bottom-right corner
   ============================================================================= */

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type    - 'success' | 'error' | 'info'
 * @param {number} duration - Auto-dismiss in ms (default: 5000)
 */
function showToast(message, type = 'success', duration = 5000) {
  // Create container if it doesn't exist
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  // Icons per type
  const icons = {
    success: '✅',
    error:   '❌',
    info:    'ℹ️'
  };

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span style="flex-shrink:0">${icons[type] || icons.info}</span>
    <span style="flex:1">${message}</span>
    <button onclick="this.parentElement.remove()" 
            style="background:none;border:none;cursor:pointer;font-size:1rem;color:#999;padding:0;margin-left:8px;"
            aria-label="Dismiss">&times;</button>
  `;

  container.appendChild(toast);

  // Auto-remove after duration
  setTimeout(() => {
    toast.style.animation = 'toastIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* =============================================================================
   6. FORM VALIDATION UTILITIES
   ============================================================================= */

/**
 * Validate an email address with a simple regex
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate a phone number (basic: at least 10 digits)
 * @param {string} phone
 * @returns {boolean}
 */
function isValidPhone(phone) {
  return /^\+?[\d\s\-()]{10,}$/.test(phone);
}

/**
 * Show inline field-level feedback
 * @param {HTMLElement} field  - The form field element
 * @param {string} message     - Error/success message
 * @param {string} type        - 'error' | 'success'
 */
function showFieldFeedback(field, message, type = 'error') {
  // Remove any existing feedback
  const existing = field.parentElement.querySelector('.form-feedback');
  if (existing) existing.remove();

  const feedback = document.createElement('div');
  feedback.className = `form-feedback ${type}`;
  feedback.textContent = message;
  field.parentElement.appendChild(feedback);

  // Color the field border
  field.style.borderColor = type === 'error' ? 'var(--color-primary)' : 'var(--color-green)';
}

/**
 * Clear field feedback
 * @param {HTMLElement} field
 */
function clearFieldFeedback(field) {
  const existing = field.parentElement.querySelector('.form-feedback');
  if (existing) existing.remove();
  field.style.borderColor = '';
}

/* =============================================================================
   7. REGISTRATION FORM
   Uses Formspree as backend (free, GitHub Pages compatible, sends to Gmail)
   Replace 'YOUR_FORMSPREE_ID' with your actual Formspree form ID after signup
   at https://formspree.io
   ============================================================================= */
/* =============================================================================
   DYNAMIC REGISTRATION FORM
   Listens to the category dropdown (#reg-category) and shows/hides the
   relevant form blocks. Each block is a <div class="reg-block"> identified
   by a unique id like "block-parent", "block-adult", etc.
   ============================================================================= */
(function initRegistrationForm() {

  // ── Element references ────────────────────────────────────────────────────
  const categorySelect = document.getElementById('reg-category');
  const placeholder    = document.getElementById('form-placeholder');
  const form           = document.getElementById('registrationForm');
  const statusMsg      = document.getElementById('reg-status-msg');

  // Exit if not on a page with this form
  if (!categorySelect) return;

  // ── Programme options per category ───────────────────────────────────────
  // These populate the #prog-interest dropdown when a category is chosen.
  const PROGRAMME_OPTIONS = {
    kids: [
      { value: 'digital-explorers', label: 'Digital Explorers (Ages 6–7)' },
      { value: 'code-builders',     label: 'Code Builders (Ages 8–9)' },
      { value: 'python-juniors',    label: 'Python Juniors (Ages 10–11)' },
      { value: 'project-launch',    label: 'Project Launch (Age 12)' },
    ],
    teens: [
      { value: 'teen-web',     label: 'Web Development for Teens' },
      { value: 'teen-python',  label: 'Python & Algorithms' },
      { value: 'teen-design',  label: 'UI/UX & Digital Design' },
      { value: 'teen-games',   label: 'Game Development' },
    ],
    university: [
      { value: 'uni-fullstack',     label: 'Full-Stack Web Development' },
      { value: 'uni-data',          label: 'Data Science & Analytics' },
      { value: 'uni-cloud',         label: 'Cloud Computing (AWS/GCP)' },
      { value: 'uni-cybersecurity', label: 'Cybersecurity Fundamentals' },
      { value: 'uni-project',       label: 'Capstone / Industry Project' },
    ],
    adult: [
      { value: 'adult-fullstack',     label: 'Full-Stack Web Development' },
      { value: 'adult-data',          label: 'Data Science & Analytics' },
      { value: 'adult-cloud',         label: 'Cloud Computing (AWS/GCP)' },
      { value: 'adult-cybersecurity', label: 'Cybersecurity Fundamentals' },
      { value: 'adult-python',        label: 'Python for Professionals' },
    ],
    career: [
      { value: 'career-webdev',  label: 'Web Development Track (6 months)' },
      { value: 'career-data',    label: 'Data Analytics Track (6 months)' },
    ],
  };

  // ── Block visibility map ──────────────────────────────────────────────────
  // Defines which blocks to show for each category value.
  // Key = category select value, Value = array of block IDs to show.
  const BLOCK_MAP = {
    kids:       ['block-parent', 'block-child',                        'block-programme', 'block-payment', 'block-common'],
    teens:      ['block-parent', 'block-child',                        'block-programme', 'block-payment', 'block-common'],
    university: ['block-adult',  'block-university',                   'block-programme', 'block-payment', 'block-common'],
    adult:      ['block-adult',                                        'block-programme', 'block-payment', 'block-common'],
    career:     ['block-adult',  'block-career',                       'block-programme', 'block-payment', 'block-common'],
    it:         ['block-it',                                                              'block-common'],
  };

  // All possible block IDs (used to hide all before showing the right ones)
  const ALL_BLOCKS = [
    'block-parent', 'block-child', 'block-adult',
    'block-university', 'block-career', 'block-it',
    'block-programme', 'block-payment', 'block-common',
  ];

  // ── Helper: populate the Programme dropdown ───────────────────────────────
  function populateProgrammes(category) {
    const select  = document.getElementById('prog-interest');
    if (!select) return;
    const options = PROGRAMME_OPTIONS[category] || [];

    // Clear existing options, keep the placeholder
    select.innerHTML = '<option value="">— Select —</option>';
    options.forEach(({ value, label }) => {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = label;
      select.appendChild(opt);
    });
  }

  // ── Helper: show/hide blocks based on category ────────────────────────────
  function applyCategory(category) {
    // Copy the chosen category into the hidden field so it's submitted
    const hidden = document.getElementById('reg-category-hidden');
    if (hidden) hidden.value = category;

    if (!category) {
      // Nothing selected — hide form, show placeholder
      form.style.display = 'none';
      placeholder.style.display = 'block';
      return;
    }

    // Show the form, hide the placeholder
    placeholder.style.display = 'none';
    form.style.display = 'block';

    // Hide all blocks first
    ALL_BLOCKS.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

    // Show only the blocks for this category
    const blocksToShow = BLOCK_MAP[category] || [];
    blocksToShow.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'block';
    });

    // Populate programme options if programme block is shown
    if (blocksToShow.includes('block-programme')) {
      populateProgrammes(category);
    }
  }

  // ── Listen for category change ────────────────────────────────────────────
  categorySelect.addEventListener('change', () => {
    applyCategory(categorySelect.value);
    // Clear any previous status messages
    if (statusMsg) { statusMsg.style.display = 'none'; statusMsg.textContent = ''; }
  });

  // ── Form submission ───────────────────────────────────────────────────────
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Basic consent check
      const consent = form.querySelector('[name="consent"]');
      if (consent && !consent.checked) {
        showToast('Please accept the Privacy Policy to continue.', 'error');
        return;
      }

      const submitBtn  = form.querySelector('[type="submit"]');
      const origLabel  = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Submitting…';

      // Collect all visible form data
      const formData = new FormData(form);
      formData.set('category', categorySelect.value); // ensure category is included
      formData.append('_subject', 'New Registration / Enquiry — CodeBridge Africa');

      try {
        // ── Formspree submission ──────────────────────────────────────────
        // Replace YOUR_FORMSPREE_REGISTRATION_ID with your real Formspree form ID.
        // Sign up at https://formspree.io → create a form → copy the ID.
        const FORMSPREE_ID = 'mvzwlgng';

        let formspreeOk = false;
        if (FORMSPREE_ID !== 'mvzwlgng') {
          const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
            method: 'POST',
            body: formData,
            headers: { Accept: 'application/json' },
          });
          formspreeOk = res.ok;
        } else {
          // Formspree not configured yet — treat as success for testing
          formspreeOk = true;
        }

        // ── Google Form submission (silent backup → Google Sheets) ────────
        //
        // HOW THIS WORKS:
        //   Each Google Form question has a unique entry ID (entry.XXXXXXXXX).
        //   We build a URLSearchParams object that maps our HTML field values
        //   to those entry IDs, then POST it to the Google Form's formResponse
        //   endpoint in no-cors mode (silent — no redirect, no response body).
        //
        //   This runs after Formspree. Any error is silently swallowed so it
        //   never blocks or confuses the user.
        //
        // DATA SPLIT:
        //   Formspree  → receives EVERYTHING (all fields) as an email to you.
        //   Google Sheet → receives the 9 mapped fields below as spreadsheet rows.
        //   Both run on every submission. Users see one success message.
        //
        // TO ADD MORE FIELDS:
        //   1. Open your Google Form in edit mode.
        //   2. Click the three-dot menu on a question → "Get pre-filled link".
        //   3. Fill in dummy values, click "Get link", then inspect the URL —
        //      the entry IDs appear as ?entry.XXXXXXXXX=value in the URL.
        //   4. Add a new line below: gfParams.set('entry.XXXXXXXXX', val('your_html_field_name'));
        //
        try {
          // Helper: reads a field value from the submitted form data (empty string if missing)
          const val = (name) => formData.get(name) || '';

          // Map HTML field names → Google Form entry IDs
          // ┌─────────────────────────┬──────────────────────┐
          // │ HTML field name         │ Google Form entry ID │
          // ├─────────────────────────┼──────────────────────┤
          // │ full_name / first_name  │ entry.1678745306     │
          // │ date_of_birth           │ entry.212862052      │
          // │ email / parent_email    │ entry.1488415642     │
          // │ phone / parent_phone    │ entry.2023468168     │
          // │ programme_interest      │ entry.1409945322     │
          // │ learning_mode           │ entry.71992104       │
          // │ parent_name             │ entry.68036615       │
          // │ parent_phone (guardian) │ entry.1827476286     │
          // │ referral_source         │ entry.1836181845     │
          // └─────────────────────────┴──────────────────────┘

          const gfParams = new URLSearchParams();

          // Full Name — adults use first_name + last_name, kids use child_name
          const fullName = val('first_name')
            ? `${val('first_name')} ${val('last_name')}`.trim()
            : val('child_name') || val('contact_name');
          gfParams.set('entry.1678745306', fullName);

          // Date of Birth — adults use date_of_birth, kids use child_dob
          gfParams.set('entry.212862052', val('date_of_birth') || val('child_dob'));

          // Email — adults use email, kids/teens use parent_email
          gfParams.set('entry.1488415642', val('email') || val('parent_email'));

          // Phone — adults use phone, kids/teens use parent_phone
          gfParams.set('entry.2023468168', val('phone') || val('parent_phone'));

          // Programme of Interest
          gfParams.set('entry.1409945322', val('programme_interest'));

          // Learning Mode (level/mode field)
          gfParams.set('entry.71992104', val('learning_mode'));

          // Guardian / Parent Name (for kids & teens; blank for adults)
          gfParams.set('entry.68036615', val('parent_name'));

          // Guardian Phone (for kids & teens; blank for adults)
          gfParams.set('entry.1827476286', val('parent_phone'));

          // How did they hear about us?
          gfParams.set('entry.1836181845', val('referral_source'));

          // POST to Google Form — no-cors means we get no response back,
          // but the data lands in your Google Sheet successfully.
          await fetch(
            'https://docs.google.com/forms/d/e/1FAIpQLSfIJY8U9wZDo4W1J_PBam5dmqFL_wtQljlvViNh-3zqhYGtmA/formResponse',
            {
              method:  'POST',
              body:    gfParams.toString(),
              mode:    'no-cors',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
          );

        } catch (_) { /* Silent — Google Sheets backup must never block the user */ }

        if (formspreeOk) {
          // Show success message inside the form panel
          if (statusMsg) {
            statusMsg.style.display  = 'block';
            statusMsg.style.color    = 'var(--color-green)';
            statusMsg.innerHTML      = '<i class="bi bi-check-circle-fill"></i> Thank you! Your registration was submitted. We will be in touch within 24 hours.';
          }
          showToast('Registration submitted successfully!', 'success', 7000);
          form.reset();
          // Reset to placeholder state
          categorySelect.value = '';
          applyCategory('');
        } else {
          throw new Error('Submission failed');
        }

      } catch (err) {
        console.error('Registration error:', err);
        if (statusMsg) {
          statusMsg.style.display = 'block';
          statusMsg.style.color   = 'var(--color-primary)';
          statusMsg.innerHTML     = '<i class="bi bi-exclamation-circle-fill"></i> Something went wrong. Please email us directly at <a href="mailto:codebridgeafrica@gmail.com">codebridgeafrica@gmail.com</a>';
        }
        showToast('Could not submit. Please try again or contact us directly.', 'error');
      }

      submitBtn.disabled = false;
      submitBtn.innerHTML = origLabel;
    });
  }

})();
/* =============================================================================
   8. CONTACT FORM
   Same Formspree approach, separate form ID for contact messages
   ============================================================================= */
(function initContactForm() {

  const form = document.getElementById('contactForm');
  if (!form) return;

  function validateContact() {
    let isValid = true;

    const nameField = form.querySelector('[name="name"]');
    if (!nameField.value.trim() || nameField.value.trim().length < 2) {
      showFieldFeedback(nameField, 'Please enter your name');
      isValid = false;
    }

    const emailField = form.querySelector('[name="email"]');
    if (!isValidEmail(emailField.value.trim())) {
      showFieldFeedback(emailField, 'Please enter a valid email address');
      isValid = false;
    }

    const messageField = form.querySelector('[name="message"]');
    if (!messageField.value.trim() || messageField.value.trim().length < 10) {
      showFieldFeedback(messageField, 'Please enter a message (min 10 characters)');
      isValid = false;
    }

    return isValid;
  }

  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => clearFieldFeedback(field));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateContact()) {
      showToast('Please fill in all required fields correctly.', 'error');
      return;
    }

    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Sending...';

    const formData = new FormData(form);
    formData.append('_subject', '📬 New Contact Message - CodeBridge Africa');

    try {
      /*
       * FORMSPREE CONTACT FORM
       * Replace 'YOUR_FORMSPREE_CONTACT_ID' with your contact form ID from Formspree.
       * This is a different form from registration so you can handle them separately.
       */
      const response = await fetch('https://formspree.io/f/xpqybqqg', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        showToast('✅ Message sent! We\'ll get back to you within 24 hours.', 'success', 7000);
        form.reset();
      } else {
        showToast('Failed to send message. Please try again or email us directly.', 'error');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      showToast('Network error. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

})();

/* =============================================================================
   9. COUNTER ANIMATION for Stats Bar
   Animates numbers from 0 to their target value when they scroll into view
   ============================================================================= */
(function initCounters() {

  /**
   * Animate a number counter from 0 to the target
   * @param {HTMLElement} el    - The element containing the number
   * @param {number} target     - Target number
   * @param {string} suffix     - Optional suffix like '+' or '%'
   * @param {number} duration   - Animation duration in ms
   */
  function animateCounter(el, target, suffix = '', duration = 2000) {
    const start = performance.now();

    function update(time) {
      const elapsed  = time - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for natural deceleration
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(easedProgress * target);

      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // Observe stat numbers and trigger animation on visibility
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        counterObserver.unobserve(el); // Only animate once
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    counterObserver.observe(el);
  });

})();

/* =============================================================================
   10. COURSE INTEREST DYNAMIC PRICING
   When a course is selected in the registration form, show estimated fee
   ============================================================================= */
(function initCoursePricing() {

  // Course fees in GHS (Ghana Cedis) - update as needed
  const courseFees = {
    'codebridge-kids':    'GHS 350/month',
    'teen-techies':       'GHS 450/month',
    'adult-pro':          'GHS 600/month',
    'web-development':    'GHS 550/month',
    'data-science':       'GHS 650/month',
    'cybersecurity':      'GHS 700/month',
    'it-consulting':      'Contact us for quote'
  };

  const courseSelect  = document.querySelector('#registrationForm [name="course_interest"]');
  const feeDisplay    = document.getElementById('course-fee-display');

  if (!courseSelect || !feeDisplay) return;

  courseSelect.addEventListener('change', () => {
    const selected = courseSelect.value;
    const fee      = courseFees[selected];

    if (fee) {
      feeDisplay.innerHTML = `
        <div style="margin-top:0.5rem;padding:0.6rem 1rem;
             background:rgba(46,125,50,0.08);border-radius:6px;
             border-left:3px solid var(--color-green);
             font-size:0.9rem;color:var(--color-green);font-weight:600;">
          💰 Estimated Fee: ${fee}
        </div>`;
    } else {
      feeDisplay.innerHTML = '';
    }
  });

})();

/* =============================================================================
   11. FAQ ACCORDION (for pages that include an FAQ section)
   ============================================================================= */
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer   = item.querySelector('.faq-answer');

  if (!question || !answer) return;

  // Start closed
  answer.style.maxHeight = '0';
  answer.style.overflow  = 'hidden';
  answer.style.transition = 'max-height 0.3s ease, padding 0.3s ease';

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('faq-open');

    // Close all other items
    document.querySelectorAll('.faq-item.faq-open').forEach(openItem => {
      openItem.classList.remove('faq-open');
      openItem.querySelector('.faq-answer').style.maxHeight = '0';
      openItem.querySelector('.faq-question .faq-icon').textContent = '+';
    });

    if (!isOpen) {
      item.classList.add('faq-open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
      question.querySelector('.faq-icon').textContent = '−';
    }
  });
});

/* =============================================================================
   12. LAZY LOADING for non-critical images
   ============================================================================= */
if ('IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imageObserver.observe(img));
}

/* =============================================================================
   End of main.js
   ============================================================================= */
