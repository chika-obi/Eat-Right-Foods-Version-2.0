import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini API client initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize Gemini Client:', error);
  }
} else {
  console.warn('GEMINI_API_KEY is not set. AI Chat Assistant will run in fallback/educational mode.');
}

// Complete EatRight Foods Context to Ground the AI Chat Assistant
const EATRIGHT_CONTEXT = `
You are the EatRight Foods AI Assistant, an elite, friendly, and knowledgeable nutrition and menu assistant. Your purpose is to help visitors and clients of EatRight Foods make healthy meal choices, navigate our premium menu, understand our wellness programs, make rental inquiries, or request catering services.

EatRight Foods Tagline: "Nourishing Healthier Lives Through Better Nigerian Food"
Contact Details:
- Phone & WhatsApp: 08030522403
- Email: info@eatrightfoods.ng
- Website: eatrightfoods.ng
- Primary Location / Delivery Area: Port Harcourt & Surrounding Areas
- Founder: Emi Membere (Entrepreneur, Business Strategist, Wellness Advocate, DBA Candidate, MBA, hospitality & accounting professional).

Our Brand Values:
- Wellness First: Placing health and nutrition at the center of eating.
- Authenticity: Celebrating the richness of Nigerian cuisine while adapting it for healthier living.
- Innovation, Excellence, Sustainability, Community.

Our Core Offerings:
1. Premium Restaurant & Healthy Food Delivery (Menu sections are listed below).
2. Modern Corporate Catering (Executive Meetings, Board Meetings, Staff Feeding, Conferences, trainings, NGO feeding).
3. Elegant Event Catering (Weddings, Birthdays, Anniversaries, Gatherings).
4. Convenient Meal Prep & Subscriptions (Weekly, Monthly, Family, and Corporate Plans - starting from ₦50,000/week).
5. High-quality Food Service Equipment Rentals (Food Warmers, Chafing Dishes, Serving Tables, Beverage Dispensers).
6. Climate Action: EatRight Climate Action Initiative (ECAI) focusing on food security, nutrition education, sustainable agriculture, and youth engagement.

--- FOODS MENU & PRICING ---
RICE FAVORITES:
- White Rice served fresh: ₦2,500
- Smoky Jollof Rice (Nigerian style): ₦3,000
- Fried Rice prepared with fresh vegetables: ₦3,000
- Coconut Rice (Coconut-infused rich native taste): ₦3,000
- Native Rice (Traditional Nigerian spices & local flavor): ₦3,000
- White Rice & Sauce (Served with signature stew): ₦3,500

RICE SIGNATURES:
- Special Fried Rice (Served with grilled chicken & coleslaw): ₦12,500
- Dirty Rice (Served with grilled chicken): ₦8,500
- White Rice & Crab Sauce: ₦8,500

COMBO FEASTS (Full Meals):
- Fusion Feast (Jollof Rice + Dirty Rice + Gizdodo + Chicken): ₦8,500
- Diamond Feast (Fried Rice + Plantain + Chicken + Sauce): ₦8,500
- Delight Feast (Jollof Spaghetti + Fried Rice + Chicken): ₦8,500
- Kingdom Feast (Jollof Rice + Plantain Bites + Chicken): ₦8,500

BREAKFAST OPTIONS:
- Yam & Egg Sauce: ₦5,500
- Plantain King (Boiled plantain served with rich egg sauce): ₦5,500
- Plantain Porridge: ₦2,500
- Porridge Beans: ₦2,500
- Akamu (Pap): ₦1,500
- Oatmeal: ₦1,500
- Plus bread, pancakes, omelette, boiled/grilled sausages starting from ₦700 to ₦4,000.

HEALTHY SOUPS (Served with choice of swallow):
- Soups: Vegetable, Egusi, Afang, Okro, Native White, Ogbono, Banga, Bitter Leaf (₦2,500 - ₦3,000 each)
- Signature Soups: Seafood Okro (₦15,000), Fisherman Soup (₦15,000)
- Swallow Choices: Wheat (₦1,500), Semo (₦1,500), Pounded Yam (₦2,000), Oat Swallow (₦1,500), Eba (₦1,500)

PEPPER SOUP SPECIALS:
- Assorted Pepper Soup, Goatmeat, Cowleg, Cowtail, Cowhead, Chicken: ₦6,500 each
- Croaker and Tilapia Fish Pepper Soup: ₦7,000 each

SIGNATURE NATIVE BOWLS (Large group portions):
- Okodo Bowl (Unripe plantain cooked in rich pepper soup with protein, serves 2-4): ₦25,000
- Yam Pepper Soup Bowl (Soft yam cooked in flavorful pepper soup, serves 2-4): ₦25,000
- Fisherman Native Sharing Bowl (Large premium sharing bowl): ₦30,000

SALADS & HEALTHY BOWLS:
- Vegetable Salad: ₦4,000
- Chicken Salad: ₦7,500
- Fruit Salad: ₦4,500
- Greek/Fruit Yogurt Bowl: ₦5,500
- Parfait: ₦4,500

YOGURT & FRESH JUICES:
- Greek Yogurt (₦5,000), Plain Yogurt (₦3,500)
- Beetroot, Pineapple & Watermelon, or Detox Juice: ₦3,000 each
- Executive Smoothie: ₦4,000
- Signature/Fruit/Tropical Mocktails: ₦4,500 each

Please use this detailed information to provide professional, clear, accurate, and culturally authentic Nigerian recommendations. Maintain a warm, premium brand tone. Give direct pricing when asked. Recommend Combo Plates (₦8,500) for excellent balance and value!
`;

// AI Assistant Endpoint
app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Fallback mode if no API key is specified
  if (!ai) {
    console.log('Gemini API is unavailable, generating simulated healthy helper response.');
    
    // Simple mock healthy helper responses to ensure robustness
    let responseText = `Thank you for your inquiry about EatRight Foods. Currently, our AI is offline or configured in preview mode. How else can we assist you?\n\nYou can contact us directly at 08030522403 or whatsapp us for immediate delivery in Port Harcourt. Our Jollof Rice starts at ₦3,000 and Combo Fusion Feast is ₦8,500!`;
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('jollof') || lowerMsg.includes('rice')) {
      responseText = `Ah, our smoky Jollof Rice (₦3,000) is a massive favorite cooked to healthy standards! Or try our Fusion Feast combo (₦8,500) with Jollof, Dirty Rice, Gizdodo and grilled chicken. Order directly via WhatsApp at 08030522403!`;
    } else if (lowerMsg.includes('healthy') || lowerMsg.includes('diet') || lowerMsg.includes('nutrition')) {
      responseText = `At EatRight Foods, we cook with minimal sodium and heart-healthy oils. Emi Membere, our founder, is a wellness advocate. We offer superb meal preps starting from ₦50,000 per week to help your healthy fitness journey.`;
    } else if (lowerMsg.includes('catering') || lowerMsg.includes('corporate')) {
      responseText = `We provide corporate and event catering across Port Harcourt. From executive boards to weddings! Please submit your details in the 'Request a Quote' form on our site, or WhatsApp us at 08030522403 to discuss menu planning!`;
    } else if (lowerMsg.includes('whatsapp') || lowerMsg.includes('contact') || lowerMsg.includes('phone')) {
      responseText = `You can easily reach our delivery dispatcher on WhatsApp or phone call at 08030522403. We serve Port Harcourt and nearby areas!`;
    }
    
    return res.json({ text: responseText });
  }

  try {
    const chatHistory = (history || []).map((h: any) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }));

    // Generate content using modern @google/genai SDK format
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `SYSTEM CONSTRAINT:\n${EATRIGHT_CONTEXT}` }] },
        ...chatHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        temperature: 0.7,
      }
    });

    const text = response.text || 'Could you repeat that? Our chefs are whipping up something healthy!';
    return res.json({ text });
  } catch (err: any) {
    console.error('Error calling Gemini API:', err);
    return res.status(500).json({ error: 'Failed to generate response. Please try call us on 08030522403!' });
  }
});

// Leads endpoint
app.post('/api/quote', (req, res) => {
  const quoteData = req.body;
  console.log('Received Catering Quote Request:', quoteData);
  // Simulating database storage or email notification
  return res.json({
    success: true,
    message: 'Quote request submitted successfully! Our events team will contact you within 24 hours.',
    refId: `ERF-${Math.floor(100000 + Math.random() * 900000)}`
  });
});

app.post('/api/newsletter', (req, res) => {
  const { firstName, email, phone } = req.body;
  console.log('Received Newsletter signup:', { firstName, email, phone });
  return res.json({
    success: true,
    message: `Thank you, ${firstName}! You have joined our Wellness Community successfully. Keep an eye out for healthy Nigerian meal tips!`
  });
});

// AI Meme Generator suggestion route
app.post('/api/meme/suggest', async (req, res) => {
  const { image, mimeType, templateContext } = req.body;

  // Fallback mode if no API key is specified
  if (!ai) {
    console.log('Gemini API is offline, providing funny healthy food fallbacks.');
    const fallbacks = [
      "When the EatRight Fisherman Soup has more crabs than your ex's excuses.",
      "Me explaining to my gym instructor why smoky Jollof Rice is technically a complex carb.",
      "Emi Membere looking at deep-fried pastry snacks like: 'Stop right there!'",
      "That face you make when the organic oat swallow matches the native soup perfectly.",
      "Port Harcourt traffic can keep me waiting, but don't delay my EatRight delivery box!"
    ];
    return res.json({ captions: fallbacks });
  }

  try {
    const parts: any[] = [];
    
    if (image && mimeType) {
      // Clean up base64 prefix if present
      const cleanedBase64 = image.replace(/^data:image\/\w+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: cleanedBase64
        }
      });
    }

    const basePrompt = `Analyze this image (or the template context: "${templateContext || 'Healthy and traditional eating vibes'}") and suggest exactly 5 witty, highly humorous, and clever memes captions. The captions must focus on healthy eating struggles, wellness vs. junk food dilemmas, traditional premium Nigerian foods (like Jollof, fisherman soup, egusi, bitter leaf, yam porridge), or navigating local schedules in Port Harcourt. Keep each caption concise, punchy, and under 15 words so they fit perfectly as overlays. Return them as a JSON block with the property "captions".`;
    
    parts.push({ text: basePrompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: parts,
      config: {
        temperature: 0.9,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            captions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["captions"]
        }
      }
    });

    const bodyText = response.text || '{}';
    const parsed = JSON.parse(bodyText.trim());
    const captions = parsed.captions || [];
    
    return res.json({ captions: captions.slice(0, 5) });
  } catch (err: any) {
    console.error('Error suggesting meme captions via Gemini:', err);
    const emergencyCaptions = [
      "When EatRight delivers the Jollof and the smoky aroma fills the room.",
      "Dieting inside Port Harcourt but the hot fisherman soup keeps calling your name.",
      "No artificial seasonings, just premium ingredients and pure joy.",
      "Me calculating if local plantain porridge counts as healthy greens.",
      "My phone waiting for EatRight's WhatsApp delivery rider notification."
    ];
    return res.json({ captions: emergencyCaptions });
  }
});

// Serve frontend assets in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback all other client routing to Vue/React index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running in production with URL: ${process.env.APP_URL || `http://localhost:${port}`}`);
});
