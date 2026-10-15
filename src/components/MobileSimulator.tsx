import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Car, 
  UtensilsCrossed, 
  ShoppingCart, 
  Package, 
  Pill, 
  Wrench, 
  Home, 
  ReceiptText, 
  Wallet, 
  User, 
  ArrowRight,
  Wifi,
  Battery,
  Signal,
  X,
  CreditCard,
  PlusCircle,
  Tag,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { ServiceType, ActiveBooking, WalletTransaction, UserProfile } from '../types';

interface MobileSimulatorProps {
  onOpenBooking: (service?: ServiceType) => void;
  activeBookings: ActiveBooking[];
  walletBalance: number;
  onAddFunds: (amount: number) => void;
  onClose?: () => void;
  isFloating?: boolean;
  onViewInvoice?: (booking: ActiveBooking) => void;
  onOpenAiAssistant?: () => void;
  appName?: string;
  currencySymbol?: string;
  user?: UserProfile | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  onSwitchRole?: (role: 'customer' | 'partner') => void;
  onOpenPaymentGateway?: (amount?: number) => void;
}

export const MobileSimulator: React.FC<MobileSimulatorProps> = ({
  onOpenBooking,
  activeBookings,
  walletBalance,
  onAddFunds,
  onClose,
  isFloating = false,
  onViewInvoice,
  onOpenAiAssistant,
  appName = 'ErrandX',
  currencySymbol = '₹',
  user,
  onOpenAuth,
  onLogout,
  onSwitchRole,
  onOpenPaymentGateway
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'bookings' | 'wallet' | 'profile'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(500);

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'VGOX50') {
      onAddFunds(50);
      setPromoSuccess(true);
      setPromoCode('');
      setTimeout(() => setPromoSuccess(false), 3000);
    }
  };

  const servicesGrid: { id: ServiceType; label: string; icon: React.ElementType }[] = [
    { id: 'ride', label: 'Ride', icon: Car },
    { id: 'food', label: 'Food', icon: UtensilsCrossed },
    { id: 'grocery', label: 'Grocery', icon: ShoppingCart },
    { id: 'parcel', label: 'Parcel', icon: Package },
    { id: 'medicine', label: 'Medicine', icon: Pill },
    { id: 'home', label: 'Home Services', icon: Wrench },
  ];

  const filteredServices = servicesGrid.filter(s => 
    s.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`relative ${isFloating ? 'max-w-[390px] w-full' : 'w-[370px] sm:w-[390px]'}`}>
      
      {/* Outer Phone Frame */}
      <div className="relative rounded-[48px] bg-[#0c0d12] border-[10px] border-[#1f212a] shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_50px_rgba(250,204,21,0.15)] overflow-hidden flex flex-col h-[780px] select-none text-left">
        
        {/* Dynamic Island / Speaker notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 w-28 h-5 bg-black rounded-full flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-[#151722] ml-auto mr-3 border border-white/10" />
        </div>

        {/* Status Bar */}
        <div className="pt-3 px-7 pb-1 flex justify-between items-center text-[11px] font-semibold text-neutral-300 relative z-30 bg-[#090a0d]">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-neutral-300">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Floating Close Button if presented as drawer / modal */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-9 right-4 z-40 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close preview"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* App Top Bar */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-white/5 bg-[#090a0d] relative z-20">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-extrabold text-2xl tracking-tight text-white">
              VGo<span className="text-amber-400">X</span>
            </span>
            {user && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 capitalize">
                {user.activeRole}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('wallet')}
              className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-amber-300 flex items-center gap-1 hover:border-amber-400/40 transition-colors cursor-pointer"
              title="Open Wallet"
            >
              <span>₹{walletBalance}</span>
            </button>

            {user ? (
              <button 
                onClick={() => setActiveTab('profile')}
                className="w-7 h-7 rounded-full bg-amber-400 text-neutral-950 font-display font-black text-xs flex items-center justify-center shadow cursor-pointer hover:ring-2 hover:ring-amber-400/50 transition-all"
                title={`Profile: ${user.name}`}
              >
                {user.avatar || 'AV'}
              </button>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="px-2 py-1 rounded-lg bg-amber-400 text-neutral-950 text-[10px] font-bold hover:bg-amber-300 transition-colors cursor-pointer shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Main Phone Content Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto bg-[#090a0d] pb-20 scrollbar-none text-neutral-100">
          
          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <div className="p-4 space-y-5 animate-in fade-in duration-150">
              
              {/* Hero Banner with Book Now */}
              <div className="rounded-2xl p-5 bg-gradient-to-br from-[#181923] via-[#14151e] to-[#0e0f17] border border-amber-400/30 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl" />
                
                <div className="relative z-10 space-y-3">
                  <h2 className="font-display font-black text-2xl text-white leading-tight">
                    One App. <br />
                    Every <span className="text-amber-400">Local Service.</span>
                  </h2>
                  <p className="text-xs text-neutral-300 leading-snug">
                    Rides, food, groceries, parcels, medicines and more – everything in one app.
                  </p>

                  <button
                    onClick={() => onOpenBooking('ride')}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Carousel Indicator Dots */}
                <div className="flex justify-center items-center gap-1.5 pt-3">
                  <span className="w-4 h-1.5 rounded-full bg-amber-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#13141c] border border-white/10 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-amber-400 font-medium transition-colors"
                />
              </div>

              {/* AI Voice & Text Errand Assistant Quick Trigger */}
              {onOpenAiAssistant && (
                <button
                  type="button"
                  onClick={onOpenAiAssistant}
                  className="w-full p-2.5 rounded-xl bg-gradient-to-r from-amber-400/20 via-amber-400/10 to-transparent border border-amber-400/40 flex items-center justify-between text-left hover:border-amber-400 transition-all cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-400 text-neutral-950 flex items-center justify-center font-bold">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white group-hover:text-amber-300 block">AI Errand Assistant</span>
                      <span className="text-[10px] text-neutral-400 block">Speak or type your errand naturally</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform mr-1" />
                </button>
              )}

              {/* Quick Service Grid: 2 rows x 3 columns */}
              <div className="grid grid-cols-3 gap-2.5">
                {filteredServices.map((serv) => {
                  const Icon = serv.icon;
                  return (
                    <button
                      key={serv.id}
                      onClick={() => onOpenBooking(serv.id)}
                      className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#14151c] hover:bg-[#1a1c26] border border-white/5 hover:border-amber-400/40 transition-all cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 group-hover:bg-amber-400 group-hover:text-neutral-950 flex items-center justify-center mb-1.5 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-neutral-200 group-hover:text-amber-300 text-center truncate w-full">
                        {serv.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Top Services Showcase with Illustrations matching reference */}
              <div className="space-y-3 pt-1">
                <div className="flex justify-between items-center px-1">
                  <h3 className="font-display font-bold text-sm text-white">Top Services</h3>
                  <button 
                    onClick={() => onOpenBooking('ride')}
                    className="text-xs font-semibold text-amber-400 hover:text-amber-300"
                  >
                    View All
                  </button>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                  {/* Card 1: Ride Booking with Taxi */}
                  <div 
                    onClick={() => onOpenBooking('ride')}
                    className="min-w-[135px] w-[135px] rounded-2xl bg-[#f7eed4] text-neutral-900 p-2.5 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition-transform active:scale-95"
                  >
                    <div className="w-full h-20 rounded-xl overflow-hidden mb-2 bg-neutral-900/5 flex items-center justify-center">
                      <img
                        src="/src/assets/images/vgox_ride_taxi_1791950270548.jpg"
                        alt="Ride Booking Taxi"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <span className="font-display font-bold text-xs text-neutral-900">Ride Booking</span>
                    <span className="text-[10px] text-neutral-600">From ₹39 · 3m ETA</span>
                  </div>

                  {/* Card 2: Food Delivery with Scooter */}
                  <div 
                    onClick={() => onOpenBooking('food')}
                    className="min-w-[135px] w-[135px] rounded-2xl bg-[#f7eed4] text-neutral-900 p-2.5 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition-transform active:scale-95"
                  >
                    <div className="w-full h-20 rounded-xl overflow-hidden mb-2 bg-neutral-900/5 flex items-center justify-center">
                      <img
                        src="/src/assets/images/vgox_delivery_scooter_1791950270914.jpg"
                        alt="Food Delivery Scooter"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <span className="font-display font-bold text-xs text-neutral-900">Food Delivery</span>
                    <span className="text-[10px] text-neutral-600">20-30m · 200+ spots</span>
                  </div>

                  {/* Card 3: Grocery Delivery with Bag */}
                  <div 
                    onClick={() => onOpenBooking('grocery')}
                    className="min-w-[135px] w-[135px] rounded-2xl bg-[#f7eed4] text-neutral-900 p-2.5 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition-transform active:scale-95"
                  >
                    <div className="w-full h-20 rounded-xl overflow-hidden mb-2 bg-neutral-900/5 flex items-center justify-center">
                      <img
                        src="/src/assets/images/vgox_grocery_bag_1791950271633.jpg"
                        alt="Grocery Delivery Bag"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <span className="font-display font-bold text-xs text-neutral-900">Grocery Delivery</span>
                    <span className="text-[10px] text-neutral-600">10m Instant · Fresh</span>
                  </div>
                </div>
              </div>

              {/* Download App Mini Card */}
              <div className="rounded-2xl p-4 bg-gradient-to-r from-neutral-900 to-[#1b1d28] border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-white">Download the VGoX App</h4>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Better experience. More features.</p>
                  <button 
                    onClick={() => onOpenBooking('ride')}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-amber-400 text-neutral-950 font-bold text-[11px]"
                  >
                    Download Now
                  </button>
                </div>
                <div className="w-12 h-16 rounded-xl bg-black border border-amber-400/40 flex items-center justify-center font-display font-black text-amber-400 text-xs">
                  VGoX
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="p-4 space-y-4 animate-in fade-in duration-150">
              <h3 className="font-display font-bold text-base text-white">Your Orders & Bookings</h3>
              
              {activeBookings.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl bg-[#14151c] border border-white/5 space-y-3">
                  <ReceiptText className="w-10 h-10 text-neutral-500 mx-auto" />
                  <p className="text-xs text-neutral-400">No active bookings right now.</p>
                  <button
                    onClick={() => {
                      setActiveTab('home');
                      onOpenBooking('ride');
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs"
                  >
                    Book Your First Service
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeBookings.map((b) => (
                    <div key={b.id} className="p-3.5 rounded-xl bg-[#14151c] border border-amber-400/30 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 font-bold">
                          {b.id}
                        </span>
                        <span className="text-xs font-bold text-amber-400">{currencySymbol}{b.totalAmount}</span>
                      </div>
                      <h4 className="font-bold text-xs text-white">{b.title}</h4>
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-white/5">
                        <span>OTP: <strong className="text-white">{b.otp}</strong></span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-medium">● Pilot Assigned</span>
                          {onViewInvoice && (
                            <button
                              onClick={() => onViewInvoice(b)}
                              className="text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-amber-400/20 text-neutral-300 hover:text-amber-300 font-semibold transition-colors cursor-pointer"
                            >
                              Invoice
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WALLET */}
          {activeTab === 'wallet' && (
            <div className="p-4 space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-neutral-950 shadow-lg space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">VGoX Cash Balance</span>
                <div className="font-display font-black text-3xl">₹{walletBalance}.00</div>
                <p className="text-[11px] opacity-90">Auto-applied for instant 1-tap bookings</p>
              </div>

              {/* Primary Payment Gateway Action */}
              <button
                type="button"
                onClick={() => onOpenPaymentGateway ? onOpenPaymentGateway(500) : onAddFunds(500)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:brightness-110 transition-all cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-neutral-950" />
                <span>Open Payment Gateway (UPI / Cards / Netbanking)</span>
              </button>

              {/* Add Money Quick Buttons */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-neutral-300">Quick Top Up via Gateway</span>
                <div className="grid grid-cols-3 gap-2">
                  {[100, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => onOpenPaymentGateway ? onOpenPaymentGateway(amt) : onAddFunds(amt)}
                      className="py-2 rounded-xl bg-[#14151c] hover:bg-amber-400/20 border border-white/10 hover:border-amber-400/40 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-neutral-300">Have a Promo Coupon?</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Try 'VGOX50'"
                    className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white uppercase font-mono"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-4 py-2 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoSuccess && (
                  <p className="text-[11px] text-emerald-400 font-medium">
                    ✓ ₹50 Added to your VGoX Wallet!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div className="p-4 space-y-4 animate-in fade-in duration-150">
              {user ? (
                <>
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#14151c] border border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400 text-neutral-950 font-display font-extrabold text-lg flex items-center justify-center shadow">
                      {user.avatar || 'AV'}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{user.name}</h4>
                      <p className="text-xs text-neutral-400">{user.phone} · {appName}</p>
                      <span className="text-[10px] text-amber-400 font-semibold capitalize">
                        {user.activeRole === 'partner' ? '⚡ Task Partner Mode' : '🛍️ Customer Account'}
                      </span>
                    </div>
                  </div>

                  {/* Dual Role Switcher on Single Unified Account */}
                  <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">Single-Account Role</span>
                      <span className="text-amber-400 font-mono font-bold capitalize">{user.activeRole}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSwitchRole?.(user.activeRole === 'customer' ? 'partner' : 'customer')}
                      className="w-full py-2 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Switch to {user.activeRole === 'customer' ? 'Task Partner / Pilot Mode' : 'Customer Mode'}</span>
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <button
                      type="button"
                      onClick={() => onOpenPaymentGateway?.(500)}
                      className="w-full p-3 rounded-xl bg-[#14151c] hover:bg-[#1c1d29] border border-white/5 flex justify-between items-center text-neutral-300 text-left cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Payment Gateway & Wallet Top Up</span>
                      </span>
                      <span className="text-amber-400 font-bold">₹{walletBalance}</span>
                    </button>

                    <div className="p-3 rounded-xl bg-[#14151c] border border-white/5 flex justify-between items-center text-neutral-300">
                      <span>Saved Addresses</span>
                      <span className="text-amber-400 font-bold">2 saved</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#14151c] border border-white/5 flex justify-between items-center text-neutral-300">
                      <span>Safety & Trust Score</span>
                      <span className="text-emerald-400 font-bold">★ 4.98 Verified</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={onOpenAuth}
                      className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-bold text-xs transition-colors cursor-pointer border border-white/10"
                    >
                      Switch / Re-authenticate Account
                    </button>
                    <button
                      type="button"
                      onClick={onLogout}
                      className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs transition-colors cursor-pointer border border-red-500/20"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Guest Session</h4>
                    <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                      Sign in or create a new unified account with Phone OTP or Email to book errands and accept tasks.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs cursor-pointer shadow-md transition-colors"
                  >
                    Sign In / Register with OTP
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Bottom Navigation Bar matching reference */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-[#0d0e14] border-t border-white/10 px-6 flex items-center justify-between z-30">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'home' ? 'text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex flex-col items-center gap-1 transition-colors relative cursor-pointer ${
              activeTab === 'bookings' ? 'text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <ReceiptText className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Bookings</span>
            {activeBookings.length > 0 && (
              <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'wallet' ? 'text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Wallet className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Wallet</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'profile' ? 'text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Profile</span>
          </button>
        </div>

      </div>

    </div>
  );
};
