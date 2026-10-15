import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  Sliders, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  Download, 
  CheckCircle2, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { WhiteLabelConfig, CommercialLicenseTier } from '../types';

interface ClientPitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WhiteLabelConfig;
  onUpdateConfig: (newConfig: WhiteLabelConfig) => void;
}

const LICENSE_TIERS: CommercialLicenseTier[] = [
  {
    id: 'starter',
    name: 'Single-City Launch',
    targetMarket: 'Local operators, municipal fleet owners & startups',
    price: '$4,999',
    features: [
      'Customer iOS & Android PWA / Apps',
      'Driver & Courier Dispatch App',
      'City Admin & Operations Dashboard',
      'Stripe / Razorpay / UPI Integration',
      'Up to 15,000 monthly transactions',
      'Standard 48hr technical support'
    ],
    deliverables: ['Custom Domain Setup', 'App Store Submission Assistance', 'Brand Palette Applied']
  },
  {
    id: 'growth',
    name: 'Regional Growth Suite',
    targetMarket: 'Expanding mobility companies & multi-service chains',
    price: '$12,990',
    popular: true,
    features: [
      'Everything in Single-City, plus:',
      'Multi-City & Multi-Zone Geo-fencing',
      'Merchant & Restaurant Kitchen Display Portal',
      'Dynamic Surge Pricing Engine',
      'Unlimited monthly transactions',
      'White-label source code access',
      'Priority 24/7 SLA & dedicated account manager'
    ],
    deliverables: ['Full White-Labeling', 'Custom Payment Gateway Integration', 'Staff Training Modules']
  },
  {
    id: 'enterprise',
    name: 'Enterprise Full Source Code',
    targetMarket: 'Large corporations, logistics enterprises & government',
    price: '$28,500',
    features: [
      '100% Perpetual IP & Source Code Ownership',
      'Self-Hosted on your AWS / GCP / Cloud Run',
      'Zero monthly royalty or transaction fees',
      'Custom algorithm modification rights',
      'AI-powered dispatch & route optimization',
      'Custom ERP & Fleet Telematics Webhooks',
      '6 Months dedicated engineering handoff'
    ],
    deliverables: ['Git Repository Transfer', 'Architecture Blueprint', 'Security Audit Report']
  }
];

export const ClientPitchModal: React.FC<ClientPitchModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig
}) => {
  const [activeTab, setActiveTab] = useState<'customize' | 'pricing' | 'roi' | 'quote'>('customize');
  
  // Customizer local state
  const [appName, setAppName] = useState(config.appName);
  const [townName, setTownName] = useState(config.townName || 'Your Town');
  const [currencySymbol, setCurrencySymbol] = useState(config.currencySymbol);
  const [platformFee, setPlatformFee] = useState(config.platformFeePercent);
  const [surgeMultiplier, setSurgeMultiplier] = useState(config.surgeMultiplier);

  // ROI calculator state
  const [dailyOrders, setDailyOrders] = useState(800);
  const [avgOrderValue, setAvgOrderValue] = useState(240);
  const [takeRate, setTakeRate] = useState(18);

  // Quote form state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [selectedTier, setSelectedTier] = useState('growth');
  const [submittedQuote, setSubmittedQuote] = useState(false);

  if (!isOpen) return null;

  const handleApplyConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      ...config,
      appName: appName.trim() || 'ErrandX',
      townName: townName.trim() || 'Your Town',
      city: townName.trim() || 'Your Town',
      currencySymbol,
      platformFeePercent: platformFee,
      surgeMultiplier
    });
    alert('White-label parameters applied! All portals and headers are now updated.');
  };

  // ROI calculations
  const monthlyOrders = dailyOrders * 30;
  const monthlyGMV = monthlyOrders * avgOrderValue;
  const monthlyPlatformRevenue = (monthlyGMV * takeRate) / 100;
  const annualPlatformRevenue = monthlyPlatformRevenue * 12;

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuote(true);
    setTimeout(() => {
      setSubmittedQuote(false);
      onClose();
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#101117] border border-amber-400/40 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(250,204,21,0.2)] overflow-hidden my-auto max-h-[92vh] flex flex-col text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#141622]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-neutral-950 font-display font-black text-xl flex items-center justify-center shadow-lg">
              X
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-lg text-white">Commercial License & White-Label Suite</h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  Ready To Deploy
                </span>
              </div>
              <p className="text-xs text-neutral-400">Launch this turnkey all-in-one local services platform for your city or enterprise client</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 py-3 bg-[#0d0e14] border-b border-white/5 flex gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('customize')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'customize'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-md'
                : 'bg-white/5 text-neutral-300 hover:bg-white/10'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>1. Live White-Label Customizer</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'pricing'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-md'
                : 'bg-white/5 text-neutral-300 hover:bg-white/10'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>2. Commercial License Packages</span>
          </button>

          <button
            onClick={() => setActiveTab('roi')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'roi'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-md'
                : 'bg-white/5 text-neutral-300 hover:bg-white/10'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>3. Client ROI & Revenue Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('quote')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'quote'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-md'
                : 'bg-white/5 text-neutral-300 hover:bg-white/10'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>4. Request Proposal / Purchase</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: WHITE-LABEL CUSTOMIZER */}
          {activeTab === 'customize' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-start gap-3 text-xs text-amber-300">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold text-white text-sm">Instant Brand Demonstration</strong>
                  Change parameters below to see the entire platform re-brand immediately in real time for your pitch to a client or investor.
                </div>
              </div>

              <form onSubmit={handleApplyConfig} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    Application / Brand Name
                  </label>
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="e.g. ErrandX, TownErrand, QuickServe"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white font-semibold text-sm focus:border-amber-400 focus:outline-none"
                  />
                  <span className="text-[11px] text-neutral-400">Updates header wordmark, mobile simulator, and footer</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    Town Name (Tamil Nadu / Local Hub)
                  </label>
                  <input
                    type="text"
                    value={townName}
                    onChange={(e) => setTownName(e.target.value)}
                    placeholder="e.g. Your Town, Pollachi, Karaikudi, Kumbakonam"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white font-semibold text-sm focus:border-amber-400 focus:outline-none"
                  />
                  <span className="text-[11px] text-neutral-400">Updates localized town errands, shop locations & contact info</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    Currency Symbol
                  </label>
                  <select
                    value={currencySymbol}
                    onChange={(e) => setCurrencySymbol(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white font-semibold text-sm focus:border-amber-400 focus:outline-none"
                  >
                    <option value="₹">₹ (INR - Indian Rupee)</option>
                    <option value="$">$ (USD - US Dollar)</option>
                    <option value="€">€ (EUR - Euro)</option>
                    <option value="£">£ (GBP - British Pound)</option>
                    <option value="AED">AED (UAE Dirham)</option>
                    <option value="S$">S$ (SGD - Singapore Dollar)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                      Platform Take Rate (Commission)
                    </label>
                    <span className="font-mono font-bold text-amber-400 text-xs">{platformFee}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={platformFee}
                    onChange={(e) => setPlatformFee(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <span className="text-[11px] text-neutral-400">Net platform fee deducted per trip/order</span>
                </div>

                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Apply Brand Parameters Across Application</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: COMMERCIAL PACKAGES */}
          {activeTab === 'pricing' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="text-center max-w-xl mx-auto space-y-1">
                <h4 className="font-display font-bold text-xl text-white">Commercial Software License Options</h4>
                <p className="text-xs text-neutral-400">Directly resellable or launch-ready for city franchise operators</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {LICENSE_TIERS.map((tier) => (
                  <div
                    key={tier.id}
                    className={`p-5 rounded-2xl border flex flex-col justify-between transition-all relative ${
                      tier.popular
                        ? 'bg-[#181926] border-amber-400 shadow-[0_0_30px_rgba(250,204,21,0.2)]'
                        : 'bg-[#13141d] border-white/10 hover:border-white/20'
                    }`}
                  >
                    {tier.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-neutral-950 font-bold text-[10px] tracking-wide uppercase">
                        Most Popular for Clients
                      </span>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h5 className="font-display font-extrabold text-base text-white">{tier.name}</h5>
                        <p className="text-[11px] text-neutral-400 mt-1 min-h-[32px]">{tier.targetMarket}</p>
                      </div>

                      <div className="pt-2 border-t border-white/5">
                        <span className="font-display font-black text-2xl sm:text-3xl text-amber-400">{tier.price}</span>
                        <span className="text-[11px] text-neutral-400 block">One-time / setup package</span>
                      </div>

                      <ul className="space-y-2 pt-2 text-xs">
                        {tier.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2 text-neutral-300">
                            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span className="leading-tight">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedTier(tier.id);
                        setActiveTab('quote');
                      }}
                      className={`w-full mt-6 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                        tier.popular
                          ? 'bg-amber-400 hover:bg-amber-300 text-neutral-950'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      Select This Package
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CLIENT ROI SIMULATOR */}
          {activeTab === 'roi' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl bg-[#141622] border border-white/10 space-y-4">
                <h4 className="font-display font-bold text-base text-white">Client Revenue & Take-Rate Simulator</h4>
                <p className="text-xs text-neutral-400">
                  Calculate expected monthly platform commission based on fleet size, daily order volume, and ticket size.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-300">Daily Completed Orders:</span>
                      <strong className="text-amber-400 font-mono">{dailyOrders}</strong>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="10000"
                      step="100"
                      value={dailyOrders}
                      onChange={(e) => setDailyOrders(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-300">Avg Ticket Size ({config.currencySymbol}):</span>
                      <strong className="text-amber-400 font-mono">{config.currencySymbol}{avgOrderValue}</strong>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="1000"
                      step="10"
                      value={avgOrderValue}
                      onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-300">Platform Commission Take:</span>
                      <strong className="text-amber-400 font-mono">{takeRate}%</strong>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="1"
                      value={takeRate}
                      onChange={(e) => setTakeRate(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Calculated Outputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-1">
                  <span className="text-[11px] text-neutral-400 uppercase font-semibold">Monthly Orders</span>
                  <div className="font-display font-black text-2xl text-white">
                    {monthlyOrders.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-neutral-500">Across rides, food & parcel</span>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-1">
                  <span className="text-[11px] text-neutral-400 uppercase font-semibold">Monthly Gross GMV</span>
                  <div className="font-display font-black text-2xl text-white">
                    {config.currencySymbol}{Math.round(monthlyGMV).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-neutral-500">Total transaction throughput</span>
                </div>

                <div className="p-4 rounded-xl bg-amber-400/15 border border-amber-400/40 space-y-1">
                  <span className="text-[11px] text-amber-300 uppercase font-semibold">Net Platform Revenue</span>
                  <div className="font-display font-black text-2xl text-amber-400">
                    {config.currencySymbol}{Math.round(monthlyPlatformRevenue).toLocaleString()} /mo
                  </div>
                  <span className="text-[10px] text-amber-300/80">
                    Annualized: {config.currencySymbol}{Math.round(annualPlatformRevenue).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REQUEST PROPOSAL / QUOTE */}
          {activeTab === 'quote' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>Commercial Escrow Protected. Includes Deployment Handoff, SLA Guarantee and Source Code Transfer.</span>
              </div>

              {submittedQuote ? (
                <div className="p-8 text-center rounded-2xl bg-[#141622] border border-amber-400/30 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-white">Proposal & White-Label Demo Package Ready!</h4>
                  <p className="text-xs text-neutral-300 max-w-md mx-auto">
                    Your customized white-label pitch document for <strong>{clientCompany || 'your client'}</strong> with tier <strong>{selectedTier.toUpperCase()}</strong> has been generated and queued for export.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitQuote} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">Your / Client Full Name</label>
                      <input
                        required
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. David Vance"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">Business Email</label>
                      <input
                        required
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="client@mobilitycorp.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">Target Launch City & Country</label>
                      <input
                        required
                        type="text"
                        value={clientCompany}
                        onChange={(e) => setClientCompany(e.target.value)}
                        placeholder="e.g. Dubai, United Arab Emirates"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">Selected License Tier</label>
                      <select
                        value={selectedTier}
                        onChange={(e) => setSelectedTier(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white"
                      >
                        <option value="starter">Single-City Launch ($4,999)</option>
                        <option value="growth">Regional Growth Suite ($12,990)</option>
                        <option value="enterprise">Enterprise Full Source Code ($28,500)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
                  >
                    <span>Generate Commercial License Agreement & PDF Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-white/10 bg-[#141622] flex items-center justify-between text-xs text-neutral-400">
          <span>Current Active Brand: <strong className="text-amber-400">{config.appName}</strong> ({config.city})</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 font-semibold transition-colors cursor-pointer"
          >
            Close Suite
          </button>
        </div>

      </div>
    </div>
  );
};
