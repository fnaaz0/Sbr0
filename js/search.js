/*
=========================================
SBR Global Super-App
search.js
=========================================
*/

const SearchManager = {

    modules: [],
    filteredModules: [],
    recentSearches: [],
    maxRecent: 10,

    init() {

        this.loadModules();
        this.loadRecentSearches();
        this.bindEvents();

    },

    loadModules() {

        this.modules = [

            {
                id: "aql",
                name: "Aql",
                page: "aql.html",
                keywords: [
                    "aql",
                    "knowledge",
                    "wisdom",
                    "mind"
                ]
            },

            {
                id: "hadith",
                name: "Hadith",
                page: "hadith.html",
                keywords: [
                    "hadith",
                    "sunnah",
                    "islam"
                ]
            },

            {
                id: "qalam",
                name: "Qalam",
                page: "qalam.html",
                keywords: [
                    "qalam",
                    "writing",
                    "notes"
                ]
            },

            {
                id: "rabt",
                name: "Rabt",
                page: "rabt.html",
                keywords: [
                    "rabt",
                    "connect",
                    "social"
                ]
            },

            {
                id: "safar",
                name: "Safar",
                page: "safar.html",
                keywords: [
                    "travel",
                    "safar",
                    "location"
                ]
            },

            {
                id: "souq",
                name: "Souq",
                page: "souq.html",
                keywords: [
                    "market",
                    "shop",
                    "souq"
                ]
            },

            {
                id: "tabeer",
                name: "Tabeer",
                page: "tabeer.html",
                keywords: [
                    "dream",
                    "tabeer"
                ]
            },

            {
                id: "calligraphy",
                name: "Calligraphy",
                page: "calligraphy.html",
                keywords: [
                    "art",
                    "arabic",
                    "calligraphy"
                ]
            }

        ];

        this.filteredModules = [...this.modules];

    },
    
    loadRecentSearches() {

        const data = localStorage.getItem("sbr_recent_searches");

        if (data) {

            this.recentSearches = JSON.parse(data);

        }

    },

    saveRecentSearches() {

        localStorage.setItem(

            "sbr_recent_searches",

            JSON.stringify(this.recentSearches)

        );

    },

    bindEvents() {

        const input = document.getElementById("searchInput");

        if (!input) return;

        input.addEventListener("keyup", (e) => {

            this.search(e.target.value);

        });

    },

    search(query) {

        query = query.trim().toLowerCase();

        if (query === "") {

            this.filteredModules = [...this.modules];

            this.render();

            return;

        }

        this.filteredModules = this.modules.filter(module => {

            return (

                module.name.toLowerCase().includes(query) ||

                module.keywords.some(keyword =>

                    keyword.toLowerCase().includes(query)

                )

            );

        });

        this.addRecent(query);

        this.render();

    },

    addRecent(query) {

        this.recentSearches = this.recentSearches.filter(

            item => item !== query

        );

        this.recentSearches.unshift(query);

        if (this.recentSearches.length > this.maxRecent) {

            this.recentSearches.pop();

        }

        this.saveRecentSearches();

    },
        render() {

        const container = document.getElementById("searchResults");

        if (!container) return;

        container.innerHTML = "";

        if (this.filteredModules.length === 0) {

            container.innerHTML = `
                <div class="no-results">
                    No modules found.
                </div>
            `;

            return;

        }

        this.filteredModules.forEach(module => {

            const card = document.createElement("div");

            card.className = "search-card";

            card.innerHTML = `
                <h3>${module.name}</h3>
                <p>${module.keywords.join(", ")}</p>
            `;

            card.addEventListener("click", () => {

                window.location.href = module.page;

            });

            container.appendChild(card);

        });

    },

    clearRecent() {

        this.recentSearches = [];

        this.saveRecentSearches();

    },

    getRecentSearches() {

        return this.recentSearches;

    }

};

document.addEventListener("DOMContentLoaded", () => {

    SearchManager.init();

});
