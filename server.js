require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const connectDB = require("./server/config/database");

// Connect to database
connectDB();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Routes
app.use('/api', require('./server/routes/auth'));
// Configure multer for file uploads
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Init Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType,
    },
  };
}

// API endpoint for OCR extraction
app.post("/api/extract", upload.array("images", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded." });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `You are an expert OCR and product data extraction engine.
You are provided with multiple images that may contain ONE or MORE distinct products.

Task:
1. Analyze ALL provided images simultaneously.
2. Automatically detect how many DISTINCT products are shown across all images. Images of the same product (e.g., front, back, nutritional info, barcode side) should be merged into a single product object.
3. Cross-reference, merge, and reconcile the information for EACH product into its own JSON object.
4. Fill all standard compliance and product fields accurately. Use null for fields not found.
5. ALWAYS return a JSON array, even if there is only one product.

CRITICAL: Return a JSON ARRAY of product objects. Each product gets its own object in the array.

Expected JSON Structure (array of products):
[
  {
    "product_name": "Complete product title/name",
    "brand_name": "Brand name",
    "variant": "Variant / flavor / scent if applicable",
    "product_category": "Category of the product",
    "net_quantity": "Net weight or volume",
    "mrp": "Maximum Retail Price with currency",
    "batch_number": "Batch / Lot number",
    "manufacturing_date": "MFD / Date of manufacture",
    "expiry_date": "Expiry date or null",
    "best_before": "Best before statement / duration",
    "country_of_origin": "Country where made/produced",
    "barcode": "Barcode number (EAN/UPC digits)",
    "key_claims_and_features": ["List of claims, benefits"],
    "dosage_or_directions_for_use": "Usage instructions",
    "ingredients_list": ["List of ingredients if present"],
    "nutritional_facts": {},
    "manufacturer": {
      "name": "Company name",
      "address": "Full corporate address",
      "manufacturing_units": [
        { "code": "Unit code", "name": "Factory name", "address": "Factory address" }
      ]
    },
    "customer_care": {
      "phone": "Toll free / contact number",
      "email": "Customer support email",
      "website": "Website URL"
    },
    "regulatory_and_certifications": {
      "fssai_license_number": "FSSAI number if present",
      "legal_registrations": "Registration numbers",
      "packaging_thickness": "Packaging micron info"
    },
    "other_extracted_data": {}
  }
]`;

    const imageParts = req.files.map((file) =>
      fileToGenerativePart(file.path, file.mimetype)
    );

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    let text = response.text();

    if (text.startsWith("```json")) {
      text = text.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    } else if (text.startsWith("```")) {
      text = text.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }

    const parsedData = JSON.parse(text);
    const products = Array.isArray(parsedData) ? parsedData : [parsedData];

    // Save output
    const outputDir = path.join(__dirname, "output");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    fs.writeFileSync(
      path.join(outputDir, `extract_${Date.now()}.json`),
      JSON.stringify(products, null, 2),
      "utf8"
    );

    // Cleanup uploads
    req.files.forEach((f) => fs.unlinkSync(f.path));

    res.json(products);
  } catch (error) {
    console.error("Extraction error:", error.message);
    if (req.files) req.files.forEach((f) => { try { fs.unlinkSync(f.path); } catch (e) { } });
    res.status(500).json({ error: "Failed to extract data. " + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running at http://localhost:${PORT}`);
});
