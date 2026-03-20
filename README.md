# CodeBridge Africa — Website

**Live URL:** https://codebridgeafrica.github.io  
**Stack:** HTML · CSS · Vanilla JavaScript · Bootstrap Icons · Google Fonts  
**Hosting:** GitHub Pages (free, static — no server required)  
**Developer:** pvayittah@gmail.com

---

## PRE-LAUNCH CHECKLIST

Work through every item below before announcing the site publicly.  
Items marked ✅ are already done. Items marked ⬜ still need your action.

---

## ⬜ 1. FORMSPREE — Verify email notifications are active

You have 6 Formspree forms already configured. You need to **verify your email** on each one so notifications are delivered.

**Your Formspree form IDs (already in the code):**

| Form | ID | Page |
|------|----|------|
| Kids Enrolment | `mvzwlgng` | `pages/enrol-kids.html` |
| Teens Enrolment | `mbdzwwvv` | `pages/enrol-teens.html` |
| Adults Enrolment | `xdawbbqo` | `pages/enrol-adults.html` |
| University Enrolment | `meernnyz` | `pages/enrol-university.html` |
| Career Switchers | `mpqybbvo` | `pages/enrol-career.html` |
| IT Services / Contact | `mwvryygz` | `pages/enrol-it-services.html` |
| Contact Page | `xpqybqqg` | `pages/contact.html` |

**Steps for each form:**
1. Go to https://formspree.io → log in
2. Open each form → **Settings → Email Notifications**
3. Set notification email to `codebridgeafrica@gmail.com`
4. Click **Verify** — check your Gmail and click the verification link
5. Repeat for all 6 forms

---

## ⬜ 2. GOOGLE FORMS — Fix submission settings (CRITICAL)

Data is going to email (Formspree) but not landing in Google Sheets. The cause is Google Form access settings blocking anonymous submissions from the website.

**Do this for ALL 6 Google Forms:**

1. Open the form in **edit mode**
2. Click the **Settings (gear) icon** at the top
3. Go to the **Responses** tab
4. Make these changes:
   - **Collect email addresses** → set to **"Do not collect"**
   - **Limit to 1 response** → turn **OFF**
   - **Restrict to [organisation]** → turn **OFF** (if visible)
   - **Accepting responses** → confirm it is **ON**
5. Save

**Why:** When "Collect email addresses" is on Verified mode, or the form is restricted to your organisation, Google silently rejects submissions that don't come with a Google login session — which a website form never has.

**Your 6 Google Forms:**

| Form | URL |
|------|-----|
| Kids | https://docs.google.com/forms/d/e/1FAIpQLSfIJY8U9wZDo4W1J_PBam5dmqFL_wtQljlvViNh-3zqhYGtmA/edit |
| Teens | https://docs.google.com/forms/d/e/1FAIpQLSe0g_jMlABIXKLTShF6y3O96SOsfvuNUFzOcst6jdhhTEj38A/edit |
| Adults | https://docs.google.com/forms/d/e/1FAIpQLSeeFNdYh4Z6XPz9wvprBg0GcZ1iOZQYTNk2BvCN1ETFQTaEbw/edit |
| University | https://docs.google.com/forms/d/e/1FAIpQLSfbDM9yJr_xoHEOmN2HTaXKc790XpU39kYBI2iv2kG-VNveDA/edit |
| Career | https://docs.google.com/forms/d/e/1FAIpQLSfN6afWeseD4jzPlIpaCOfZDIB38Kg_ynYdQw_nSk5dvr_3ew/edit |
| IT Services | https://docs.google.com/forms/d/e/1FAIpQLScVF_f5GXzREOIDB34tjB91q96xosRsilnwqKD5RcmwMlVxZQ/edit |

---

## ⬜ 3. GOOGLE FORMS — Make all fields Short Answer

To avoid value mismatches (website sends "MTN Mobile Money", Google Form expects "MTN MoMo" etc.), change every Multiple Choice / Dropdown question to **Short answer**.

**For each Google Form:**
1. Open in edit mode
2. Click every multiple choice or dropdown question
3. Change field type to **Short answer**
4. Do NOT change Date fields — keep those as Date type
5. Do NOT change Paragraph fields (Notes, Description) — keep as Paragraph

**Fields to convert in Kids form specifically:**
- Gender
- Device Available (Laptop) — currently Yes/No multiple choice
- Preferred Communication mode
- Preferred Payment Method
- Payment Plan
- How did you hear about us?

---

## ⬜ 4. GOOGLE MAPS — Add real embed to Contact page

**File:** `pages/contact.html` — find the "Our Location" section near the bottom.  
Currently shows a placeholder navy box with a link.

**Steps:**
1. Go to https://maps.google.com
2. Search: **Ashaley Botwe, Accra, Ghana**
3. Click **Share → Embed a map → Copy HTML**
4. In `pages/contact.html`, replace this entire block:
```html
<div style="width:100%;height:300px;background:var(--color-navy);...">
  ...
</div>
```
With your copied `<iframe>` code. Add `style="width:100%;height:300px;border:0;border-radius:16px"` to the iframe tag.

---

## ⬜ 5. YOUTUBE — Add channel URL

**File:** `js/components.js` — in the `CONFIG` object near the top of the file.  
Find:
```javascript
youtube: '#',   // ← add URL when ready
```
Replace `'#'` with your YouTube channel URL, e.g.:
```javascript
youtube: 'https://www.youtube.com/@codebridgeafrica',
```

---

## ⬜ 6. GITHUB — Add GitHub URL

**File:** `js/components.js` — in the `CONFIG` object near the top of the file.  
Find:
```javascript
github: '#',    // ← add URL when ready
```
Replace `'#'` with your GitHub URL, e.g.:
```javascript
github: 'https://github.com/codebridgeafrica',
```

---

## ⬜ 7. BLOG — Replace placeholder article links

The blog page currently uses real article titles but some links point to homepage domains (e.g. `https://techcabal.com` without a specific article path). When you have time, find the exact article URLs and update the `href` on each blog card.

**File:** `pages/blog.html` — find each `<a href="...">` on the blog cards and update to the real article URL.

---

## ⬜ 8. STUDENT PROJECTS — Replace placeholder links

All project cards currently link to `href="#"`. When students have real projects, update each button.

**File:** `pages/projects.html` — find every `href="#"` on project card buttons and replace with the real GitHub or live demo URL.

---

## ⬜ 9. STUDENT PORTAL — Remove coming-soon overlay when ready

When your student portal backend is built and live, remove the overlay.

**File:** `pages/portal.html`  
Delete the entire block:
```html
<!-- COMING SOON OVERLAY (remove this entire div once portal is live) -->
<div class="portal-overlay">
  ...
</div>
```

---

## ⬜ 10. CAREERS — Update job application email if needed

Apply buttons on the careers page currently send CVs to `codebridgeafrica@gmail.com`. If you want a different email for job applications, update it.

**File:** `pages/careers.html`  
Find all `mailto:codebridgeafrica@gmail.com?subject=Application` links and update the email address.

---

## ✅ ALREADY CONFIGURED — No action needed

These are done and working:

| Item | Value |
|------|-------|
| Phone | +233 245 676 676 |
| WhatsApp | +233 245 676 676 |
| Email | codebridgeafrica@gmail.com |
| Address | Ashaley Botwe, Accra, Ghana |
| Facebook | https://web.facebook.com/codebridgeafrica |
| Instagram | https://www.instagram.com/codebridgeafrica |
| TikTok | https://www.tiktok.com/@codebridgeafrica |
| Twitter/X | https://x.com/CodebridgeAfric |
| LinkedIn | https://www.linkedin.com/company/codebridge-africa/ |
| Formspree IDs | All 6 set (see Section 1 above) |
| Google Form URLs | All 6 set and mapped |
| Google Form entry IDs | All mapped in each enrol page script |
| Announcement bar | Logo, phone, WhatsApp, email, Enrol Now button |
| Navbar | Sticky, dropdowns, Student Portal button |
| Hero buttons | pointer-events fixed, links working |
| Office hours | Mon–Fri 8am–8pm · Sat–Sun 11am–8pm |
| Stats | 50+ students · 15+ courses · 100% · 2+ partners |
| All enrolment pages | 6 dedicated forms, each wired to correct Formspree + Google Form |
| Fonts | Montserrat (headings) + Open Sans (body) site-wide |
| Bootstrap CSS conflicts | Removed from all pages |
| Emojis | Replaced with Bootstrap Icons site-wide |

---

## HOW THE FORM SYSTEM WORKS

When someone submits any enrolment form, two things happen simultaneously:

```
User submits form
      │
      ├─► Formspree → sends full email to codebridgeafrica@gmail.com
      │
      └─► Google Form → silently posts mapped fields → lands in Google Sheet
```

**Formspree** = your email notification system (all fields, arrives instantly in codebridgeafrica@gmail.com)  
**Google Sheets** = your database (mapped fields only, for filtering and reporting)

The two submissions are independent — if one fails, the other still completes.

If Formspree works but Google Sheets is empty — see Section 2 above (access settings).

---

## FILE STRUCTURE

```
codebridge-africa/
├── index.html                    ← Homepage
├── 404.html                      ← Custom error page
├── README.md                     ← This file
├── .gitignore
│
├── css/
│   └── style.css                 ← All styles
│
├── js/
│   ├── components.js             ← Navbar + footer (shared, injected on every page)
│   │                               Also contains CONFIG object with all contact details
│   └── main.js                   ← Animations, scroll effects, contact form handler
│
├── images/
│   ├── logo.png
│   └── hero-illustration.png
│
├── pages/
│   │
│   ├── ENROLMENT FORMS (dedicated per category)
│   ├── enrol-kids.html           ← Kids enrolment (Formspree: mvzwlgng)
│   ├── enrol-teens.html          ← Teens enrolment (Formspree: mbdzwwvv)
│   ├── enrol-adults.html         ← Adults enrolment (Formspree: xdawbbqo)
│   ├── enrol-university.html     ← University enrolment (Formspree: meernnyz)
│   ├── enrol-career.html         ← Career switchers (Formspree: mpqybbvo)
│   ├── enrol-it-services.html    ← IT services enquiry (Formspree: mwvryygz)
│   │
│   ├── LEARNING PATHWAYS
│   ├── pathway-kids.html
│   ├── pathway-teens.html
│   ├── pathway-adults.html
│   ├── pathway-university.html
│   ├── pathway-career.html
│   │
│   ├── COMPANY PAGES
│   ├── about.html
│   ├── academy.html
│   ├── blog.html
│   ├── careers.html
│   ├── contact.html              ← Contact form (Formspree: xpqybqqg)
│   ├── courses.html
│   ├── faq.html
│   ├── portal.html               ← Student portal (coming soon overlay active)
│   ├── privacy.html
│   ├── projects.html             ← Student project showcase (placeholder links)
│   ├── roadmap.html
│   ├── services.html
│   ├── sitemap.html
│   ├── standards.html
│   └── terms.html
│
└── php/                          ← Optional PHP mailer (NOT used on GitHub Pages)
    ├── send_email.php            ← Only needed if moving to a PHP host later
    └── composer.json
```

---

## UPDATING CONTACT DETAILS IN THE FUTURE

All contact details are in **one place only** — the `CONFIG` object at the top of `js/components.js`. Change anything there and it updates across the entire site automatically.

```javascript
const CONFIG = {
  phone:     '+233 245 676 676',
  phoneTel:  'tel:+233245676676',
  whatsapp:  'https://wa.me/233245676676',
  email:     'codebridgeafrica@gmail.com',
  address:   'Ashaley Botwe, Accra, Ghana',
  social: {
    facebook:  'https://web.facebook.com/codebridgeafrica',
    instagram: 'https://www.instagram.com/codebridgeafrica',
    tiktok:    'https://www.tiktok.com/@codebridgeafrica',
    youtube:   '#',   // ← update when ready
    twitter:   'https://x.com/CodebridgeAfric',
    linkedin:  'https://www.linkedin.com/company/codebridge-africa/',
    github:    '#',   // ← update when ready
  },
  ...
};
```

---

## DEPLOYING TO GITHUB PAGES

1. Create a repository named exactly: `codebridgeafrica.github.io`
2. Upload all files preserving the folder structure
3. **Settings → Pages → Branch: main → Folder: / (root) → Save**
4. Site goes live at `https://codebridgeafrica.github.io` within 1–2 minutes

**Every time you make changes:** commit and push to the `main` branch. GitHub Pages rebuilds automatically within about 30 seconds.

---

## BRAND REFERENCE

| Colour | Hex | Used for |
|--------|-----|---------|
| Orange | `#E85D1A` | Primary buttons, highlights, kids pathway |
| Deep Navy | `#1A2B4A` | Navbar, headings, dark sections |
| Africa Green | `#2E7D32` | Adults pathway, success states |
| Code Yellow | `#F0B429` | Announcement bar, accents, university |
| Code Teal | `#00897B` | IT services, teens pathway, career switchers |

**Fonts:** Montserrat (headings, 600–800) · Open Sans (body, 400–600) · JetBrains Mono (code accents)

---

## SUPPORT

**Website developer:** pvayittah@gmail.com  
**Company email:** codebridgeafrica@gmail.com  
**WhatsApp:** +233 245 676 676
