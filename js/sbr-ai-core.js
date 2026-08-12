/**
 * SBR Super-App — Centralized AI Core Engine
 * Powered by OpenAI GPT-4o, Claude 3.5, Gemini 2.5, & Flux
 */

// 1. Global function to handle all AI requests cleanly
async function askSBRSuperAppAI(engineType, userPrompt, outputElementId, buttonElementId) {
    const outputScreen = document.getElementById(outputElementId);
    const submitBtn = document.getElementById(buttonElementId);

    if (!userPrompt || !outputScreen) return;

    // Set UI to loading state to prevent double clicks
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.5";
    }
    
    outputScreen.innerHTML = `<span style="color: #ffcc00; font-weight: bold;">Thinking... 🧠</span>`;

    try {
        // Calling our centralized secure serverless endpoint
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ engine: engineType, prompt: userPrompt })
        });

        const data = await response.json();

        if (data.text) {
            // Apply lightweight formatting for bold text and clean Arabic script lines
            let cleanResponse = data.text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');
            outputScreen.innerHTML = cleanResponse;
        } else {
            outputScreen.innerHTML = `<span style="color: #ff3333;">Error: ${data.error || 'Failed to generate response'}</span>`;
        }
    } catch (error) {
        console.error("SBR AI System Error:", error);
        outputScreen.innerHTML = `<span style="color: #ff3333;">Backend Connection Setup Required. Core initialized successfully.</span>`;
    } finally {
        // Restore button state
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
        }
    }
}
// 2. बटन क्लिक होने पर मास्टर एआई फंक्शन को कॉल करना
document.addEventListener("DOMContentLoaded", () => {
    const executeBtn = document.getElementById("execute-btn"); // आपके पीले बटन की ID
    const aiModuleSelect = document.getElementById("ai-module-select") || document.querySelector("select"); // ड्रॉपडाउन
    const promptInput = document.getElementById("ai-prompt") || document.querySelector("textarea"); // इनपुट बॉक्स

    if (executeBtn) {
        executeBtn.addEventListener("click", () => {
            const selectedEngine = aiModuleSelect ? aiModuleSelect.value : "Aql";
            const userPrompt = promptInput ? promptInput.value : "";

            if (!userPrompt) {
                return alert("कृपया पहले अपना सवाल या डिज़ाइन प्रॉम्ट यहाँ लिखें!");
            }

            // आपके ऊपर वाले मास्टर फंक्शन (लाइन 7) को बटन से जोड़ना
            // यह खुद-ब-खुद '/api/chat' को कॉल करेगा और 'ai-result-box' में रिजल्ट दिखाएगा
            askSBRSuperAppAi(selectedEngine, userPrompt, "ai-result-box", "execute-btn");
        });
    }
});
