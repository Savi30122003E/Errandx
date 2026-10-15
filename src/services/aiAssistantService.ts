import { 
  StructuredErrandDraft, 
  ServiceType, 
  PriceBreakdown, 
  ChecklistItem, 
  ErrandStop, 
  StopStatus, 
  TownZoneType, 
  WhiteLabelConfig 
} from '../types';
import { apiUrl } from './apiConfig';

/**
 * Transparent Rules-Based Price Calculation Engine
 * Retuned for short town distances in Tamil Nadu:
 * - Low base fare (default ₹25)
 * - Flat in-town rate for Town Centre
 * - Distance fee for outer areas (Nearby Areas & Outskirts)
 * - Extra stops fee (up to 5 stops)
 * - Platform fee (5%) and GST (5%)
 */
export function calculateTransparentPrice(
  category: ServiceType,
  urgency: 'flexible' | 'standard' | 'rush' = 'standard',
  zone: TownZoneType = 'town_centre',
  stopsCount: number = 2,
  config?: WhiteLabelConfig
): PriceBreakdown {
  const baseFare = config?.baseFare ?? 25;

  const zoneFees = config?.zoneFees ?? {
    townCentre: 10,
    nearby: 25,
    outskirts: 45
  };

  const zoneName = 
    zone === 'town_centre' 
      ? 'Town Centre (Flat In-Town)' 
      : zone === 'nearby' 
        ? 'Nearby Areas' 
        : 'Outskirts (Outer Area)';

  const zoneFee = 
    zone === 'town_centre' 
      ? zoneFees.townCentre 
      : zone === 'nearby' 
        ? zoneFees.nearby 
        : zoneFees.outskirts;

  // Extra stops beyond the initial pickup + drop (i.e. > 2 stops)
  const extraStopsCount = Math.max(0, stopsCount - 2);
  const extraStopRate = config?.extraStopFee ?? 15;
  const extraStopsFee = extraStopsCount * extraStopRate;

  // Specific service handling / complexity fee
  let complexityFee = 0;
  if (category === 'custom_errands' || category === 'custom') complexityFee = 15;
  if (category === 'farm_produce') complexityFee = 10;
  if (category === 'pooja') complexityFee = 5;

  // Urgency fee
  const urgencySurcharge = urgency === 'rush' ? 20 : urgency === 'flexible' ? -5 : 0;

  const subtotal = Math.max(25, baseFare + zoneFee + extraStopsFee + complexityFee + urgencySurcharge);

  const platformPercent = config?.platformFeePercent ?? 5;
  const gstPercent = config?.taxGstPercent ?? 5;

  const platformFee = Math.round(subtotal * (platformPercent / 100));
  const gstTax = Math.round(subtotal * (gstPercent / 100));
  const totalEstimatedPrice = subtotal + platformFee + gstTax;

  return {
    baseFare,
    zoneName,
    zoneFee,
    distanceKm: zone === 'town_centre' ? 1.5 : zone === 'nearby' ? 3.8 : 7.2,
    distanceRate: zoneFee,
    extraStopsCount,
    extraStopsFee,
    complexityFee,
    urgencySurcharge,
    platformFee,
    gstTax,
    subtotal,
    totalEstimatedPrice
  };
}

/**
 * Heuristic Natural Language Rule-Based Errand Parser
 * Fallback parser supporting both English and Tamil keywords.
 */
export function parseErrandHeuristic(
  input: string, 
  townName: string = 'Your Town',
  config?: WhiteLabelConfig
): StructuredErrandDraft {
  const lower = input.toLowerCase();

  // 1. Detect Category with Tamil & English keywords
  let category: ServiceType = 'custom_errands';
  if (/grocer|vegetable|fruit|milk|egg|tomato|rice|dal|மளிகை|பால்|காய்கறி|முட்டை/i.test(input)) {
    category = 'groceries';
  } else if (/medicine|tablet|pharmacy|doctor|syrup|fever|மருந்த|மாத்திரை|மருத்துவ/i.test(input)) {
    category = 'medicine';
  } else if (/parcel|courier|package|box|deliver|send|keys|பார்சல்|கொரியர்/i.test(input)) {
    category = 'parcel';
  } else if (/pooja|temple|flower|garland|camphor|coconut|பூஜை|கோவில்|மாலை|பூக்கள்|தேங்காய்/i.test(input)) {
    category = 'pooja';
  } else if (/farm|produce|sugarcane|greens|பண்ணை|விவசாய|கரும்பு|இளநீர்/i.test(input)) {
    category = 'farm_produce';
  } else if (/shop|stationery|hardware|tailor|bakery|கடை|பேக்கரி/i.test(input)) {
    category = 'local_shops';
  } else if (/bank|eb|bill|tneb|certificate|taluk|office|மின் கட்டணம்|வங்கி|தாலுகா/i.test(input)) {
    category = 'custom_errands';
  }

  // 2. Extract Requested Time & Urgency
  let urgency: 'flexible' | 'standard' | 'rush' = 'standard';
  let requestedTime = 'Within 2 hours';

  if (/urgent|asap|rush|immediately|fast|அவசரம்|உடனடி/i.test(lower)) {
    urgency = 'rush';
    requestedTime = 'Immediate (Rush within 30 mins)';
  } else if (/by (\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i.test(lower)) {
    const timeMatch = lower.match(/by (\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
    if (timeMatch) requestedTime = `By ${timeMatch[1].toUpperCase()}`;
  } else if (/(\d{1,2})\s*(?:pm|am|மணி)/i.test(lower)) {
    const match = lower.match(/(\d{1,2})\s*(?:pm|am|மணி)/i);
    if (match) requestedTime = `By ${match[0].toUpperCase()}`;
  } else if (/tomorrow|flexible|நாளை|நேரம் உள்ளது/i.test(lower)) {
    urgency = 'flexible';
    requestedTime = 'Flexible today or tomorrow';
  }

  // 3. Extract Budget
  let proposedBudget: number | undefined;
  const budgetMatch = lower.match(/(?:₹|rs\.?|inr|budget|ரூபாய்)\s*(\d{2,5})/i) || lower.match(/(\d{2,5})\s*(?:₹|rs|ரூபாய்)/i);
  if (budgetMatch && budgetMatch[1]) {
    proposedBudget = parseInt(budgetMatch[1], 10);
  }

  // 4. Checklist Items & Quantities
  const items: ChecklistItem[] = [];
  
  if (/milk|பால்/i.test(input) && /medicine|மருந்த/i.test(input)) {
    items.push({ id: 'chk-1', text: 'Medicine / மருந்து', quantity: 'Prescribed', completed: false });
    items.push({ id: 'chk-2', text: 'Fresh Milk / பால்', quantity: '1 Litre', completed: false });
  } else {
    const parts = input
      .split(/,|\band\b|\bமற்றும்\b|\bplus\b/i)
      .map(s => s.trim())
      .filter(s => s.length > 1 && !/^(buy|deliver|pick up|get|bring|drop|home|வாங்கி|கொடுக்கவும்)$/i.test(s));

    if (parts.length > 0) {
      parts.slice(0, 5).forEach((p, idx) => {
        items.push({
          id: `chk-${idx + 1}`,
          text: p,
          completed: false,
          quantity: '1'
        });
      });
    } else {
      items.push({
        id: 'chk-1',
        text: input.slice(0, 50),
        completed: false,
        quantity: '1'
      });
    }
  }

  // 5. Build Multi-Stop Trips (Up to 5 stops)
  const stops: ErrandStop[] = [];

  if (/milk|பால்/i.test(input) && /medicine|மருந்த/i.test(input)) {
    stops.push({
      id: 'stop-1',
      location: `Sample Medical Shop, Market Street, ${townName}`,
      instruction: 'Pick up medicines as prescribed',
      status: 'pending',
      type: 'pickup'
    });
    stops.push({
      id: 'stop-2',
      location: `Sample Grocery Store, Main Bus Stand, ${townName}`,
      instruction: 'Pick up 1 litre fresh milk packet',
      status: 'pending',
      type: 'stop'
    });
    stops.push({
      id: 'stop-3',
      location: `Home Address, ${townName}`,
      instruction: `Deliver all items ${requestedTime}`,
      status: 'pending',
      type: 'drop'
    });
  } else {
    let pickupLoc = `Market Street, ${townName}`;
    if (category === 'medicine') pickupLoc = `Sample Medical Shop, ${townName}`;
    else if (category === 'groceries') pickupLoc = `Sample Grocery Store, ${townName}`;
    else if (category === 'pooja') pickupLoc = `Sample Pooja Store, Town Temple, ${townName}`;
    else if (category === 'parcel') pickupLoc = `Sample Courier Office, ${townName}`;

    stops.push({
      id: 'stop-1',
      location: pickupLoc,
      instruction: `Pick up ${items[0]?.text || 'errand items'}`,
      status: 'pending',
      type: 'pickup'
    });
    stops.push({
      id: 'stop-2',
      location: `Home / Residence, ${townName}`,
      instruction: `Safely deliver items ${requestedTime}`,
      status: 'pending',
      type: 'drop'
    });
  }

  const priceEstimate = calculateTransparentPrice(category, urgency, 'town_centre', stops.length, config);

  return {
    rawDescription: input,
    category,
    title: `${items[0]?.text || 'Errand'} (${townName})`,
    items,
    stops,
    pickupLocation: stops[0]?.location || `Market Street, ${townName}`,
    dropLocation: stops[stops.length - 1]?.location || `Home, ${townName}`,
    selectedZone: 'town_centre',
    urgency,
    preferredTime: requestedTime,
    requestedTime,
    proposedBudget: proposedBudget || priceEstimate.totalEstimatedPrice,
    priceEstimate,
    aiSuggestedFields: ['category', 'items', 'stops', 'urgency', 'priceEstimate'],
    missingEssentialFields: []
  };
}

/**
 * Turns the JSON returned by the AI endpoints into the app's StructuredErrandDraft.
 * Shared by text, photo and voice parsing so all three behave identically.
 */
export function buildDraftFromAiData(
  data: any,
  naturalText: string,
  townName: string = 'Your Town',
  config?: WhiteLabelConfig
): StructuredErrandDraft {
  const category: ServiceType = (data.category as ServiceType) || 'custom_errands';
  const urgency = (data.urgency as 'flexible' | 'standard' | 'rush') || 'standard';

  const items: ChecklistItem[] = (data.items || []).map((it: any, i: number) => ({
    id: it.id || `item-${i + 1}`,
    text: typeof it === 'string' ? it : it.text || it.item || 'Item',
    completed: false,
    quantity: it.quantity || '1',
    notes: it.notes || ''
  }));

  let stops: ErrandStop[] = (data.stops || []).map((st: any, i: number) => ({
    id: st.id || `stop-${i + 1}`,
    location: st.location || `Stop ${i + 1}`,
    instruction: st.instruction || '',
    status: (st.status as StopStatus) || 'pending',
    type: st.type || (i === 0 ? 'pickup' : i === (data.stops.length - 1) ? 'drop' : 'stop')
  }));

  if (stops.length === 0) {
    stops = [
      { id: 'stop-1', location: `Market Street, ${townName}`, instruction: 'Pickup items', status: 'pending', type: 'pickup' },
      { id: 'stop-2', location: `Home Address, ${townName}`, instruction: 'Deliver to home', status: 'pending', type: 'drop' }
    ];
  }

  const priceEstimate = calculateTransparentPrice(category, urgency, 'town_centre', stops.length, config);

  const draft: StructuredErrandDraft = {
    rawDescription: naturalText,
    category,
    title: data.title || `${category.toUpperCase()} Task`,
    items: items.length > 0 ? items : [{ id: 'item-1', text: naturalText, completed: false, quantity: '1' }],
    stops: stops.slice(0, 5),
    pickupLocation: stops[0]?.location || `Market Street, ${townName}`,
    dropLocation: stops[stops.length - 1]?.location || `Home, ${townName}`,
    selectedZone: 'town_centre',
    urgency,
    preferredTime: data.requestedTime || 'Today within 2 hours',
    requestedTime: data.requestedTime || 'Within 2 hours',
    proposedBudget: data.budget || priceEstimate.totalEstimatedPrice,
    priceEstimate,
    aiSuggestedFields: ['category', 'items', 'stops', 'urgency', 'priceEstimate'],
    missingEssentialFields: data.clarifyingQuestion ? ['details'] : [],
    clarificationQuestion: data.clarifyingQuestion || undefined
  };
  return draft;
}

/**
 * AI-Powered Errand Parser invoking the secure server-side endpoint POST /api/parse-errand
 * Never exposes GEMINI_API_KEY to the client bundle.
 */
export async function parseErrandWithAi(
  naturalText: string,
  townName: string = 'Your Town',
  language: 'ta' | 'en' = 'ta',
  config?: WhiteLabelConfig
): Promise<{
  success: boolean;
  draft?: StructuredErrandDraft;
  error?: string;
  message?: string;
}> {
  try {
    const response = await fetch(apiUrl('/api/parse-errand'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: naturalText,
        townName,
        language
      })
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const resJson = await response.json();

    if (!resJson.success) {
      return {
        success: false,
        error: resJson.error || 'SERVER_REJECTED',
        message: resJson.message || 'AI parsing could not be completed.'
      };
    }

    const draft = buildDraftFromAiData(resJson.data, naturalText, townName, config);

    return {
      success: true,
      draft
    };
  } catch (error: any) {
    console.warn('AI Parsing call failed:', error);
    return {
      success: false,
      error: 'API_CALL_FAILED',
      message: error?.message || 'Could not communicate with AI parse endpoint.'
    };
  }
}

/* -------------------------------------------------------------------------- */
/*  Shared helpers for photos and voice clips                                  */
/* -------------------------------------------------------------------------- */

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      resolve(result.includes(',') ? result.split(',')[1] : result);
    };
    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader.readAsDataURL(blob);
  });
}

/** Shrinks big phone photos (4000px+) to ~1280px JPEG so uploads work on weak 4G. */
async function downscaleImage(file: Blob, maxSide = 1280): Promise<{ base64: string; mimeType: string }> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('no canvas');
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
    return { base64: dataUrl.split(',')[1], mimeType: 'image/jpeg' };
  } catch {
    // Fall back to the original file if the browser cannot resize it
    return { base64: await blobToBase64(file), mimeType: file.type || 'image/jpeg' };
  }
}

/**
 * Photo-to-errand: sends a photo of a handwritten list, medicine strip, bill or parcel
 * label to POST /api/parse-errand-image and returns the same draft as text parsing.
 */
export async function parseErrandFromImage(
  imageFile: Blob,
  townName: string = 'Your Town',
  language: 'ta' | 'en' = 'ta',
  config?: WhiteLabelConfig
): Promise<{
  success: boolean;
  draft?: StructuredErrandDraft;
  needsPharmacistVerification?: boolean;
  error?: string;
  message?: string;
}> {
  try {
    const { base64, mimeType } = await downscaleImage(imageFile);
    const response = await fetch(apiUrl('/api/parse-errand-image'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: base64, mimeType, townName, language })
    });
    if (!response.ok && response.status !== 400 && response.status !== 413 && response.status !== 429) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }
    const resJson = await response.json();
    if (!resJson.success) {
      return {
        success: false,
        error: resJson.error || 'SERVER_REJECTED',
        message: resJson.message || 'Could not read the photo.'
      };
    }
    const draft = buildDraftFromAiData(resJson.data, 'Photo errand', townName, config);
    return { success: true, draft, needsPharmacistVerification: Boolean(resJson.data?.needsPharmacistVerification) };
  } catch (error: any) {
    console.warn('Photo parsing failed:', error);
    return {
      success: false,
      error: 'API_CALL_FAILED',
      message: error?.message || 'Could not communicate with the AI photo endpoint.'
    };
  }
}

/**
 * Voice Task Entry helper. Same public API as before, so the assistant screen is unchanged.
 *
 * 1. Where the browser has the Web Speech API (Chrome, Edge, Android Chrome) it is used
 *    exactly as before, Tamil (ta-IN) and Indian English (en-IN).
 * 2. Where it is missing (Android Studio / Capacitor WebView, Firefox, some iOS) it falls
 *    back to recording a short clip with MediaRecorder and transcribing it on the server
 *    through POST /api/transcribe (Gemini). The transcript arrives a moment after the
 *    user taps stop.
 */
export class VoiceRecognitionHelper {
  private recognition: any = null;
  private mode: 'speech' | 'recorder' | 'none' = 'none';
  private lang: 'ta' | 'en';
  public isSupported: boolean = false;

  // recorder-mode state
  private recorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private chunks: Blob[] = [];
  private autoStopTimer: ReturnType<typeof setTimeout> | null = null;

  private static readonly MAX_RECORD_MS = 30_000;

  constructor(initialLang: 'ta' | 'en' = 'ta') {
    this.lang = initialLang;
    if (typeof window === 'undefined') return;

    const SpeechClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechClass) {
      this.recognition = new SpeechClass();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = initialLang === 'ta' ? 'ta-IN' : 'en-IN';
      this.mode = 'speech';
      this.isSupported = true;
    } else if (
      typeof navigator !== 'undefined' &&
      navigator.mediaDevices?.getUserMedia &&
      typeof (window as any).MediaRecorder !== 'undefined'
    ) {
      this.mode = 'recorder';
      this.isSupported = true;
    }
  }

  public setLanguage(lang: 'ta' | 'en') {
    this.lang = lang;
    if (this.recognition) {
      this.recognition.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
    }
  }

  public startListening(
    onResult: (text: string, isFinal: boolean) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ) {
    if (this.mode === 'recorder') {
      void this.startRecording(onResult, onError, onEnd);
      return;
    }

    if (!this.recognition) {
      onError('Speech recognition is not supported in this browser environment.');
      return;
    }

    this.recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      onResult(final || interim, Boolean(final));
    };

    this.recognition.onerror = (event: any) => {
      onError(event.error || 'Microphone capture error');
    };

    this.recognition.onend = () => {
      onEnd();
    };

    try {
      this.recognition.start();
    } catch {
      this.recognition.stop();
    }
  }

  public stopListening() {
    if (this.mode === 'recorder') {
      this.stopRecording();
      return;
    }
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }
  }

  /* ---------------------------- recorder fallback --------------------------- */

  private pickMimeType(): string | undefined {
    const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
    const MR: any = (window as any).MediaRecorder;
    return candidates.find((t) => MR.isTypeSupported?.(t));
  }

  private releaseMic() {
    if (this.autoStopTimer) {
      clearTimeout(this.autoStopTimer);
      this.autoStopTimer = null;
    }
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
  }

  private async startRecording(
    onResult: (text: string, isFinal: boolean) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ) {
    if (this.recorder && this.recorder.state === 'recording') return;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      onError('Microphone permission was denied. Please allow microphone access and try again.');
      onEnd();
      return;
    }

    try {
      const mimeType = this.pickMimeType();
      this.chunks = [];
      this.recorder = mimeType ? new MediaRecorder(this.stream, { mimeType }) : new MediaRecorder(this.stream);
    } catch {
      this.releaseMic();
      onError('Voice recording is not available on this device. Please type your errand.');
      onEnd();
      return;
    }

    const recorder = this.recorder;

    recorder.ondataavailable = (e: BlobEvent) => {
      if (e.data && e.data.size > 0) this.chunks.push(e.data);
    };

    recorder.onstop = async () => {
      this.releaseMic();
      const type = recorder.mimeType || 'audio/webm';
      const blob = new Blob(this.chunks, { type });
      this.chunks = [];
      this.recorder = null;

      if (blob.size < 800) {
        // basically silence / accidental tap
        onEnd();
        return;
      }

      try {
        const audioBase64 = await blobToBase64(blob);
        const response = await fetch(apiUrl('/api/transcribe'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audioBase64, mimeType: type, language: this.lang })
        });
        const resJson = await response.json();
        if (resJson.success && typeof resJson.text === 'string' && resJson.text.trim()) {
          onResult(resJson.text.trim(), true);
        } else if (resJson.error === 'GEMINI_API_KEY_MISSING') {
          onError('Voice transcription needs the AI key on the server. Please type your errand.');
        } else if (!resJson.success) {
          onError(resJson.message || 'Could not understand the recording. Please try again.');
        } else {
          onError('No speech detected. Please try again and speak clearly.');
        }
      } catch {
        onError('Could not reach the server to transcribe your voice. Please check your connection.');
      } finally {
        onEnd();
      }
    };

    recorder.start();
    this.autoStopTimer = setTimeout(() => this.stopRecording(), VoiceRecognitionHelper.MAX_RECORD_MS);
  }

  private stopRecording() {
    if (this.recorder && this.recorder.state !== 'inactive') {
      try {
        this.recorder.stop();
      } catch {
        this.releaseMic();
      }
    } else {
      this.releaseMic();
    }
  }
}
