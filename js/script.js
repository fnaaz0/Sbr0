document.addEventListener("DOMContentLoaded", () => {
    console.log("SBR Super-App Loaded");

    const exploreBtn = document.getElementById("exploreBtn");

    if (exploreBtn) {
        exploreBtn.addEventListener("click", () => {
            alert("Welcome to SBR Super-App 🤲");
        });
    }
});
