// ===============================
// SBR Super-App
// profile.js
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    console.log("✅ Profile Module Loaded");

    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");

    if (profileName) {
        profileName.textContent =
            localStorage.getItem("username") || "Guest User";
    }

    if (profileEmail) {
        profileEmail.textContent =
            localStorage.getItem("email") || "Not Logged In";
    }

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {

            localStorage.clear();

            alert("Logged Out Successfully");

            window.location.href = "login.html";

        });
    }

});

