import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Mic, 
  MicOff, 
  Send, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Check, 
  Plus, 
  Trash2, 
  HelpCircle, 
  ArrowRight,
  TrendingDown,
  Info,
  Sliders,
  DollarSign,
  ArrowUp,
  ArrowDown,
  QrCode,
  AlertCircle
} from 'lucide-react';
import { 
  StructuredErrandDraft, 
  ServiceType, 
  ActiveBooking, 
  ChecklistItem, 
  ErrandStop, 
  StopStatus, 
  TownZoneType, 
  WhiteLabelConfig 
} from '../types';
import { 
  parseErrandWithAi, 
  calculateTransparentPrice, 
  VoiceRecognitionHelper 
} from '../services/aiAssistantService';
import { TOWN_PLACES } from '../data/mockData';

interface AiErrandAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WhiteLabelConfig;
  onErrandCreated: (booking: ActiveBooking) => void;
  walletBalance: number;
  onOpenManualForm?: (message: string, initialCategory?: ServiceType) => void;
}

const EXAMPLE_PROMPTS = [
  'Buy medicine and 1 litre milk and drop at home by 5 PM',
  'மருந்து வாங்கி வீட்டில் கொடுக்கவும்',
  'Pick up pooja flowers from Town Temple and deliver to College Road before 4 PM',
  'Pay TNEB electricity bill at EB office and bring receipt to Market Street, budget ₹150',
  'Pick up parcel from Sample Courier Office and drop at Taluk Office'
];

export const AiErrandAssistantModal: React.FC<AiErrandAssistantModalProps> = ({
  isOpen,
  onClose,
  config,
  onErrandCreated,
  walletBalance,
  onOpenManualForm
}) => {
  const [inputText, setInputText] = useState('');
  const [voiceLang, setVoiceLang] = useState<'ta' | 'en'>('ta');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);

  const [draft, setDraft] = useState<StructuredErrandDraft | null>(null);
  const [clarificationAnswer, setClarificationAnswer] = useState('');
  
  // Negotiation & Payment State
  const [customBudget, setCustomBudget] = useState<number>(0);
  const [proposeNegotiation, setProposeNegotiation] = useState(false);
  const [negotiationNote, setNegotiationNote] = useState('');
  const [paymentChoice, setPaymentChoice] = useState<'cod' | 'upi'>('cod');

  const voiceHelperRef = useRef<VoiceRecognitionHelper | null>(null);

  useEffect(() => {
    voiceHelperRef.current = new VoiceRecognitionHelper(voiceLang);
    return () => {
      voiceHelperRef.current?.stopListening();
    };
  }, [voiceLang]);

  if (!isOpen) return null;

  const handleToggleVoice = () => {
    if (!voiceHelperRef.current?.isSupported) {
      setSpeechError('Web Speech API is not supported in this browser. Please type your errand.');
      return;
    }

    if (isListening) {
      voiceHelperRef.current.stopListening();
      setIsListening(false);
    } else {
      setSpeechError(null);
      setIsListening(true);
      voiceHelperRef.current.setLanguage(voiceLang);
      voiceHelperRef.current.startListening(
        (transcript) => {
          setInputText(transcript);
        },
        (error) => {
          setSpeechError(error);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
    }
  };

  const handleAnalyzeText = async (textToAnalyze?: string) => {
    const text = textToAnalyze || inputText;
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setSpeechError(null);
    setFallbackNotice(null);

    const result = await parseErrandWithAi(text, config.townName, voiceLang, config);

    setIsAnalyzing(false);

    if (result.success && result.draft) {
      setDraft(result.draft);
      setCustomBudget(result.draft.proposedBudget || result.draft.priceEstimate.totalEstimatedPrice);
    } else {
      // API key missing or failed -> automatically open manual step-by-step task form with friendly message
      const friendlyMessage = result.error === 'GEMINI_API_KEY_MISSING'
        ? 'AI Assistant key not configured on server. Switching to our quick step-by-step form.'
        : 'AI parsing temporarily unavailable. Opening manual errand task form.';

      setFallbackNotice(friendlyMessage);

      setTimeout(() => {
        if (onOpenManualForm) {
          onClose();
          onOpenManualForm(friendlyMessage, 'custom_errands');
        }
      }, 1500);
    }
  };

  const handleApplyClarification = () => {
    if (!draft || !clarificationAnswer.trim()) return;
    const combinedText = `${draft.rawDescription}. Additional details: ${clarificationAnswer}`;
    setInputText(combinedText);
    setClarificationAnswer('');
    handleAnalyzeText(combinedText);
  };

  // Recalculate price when zone, urgency or stops count change
  const updatePrice = (
    updatedCategory: ServiceType,
    updatedUrgency: 'flexible' | 'standard' | 'rush',
    updatedZone: TownZoneType,
    updatedStopsCount: number
  ) => {
    if (!draft) return;
    const newPrice = calculateTransparentPrice(
      updatedCategory,
      updatedUrgency,
      updatedZone,
      updatedStopsCount,
      config
    );
    setDraft({
      ...draft,
      priceEstimate: newPrice,
      proposedBudget: customBudget > 0 ? customBudget : newPrice.totalEstimatedPrice
    });
  };

  // --- Multi-Stop Trip Management (Up to 5 stops) ---
  const handleAddStop = () => {
    if (!draft || draft.stops.length >= 5) return;
    const newStop: ErrandStop = {
      id: `stop-${Date.now()}`,
      location: `Market Street, ${config.townName}`,
      instruction: 'Errand stop',
      status: 'pending',
      type: 'stop'
    };
    const updatedStops = [...draft.stops, newStop];
    setDraft({
      ...draft,
      stops: updatedStops
    });
    updatePrice(draft.category, draft.urgency, draft.selectedZone || 'town_centre', updatedStops.length);
  };

  const handleRemoveStop = (id: string) => {
    if (!draft || draft.stops.length <= 1) return;
    const updatedStops = draft.stops.filter(s => s.id !== id);
    setDraft({
      ...draft,
      stops: updatedStops
    });
    updatePrice(draft.category, draft.urgency, draft.selectedZone || 'town_centre', updatedStops.length);
  };

  const handleMoveStop = (index: number, direction: 'up' | 'down') => {
    if (!draft) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= draft.stops.length) return;

    const updatedStops = [...draft.stops];
    const [moved] = updatedStops.splice(index, 1);
    updatedStops.splice(targetIndex, 0, moved);

    setDraft({
      ...draft,
      stops: updatedStops
    });
  };

  const handleStopLocationChange = (id: string, location: string) => {
    if (!draft) return;
    setDraft({
      ...draft,
      stops: draft.stops.map(s => s.id === id ? { ...s, location } : s)
    });
  };

  const handleStopInstructionChange = (id: string, instruction: string) => {
    if (!draft) return;
    setDraft({
      ...draft,
      stops: draft.stops.map(s => s.id === id ? { ...s, instruction } : s)
    });
  };

  const handleStopStatusChange = (id: string, status: StopStatus) => {
    if (!draft) return;
    setDraft({
      ...draft,
      stops: draft.stops.map(s => s.id === id ? { ...s, status } : s)
    });
  };

  // --- Checklist Items Management ---
  const handleAddItem = () => {
    if (!draft) return;
    const newItem: ChecklistItem = {
      id: `item-${Date.now()}`,
      text: 'New item to buy or collect',
      quantity: '1',
      completed: false
    };
    setDraft({
      ...draft,
      items: [...draft.items, newItem]
    });
  };

  const handleRemoveItem = (id: string) => {
    if (!draft) return;
    setDraft({
      ...draft,
      items: draft.items.filter(it => it.id !== id)
    });
  };

  const handleItemTextChange = (id: string, text: string) => {
    if (!draft) return;
    setDraft({
      ...draft,
      items: draft.items.map(it => it.id === id ? { ...it, text } : it)
    });
  };

  const handleItemQtyChange = (id: string, quantity: string) => {
    if (!draft) return;
    setDraft({
      ...draft,
      items: draft.items.map(it => it.id === id ? { ...it, quantity } : it)
    });
  };

  // Confirm Order Execution
  const handleConfirmAndPost = () => {
    if (!draft) return;

    const randomId = `TSK-${Math.floor(10000 + Math.random() * 90000)}`;
    const randomOtp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const finalAmount = proposeNegotiation && customBudget > 0 
      ? customBudget 
      : draft.priceEstimate.totalEstimatedPrice;

    const firstStopLoc = draft.stops[0]?.location || draft.pickupLocation || `Market Street, ${config.townName}`;
    const lastStopLoc = draft.stops[draft.stops.length - 1]?.location || draft.dropLocation || `Home, ${config.townName}`;

    const newBooking: ActiveBooking = {
      id: randomId,
      serviceType: draft.category,
      serviceName: draft.category.toUpperCase().replace('_', ' '),
      title: draft.title,
      status: 'confirmed',
      driverName: 'Local Task Partner',
      driverPhone: '+91 98401 23456',
      driverRating: 4.95,
      vehicleNumber: 'Two-Wheeler Partner',
      otp: randomOtp,
      eta: draft.urgency === 'rush' ? 15 : 30,
      totalAmount: finalAmount,
      pickupLocation: firstStopLoc,
      dropLocation: lastStopLoc,
      stops: draft.stops,
      currentStopIndex: 0,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: 'Demo Resident',
      customerPhone: '+91 98765 43210',
      paymentMethod: paymentChoice === 'cod' ? 'CASH ON DELIVERY (DEFAULT)' : 'SIMULATED UPI (DEMO)',
      itemsList: draft.items,
      priceBreakdown: {
        ...draft.priceEstimate,
        customerProposedBudget: proposeNegotiation ? customBudget : undefined,
        acceptedFinalPrice: finalAmount,
        isPriceLocked: !proposeNegotiation
      },
      negotiation: proposeNegotiation ? {
        id: `NEG-${Date.now()}`,
        taskId: randomId,
        customerProposedBudget: customBudget,
        partnerName: 'Local Task Partner',
        partnerNote: negotiationNote || 'Happy to fulfill your errand promptly',
        status: 'pending',
        isPriceLocked: false,
        timestamp: 'Just now'
      } : undefined
    };

    onErrandCreated(newBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0f1016] border border-amber-400/40 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(250,204,21,0.2)] overflow-hidden my-auto max-h-[94vh] flex flex-col text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#141520]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-neutral-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-lg text-white">AI Errand Assistant</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30 font-bold uppercase">
                  Gemini 3.8 Flash (Server-Side)
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Speak in Tamil or English — extracts items, quantities, multi-stop trips, and town pricing
              </p>
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

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

          {/* Friendly Fallback Notice */}
          {fallbackNotice && (
            <div className="p-4 rounded-2xl bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs flex items-center gap-2.5 animate-pulse">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{fallbackNotice}</span>
            </div>
          )}
          
          {/* Input Box with Voice & Prompt Suggestions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                <span>Describe Your Errand / பணியை விவரிக்கவும்</span>
              </label>

              {/* Language Switcher for Voice & Text */}
              <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded-lg border border-white/10">
                <button
                  type="button"
                  onClick={() => setVoiceLang('ta')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    voiceLang === 'ta' ? 'bg-amber-400 text-neutral-950' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  தமிழ் (ta-IN)
                </button>
                <button
                  type="button"
                  onClick={() => setVoiceLang('en')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    voiceLang === 'en' ? 'bg-amber-400 text-neutral-950' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  English (en-IN)
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea
                rows={3}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  voiceLang === 'ta'
                    ? "உதாரணம்: 'மருந்து மற்றும் 1 லிட்டர் பால் வாங்கி மாலை 5 மணிக்குள் வீட்டில் சேர்க்கவும்...'"
                    : "e.g. 'Buy medicine and 1 litre milk and drop at home by 5 PM, budget ₹250...'"
                }
                className="w-full pl-4 pr-24 py-3 rounded-2xl bg-black/60 border border-white/15 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors font-medium resize-none"
              />

              {/* Action Buttons inside Textarea */}
              <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
                {/* Voice Input Button (Web Speech API) */}
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse shadow-lg ring-2 ring-red-400/50'
                      : 'bg-white/10 text-neutral-300 hover:text-amber-400 hover:bg-white/15'
                  }`}
                  title={isListening ? 'Stop listening' : `Start voice recognition (${voiceLang === 'ta' ? 'தமிழ்' : 'English'})`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Parse Button */}
                <button
                  type="button"
                  onClick={() => handleAnalyzeText()}
                  disabled={isAnalyzing || !inputText.trim()}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center gap-1 transition-all disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {isAnalyzing ? (
                    <span className="animate-spin text-xs">●</span>
                  ) : (
                    <>
                      <span>Parse</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Speech status / error toast */}
            {speechError && (
              <p className="text-xs text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{speechError}</span>
              </p>
            )}

            {isListening && (
              <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-pulse">
                <Mic className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Listening in {voiceLang === 'ta' ? 'தமிழ் (ta-IN)' : 'English (en-IN)'}... Speak your errand clearly into the microphone.</span>
              </p>
            )}

            {/* Quick Example Prompt Chips */}
            <div className="pt-1">
              <span className="text-[11px] text-neutral-400 font-semibold block mb-1.5">Try an example errand:</span>
              <div className="flex flex-wrap gap-1.5">
                {EXAMPLE_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInputText(prompt);
                      handleAnalyzeText(prompt);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-400/15 text-neutral-300 hover:text-amber-300 border border-white/5 transition-colors cursor-pointer text-left"
                  >
                    "{prompt.slice(0, 50)}..."
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Extracted Structured Errand Draft Review */}
          {draft && (
            <div className="space-y-6 pt-3 border-t border-white/10 animate-in fade-in duration-200">
              
              {/* Clarifying Question Alert if essential info is missing */}
              {draft.clarificationQuestion && (
                <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>AI Assistant Clarification Question:</span>
                  </div>
                  <p className="text-xs text-white">{draft.clarificationQuestion}</p>
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={clarificationAnswer}
                      onChange={(e) => setClarificationAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={handleApplyClarification}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs cursor-pointer"
                    >
                      Update Draft
                    </button>
                  </div>
                </div>
              )}

              {/* Review & Edit Banner */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-sm text-white flex items-center gap-2">
                    <span>Structured Task Draft</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      Editable Before Confirmation
                    </span>
                  </h4>
                  <p className="text-[11px] text-neutral-400">Review every extracted field below. You can adjust items, stops, and budget.</p>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse" />
                  <span>AI Inferred</span>
                </div>
              </div>

              {/* Category, Zone, and Urgency Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Category */}
                <div className="p-3.5 rounded-2xl bg-[#141520] border border-white/5 space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Service Category
                  </label>
                  <select
                    value={draft.category}
                    onChange={(e) => {
                      const newCat = e.target.value as ServiceType;
                      setDraft({ ...draft, category: newCat });
                      updatePrice(newCat, draft.urgency, draft.selectedZone || 'town_centre', draft.stops.length);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white font-semibold"
                  >
                    <option value="groceries">🛒 Groceries & daily needs</option>
                    <option value="medicine">💊 Medicine from pharmacies</option>
                    <option value="parcel">📦 Parcel and courier</option>
                    <option value="pooja">🪔 Pooja & temple items</option>
                    <option value="farm_produce">🌾 Farm produce runs</option>
                    <option value="local_shops">🏪 Local shops</option>
                    <option value="custom_errands">⚡ Custom errands (bank/EB)</option>
                  </select>
                </div>

                {/* Town Pricing Zone */}
                <div className="p-3.5 rounded-2xl bg-[#141520] border border-white/5 space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Town Pricing Zone
                  </label>
                  <select
                    value={draft.selectedZone || 'town_centre'}
                    onChange={(e) => {
                      const newZone = e.target.value as TownZoneType;
                      setDraft({ ...draft, selectedZone: newZone });
                      updatePrice(draft.category, draft.urgency, newZone, draft.stops.length);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white font-semibold"
                  >
                    <option value="town_centre">📍 Town Centre (Flat In-Town)</option>
                    <option value="nearby">🏘️ Nearby Areas (+₹15)</option>
                    <option value="outskirts">🚜 Outskirts (+₹35)</option>
                  </select>
                </div>

                {/* Schedule & Urgency */}
                <div className="p-3.5 rounded-2xl bg-[#141520] border border-white/5 space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Urgency & Timing
                  </label>
                  <div className="flex gap-1.5">
                    {(['standard', 'rush', 'flexible'] as const).map((urg) => (
                      <button
                        key={urg}
                        type="button"
                        onClick={() => {
                          setDraft({ ...draft, urgency: urg });
                          updatePrice(draft.category, urg, draft.selectedZone || 'town_centre', draft.stops.length);
                        }}
                        className={`flex-1 py-1 rounded-lg text-[10px] font-bold capitalize transition-colors cursor-pointer ${
                          draft.urgency === urg
                            ? 'bg-amber-400 text-neutral-950 font-black'
                            : 'bg-black/40 text-neutral-400 border border-white/5'
                        }`}
                      >
                        {urg}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={draft.requestedTime || draft.preferredTime}
                    onChange={(e) => setDraft({ ...draft, requestedTime: e.target.value, preferredTime: e.target.value })}
                    placeholder="Requested time (e.g. By 5 PM)"
                    className="w-full px-2 py-1 rounded-lg bg-black/60 border border-white/10 text-[11px] text-white"
                  />
                </div>
              </div>

              {/* Feature 2: Multi-Stop Trips (Support up to 5 stops) */}
              <div className="p-4 rounded-2xl bg-[#141520] border border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>Multi-Stop Trip Sequence</span>
                      <span className="text-white font-mono">({draft.stops.length}/5 stops)</span>
                    </label>
                    <p className="text-[11px] text-neutral-400">Add, remove, reorder, and set status for each stop</p>
                  </div>

                  {draft.stops.length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddStop}
                      className="px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Stop</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2.5">
                  {draft.stops.map((stop, idx) => (
                    <div 
                      key={stop.id} 
                      className="p-3 rounded-xl bg-black/50 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-2.5"
                    >
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 font-mono font-bold text-xs flex items-center justify-center border border-amber-400/30">
                          {idx + 1}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          idx === 0 
                            ? 'bg-emerald-500/20 text-emerald-300' 
                            : idx === draft.stops.length - 1 
                              ? 'bg-amber-500/20 text-amber-300' 
                              : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {idx === 0 ? 'Pickup' : idx === draft.stops.length - 1 ? 'Final Drop' : `Stop ${idx + 1}`}
                        </span>
                      </div>

                      {/* Location Input & Suggestion dropdown */}
                      <div className="flex-1 w-full sm:w-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={stop.location}
                          onChange={(e) => handleStopLocationChange(stop.id, e.target.value)}
                          placeholder="Stop location in town"
                          className="px-2.5 py-1.5 rounded-lg bg-black/70 border border-white/15 text-xs text-white"
                        />
                        <input
                          type="text"
                          value={stop.instruction || ''}
                          onChange={(e) => handleStopInstructionChange(stop.id, e.target.value)}
                          placeholder="Task at this stop (e.g. buy medicine)"
                          className="px-2.5 py-1.5 rounded-lg bg-black/70 border border-white/15 text-xs text-neutral-300"
                        />
                      </div>

                      {/* Stop Status Selector */}
                      <select
                        value={stop.status}
                        onChange={(e) => handleStopStatusChange(stop.id, e.target.value as StopStatus)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border cursor-pointer ${
                          stop.status === 'done'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : stop.status === 'skipped'
                              ? 'bg-neutral-800 text-neutral-400 border-neutral-700'
                              : 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="done">Done</option>
                        <option value="skipped">Skipped</option>
                      </select>

                      {/* Reorder and Delete Buttons */}
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
                          disabled={idx === draft.stops.length - 1}
                          onClick={() => handleMoveStop(idx, 'down')}
                          className="p-1 rounded bg-white/5 hover:bg-white/10 text-neutral-400 disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        {draft.stops.length > 1 && (
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

              {/* Checklist Items Extracted */}
              <div className="p-4 rounded-2xl bg-[#141520] border border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Checklist Items & Quantities</span>
                    <span className="text-amber-400">({draft.items.length})</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {draft.items.map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500 font-mono w-4">{idx + 1}.</span>
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => handleItemTextChange(item.id, e.target.value)}
                        placeholder="Item name"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={item.quantity || ''}
                        onChange={(e) => handleItemQtyChange(item.id, e.target.value)}
                        placeholder="Qty (e.g. 1L, 2kg)"
                        className="w-24 px-2 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-amber-300 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature 3: Transparent Pricing Engine & Counteroffer */}
              <div className="p-5 rounded-2xl bg-[#171926] border border-amber-400/30 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <h5 className="font-display font-bold text-sm text-white flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-amber-400" />
                      <span>Transparent Town Price Breakdown</span>
                    </h5>
                    <p className="text-[11px] text-neutral-400">
                      Low base fare ({config.currencySymbol}{draft.priceEstimate.baseFare}) + {draft.priceEstimate.zoneName} + multi-stop trip rate
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 block uppercase font-semibold">Total Estimated Fare</span>
                    <span className="font-display font-black text-2xl text-amber-400">
                      {config.currencySymbol}{draft.priceEstimate.totalEstimatedPrice}
                    </span>
                  </div>
                </div>

                {/* Itemized Price Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-neutral-400 block">Base Fare</span>
                    <strong className="text-white">{config.currencySymbol}{draft.priceEstimate.baseFare}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-neutral-400 block">Zone Rate</span>
                    <strong className="text-white">{config.currencySymbol}{draft.priceEstimate.zoneFee}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-neutral-400 block">Extra Stops ({draft.priceEstimate.extraStopsCount || 0})</span>
                    <strong className="text-white">{config.currencySymbol}{draft.priceEstimate.extraStopsFee || 0}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-neutral-400 block">Urgency</span>
                    <strong className="text-white">{config.currencySymbol}{draft.priceEstimate.urgencySurcharge}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-neutral-400 block">Platform (5%)</span>
                    <strong className="text-white">{config.currencySymbol}{draft.priceEstimate.platformFee}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-neutral-400 block">GST (5%)</span>
                    <strong className="text-white">{config.currencySymbol}{draft.priceEstimate.gstTax}</strong>
                  </div>
                </div>

                {/* Budget Proposal & Counteroffer Toggle */}
                <div className="pt-2 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-200">
                      <input
                        type="checkbox"
                        checked={proposeNegotiation}
                        onChange={(e) => setProposeNegotiation(e.target.checked)}
                        className="rounded border-white/20 text-amber-400 focus:ring-0"
                      />
                      <span>Propose custom budget / allow partner counteroffer</span>
                    </label>
                    <span className="text-[10px] text-emerald-400 font-medium">Price locked once accepted</span>
                  </div>

                  {proposeNegotiation && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-black/50 border border-white/10">
                      <div className="space-y-1">
                        <label className="text-[11px] text-neutral-400 block">Your Proposed Budget ({config.currencySymbol})</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="25"
                            max="2000"
                            value={customBudget}
                            onChange={(e) => setCustomBudget(Number(e.target.value))}
                            className="w-32 px-3 py-1.5 rounded-lg bg-black border border-white/20 font-bold text-amber-400 font-mono text-sm"
                          />
                          <span className="text-xs text-neutral-400">
                            {customBudget < draft.priceEstimate.totalEstimatedPrice ? (
                              <span className="text-emerald-400 font-medium">-{config.currencySymbol}{draft.priceEstimate.totalEstimatedPrice - customBudget} off</span>
                            ) : (
                              <span>+{config.currencySymbol}{customBudget - draft.priceEstimate.totalEstimatedPrice} incentive</span>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-neutral-400 block">Note for Task Partner (Optional)</label>
                        <input
                          type="text"
                          value={negotiationNote}
                          onChange={(e) => setNegotiationNote(e.target.value)}
                          placeholder="e.g. Flexible on timing, please confirm"
                          className="w-full px-3 py-1.5 rounded-lg bg-black border border-white/20 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Options: Cash on Delivery (default) & Simulated UPI (Demo) */}
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block">
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
                        <p className="text-[10px] text-neutral-400 mt-0.5">Pay local task partner directly upon completion</p>
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
                        <p className="text-[10px] text-neutral-400 mt-0.5">Simulated UPI transfer to task partner (demo mode)</p>
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

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-[#141520] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Never auto-debited · Order dispatched only upon your confirmation</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmAndPost}
              disabled={!draft}
              className="w-1/2 sm:w-auto flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm shadow-[0_2px_15px_rgba(250,204,21,0.4)] transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              <span>Confirm & Dispatch Task</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
