// ===============================
// SBR Super-App
// search.js
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Search Module Loaded");

    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.addEventListener("keyup", () => {

            const value = searchInput.value.toLowerCase();

            document.querySelectorAll(".card").forEach(card => {

                const text = card.innerText.toLowerCase();

                if (text.includes(value)) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }

            });

        });
    }

});
