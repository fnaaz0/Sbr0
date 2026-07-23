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
/* ===================================
   SBR GLOBAL SEARCH ENGINE
=================================== */

class SBRSearch {

    constructor() {
        this.items = [];
    }

    add(title, category, url) {

        this.items.push({
            title,
            category,
            url
        });

    }

    find(keyword) {

        keyword = keyword.toLowerCase();

        return this.items.filter(item =>
            item.title.toLowerCase().includes(keyword) ||
            item.category.toLowerCase().includes(keyword)
        );

    }

}

const SearchEngine = new SBRSearch();
/* Default Pages */

SearchEngine.add("Hadith", "Islam", "pages/hadith.html");
SearchEngine.add("Quran", "Islam", "pages/aql.html");
SearchEngine.add("Calligraphy", "Islam", "pages/calligraphy.html");
SearchEngine.add("Souq", "Marketplace", "pages/souq.html");
SearchEngine.add("Safar", "Travel", "pages/safar.html");
SearchEngine.add("Profile", "User", "pages/profile.html");
