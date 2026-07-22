// ======================================
// SBR Global Super-App
// app.js
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("✅ SBR Global Super-App Loaded");

    // -------------------------
    // Explore Button
    // -------------------------
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

    // -------------------------
    // All Cards
    // -------------------------
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {

        // Hover Effect

        card.addEventListener("mouseenter", () => {
            card.style.transform = "scale(1.03)";
            card.style.transition = "0.3s";
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "scale(1)";
        });

        // Click Event

        card.addEventListener("click", () => {

            const title = card.querySelector("h2").innerText;

            console.log("Opening : " + title);

        });

    });

    // -------------------------
    // Navigation Active Effect
    // -------------------------

    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navLinks.forEach(item => item.classList.remove("active"));

            link.classList.add("active");

        });

    });

    // -------------------------
    // Scroll To Top Button
    // -------------------------

    const topButton = document.createElement("button");

    topButton.innerHTML = "⬆";

    topButton.id = "topButton";

    document.body.appendChild(topButton);

    topButton.style.position = "fixed";
    topButton.style.bottom = "20px";
    topButton.style.right = "20px";
    topButton.style.padding = "12px";
    topButton.style.display = "none";
    topButton.style.cursor = "pointer";
    topButton.style.borderRadius = "50%";

    window.addEventListener("scroll", () => {

        if (window.scrollY > 300) {

            topButton.style.display = "block";

        } else {

            topButton.style.display = "none";

        }

    });

    topButton.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

});
// -------------------------
// Live Search
// -------------------------

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("keyup", () => {

        const value = searchInput.value.toLowerCase();

        cards.forEach(card => {

            const text = card.innerText.toLowerCase();

            if (text.includes(value)) {

                card.style.display = "block";

            } else {

                card.style.display = "none";

            }

        });

    });

            }
