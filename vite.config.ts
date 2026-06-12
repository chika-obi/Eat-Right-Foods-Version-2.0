import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {GoogleGenAI} from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Dev Gemini Client safely
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
  } catch (error) {
    console.error('Dev mode failed to initialize Gemini Client:', error);
  }
}

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

function readBody(req: any): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk;
    });
    req.on('end', () => {
      resolve(body);
    });
    req.on('error', reject);
  });
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'aistudio-dev-api',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.method === 'POST' && req.url === '/api/chat') {
              res.setHeader('Content-Type', 'application/json');
              try {
                const bodyStr = await readBody(req);
                const { message, history } = JSON.parse(bodyStr);

                if (!message) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Message is required' }));
                  return;
                }

                if (!ai) {
                  let responseText = `Thank you for your inquiry about EatRight Foods! Currently, our AI is offline or configured in local preview mode.\n\nYou can contact us directly on WhatsApp or call us on 08030522403 to order our fresh Smoky Jollof Rice (₦3,000) or Fusion Feast (₦8,500) in Port Harcourt!`;
                  const lowerMsg = message.toLowerCase();
                  if (lowerMsg.includes('jollof') || lowerMsg.includes('rice')) {
                    responseText = `Our smoky Nigerian Jollof Rice is freshly served for ₦3,000, or try our high-value Combo Plate "Fusion Feast" (₦8,500) with Jollof, Dirty Rice, Gizdodo and Grilled Chicken!`;
                  } else if (lowerMsg.includes('catering') || lowerMsg.includes('corporate')) {
                    responseText = `EatRight Foods provides premium corporate catering for events and meetings of any scale. Fill out the Request Quote form or contact 08030522403 for immediate customization!`;
                  }
                  res.end(JSON.stringify({ text: responseText }));
                  return;
                }

                const chatHistory = (history || []).map((h: any) => ({
                  role: h.role === 'user' ? 'user' : 'model',
                  parts: [{ text: h.text }]
                }));

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

                res.end(JSON.stringify({ text: response.text || 'Thank you!' }));
              } catch (err: any) {
                console.error('Error in dev config Gemini helper:', err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Internal assistant error. Contact 08030522403' }));
              }
            } else if (req.method === 'POST' && req.url === '/api/quote') {
              res.setHeader('Content-Type', 'application/json');
              try {
                const bodyStr = await readBody(req);
                const data = JSON.parse(bodyStr);
                console.log('Dev Catering Quote Request:', data);
                res.end(JSON.stringify({
                  success: true,
                  message: 'Quote request submitted successfully! Our events team will contact you within 24 hours.',
                  refId: `ERF-${Math.floor(100000 + Math.random() * 900000)}`
                }));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Quote failed' }));
              }
            } else if (req.method === 'POST' && req.url === '/api/newsletter') {
              res.setHeader('Content-Type', 'application/json');
              try {
                const bodyStr = await readBody(req);
                const { firstName } = JSON.parse(bodyStr);
                res.end(JSON.stringify({
                  success: true,
                  message: `Thank you, ${firstName}! You have joined our Wellness Community successfully. Keep an eye out for healthy Nigerian meal tips!`
                }));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Newsletter failed' }));
              }
            } else {
              next();
            }
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
