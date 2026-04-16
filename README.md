# PrithviAds — Smart Coupon Platform

A complete digital marketing coupon platform for **Travel, Education, E-commerce, and Automobile** verticals. Built with **Next.js 14** and **MongoDB**.

---

## 🗂️ Project Structure

```
prithviads/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/login/        ← Login API
│   │   │   ├── auth/register/     ← Register API
│   │   │   ├── auth/me/           ← Current user API
│   │   │   ├── deals/             ← Deals CRUD
│   │   │   ├── deals/[id]/        ← Single deal operations
│   │   │   ├── extension/         ← Public API for Chrome extension
│   │   │   ├── analytics/         ← Analytics data
│   │   │   └── clients/           ← Client management (admin)
│   │   ├── admin/                 ← Admin dashboard pages
│   │   ├── client/                ← Client portal pages
│   │   └── login/                 ← Login/Register page
│   ├── components/
│   │   ├── ui/                    ← Shared UI components
│   │   └── layout/                ← Sidebar, AuthGuard
│   ├── lib/
│   │   ├── mongodb.js             ← DB connection
│   │   ├── auth.js                ← JWT + bcrypt utilities
│   │   └── api.js                 ← Frontend API client
│   └── models/
│       ├── User.js                ← User schema
│       ├── Deal.js                ← Deal schema
│       └── Redemption.js          ← Redemption tracking
├── scripts/
│   └── seed.js                    ← Seed database with demo data
└── chrome-extension/              ← Browser extension files
    ├── manifest.json
    ├── content.js                 ← Auto-apply logic
    ├── popup.html                 ← Extension popup UI
    ├── popup.js                   ← Popup logic
    └── background.js              ← Service worker
```

---

## ⚡ Quick Setup (Local)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Edit `.env.local`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/prithviads
NEXTAUTH_SECRET=any-long-random-string-here
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Get MongoDB URI free:** Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas) → Create free cluster → Connect → Copy URI

### 3. Seed the Database

```bash
node scripts/seed.js
```

This creates:
- 1 Admin account
- 5 Client accounts
- 7 sample deals (approved, pending, rejected)

### 4. Run Development Server

```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## 🔐 Login Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@prithviads.com | admin123 |
| Client (Travel) | client@makemytrip.com | client123 |
| Client (Education) | client@unacademy.com | client123 |
| Client (E-commerce) | client@myntra.com | client123 |
| Client (Automobile) | client@cars24.com | client123 |

---

## 🌐 Platform Pages

| URL | Who | What |
|-----|-----|------|
| `/login` | Everyone | Login / Register |
| `/admin` | Admin | Dashboard overview |
| `/admin/deals` | Admin | Approve / Reject deals |
| `/admin/clients` | Admin | Manage clients |
| `/admin/analytics` | Admin | Full analytics |
| `/admin/extension` | Admin | Preview extension UI |
| `/client` | Clients | Client dashboard |
| `/client/deals` | Clients | View own deals |
| `/client/deals/new` | Clients | Submit new deal |
| `/client/analytics` | Clients | Campaign analytics |

---

## 🔌 Public API (for Chrome Extension)

### Get deals for a URL
```
GET /api/extension?url=myntra.com
```
Response:
```json
{
  "deals": [
    {
      "_id": "...",
      "brand": "Myntra",
      "couponCode": "STYLE30",
      "discountType": "percent",
      "discountValue": 30,
      "description": "30% off on ethnic wear",
      "applyOn": "checkout",
      "isAutoApply": true,
      "validTo": "2025-12-31"
    }
  ]
}
```

### Track coupon event
```
POST /api/extension
Body: { "dealId": "...", "type": "click|apply|redemption", "url": "myntra.com" }
```

---

## 🚀 Deployment (Vercel + MongoDB Atlas)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial PrithviAds commit"
git remote add origin https://github.com/yourusername/prithviads.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Add Environment Variables:
   - `MONGODB_URI` → Your Atlas connection string
   - `NEXTAUTH_SECRET` → Any 32+ character random string
   - `NEXTAUTH_URL` → `https://your-app.vercel.app`
4. Click Deploy ✅

### Step 3: Seed Production Database
```bash
MONGODB_URI=<your-atlas-uri> node scripts/seed.js
```

### Step 4: Install Chrome Extension
1. Open Chrome → `chrome://extensions`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the `chrome-extension/` folder
5. Extension appears in toolbar 🎉

### Step 5: Update Extension API URL
In `chrome-extension/content.js` and `chrome-extension/popup.js`, replace:
```js
const API_BASE = 'https://your-prithviads-domain.com'
```
with your actual Vercel URL, e.g.:
```js
const API_BASE = 'https://prithviads.vercel.app'
```

---

## 📦 Chrome Web Store Submission

1. Create Google Developer account ($5 one-time fee)
2. Zip the `chrome-extension/` folder
3. Upload to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
4. Fill in: name, description, screenshots, privacy policy
5. Submit for review (1–7 days)

---

## 🔄 How the Full Flow Works

```
Client registers → Submits deal (with coupon code + KPIs)
     ↓
Admin reviews on /admin/deals → Approves deal
     ↓
Deal goes live in database (status: approved)
     ↓
User visits e.g. myntra.com with extension installed
     ↓
Extension calls GET /api/extension?url=myntra.com
     ↓
Extension shows popup: "STYLE30 — Save 30%!"
     ↓
On checkout page → Auto-fills coupon input → Clicks Apply
     ↓
POST /api/extension tracks redemption event
     ↓
Admin & Client both see updated clicks + redemption counts
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Styling | CSS Variables + Global CSS |
| Extension | Chrome MV3 (Manifest Version 3) |
| Deployment | Vercel (frontend) + MongoDB Atlas (DB) |

---

## 📞 Support

Built by PrithviAds Engineering Team.
For issues, contact: admin@prithviads.com
