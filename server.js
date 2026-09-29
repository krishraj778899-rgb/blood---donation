const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// -------------------- Middleware --------------------
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve the frontend from the same Render service.
app.use(express.static(__dirname));

// -------------------- MongoDB model --------------------
const donorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    bloodGroup: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 1, max: 120 },
    gender: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    lastDonation: { type: String, default: "", trim: true }
  },
  { timestamps: true }
);

const Donor = mongoose.models.Donor || mongoose.model("Donor", donorSchema);

// -------------------- Health / home --------------------
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "LifeDrop backend is running",
    database: mongoose.connection.readyState === 1 ? "connected" : "not_connected"
  });
});

// -------------------- Donor API --------------------
app.post("/api/donors", async (req, res) => {
  try {
    const { name, email, phone, bloodGroup, age, gender, city, lastDonation } = req.body;

    if (!name || !email || !phone || !bloodGroup || !age || !gender || !city) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required donor fields."
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database is not connected. Check MONGO_URI in Render Environment Variables."
      });
    }

    const existing = await Donor.findOne({ email: String(email).trim().toLowerCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "A donor with this email is already registered."
      });
    }

    const donor = await Donor.create({
      name,
      email,
      phone,
      bloodGroup,
      age: Number(age),
      gender,
      city,
      lastDonation: lastDonation || ""
    });

    res.status(201).json({
      success: true,
      message: "Donor registration successful.",
      donor: {
        id: donor._id,
        name: donor.name,
        bloodGroup: donor.bloodGroup,
        city: donor.city
      }
    });
  } catch (error) {
    console.error("POST /api/donors error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to register donor."
    });
  }
});

app.get("/api/donors", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: "Database is not connected." });
    }

    const filter = {};
    if (req.query.bloodGroup) filter.bloodGroup = req.query.bloodGroup;
    if (req.query.city) filter.city = new RegExp(`^${String(req.query.city).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");

    const donors = await Donor.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: donors.length, donors });
  } catch (error) {
    console.error("GET /api/donors error:", error);
    res.status(500).json({ success: false, message: "Unable to fetch donors." });
  }
});

// -------------------- Frontend fallback --------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// -------------------- Database + server --------------------
async function startServer() {
  if (MONGO_URI) {
    try {
      await mongoose.connect(MONGO_URI);
      console.log("MongoDB connected successfully");
    } catch (error) {
      console.error("MongoDB connection error:", error.message);
      console.log("Server will stay online, but database APIs will return a database error.");
    }
  } else {
    console.warn("MONGO_URI is not set. Server will run without database access.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LifeDrop server running on port ${PORT}`);
  });
}

startServer();
