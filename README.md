# ♻️ EcoClean: Smart Waste Management & Recycling Dashboard

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Hugging Face](https://img.shields.io/badge/Hugging%20Face-FFD21E?style=for-the-badge&logo=huggingface&logoColor=000)](https://huggingface.co/)
[![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white)](https://leafletjs.com/)

> A comprehensive, modern web dashboard built to revolutionize personal waste management, incentivize recycling through gamification, and streamline community cleanup efforts. Built for the **Smart Waste Management & Recycling Guide** hackathon challenge.

---

## 📖 Table of Contents
- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Application Flow & Logic](#-application-flow--logic)
- [License](#-license)

---

## 🚀 About the Project

EcoClean bridges the gap between complex recycling guidelines and everyday user behavior. By combining state-of-the-art Computer Vision for automated waste classification with a gamified tracking system, the platform makes sustainable living intuitive and rewarding. 

The dashboard utilizes a vibrant, energetic color palette (Greens, Yellows, Blues, and Reds) and distinct modern typography to provide a highly engaging, enterprise-ready user experience.

---

## ✨ Key Features

### 🧠 AI Waste Classifier (Computer Vision)
- **Smart Upload Workflow:** Users select an image, preview it in high-resolution, and manually trigger the analysis to prevent accidental API calls.
- **YOLOv Integration:** Seamlessly embeds a Hugging Face Space ML model via an optimized iframe architecture to detect and classify waste in real-time.

### 📅 Unified Eco-Calendar (State-Synced)
A central hub for all waste-related activities. Events are strictly color-coded for instant visual recognition:
- 🟦 **Blue:** General Waste
- 🟨 **Yellow:** Recyclable
- 🟩 **Green:** Organic/Green Waste
- 🟪 **Purple:** Scheduled Bulky Pickup
- *Note: Both Bulky Pickups and Illegal Dump Reports automatically sync to this calendar upon submission.*

### 🗺️ Live Facility Locator & Routing
- **Interactive Map:** Powered by Leaflet.js and the Nominatim API.
- **Real-Time Routing:** Currently featuring demo facilities in Pune (e.g., Kothrud, Viman Nagar, Hinjewadi, Shivajinagar). Clicking a facility calculates estimated travel time from the user's current HTML5 Geolocation.

### 🚛 Bulky Item Pickup Scheduler
- Multi-step booking form for large disposals categorized by material: *Glass, Plastic, Electronics, Wood, Fabrics, and Other*. 
- Features a smart date-picker that blocks past dates.

### 🚨 GPS-Enabled Dump Reporter
- Allows users to report illegal dumping with photographic evidence.
- Automatically extracts precise Latitude/Longitude coordinates via the browser's Geolocation API. Tracks resolution status in a live dashboard.

### 🏆 Gamified Personal Tracker & Leagues
- **Live Analytics:** Dynamic `Recharts` comparing Weekly Generated vs. Recycled waste.
- **League Promotion System:** Users earn "Eco-Points" for tracking waste, allowing them to rank up through tiers (Bronze ➔ Silver ➔ Gold ➔ Platinum ➔ Diamond Eco-Warrior) with visual progress bars.

### 📚 Centralized Knowledge Base
- A dedicated, full-screen PDF viewer component housing comprehensive disposal instructions and a 200+ item illustrated bin guide.

---

## 💻 Tech Stack

**Frontend Architecture:**
- **Framework:** React.js / Next.js
- **Styling:** Tailwind CSS + shadcn/ui
- **Typography:** Display fonts for headers, Sans-serif for data/body.
- **Data Visualization:** Recharts
- **Maps:** Leaflet.js + OpenStreetMap API

**Backend & Machine Learning:**
- **Machine Learning Model:** YOLOv Object Detection
- **ML Deployment:** Hugging Face Spaces (via Gradio/Streamlit bridge)
- **Target Database/Auth:** Supabase (PostgreSQL)

---

## 🤝 Connect with the Team

We’d love to connect! Feel free to reach out to any of us on LinkedIn:

- 👤 **Rohit Biradar**  
  🔗 https://www.linkedin.com/in/your-profile

- 👤 **Varad Patil**  
  🔗 https://www.linkedin.com/in/varad-patil-1442a0329

- 👤 **Teammate Name**  
  🔗 https://www.linkedin.com/in/teammate-profile

- 👤 **Sarthak Tilekar**
  🔗 https://www.linkedin.com/in/sarthak-tilekar-8766a4334
---

## 🛠️ Getting Started

### Prerequisites
Make sure you have Node.js and npm installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/ecoclean-dashboard.git](https://github.com/your-username/ecoclean-dashboard.git)
