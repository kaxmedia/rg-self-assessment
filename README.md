# RG Self Assessment – WordPress Plugin

A step-by-step **Responsible Gambling Self-Assessment** tool built as a WordPress plugin.  
Designed for clarity, accessibility, and a modern **BonusFinder-style UI**.

This plugin helps users reflect on their gambling habits through a short, guided questionnaire with a progress indicator and clear results.

---

## ✨ Features

- 🧭 Step-by-step questionnaire
- 📊 Progress bar with completion percentage
- 🎨 Modern, clean UI inspired by BonusFinder
- ♿ Accessible focus states and interactions
- 📱 Fully responsive (desktop & mobile)
- 🔒 No data storage – answers are **not saved or transmitted**
- 🧩 Easy integration via shortcode

---

## 📦 Installation

### Option 1 – Upload ZIP (recommended)

1. Download `rg-self-assessment.zip`
2. In WordPress Admin go to:  
   **Plugins → Add New → Upload Plugin**
3. Upload the ZIP file and click **Activate**

---

### Option 2 – Manual installation

1. Copy the `rg-self-assessment` folder into:
wp-content/plugins/

2. Go to **WordPress Admin → Plugins**
3. Activate **RG Self Assessment**

---

## ▶️ Usage

1. Create a new **Page** in WordPress
2. Add the shortcode:
[rg_self_assessment]

3. Publish the page
4. Open the page – the assessment will load automatically

---

## 🧠 What this tool is (and is not)

✔️ **Is**
- A self-reflection and awareness tool
- A quick screening experience
- Private and anonymous

❌ **Is NOT**
- A clinical diagnosis
- A data-collecting form
- A replacement for professional support

---

## 🛠 Technical Overview

**Plugin structure:**

rg-self-assessment/
├── assets/
│ ├── rgsa.css # Styling (BonusFinder-inspired)
│ └── rgsa.js # Step logic & progress handling
├── includes/
│ ├── class-rgsa-plugin.php
│ ├── class-rgsa-renderer.php
│ └── class-rgsa-scorer.php
└── rg-self-assessment.php


- PHP handles rendering and scoring logic
- JavaScript controls step navigation and UI state
- CSS is fully scoped to avoid theme conflicts

---

## 🎨 Styling & Theming

- Styles are **self-contained**
- Does not rely on the active WordPress theme
- Easily adjustable via `assets/rgsa.css`
- Designed to visually match modern content sites (e.g. BonusFinder)

---

## 🔐 Privacy & Compliance

- No cookies
- No tracking
- No database writes
- No external API calls

All logic runs client-side.

---

## 🚀 Roadmap (optional)

- Results summary export
- Configurable question sets
- Multi-language support
- Admin configuration panel
- Analytics hooks (opt-in)

---

## 👤 Author

Built as part of an **AI Day demo project**.

---

## 📄 License

MIT – free to use, modify, and extend.
