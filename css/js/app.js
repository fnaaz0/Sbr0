/* ===================================
   SBR GLOBAL MAIN APP
=================================== */

const SBRApp = {

    version: "1.0.0",

    name: "SBR Global",

    init() {

        console.log("SBR Global Started");

        this.loadTheme();

        this.loadUser();

        this.loadModules();

    },

    loadTheme() {

        const theme = localStorage.getItem("theme");

        if (theme) {

            document.body.setAttribute("data-theme", theme);

        }

    },

    loadUser() {

        const user = localStorage.getItem("user");

        if (user) {

            console.log("User Loaded");

        }

    },

    loadModules() {

        console.log("Modules Ready");

    }

};

document.addEventListener("DOMContentLoaded", () => {

    SBRApp.init();

});
