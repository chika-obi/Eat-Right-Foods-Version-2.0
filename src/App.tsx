import React, { useState } from 'react';
import { MENU_ITEMS, MenuItem } from './menuData';
import { Logo } from './components/Logo';
import { AIChatBot } from './components/AIChatBot';
import { CateringQuote } from './components/CateringQuote';
import { ResourceHub } from './components/ResourceHub';
import { 
  Menu, X, Phone, ShoppingBag, Plus, Minus, Search, Trash2, Calendar, 
  MapPin, Check, Heart, Trophy, Leaf, HelpCircle, Users, Award, ShieldAlert,
  Dribbble, Landmark, Handshake, Info
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'menu' | 'catering' | 'subscriptions' | 'rentals' | 'blog' | 'quote' | 'about'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Menu tab states
  const [menuSearch, setMenuSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Cart Management
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Subscription lead sign up
  const [subForm, setSubForm] = useState({ name: '', phone: '', email: '', planType: 'Weight Loss Plan', duration: 'Weekly (15 balanced bowls)' });
  const [subSuccess, setSubSuccess] = useState(false);

  // Rentals selection
  const [rentals, setRentals] = useState<Record<string, number>>({
    'Chafing Dishes (Classic Steel)': 0,
    'Soup Food Warmers (Premium)': 0,
    'Beverage Dispensers (5L)': 0,
    'Buffet Display Stands (Wood)': 0,
    'Outdoor Cooking Gas & Burner': 0,
    'Serving Tables (4ft with velvet drape)': 0
  });
  const [rentalForm, setRentalForm] = useState({ name: '', phone: '', date: '', location: '' });
  const [rentalSuccess, setRentalSuccess] = useState(false);

  // Climate volunteer form
  const [volunteerForm, setVolunteerForm] = useState({ name: '', email: '', phone: '', area: 'Nutrition Educator' });
  const [volunteerSuccess, setVolunteerSuccess] = useState(false);

  // Newsletter signup home
  const [emailSignup, setEmailSignup] = useState({ firstName: '', email: '', phone: '' });
  const [signupMsg, setSignupMsg] = useState("");

  const navigateToTab = (tab: typeof currentTab) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart logic
  const handleAddToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prev => {
      const copy = { ...prev };
      if (copy[itemId] <= 1) {
        delete copy[itemId];
      } else {
        copy[itemId] -= 1;
      }
      return copy;
    });
  };

  const handleClearCart = () => setCart({});

  const cartTotal = Object.entries(cart).reduce<number>((sum, [id, qty]) => {
    const item = MENU_ITEMS.find(m => m.id === id);
    return sum + (item ? item.price : 0) * (qty as number);
  }, 0);

  const cartCount = Object.values(cart).reduce<number>((sum, qty) => sum + (qty as number), 0);

  const triggerWhatsAppCartOrder = () => {
    let text = `*🚨 NEW EATRIGHT FOODS RESTAURANT ORDER* \n\n`;
    text += `Hello! I would like to order fresh healthy food for dispatch in Port Harcourt.\n\n*ORDER ITEMS:* \n`;
    
    Object.entries(cart).forEach(([id, qty]) => {
      const item = MENU_ITEMS.find(m => m.id === id);
      if (item) {
        text += `- *${item.name}* x ${qty} (₦${(item.price * (qty as number)).toLocaleString()})\n`;
      }
    });

    text += `\n*Total Cart Value: ₦${cartTotal.toLocaleString()}*\n\nPlease deliver to Port Harcourt address:\n_[Fill Deliver Address Here]_\n\nThank you!`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/2348030522403?text=${encoded}`, '_blank');
  };

  // Filtered Menu Items
  const filteredMenuItems = MENU_ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) || 
                          item.description.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", "Rice Favorites", "Rice Signatures", "Combo Feasts", "Breakfast", "Soups", "Pepper Soups", "Salads", "Juices & Drinks"];

  // Home Newsletter handler
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSignup.firstName || !emailSignup.email) return;
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...emailSignup })
      });
      const data = await res.json();
      setSignupMsg(data.message || "Thank you! Check your inbox.");
      setEmailSignup({ firstName: '', email: '', phone: '' });
    } catch {
      setSignupMsg("Thank you! You've joined our community database.");
    }
  };

  // Rental estimate calculator
  const rentalRates: Record<string, number> = {
    'Chafing Dishes (Classic Steel)': 1500,
    'Soup Food Warmers (Premium)': 2500,
    'Beverage Dispensers (5L)': 2000,
    'Buffet Display Stands (Wood)': 3000,
    'Outdoor Cooking Gas & Burner': 8000,
    'Serving Tables (4ft with velvet drape)': 4000
  };

  const handleRentalQtyChange = (item: string, value: number) => {
    setRentals(prev => ({
      ...prev,
      [item]: Math.max(0, value)
    }));
  };

  const rentalTotal = Object.entries(rentals).reduce<number>((sum, [item, qty]) => {
    return sum + (rentalRates[item] || 0) * (qty as number);
  }, 0);

  const triggerWhatsAppRentals = () => {
    let msg = `*EQUIPMENT RENTAL ENQUIRY — EATRIGHT FOODS*\n\n`;
    msg += `Client Name: *${rentalForm.name || 'Interested Client'}*\n`;
    msg += `Contact: *${rentalForm.phone || 'N/A'}*\n`;
    msg += `Expected Date: *${rentalForm.date || 'TBD'}*\n`;
    msg += `Location: *${rentalForm.location || 'Port Harcourt'}*\n\n`;
    msg += `*EQUIPMENT LIST:* \n`;
    
    let hasItems = false;
    Object.entries(rentals).forEach(([item, qty]) => {
      if ((qty as number) > 0) {
        hasItems = true;
        msg += `- *${item}* x ${qty} (₦${((rentalRates[item] || 0) * (qty as number)).toLocaleString()})\n`;
      }
    });

    if (!hasItems) return alert("Please select at least 1 rental item quantitiy!");

    msg += `\n*Estimated Rental Cost: ₦${rentalTotal.toLocaleString()}*\n\nPlease confirm availability for these logistics. Thank you!`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/2348030522403?text=${encoded}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans" id="eatright-root-container">
      
      {/* 1. Persisted Micro-Header for crucial delivery info */}
      <div className="bg-slate-900 border-b border-slate-800 text-[11px] text-slate-300 font-semibold tracking-wider px-4 py-2 flex flex-col sm:flex-row justify-between items-center gap-2 z-10">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>PORT HARCOURT & SURROUNDING AREAS • CALL DISPATCH: 08030522403</span>
        </div>
        <div className="flex items-center gap-3">
          <span>FAST DELIVERY AVAILABLE & WHATSAPP ORDERS ACCEPTED</span>
        </div>
      </div>

      {/* 2. Primary Navigation Bar */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 z-40 transition-all select-none" id="main-header">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigateToTab('home')} className="hover:opacity-95 transition-opacity cursor-pointer">
            <Logo variant="light" size="md" />
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {[
              { id: 'home', label: 'Home' },
              { id: 'menu', label: 'Our Menu' },
              { id: 'catering', label: 'Catering Services' },
              { id: 'subscriptions', label: 'Meal Prep Plans' },
              { id: 'rentals', label: 'Equipment Rentals' },
              { id: 'blog', label: 'Knowledge Hub' },
              { id: 'about', label: 'Meet Emi & CA' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => navigateToTab(tab.id as any)}
                className={`text-xs font-black uppercase tracking-wider py-2 px-3 rounded-full transition-all cursor-pointer ${
                  currentTab === tab.id 
                    ? 'text-green-800 bg-green-50 shadow-sm border border-green-200/50' 
                    : 'text-slate-600 hover:text-green-700 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Conversions CTAs Area */}
          <div className="flex items-center gap-2">
            {/* Open Quote Button - Accent Red as specified in the brand only rule */}
            <button
              onClick={() => navigateToTab('quote')}
              className="bg-red-600 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20 text-white font-extrabold uppercase mt-0 w-auto tracking-widest text-[9px] sm:text-[10px] py-2.5 px-4 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-600/10"
              id="header-quote-conversion-btn"
            >
              <Calendar className="w-3.5 h-3.5" />
              Request Quote
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-slate-100 hover:bg-slate-200 p-2.5 rounded-full text-slate-700 font-bold transition-transform active:scale-95 cursor-pointer"
              aria-label="Open Cart"
              id="header-cart-icon"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white rounded-full text-[9px] font-black flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Nav Drawer controller */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-50 text-slate-700 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 p-4 space-y-1.5 flex flex-col items-stretch animate-in slide-in-from-top-3 duration-250 select-none shadow-xl">
            {[
              { id: 'home', label: 'Homepage Dashboard' },
              { id: 'menu', label: 'Explore Restaurant Menu' },
              { id: 'catering', label: 'Catering Inquiries' },
              { id: 'subscriptions', label: 'Healthy Meal Preps' },
              { id: 'rentals', label: 'Equipment & Logistics Rentals' },
              { id: 'blog', label: 'Knowledge Hub & Free Guides' },
              { id: 'about', label: 'Meet the Founder (Climate Action)' },
              { id: 'quote', label: 'Interactive Quote Proposal' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => navigateToTab(tab.id as any)}
                className={`text-left text-xs font-semibold py-3 px-4 rounded-xl transition ${
                  currentTab === tab.id 
                    ? 'text-green-800 bg-green-50 font-bold' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* 3. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 relative">
        
        {/* ================= HOME TAB ================= */}
        {currentTab === 'home' && (
          <div className="space-y-16 animate-in fade-in duration-300" id="home-view-panel">
            {/* Elegant Hero Banner */}
            <div className="bg-gradient-to-br from-green-950 via-green-900 to-emerald-950 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl border border-emerald-950">
              <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 left-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl"></div>
              
              <div className="max-w-2xl space-y-6 relative">
                <span className="text-red-500 font-bold uppercase tracking-widest text-[10px] bg-red-500/10 py-1.5 px-3.5 rounded-full border border-red-500/20">
                  EatRight Foods • Port Harcourt
                </span>
                <h1 className="text-3xl md:text-5xl font-serif font-black tracking-tight leading-tight">
                  Healthy Nigerian Food <br/>Made Simple, Nutritious & Delicious
                </h1>
                <p className="text-xs md:text-sm text-emerald-100/90 leading-relaxed font-medium">
                  From restaurant dining and meal subscriptions to corporate catering and large-scale events, EatRight Foods delivers nutritious, delicious and professionally prepared Nigerian meals that make healthy eating simple and convenient.
                </p>

                {/* Brand Red Highlight Button & primary CTAs */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => navigateToTab('menu')}
                    className="bg-red-600 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/30 text-white font-extrabold uppercase tracking-wider text-xs py-3.5 px-7 rounded-full shadow-lg shadow-red-600/20 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                    id="hero-order-cart-btn"
                  >
                    View Menu & Order Cart
                  </button>
                  <button
                    onClick={() => navigateToTab('catering')}
                    className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold uppercase tracking-wider text-xs py-3.5 px-6 rounded-full transition cursor-pointer"
                  >
                    Catering Services
                  </button>
                  <a
                    href="https://wa.me/2348030522403?text=Hello+EatRight+Foods!+I+want+to+order+healthy+food+for+delivery."
                    target="_blank"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold uppercase tracking-wider text-xs py-3.5 px-6 rounded-full flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-green-700/10 transition"
                  >
                    Order On WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Scientific Claims/Trust Indicators with Statistic metrics */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="text-center max-w-lg mx-auto mb-10">
                <h2 className="text-2xl font-serif font-black text-slate-900 tracking-tight">Creating Healthier Lives One Meal at a Time</h2>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Every meal served represents our commitment to helping individuals and organizations embrace healthier lifestyles through better Nigerian food.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
                {[
                  { value: "150k+", label: "Healthy Meals Served", sub: "Calculated macros" },
                  { value: "500+", label: "Events Catered", sub: "Flawless service" },
                  { value: "120+", label: "Corporate Clients", sub: "Trusted in PH" },
                  { value: "7+", label: "Years Experience", sub: "Culinary craft" },
                  { value: "99%", label: "Satisfaction Rate", sub: "Delighted customers" }
                ].map((stat, idx) => (
                  <div key={idx} className="space-y-1 p-3 rounded-2xl bg-slate-50 border border-slate-100/50">
                    <span className="text-2xl md:text-3xl font-black text-green-700 font-serif block">{stat.value}</span>
                    <h4 className="text-[11px] font-extrabold text-slate-800 tracking-wide">{stat.label}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Section & Trust Pillars */}
            <div className="space-y-10">
              <div className="text-center max-w-lg mx-auto">
                <span className="text-xs text-green-800 font-bold bg-green-50 py-1 px-3 rounded-full border border-green-200 uppercase">Core Strengths</span>
                <h3 className="text-2xl font-black text-slate-900 font-serif mt-3">Why Choose EatRight Foods?</h3>
                <p className="text-xs text-slate-500 mt-1.5">More Than Food. A Healthier Way of Living.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Health-Conscious Meals", desc: "No extreme salts or saturated fats. We strictly measure calories and dietary balanced macros for cardiac and digestive wellness.", icon: Heart, badge: "Nutrition-focused" },
                  { title: "Fresh Local Ingredients", desc: "Locally-farmed fresh vegetables and herbs like scent and bitter leaf. Zero preservatives or synthetic flavor powders.", icon: Leaf, badge: "100% Organic" },
                  { title: "Corporate & Event Expertise", desc: "Premium menu design for Oil, Gas and Banking boards, government functions, and elegant Calabar/Ph wedding parties.", icon: Award, badge: "Professional" }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4 hover:border-green-300 transition-colors">
                      <div className="flex justify-between items-center">
                        <div className="bg-green-50 p-3 rounded-2xl border border-green-100">
                          <Icon className="w-5 h-5 text-green-700" />
                        </div>
                        <span className="text-[9px] font-extrabold text-green-800 bg-green-50 px-2 py-0.5 rounded-full">{item.badge}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 font-serif">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Who We Serve Platform */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-10 border border-slate-800 relative overflow-hidden">
              <div className="max-w-xl space-y-4 mb-8">
                <span className="text-red-500 font-bold uppercase tracking-wider text-[9px]">Serving Individuals, Families, and Corporate Groups</span>
                <h3 className="text-2xl font-serif font-black tracking-tight leading-snug">Solutions Tailored to Every Client Group</h3>
                <p className="text-xs text-slate-300">
                  Whether you are a busy executive, event planner, or healthcare seeker, we provide targeted culinary satisfaction.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { group: "Busy Professionals", note: "Portion-controlled fuel for hectic schedules." },
                  { group: "Families & Couples", note: "Nutritious dinner trays to share warmth." },
                  { group: "Corporate Organisms", note: "Executive feeding keeping staff active." },
                  { group: "Churches & NGOs", note: "Catering packages tailored to budget rules." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-2 hover:bg-slate-800 transition">
                    <h5 className="font-bold text-sm tracking-wide text-green-400 font-serif">{item.group}</h5>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Section & CTA */}
            <div className="bg-green-50 rounded-3xl border border-green-200/50 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 md:max-w-md">
                <h4 className="text-lg font-serif font-black text-green-950">Join Our Wellness Community</h4>
                <p className="text-xs text-green-800/90 leading-relaxed">
                  Subscribe to receive weekly dietician meal templates, healthy Nigerian recipes, and promotional discounts delivered straight to your inbox.
                </p>
              </div>

              <form onSubmit={handleEmailSignup} className="w-full md:max-w-md flex flex-col sm:flex-row items-stretch gap-2" id="home-newsletter-form">
                <input
                  type="text"
                  required
                  placeholder="First name"
                  value={emailSignup.firstName}
                  onChange={(e) => setEmailSignup(p => ({ ...p, firstName: e.target.value }))}
                  className="bg-white text-xs border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-400 text-slate-800 focus:outline-none focus:border-green-600 block flex-1"
                />
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={emailSignup.email}
                  onChange={(e) => setEmailSignup(p => ({ ...p, email: e.target.value }))}
                  className="bg-white text-xs border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-400 text-slate-800 focus:outline-none focus:border-green-600 block flex-1"
                />
                <button
                  type="submit"
                  className="bg-red-650 hover:bg-red-700 text-white font-extrabold uppercase py-3 px-6 rounded-xl hover:shadow-lg text-xs leading-none whitespace-nowrap tracking-wide bg-red-600 cursor-pointer shadow-md shadow-red-600/10"
                >
                  Join Community
                </button>
              </form>

              {signupMsg && (
                <div className="w-full text-center text-xs font-bold text-green-900 border-t border-green-200/50 pt-2 animate-bounce">
                  {signupMsg}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ================= MENU TAB ================= */}
        {currentTab === 'menu' && (
          <div className="space-y-10 animate-in fade-in duration-300" id="restaurant-menu-panel">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-red-600 font-bold uppercase tracking-widest text-[9px] bg-red-50 py-1 px-3.5 rounded-full border border-red-100">
                Fresh & Hot Delivery Catalog
              </span>
              <h1 className="text-3xl font-black text-slate-900 font-serif tracking-tight">Our Nutritious Digital Menu</h1>
              <p className="text-xs text-slate-500">
                Crafted by master chefs utilizing clinical parameters, low oil, and organic locally sourced Nigerian spices. Add items to build your cart, then order instantly via WhatsApp!
              </p>
            </div>

            {/* Search and Categories controls */}
            <div className="space-y-4">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-3 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search smoky jollof, soups, salads..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-full pl-11 pr-4 py-3.5 bg-white text-slate-800 shadow-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                />
                {menuSearch && (
                  <button 
                    onClick={() => setMenuSearch("")}
                    className="absolute right-4 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold pointer-events-auto cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Chips row */}
              <div className="flex overflow-x-auto whitespace-nowrap gap-1.5 py-2 px-1 scrollbar-none justify-center">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-[10px] font-extrabold uppercase tracking-wider py-2 px-3.5 rounded-full transition border cursor-pointer shrink-0 ${
                      selectedCategory === cat 
                        ? 'bg-green-700 text-white border-green-700 shadow-sm' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-350 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items Grid */}
            {filteredMenuItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="digital-menu-items">
                {filteredMenuItems.map(item => (
                  <div 
                    key={item.id}
                    className={`bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all relative ${
                      item.popular ? 'ring-2 ring-green-600/20' : ''
                    }`}
                  >
                    {/* Calorie or Popular labels */}
                    {item.popular && (
                      <span className="absolute top-3 right-3 bg-red-600 text-white text-[8px] font-black uppercase py-1 px-2.5 rounded-full tracking-widest leading-none z-10 shadow-xs">
                        Best Seller
                      </span>
                    )}

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold text-green-700 bg-green-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {item.category}
                          </span>
                          {item.calories && (
                            <span className="text-[10px] font-bold text-slate-400">
                              🔥 {item.calories} kCal
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-slate-900 font-serif mt-3">
                          {item.name}
                        </h3>
                        
                        <p className="text-xs text-slate-500 mt-1 lines-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Pricing and cart add action */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100/50">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Price</span>
                          <span className="text-base font-black font-serif text-slate-900">
                            ₦{item.price.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Chili/Spicy Indicator */}
                          {item.spicy && item.spicy > 0 && (
                            <span className="text-xs mr-1 bg-red-50 text-red-600 font-medium px-2 py-1 rounded-lg border border-red-100/60 uppercase tracking-widest text-[9px]">
                              🌶️ spicy
                            </span>
                          )}

                          {cart[item.id] ? (
                            <div className="flex items-center gap-2.5 bg-slate-100 py-1.5 px-3 rounded-full border border-slate-200">
                              <button 
                                onClick={() => handleRemoveFromCart(item.id)}
                                className="text-slate-600 hover:text-slate-900 font-bold p-0.5 cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-black text-slate-800">{cart[item.id]}</span>
                              <button 
                                onClick={() => handleAddToCart(item.id)}
                                className="text-slate-600 hover:text-slate-900 font-bold p-0.5 cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(item.id)}
                              className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 hover:shadow-md cursor-pointer transition"
                              aria-label="Add to cart"
                            >
                              <Plus className="w-4 h-4 font-bold" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-white border rounded-2xl max-w-sm mx-auto space-y-2">
                <Search className="w-8 h-8 mx-auto text-slate-300" />
                <h4 className="font-bold text-slate-850">No search results</h4>
                <p className="text-xs text-slate-400">We couldn't find matches. Try typing 'Jollof', 'okra' or select 'All'.</p>
                <button 
                  onClick={() => { setMenuSearch(""); setSelectedCategory("All"); }}
                  className="text-xs font-bold text-green-700 underline"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= CATERING TAB ================= */}
        {currentTab === 'catering' && (
          <div className="space-y-12 animate-in fade-in duration-300" id="catering-view-panel">
            {/* Split Screen layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              
              {/* Left Column: Information packages */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <span className="text-red-600 font-bold uppercase tracking-widest text-[9px] bg-red-50 py-1 px-3.5 rounded-full border border-red-100">
                    Fine Nigerian Events Customization
                  </span>
                  <h1 className="text-3xl font-black text-slate-900 font-serif leading-tight">Professional Corporate & Private Catering</h1>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Corporate luncheons, private milestones, oil sector training feeding, board breakfast spreads, weddings, and Calabar/Port Harcourt traditional parties. We orchestrate exceptional, healthy spreads.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    { title: "Corporate Board Luncheons", note: "Sophisticated buffet boxes or table setups packed with low-sodium grains, flame-roast croaker fish portions, and vibrant leafy stir-fries.", check: "Professional staff presentation & logistics" },
                    { title: "Weddings, Birthdays & Private Milestones", note: "Large native sharing bowls (Okodo plantains, Fisherman soup) presented beautifully with visual fruit layouts and organic cocktails.", check: "Custom theme displays & premium service" },
                    { title: "NGO Training & Civic Workshops", note: "Balanced, portion-controlled meals tailored exactly to budget outlines. Clean, fresh, on-schedule bulk deliveries.", check: "Flexible packaging options" }
                  ].map((cat, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-2.5">
                      <h4 className="font-bold text-base text-slate-900 font-serif">{cat.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans">{cat.note}</p>
                      <div className="flex items-center gap-1.5 text-green-800 text-[10px] font-black uppercase tracking-wider bg-green-50 py-1.5 px-3 rounded-xl border border-green-100/50 inline-flex">
                        <Check className="w-3.5 h-3.5 text-green-700" />
                        <span>{cat.check}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Multi-step Quote request tool */}
              <div>
                <CateringQuote />
              </div>
            </div>
          </div>
        )}

        {/* ================= MEAL SUBSCRIPTIONS TAB ================= */}
        {currentTab === 'subscriptions' && (
          <div className="space-y-12 animate-in fade-in duration-300" id="meal-subscriptions-panel">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-red-600 font-bold uppercase tracking-widest text-[9px] bg-red-50 py-1 px-3.5 rounded-full border border-red-100">
                Hassle-Free Dietary Programs
              </span>
              <h1 className="text-3xl font-black text-slate-900 font-serif tracking-tight">Portion-Controlled Meal Preps</h1>
              <p className="text-xs text-slate-500">
                Delivered clean and on-schedule to your workplace or home inside Port Harcourt. Starting from <span className="text-green-700 font-bold">₦50,000 / week</span>. Hand-calculated macro metrics.
              </p>
            </div>

            {/* Plans Tiers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="subscriptions-pricing-tiers">
              {[
                { title: "Weekly Meal Prep", price: "₦50,000", period: "per week", cover: "15 balanced bowls", desc: "Perfect for single busy executives in banking or logistics on-the-go.", items: ["10 meals + 5 fresh lunch packs", "Daily morning delivery in PH", "Calculated nutrient metrics card"] },
                { title: "Weight Loss Meal Plan", price: "₦65,000", period: "per week", cover: "Dietitian custom", desc: "High protein, low-sodium fibers mapped out to trigger safe metabolic rates.", items: ["Custom caloric ceiling rules", "Fiber-rich bitter & scent leaves", "Weekly feedback evaluations"] },
                { title: "Healthy Family Plan", price: "₦180,000", period: "per month", cover: "Feeds household", desc: "Traditional native bowls and favorites compiled for wholesome dinners.", items: ["Okodo or Yam Pepper Soup bowls", "2 family-sized weekly deliveries", "Organic yogurt bowls included"] },
                { title: "Corporate Staff feeding", price: "Custom Package", period: "Request estimate", cover: "10 to 50 employees", desc: "Satisfying meals directly dispatched to power team productivity.", items: ["Scheduled deliveries on time", "Multiple dietary selectors", "Direct HR quotation system"] }
              ].map((tier, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-base text-slate-900 font-serif">{tier.title}</h4>
                      <span className="text-[10px] text-green-700 bg-green-50 border border-green-200/50 py-0.5 px-2.5 rounded-full font-black uppercase tracking-wider block mt-1.5 inline-block">{tier.cover}</span>
                    </div>

                    <p className="text-xs text-slate-400 capitalize">{tier.desc}</p>
                    
                    <div className="border-t border-b border-slate-100 py-3">
                      <span className="text-2xl font-black font-serif text-slate-900 block">{tier.price}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">{tier.period}</span>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-600">
                      {tier.items.map((it, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-green-700 shrink-0" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Accent Red Buttons */}
                  <button
                    onClick={() => {
                      setSubForm(prev => ({ ...prev, planType: tier.title, duration: tier.cover }));
                      const elem = document.getElementById('subscription-signup-form');
                      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 hover:shadow-md text-white font-extrabold uppercase py-2.5 rounded-xl text-[10px] tracking-wider transition cursor-pointer"
                  >
                    Select Plan Type
                  </button>
                </div>
              ))}
            </div>

            {/* Subscribe Signup Form */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 max-w-xl mx-auto shadow-sm space-y-6" id="subscription-signup-form">
              <div className="text-center">
                <span className="text-[9px] font-bold text-green-700 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-full">Sign Up Platform</span>
                <h3 className="text-xl font-serif font-black mt-2 text-slate-900">Activate Your Healthy Subscriptions</h3>
                <p className="text-xs text-slate-400">Complete details below, and our nutritionist squad will consult on your meal schedules.</p>
              </div>

              {!subSuccess ? (
                <form onSubmit={(e) => { e.preventDefault(); setSubSuccess(true); }} className="space-y-4" id="subscription-active-lead">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Alabi"
                        value={subForm.name}
                        onChange={(e) => setSubForm(p => ({ ...p, name: e.target.value }))}
                        className="w-full text-xs border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:border-green-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">Phone Number (WhatsApp)</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 080..."
                        value={subForm.phone}
                        onChange={(e) => setSubForm(p => ({ ...p, phone: e.target.value }))}
                        className="w-full text-xs border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:border-green-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">Plan Interest</label>
                      <select
                        value={subForm.planType}
                        onChange={(e) => setSubForm(p => ({ ...p, planType: e.target.value }))}
                        className="w-full text-xs border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none"
                      >
                        <option>Weekly Meal Prep</option>
                        <option>Weight Loss Meal Plan</option>
                        <option>Healthy Family Plan</option>
                        <option>Corporate Staff feeding</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">Selected Duration</label>
                      <select
                        value={subForm.duration}
                        onChange={(e) => setSubForm(p => ({ ...p, duration: e.target.value }))}
                        className="w-full text-xs border border-slate-200 rounded-xl px-4 py-3 bg-slate-50"
                      >
                        <option>Weekly (15 balanced bowls)</option>
                        <option>Monthly (Full schedule)</option>
                      </select>
                    </div>
                  </div>

                  {/* Accent Red Button */}
                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-wider py-3 rounded-xl transition duration-300 hover:shadow-lg shadow-red-600/10 cursor-pointer"
                  >
                    Submit Subscription Order
                  </button>
                </form>
              ) : (
                <div className="text-center space-y-4 py-4 animate-in zoom-in-95 duration-250">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100 mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-base">Subscription Request Dispatched</h4>
                    <p className="text-xs text-slate-500 mt-1">Hello {subForm.name || 'Client'}, we have registered your interest for the {subForm.planType}. Our nutritionist will phone you shortly.</p>
                  </div>
                  <button
                    onClick={() => {
                      const text = `*🚨 MEAL PREP PLAN REGISTRATION*\n\nHello EatRight Foods! I register for:\n- Plan Type: *${subForm.planType}*\n- Duration: *${subForm.duration}*\n- Contact Name: *${subForm.name}*\n- Phone: *${subForm.phone}*\n\nPlease confirm our custom consultation callback. Thanks!`;
                      window.open(`https://wa.me/2348030522403?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="bg-green-700 hover:bg-green-800 text-white text-xs font-bold py-2.5 px-5 rounded-full inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    Discuss on WhatsApp
                  </button>
                  <button 
                    onClick={() => setSubSuccess(false)}
                    className="text-xs text-slate-500 border border-slate-200 hover:bg-slate-50 block mx-auto py-1 px-3 rounded-full mt-2 cursor-pointer font-medium"
                  >
                    Register another plan
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= RENTALS TAB ================= */}
        {currentTab === 'rentals' && (
          <div className="space-y-12 animate-in fade-in duration-300" id="rentals-view-panel">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-red-600 font-bold uppercase tracking-widest text-[9px] bg-red-50 py-1 px-3.5 rounded-full border border-red-100">
                Premium Event Utilities & Logistics
              </span>
              <h1 className="text-3xl font-black text-slate-900 font-serif tracking-tight">Professional Food Service Equipment Rentals</h1>
              <p className="text-xs text-slate-500">
                Planning an event? Rent certified hot-holding gear, premium catering tables, chaffing steel dishes, and dispensers. Select quantities to build your logistics budget quote.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Column: Rentals list (takes 2 columns layout on large) */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4" id="rentals-items-catalog">
                {[
                  { name: 'Chafing Dishes (Classic Steel)', rate: 1500, desc: 'Heavy duty, premium steel holding hot food safely for up to 6 hours.' },
                  { name: 'Soup Food Warmers (Premium)', rate: 2500, desc: 'Cylindrical electrical or gel-heated warmers for native white & vegetable soups.' },
                  { name: 'Beverage Dispensers (5L)', rate: 2000, desc: 'Aesthetic transparent cocktail containers fitted with secure silver tap valves.' },
                  { name: 'Buffet Display Stands (Wood)', rate: 3000, desc: 'Beautiful hand-carved wood displays to build premium visual bento tables.' },
                  { name: 'Outdoor Cooking Gas & Burner', rate: 8000, desc: 'Complete heavy-duty double gas ring system for large-pot smoky jollof.' },
                  { name: 'Serving Tables (4ft with velvet drape)', rate: 4000, desc: 'Strong layout tables draped with velvet fabrics fitting colors of choice.' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-slate-900 font-serif">{item.name}</h4>
                      <p className="text-[11px] text-slate-400 capitalize inline-block">{item.desc}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100/50 pt-3">
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">Rate per Day</span>
                        <span className="text-sm font-black font-serif text-slate-900">₦{item.rate.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-2 bg-slate-50 py-1.5 px-3 rounded-full border">
                        <button
                          onClick={() => handleRentalQtyChange(item.name, (rentals[item.name] || 0) - 1)}
                          className="text-slate-500 hover:text-slate-800 p-0.5 font-bold cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-black text-slate-800">{rentals[item.name] || 0}</span>
                        <button
                          onClick={() => handleRentalQtyChange(item.name, (rentals[item.name] || 0) + 1)}
                          className="text-slate-500 hover:text-slate-800 p-0.5 font-bold cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Calculations summary checkouts */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-md space-y-6" id="rental-checkout-panel">
                <h3 className="font-serif font-black text-lg border-b border-slate-100 pb-3">Rental Proposal Estimate</h3>
                
                {rentalTotal > 0 ? (
                  <div className="space-y-4">
                    <ul className="space-y-2 border-b border-slate-100 pb-4">
                      {Object.entries(rentals).map(([item, qty]) => {
                        if ((qty as number) <= 0) return null;
                        const rate = rentalRates[item] || 0;
                        return (
                          <li key={item} className="flex justify-between text-xs font-semibold text-slate-700">
                            <span>{item.substring(0, 22)}... x {qty}</span>
                            <span className="font-serif">₦{(rate * (qty as number)).toLocaleString()}</span>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="flex justify-between items-center text-sm font-black text-slate-900">
                      <span>Total Rental:</span>
                      <span className="text-emerald-700 font-serif text-lg">₦{rentalTotal.toLocaleString()}</span>
                    </div>

                    {!rentalSuccess ? (
                      <form onSubmit={(e) => { e.preventDefault(); setRentalSuccess(true); }} className="space-y-3 pt-2" id="rentals-lead-form">
                        <input
                          type="text"
                          required
                          placeholder="Your Name *"
                          value={rentalForm.name}
                          onChange={(e) => setRentalForm(p => ({ ...p, name: e.target.value }))}
                          className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none"
                        />
                        <input
                          type="tel"
                          required
                          placeholder="Phone *"
                          value={rentalForm.phone}
                          onChange={(e) => setRentalForm(p => ({ ...p, phone: e.target.value }))}
                          className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none"
                        />
                        <input
                          type="date"
                          required
                          value={rentalForm.date}
                          onChange={(e) => setRentalForm(p => ({ ...p, date: e.target.value }))}
                          className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5"
                        />
                        <input
                          type="text"
                          placeholder="Destination inside PH"
                          value={rentalForm.location}
                          onChange={(e) => setRentalForm(p => ({ ...p, location: e.target.value }))}
                          className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5"
                        />
                        
                        {/* Accent Red Button */}
                        <button
                          type="submit"
                          className="w-full bg-red-650 bg-red-600 hover:bg-red-700 text-white font-extrabold uppercase py-3 rounded-xl transition duration-300 shadow-md shadow-red-600/10 text-xs tracking-wider cursor-pointer"
                        >
                          Submit Rental Proposal
                        </button>
                      </form>
                    ) : (
                      <div className="text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-3">
                        <p className="text-xs text-emerald-950 font-bold">🎉 Rental Enquiry Filed successfully.</p>
                        <button
                          onClick={triggerWhatsAppRentals}
                          className="text-white bg-green-700 hover:bg-green-800 text-[10px] font-black uppercase tracking-wider py-2 px-4 rounded-full inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          Send details to WhatsApp
                        </button>
                        <button 
                          onClick={() => { setRentalSuccess(false); setRentals({ 'Chafing Dishes (Classic Steel)': 0, 'Soup Food Warmers (Premium)': 0, 'Beverage Dispensers (5L)': 0, 'Buffet Display Stands (Wood)': 0, 'Outdoor Cooking Gas & Burner': 0, 'Serving Tables (4ft with velvet drape)': 0 }); }}
                          className="text-[10px] text-slate-500 underline block mx-auto pt-1.5 cursor-pointer"
                        >
                          Clear & Reset
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400 space-y-2">
                    <Info className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="text-xs">No items picked yet. Grab classic steel dishes or warmers to build estimates.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ================= BLOG & RESOURCES TAB ================= */}
        {currentTab === 'blog' && (
          <div className="animate-in fade-in duration-300" id="blog-resources-view-panel">
            <ResourceHub />
          </div>
        )}

        {/* ================= MASTER QUOTE FORM TAB ================= */}
        {currentTab === 'quote' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300" id="master-quoting-panel">
            <div className="text-center space-y-2">
              <span className="text-red-500 font-bold uppercase tracking-widest text-[9px] bg-red-50 shadow-sm py-1 px-3.5 rounded-full border border-red-100">
                Culinary Caloric Budget Calculator
              </span>
              <h2 className="text-2xl font-serif font-black tracking-tight text-slate-900">Formulate Your Catering Quote</h2>
              <p className="text-sm text-slate-500">Pick guest covers, input constraints, and retrieve instant volume-discount algorithms.</p>
            </div>
            <CateringQuote />
          </div>
        )}

        {/* ================= ABOUT US & MEET EMI TAB ================= */}
        {currentTab === 'about' && (
          <div className="space-y-16 animate-in fade-in duration-300" id="founder-biography-view">
            
            {/* Biography Split Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-2">
              {/* Photo & Titles Left side */}
              <div className="bg-gradient-to-b from-green-900 to-green-950 text-white rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between border border-green-950/80">
                <div className="space-y-6">
                  <Logo variant="dark" size="lg" className="self-center" />
                  
                  <div className="border-t border-green-800/80 pt-6">
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-1.5">Founder & Visionary Officer</span>
                    <h2 className="text-3xl font-serif font-black tracking-tight leading-none text-white">Emi Membere</h2>
                    <p className="text-xs text-slate-300 mt-2 italic">“Food is more than nourishment. It is a powerful tool for wellness, climate community support, and lasting impact.”</p>
                  </div>
                </div>

                <div className="space-y-3.5 mt-8 border-t border-green-800/80 pt-5">
                  <div className="flex gap-2.5 text-xs text-green-200">
                    <Award className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Doctor of Business Administration (DBA) Candidate</span>
                  </div>
                  <div className="flex gap-2.5 text-xs text-green-200">
                    <Trophy className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>MBA Master Holder & Accounting Professional</span>
                  </div>
                  <div className="flex gap-2.5 text-xs text-green-200">
                    <Users className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>13+ Years Corporate Strategy & Hospitality Experience</span>
                  </div>
                </div>
              </div>

              {/* Biography Details Right side */}
              <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 border-l-4 border-green-600 pl-3">More Than a Food Business: The EatRight Journey</h3>
                  <div className="text-xs md:text-sm text-slate-500 leading-relaxed font-sans space-y-4">
                    <p>
                      EatRight Foods began with a simple observation: many people genuinely want to eat healthier but often lack the time, knowledge, or support to do so consistently.
                    </p>
                    <p>
                      As someone passionate about nutrition, wellness, and entrepreneurship, Emi Membere saw an opportunity to bridge the gap between traditional robust Nigerian meals and healthier living. Equipped with an accountant's financial precision, hospitality leadership, and an MBA, she formulated portioned dietary models.
                    </p>
                    <p>
                      What started as a vision to provide better food choices has grown into a thriving enterprise serving busy professionals, oil and banking team groups, and families across Port Harcourt and surrounding communities.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-800 font-serif mb-3">Emi Membere Speaking Topics & Consulting</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Building Sustainable Food Businesses", "Women Leadership in Hospitality", "Corporate Team Wellness & Nutrition Policies", "Climate Action in Agriculture"].map((topic, i) => (
                      <span key={i} className="bg-slate-100 text-slate-700 text-[10px] font-bold py-2 px-3.5 rounded-full border">
                        🎤 {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Climate Action Initiative Console */}
            <div className="bg-gradient-to-br from-green-950 via-green-900 to-emerald-950 text-white rounded-3xl p-8 shadow-xl border border-emerald-950">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                
                {/* Information */}
                <div className="space-y-4">
                  <span className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Giving Back • ECAI</span>
                  <h3 className="text-2xl font-serif font-black tracking-tight leading-snug">EatRight Climate Action Initiative</h3>
                  <p className="text-xs text-emerald-100/90 leading-relaxed font-sans">
                    The EatRight Climate Action Initiative (ECAI) was established to address the interconnected challenges of food security, nutrition education, environmental sustainability and community development. Our belief is simple: healthier communities and a healthier planet go hand in hand.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {["School Feeding Support Initiatives", "Renewable Organic Farming Projects", "Youth Environmental Awareness", "Healthy Shopping Campaigns"].map((tag, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-green-200">
                        <Leaf className="w-4 h-4 text-emerald-400" />
                        <span>{tag}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Volunteer/Partnership Form */}
                <div className="bg-white text-slate-800 rounded-2xl p-6 shadow-2xl relative border border-slate-100" id="volunteer-console-signup">
                  <h4 className="font-serif font-black text-base text-slate-800 text-center mb-1">Become Part of the Movement</h4>
                  <p className="text-[11px] text-slate-400 text-center mb-4">Volunteer or partner with EatRight Foods for climate & agricultural progress.</p>
                  
                  {!volunteerSuccess ? (
                    <form onSubmit={(e) => { e.preventDefault(); setVolunteerSuccess(true); }} className="space-y-3.5" id="volunteer-form-elem">
                      <input
                        type="text"
                        required
                        placeholder="Full Name *"
                        value={volunteerForm.name}
                        onChange={(e) => setVolunteerForm(p => ({ ...p, name: e.target.value }))}
                        className="bg-slate-50 w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Email Address *"
                        value={volunteerForm.email}
                        onChange={(e) => setVolunteerForm(p => ({ ...p, email: e.target.value }))}
                        className="bg-slate-50 w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="tel"
                          required
                          placeholder="Phone Number *"
                          value={volunteerForm.phone}
                          onChange={(e) => setVolunteerForm(p => ({ ...p, phone: e.target.value }))}
                          className="bg-slate-50 w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5"
                        />
                        <select
                          value={volunteerForm.area}
                          onChange={(e) => setVolunteerForm(p => ({ ...p, area: e.target.value }))}
                          className="bg-slate-50 w-full text-xs border border-slate-200 rounded-xl px-4"
                        >
                          <option>Nutrition Educator</option>
                          <option>Organic Farming Assistant</option>
                          <option>Civic Partnership Lead</option>
                        </select>
                      </div>
                      
                      {/* Accent Red Button */}
                      <button
                        type="submit"
                        className="bg-red-650 bg-red-600 hover:bg-red-700 text-white font-extrabold uppercase py-3 rounded-xl transition duration-300 w-full text-xs tracking-wider shadow-md shadow-red-600/10 cursor-pointer"
                      >
                        Apply for Partnership
                      </button>
                    </form>
                  ) : (
                    <div className="text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-3.5">
                      <p className="text-xs text-emerald-950 font-bold">🎉 Thank you! Registration submitted.</p>
                      <p className="text-[10px] text-slate-500">We appreciate your support, {volunteerForm.name}. A representative from ECAI will reach out to discuss your background in {volunteerForm.area}.</p>
                      <button 
                        onClick={() => {
                          const text = `*🚨 CLIMATE ACTION COMMUNITY REGISTRATION*\n\nHello EatRight Foods! I register for ECAI:\n- Name: *${volunteerForm.name}*\n- Email: *${volunteerForm.email}*\n- Phone: *${volunteerForm.phone}*\n- Interest: *${volunteerForm.area}*\n\nPlease confirm our partnership briefing. Thanks!`;
                          window.open(`https://wa.me/2348030522403?text=${encodeURIComponent(text)}`, '_blank');
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase py-2.5 px-4 rounded-full inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        Submit to ECAI on WhatsApp
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* 4. Sliding Order Cart Drawer Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-backdrop" aria-modal="true" role="dialog">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 transition-opacity backdrop-blur-xs" 
            onClick={() => setIsCartOpen(false)}
          ></div>
          
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10" id="cart-drawer-body">
            <div className="w-screen max-w-md bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-350 select-none">
              
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-1.5">
                    <ShoppingBag className="w-5 h-5 text-green-700" />
                    <h3 className="font-serif font-black text-lg text-slate-900">Your Order Cart</h3>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 px-2 text-slate-400 hover:text-slate-600 text-xs font-black uppercase border border-slate-100 rounded-md cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                {/* Cart list */}
                {Object.keys(cart).length > 0 ? (
                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                    {Object.entries(cart).map(([id, qty]) => {
                      const item = MENU_ITEMS.find(m => m.id === id);
                      if (!item) return null;
                      return (
                        <div key={id} className="flex justify-between items-center py-2.5 border-b border-slate-150/40">
                          <div className="space-y-0.5">
                            <h5 className="font-bold text-xs text-slate-900 leading-none">{item.name}</h5>
                            <span className="text-[10px] text-slate-500 font-semibold font-serif">₦{item.price.toLocaleString()} each</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-slate-100 py-1 px-2.5 rounded-full border text-xs font-bold text-slate-800">
                              <button onClick={() => handleRemoveFromCart(id)} className="text-slate-500 hover:text-slate-900"><Minus className="w-3" /></button>
                              <span>{qty}</span>
                              <button onClick={() => handleAddToCart(id)} className="text-slate-500 hover:text-slate-900"><Plus className="w-3" /></button>
                            </div>
                            <span className="font-serif font-black text-xs text-slate-800">₦{(item.price * (qty as number)).toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-2 text-slate-400">
                    <ShoppingBag className="w-12 h-12 mx-auto text-slate-200" />
                    <h5 className="font-bold text-slate-600">Your cart is empty</h5>
                    <p className="text-[11px] leading-relaxed">Head to 'Our Menu' and add smoky Nigerian rice and hot native soups!</p>
                  </div>
                )}
              </div>

              {/* Cart Footer checkout info */}
              {Object.keys(cart).length > 0 && (
                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-slate-500 font-medium">Delivery inside Port Harcourt:</span>
                    <span className="text-slate-700 font-bold bg-green-50 text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider border border-green-200/50">WhatsApp Dispatch</span>
                  </div>
                  <div className="flex justify-between items-center text-base font-black text-slate-900 bg-slate-50 p-4 border rounded-2xl">
                    <span>Order Total:</span>
                    <span className="font-serif text-lg text-emerald-800">₦{cartTotal.toLocaleString()}</span>
                  </div>

                  {/* Accent Red checkout conversions button */}
                  <div className="grid grid-cols-1 gap-2 pt-2">
                    <button
                      onClick={triggerWhatsAppCartOrder}
                      className="bg-red-600 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/30 text-white font-extrabold uppercase text-xs py-3.5 tracking-wider rounded-xl transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-red-600/10"
                      id="cart-whatsapp-checkout-btn"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Checkout on WhatsApp
                    </button>
                    <button
                      onClick={handleClearCart}
                      className="bg-white hover:bg-slate-50 text-slate-400 hover:text-red-500 border rounded-xl py-2.5 text-[10px] uppercase font-bold tracking-wider transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear Cart
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* 5. Persistent Branded AI chatbot assistant widget */}
      <AIChatBot />

      {/* 6. Standard Footer Block */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-20 text-white z-10" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Logo variant="dark" size="md" className="items-start" />
            <p className="text-[11px] text-slate-400 leading-relaxed font-serif uppercase tracking-wider">
              "Nourishing Healthier Lives Through Better Nigerian Food"
            </p>
          </div>

          {/* Links Col 1 */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">Our Platforms</h4>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li><button onClick={() => navigateToTab('menu')} className="hover:text-emerald-400 cursor-pointer">Digital Delivery Menu</button></li>
              <li><button onClick={() => navigateToTab('catering')} className="hover:text-emerald-400 cursor-pointer">Corporate Catering</button></li>
              <li><button onClick={() => navigateToTab('catering')} className="hover:text-emerald-400 cursor-pointer">Event Catering</button></li>
              <li><button onClick={() => navigateToTab('subscriptions')} className="hover:text-emerald-400 cursor-pointer">Balanced Meal Preps</button></li>
              <li><button onClick={() => navigateToTab('rentals')} className="hover:text-emerald-400 cursor-pointer">Catering Equipment Rentals</button></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">Community & Impact</h4>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li><button onClick={() => navigateToTab('blog')} className="hover:text-emerald-400 cursor-pointer">Knowledge Hub & Articles</button></li>
              <li><button onClick={() => navigateToTab('about')} className="hover:text-emerald-400 cursor-pointer">Meet Emi Membere</button></li>
              <li><button onClick={() => navigateToTab('about')} className="hover:text-emerald-400 cursor-pointer">Climate Action Initiative (ECAI)</button></li>
              <li><button onClick={() => navigateToTab('quote')} className="hover:text-emerald-400 cursor-pointer">Budget Proposal Generator</button></li>
            </ul>
          </div>

          {/* Contacts Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">Delivery & Contact</h4>
            <ul className="space-y-2 text-xs text-slate-300 font-semibold space-y-2.5">
              <li className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-400" /> Phone: 08030522403</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> Port Harcourt & Environs</li>
              <li>Email: info@eatrightfoods.ng</li>
              <li>Website: eatrightfoods.ng</li>
            </ul>
          </div>

        </div>

        {/* Master closing statement and license as requested inside the bible */}
        <div className="bg-slate-950 border-t border-slate-800/60 py-4 text-center text-[10px] text-slate-400 font-semibold" id="footer-master-statement">
          <p>EatRight Foods – Nourishing Healthier Lives Through Better Nigerian Food. :::</p>
          <p className="mt-1 text-slate-600 font-sans">© 2026 EatRight Foods. All rights reserved. Registered under Federal Food & Wellness statutes.</p>
        </div>
      </footer>

    </div>
  );
}
