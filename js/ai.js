/* =====================================
   SBR GLOBAL AI CORE
===================================== */

class SBRAI {

    constructor() {

        this.name = "SBR AI";

        this.version = "1.0.0";

        this.status = "Ready";

    }

    start() {

        console.log("SBR AI Started");

    }

    greet(user = "Guest") {

        return `Assalamu Alaikum ${user} 🤲`;

    }

    ask(question) {

        console.log("Question :", question);

        return {

            success: true,

            answer: "Searching best solution..."

        };

    }

}

const AI = new SBRAI();

AI.start();
/* =====================================
   SBR AI MEMORY
===================================== */

AI.memory = [];

AI.saveMemory = function(question, answer) {

    this.memory.push({

        question,

        answer,

        time: new Date().toLocaleString()

    });

    localStorage.setItem(

        "sbr_ai_memory",

        JSON.stringify(this.memory)

    );

};

AI.loadMemory = function() {

    const data = localStorage.getItem("sbr_ai_memory");

    if (data) {

        this.memory = JSON.parse(data);

    }

};

AI.clearMemory = function() {

    this.memory = [];

    localStorage.removeItem("sbr_ai_memory");

};

AI.loadMemory();

console.log("SBR AI Memory Ready");
/* =====================================
   SBR AI SEARCH
===================================== */

AI.search = function(keyword) {

    keyword = keyword.toLowerCase();

    const database = [

        "Islam",

        "Quran",

        "Hadith",

        "Healthcare",

        "Marketplace",

        "Profile",

        "Settings",

        "Chat",

        "Video",

        "Canva"

    ];

    return database.filter(item =>

        item.toLowerCase().includes(keyword)

    );

};

console.log("SBR AI Search Ready");
/* =====================================
   SBR AI VOICE
===================================== */

AI.speak = function(text) {

    if ("speechSynthesis" in window) {

        const voice = new SpeechSynthesisUtterance(text);

        voice.lang = "en-US";

        voice.rate = 1;

        speechSynthesis.speak(voice);

    } else {

        console.log("Voice not supported");

    }

};

AI.stopVoice = function() {

    speechSynthesis.cancel();

};

console.log("SBR AI Voice Ready");
/* =====================================
   SBR AI STATUS
===================================== */

AI.statusInfo = function() {

    return {

        name: this.name,

        version: this.version,

        status: this.status,

        memory: this.memory.length

    };

};

console.log(

AI.statusInfo()

);

console.log("SBR AI Status Ready");
/* =====================================
   SBR AI PROFILE HELPER
===================================== */

AI.profile = {

    name: "Guest",

    language: "English",

    mode: "Normal"

};

AI.setProfile = function(name, language) {

    this.profile.name = name;

    this.profile.language = language;

    localStorage.setItem(

        "sbr_ai_profile",

        JSON.stringify(this.profile)

    );

};

AI.getProfile = function() {

    const data = localStorage.getItem("sbr_ai_profile");

    if (data) {

        this.profile = JSON.parse(data);

    }

    return this.profile;

};

console.log("SBR AI Profile Ready");

/* =====================================
   SBR AI HELP
===================================== */

AI.help = function() {

    return [

        "Healthcare",

        "Marketplace",

        "Islamic",

        "Chat",

        "Profile",

        "Settings",

        "Search"

    ];

};

console.log("SBR AI Help Ready");
