/* ======================================
   SBR GLOBAL - Notification System
====================================== */

const SBRNotification = {

    show(title, message, type = "info") {

        const old = document.getElementById("sbr-notification");
        if (old) old.remove();

        const box = document.createElement("div");
        box.id = "sbr-notification";

        box.innerHTML = `
            <strong>${title}</strong><br>
            <span>${message}</span>
        `;

        box.style.position = "fixed";
        box.style.top = "20px";
        box.style.right = "20px";
        box.style.zIndex = "99999";
        box.style.padding = "15px 20px";
        box.style.borderRadius = "12px";
        box.style.color = "#fff";
        box.style.fontSize = "15px";
        box.style.boxShadow = "0 10px 25px rgba(0,0,0,.4)";
        box.style.transition = ".4s";

        switch(type){

            case "success":
                box.style.background="#28a745";
                break;

            case "error":
                box.style.background="#dc3545";
                break;

            case "warning":
                box.style.background="#ffc107";
                box.style.color="#000";
                break;

            default:
                box.style.background="#0d6efd";
        }

        document.body.appendChild(box);

        setTimeout(()=>{
            box.style.opacity="0";
            setTimeout(()=>{
                box.remove();
            },400);
        },4000);

    }

};

/* Demo */

document.addEventListener("DOMContentLoaded",()=>{

    SBRNotification.show(
        "Assalamu Alaikum 🌸",
        "Welcome to SBR Global Super App",
        "success"
    );

});
