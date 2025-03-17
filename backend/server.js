require("dotenv").config();
console.log("✅ Allowed Origins from .env:", process.env.ALLOWED_ORIGINS); // Debug log

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:5500"];

console.log("✅ Parsed Allowed Origins:", allowedOrigins); // Debug log

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Dummy database of verified sites
const verifiedSites = {
    "localhost:3000": { 
        company: "Trusted Bank Ltd.",
        issuedBy: "Company Security Authority",
        validUntil: "2026-12-31",
    },
    "127.0.0.1:5500": {  
        company: "Trusted Bank Ltd.",
        issuedBy: "Company Security Authority",
        validUntil: "2026-12-31",
    }
};

// Card balance database (For demo)
const cardBalances = {
    "1234567890123456": 500,
    "9876543210987654": 1500
};

// Rate limiter for balance checks
const balanceLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 balance checks per window
    message: "Too many requests. Try again later.",
});

app.post("/check_balance", balanceLimiter, (req, res) => {
    const { card } = req.body;
    if (cardBalances[card]) {
        res.json({ balance: cardBalances[card] });
    } else {
        res.json({ error: "Invalid card number" });
    }
});

// Trustmark verification endpoint
app.get("/verify_site", (req, res) => {
    const origin = req.headers.origin || "http://localhost:5500"; // Default to localhost
    console.log("Request received from:", origin);  

    try {
        const hostname = new URL(origin).hostname;
        console.log("Extracted hostname:", hostname);  

        if (verifiedSites[hostname]) {
            res.json({ verified: true, details: verifiedSites[hostname] });
        } else {
            res.json({ verified: false, details: {} });
        }
    } catch (error) {
        console.error("Error parsing origin:", error);
        res.json({ verified: false, error: "Invalid request origin" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
