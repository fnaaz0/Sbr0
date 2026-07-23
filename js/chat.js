/* =====================================
   SBR GLOBAL CHAT SYSTEM
===================================== */

class SBRChat {

    constructor() {

        this.messages = [];

    }

    send(sender, receiver, message) {

        const chat = {

            id: Date.now(),

            sender,

            receiver,

            message,

            time: new Date().toLocaleString(),

            status: "sent"

        };

        this.messages.push(chat);

        localStorage.setItem(
            "sbr_chat",
            JSON.stringify(this.messages)
        );

        console.log("Message Sent", chat);

        return chat;

    }

    load() {

        const data = localStorage.getItem("sbr_chat");

        if (data) {

            this.messages = JSON.parse(data);

        }

        return this.messages;

    }

    clear() {

        this.messages = [];

        localStorage.removeItem("sbr_chat");

    }

}

const ChatSystem = new SBRChat();

ChatSystem.load();
/* =====================================
   DEFAULT CHAT
===================================== */

console.log("SBR Chat Ready");
