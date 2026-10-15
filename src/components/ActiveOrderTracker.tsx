import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  DollarSign,
  Lock,
  Check,
  Ban
} from 'lucide-react';
import { ActiveBooking, ErrandStop } from '../types';

interface ActiveOrderTrackerProps {
  booking: ActiveBooking | null;
  onClose: () => void;
  onCancelBooking: (id: string) => void;
  onAcceptCounteroffer?: (bookingId: string, counterAmount: number) => void;
  onDeclineCounteroffer?: (bookingId: string) => void;
}

export const ActiveOrderTracker: React.FC<ActiveOrderTrackerProps> = ({
  booking,
  onClose,
  onCancelBooking,
  onAcceptCounteroffer,
  onDeclineCounteroffer
}) => {
  const [etaSeconds, setEtaSeconds] = useState(booking ? booking.eta * 60 : 300);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [isCalling, setIsCalling] = useState(false);

  useEffect(() => {
    if (!booking) return;
    setEtaSeconds(booking.eta * 60);

    const interval = setInterval(() => {
      setEtaSeconds((prev) => (prev > 10 ? prev - 1 : 10));
    }, 1000);

    return () => clearInterval(interval);
  }, [booking]);

  if (!booking) return null;

  const minutesLeft = Math.floor(etaSeconds / 60);
  const secondsLeft = etaSeconds % 60;

  const stops = booking.stops || [
    { id: 's1', location: booking.pickupLocation, instruction: 'Pickup', status: 'pending', type: 'pickup' },
    { id: 's2', location: booking.dropLocation, instruction: 'Dropoff', status: 'pending', type: 'drop' }
  ];

  const hasCounteroffer = booking.negotiation && booking.negotiation.status === 'countered';
  const isLocked = booking.negotiation?.isPriceLocked || booking.priceBreakdown?.isPriceLocked;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#111218] border border-amber-400/40 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(250,204,21,0.2)] overflow-hidden text-left my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#151722]">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-white">Live Errand Dispatch</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30">
                  {booking.id}
                </span>
              </div>
              <p className="text-xs text-neutral-400">{booking.title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">

          {/* Counteroffer Proposal Alert (Feature 3) */}
          {hasCounteroffer && booking.negotiation?.partnerCounterOffer && (
            <div className="p-4 rounded-2xl bg-amber-400/15 border-2 border-amber-400/50 space-y-2 animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span>Partner Sent a Counteroffer</span>
                </div>
                <span className="font-display font-black text-lg text-amber-400">
                  ₹{booking.negotiation.partnerCounterOffer}
                </span>
              </div>
              {booking.negotiation.partnerNote && (
                <p className="text-xs text-neutral-300 bg-black/40 p-2 rounded-lg">
                  "{booking.negotiation.partnerNote}"
                </p>
              )}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onAcceptCounteroffer?.(booking.id, booking.negotiation!.partnerCounterOffer!)}
                  className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept Counteroffer (Lock ₹{booking.negotiation.partnerCounterOffer})</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeclineCounteroffer?.(booking.id)}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-300 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Decline</span>
                </button>
              </div>
            </div>
          )}

          {/* Locked Price Badge */}
          {isLocked && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center gap-1.5 font-bold">
                <Lock className="w-3.5 h-3.5" />
                <span>Price Locked: ₹{booking.totalAmount}</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">Agreed by both customer and partner</span>
            </div>
          )}

          {/* Multi-Stop Route Visualization (Feature 2) */}
          <div className="p-4 rounded-2xl bg-[#141520] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Errand Route ({stops.length} Stops)</span>
              </span>
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>ETA {minutesLeft}:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}m</span>
              </div>
            </div>

            <div className="space-y-2">
              {stops.map((st, i) => (
                <div 
                  key={st.id || i}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    st.status === 'done'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : st.status === 'skipped'
                        ? 'bg-neutral-800 text-neutral-400 border-neutral-700'
                        : 'bg-black/50 border-white/5 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-5 h-5 rounded-full font-mono text-[10px] font-bold flex items-center justify-center shrink-0 ${
                      st.status === 'done'
                        ? 'bg-emerald-500 text-neutral-950'
                        : 'bg-amber-400 text-neutral-950'
                    }`}>
                      {st.status === 'done' ? '✓' : i + 1}
                    </span>
                    <div>
                      <span className="font-bold text-white block text-xs">{st.location}</span>
                      <span className="text-[10px] text-neutral-400">{st.instruction || 'Errand step'}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    st.status === 'done'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : st.status === 'skipped'
                        ? 'bg-neutral-700 text-neutral-400'
                        : 'bg-amber-400/20 text-amber-300'
                  }`}>
                    {st.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Task Partner Details Card */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#161722] border border-white/5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center font-display font-extrabold text-lg">
                TP
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-bold text-base text-white">{booking.driverName || 'Local Task Partner'}</h4>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-white/10 text-amber-300">★ {booking.driverRating || 4.95}</span>
                </div>
                <p className="text-xs text-neutral-400">{booking.vehicleNumber || 'Two-Wheeler Partner'} · ErrandX Verified Partner</p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCalling(true);
                setTimeout(() => setIsCalling(false), 4000);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{isCalling ? 'Calling...' : 'Call Partner'}</span>
            </button>
          </div>

          {/* OTP Verification Strip */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-amber-400/10 border border-amber-400/30">
            <div>
              <span className="text-xs font-bold text-amber-300 block uppercase tracking-wider">Start Errand OTP</span>
              <p className="text-[11px] text-neutral-400">Share this code with your task partner at pickup</p>
            </div>
            <div 
              onClick={() => {
                setCopiedOtp(true);
                setTimeout(() => setCopiedOtp(false), 2000);
              }}
              className="font-mono font-black text-2xl text-amber-400 bg-black/60 px-4 py-1.5 rounded-lg border border-amber-400/40 cursor-pointer tracking-widest"
              title="Click to copy"
            >
              {booking.otp || '5831'}
            </div>
          </div>

          {/* Transparent Price Breakdown Summary */}
          {booking.priceBreakdown && (
            <div className="p-3.5 rounded-2xl bg-[#141520] border border-white/5 space-y-2 text-xs">
              <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block">
                Itemized Price Breakdown
              </span>
              <div className="grid grid-cols-2 gap-2 text-neutral-300">
                <div className="flex justify-between">
                  <span>Base fare:</span>
                  <strong className="text-white">₹{booking.priceBreakdown.baseFare}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Zone rate:</span>
                  <strong className="text-white">₹{booking.priceBreakdown.zoneFee || booking.priceBreakdown.distanceRate}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Extra stops:</span>
                  <strong className="text-white">₹{booking.priceBreakdown.extraStopsFee || 0}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Platform fee (5%):</span>
                  <strong className="text-white">₹{booking.priceBreakdown.platformFee}</strong>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%):</span>
                  <strong className="text-white">₹{booking.priceBreakdown.gstTax}</strong>
                </div>
                <div className="flex justify-between text-amber-400 font-bold">
                  <span>Total amount:</span>
                  <span>₹{booking.totalAmount}</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment & Security Badge */}
          <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
            <span>Payment: <strong className="text-white">{booking.paymentMethod || 'Cash on Delivery'}</strong></span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Simulated demo mode</span>
            </span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#151722] border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => onCancelBooking(booking.id)}
            className="text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
          >
            Cancel Errand
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs cursor-pointer"
          >
            Close Tracker
          </button>
        </div>

      </div>
    </div>
  );
};
