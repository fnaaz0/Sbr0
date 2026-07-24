/*
=========================================
SBR Global Super-App
profile.js
=========================================
*/

const Profile = {

    user: null,

    init() {

        this.loadUser();
        this.bindEvents();
        this.render();

    },

    loadUser() {

        const session = localStorage.getItem("sbr_session");

        if (!session) return;

        this.user = JSON.parse(session);

    },

    bindEvents() {

        const form = document.getElementById("profileForm");

        if (form) {

            form.addEventListener("submit", (e) => {

                e.preventDefault();

                this.save();

            });

        }

    },

    render() {

        if (!this.user) return;

        const name = document.getElementById("profileName");
        const email = document.getElementById("profileEmail");
        const phone = document.getElementById("profilePhone");
        const bio = document.getElementById("profileBio");

        if (name) name.value = this.user.name || "";
        if (email) email.value = this.user.email || "";
        if (phone) phone.value = this.user.phone || "";
        if (bio) bio.value = this.user.bio || "";

    },
        save() {

        if (!this.user) return;

        this.user.name =
            document.getElementById("profileName")?.value || "";

        this.user.email =
            document.getElementById("profileEmail")?.value || "";

        this.user.phone =
            document.getElementById("profilePhone")?.value || "";

        this.user.bio =
            document.getElementById("profileBio")?.value || "";

        localStorage.setItem(
            "sbr_session",
            JSON.stringify(this.user)
        );

        let users = JSON.parse(
            localStorage.getItem("sbr_users") || "[]"
        );

        users = users.map(user => {

            if (user.id === this.user.id) {

                return this.user;

            }

            return user;

        });

        localStorage.setItem(
            "sbr_users",
            JSON.stringify(users)
        );

        alert("Profile Updated Successfully");

    },

    logout() {

        localStorage.removeItem("sbr_session");

        window.location.href = "login.html";

    },

    deleteAccount() {

        if (!confirm("Delete your account permanently?")) {

            return;

        }

        let users = JSON.parse(
            localStorage.getItem("sbr_users") || "[]"
        );

        users = users.filter(
            user => user.id !== this.user.id
        );

        localStorage.setItem(
            "sbr_users",
            JSON.stringify(users)
        );

        localStorage.removeItem("sbr_session");

        window.location.href = "register.html";

    },
        isLoggedIn() {

        return this.user !== null;

    },

    getUser() {

        return this.user;

    },

    updateAvatar(image) {

        if (!this.user) return;

        this.user.avatar = image;

        localStorage.setItem(
            "sbr_session",
            JSON.stringify(this.user)
        );

    },

    changePassword(password) {

        if (!this.user) return false;

        this.user.password = password;

        localStorage.setItem(
            "sbr_session",
            JSON.stringify(this.user)
        );

        return true;

    }

};

document.addEventListener("DOMContentLoaded", () => {

    Profile.init();

});
