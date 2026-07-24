// ===============================
// SBR Super-App
// auth.js
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Auth Module Loaded");

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("email")?.value;
            const password = document.getElementById("password")?.value;

            if (!email || !password) {
                alert("Please fill all fields.");
                return;
            }

            alert("Login Successful (Demo)");
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();

            alert("Registration Successful (Demo)");
        });
    }
});
