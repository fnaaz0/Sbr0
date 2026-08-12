// SBR Super-App Unified AI Engine (Chrome Direct Integration)

document.addEventListener("DOMContentLoaded", () => {
    console.log("SBR Super-App Loaded");

    // 1. पुराना Explore बटन जो आपने पहले बनाया था
    const exploreBtn = document.getElementById("explore-btn");
    if (exploreBtn) {
        exploreBtn.addEventListener("click", () => {
            alert("Welcome to SBR Super-App");
        });
    }

    // 2. नया मास्टर एआई इंजन (Execute AI Engine) का लॉजिक
    const executeBtn = document.getElementById("execute-btn");
    const aiModuleSelect = document.getElementById("ai-module-select") || document.querySelector("select");
    const promptInput = document.getElementById("ai-prompt") || document.querySelector("textarea");
    const resultDisplay = document.getElementById("ai-result-box") || document.querySelector(".success");

    if (executeBtn) {
        executeBtn.addEventListener("click", async () => {
            const selectedModule = aiModuleSelect.value;
            const promptText = promptInput.value;

            if (!promptText) {
                return alert("कृपया पहले अपना सवाल या डिज़ाइन प्रॉम्ट यहाँ लिखें!");
            }

            executeBtn.disabled = true;
            resultDisplay.innerText = "✨ SBR एआई इंजन चालू है... कृपया थोड़ा इंतजार करें...";

            try {
                // अगर यूजर ने NVIDIA Flux.1-Dev (Calligraphy) चुना है
                if (selectedModule.includes("Calligraphy") || selectedModule.includes("Hunar")) {
                    const response = await fetch("https://nvidia.com", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
                            "Accept": "application/json",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            prompt: `Beautiful premium Islamic art, ${promptText}, 8k resolution, highly detailed`,
                            height: 1024, width: 1024, steps: 25, response_format: "b64_json"
                        })
                    });
                    const data = await response.json();
                    resultDisplay.innerHTML = `<img src="data:image/jpeg;base64,${data.data.b64_json}" style="width:100%; max-width:500px; border-radius:10px; border:2px solid #d4af37; margin-top:15px;"/>`;
                }

                // अगर यूजर ने OpenAI GPT-4o (SBR AQL) चुना है
                else if (selectedModule.includes("Aql") || selectedModule.includes("GPT-4o")) {
                    const response = await fetch("https://openai.com", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            model: "gpt-4o",
                            messages: [
                                { role: "system", content: "तुम SBR सुपर-ऐप के एक जिम्मेदार और प्रामाणिक इस्लामिक एआई असिस्टेंट हो।" },
                                { role: "user", content: promptText }
                            ]
                        })
                    });
                    const data = await response.json();
                    const aiTextResponse = data.choices[0].message.content;
                    resultDisplay.innerText = aiTextResponse;

                    // ElevenLabs से इस जवाब को आवाज में पढ़वाना
                    await playVoiceResponse(aiTextResponse);
                }

            } catch (error) {
                console.error("AI Engine Error:", error);
                resultDisplay.innerText = "❌ माफ़ कीजिएगा, एआई इंजन से कनेक्ट करने में समस्या आई।";
            } finally {
                executeBtn.disabled = false;
            }
        });
    }
});

// ElevenLabs वॉइस को चलाने का फंक्शन
async function playVoiceResponse(text) {
    try {
        const response = await fetch(`https://elevenlabs.io`, {
            method: "POST",
            headers: {
                "xi-api-key": process.env.ELEVENLABS_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text.substring(0, 200),
                model_id: "eleven_monolingual_v1"
            })
        });
        const arrayBuffer = await response.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: 'audio/mp3' });
        const audio = new Audio(URL.createObjectURL(blob));
        audio.play();
    } catch (vError) {
        console.error("Voice failed:", vError);
    }
}

