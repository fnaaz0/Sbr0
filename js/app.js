// ==============================
// SBR Super App
// app.js
// ==============================

document.addEventListener("DOMContentLoaded", () => {

    console.log("✅ SBR Super App Started");

    const exploreBtn = document.getElementById("exploreBtn");

    if (exploreBtn) {
        exploreBtn.addEventListener("click", () => {
            const modules = document.querySelector(".modules");

            if (modules) {
                modules.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    }

    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
        card.addEventListener("click", () => {

            const title = card.querySelector("h2").innerText;

            alert("Opening " + title + " (Coming Soon)");

        });
    });

});
