// // Function to check balance
// function checkBalance() {
//     const cardNumber = document.getElementById("cardNumber").value.trim();
//     if (!cardNumber) {
//         document.getElementById("balance").innerText = "Please enter a card number.";
//         return;
//     }

//     fetch("http://localhost:3000/check_balance", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ card: cardNumber })
//     })
//     .then(response => response.json())
//     .then(data => {
//         document.getElementById("balance").innerText = data.balance
//             ? `Balance: $${data.balance}`
//             : "Invalid card number";
//     })
//     .catch(error => {
//         console.error("Error:", error);
//         document.getElementById("balance").innerText = "Error fetching balance.";
//     });
// }

// // Function to verify trustmark
// function checkVerification() {
//     fetch("http://localhost:3000/verify_site", {
//         method: "GET",
//         headers: { "Origin": window.location.origin }  // Explicitly send Origin
//     })
//     .then(response => response.json())
//     .then(data => {
//         const status = document.getElementById("verification-status");
//         if (data.verified) {
//             status.innerHTML = `
//                 ✅ This site is <span class='verified'>verified</span><br>
//                 Company: ${data.details.company} <br>
//                 Issued By: ${data.details.issuedBy} <br>
//                 Valid Until: ${data.details.validUntil}
//             `;
//         } else {
//             status.innerHTML = "❌ This site is <span class='unverified'>not verified</span>";
//         }
//     })
//     .catch(error => console.error("Error verifying site:", error));
// }


// // Run verification check on trustmark page load
// if (window.location.pathname.endsWith("verify.html")) {
//     checkVerification();
// }


document.addEventListener("DOMContentLoaded", async () => {
    const statusText = document.getElementById("verification-status");
    const detailsDiv = document.getElementById("details");
    const companyName = document.getElementById("company-name");
    const issuer = document.getElementById("issuer");
    const validity = document.getElementById("validity");
    const card = document.getElementById("verification-card");

    statusText.classList.add("loading");

    try {
        const response = await fetch("http://localhost:3000/verify_site");
        const data = await response.json();

        statusText.classList.remove("loading");

        if (data.verified) {
            statusText.textContent = "✅ Site Verified";
            card.classList.add("verified");
            detailsDiv.classList.remove("hidden");

            companyName.textContent = data.details.company;
            issuer.textContent = data.details.issuedBy;
            validity.textContent = data.details.validUntil;
        } else {
            statusText.textContent = "❌ Not Verified";
            card.classList.add("not-verified");
        }
    } catch (error) {
        console.error("Error verifying site:", error);
        statusText.textContent = "⚠️ Error: Could not verify";
        card.classList.add("not-verified");
    }
});
