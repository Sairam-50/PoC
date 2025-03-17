// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const rateLimit = require("express-rate-limit");

// const app = express();
// const PORT = process.env.PORT || 3000;

// // ✅ Allowed Origins (from .env or default)
// const allowedOrigins = process.env.ALLOWED_ORIGINS
//     ? process.env.ALLOWED_ORIGINS.split(",")
//     : ["http://localhost:5500", "http://127.0.0.1:5500"];

// console.log("✅ Allowed Origins:", allowedOrigins);

// // ✅ CORS Middleware (Fix for different origins)
// app.use(cors({
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error("CORS not allowed"));
//         }
//     }
// }));
// app.use(express.json());

// // ✅ Dummy database of verified sites
// const verifiedSites = {
//     "localhost": { company: "Trusted Bank Ltd.", issuedBy: "Company Security Authority", validUntil: "2026-12-31" },
//     "localhost:5000": { company: "Trusted Bank Ltd.", issuedBy: "Company Security Authority", validUntil: "2026-12-31" },
//     "127.0.0.1": { company: "Trusted Bank Ltd.", issuedBy: "Company Security Authority", validUntil: "2026-12-31" },
//     "127.0.0.1:5000": { company: "Trusted Bank Ltd.", issuedBy: "Company Security Authority", validUntil: "2026-12-31" }
// };

// // ✅ Dummy database of card balances
// const cardBalances = {
//     "1234567890123456": 500,
//     "9876543210987654": 1500
// };

// // ✅ Rate limiter for balance checks
// const balanceLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 10, // Limit each IP to 10 balance checks per window
//     message: "Too many requests. Try again later.",
// });

// // ✅ Balance Check API
// app.post("/check_balance", balanceLimiter, (req, res) => {
//     const { card } = req.body;
//     if (cardBalances[card]) {
//         res.json({ balance: cardBalances[card] });
//     } else {
//         res.json({ error: "Invalid card number" });
//     }
// });

// // ✅ Trustmark Verification API
// app.get("/verify_site", (req, res) => {
//     const origin = req.headers.origin || "http://localhost:5500"; // Default fallback
//     console.log("Request received from:", origin);

//     try {
//         const hostname = new URL(origin).hostname; // Extract domain
//         console.log("Extracted hostname:", hostname);

//         if (verifiedSites[hostname]) {
//             res.json({ verified: true, details: verifiedSites[hostname] });
//         } else {
//             res.json({ verified: false, details: {} });
//         }
//     } catch (error) {
//         console.error("Error parsing origin:", error);
//         res.json({ verified: false, error: "Invalid request origin" });
//     }
// });

// // ✅ Start Server
// app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
// });



// //PERFORMING SSL CHECKS

// const whois = require("whois");
// const sslChecker = require("ssl-checker");

// async function getDomainAge(domain) {
//     return new Promise((resolve, reject) => {
//         whois.lookup(domain, (err, data) => {
//             if (err) return reject(err);
//             const match = data.match(/Creation Date:\s*(\d{4}-\d{2}-\d{2})/);
//             resolve(match ? match[1] : "Unknown");
//         });
//     });
// }

// async function checkSSL(domain) {
//     try {
//         const sslData = await sslChecker(domain);
//         return sslData.valid ? sslData.validTo : "No SSL Found";
//     } catch (error) {
//         return "SSL Error";
//     }
// }

// app.get("/verify_site", async (req, res) => {
//     const origin = req.headers.origin || "http://localhost:5500";
//     const hostname = new URL(origin).hostname;

//     if (verifiedSites[hostname]) {
//         const domainAge = await getDomainAge(hostname);
//         const sslExpiry = await checkSSL(hostname);

//         res.json({
//             verified: true,
//             details: {
//                 ...verifiedSites[hostname],
//                 domainAge,
//                 sslExpiry
//             }
//         });
//     } else {
//         res.json({ verified: false });
//     }
// });




require("dotenv").config();
const express = require("express");
const cors = require("cors");
const whois = require("whois");
const sslChecker = require("ssl-checker");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Allowed Origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:5500", "http://127.0.0.1:5500"];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// ✅ Verified Sites Database
const verifiedSites = {
    "localhost": { company: "Trusted Bank Ltd.", issuedBy: "Company Security Authority", validUntil: "2026-12-31" },
    "127.0.0.1": { company: "Trusted Bank Ltd.", issuedBy: "Company Security Authority", validUntil: "2026-12-31" }
};

// ✅ Function to get domain age
async function getDomainAge(domain) {
    return new Promise((resolve, reject) => {
        whois.lookup(domain, (err, data) => {
            if (err) return reject(err);
            const match = data.match(/Creation Date:\s*(\d{4}-\d{2}-\d{2})/);
            resolve(match ? match[1] : "Unknown");
        });
    });
}

// ✅ Function to check SSL validity
async function checkSSL(domain) {
    try {
        const sslData = await sslChecker(domain);
        return sslData.valid ? sslData.validTo : "No SSL Found";
    } catch (error) {
        return "SSL Error";
    }
}

// ✅ Combined `/verify_site` Route
app.get("/verify_site", async (req, res) => {
    try {
        const origin = req.headers.origin || "http://localhost:5500";
        const hostname = new URL(origin).hostname;

        if (verifiedSites[hostname]) {
            const domainAge = await getDomainAge(hostname);
            const sslExpiry = await checkSSL(hostname);

            res.json({
                verified: true,
                details: {
                    ...verifiedSites[hostname],
                    domainAge,
                    sslExpiry
                }
            });
        } else {
            res.json({ verified: false });
        }
    } catch (error) {
        console.error("Error in verify_site:", error);
        res.status(500).json({ verified: false, error: "Internal Server Error" });
    }
});

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
