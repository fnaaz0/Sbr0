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
