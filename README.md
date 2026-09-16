# Visa Status Checker - London MCS

> Free online tool to check visa application status and generate qualified leads

## ✨ Features

✅ **Visa Status Checker** - Users check their application status
✅ **Lead Capture** - Collect email, phone, name, visa type, country
✅ **Email Notifications** - Instant alerts for new leads
✅ **Sample Database** - Pre-loaded test data for MVP
✅ **Mobile Responsive** - Works on all devices
✅ **Professional Branding** - London MCS colors (Navy & Gold)

## 🚀 Quick Start

### Option 1: Frontend Only (No Backend)

Simply open `index.html` in your browser. Leads stored locally.

**Test Reference Numbers:**
```
LM-2024-12345 → Approved ✓
LM-2024-12346 → Pending ⏳
LM-2024-12347 → Denied ✗
```

### Option 2: Full Backend with Email

1. **Install**
```bash
git clone https://github.com/neednowlk/visa-checker-tool.git
cd visa-checker-tool
npm install
```

2. **Setup .env**
```bash
cp .env.example .env
# Edit .env with your Gmail credentials
```

3. **Start Server**
```bash
npm start
# Visit http://localhost:5000
```

## 📧 Email Setup

1. Enable Gmail 2FA
2. Generate App Password
3. Use in `.env` file

## 🎯 How It Works

1. User enters visa reference number
2. Status displayed (Approved/Pending/Denied)
3. Lead captured with contact info
4. Email sent to your team
5. Sales follow-up within 24h

## 📊 Supported Visa Types

- Student Visa
- Tourist Visa
- Business & Investor Visa
- Entertainment Visa

## 🌍 Supported Countries

**Common:** UK, USA, Australia, New Zealand, Canada

**Schengen:** Italy, France, Germany, Switzerland, Norway, and more

## 🔗 API Endpoints

```
POST /api/check-visa - Check visa status
POST /api/leads - Capture lead
GET /api/leads - View all leads
GET /api/health - Health check
```

---

**Built with ❤️ for London MCS Consultants**