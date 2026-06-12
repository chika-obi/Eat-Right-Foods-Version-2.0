export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  spicy?: number; // 0-3 peppers
  popular?: boolean;
  calories?: number;
}

export const MENU_ITEMS: MenuItem[] = [
  // Rice Favorites
  {
    id: "rf-1",
    name: "Plain White Rice",
    category: "Rice Favorites",
    description: "Plain white rice served fresh with our signature sauce",
    price: 2500,
    calories: 320
  },
  {
    id: "rf-2",
    name: "Smoky Jollof Rice",
    category: "Rice Favorites",
    description: "Rich, aromatic, slow-cooked Nigerian smoky jollof rice",
    price: 3000,
    spicy: 2,
    popular: true,
    calories: 410
  },
  {
    id: "rf-3",
    name: "Fried Rice",
    category: "Rice Favorites",
    description: "Colorful stir-fried rice with fresh hand-cut vegetables and premium spices",
    price: 3000,
    calories: 390
  },
  {
    id: "rf-4",
    name: "Coconut Rice",
    category: "Rice Favorites",
    description: "Flavourful coconut-infused rice with a rich, authentic native taste",
    price: 3000,
    calories: 450
  },
  {
    id: "rf-5",
    name: "Native Rice",
    category: "Rice Favorites",
    description: "Traditional Nigerian native rice cooked with locust beans, crayfish and scent leaves",
    price: 3000,
    spicy: 2,
    calories: 380
  },
  {
    id: "rf-6",
    name: "White Rice & Stew Sauce",
    category: "Rice Favorites",
    description: "Fluffy steamed rice served with our signature rich tomato and pepper stew",
    price: 3500,
    spicy: 1,
    calories: 420
  },

  // Rice Signatures
  {
    id: "rs-1",
    name: "Special Fried Rice",
    category: "Rice Signatures",
    description: "Premium fried rice served with grilled chicken piece & matching coleslaw",
    price: 12500,
    popular: true,
    calories: 680
  },
  {
    id: "rs-2",
    name: "Dirty Rice Signature",
    category: "Rice Signatures",
    description: "Seasoned, savory rice served with a portion of our expert grilled chicken",
    price: 8500,
    spicy: 2,
    calories: 590
  },
  {
    id: "rs-3",
    name: "White Rice & Crab Sauce",
    category: "Rice Signatures",
    description: "Signature steamed rice topped with an exquisite, spicy local crab meat sauce",
    price: 8500,
    spicy: 2,
    calories: 520
  },

  // Combo Plates
  {
    id: "cp-1",
    name: "Fusion Feast",
    category: "Combo Feasts",
    description: "Jollof Rice + Dirty Rice + Gizdodo (Gizzard-Plantain Mix) + Grilled Chicken",
    price: 8500,
    spicy: 2,
    popular: true,
    calories: 780
  },
  {
    id: "cp-2",
    name: "Diamond Feast",
    category: "Combo Feasts",
    description: "Fried Rice + Sweet Plantain Bites + Grilled Chicken + Stew Sauce",
    price: 8500,
    calories: 740
  },
  {
    id: "cp-3",
    name: "Delight Feast",
    category: "Combo Feasts",
    description: "Perfect blend of Jollof Spaghetti + colorful Fried Rice + Grilled Poultry",
    price: 8500,
    spicy: 1,
    calories: 710
  },
  {
    id: "cp-4",
    name: "Kingdom Feast",
    category: "Combo Feasts",
    description: "A combination of Jollof Rice + Plantain Bites + Grilled Chicken",
    price: 8500,
    calories: 720
  },

  // Breakfast Options
  {
    id: "bf-1",
    name: "Yam & Egg Sauce",
    category: "Breakfast",
    description: "Soft-boiled sweet yams served with rich scrambled egg sauce built with tomatoes",
    price: 5500,
    calories: 490
  },
  {
    id: "bf-2",
    name: "Plantain King (Egg Sauce)",
    category: "Breakfast",
    description: "Sweet boiled plantains served with a generous portion of rich egg sauce",
    price: 5500,
    calories: 440
  },
  {
    id: "bf-3",
    name: "Plantain Porridge",
    category: "Breakfast",
    description: "Creamy, savory green plantain porridge stewed with local herbs",
    price: 2500,
    calories: 380
  },
  {
    id: "bf-4",
    name: "Porridge Beans",
    category: "Breakfast",
    description: "Richly stewed brown honey beans, perfectly tenderized and healthy",
    price: 2500,
    calories: 340
  },
  {
    id: "bf-5",
    name: "Akamu (Pap Duo)",
    category: "Breakfast",
    description: "Warm, traditional fermented custard processed with organic corn grains",
    price: 1500,
    calories: 220
  },
  {
    id: "bf-6",
    name: "Healthy Oatmeal Bowl",
    category: "Breakfast",
    description: "Warm rolled oats prepared with organic honey and touch of coconut milk",
    price: 1500,
    calories: 260
  },
  {
    id: "bf-7",
    name: "Oat Bread (6pcs)",
    category: "Breakfast",
    description: "Gluten-conscious fresh low-sodium oat flour bread rolls",
    price: 2000,
    calories: 280
  },
  {
    id: "bf-8",
    name: "Oat Bread (12pcs)",
    category: "Breakfast",
    description: "Dozen fresh low-sodium organic healthy oat flour bread rolls",
    price: 4000,
    calories: 560
  },
  {
    id: "bf-9",
    name: "Special Oat Pancakes",
    category: "Breakfast",
    description: "Light, fluffy whole oat batter pancakes sweetened naturally",
    price: 2500,
    calories: 310
  },

  // Soups & Swallows
  {
    id: "sp-1",
    name: "Vegetable Soup",
    category: "Soups",
    description: "Stir-fried ugu and waterleaves, rich in iron, served with chosen swallow",
    price: 2500,
    calories: 210
  },
  {
    id: "sp-2",
    name: "Egusi Soup",
    category: "Soups",
    description: "Rich, blended melon seeds cooked with local spinach and crayfish",
    price: 2500,
    calories: 340
  },
  {
    id: "sp-3",
    name: "Afang Soup",
    category: "Soups",
    description: "Traditional Calabar soup comprising shredded afang leaves and waterleaf",
    price: 2500,
    calories: 290
  },
  {
    id: "sp-4",
    name: "Traditional Okro Soup",
    category: "Soups",
    description: "Slippery, light okro stew with fresh local fish seasonings",
    price: 2500,
    calories: 195
  },
  {
    id: "sp-5",
    name: "Fisherman Soup Supreme",
    category: "Soups",
    description: "Luxurious, spicy broth loaded with fresh prawns, fish, crabs and periwinkles",
    price: 15000,
    spicy: 3,
    popular: true,
    calories: 420
  },
  {
    id: "sp-6",
    name: "Seafood Okro Signature",
    category: "Soups",
    description: "Finely chopped okro stew fully loaded with prawns, crab claws, and fish cuts",
    price: 15000,
    spicy: 2,
    calories: 450
  },

  // Pepper Soups
  {
    id: "ps-1",
    name: "Assorted Meat Pepper Soup",
    category: "Pepper Soups",
    description: "Authentic, super spicy medicinal Nigerian meat broth cooked with native spices",
    price: 6500,
    spicy: 3,
    calories: 280
  },
  {
    id: "ps-2",
    name: "Goatmeat Pepper Soup",
    category: "Pepper Soups",
    description: "Tender chunks of local goatmeat (Asun type) simmered in a highly seasoned pepper broth",
    price: 6500,
    spicy: 3,
    calories: 295
  },
  {
    id: "ps-3",
    name: "Fresh Croaker Pepper Soup",
    category: "Pepper Soups",
    description: "Freshly caught whole Croaker fish sliced and poached in hot native spices",
    price: 7000,
    spicy: 2,
    calories: 240
  },

  // Signature Native Bowls
  {
    id: "nb-1",
    name: "Okodo Plantain Bowl",
    category: "Native Bowls",
    description: "Unripe organic plantains cooked with local herbs and fish. Serves 2–4 persons.",
    price: 25000,
    spicy: 2,
    calories: 1200
  },
  {
    id: "nb-2",
    name: "Yam Pepper Soup Bowl",
    category: "Native Bowls",
    description: "Soft sweet yams stewed inside highly flavorful Nigerian pepper soup. Serves 2-4.",
    price: 25000,
    spicy: 2,
    calories: 1350
  },

  // Salads & Healthy Bowls
  {
    id: "hl-1",
    name: "Organic Vegetable Salad",
    category: "Salads",
    description: "Fresh crisp garden vegetables tossed with light dietary dressing",
    price: 4000,
    calories: 140
  },
  {
    id: "hl-2",
    name: "Grilled Chicken Salad",
    category: "Salads",
    description: "Tender sliced breast chicken over organic lettuce, tomatoes, and low-fat splash",
    price: 7500,
    calories: 320
  },
  {
    id: "hl-3",
    name: "Honey Greek Yogurt Bowl",
    category: "Salads",
    description: "High-protein Greek yogurt topped with raw local honey, walnuts and oats",
    price: 5500,
    calories: 380
  },
  {
    id: "hl-4",
    name: "Fresh Fruit Parfait",
    category: "Salads",
    description: "Layered fresh Port Harcourt seasons (papaya, grapes, banana, oats, low-fat curd)",
    price: 4500,
    calories: 290
  },

  // Yogurt & Fresh Juices
  {
    id: "jc-1",
    name: "Ginger Beetroot Juice",
    category: "Juices & Drinks",
    description: "Freshly pressed detox blood builder juice sweetened with apples",
    price: 3000,
    calories: 85
  },
  {
    id: "jc-2",
    name: "Pineapple & Watermelon Juice",
    category: "Juices & Drinks",
    description: "Cold-pressed pure natural organic summer juice with high hydration levels",
    price: 3000,
    calories: 95
  },
  {
    id: "jc-3",
    name: "Executive Smoothie Bowl",
    category: "Juices & Drinks",
    description: "Rich vitamin blend of mangoes, avocados, bananas, oats and dates",
    price: 4000,
    calories: 215
  },
  {
    id: "jc-4",
    name: "Signature Tropical Mocktail",
    category: "Juices & Drinks",
    description: "Refreshing sparkling blend of hibiscus (zobo), citrus rind, and cold mint water",
    price: 4500,
    calories: 110
  }
];

export const BLOG_POSTS = [
  {
    id: "bp-1",
    title: "How to Cook a Lower-Calorie smoky Jollof Rice",
    category: "Healthy Nigerian Living",
    summary: "Discover our head chef's secrets to cutting down on saturates while locking in that rich, nostalgic firewood flavor.",
    date: "June 10, 2026",
    readTime: "4 min read",
    content: "Smoky Jollof is an absolute staple, but conventional restaurant recipes pack high peanut oils. At EatRight, we suggest parboiling under vacuum to strip starch, utilizing organic olive oil spray, raising pure tomato solids, and utilizing local scent leaf infusions. You reduce calories by 35% while keeping the classic taste!"
  },
  {
    id: "bp-2",
    title: "Meal Planning Hacks for Busy Port Harcourt Professionals",
    category: "Meal Prep Tips",
    summary: "Stuck eating late-night junk? A step-by-step roadmap to structural meal prep to fuel your executive peak.",
    date: "June 05, 2026",
    readTime: "6 min read",
    content: "When working long hours in banking or oil sectors, health suffers. Our advice: 1. Dedicate Sunday afternoons to bulk-simmering organic pepper soups or vegetable stews. 2. Freeze them in portion-conscious boxes. 3. Order EatRight weekly subscriptions where we handle portion-control and custom proteins (like croaker fish) so you eat on schedule as recomended by clinical benchmarks!"
  },
  {
    id: "bp-3",
    title: "Understanding Native Superfoods: Bitter Leaf & Scent Leaf",
    category: "Nutrition In-Depth",
    summary: "These are not just spices! Unravel the powerful cellular protective and metabolic benefits of traditional herbs.",
    date: "May 28, 2026",
    readTime: "5 min read",
    content: "Scent leaf (Clocimum) serves as a potent carminative and holds high antibacterial essential compounds. Bitter leaf (Vernonia) contains specific sesquiterpene lactones that help regulate glycemic indexes in digestion and act as a powerful blood purifier. Incorporating these into daily light soups boosts metabolic rates significantly!"
  }
];

export const TESTIMONIALS_DATA = [
  {
    quote: "EatRight Foods consistently delivers excellent meals for our team. Their corporate professionalism and strict organic health focus make them our preferred partner without doubt.",
    author: "Tari Okon",
    role: "HR Lead",
    organization: "Delta Oil Logistics"
  },
  {
    quote: "The event catering at our wedding was exceptional! Everything from Jollof to the fisherman bowls was gorgeously presented, and delivered exactly as promised. My guests still talk about it.",
    author: "Engr. & Mrs. Tamuno",
    role: "Private Host",
    organization: "PH Resident"
  },
  {
    quote: "The monthly subscription plan has helped me conquer late-night dining and portion fatigue. I lost 4kg of pure fat over 6 weeks because the protein ratios are highly scientific and tasty.",
    author: "Dr. Chidi Alabi",
    role: "Clinical Specialist",
    organization: "Port Harcourt Med Center"
  }
];
