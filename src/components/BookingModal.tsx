import React, { useState } from 'react';
import { 
  X, 
  ShoppingCart, 
  Pill, 
  Package, 
  Sparkles, 
  Store, 
  FileText,
  MapPin, 
  Clock, 
  Check, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  ShieldCheck, 
  AlertCircle,
  QrCode
} from 'lucide-react';
import { 
  ServiceType, 
  ActiveBooking, 
  ErrandStop, 
  StopStatus, 
  TownZoneType, 
  WhiteLabelConfig 
} from '../types';
import { TOWN_PLACES, PLACEHOLDER_SHOPS, TOWN_SERVICES } from '../data/mockData';
import { calculateTransparentPrice } from '../services/aiAssistantService';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: ServiceType;
  onBookingConfirmed: (booking: ActiveBooking, preferredPayment?: 'gateway' | 'wallet' | 'cash') => void;
  walletBalance: number;
  onOpenAiAssistant?: () => void;
  appName?: string;
  currencySymbol?: string;
  config?: WhiteLabelConfig;
  fallbackMessage?: string | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialService = 'groceries',
  onBookingConfirmed,
  walletBalance,
  onOpenAiAssistant,
  appName = 'ErrandX',
  currencySymbol = '₹',
  config,
  fallbackMessage
}) => {
  const townName = config?.townName || 'Your Town';

  // Normalize initialService to one of the 7 town services
  const defaultTab: ServiceType = 
    initialService === 'ride' || initialService === 'grocery' ? 'groceries' :
    initialService === 'food' ? 'local_shops' :
    initialService === 'home' || initialService === 'custom' ? 'custom_errands' :
    initialService;

  const [activeTab, setActiveTab] = useState<ServiceType>(defaultTab);
  const [taskTitle, setTaskTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [urgency, setUrgency] = useState<'flexible' | 'standard' | 'rush'>('standard');
  const [selectedZone, setSelectedZone] = useState<TownZoneType>('town_centre');
  const [paymentChoice, setPaymentChoice] = useState<'cod' | 'upi'>('cod');

  // Multi-stop trips state (up to 5 stops)
  const [stops, setStops] = useState<ErrandStop[]>([
    {
      id: 'stop-1',
      location: `${TOWN_PLACES[0].nameEn}, ${townName}`,
      instruction: 'Pick up errand items',
      status: 'pending',
      type: 'pickup'
    },
    {
      id: 'stop-2',
      location: `Home Residence, Market Street, ${townName}`,
      instruction: 'Deliver to customer',
      status: 'pending',
      type: 'drop'
    }
  ]);

  // Items checklist
  const [items, setItems] = useState<{ id: string; text: string; qty: string }[]>([
    { id: 'item-1', text: 'Errand Item / List', qty: '1' }
  ]);

  if (!isOpen) return null;

  // Price Calculation with retuned town pricing engine
  const price = calculateTransparentPrice(activeTab, urgency, selectedZone, stops.length, config);

  // Multi-stop actions
  const handleAddStop = () => {
    if (stops.length >= 5) return;
    const newStop: ErrandStop = {
      id: `stop-${Date.now()}`,
      location: `${TOWN_PLACES[(stops.length) % TOWN_PLACES.length].nameEn}, ${townName}`,
      instruction: 'Additional errand stop',
      status: 'pending',
      type: 'stop'
    };
    setStops([...stops, newStop]);
  };

  const handleRemoveStop = (id: string) => {
    if (stops.length <= 1) return;
    setStops(stops.filter(s => s.id !== id));
  };

  const handleMoveStop = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stops.length) return;
    const updated = [...stops];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setStops(updated);
  };

  const handleStopLocationChange = (id: string, loc: string) => {
    setStops(stops.map(s => s.id === id ? { ...s, location: loc } : s));
  };

  const handleStopInstructionChange = (id: string, inst: string) => {
    setStops(stops.map(s => s.id === id ? { ...s, instruction: inst } : s));
  };

  const handleAddItem = () => {
    setItems([...items, { id: `item-${Date.now()}`, text: '', qty: '1' }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter(it => it.id !== id));
  };

  const handleItemChange = (id: string, field: 'text' | 'qty', val: string) => {
    setItems(items.map(it => it.id === id ? { ...it, [field]: val } : it));
  };

  const handleCreateBooking = () => {
    const randomBookingId = `TSK-${Math.floor(10000 + Math.random() * 90000)}`;
    const randomOtp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const effectiveTitle = taskTitle.trim() || `${TOWN_SERVICES.find(s => s.id === activeTab)?.title || 'Local Errand'} in ${townName}`;
    const pickupLoc = stops[0]?.location || `${TOWN_PLACES[0].nameEn}, ${townName}`;
    const dropLoc = stops[stops.length - 1]?.location || `Home Residence, ${townName}`;

    const newBooking: ActiveBooking = {
      id: randomBookingId,
      serviceType: activeTab,
      serviceName: activeTab.toUpperCase().replace('_', ' '),
      title: effectiveTitle,
      status: 'confirmed',
      driverName: 'Local Task Partner',
      driverPhone: '+91 98401 23456',
      driverRating: 4.95,
      vehicleNumber: 'Two-Wheeler Partner',
      otp: randomOtp,
      eta: urgency === 'rush' ? 15 : 30,
      totalAmount: price.totalEstimatedPrice,
      pickupLocation: pickupLoc,
      dropLocation: dropLoc,
      stops,
      currentStopIndex: 0,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      paymentMethod: paymentChoice === 'cod' ? 'CASH ON DELIVERY (DEFAULT)' : 'SIMULATED UPI (DEMO)',
      customerName: 'Demo Resident',
      customerPhone: '+91 98765 43210',
      itemsList: items.map(it => ({ id: it.id, text: it.text || 'Errand requirement', quantity: it.qty, completed: false })),
      priceBreakdown: {
        ...price,
        isPriceLocked: true
      }
    };

    onBookingConfirmed(newBooking, paymentChoice === 'cod' ? 'cash' : 'gateway');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#111218] border border-amber-400/30 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(250,204,21,0.15)] overflow-hidden my-auto max-h-[94vh] flex flex-col text-left">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#151722]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-neutral-950 font-display font-black text-base flex items-center justify-center">
              X
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">{appName} Town Errand Center</h3>
              <p className="text-xs text-neutral-400">Step-by-step errand dispatcher for {townName}, Tamil Nadu</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAiAssistant && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAiAssistant();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-400/40 text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Errand Assistant</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Friendly Fallback Banner if redirected from AI */}
          {fallbackMessage && (
            <div className="p-3.5 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{fallbackMessage}</span>
            </div>
          )}

          {/* 7 Town Errand Service Tabs */}
          <div>
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
              Select Town Errand Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'groceries' as ServiceType, label: 'Groceries & daily needs', icon: ShoppingCart },
                { id: 'medicine' as ServiceType, label: 'Medicine from pharmacy', icon: Pill },
                { id: 'parcel' as ServiceType, label: 'Parcel and courier', icon: Package },
                { id: 'pooja' as ServiceType, label: 'Pooja and temple items', icon: Sparkles },
                { id: 'farm_produce' as ServiceType, label: 'Farm produce runs', icon: Store },
                { id: 'local_shops' as ServiceType, label: 'Local shops', icon: Store },
                { id: 'custom_errands' as ServiceType, label: 'Custom errands (bank/EB)', icon: FileText }
              ].map(tab => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-neutral-950 font-bold border-amber-400 shadow-md'
                        : 'bg-[#151722] text-neutral-300 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-[11px] leading-tight line-clamp-1">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Errand Title & Instructions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                Errand Title / Summary
              </label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder={`e.g. Buy groceries from Sample Grocery Store`}
                className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                Town Pricing Zone
              </label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value as TownZoneType)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white font-semibold"
              >
                <option value="town_centre">📍 Town Centre (Flat in-town base)</option>
                <option value="nearby">🏘️ Nearby Areas (+₹15 distance fee)</option>
                <option value="outskirts">🚜 Outskirts (+₹35 outer area fee)</option>
              </select>
            </div>
          </div>

          {/* Feature 2: Multi-Stop Trips (Up to 5 stops) */}
          <div className="p-4 rounded-2xl bg-[#141520] border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Multi-Stop Trip Sequence</span>
                  <span className="text-white font-mono">({stops.length}/5 stops)</span>
                </label>
                <p className="text-[11px] text-neutral-400">
                  Select places from {townName} or type custom addresses (add, remove & reorder)
                </p>
              </div>

              {stops.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddStop}
                  className="px-3 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Stop</span>
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {stops.map((stop, idx) => (
                <div 
                  key={stop.id}
                  className="p-3 rounded-xl bg-black/50 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-2"
                >
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 font-mono font-bold text-xs flex items-center justify-center border border-amber-400/30">
                      {idx + 1}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      idx === 0 
                        ? 'bg-emerald-500/20 text-emerald-300' 
                        : idx === stops.length - 1 
                          ? 'bg-amber-500/20 text-amber-300' 
                          : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {idx === 0 ? 'Pickup' : idx === stops.length - 1 ? 'Drop' : `Stop ${idx + 1}`}
                    </span>
                  </div>

                  <div className="flex-1 w-full sm:w-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={stop.location}
                        onChange={(e) => handleStopLocationChange(stop.id, e.target.value)}
                        placeholder="Location in town"
                        list={`places-list-${stop.id}`}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-black/70 border border-white/15 text-xs text-white"
                      />
                      <datalist id={`places-list-${stop.id}`}>
                        {TOWN_PLACES.map(p => (
                          <option key={p.id} value={`${p.nameEn}, ${townName}`} />
                        ))}
                        {PLACEHOLDER_SHOPS.map(s => (
                          <option key={s.id} value={`${s.nameEn}, ${townName}`} />
                        ))}
                      </datalist>
                    </div>

                    <input
                      type="text"
                      value={stop.instruction || ''}
                      onChange={(e) => handleStopInstructionChange(stop.id, e.target.value)}
                      placeholder="Task instructions at this stop"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/70 border border-white/15 text-xs text-neutral-300"
                    />
                  </div>

                  {/* Move & Delete Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveStop(idx, 'up')}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-neutral-400 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === stops.length - 1}
                      onClick={() => handleMoveStop(idx, 'down')}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-neutral-400 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    {stops.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStop(stop.id)}
                        className="p-1 rounded bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 cursor-pointer"
                        title="Remove Stop"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist Items */}
          <div className="p-4 rounded-2xl bg-[#141520] border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Checklist / Items to Collect or Purchase
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500 font-mono w-4">{idx + 1}.</span>
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => handleItemChange(item.id, 'text', e.target.value)}
                    placeholder="e.g. Paracetamol tablets, 1 packet milk, or EB bill card"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={item.qty}
                    onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}
                    placeholder="Qty"
                    className="w-20 px-2 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-amber-300 font-mono"
                  />
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 text-neutral-500 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Transparent Price Breakdown */}
          <div className="p-4 rounded-2xl bg-[#171926] border border-amber-400/30 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div>
                <h5 className="font-display font-bold text-sm text-white">Itemized Errand Rate Breakdown</h5>
                <p className="text-[11px] text-neutral-400">Short town distances with low base fare & zone pricing</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 block uppercase">Total Fare</span>
                <span className="font-display font-black text-xl text-amber-400">
                  {currencySymbol}{price.totalEstimatedPrice}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-neutral-400 block">Base Fare</span>
                <strong className="text-white">{currencySymbol}{price.baseFare}</strong>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-neutral-400 block">Zone Rate</span>
                <strong className="text-white">{currencySymbol}{price.zoneFee}</strong>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-neutral-400 block">Extra Stops</span>
                <strong className="text-white">{currencySymbol}{price.extraStopsFee || 0}</strong>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-neutral-400 block">Urgency</span>
                <strong className="text-white">{currencySymbol}{price.urgencySurcharge}</strong>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-neutral-400 block">Platform (5%)</span>
                <strong className="text-white">{currencySymbol}{price.platformFee}</strong>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-neutral-400 block">GST (5%)</span>
                <strong className="text-white">{currencySymbol}{price.gstTax}</strong>
              </div>
            </div>
          </div>

          {/* Payment Selection: Cash on Delivery & Simulated UPI */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
              Payment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentChoice('cod')}
                className={`p-3 rounded-xl border text-left flex items-start justify-between cursor-pointer transition-colors ${
                  paymentChoice === 'cod'
                    ? 'bg-amber-400/15 border-amber-400 text-white'
                    : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                    <span>Cash on Delivery</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                      Default
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Pay task partner in cash upon task completion</p>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                  paymentChoice === 'cod' ? 'border-amber-400 bg-amber-400 text-neutral-950' : 'border-neutral-600'
                }`}>
                  {paymentChoice === 'cod' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentChoice('upi')}
                className={`p-3 rounded-xl border text-left flex items-start justify-between cursor-pointer transition-colors ${
                  paymentChoice === 'upi'
                    ? 'bg-amber-400/15 border-amber-400 text-white'
                    : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                    <span>Simulated UPI</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono">
                      Demo
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Instant simulated UPI payment to partner escrow</p>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                  paymentChoice === 'upi' ? 'border-amber-400 bg-amber-400 text-neutral-950' : 'border-neutral-600'
                }`}>
                  {paymentChoice === 'upi' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-[#151722] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Fair rates · Task partner reviews errand before acceptance</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateBooking}
              className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs shadow-lg transition-transform active:scale-98 cursor-pointer"
            >
              Dispatch Errand
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
