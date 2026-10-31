# ROOH | رُوح — Premium Beauty E-Commerce Platform
## Haute Parfumerie & Beauté — Complete Business Management Ecosystem

<div align="center">
  <img src="assets/images/logo.svg" alt="ROOH | رُوح" width="380">
  <p><strong>دار مستحضرات التجميل والعطور المصرية الفاخرة بمعايير عالمية</strong></p>
  <p><i>A Real, Fully Functional, Modern E-Commerce Platform with Luxury Visual Identity, Custom Logistics (ROOH Delivery), Egyptian Payment Gateways, Real Voice Messages, and Executive Admin Ecosystem.</i></p>
</div>

---

## 🌟 1. Brand Identity & Visual Design (الهوية البصرية الفاخرة)

ROOH (رُوح) is engineered with a distinctive, bespoke luxury identity designed to stand alongside elite international fragrance and skincare houses (such as Chanel, Dior, Creed, and Tom Ford):

- **Main Luxury Palette:**
  - **Deep Burgundy Red** (`#4A0E17` / `#2B070D` / `#1A0407`): Evoking royal prestige and timeless nobility.
  - **Luxury Crimson Red** (`#721C24` / `#8C1C28`): Highlighting interactive elements, alerts, and badges.
  - **Royal Gold Accents** (`#D4AF37` / `#F3E5AB` / `#AA771C`): Gold foil sheen on crests, buttons, and borders.
  - **Soft Ivory & Warm Cream** (`#FFFDF9` / `#FAF6F0` / `#F4ECE1`): Luxurious clean studio backgrounds.
  - **Obsidian Black** (`#120F10` / `#1E1A1B`): Deep contrast for luxury typography and footers.
- **Typography:**
  - Arabic: **Cairo**, **Amiri**, and **Tajawal** for calligraphy-level elegance.
  - English: **Cinzel**, **Playfair Display**, and **Montserrat** for haute perfumery aesthetics.
- **Visual Assets:**
  - High-resolution SVG illustrations for every cosmetic bottle, dropper, jar, flacon, and lipstick tube.
  - Smooth micro-interactions, responsive mobile/tablet layout, and glassmorphism.

---

## 🚀 2. Quick Start & How to Run (طريقة التشغيل الفوري)

The platform is designed to be **100% dependency-free and zero-setup**. It runs instantly offline or online on any modern browser.

### Option A: Via PowerShell Local Web Server (Recommended)
Open PowerShell in the project directory `c:\Users\Mohamed\Desktop\ROOH` and execute:
```powershell
.\server.ps1
```
*The server will automatically detect an available port (default `http://localhost:3000`), print the URLs, and launch your default web browser.*

### Option B: Direct File Execution
Double-click `index.html` or open it with your browser:
```powershell
start index.html
```

---

## 📁 3. System Architecture & Project Structure (هيكلية المشروع)

```
ROOH/
├── index.html                   # Luxury Storefront (Catalog, Cart Drawer, Product Modal, Checkout, Chat)
├── admin.html                   # Business Management Ecosystem (Dashboard, Orders, ROOH Delivery, Stock, Finance)
├── track.html                   # Dedicated ROOH Delivery Package Tracking Portal
├── server.ps1                   # Pure PowerShell HTTP Server (Zero npm/Node dependency needed)
├── README.md                    # Bilingual System Manual & Technical Reference
├── css/
│   ├── style.css                # Luxury Design System, Burgundy & Gold Theme, RTL/LTR Layout
│   ├── admin.css                # Executive Admin Dark/Burgundy UI, Tables, Status Badges, Charts
│   └── chat.css                 # Live Concierge Chat Widget, Voice Waveform Equalizer, Mic Recorder
├── js/
│   ├── state.js                 # Unified Reactive State Store, 24 Products, Orders, LocalStorage Sync
│   ├── app.js                   # Storefront Controller, Catalog Filters, Live Search, Bag Drawer, Modals
│   ├── admin.js                 # Admin Ecosystem Controller, RBAC Roles, Canvas Charts, Products CRUD
│   ├── delivery.js              # ROOH Delivery Engine, 27 Egyptian Governorates, Courier COD Custody
│   ├── payment.js               # Egyptian Payment Gateways (Fawry, InstaPay, Vodafone Cash, Cards)
│   └── chat.js                  # Concierge Live Chat & Real Voice Note Recording (Web Audio API)
└── assets/
    └── images/                  # High-Resolution SVGs (logo.svg, hero-bg.svg, product-1.svg to 24.svg)
```

---

## 🛍️ 4. Storefront & Product Catalog (المتجر والكتالوج)

The catalog covers all cosmetic and personal care categories with 24 realistic products:

1. **العناية بالبشرة (Skincare):**
   - سیروم رويال روز الهيالورونيك المركز (Royal Rose Hyaluronic Serum - 850 EGP)
   - غسول الذهب عيار 24 النقي (24K Gold Cleanser - 680 EGP)
   - كريم لوميير لتفتيح محيط العين بالريتينول (Lumière Retinol Eye Cream - 920 EGP)
   - تونر الورد الجوري والنياسيناميد (Damask Rose Balancing Toner - 520 EGP)
   - مرطب الحرير الملكي المخملي (Velvet Silk Peptide Moisturizer - 790 EGP)
   - واقي الشمس الشفاف بريق اللؤلؤ SPF 50+ (Pearl Glow Sunscreen - 640 EGP)
2. **العناية بالشعر (Haircare):**
   - زيت الأرجان المغربي المعصور على البارد (Moroccan Argan Miracle Oil - 720 EGP)
   - قناع الكافيار لإصلاح الشعر التالف (Imperial Caviar Repair Mask - 980 EGP)
   - سيروم الكيراتين المقوي ضد الحرارة (Keratin Anti-Breakage Serum - 580 EGP)
   - شامبو الباباسو وزبدة المانجو خالي سلفات (Babassu Clarifying Shampoo - 490 EGP)
3. **العناية بالجسم (Body Care):**
   - جل استحمام العود الملكي والعنبر (Royal Oud Bath Gel - 480 EGP)
   - زبدة الجسم بالشيا والباتشولي (Raw Shea Body Butter - 540 EGP)
   - مقشر القهوة وأملاح البحر الميت (Dead Sea Coffee Scrub - 510 EGP)
   - كريم اليدين الفاخر بزهر البرتقال (Neroli Blossom Hand Cream - 360 EGP)
4. **المكياج الفاخر (Makeup):**
   - أحمر شفاه رُوح المخملي مات — رويال بورغندي (ROOH Velvet Matte Lipstick - 620 EGP)
   - كريم أساس الحرير السائل (Luminous Silk Liquid Foundation - 950 EGP)
   - ماسكارا الكثافة الدرامية بألياف الحرير (Dramatic Silk Mascara - 490 EGP)
   - باليت ظلال العيون كليوباترا 12 لوناً (Cleopatra Luxury Palette - 1,150 EGP)
5. **العطور الفاخرة (Fragrances):**
   - عطر «رُوح الشرق» — صندل وعنبر أسود (Rooh Al Sharq Eau de Parfum - 2,450 EGP)
   - عطر «أميرة الزهور» — ورد الطائف وياسمين (Amirat Al Zohoor - 2,100 EGP)
   - عطر «مسك الليل» للجنسين — مسك أبيض وفانيليا (Misk Al Layl Unisex - 1,850 EGP)
   - ميست معطر للجسم برايد فيلفيت (Pride Velvet Shimmer Mist - 680 EGP)
6. **العناية بالرجل (Men's Grooming):**
   - زيت اللحية الفاخر بخشب الأرز (Imperial Cedarwood Beard Oil - 590 EGP)
   - عطر «الفارس» الرجالي الفاخر — توباكو وجلود (Al Faris Eau de Parfum - 2,200 EGP)

---

## 🚚 5. Custom Independent Shipping System: ROOH Delivery (شحن رُوح)

ROOH Delivery is a fully self-contained logistics management module operated directly by the brand:

- **Egyptian Governorates Matrix:** Covers all 27 governorates categorized by logistics zone (Greater Cairo, Alexandria & North Coast, Nile Delta, Canal Cities, Upper Egypt, Red Sea & Sinai) with tailored delivery fees and transit times.
- **Courier Fleet Management:** Dedicated courier profiles with vehicle type (climate-controlled vans for perfume/skincare stability), assigned zones, and live dispatch tracking.
- **COD Cash Collection & Custody Ledger:** Automatic tracking of cash collected at customer doorsteps with one-click reconciliation and treasury settlement.
- **Visual Tracking Life Cycle:**
  1. `pending` (تم استلام الطلب)
  2. `processing` (قيد التجهيز والتغليف الملكي)
  3. `dispatched` (خرجت من مستودع رُوح الرئيسي)
  4. `out_for_delivery` (مع مندوب شحن رُوح وفي طريقها للتسليم)
  5. `delivered` (تم التوصيل واستلام التوقيع / تحصيل النقدية)

---

## 💳 6. Egyptian Payment Gateways Suite (طرق الدفع المصرية)

1. **Cash on Delivery (COD - الدفع عند الاستلام):** With 20 EGP handling fee, automatic courier collection receipt.
2. **Fawry (فوري):** Automatic generation of a 10-digit payment reference code, 48-hour expiration timer, and kiosk payment instructions.
3. **Electronic Wallets (فودافون كاش، أورنج كاش، اتصالات، وي):** Official merchant wallet number `010 2849 5931`, copy shortcut, and sender wallet number confirmation.
4. **InstaPay (إنستاباي):** Instant payment address `rooh@instapay`, zero fees, and real-time reference tracking.
5. **Credit & Debit Cards (فيزا، ماستركارد، كارت ميزة الوطني):** 16-digit card validation using the Luhn algorithm, CVV, expiry check, and 3D Secure simulation.

---

## 🎙️ 7. Live Concierge Chat & Real Voice Messages (المحادثة الصوتية المباشرة)

- **Voice Message Recording:** Uses the browser `MediaRecorder` API to record voice notes directly from the microphone.
- **Equalizer & Waveforms:** Renders interactive waveform playback controls with animated sound bars.
- **Web Audio API Fallback:** Generates synthetic audio notes so audio playback always functions reliably.
- **Smart Beauty Advisor "سارة - خبيرة العناية برُوح":** Provides conversational answers regarding skincare routines, perfume longevity, ROOH Delivery tracking, and payment verification.

---

## ⚙️ 8. Executive Admin Business Management Ecosystem (`admin.html`)

Access the management suite via `admin.html` or the "لوحة الإدارة والتحكم" button in the top bar:

- **Multi-Role RBAC (Role-Based Access Control):**
  - **Super Admin (المدير العام):** Unrestricted access to all tools, finance, staff, and products.
  - **Operations Manager (مدير العمليات):** Orders, logistics dispatch, inventory, and reports.
  - **Inventory Supervisor (مسؤول المستودع):** Stock levels, reorders, batch logs, and raw suppliers.
  - **Customer Concierge (خدمة العملاء):** Live chat, customer accounts, and order lookup.
  - **ROOH Delivery Courier (مندوب شحن رُوح):** Delivery dispatch view and COD collection settlement.
- **Interactive Financial Reports:** Real-time HTML5 Canvas charts, Gross Profit vs COGS analytics, 14% Egyptian VAT calculation, and CSV export.
- **Product & Category CRUD:** Add new luxury cosmetic items with custom ingredients, prices in EGP, and stock levels.
- **Printable Invoices:** Generate official branded ROOH invoices and shipping slips in Arabic with one click.

---

<div align="center">
  <p><strong>دار رُوح لمستحضرات التجميل والعطور الفاخرة • القاهرة، جمهورية مصر العربية</strong></p>
  <p><i>Crafted with perfection — Luxury international standards with authentic Egyptian heritage.</i></p>
</div>

