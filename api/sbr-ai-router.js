/**
 * SBR Super-App — Secure Serverless AI Routing API
 * Handles secure communication with OpenAI, Gemini, and Anthropic
 */

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { engine, prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        // 1. OpenAI Engine (SBR Aql — Quran & Tafsir)
        if (engine === 'openai') {
            const apiKey = process.env.OPENAI_API_KEY;
            if (!apiKey) return res.status(500).json({ error: 'OpenAI Core Key missing' });

            const response = await fetch('https://openai.com', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [{ role: 'user', content: prompt + " (Provide verified academic Islamic knowledge politely)" }]
                })
            });
            const data = await response.json();
            return res.status(200).json({ text: data.choices.message.content });
        }

        // 2. Google Gemini Engine (SBR Safar — Masjid & Travel)
        else if (engine === 'gemini') {
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) return res.status(500).json({ error: 'Gemini Core Key missing' });

            const response = await fetch(`https://googleapis.com{apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const data = await response.json();
            return res.status(200).json({ text: data.candidates.content.parts.text });
        }

        // 3. Anthropic Engine (SBR Qalam — Smart AI Notes)
        else if (engine === 'anthropic') {
            const apiKey = process.env.ANTHROPIC_API_KEY;
            if (!apiKey) return res.status(500).json({ error: 'Anthropic Core Key missing' });

            const response = await fetch('https://anthropic.com', {
                method: 'POST',
                headers: {
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'claude-3-5-sonnet-20241022',
                    max_tokens: 1024,
                    messages: [{ role: 'user', content: prompt }]
                })
            });
            const data = await response.json();
            return res.status(200).json({ text: data.content.text });
        }

        return res.status(400).json({ error: 'Invalid AI Engine type specified' });

    } catch (error) {
        console.error("Backend Router Error:", error);
        return res.status(500).json({ error: 'Internal Server Error: ' + error.message });
    }
}
