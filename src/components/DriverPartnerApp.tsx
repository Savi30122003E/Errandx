import React, { useState } from 'react';
import { 
  Power, 
  MapPin, 
  Navigation, 
  Phone, 
  ShieldCheck, 
  DollarSign, 
  Check, 
  Clock, 
  X,
  AlertCircle,
  TrendingUp,
  Award,
  Send,
  Lock,
  SkipForward
} from 'lucide-react';
import { ActiveBooking, ErrandStop, StopStatus, WhiteLabelConfig } from '../types';

interface DriverPartnerAppProps {
  activeBookings: ActiveBooking[];
  config: WhiteLabelConfig;
  onTripCompleted: (bookingId: string) => void;
  onUpdateBooking?: (booking: ActiveBooking) => void;
}

export const DriverPartnerApp: React.FC<DriverPartnerAppProps> = ({
  activeBookings,
  config,
  onTripCompleted,
  onUpdateBooking
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [driverOtpInput, setDriverOtpInput] = useState('');
  const [tripStarted, setTripStarted] = useState(false);
  const [tripCompletedSuccess, setTripCompletedSuccess] = useState(false);

  // Counteroffer form state
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [counterAmount, setCounterAmount] = useState<number>(0);
  const [counterNote, setCounterNote] = useState('');

  const townName = config.townName || 'Your Town';

  // Take the first active booking as the partner's assigned errand
  const currentJob = activeBookings.find(b => b.status === 'in_transit' || b.status === 'confirmed');

  const handleStartTrip = () => {
    if (!currentJob) return;
    if (driverOtpInput.trim() === currentJob.otp || driverOtpInput.trim() === '5831' || driverOtpInput.length >= 4) {
      setTripStarted(true);
    } else {
      alert(`Please enter the customer's OTP (e.g. ${currentJob.otp || '5831'})`);
    }
  };

  const handleFinishTrip = () => {
    if (!currentJob) return;
    onTripCompleted(currentJob.id);
    setTripCompletedSuccess(true);
    setTripStarted(false);
    setDriverOtpInput('');
    setTimeout(() => setTripCompletedSuccess(false), 4000);
  };

  // Multi-Stop Progress Handlers
  const handleUpdateStopStatus = (stopIndex: number, newStatus: StopStatus) => {
    if (!currentJob || !currentJob.stops) return;
    const updatedStops = currentJob.stops.map((st, idx) => 
      idx === stopIndex ? { ...st, status: newStatus } : st
    );
    const nextIndex = Math.min(updatedStops.length - 1, stopIndex + 1);

    const updatedJob: ActiveBooking = {
      ...currentJob,
      stops: updatedStops,
      currentStopIndex: nextIndex
    };

    if (onUpdateBooking) {
      onUpdateBooking(updatedJob);
    }
  };

  // Partner Counteroffer Handlers
  const handlePartnerAcceptPrice = () => {
    if (!currentJob) return;
    const updatedJob: ActiveBooking = {
      ...currentJob,
      negotiation: {
        id: currentJob.negotiation?.id || `NEG-${Date.now()}`,
        taskId: currentJob.id,
        customerProposedBudget: currentJob.totalAmount,
        status: 'accepted',
        isPriceLocked: true,
        timestamp: 'Just now'
      },
      priceBreakdown: currentJob.priceBreakdown ? {
        ...currentJob.priceBreakdown,
        acceptedFinalPrice: currentJob.totalAmount,
        isPriceLocked: true
      } : undefined
    };
    if (onUpdateBooking) onUpdateBooking(updatedJob);
    setShowCounterForm(false);
  };

  const handleSendCounteroffer = () => {
    if (!currentJob || counterAmount <= 0) return;
    const updatedJob: ActiveBooking = {
      ...currentJob,
      negotiation: {
        id: currentJob.negotiation?.id || `NEG-${Date.now()}`,
        taskId: currentJob.id,
        customerProposedBudget: currentJob.totalAmount,
        partnerCounterOffer: counterAmount,
        partnerNote: counterNote || 'Adjusted for additional road distance or errand handling',
        partnerName: 'Local Task Partner',
        status: 'countered',
        isPriceLocked: false,
        timestamp: 'Just now'
      }
    };
    if (onUpdateBooking) onUpdateBooking(updatedJob);
    setShowCounterForm(false);
  };

  const currentStops = currentJob?.stops || [
    { id: 's1', location: currentJob?.pickupLocation || 'Pickup Point', instruction: 'Pickup', status: 'pending' as StopStatus },
    { id: 's2', location: currentJob?.dropLocation || 'Delivery Point', instruction: 'Drop', status: 'pending' as StopStatus }
  ];
  const activeStopIndex = currentJob?.currentStopIndex ?? 0;
  const isLastStop = activeStopIndex >= currentStops.length - 1;

  return (
    <div className="max-w-md mx-auto my-6 p-4">
      {/* Mobile-styled Phone Container for Partner App */}
      <div className="rounded-[40px] bg-[#0c0d12] border-[8px] border-[#20222c] shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(250,204,21,0.15)] overflow-hidden flex flex-col h-[760px] text-left">
        
        {/* Partner App Header */}
        <div className="p-4 bg-[#14151f] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-neutral-950 font-display font-extrabold flex items-center justify-center text-sm shadow-md">
              TP
            </div>
            <div>
              <h3 className="font-bold text-xs text-white">Local Task Partner</h3>
              <span className="text-[10px] text-neutral-400">Two-Wheeler · {townName} Hub</span>
            </div>
          </div>

          {/* Online/Offline Toggle */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              isOnline
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </button>
        </div>

        {/* Partner Earnings Strip */}
        <div className="p-3.5 bg-[#101117] border-b border-white/5 grid grid-cols-3 gap-2 text-center">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase font-semibold">Today's Earnings</span>
            <div className="font-display font-black text-base text-amber-400">
              {config.currencySymbol}980
            </div>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 uppercase font-semibold">Errands Done</span>
            <div className="font-display font-black text-base text-white">7</div>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 uppercase font-semibold">Rating</span>
            <div className="font-display font-black text-base text-emerald-400">★ 4.95</div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#090a0d] scrollbar-none">
          
          {!isOnline ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neutral-500">
                <Power className="w-8 h-8" />
              </div>
              <h4 className="font-display font-bold text-base text-white">You are offline</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Toggle to online status to start receiving nearby town errand requests in {townName}.
              </p>
              <button
                onClick={() => setIsOnline(true)}
                className="px-6 py-2.5 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs cursor-pointer"
              >
                Go Online
              </button>
            </div>
          ) : tripCompletedSuccess ? (
            <div className="py-16 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center mx-auto shadow-lg">
                <Check className="w-7 h-7" />
              </div>
              <h4 className="font-display font-bold text-lg text-white">Errand Completed & Payment Received!</h4>
              <p className="text-xs text-emerald-400 font-semibold">
                +{config.currencySymbol}{currentJob ? Math.round(currentJob.totalAmount * (1 - (config.platformFeePercent || 5) / 100)) : 120} credited to your partner account
              </p>
              <p className="text-[11px] text-neutral-400">Looking for next nearby errand in {townName}...</p>
            </div>
          ) : currentJob ? (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              
              {/* Job Title & Net Partner Fare */}
              <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    {tripStarted ? 'Errand In Progress' : 'Assigned Town Errand'}
                  </span>
                  <h4 className="font-display font-bold text-sm text-white line-clamp-1">{currentJob.title}</h4>
                  <span className="text-[10px] text-neutral-400">{currentJob.paymentMethod || 'Cash on Delivery'}</span>
                </div>
                <div className="text-right">
                  <span className="font-display font-black text-lg text-amber-400">
                    {config.currencySymbol}{Math.round(currentJob.totalAmount * (1 - (config.platformFeePercent || 5) / 100))}
                  </span>
                  <span className="block text-[9px] text-neutral-400">Net Partner Pay</span>
                </div>
              </div>

              {/* Counteroffer / Price Negotiation Section */}
              <div className="p-3.5 rounded-2xl bg-[#141520] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                    <span>Fare & Negotiation</span>
                  </div>
                  {currentJob.negotiation?.isPriceLocked || currentJob.priceBreakdown?.isPriceLocked ? (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Price Locked ({config.currencySymbol}{currentJob.totalAmount})</span>
                    </span>
                  ) : currentJob.negotiation?.status === 'countered' ? (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">
                      Counteroffer Sent ({config.currencySymbol}{currentJob.negotiation.partnerCounterOffer})
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                      Proposed by Customer
                    </span>
                  )}
                </div>

                {/* Show counteroffer buttons if price is not locked */}
                {!(currentJob.negotiation?.isPriceLocked || currentJob.priceBreakdown?.isPriceLocked) && (
                  <div>
                    {!showCounterForm ? (
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handlePartnerAcceptPrice}
                          className="flex-1 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Price ({config.currencySymbol}{currentJob.totalAmount})</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCounterAmount(currentJob.totalAmount + 25);
                            setShowCounterForm(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-amber-300 font-bold text-xs cursor-pointer"
                        >
                          Send Counteroffer
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 p-3 rounded-xl bg-black/60 border border-amber-400/30">
                        <span className="text-[11px] font-bold text-amber-300 block">Propose Counteroffer to Customer:</span>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={counterAmount}
                            onChange={(e) => setCounterAmount(Number(e.target.value))}
                            className="w-24 px-2.5 py-1 rounded-lg bg-black border border-white/20 text-amber-400 font-bold font-mono text-xs"
                          />
                          <input
                            type="text"
                            value={counterNote}
                            onChange={(e) => setCounterNote(e.target.value)}
                            placeholder="Note (e.g. Extra stop on outer road)"
                            className="flex-1 px-2.5 py-1 rounded-lg bg-black border border-white/20 text-white text-xs"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowCounterForm(false)}
                            className="px-3 py-1 rounded-lg bg-white/5 text-neutral-400 text-xs"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSendCounteroffer}
                            className="px-3 py-1 rounded-lg bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>Send</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Multi-Stop Trip Progress Strip (Feature 2) */}
              <div className="p-3.5 rounded-2xl bg-[#141520] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-amber-400" />
                    <span>Trip Stops ({currentStops.length} Total)</span>
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">
                    Current: Stop {activeStopIndex + 1}
                  </span>
                </div>

                <div className="space-y-2">
                  {currentStops.map((st, i) => (
                    <div 
                      key={st.id || i}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                        i === activeStopIndex
                          ? 'bg-amber-400/10 border-amber-400/50 text-white shadow-sm'
                          : st.status === 'done'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-neutral-400'
                            : 'bg-black/40 border-white/5 text-neutral-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full font-mono text-[10px] font-bold flex items-center justify-center shrink-0 ${
                          st.status === 'done'
                            ? 'bg-emerald-500 text-neutral-950'
                            : i === activeStopIndex
                              ? 'bg-amber-400 text-neutral-950 font-black'
                              : 'bg-white/10 text-neutral-400'
                        }`}>
                          {st.status === 'done' ? '✓' : i + 1}
                        </span>
                        <div>
                          <span className="font-bold text-white block text-xs line-clamp-1">{st.location}</span>
                          <span className="text-[10px] text-neutral-400 block">{st.instruction || 'Errand step'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {i === activeStopIndex && tripStarted && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleUpdateStopStatus(i, 'done')}
                              className="px-2 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-[10px] cursor-pointer"
                            >
                              Done
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStopStatus(i, 'skipped')}
                              className="px-1.5 py-1 rounded bg-white/10 hover:bg-white/20 text-neutral-400 text-[10px] cursor-pointer"
                              title="Skip Stop"
                            >
                              Skip
                            </button>
                          </>
                        )}
                        {st.status === 'done' && (
                          <span className="text-[10px] text-emerald-400 font-bold">Completed</span>
                        )}
                        {st.status === 'skipped' && (
                          <span className="text-[10px] text-neutral-500 font-bold">Skipped</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Contact */}
              <div className="p-3 rounded-xl bg-[#14151f] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Demo Resident (Customer)</span>
                  <span className="text-[11px] text-neutral-400">+91 98765 43210 · ★ 4.95</span>
                </div>
                <a
                  href="tel:+919876543210"
                  className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>

              {/* Start Trip / OTP Verification */}
              {!tripStarted ? (
                <div className="space-y-2.5 p-3.5 rounded-xl bg-[#14151f] border border-amber-400/30">
                  <div>
                    <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                      Enter Customer OTP to Begin
                    </label>
                    <span className="text-[11px] text-neutral-400">Ask the customer for code (Code: {currentJob.otp || '5831'})</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={driverOtpInput}
                      onChange={(e) => setDriverOtpInput(e.target.value)}
                      placeholder={currentJob.otp || '5831'}
                      className="w-28 px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-center font-mono font-bold text-base text-white"
                    />
                    <button
                      onClick={handleStartTrip}
                      className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs cursor-pointer shadow-md"
                    >
                      Verify & Start Errand
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Errand in progress. Complete each stop on your route.</span>
                  </div>

                  <button
                    onClick={handleFinishTrip}
                    className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold text-sm shadow-lg transition-transform active:scale-98 cursor-pointer"
                  >
                    All Stops Done · Complete Errand & Collect Fare
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto animate-pulse">
                <Navigation className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-white">Searching for errands in {townName}...</h4>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto mt-1">
                  You are active in the town network. New errands will alert you here automatically.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Navigation */}
        <div className="p-3 bg-[#101117] border-t border-white/10 flex justify-around text-xs text-neutral-400">
          <span className="text-amber-400 font-bold">Duty Radar</span>
          <span className="hover:text-white cursor-pointer">Town Map</span>
          <span className="hover:text-white cursor-pointer">Earnings</span>
          <span className="hover:text-white cursor-pointer">Profile</span>
        </div>

      </div>
    </div>
  );
};
