import React, { useState } from 'react';
import { BLOG_POSTS, BLOG_POSTS as initialBlogPosts } from '../menuData';
import { BookOpen, Download, Mail, ChevronLeft, ChevronRight, FileText, CheckCircle2 } from 'lucide-react';

export function ResourceHub() {
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [downloadForm, setDownloadForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    guideType: 'Healthy Nigerian Meal Guide'
  });
  
  const [isSubscribed, setIsSubmitting] = useState(false);
  const [downloadUnlocked, setDownloadUnlocked] = useState(false);
  const [currentSlidePage, setCurrentSlidePage] = useState(0);

  // High-fidelity structured content slide summaries representing the premium PDFs
  const GUIDES_SLIDES: Record<string, string[][]> = {
    'Healthy Nigerian Meal Guide': [
      [
        "HEALTHY NIGERIAN MEAL GUIDE — VOL. 1",
        "Nourishing Healthier Lives Through Better Nigerian Food",
        "Introduction: The EatRight Philosophy",
        "Eating healthy does not mean abandoning Nigerian food cultures or sweet nostalgic flavors! The crucial secret lies in carbohydrate selection, portion control, sodium reduction, and healthy oil usage."
      ],
      [
        "SECTION 1: THE SMOKY JOLLOF RICE HYBRID RECIPE",
        "How to cut 35% of calories in smoky Jollof",
        "1. Parboil raw rice twice to eliminate starch glues.\n2. Swap vegetable/groundnut oils for light olive oil sprays.\n3. Quadruple pureed tomatoes and red bell peppers for organic lycopene.\n4. Infuse scent leaves (nchanwu) to lower digestion gas."
      ],
      [
        "SECTION 2: HEALTHIER SWALLOW SUBSTITUTIONS",
        "Conquering high-glycemic indices",
        "Standard cassava fufu or white garri creates wild insulin spikes. Swap them for:\n- Oat Swallow (rich in beta-glucan fibers, lowers cholesterol) (₦1,500/portion)\n- Wheat swallow (gives high cellular iron counts and sustained energy) (₦1,500)"
      ],
      [
        "SECTION 3: METABOLIC PEPPER SOUP INFUSIONS",
        "Medicinal spice powerhouses",
        "Our pepper soup specials are designed to detoxify naturally. Herbs like Uda, Uziza, and Ehuru actively clear blood lipids, raise metabolic rates, and suppress cellular swelling. Ideal for premium recovery diets!"
      ]
    ],
    'Meal Prep Guide': [
      [
        "MEAL PREP BLUEPRINT FOR BUSY EXECUTIVES",
        "Conquering Port Harcourt Schedules With Precision",
        "Managing stress and caloric targets on auto-pilot",
        "Hectic meetings make professional eating hard. Bulk meal assembly on Sundays guarantees proper portioning, reduces reliance on greasy fast-foods, and maintains physical fitness blocks!"
      ],
      [
        "STEP 1: THE 3-BASE ASSEMBLY ENGINE",
        "Creating core weekly culinary bricks",
        "Every Sunday afternoon, secure these three items:\n- Base A: A massive pot of low-oil rich tomato/bell pepper sauce.\n- Base B: Healthy steamed proteins (grilled chicken portions, boiled beef cubes).\n- Base C: Steamed carbs (brown rice, roasted sweet potato wedges)."
      ],
      [
        "STEP 2: SCIENTIFIC PORTION PACKAGING",
        "Dividing macro metrics correctly",
        "Acquire airtight, microwaveable, portion-divided boxes. Each daily box requires:\n- 40% steamed organic vegetables / rich dietary fiber salads.\n- 35% premium grilled proteins (EatRight seasoned chicken breast).\n- 25% healthy, unrefined complex carbohydrates."
      ],
      [
        "BENCHMARKS: REFRIGERATION RULES",
        "Keeping proteins fresh for 7 days",
        "Consume fish meals within 48 hours of prep. Grilled chicken and lean beef last comfortably for 5 days in average refrigeration. Store swallow soup bases separately and reheat strictly on low fires to guard nutrients!"
      ]
    ]
  };

  const activeSlides = GUIDES_SLIDES[downloadForm.guideType] || GUIDES_SLIDES['Healthy Nigerian Meal Guide'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDownloadForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleDownloadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!downloadForm.fullName || !downloadForm.email || !downloadForm.phone) return;

    setIsSubmitting(true);

    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: downloadForm.fullName.split(' ')[0],
          email: downloadForm.email,
          phone: downloadForm.phone
        })
      });

      setDownloadUnlocked(true);
      setCurrentSlidePage(0);
    } catch (error) {
      console.error('Newsletter error:', error);
      // Fallback unlock to ensure perfect UX
      setDownloadUnlocked(true);
      setCurrentSlidePage(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12" id="resource-hub-root">
      {/* Blog & Resources Header */}
      <div className="text-center max-w-xl mx-auto">
        <span className="text-red-600 font-bold uppercase tracking-widest text-[10px] bg-red-50 py-1 px-3.5 rounded-full border border-red-100">
          Knowledge Base & Community
        </span>
        <h2 className="text-3xl font-black text-slate-900 font-serif mt-3 tracking-tight">
          EatRight Knowledge Hub
        </h2>
        <p className="text-xs text-slate-500 mt-2">
          Read research articles and subscribe to unlock premium clinical downloads crafted by our wellness team.
        </p>
      </div>

      {/* Main Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Blog Articles List (2 columns width on large) */}
        <div className="lg:col-span-2 space-y-6" id="blog-articles-catalog">
          <h3 className="text-lg font-bold text-slate-800 border-l-4 border-green-600 pl-3">Featured Scientific Articles</h3>
          
          {!selectedPost ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {BLOG_POSTS.map(post => (
                <div 
                  key={post.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all group"
                >
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                      <span className="text-green-700 bg-green-50 px-2.5 py-1 rounded-full">{post.category}</span>
                      <span>{post.date} • {post.readTime}</span>
                    </div>
                    
                    <h4 className="text-base font-bold text-slate-900 mt-3 group-hover:text-green-700 transition-colors font-serif leading-snug">
                      {post.title}
                    </h4>
                    
                    <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed flex-1">
                      {post.summary}
                    </p>
                    
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="text-left text-xs font-bold text-green-700 mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                    >
                      Read In-Depth Analysis
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6 animate-in fade-in duration-300" id="opened-blog-viewer">
              <button
                onClick={() => setSelectedPost(null)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-green-700 font-semibold mb-2 group transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to Knowledge Catalog
              </button>
              
              <div>
                <span className="text-[10px] font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedPost.category}
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 font-serif mt-3 tracking-tight leading-snug">
                  {selectedPost.title}
                </h1>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-2 font-medium">
                  <span>Author: EatRight Dieticians</span>
                  <span>•</span>
                  <span>{selectedPost.date} ({selectedPost.readTime})</span>
                </div>
              </div>

              <div className="prose prose-slate text-slate-700 text-xs md:text-sm leading-relaxed whitespace-pre-line border-t border-slate-100 pt-5 space-y-4">
                {selectedPost.content}
              </div>

              <div className="bg-green-50 rounded-2xl p-4 border border-green-200/50 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div>
                  <h5 className="font-bold text-green-900 text-xs">Want custom counseling like this every week?</h5>
                  <p className="text-[11px] text-green-700">Subscribe to our meal subscriptions and receive weekly dietitian evaluations.</p>
                </div>
                {/* Accent Red Button */}
                <a
                  href="tel:08030522403"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-[10px] px-4 py-2.5 rounded-full inline-flex items-center gap-1.5 cursor-pointer shrink-0 shadow-md shadow-red-600/10"
                >
                  Call Dietician
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Lead Generation PDF download book (1 column wide) */}
        <div className="space-y-6" id="digital-download-console">
          <h3 className="text-lg font-bold text-slate-800 border-l-4 border-green-600 pl-3">Free Resource Library</h3>
          
          {!downloadUnlocked ? (
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-full border border-slate-800">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-600/10 rounded-full blur-2xl"></div>
              
              <div className="space-y-4">
                <div className="bg-green-500/10 w-12 h-12 rounded-2xl flex items-center justify-center border border-green-500/20">
                  <BookOpen className="w-6 h-6 text-green-400 animate-pulse" />
                </div>
                
                <div>
                  <h4 className="text-lg font-serif font-black tracking-tight text-white">Unlock Premium Guides</h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Gain immediate interactive online access to our detailed Meal guides, recipe caloric structures, and lifestyle advice.
                  </p>
                </div>

                <form onSubmit={handleDownloadSubmit} className="space-y-3.5 pt-2" id="download-sign-form">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Select Study Guide</label>
                    <select
                      name="guideType"
                      value={downloadForm.guideType}
                      onChange={handleInputChange}
                      className="w-full text-xs text-white bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500"
                    >
                      <option>Healthy Nigerian Meal Guide</option>
                      <option>Meal Prep Guide</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      name="fullName"
                      placeholder="Your name"
                      value={downloadForm.fullName}
                      onChange={handleInputChange}
                      className="w-full text-xs placeholder:text-slate-500 text-white bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500/50"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      name="email"
                      placeholder="Email Address"
                      value={downloadForm.email}
                      onChange={handleInputChange}
                      className="w-full text-xs placeholder:text-slate-500 text-white bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500/50"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      name="phone"
                      placeholder="Phone (WhatsApp preferred)"
                      value={downloadForm.phone}
                      onChange={handleInputChange}
                      className="w-full text-xs placeholder:text-slate-500 text-white bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500/50"
                    />
                  </div>

                  {/* Accent Red Button */}
                  <button
                    type="submit"
                    disabled={isSubscribed}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold uppercase tracking-wider text-[10px] py-3 rounded-xl transition duration-300 hover:shadow-lg hover:shadow-red-600/30 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                    id="download-form-submit"
                  >
                    <Download className="w-4 h-4" />
                    {isSubscribed ? "Authenticating Lead..." : "Unlock & Read Interactive PDF"}
                  </button>
                </form>
              </div>

              <div className="flex items-center gap-1.5 text-[9px] text-slate-500 mt-4 border-t border-slate-800/80 pt-3">
                <Mail className="w-3 h-3 text-slate-500" />
                <span>Join 2,500+ members in Port Harcourt Wellness Hub.</span>
              </div>
            </div>
          ) : (
            /* Interactive In-App PDF slides reader mock */
            <div className="bg-slate-950 text-white rounded-3xl p-5 shadow-2xl relative border border-emerald-950/80 h-full flex flex-col justify-between space-y-4 animate-in fade-in zoom-in-95 duration-300" id="interactive-book-reader">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">PDF Reader • Slide {currentSlidePage + 1}/{activeSlides.length}</span>
                </div>
                <button
                  onClick={() => setDownloadUnlocked(false)}
                  className="text-xs text-red-500 hover:underline cursor-pointer"
                >
                  Exit Book
                </button>
              </div>

              {/* Book content layer */}
              <div className="flex-1 bg-slate-900 rounded-2xl p-4 md:p-5 border border-slate-800/50 flex flex-col justify-center min-h-[220px]">
                <span className="text-[10px] text-emerald-400 font-extrabold tracking-widest uppercase">
                  {activeSlides[currentSlidePage][0]}
                </span>
                
                <h5 className="text-sm font-serif font-black mt-2 text-white border-l-2 border-emerald-500 pl-2">
                  {activeSlides[currentSlidePage][1]}
                </h5>
                
                <p className="text-[11px] text-emerald-100/90 font-bold mt-1 text-slate-300">
                  {activeSlides[currentSlidePage][2]}
                </p>

                <p className="text-[11px] text-slate-400 mt-4 leading-relaxed font-sans whitespace-pre-line border-t border-slate-800/30 pt-3">
                  {activeSlides[currentSlidePage][3]}
                </p>
              </div>

              {/* Page Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <button
                  disabled={currentSlidePage <= 0}
                  onClick={() => setCurrentSlidePage(prev => prev - 1)}
                  className="bg-slate-900 hover:bg-slate-850 p-2 rounded-xl border border-slate-800 text-slate-300 disabled:opacity-30 cursor-pointer"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-[10px] text-slate-500 font-medium">Page {currentSlidePage + 1} of {activeSlides.length}</span>

                <button
                  disabled={currentSlidePage >= activeSlides.length - 1}
                  onClick={() => setCurrentSlidePage(prev => prev + 1)}
                  className="bg-slate-900 hover:bg-slate-850 p-2 rounded-xl border border-slate-800 text-slate-300 disabled:opacity-30 cursor-pointer"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {currentSlidePage === activeSlides.length - 1 && (
                <div className="bg-emerald-950/40 border border-emerald-900/60 rounded-xl p-3 text-center animate-pulse">
                  <p className="text-[10px] text-emerald-300 font-bold">🎉 Congratulations! You read the full PDF breakdown.</p>
                  <a
                    href="https://wa.me/2348030522403?text=Hello+EatRight+Foods!+I+just+completed+reading+your+healthy+diet+guide+and+want+to+book+a+meal+subscription."
                    target="_blank"
                    className="text-[9px] text-[#E11D48] underline font-bold mt-1 inline-block"
                  >
                    Discuss customized plan with Emi Membere on WhatsApp
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
