// fetch("/verify_site")
//     .then(response => response.json())
//     .then(data => {
//         console.log("API Response:", data); // Debugging step

//         const widget = document.getElementById("trustmark-widget");

//         if (!widget) {
//             console.error("Trustmark widget not found.");
//             return;
//         }

//         widget.innerHTML = `
//             <div class="tooltip">
//                 <p id="trustmark-status">Verifying...</p>
//                 <p><strong>Company:</strong> <span id="trustmark-company">Loading...</span></p>
//                 <p><strong>Valid Until:</strong> <span id="trustmark-validity">Loading...</span></p>
//                 <p><strong>Domain Age:</strong> <span id="trustmark-domain">Loading...</span></p>
//                 <p><strong>SSL Expiry:</strong> <span id="trustmark-ssl">Loading...</span></p>
//             </div>
//         `;

//         if (!data || !data.details) {
//             document.getElementById("trustmark-status").textContent = "❌ Verification Failed";
//             console.error("Invalid API Response:", data);
//             return;
//         }

//         // Update the UI with the actual values
//         document.getElementById("trustmark-status").textContent = data.verified ? "✅ Verified" : "❌ Not Verified";
//         document.getElementById("trustmark-company").textContent = data.details.company || "N/A";
//         document.getElementById("trustmark-validity").textContent = data.details.validUntil || "N/A";
//         document.getElementById("trustmark-domain").textContent = data.details.domainAge || "N/A";
//         document.getElementById("trustmark-ssl").textContent = data.details.sslExpiry || "N/A";

//         // Adjust widget appearance based on verification status
//         widget.style.background = data.verified ? "#2ecc71" : "#e74c3c";
//         widget.style.color = "#fff";
//         widget.style.padding = "10px";
//         widget.style.borderRadius = "5px";
//         widget.style.position = "fixed";
//         widget.style.bottom = "10px";
//         widget.style.right = "10px";
//         widget.style.zIndex = "1000";
//     })
//     .catch(error => {
//         console.error("Error verifying trustmark:", error);
//     });



fetch("/verify_site")
    .then(response => response.json())
    .then(data => {
        const widget = document.getElementById("trustmark-widget");

        widget.innerHTML = `
            <img src="trustmark.png" alt="Trustmark">
            <div class="tooltip">
                <p id="trustmark-status">${data.verified ? "✅ Verified" : "❌ Not Verified"}</p>
                <p><strong>Company:</strong> ${data.details.company || "N/A"}</p>
                <p><strong>Valid Until:</strong> ${data.details.validUntil || "N/A"}</p>
                <p><strong>Domain Age:</strong> ${data.details.domainAge || "Unknown"}</p>
                <p><strong>SSL Expiry:</strong> ${data.details.sslExpiry || "Unknown"}</p>
            </div>
        `;

        widget.style.background = data.verified ? "#2ecc71" : "#e74c3c";
    })
    .catch(error => console.error("Error verifying trustmark:", error));
