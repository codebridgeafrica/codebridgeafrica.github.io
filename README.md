# CodeBridge Africa Website

**Version:** 4.0  
**Hosted at:** https://codebridgeafrica.github.io  
**Stack:** Static HTML · CSS · Vanilla JS · Bootstrap Icons · Google Fonts  
**Compatible with:** GitHub Pages (free) — no server required


## Quick Deploy to GitHub Pages

1. Create a GitHub repository named exactly: `codebridgeafrica.github.io`
2. Upload **all files** (keeping the same folder structure)
3. Go to **Settings → Pages → Source → Deploy from branch → main / (root)**
4. Your site will be live at `https://codebridgeafrica.github.io`


## THINGS YOU MUST CONFIGURE BEFORE GOING LIVE

The following items are **placeholders** that need your real data. Each one shows the exact file and what to change.


### 1. FORMSPREE — Receive contact form emails

Forms won't work until you set this up.

**Steps:**
1. Go to https://formspree.io and sign up (free — 50 submissions/month per form)
2. Click **+ New Form**, name it "Registration Form" → copy the Form ID (e.g. `xpwzknlj`)
3. Create a second form named "Contact Form" → copy its Form ID
4. Open `js/main.js` and replace:
   - `YOUR_FORMSPREE_REGISTRATION_ID` → your registration form ID
   - `YOUR_FORMSPREE_CONTACT_ID` → your contact form ID
5. Open `pages/contact.html` and replace `YOUR_FORMSPREE_CONTACT_ID`
6. Open `js/components.js` and replace `YOUR_FORMSPREE_CONTACT_ID` (newsletter form)
7. Open `pages/portal.html` and replace `YOUR_FORMSPREE_CONTACT_ID`

**File:** `js/main.js` — lines with `YOUR_FORMSPREE_REGISTRATION_ID` and `YOUR_FORMSPREE_CONTACT_ID`  
**File:** `pages/contact.html` — inside the `<script>` at the bottom  
**File:** `js/components.js` — inside the newsletter form handler  
**File:** `pages/portal.html` — inside the `<script>` at the bottom  


### 2. GOOGLE FORM — Store registrations in Google Sheets

The registration form already posts to your Google Form. However, you need to **map the field names** so data lands in the right columns.

**Your Google Form URL:**  
`https://docs.google.com/forms/d/e/1FAIpQLSfIJY8U9wZDo4W1J_PBam5dmqFL_wtQljlvViNh-3zqhYGtmA/viewform`

**Steps to map fields:**
1. Open your Google Form in edit mode
2. Add questions matching these field names (the `name=""` attributes in the HTML form):
   - `full_name`
   - `date_of_birth`
   - `email`
   - `phone`
   - `programme`
   - `level`
   - `guardian_name` (for kids/teens)
   - `guardian_phone`
   - `how_heard`
3. Each Google Form question has an `entry.XXXXXXXXX` ID — you can find them by viewing the form source or using a tool like https://tools.respondent.io/google-form
4. Open `js/main.js`, find the Google Form section, and update the field mappings

**Note:** The form currently posts in `no-cors` mode, which works but doesn't give a success/failure response. The Formspree submission provides the confirmation message.


### 3. GOOGLE MAPS — Add your map embed

**File:** `pages/contact.html` — near the bottom in the "Our Location" section

**Steps:**
1. Go to https://maps.google.com
2. Search for your address
3. Click **Share → Embed a map → Copy HTML**
4. Replace the placeholder div with your `<iframe>` embed code


### 4. YOUTUBE — Update URL when ready

**File:** `js/components.js` — in the footer social links section  
Find: `<a href="#" class="social-link" aria-label="YouTube">`  
Replace `#` with your YouTube channel URL (e.g. `https://www.youtube.com/@codebridgeafrica`)


### 5. GITHUB — Update URL when ready

**File:** `js/components.js` — in the footer social links section  
Find: `<a href="#" class="social-link" aria-label="GitHub">`  
Replace `#` with your GitHub URL (e.g. `https://github.com/codebridgeafrica`)


### 6. PHP EMAIL (optional — for non-static hosting)

If you later move to a PHP-capable host (Bluehost, Hostinger, etc.) you can use the PHP mailer in `php/send_email.php`.

**Setup steps for Gmail:**
1. Log into https://myaccount.google.com
2. Go to **Security → 2-Step Verification** → enable it
3. Go to **Security → App Passwords** → create a new one (name: "CodeBridge Website")
4. Copy the 16-character app password
5. Open `php/send_email.php` and fill in:
   - `$fromEmail` = `codebridgeafrica@gmail.com`
   - `$appPassword` = the 16-character password (no spaces)
   - `$toEmail` = `codebridgeafrica@gmail.com`
6. Upload the `php/` folder to your web host's `public_html`
7. In each form's `action=""` attribute, point to `php/send_email.php`

**Note:** This is NOT needed for GitHub Pages. Only set this up if you move to a different host.


### 7. STUDENT PORTAL — Remove Coming-Soon overlay when ready

**File:** `pages/portal.html`  
When your portal backend is ready, delete the entire `<div class="portal-overlay">...</div>` block.


### 8. Student Project Placeholder Links

When students have real project links, update the `href="#"` on each project card's button.

**File:** `pages/projects.html` — find `href="#"` buttons and replace with real project/GitHub URLs.


## FILE STRUCTURE

```
codebridge-africa/
├── index.html                  ← Homepage (hero, programmes, registration, testimonials)
├── 404.html                    ← Custom 404 error page
├── README.md                   ← This file
├── .gitignore
│
├── css/
│   └── style.css               ← All styles (brand tokens, components, responsive)
│
├── js/
│   ├── components.js           ← Shared navbar + footer (injected on every page)
│   └── main.js                 ← Form handling, animations, interactions
│
├── images/
│   ├── logo.png                ← Your logo (used in navbar and footer)
│   └── hero-illustration.png   ← Homepage hero image
│
├── pages/
│   ├── about.html              ← About CodeBridge Africa
│   ├── academy.html            ← Academy overview
│   ├── blog.html               ← Blog / news
│   ├── careers.html            ← Job openings
│   ├── contact.html            ← Contact form + info
│   ├── courses.html            ← All courses listing
│   ├── faq.html                ← Frequently asked questions
│   ├── pathway-kids.html       ← Kids pathway (ages 6–12)
│   ├── pathway-teens.html      ← Teen Techies pathway (13–19)
│   ├── pathway-university.html ← University students pathway
│   ├── pathway-adults.html     ← Adults & Professionals pathway
│   ├── pathway-career.html     ← Career Switchers pathway
│   ├── portal.html             ← Student portal (coming soon)
│   ├── privacy.html            ← Privacy policy
│   ├── projects.html           ← Student project showcase
│   ├── roadmap.html            ← Future degree roadmap
│   ├── services.html           ← IT services
│   ├── sitemap.html            ← Sitemap
│   ├── standards.html          ← CS education standards
│   └── terms.html              ← Terms of use
│
└── php/                        ← Optional PHP mailer (not used on GitHub Pages)
    ├── send_email.php
    └── composer.json
```

## BRAND COLOURS

| Colour       | Hex       | Usage                          |
|--------------|-----------|--------------------------------|
| Orange       | `#E85D1A` | Primary CTAs, highlights       |
| Deep Navy    | `#1A2B4A` | Navbar, headings, dark sections|
| Africa Green | `#2E7D32` | Success states, adults pathway |
| Code Yellow  | `#F0B429` | Accents, badges, teens pathway |
| Code Teal    | `#00897B` | IT services, career switchers  |

**Fonts:** Montserrat (headings) · Open Sans (body) · JetBrains Mono (code accents)


## SOCIAL MEDIA LINKS (currently configured)

| Platform   | URL                                                    |
|------------|--------------------------------------------------------|
| Facebook   | https://web.facebook.com/codebridgeafrica              |
| Instagram  | https://www.instagram.com/codebridgeafrica             |
| TikTok     | https://www.tiktok.com/@codebridgeafrica               |
| Twitter/X  | https://x.com/CodebridgeAfric                          |
| LinkedIn   | https://www.linkedin.com/company/codebridge-africa/   |
| YouTube    | **PLACEHOLDER — update in `js/components.js`**        |
| GitHub     | **PLACEHOLDER — update in `js/components.js`**        |


## CONTACT DETAILS (currently configured)

| Item        | Value                            |
|-------------|----------------------------------|
| Phone       | +233 245 676 676                 |
| WhatsApp    | +233 245 676 676                 |
| Email       | codebridgeafrica@gmail.com       |
| Address     | Ashaley Botwe, Accra, Ghana      |


## SUPPORT

For technical help with the website, contact: pvayittah@gmail.com
