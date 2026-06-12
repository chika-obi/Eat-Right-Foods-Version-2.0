import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Upload, Download, RotateCcw, Type as TypeIcon, 
  ArrowRight, Check, RefreshCw, Smile, Image as ImageIcon,
  Share2, ChevronRight, Eye, Trash2
} from 'lucide-react';

// Pre-defined meme templates for EatRight Foods & local PH humor
const TRENDING_TEMPLATES = [
  {
    id: 'temp-1',
    name: 'Smoky Jollof Joy',
    description: 'Me when the smoky healthy Jollof is served without artificial cubes',
    url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
    context: 'A blissful person eating a delicious, smoky red Jollof rice with grilled chicken.'
  },
  {
    id: 'temp-2',
    name: 'Fisherman soup dream',
    description: 'When the soup bowl arrives with huge jumbo crabs and periwinkles',
    url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
    context: 'Looking with pure happiness at a steaming hot premium fisherman soup full of rich sea crabs.'
  },
  {
    id: 'temp-3',
    name: 'Executive schedule vs diet',
    description: 'Trying to stay healthy amidst busy Port Harcourt schedules',
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    context: 'Workplace stress or busy professional trying to make smart dietary choices.'
  },
  {
    id: 'temp-4',
    name: 'Healthy Swallow Victory',
    description: 'Swapping heavy starchy cassavas for fluffy low-glycemic Oat Swallow',
    url: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',
    context: 'A healthy traditional swallow dish looking clean, nutritious, and appetizing.'
  }
];

export function MemeGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState(TRENDING_TEMPLATES[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Text Overlay state
  const [topText, setTopText] = useState("WHEN THE DISPATCH RIDER");
  const [bottomText, setBottomText] = useState("HAS THE FRESH JOLLOF BOX");
  const [fontSize, setFontSize] = useState(32);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [italicFont, setItalicFont] = useState(false);
  const [memeStyle, setMemeStyle] = useState<'classic' | 'modern'>('classic');

  // AI Suggestion state
  const [loadingCaptions, setLoadingCaptions] = useState(false);
  const [aiCaptions, setAiCaptions] = useState<string[]>([]);
  const [activeCaptionMode, setActiveCaptionMode] = useState<'top' | 'bottom'>('top');
  const [activeMemeTab, setActiveMemeTab] = useState<'templates' | 'upload'>('templates');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load falling seed captions on mount
  useEffect(() => {
    setAiCaptions([
      "When EatRight Fisherman Soup has more crabs than your ex's excuses.",
      "Me explaining to my coach why smoky healthy Jollof counts as premium complex carb.",
      "My stomach waiting for EatRight's WhatsApp dispatch confirmation.",
      "Standard starchy swallow has left the chat. Oat swallow enters with glory.",
      "Port Harcourt traffic can keep me waiting, but do not play with my food prep box!"
    ]);
  }, []);

  // Sync canvas presentation
  useEffect(() => {
    drawMeme();
  }, [selectedTemplate, customImage, topText, bottomText, fontSize, textColor, italicFont, memeStyle]);

  const drawMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Set uniform canvas dimensions
      canvas.width = 600;
      canvas.height = 500;

      // Draw original image cropped/scaled to center fill
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      // Add a subtle vignette/inner shadow overlay to ensure text stands out
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(0,0,0,0.4)');
      gradient.addColorStop(0.2, 'rgba(0,0,0,0)');
      gradient.addColorStop(0.8, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Design typography
      if (memeStyle === 'classic') {
        ctx.font = `black ${italicFont ? 'italic ' : ''}${fontSize}px Impact, "Arial Black", sans-serif`;
        ctx.fillStyle = textColor;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(3, fontSize / 8);
        ctx.textAlign = 'center';

        // Draw Top Text
        if (topText) {
          ctx.textBaseline = 'top';
          ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 20);
          ctx.fillText(topText.toUpperCase(), canvas.width / 2, 20);
        }

        // Draw Bottom Text
        if (bottomText) {
          ctx.textBaseline = 'bottom';
          ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
          ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
        }
      } else {
        // Modern Twitter/Instagram styled text header-card
        ctx.font = `${italicFont ? 'italic ' : ''}700 ${fontSize - 4}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = textColor;
        
        if (topText) {
          ctx.textBaseline = 'top';
          // Draw a soft capsule backdrop for modern style
          const textWidth = ctx.measureText(topText).width;
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.beginPath();
          ctx.roundRect(canvas.width / 2 - textWidth / 2 - 16, 15, textWidth + 32, fontSize + 8, 12);
          ctx.fill();

          ctx.fillStyle = textColor;
          ctx.fillText(topText, canvas.width / 2, 20);
        }

        if (bottomText) {
          ctx.textBaseline = 'bottom';
          const textWidth = ctx.measureText(bottomText).width;
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.beginPath();
          ctx.roundRect(canvas.width / 2 - textWidth / 2 - 16, canvas.height - fontSize - 25, textWidth + 32, fontSize + 8, 12);
          ctx.fill();

          ctx.fillStyle = textColor;
          ctx.fillText(bottomText, canvas.width / 2, canvas.height - 20);
        }
      }
    };

    // Use either custom uploaded file or preset template
    img.src = activeMemeTab === 'upload' && customImage ? customImage : selectedTemplate.url;
  };

  const handleMagicCaption = async () => {
    setLoadingCaptions(true);
    try {
      // Feed either the template details or a text prompt to server
      const bodyPayload = {
        templateContext: activeMemeTab === 'upload' ? "A healthy custom food or kitchen photograph" : selectedTemplate.context,
        image: activeMemeTab === 'upload' ? customImage : null,
        mimeType: activeMemeTab === 'upload' && customImage ? "image/jpeg" : null
      };

      const response = await fetch('/api/meme/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyPayload)
      });
      const data = await response.json();
      if (data.captions && data.captions.length > 0) {
        setAiCaptions(data.captions);
      }
    } catch (err) {
      console.error('Failed to suggestion captions:', err);
    } finally {
      setLoadingCaptions(false);
    }
  };

  const applyCaption = (text: string) => {
    if (activeCaptionMode === 'top') {
      setTopText(text);
    } else {
      setBottomText(text);
    }
  };

  // Drag and drop events for file uploading
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCustomImage(reader.result as string);
      setActiveMemeTab('upload');
      drawMeme();
    };
    reader.readAsDataURL(file);
  };

  const downloadMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `EatRight_Healthy_Meme_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const triggerReset = () => {
    setTopText("WHEN THE HEALTHY FOOD");
    setBottomText("SMELLS ABSOLUTELY MAGICAL");
    setFontSize(32);
    setTextColor('#FFFFFF');
    setItalicFont(false);
    setMemeStyle('classic');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 md:p-8" id="ai-meme-generator-module">
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-red-600 font-bold uppercase tracking-widest text-[9px] bg-red-50 py-1 px-3.5 rounded-full border border-red-100 inline-flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-red-600 animate-spin" />
              AI Studio Labs
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-serif tracking-tight flex items-center gap-2">
            AI-Powered Meme Studio
          </h2>
          <p className="text-xs text-slate-500">
            Generate healthy lifestyle memes to share with the community or friends. Press "Magic Caption" for smart AI analysis!
          </p>
        </div>

        {/* Action controllers buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={triggerReset}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl border border-slate-200 cursor-pointer"
            title="Reset text fields"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            onClick={downloadMeme}
            className="bg-red-600 hover:bg-red-700 hover:shadow-lg hover:shadow-red-650/10 text-white font-extrabold uppercase py-2.5 px-4 rounded-xl text-[10px] tracking-wider transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm shadow-red-600/10"
          >
            <Download className="w-4 h-4" />
            Download Completed Meme
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Visual Live Sandbox Canvas Panel (takes 5 cols layout) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col items-center">
          <div className="relative bg-slate-950 rounded-2xl overflow-hidden shadow-lg border border-slate-800/60 max-w-full w-full" style={{ aspectRatio: '6/5' }}>
            {/* The Live HTML5 Canvas */}
            <canvas 
              ref={canvasRef} 
              className="w-full h-full object-contain"
            />
            
            {/* Overlay indicators on hover */}
            <div className="absolute top-3 left-3 bg-slate-900/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none font-mono">Live Studio Preview</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-medium text-center italic">
            💡 Graphics automatically rendered at high-fidelity 600x500px on complete download.
          </p>

          {/* Social CTAs sharing below canvas */}
          <div className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Community Challenge</span>
            <p className="text-slate-600 text-[11px] font-semibold leading-snug">
              Tag <span className="text-green-700">@EatRightFoods</span> on social media with your generated meme. Users with the best submissions win a free **Combo Feast** next Friday!
            </p>
            <div className="flex gap-2 mt-1">
              <a 
                href="https://wa.me/2348030522403" 
                target="_blank" 
                className="text-[9px] font-black uppercase tracking-wider text-green-700 bg-green-50 hover:bg-green-150 py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Share2 className="w-3 h-3" /> WhatsApp to Emi
              </a>
              <button 
                onClick={() => alert("Meme share link copied to clipboard!")}
                className="text-[9px] font-black uppercase tracking-wider text-slate-600 bg-slate-100 hover:bg-slate-200 py-1.5 px-3 rounded-lg cursor-pointer"
              >
                Copy Studio Link
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Tool Control Panel (takes 7 cols layout) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Tabs for Template selector vs Personal File Upload */}
          <div className="flex border-b border-slate-150">
            <button
              onClick={() => { setActiveMemeTab('templates'); setSelectedTemplate(TRENDING_TEMPLATES[0]); }}
              className={`pb-3 px-4 font-black text-xs uppercase tracking-wider border-b-2 cursor-pointer transition-colors ${
                activeMemeTab === 'templates' 
                  ? 'border-green-700 text-green-800' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Trending Food Templates
            </button>
            <button
              onClick={() => { setActiveMemeTab('upload'); if (customImage) drawMeme(); }}
              className={`pb-3 px-4 font-black text-xs uppercase tracking-wider border-b-2 cursor-pointer transition-colors ${
                activeMemeTab === 'upload' 
                  ? 'border-green-700 text-green-800' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Upload Custom Image
            </button>
          </div>

          {activeMemeTab === 'templates' ? (
            /* Template Selectors Grid */
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {TRENDING_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setSelectedTemplate(t); }}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 text-left cursor-pointer transition-all group ${
                    selectedTemplate.id === t.id && activeMemeTab === 'templates'
                      ? 'border-green-600 ring-2 ring-green-100 scale-[1.02]' 
                      : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <img src={t.url} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2">
                    <span className="block text-[9px] text-white font-black truncate">{t.name}</span>
                    <span className="block text-[8px] text-slate-300 truncate leading-none">{t.description}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* Elegant drag-and-drop panel */
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                isDragging 
                  ? 'border-green-600 bg-green-50/20' 
                  : customImage 
                    ? 'border-slate-200 bg-slate-50' 
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              {customImage ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-700 mx-auto">
                    <Check className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-805">Custom Image Loaded Successfully!</p>
                  <p className="text-[10px] text-slate-400">Click to change or swap current file.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto stroke-1 animate-pulse" />
                  <p className="text-xs font-bold text-slate-700">Drag & Drop Your Food Photo Here</p>
                  <p className="text-[10px] text-slate-400">or browse local computer files (PNG, JPG, JPEG)</p>
                </div>
              )}
            </div>
          )}

          {/* ================= MEME WRITING ZONE ================= */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-6 space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Text customizers</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Top Caption Text</label>
                <input 
                  type="text"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="e.g. WHEN THE COLD DRINK HITS"
                  className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-600"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Bottom Caption Text</label>
                <input 
                  type="text"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="e.g. ME WANTING FRESH DISPATCH"
                  className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-600"
                />
              </div>
            </div>

            {/* Slider and Style config */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-150">
              {/* Font Sizing range */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-550">Font Size:</span>
                <input 
                  type="range"
                  min="16"
                  max="48"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-24 accentuate-green-700"
                />
                <span className="text-xs font-bold font-mono text-slate-600">{fontSize}px</span>
              </div>

              {/* Font color and style toggles */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-550">Color:</span>
                  <div className="flex gap-1">
                    {['#FFFFFF', '#E11D48', '#22C55E', '#FBBF24'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setTextColor(color)}
                        className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                          textColor === color ? 'border-black ring-2 ring-slate-200 scale-110' : 'border-slate-300'
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Color ${color}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="h-4 w-px bg-slate-200"></div>

                {/* Italic and formatting */}
                <button
                  onClick={() => setItalicFont(!italicFont)}
                  className={`text-xs px-2.5 py-1 rounded border font-semibold ${
                    italicFont ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Italic
                </button>

                {/* Classic Impact style vs system-ui Modern Style */}
                <button
                  onClick={() => setMemeStyle(memeStyle === 'classic' ? 'modern' : 'classic')}
                  className="text-xs font-semibold bg-white border border-slate-200 px-3 py-1 rounded hover:bg-slate-100 flex items-center gap-1.5"
                >
                  Style: <span className="text-green-700 capitalize font-bold">{memeStyle}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ================= CORE MAGIC CAPCTION AREA ================= */}
          <div className="border border-green-200 bg-green-50/20 rounded-2xl p-5 md:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-green-700 animate-pulse" />
                  <h4 className="font-bold text-sm text-green-800">Gemini Neural Magic Caption</h4>
                </div>
                <p className="text-[11px] text-slate-500">
                  Analyze current selected templates visual clues & write hilarious captions on autopilot.
                </p>
              </div>

              {/* Fire Button */}
              <button
                disabled={loadingCaptions}
                onClick={handleMagicCaption}
                className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-extrabold uppercase py-2.5 px-5 rounded-xl text-[10px] tracking-widest transition-all inline-flex items-center gap-2 cursor-pointer self-start sm:self-center"
              >
                {loadingCaptions ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Analyzing Food...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Magic Caption
                  </>
                )}
              </button>
            </div>

            {/* Target Alignment indicator */}
            <div className="flex items-center gap-2 text-[10px]">
              <span className="font-bold text-slate-500 uppercase tracking-widest">Apply Suggested Caption to:</span>
              <div className="flex bg-slate-100 p-0.5 rounded-lg border">
                <button
                  onClick={() => setActiveCaptionMode('top')}
                  className={`px-3 py-1 rounded-md text-[9px] font-black uppercase transition-colors ${
                    activeCaptionMode === 'top' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Top Text
                </button>
                <button
                  onClick={() => setActiveCaptionMode('bottom')}
                  className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-wider transition-colors ${
                    activeCaptionMode === 'bottom' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Bottom Text
                </button>
              </div>
            </div>

            {/* Suggested Captions Lists */}
            <div className="space-y-2 border-t border-green-150/50 pt-3">
              <div className="flex items-center justify-between text-[10px] text-slate-450">
                <span className="font-bold uppercase tracking-wider">AI Generated Caption Feed</span>
                <span className="italic">Click any caption to overlay instantly</span>
              </div>
              
              <div className="grid grid-cols-1 gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                {aiCaptions.map((caption, i) => (
                  <button
                    key={i}
                    onClick={() => applyCaption(caption)}
                    className="w-full text-left bg-white hover:bg-green-50/50 border border-slate-150 rounded-xl p-3 text-[11px] leading-snug font-bold text-slate-700 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <span className="pr-4">{caption}</span>
                    <span className="text-green-600 bg-green-50 font-black uppercase tracking-wider text-[8px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                      Select
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
