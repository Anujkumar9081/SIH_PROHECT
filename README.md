# AI-Powered Product Inspection & Data Extraction System

## Smart India Hackathon (SIH)

An AI-powered product inspection and data extraction platform designed to assist inspectors in collecting, structuring, and reviewing information available on product packaging.

The system allows an inspector to upload one or more images of a product or its packaging. The uploaded images are processed using AI to identify and extract relevant product information and convert it into a structured JSON format.

The extracted information can then be used as the foundation for inspection, validation, compliance checking, reporting, and historical record management.

---

## 📌 Problem Statement

Product inspection often requires an inspector to manually examine product packaging and identify important information such as:

- Product name
- Brand
- Variant
- Product category
- Net quantity
- MRP
- Batch number
- Manufacturing date
- Expiry date
- Best-before information
- Barcode
- Country of origin
- Manufacturer information
- Customer-care information
- Ingredients
- Product claims
- Regulatory information
- Other information printed on the package

When this information is available across multiple sides of a package, manually reading and entering it can be time-consuming and error-prone.

The proposed system aims to reduce this manual effort by using AI to convert product images into structured, machine-readable information.

---

## 🎯 Objective

The primary objective of the project is to create an AI-assisted product inspection platform where:

```text
Product Images
      ↓
AI Vision Analysis
      ↓
Product Information Extraction
      ↓
Structured JSON
      ↓
Inspection / Validation
      ↓
Database / Reports
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, Zustand |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **AI / OCR** | Google Gemini API (Vision) |
| **Auth** | JWT (JSON Web Tokens), bcrypt |
| **PDF Reports** | jsPDF, html2canvas |
| **Charts** | Recharts |

---

## 📦 Prerequisites

Before running this project, make sure you have the following installed on your system:

1. **Node.js** (v16 or higher) — [Download here](https://nodejs.org/)
2. **MongoDB** — Either install [MongoDB Community Edition](https://www.mongodb.com/try/download/community) locally, or create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
3. **Gemini API Key** — Get your free API key from [Google AI Studio](https://aistudio.google.com/)

---

## 🚀 How to Run Locally

### Step 1: Clone the repository

```bash
git clone https://github.com/Anujkumar9081/SIH_PROHECT.git
cd SIH_PROHECT
```

### Step 2: Setup environment variables

```bash
cp .env.example .env
```

Now open the `.env` file and fill in your values:

```env
GEMINI_API_KEY="paste_your_gemini_api_key_here"
MONGODB_URI="mongodb://127.0.0.1:27017/legal_metrology_db"
JWT_SECRET="any_random_secret_string"
```

> **Note:** If you are using MongoDB Atlas instead of local MongoDB, replace the `MONGODB_URI` with your Atlas connection string.

### Step 3: Install backend dependencies & start server

```bash
npm install
node server.js
```

The backend server will start at `http://localhost:3001`

### Step 4: Install frontend dependencies & start client

Open a **new terminal window** and run:

```bash
cd client
npm install
npm run dev
```

The frontend will start at `http://localhost:5173` — open this URL in your browser.

---

## 📁 Project Structure

```
gemini-ocr-node/
├── server.js                  # Main backend server (Express + Gemini API)
├── package.json               # Backend dependencies
├── .env.example               # Environment variable template
├── .env                       # Your local environment variables (not committed)
├── server/
│   ├── config/
│   │   └── database.js        # MongoDB connection setup
│   ├── models/
│   │   └── User.js            # User schema (Mongoose)
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── routes/
│   │   └── auth.js            # Login & Signup API routes
│   └── services/              # Business logic services
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── pages/             # Dashboard, Login, Scan, Result, etc.
│   │   ├── components/        # Reusable UI components
│   │   ├── store/             # Zustand state management
│   │   ├── services/          # API service layer
│   │   ├── types/             # TypeScript type definitions
│   │   └── utils/             # Utility functions (PDF, sample data)
│   ├── package.json           # Frontend dependencies
│   └── vite.config.ts         # Vite configuration
├── uploads/                   # Temporary image uploads (auto-cleaned)
└── output/                    # Extracted JSON output files
```

---

## 👥 Team

Smart India Hackathon (SIH) Project
