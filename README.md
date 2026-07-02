# Horizon Institute of Education — Static Website
## Phase 1 Delivery | Plain HTML/CSS/JS | Contact form via EmailJS

---

## 📁 File Structure

```
site/
├── index.html          ← Home page
├── about.html          ← About Us page
├── courses.html        ← All Courses (filterable)
├── contact.html        ← Contact & Enquiry form (main working page)
├── css/
│   └── style.css       ← Full design system (all styles)
├── js/
│   └── script.js       ← Nav, form logic, counters, filter tabs
└── README.md           ← This file
```

---

## ⚙️ Connect EmailJS (5-minute setup — do this first)

Without this, the form UI works but enquiries won't be delivered anywhere.

### Step 1 — Create an EmailJS account
Go to https://www.emailjs.com and sign up (free, 200 emails/month).

### Step 2 — Add an Email Service
- Dashboard → Email Services → Add New Service
- Choose Gmail or Outlook and connect your client's account
- Copy the **Service ID** (looks like `service_xxxxxxx`)

### Step 3 — Create an Email Template
- Dashboard → Email Templates → Create New Template
- Suggested subject: `New Enquiry from Website — {{course}}`
- Suggested body:
  ```
  Name: {{name}}
  Mobile: {{phone}}
  Email: {{email}}
  Course: {{course}}
  State: {{state}}
  Qualification: {{qualification}}
  Message: {{message}}
  Page: {{page}}
  ```
- Copy the **Template ID** (looks like `template_xxxxxxx`)

### Step 4 — Get your Public Key
- Dashboard → Account → General → Public Key
- Copy the **Public Key** (looks like `xxxxxxxxxxxxxxxx`)

### Step 5 — Paste into script.js
Open `js/script.js` and replace lines 10–12:

```js
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";   // ← paste here
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";   // ← paste here
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";  // ← paste here
```

Save the file. Test the form. Enquiries will now land in the client's inbox.

---

## 🔧 Content Placeholders to Replace

Search for the items below across all HTML files and replace them:

| Placeholder | Replace with |
|---|---|
| `Horizon Institute` | Actual institute name |
| `of Education, Delhi` | Actual subtitle / tagline |
| `+91 11 0000 0000` | Real phone number 1 |
| `+91 99999 99999` | Real phone number 2 |
| `info@horizoninstitute.edu.in` | Real email |
| `admissions@horizoninstitute.edu.in` | Real admissions email |
| `[Institute Address]` | Full address |
| `Delhi — 110001` | Real pincode |
| `[Landmark / Metro Station]` | Nearest landmark |
| `[Metro Station Name]` | Nearest metro |
| `[Metro Line Colour/Name]` | Metro line |
| `Since 2014` | Actual founding year |
| Google Maps `iframe src` | Real embed URL from maps.google.com |
| WhatsApp number in `wa.me/` links | Real WhatsApp number |
| Social media `href="#"` links | Real social profile URLs |
| Testimonial names & quotes | Real student reviews |
| Course list | Add / remove courses to match client's actual offerings |
| Stats (4500+, 200+, 40+, 10+) | Real numbers from client |

---

## 🌐 Deploying the Site

The site uses relative paths only — no build step needed. Deploy by simply uploading the folder to:

**Option A — Netlify (fastest, free)**
1. Go to netlify.com → Log in → "Add new site" → "Deploy manually"
2. Drag and drop the entire `site/` folder
3. Done — live in 30 seconds

**Option B — Vercel**
1. Push to a GitHub repo
2. Import the repo on vercel.com
3. Framework: Other (static). Root: `site/`. Deploy.

**Option C — cPanel / any web host**
1. Open File Manager or use FTP
2. Upload all files inside `site/` to `public_html/`
3. Done

---

## 📌 Phase 2 Notes (for .NET + Angular migration)

When you rebuild this in .NET + Angular:
- Each HTML page maps to an Angular route/component
- The `css/style.css` design tokens (CSS variables) can be ported directly to `styles.scss`
- The EmailJS form can be replaced by an Angular `HttpClient` call to a .NET Web API `/api/enquiries` endpoint
- Course data can move to a JSON file or SQL table and be served via API
- The `data-count` counter animation logic can become an Angular directive
- All content/copy/courses stay the same — only the rendering layer changes

---

## 🎨 Design System Quick Reference

| Token | Value |
|---|---|
| `--navy` | `#16233E` (primary brand) |
| `--gold` | `#C9A227` (accent) |
| `--teal` | `#2F6F62` (success/check) |
| `--maroon` | `#8C2F39` (CTA/ribbon) |
| Font — Display | Fraunces (Google Fonts) |
| Font — Body | Plus Jakarta Sans |
| Font — Labels | JetBrains Mono |

---

Built by Claude (Anthropic) for Phase 1 static delivery.
