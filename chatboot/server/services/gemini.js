const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function generateChatStream(userMessage, messageHistory = []) {
    try {
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
            return "Please configure your Gemini API Key in the server `.env` file to use the AI chatbot.";
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        // Convert the previous message history into the format expected by the Gemini API (optional but good for context)
        let promptContext = "";
        if (messageHistory.length > 0) {
            promptContext = "Here is the recent conversation history for context:\n";
            messageHistory.slice(-5).forEach(m => {
                promptContext += `${m.sender}: ${m.text}\n`;
            });
            promptContext += "\nNow respond to the user's latest message:\n";
        }

        const userText = typeof userMessage === 'object' ? userMessage.text : userMessage;
        let contentsPayload;

        // Check if the payload is complex (it contains a file attachment)
        if (typeof userMessage === 'object' && userMessage.fileUri) {
            contentsPayload = [
                { text: `${promptContext}User: ${userText}\nBot:` },
                {
                    fileData: {
                        fileUri: userMessage.fileUri,
                        mimeType: userMessage.mimeType
                    }
                }
            ];
        } else {
            contentsPayload = `${promptContext}User: ${userText}\nBot:`;
        }

        const currentDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'long' });

        const activeModel = userMessage.targetModel === 'pro' ? 'gemini-2.5-pro' : 'gemini-2.5-flash';

        const responseStream = await ai.models.generateContentStream({
            model: activeModel,
            contents: contentsPayload,
            config: {
                systemInstruction: `Your name is MyAssistant. You are a highly intelligent, helpful, and detail-oriented AI assistant. Always provide comprehensive, thoughtful, and well-structured answers using beautifully formatted markdown. Utilize bullet points, bolding, and headers to make your text highly readable.\n\nSystem Information:\nCurrent Date and Time: ${currentDate}`,
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
            }
        });

        return responseStream;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Sorry, I encountered an error while trying to process your request with Gemini.";
    }
}

async function generateChatResponseWithFile(multerFile) {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
        throw new Error("Missing Gemini API Key");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    try {
        const uploadResponse = await ai.files.upload({
            file: multerFile.path,
            mimeType: multerFile.mimetype,
            displayName: multerFile.originalname,
        });

        // Return the URI so the frontend can send it back in a chat message
        return uploadResponse.uri || uploadResponse.file?.uri;
    } catch (error) {
        console.error("Gemini File Upload Error:", error);
        throw error;
    }
}

module.exports = { generateChatStream, generateChatResponseWithFile };
