# Gemini OCR Node & React Application

This is a full-stack application for OCR (Optical Character Recognition) and product data extraction using the Google Gemini API. It consists of a Node.js/Express backend, a React (Vite) frontend, and MongoDB for storing application data.

## Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16 or higher recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js)
*   **MongoDB**: You must have a MongoDB database running (either [installed locally](https://www.mongodb.com/try/download/community) or a cloud cluster via [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).
*   **Gemini API Key**: You can get one for free from [Google AI Studio](https://aistudio.google.com/).

## Setup Instructions

This project has three main parts:

1. Backend — Node.js/Express
2. Frontend — React/Vite
3. Database — MongoDB

### 1. Backend Setup

1. Open your terminal and navigate to the root directory of this project (`gemini-ocr-node`).

2. Install the backend dependencies:

   ```bash
   npm install