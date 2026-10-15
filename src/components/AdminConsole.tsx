import React, { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  MapPin, 
  ShieldCheck, 
  Sliders, 
  DollarSign, 
  Check, 
  X,
  Navigation,
  RefreshCw,
  Building,
  Layers
} from 'lucide-react';
import { ActiveBooking, WhiteLabelConfig } from '../types';

interface AdminConsoleProps {
  bookings: ActiveBooking[];
  config: WhiteLabelConfig;
  onUpdateConfig: (config: WhiteLabelConfig) => void;
  onCompleteBooking: (id: string) => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  bookings,
  config,
  onUpdateConfig,
  onCompleteBooking
}) => {
  const [activeTab, setActiveTab] = useState<'dispatch' | 'kyc' | 'pricing'>('dispatch');
  
  // Town Config Local State
  const [townName, setTownName] = useState(config.townName || 'Your Town');
  const [surge, setSurge] = useState(config.surgeMultiplier || 1.0);
  const [commission, setCommission] = useState(config.platformFeePercent || 5);
  
  // Tuned Zone & Errand Pricing State (Feature 3)
  const [baseFare, setBaseFare] = useState(config.baseFare || 25);
  const [extraStopFee, setExtraStopFee] = useState(config.extraStopFee || 15);
  const [townCentreFee, setTownCentreFee] = useState(config.zoneFees?.townCentre || 10);
  const [nearbyFee, setNearbyFee] = useState(config.zoneFees?.nearby || 25);
  const [outskirtsFee, setOutskirtsFee] = useState(config.zoneFees?.outskirts || 45);

  const [savedNotice, setSavedNotice] = useState(false);

  // Simulated KYC approval queue for local task partners
  const [kycQueue, setKycQueue] = useState([
    { id: 'KYC-101', name: 'Muthu Krishnan', vehicle: 'TVS Heavy Duty (TN 72 AB 2190)', doc: 'Aadhaar Card, Two-Wheeler RC', status: 'pending' },
    { id: 'KYC-102', name: 'Saravanan S.', vehicle: 'Honda Activa 6G (TN 45 BX 4110)', doc: 'Driving License, Police Clearance', status: 'pending' },
    { id: 'KYC-103', name: 'Karthik Raja', vehicle: 'Bajaj CT 100 (TN 58 AA 2910)', doc: 'Aadhaar Card, Town Resident Proof', status: 'pending' }
  ]);

  const handleApproveKyc = (id: string) => {
    setKycQueue(prev => prev.map(k => k.id === id ? { ...k, status: 'approved' } : k));
  };

  const handleSavePricingAndTown = () => {
    onUpdateConfig({
      ...config,
      townName: townName.trim() || 'Your Town',
      city: townName.trim() || 'Your Town',
      baseFare,
      extraStopFee,
      surgeMultiplier: surge,
      platformFeePercent: commission,
      zoneFees: {
        townCentre: townCentreFee,
        nearby: nearbyFee,
        outskirts: outskirtsFee
      }
    });

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  // Metrics
  const totalGmv = bookings.reduce((sum, b) => sum + b.totalAmount, 7450);
  const totalCommission = (totalGmv * commission) / 100;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      
      {/* Top Banner with Town Name Configuration */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#14151e] border border-amber-400/30">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display font-black text-2xl text-white">
              {config.appName} Town Operations Console
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded bg-amber-400/10 text-amber-400 font-mono font-bold border border-amber-400/20">
              {townName} Network
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            Configure town zones, errand rates, partner verification, and dispatch radar
          </p>
        </div>

        {/* Town Name Field */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-neutral-400 block">
              Active Town Name
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={townName}
                onChange={(e) => setTownName(e.target.value)}
                placeholder="e.g. Kovilpatti / Pollachi / Ambasamudram"
                className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/20 text-xs text-white font-bold w-48 focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleSavePricingAndTown}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs cursor-pointer shadow-sm hover:bg-amber-300"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Town name and pricing configurations saved successfully across the platform!</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#111219] border border-white/5 space-y-1">
          <span className="text-xs text-neutral-400 font-semibold">Today's Errand GMV</span>
          <div className="font-display font-black text-2xl text-white">
            {config.currencySymbol}{Math.round(totalGmv).toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">↑ Community errands active</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111219] border border-white/5 space-y-1">
          <span className="text-xs text-neutral-400 font-semibold">Platform Fee ({commission}%)</span>
          <div className="font-display font-black text-2xl text-amber-400">
            {config.currencySymbol}{Math.round(totalCommission).toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-400">Direct operator revenue</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111219] border border-white/5 space-y-1">
          <span className="text-xs text-neutral-400 font-semibold">Active Task Partners</span>
          <div className="font-display font-black text-2xl text-white">24 Partners</div>
          <span className="text-[11px] text-neutral-400">Two-wheelers & town runners</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111219] border border-white/5 space-y-1">
          <span className="text-xs text-neutral-400 font-semibold">Active Errands</span>
          <div className="font-display font-black text-2xl text-white">{bookings.length} Tasks</div>
          <span className="text-[11px] text-amber-300 font-medium">Average town turnaround: 18 min</span>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('dispatch')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'dispatch'
              ? 'bg-amber-400 text-neutral-950 shadow-md'
              : 'text-neutral-400 hover:text-white bg-white/5'
          }`}
        >
          Live Errand Radar ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab('kyc')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'kyc'
              ? 'bg-amber-400 text-neutral-950 shadow-md'
              : 'text-neutral-400 hover:text-white bg-white/5'
          }`}
        >
          Task Partner Verification ({kycQueue.filter(k => k.status === 'pending').length})
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'pricing'
              ? 'bg-amber-400 text-neutral-950 shadow-md'
              : 'text-neutral-400 hover:text-white bg-white/5'
          }`}
        >
          Town Pricing & Zone Fees
        </button>
      </div>

      {/* TAB 1: LIVE DISPATCH RADAR */}
      {activeTab === 'dispatch' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-400 font-semibold uppercase tracking-wider">
              Live Errands in {townName}
            </span>
            <span className="text-amber-400 font-mono">Live Network Connected</span>
          </div>

          <div className="space-y-3">
            {bookings.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#111219] border border-white/5 text-neutral-400 text-xs">
                No active errands at this moment. Post an errand using the Customer App or Mobile Simulator to view it here.
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-5 rounded-2xl bg-[#12131b] border border-white/10 hover:border-amber-400/40 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/30">
                        {booking.id}
                      </span>
                      <span className="text-xs uppercase font-bold text-white px-2 py-0.5 rounded bg-white/5">
                        {booking.serviceName}
                      </span>
                      <span className="text-xs text-emerald-400 font-medium">● {booking.status.toUpperCase()}</span>
                      {booking.stops && booking.stops.length > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
                          {booking.stops.length} Stops
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-white">{booking.title}</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-400">
                      <div>
                        <strong className="text-emerald-400 font-normal">Pickup / Stop 1: </strong>
                        <span className="text-neutral-300">{booking.pickupLocation}</span>
                      </div>
                      <div>
                        <strong className="text-amber-400 font-normal">Delivery: </strong>
                        <span className="text-neutral-300">{booking.dropLocation}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-neutral-400 pt-1">
                      <span>Partner: <strong className="text-white">{booking.driverName || 'Assigned'}</strong></span>
                      <span>OTP: <strong className="text-amber-400 font-mono">{booking.otp}</strong></span>
                      <span>Payment: <strong className="text-white">{booking.paymentMethod || 'COD'}</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                    <div className="text-right">
                      <span className="font-display font-black text-xl text-amber-400">
                        {config.currencySymbol}{booking.totalAmount}
                      </span>
                      <span className="block text-[10px] text-neutral-400">
                        Fee: {config.currencySymbol}{Math.round((booking.totalAmount * commission) / 100)}
                      </span>
                    </div>

                    <button
                      onClick={() => onCompleteBooking(booking.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Force Complete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: TASK PARTNER KYC QUEUE */}
      {activeTab === 'kyc' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {kycQueue.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#12131b] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">{item.id}</span>
                    <h4 className="font-bold text-sm text-white">{item.name}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      item.status === 'approved' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 mt-1">{item.vehicle}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Documents: {item.doc}</p>
                </div>

                {item.status === 'pending' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApproveKyc(item.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-neutral-950 font-bold text-xs hover:bg-emerald-400 transition-colors cursor-pointer"
                    >
                      Verify & Activate Partner
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Partner Active in {townName}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TOWN PRICING & ZONE FEES CONTROLS (Feature 3) */}
      {activeTab === 'pricing' && (
        <div className="p-6 rounded-2xl bg-[#12131b] border border-white/10 space-y-6 max-w-2xl">
          <div className="space-y-1">
            <h4 className="font-display font-bold text-base text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Town Zones & Pricing Engine Controls</span>
            </h4>
            <p className="text-xs text-neutral-400">
              Tune base fare, in-town rates, distance fees for outer zones, extra stops fee, and platform take-rate
            </p>
          </div>

          {/* Three Configurable Zones */}
          <div className="space-y-3 p-4 rounded-xl bg-black/40 border border-white/10">
            <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
              Zone Fees Configuration (3 Zones)
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <span className="text-[11px] text-neutral-300 block">1. Town Centre (Flat Rate)</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-neutral-400">{config.currencySymbol}</span>
                  <input
                    type="number"
                    value={townCentreFee}
                    onChange={(e) => setTownCentreFee(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-white/20 text-xs text-amber-400 font-bold"
                  />
                </div>
                <span className="text-[10px] text-neutral-500">In-town short errands</span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-neutral-300 block">2. Nearby Areas Fee</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-neutral-400">{config.currencySymbol}</span>
                  <input
                    type="number"
                    value={nearbyFee}
                    onChange={(e) => setNearbyFee(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-white/20 text-xs text-amber-400 font-bold"
                  />
                </div>
                <span className="text-[10px] text-neutral-500">2 - 5 km from centre</span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-neutral-300 block">3. Outskirts (Outer Area)</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-neutral-400">{config.currencySymbol}</span>
                  <input
                    type="number"
                    value={outskirtsFee}
                    onChange={(e) => setOutskirtsFee(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-white/20 text-xs text-amber-400 font-bold"
                  />
                </div>
                <span className="text-[10px] text-neutral-500">Villages & outskirts (&gt;5km)</span>
              </div>
            </div>
          </div>

          {/* Base Fare & Multi-Stop Extra Fee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="text-xs text-neutral-300 font-semibold block">Base Pickup Fare ({config.currencySymbol}):</span>
              <input
                type="number"
                min="10"
                max="100"
                value={baseFare}
                onChange={(e) => setBaseFare(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-xs text-white font-bold"
              />
              <span className="text-[10px] text-neutral-500">Starting minimum fare for all errands</span>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs text-neutral-300 font-semibold block">Extra Stop Fee ({config.currencySymbol}):</span>
              <input
                type="number"
                min="5"
                max="50"
                value={extraStopFee}
                onChange={(e) => setExtraStopFee(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-xs text-white font-bold"
              />
              <span className="text-[10px] text-neutral-500">Applied per additional stop beyond pickup+drop</span>
            </div>
          </div>

          {/* Platform Fee & Surge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300 font-semibold">Platform Fee (%):</span>
                <strong className="text-amber-400 font-mono">{commission}%</strong>
              </div>
              <input
                type="range"
                min="2"
                max="15"
                step="1"
                value={commission}
                onChange={(e) => setCommission(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300 font-semibold">Surge Multiplier:</span>
                <strong className="text-amber-400 font-mono">{surge}x</strong>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.0"
                step="0.1"
                value={surge}
                onChange={(e) => setSurge(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleSavePricingAndTown}
            className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Save Zone Pricing & Town Rules
          </button>
        </div>
      )}

    </div>
  );
};
