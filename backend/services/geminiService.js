const { GoogleGenerativeAI } = require("@google/generative-ai");

const getApiKeys = () => {
    const keys = [];
    if (process.env.GEMINI_API_KEY) keys.push(process.env.GEMINI_API_KEY);
    if (process.env.GEMINI_API_KEY_2) keys.push(process.env.GEMINI_API_KEY_2);
    // Add more here if needed in the future
    return keys;
};

let currentKeyIndex = 0;

const getGenAI = () => {
    const keys = getApiKeys();
    if (keys.length === 0) {
        console.warn("No GEMINI_API_KEY found. AI features will be disabled.");
        return null;
    }
    return new GoogleGenerativeAI(keys[currentKeyIndex]);
};

const rotateKey = () => {
    const keys = getApiKeys();
    if (keys.length > 0) {
        currentKeyIndex = (currentKeyIndex + 1) % keys.length;
        console.warn(`[GEMINI RATE LIMIT HIT] Switched to fallback API Key #${currentKeyIndex + 1}`);
    }
};

// Simple In-Memory Cache to handle rate limiting issues temporarily for Free Tier
const problemCache = new Map();

const generateProblem = async (company, topic, difficulty, language = 'JavaScript') => {
    const cacheKey = `${company}-${topic}-${difficulty}-${language}`;
    if (problemCache.has(cacheKey)) {
        console.log("Serving problem from memory cache to save API quota.");
        return problemCache.get(cacheKey);
    }

    let retries = 0;
    const maxRetries = getApiKeys().length;

    while (retries < maxRetries) {
        try {
            const genAI = getGenAI();
            if (!genAI) {
                return {
                    title: `${company} Sample Problem (${topic})`,
                    description: "AI Generation is unavailable because the GEMINI_API_KEY is missing in the backend .env file.\n\nPlease add GEMINI_API_KEY=your_key to backend/.env to use this feature.",
                    starterCode: "// AI features disabled due to missing API Key.\n// Please configure the backend."
                };
            }

            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `Generate a unique, beginner-friendly coding interview problem asked by ${company} regarding ${topic}.
        IMPORTANT: The difficulty MUST be Basic or Easy. Do NOT generate complex algorithms, hard problems, or advanced data structures. Keep it simple and straightforward.
        Difficulty requested by user: ${difficulty}. (if this says Medium or Hard, downgrade it to Easy).
        The candidate will solve this in ${language}. 
        CRITICAL INSTRUCTION: provide the "starterCode" specifically formatted as a BLANK function definition for ${language}. Do NOT include the solution or any implementation logic. The starterCode must ONLY contain an empty function and a comment saying "Write your code here".
        Return ONLY a JSON object with this structure:
        {
            "title": "Problem Title",
            "description": "Detailed problem description...",
            "topic": "${topic}",
            "difficulty": "${difficulty}",
            "examples": [
                {"input": "...", "output": "...", "explanation": "..."}
            ],
            "constraints": ["..."],
            "starterCode": "function solve(input) {\\n  // Write your code here\\n}"
        }`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();


            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsedProblem = JSON.parse(jsonStr);

            // Store generated problem in cache for future identical requests
            problemCache.set(cacheKey, parsedProblem);

            return parsedProblem;

        } catch (error) {
            console.error(`Gemini Generation Error (Key index ${currentKeyIndex}):`, error.message);

            if (error.message.includes("429") || error.message.includes("quota") || error.message.includes("Resource has been exhausted")) {
                rotateKey();
                retries++;
                // Wait briefly before retrying
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
            }

            if (error.response) console.error("Full Error:", JSON.stringify(error.response, null, 2));
            return {
                title: "Error Generating Problem",
                description: `Failed to generate problem. Error: ${error.message}`,
                starterCode: "// Error occurred during generation."
            };
        }
    }

    // If it breaks out of the while loop, all keys failed.
    return {
        title: "Error Generating Problem",
        description: "You have hit the rate limit on ALL provided API keys. Please wait a minute and try again.",
        starterCode: "// Error occurred during generation."
    };
};

const evaluateCode = async (problem, userCode, language = 'JavaScript') => {
    let retries = 0;
    const maxRetries = getApiKeys().length;

    while (retries < maxRetries) {
        try {
            const genAI = getGenAI();
            if (!genAI) {
                throw new Error("GEMINI_API_KEY is missing.");
            }

            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `Evaluate this ${language} code solution for the following problem:
        Problem: ${JSON.stringify(problem)}
        
        User Code:
        ${userCode}
        
        Return ONLY a JSON object:
        {
            "isCorrect": boolean,
            "score": number (0-10),
            "feedback": "Detailed feedback...",
            "timeComplexity": "O(...)",
            "spaceComplexity": "O(...)",
            "improvement": "Tips to optimize..."
        }`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);

        } catch (error) {
            console.error(`Gemini Evaluation Error (Key index ${currentKeyIndex}):`, error.message);
            if (error.message.includes("429") || error.message.includes("quota") || error.message.includes("Resource has been exhausted")) {
                rotateKey();
                retries++;
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
            }
            throw new Error("Failed to evaluate code. Check API Key or Quota.");
        }
    }
    throw new Error("Rate limit exceeded on all API keys. Please wait and try again.");
};

const generateInterviewQuestion = async (type, history = [], domain = "") => {
    let retries = 0;
    const maxRetries = getApiKeys().length;

    while (retries < maxRetries) {
        try {
            const genAI = getGenAI();
            if (!genAI) return null;

            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const recentHistory = history.slice(-20);
            let historyContext = "";
            if (recentHistory.length > 0) {
                historyContext = `
            The user has ALREADY answered the following questions. DO NOT REPEAT THEM:
            ${recentHistory.map((q, i) => `${i + 1}. ${q}`).join('\n')}
            `;
            }

            const domainContext = domain
                ? `The candidate specializes in ${domain}. You MUST ask a question strictly related to ${domain}. 
               - Ask about specific **tools, libraries, frameworks, languages, or protocols** widely used in ${domain}.
               - Do NOT ask vague high-level questions like "Tell me about ${domain}".
               - Example: If domain is "Full Stack", ask about React, Node, SQL. If "Cyber Security", ask about Firewalls, Encryption, OWASP.
               - Do NOT ask about React/JS unless the domain matches.`
                : "The candidate is a general software engineer.";

            const prompt = `Generate a single, unique ${type} interview question for a software engineer.
        ${domainContext}
        ${historyContext}
        Return ONLY a valid JSON object (no markdown formatting) with this structure:
        {
            "question": "The question text",
            "idealAnswer": "A brief ideal answer",
            "keywords": ["key1", "key2", "key3"]
        }`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);

        } catch (error) {
            console.error(`Gemini Question Gen Error (Key index ${currentKeyIndex}):`, error.message);
            if (error.message.includes("429") || error.message.includes("quota") || error.message.includes("Resource has been exhausted")) {
                rotateKey();
                retries++;
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
            }
            return null;
        }
    }
    return null;
};

const simulateCodeExecution = async (code, language, customInput) => {
    let retries = 0;
    const maxRetries = getApiKeys().length;

    while (retries < maxRetries) {
        try {
            const genAI = getGenAI();
            if (!genAI) {
                return {
                    output: "Error: AI features are disabled because GEMINI_API_KEY is missing.",
                    status: "error"
                };
            }

            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `You are a strict, precise compiler and standard terminal emulator for the ${language} programming language.
        Your ONLY job is to read the provided Code, inject the provided Custom Input into its 'stdin', and output EXACTLY what the console standard output (stdout) would display after executing.
        
        DO NOT include markdown formatting.
        DO NOT provide explanations.
        DO NOT say "The output is:".
        Just return the raw terminal text output exactly as a real IDE console would show it.
        If the code has a syntax error or runtime error, output the standard error crash message instead.

        Custom Input (stdin):
        ${customInput || '(None)'}

        Code (${language}):
        ${code}
        `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let simulationText = response.text().trim();

            // Remove any markdown code blocks if the AI hallucinates them despite instructions
            if (simulationText.startsWith("\`\`\`")) {
                const lines = simulationText.split('\n');
                if (lines.length > 2) {
                    // remove first line (```lang) and last line (```)
                    lines.shift();
                    lines.pop();
                    simulationText = lines.join('\n').trim();
                }
            }

            return {
                output: simulationText,
                status: "success"
            };
        } catch (error) {
            console.error(`Gemini Simulation Error (Key index ${currentKeyIndex}):`, error);
            if (error.message && (error.message.includes("429") || error.message.includes("quota") || error.message.includes("Resource has been exhausted"))) {
                rotateKey();
                retries++;
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
            }
            return {
                output: "Error: Failed to simulate code execution. Please try again.\n" + error.message,
                status: "error"
            };
        }
    }
    return {
        output: "Error: Rate limit exceeded on all API keys. Please wait and try again.",
        status: "error"
    };
};

module.exports = { generateProblem, evaluateCode, generateInterviewQuestion, simulateCodeExecution };
