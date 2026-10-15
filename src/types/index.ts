export type ServiceType = 
  | 'groceries'
  | 'medicine'
  | 'parcel'
  | 'pooja'
  | 'farm_produce'
  | 'local_shops'
  | 'custom_errands'
  // Legacy aliases
  | 'ride'
  | 'food'
  | 'grocery'
  | 'home'
  | 'shops'
  | 'custom';

export type Language = 'ta' | 'en';

export type AppRole = 'customer' | 'driver' | 'merchant' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  activeRole: 'customer' | 'partner';
  isPartnerApproved: boolean;
  walletBalance: number;
  savedAddresses: { label: string; address: string }[];
  partnerRating?: number;
  partnerCompletedTasks?: number;
  createdAt: string;
}

export type PaymentGatewayMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'cash';

export interface PaymentGatewayTransaction {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  method: PaymentGatewayMethod;
  status: 'success' | 'processing' | 'failed';
  upiVpa?: string;
  cardLast4?: string;
  cardBrand?: string;
  bankName?: string;
  timestamp: string;
  receiptNumber: string;
}

export type StopStatus = 'pending' | 'done' | 'skipped';

export interface ErrandStop {
  id: string;
  location: string;
  instruction?: string;
  status: StopStatus;
  type?: 'pickup' | 'stop' | 'drop';
}

export type TownZoneType = 'town_centre' | 'nearby' | 'outskirts';

export interface WhiteLabelConfig {
  appName: string;
  tagline: string;
  townName: string;
  city?: string;
  currencySymbol: string;
  platformFeePercent: number;
  surgeMultiplier: number;
  taxGstPercent: number;
  baseFare?: number;
  extraStopFee?: number;
  zoneFees?: {
    townCentre: number;
    nearby: number;
    outskirts: number;
  };
}

export interface LocalPlace {
  id: string;
  nameEn: string;
  nameTa: string;
  addressEn: string;
  addressTa: string;
}

export interface LocalShop {
  id: string;
  nameEn: string;
  nameTa: string;
  categoryEn: string;
  categoryTa: string;
  locationEn: string;
  locationTa: string;
  timing: string;
  rating: number;
  phone: string;
}

export interface ServiceItem {
  id: ServiceType;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  badge?: string;
  eta: string;
  startingPrice: string;
}

export interface RideOption {
  id: string;
  name: string;
  capacity: string;
  eta: string;
  price: number;
  icon: string;
  description: string;
}

export interface FoodItem {
  id: string;
  restaurant: string;
  name: string;
  rating: number;
  deliveryTime: string;
  price: number;
  category: string;
  image?: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  weight: string;
  price: number;
  originalPrice: number;
  category: string;
}

export interface HomeServiceOption {
  id: string;
  name: string;
  duration: string;
  price: number;
  rating: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  quantity?: string;
  notes?: string;
}

export interface PriceBreakdown {
  baseFare: number;
  zoneName?: string;
  zoneFee?: number;
  distanceKm: number;
  distanceRate: number;
  extraStopsCount?: number;
  extraStopsFee?: number;
  complexityFee: number;
  urgencySurcharge: number;
  platformFee: number;
  gstTax: number;
  subtotal: number;
  totalEstimatedPrice: number;
  customerProposedBudget?: number;
  partnerCounterOffer?: number;
  counterOfferNote?: string;
  acceptedFinalPrice?: number;
  isPriceLocked?: boolean;
}

export interface PriceNegotiation {
  id: string;
  taskId: string;
  customerProposedBudget: number;
  partnerCounterOffer?: number;
  partnerNote?: string;
  partnerName?: string;
  status: 'pending' | 'countered' | 'accepted' | 'declined';
  isPriceLocked?: boolean;
  timestamp: string;
}

export interface StructuredErrandDraft {
  rawDescription: string;
  category: ServiceType;
  title: string;
  items: ChecklistItem[];
  stops: ErrandStop[];
  pickupLocation: string;
  dropLocation: string;
  selectedZone?: TownZoneType;
  urgency: 'flexible' | 'standard' | 'rush';
  preferredTime: string;
  requestedTime?: string;
  proposedBudget?: number;
  priceEstimate: PriceBreakdown;
  aiSuggestedFields: string[]; // List of field names that were inferred by AI
  missingEssentialFields: string[]; // Fields needing clarification
  clarificationQuestion?: string;
}

export interface ActiveBooking {
  id: string;
  serviceType: ServiceType;
  serviceName: string;
  title: string;
  status: 'confirmed' | 'assigned' | 'in_transit' | 'completed' | 'cancelled';
  driverName?: string;
  driverPhone?: string;
  driverRating?: number;
  vehicleNumber?: string;
  otp?: string;
  eta: number; // minutes
  totalAmount: number;
  pickupLocation: string;
  dropLocation: string;
  stops?: ErrandStop[];
  currentStopIndex?: number;
  timestamp: string;
  customerName?: string;
  customerPhone?: string;
  paymentMethod?: string;
  itemsList?: ChecklistItem[];
  priceBreakdown?: PriceBreakdown;
  negotiation?: PriceNegotiation;
  paymentTransaction?: PaymentGatewayTransaction;
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  title: string;
  amount: number;
  date: string;
  status: 'success' | 'pending';
}

export interface CommercialLicenseTier {
  id: string;
  name: string;
  targetMarket: string;
  price: string;
  popular?: boolean;
  features: string[];
  deliverables: string[];
}
