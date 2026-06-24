const { OpenAI } = require('openai');

// Mocked dependencies for startup blueprint phase
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'sk-mock' });

class AIService {
    static async getPersonalizedFeed(userId, currentHour) {
        // Mocking the Elasticsearch & MongoDB response logic defined in the Phase 6 Blueprint
        let mealContext = 'DINNER';
        if (currentHour < 11) mealContext = 'BREAKFAST';
        else if (currentHour < 16) mealContext = 'LUNCH';
        else if (currentHour < 19) mealContext = 'SNACK';

        return {
            context: mealContext,
            recommended_restaurants: [
                { id: "r1", name: "Behrouz Biryani", score: 0.98, reason: "Your usual Friday dinner" },
                { id: "r2", name: "Burger King", score: 0.85, reason: "Trending in your area" }
            ]
        };
    }

    static async parseOrderIntent(userInput, userLat, userLng) {
        if (process.env.OPENAI_API_KEY) {
            const prompt = `
                Extract intent from text and return JSON. Classes: ["SEARCH", "REORDER"].
                Vars: item_name, max_price. Text: "${userInput}"
            `;
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }]
            });
            return JSON.parse(response.choices[0].message.content);
        } else {
            // Mock Fallback
            return {
                intent: "SEARCH",
                resolved_items: [
                    { name: "Spicy Chicken Burger", price: 150, restaurantId: "r2" }
                ],
                mock_notice: "OpenAI API Key missing, showing default mockup."
            };
        }
    }
}

module.exports = AIService;
