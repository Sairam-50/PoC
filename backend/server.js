const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Dummy database of verified sites
const verifiedSites = {
    "localhost:5500": {
        company: "Trusted Bank Ltd.",
        issuedBy: "Company Security Authority",
        validUntil: "2026-12-31",
    },
};

// Card balance database (For demo)
const cardBalances = {
    "1234567890123456": 500,
    "9876543210987654": 1500
};

// Endpoint to check balance
app.get("/check_balance", (req, res) => {
    const card = req.query.card;
    if (cardBalances[card]) {
        res.json({ balance: cardBalances[card] });
    } else {
        res.json({ error: "Invalid card number" });
    }
});

// Trustmark verification endpoint
app.get("/verify_site", (req, res) => {
    const host = req.get("host"); // Get domain from request
    if (verifiedSites[host]) {
        res.json({ verified: true, details: verifiedSites[host] });
    } else {
        res.json({ verified: false, details: {} });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
