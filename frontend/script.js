// Function to check balance
function checkBalance() {
    const cardNumber = document.getElementById("cardNumber").value;
    fetch(`http://localhost:3000/check_balance?card=${cardNumber}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("balance").innerText = data.balance
                ? `Balance: $${data.balance}`
                : "Invalid card number";
        });
}

// Function to verify trustmark
function checkVerification() {
    fetch("http://localhost:3000/verify_site")
        .then(response => response.json())
        .then(data => {
            const status = document.getElementById("verification-status");
            if (data.verified) {
                status.innerHTML = `
                    ✅ This site is <span class='verified'>verified</span><br>
                    Company: ${data.details.company} <br>
                    Issued By: ${data.details.issuedBy} <br>
                    Valid Until: ${data.details.validUntil}
                `;
            } else {
                status.innerHTML = "❌ This site is <span class='unverified'>not verified</span>";
            }
        });
}

// Run verification check on trustmark page load
if (window.location.pathname.includes("verify.html")) {
    checkVerification();
}
