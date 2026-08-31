# Gemini OCR Node & React Application

This is a full-stack application for OCR (Optical Character Recognition) and product data extraction using the Google Gemini API. It consists of a Node.js/Express backend and a React (Vite) frontend.

## Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16 or higher recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js)
*   A Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/).

## Setup Instructions

This project has two parts: the backend server and the frontend client. You need to set up and run both.

### 1. Backend Setup

1.  Open your terminal and navigate to the root directory of this project (`gemini-ocr-node`).
2.  Install the backend dependencies:
    ```bash
    npm install
    ```
3.  Set up the environment variables:
    *   Rename the `.env.example` file in the root directory to `.env`.
    *   Open the `.env` file and replace `"YOUR_API_KEY_HERE"` with your actual Gemini API key.
4.  Start the backend server:
    ```bash
    node server.js
    ```
    The server should start running on `http://localhost:3001`.

### 2. Frontend (Client) Setup

1.  Open a **new** terminal window (leave the backend server running in the first one).
2.  Navigate to the `client` directory:
    ```bash
    cd client
    ```
3.  Install the frontend dependencies:
    ```bash
    npm install
    ```
4.  Start the frontend development server:
    ```bash
    npm run dev
    ```
5.  The terminal will display a local URL (usually `http://localhost:5173`). Open this URL in your web browser to use the application.

## Project Structure

*   `/`: Contains the Node.js backend server (`server.js`), package configurations, and uploaded/extracted files.
*   `/client`: Contains the React frontend application built with Vite and Tailwind CSS.
