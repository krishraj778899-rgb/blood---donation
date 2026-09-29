const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const donorRoutes = require("./routes/donorRoutes");
app.use("/api/requests", requestRoutes);

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;


/* ================= MIDDLEWARE ================= */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* ================= HOME ROUTE ================= */

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "LifeDrop Backend is running successfully ❤️"
    });

});


/* ================= DONOR ROUTES ================= */

app.use("/api/donors", donorRoutes);


/* ================= DATABASE ================= */

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {

        console.log("MongoDB connected successfully");

    })
    .catch((error) => {

        console.log(
            "MongoDB connection error:",
            error.message
        );

    });


/* ================= SERVER ================= */

app.listen(PORT, () => {

    console.log(
        `LifeDrop server running on http://localhost:${PORT}`
    );

});