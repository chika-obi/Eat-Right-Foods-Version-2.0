import React, { useState } from 'react';
import { Calculator, CheckCircle2, ChevronRight, FileText, Send, PhoneCall } from 'lucide-react';

export function CateringQuote() {
  const [formData, setFormData] = useState({
    fullName: '',
    organization: '',
    phone: '',
    email: '',
    serviceType: 'Corporate Catering',
    menuPackage: 'Combo Feast Collection',
    numGuests: 50,
    eventDate: '',
    location: '',
    addRentals: false,
    additionalDetails: ''
  });

  const [quoteResult, setQuoteResult] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateEstimate = () => {
    // Pricing packages per head (in Naira)
    const basePrices: Record<string, number> = {
      'Healthy Rice Favorites': 3000,
      'Combo Feast Collection': 8500,
      'Premium Soups & Swallows': 5500,
      'Premium Native Bowls': 12500,
      'Special Diet & Salads Combo': 9500
    };

    const costPerCover = basePrices[formData.menuPackage] || 5000;
    let subtotal = costPerCover * formData.numGuests;

    // Volume-based discount algorithm
    let discountPercent = 0;
    if (formData.numGuests >= 300) discountPercent = 15;
    else if (formData.numGuests >= 150) discountPercent = 10;
    else if (formData.numGuests >= 70) discountPercent = 5;

    const discountAmount = Math.floor((subtotal * discountPercent) / 100);
    
    // Additional equipment logistics flat fee
    const rentalFee = formData.addRentals ? (formData.numGuests * 700 + 15000) : 0;
    
    const totalEstimate = subtotal - discountAmount + rentalFee;

    return {
      costPerCover,
      subtotal,
      discountPercent,
      discountAmount,
      rentalFee,
      totalEstimate,
      refId: `ERF-${Math.floor(100000 + Math.random() * 900000)}`
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) return;

    setIsSubmitting(true);
    
    const est = calculateEstimate();

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, ...est })
      });
      const data = await response.json();
      
      setQuoteResult({
        ...est,
        message: data.message,
        refId: data.refId || est.refId
      });
    } catch (error) {
      console.error('Error submitting quote request:', error);
      // Fallback state calculation
      setQuoteResult({
        ...est,
        message: 'Your quote proposal estimate is calculated below!',
        refId: est.refId
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerWhatsAppDraft = () => {
    if (!quoteResult) return;
    
    const msg = `*EATRIGHT FOODS — CUSTOM CATERING QUOTE PROPOSAL*
Ref ID: *${quoteResult.refId}*
Client Name: *${formData.fullName}*
Company: *${formData.organization || 'N/A'}*
Service: *${formData.serviceType}*
Guests Count: *${formData.numGuests} guests*
Menu Package: *${formData.menuPackage}*
Event Date: *${formData.eventDate || 'TBD'}*
Location: *${formData.location || 'Port Harcourt'}*

--- ESTIMATE BREAKDOWN ---
- Cost per Cover: ₦${quoteResult.costPerCover.toLocaleString()}
- Subtotal: ₦${quoteResult.subtotal.toLocaleString()}
- Discount Applied: ${quoteResult.discountPercent}% (-₦${quoteResult.discountAmount.toLocaleString()})
- Chafing & Service Rental: ₦${quoteResult.rentalFee.toLocaleString()}
- Estimated Grand Total: *₦${quoteResult.totalEstimate.toLocaleString()}*

Please contact me to finalize the menu selection. Thank you!`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/2348030522403?text=${encoded}`, '_blank');
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden" id="catering-quote-calculator">
      <div className="bg-gradient-to-r from-green-800 to-green-700 p-6 text-white text-center">
        <Calculator className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
        <h3 className="text-xl font-bold font-serif whitespace-nowrap">Catering Proposal & Quote Builder</h3>
        <p className="text-xs text-green-100 mt-1">Get an instant culinary pricing layout & custom consultation callback</p>
      </div>

      <div className="p-6 md:p-8">
        {!quoteResult ? (
          <form onSubmit={handleSubmit} className="space-y-4" id="quote-form-element">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Ebube Harrison"
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Organization / Company</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  placeholder="e.g. Shell Nigeria PH (Optional)"
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. 08030522403"
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. client@company.com"
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Service Platform</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:outline-none focus:border-green-600"
                >
                  <option>Corporate Catering</option>
                  <option>Event Catering</option>
                  <option>NGO Training Catering</option>
                  <option>Weekly Office Lunch Delivery</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Menu Cover Tier</label>
                <select
                  name="menuPackage"
                  value={formData.menuPackage}
                  onChange={handleInputChange}
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:outline-none focus:border-green-600"
                >
                  <option value="Healthy Rice Favorites">Rice Favorites (₦3,000 / head)</option>
                  <option value="Combo Feast Collection">Combo Feast Signature (₦8,500 / head)</option>
                  <option value="Premium Soups & Swallows">Soups & Swallows Menu (₦5,500 / head)</option>
                  <option value="Special Diet & Salads Combo">Salad & High-Protein (₦9,500 / head)</option>
                  <option value="Premium Native Bowls">Native Gourmet Bowls (₦12,500 / head)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Expected Guests: <span className="text-green-700 font-bold">{formData.numGuests} heads</span>
                </label>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  name="numGuests"
                  value={formData.numGuests}
                  onChange={handleInputChange}
                  className="w-full accent-green-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-2"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                  <span>20 Cover</span>
                  <span>150 Cover (10% Off)</span>
                  <span>300+ Cover (15% Off)</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Estimated Event Date</label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Delivery Destination inside PH</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. GRA Phase 2, Ada George Road, or Trans Amadi"
                className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
              />
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200/50">
              <input
                type="checkbox"
                name="addRentals"
                id="addRentals"
                checked={formData.addRentals}
                onChange={(e) => setFormData(prev => ({ ...prev, addRentals: e.target.checked }))}
                className="w-4 h-4 accent-green-600 rounded cursor-pointer"
              />
              <label htmlFor="addRentals" className="text-xs text-green-900 font-medium cursor-pointer selection:bg-transparent">
                Add chafing dishes, premium display stands, serving spoons, and logistic setup assistants (+₦700 per guest cover)
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Allergies or Customizations Details</label>
              <textarea
                name="additionalDetails"
                value={formData.additionalDetails}
                onChange={handleInputChange}
                rows={2}
                placeholder="e.g. Low sodium request for elders, include more scent leaves..."
                className="w-full text-sm border border-slate-200 rounded-xl p-3 bg-slate-50 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
              ></textarea>
            </div>

            {/* Accent Red CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-xs py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-600/20 active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
              id="submit-quote-btn"
            >
              {isSubmitting ? (
                <>Calculating Caloric Prorates...</>
              ) : (
                <>
                  Generate Proposal Estimate
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-300" id="quote-results-panel">
            <div className="inline-flex p-3 bg-emerald-50 rounded-full border border-emerald-100 mb-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            
            <div>
              <h4 className="text-2xl font-bold text-slate-800 font-serif">Instant Catering Proposal</h4>
              <p className="text-xs text-slate-400 mt-1">Successfully formulated under Registration: <span className="font-semibold text-slate-700">{quoteResult.refId}</span></p>
            </div>

            {/* Calculations Breakdown */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 text-left max-w-md mx-auto space-y-3.5">
              <div className="flex justify-between text-xs pb-2.5 border-b border-slate-200/50">
                <span className="text-slate-500 font-medium">Cover Selection:</span>
                <span className="font-bold text-slate-800">{formData.menuPackage}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Guests Quantity:</span>
                <span className="font-bold text-slate-800">{formData.numGuests} heads</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Unit Price per Cover:</span>
                <span className="font-serif font-bold text-slate-800">₦{quoteResult.costPerCover.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Subtotal base:</span>
                <span className="font-serif font-bold text-slate-800">₦{quoteResult.subtotal.toLocaleString()}</span>
              </div>
              
              {quoteResult.discountPercent > 0 && (
                <div className="flex justify-between text-xs text-emerald-800 bg-emerald-50 p-2 rounded-lg font-medium border border-emerald-100/50">
                  <span>Volume Discount ({quoteResult.discountPercent}% Off):</span>
                  <span className="font-serif font-bold">-₦{quoteResult.discountAmount.toLocaleString()}</span>
                </div>
              )}

              {quoteResult.rentalFee > 0 && (
                <div className="flex justify-between text-xs text-green-800 font-medium">
                  <span>Chafing & Logistical Equipment:</span>
                  <span className="font-serif font-bold">₦{quoteResult.rentalFee.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-sm pt-3 border-t border-slate-200 font-black text-slate-900 bg-slate-100/50 -mx-6 -mb-6 p-4 rounded-b-2xl">
                <span>Estimated Grand Total:</span>
                <span className="font-serif text-lg text-emerald-700">₦{quoteResult.totalEstimate.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              This estimate is calculated on Port Harcourt default culinary rates and covers. Book immediately to lock down the date!
            </p>

            {/* Accent Red Call To Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={triggerWhatsAppDraft}
                className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-xs px-6 py-3 rounded-full flex items-center justify-center gap-2 transform transition hover:scale-103 active:scale-97 cursor-pointer shadow-lg shadow-red-600/20"
                id="quote-submit-whatsapp-btn"
              >
                <Send className="w-4 h-4" />
                Transfer to WhatsApp Dispatcher
              </button>
              
              <button
                onClick={() => setQuoteResult(null)}
                className="bg-white hover:bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-xs px-6 py-3 rounded-full border border-slate-200 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                Recalculate Estimate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
