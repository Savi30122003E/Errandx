import { ServiceItem, LocalPlace, LocalShop, GroceryItem, RideOption, FoodItem, HomeServiceOption } from '../types';

export const TOWN_PLACES: LocalPlace[] = [
  { id: 'p1', nameEn: 'Main Bus Stand', nameTa: 'மெயின் பஸ் நிலையம்', addressEn: 'Bus Stand Circle', addressTa: 'பஸ் ஸ்டாண்ட் ரவுண்டானா' },
  { id: 'p2', nameEn: 'Market Street', nameTa: 'மார்க்கெட் வீதி', addressEn: 'North Market Bazaar', addressTa: 'வடக்கு மார்க்கெட் பஜார்' },
  { id: 'p3', nameEn: 'Railway Station', nameTa: 'ரயில் நிலையம்', addressEn: 'Station Feeder Road', addressTa: 'ஸ்டேஷன் இணைப்புச் சாலை' },
  { id: 'p4', nameEn: 'Town Temple', nameTa: 'ஊர் கோவில்', addressEn: 'Sannathi Street', addressTa: 'சன்னதி வீதி' },
  { id: 'p5', nameEn: 'Government Hospital', nameTa: 'அரசு மருத்துவமனை', addressEn: 'Hospital Main Road', addressTa: 'மருத்துவமனை மெயின் ரோடு' },
  { id: 'p6', nameEn: 'College Road', nameTa: 'கல்லூரி சாலை', addressEn: 'Arts College Junction', addressTa: 'கலைக்கல்லூரி சந்திப்பு' },
  { id: 'p7', nameEn: 'River Bridge', nameTa: 'ஆற்றுப் பாலம்', addressEn: 'Causeway Entrance', addressTa: 'ஆற்றுப்பால முகப்பு' },
  { id: 'p8', nameEn: 'Taluk Office', nameTa: 'தாலுகா அலுவலகம்', addressEn: 'Revenue Court Road', addressTa: 'வருவாய் நீதிமன்ற சாலை' }
];

export const PLACEHOLDER_SHOPS: LocalShop[] = [
  {
    id: 's1',
    nameEn: 'Sample Grocery Store',
    nameTa: 'மாதிரி மளிகைக் கடை',
    categoryEn: 'Groceries & Provisions',
    categoryTa: 'மளிகை & பலசரக்கு',
    locationEn: 'Market Street',
    locationTa: 'மார்க்கெட் வீதி',
    timing: '6:30 AM - 9:30 PM',
    rating: 4.8,
    phone: '+91 94421 00001'
  },
  {
    id: 's2',
    nameEn: 'Sample Medical Shop',
    nameTa: 'மாதிரி மருந்தகம்',
    categoryEn: 'Pharmacy & Healthcare',
    categoryTa: 'மருந்தகம் & முதலுதவி',
    locationEn: 'Near Government Hospital',
    locationTa: 'அரசு மருத்துவமனை அருகில்',
    timing: '24 Hours Emergency',
    rating: 4.9,
    phone: '+91 94421 00002'
  },
  {
    id: 's3',
    nameEn: 'Sample Bakery',
    nameTa: 'மாதிரி பேக்கரி',
    categoryEn: 'Tea, Snacks & Fresh Bakes',
    categoryTa: 'டீ, ஸ்நாக்ஸ் & பேக்கரி',
    locationEn: 'Main Bus Stand',
    locationTa: 'மெயின் பஸ் நிலையம்',
    timing: '6:00 AM - 10:00 PM',
    rating: 4.7,
    phone: '+91 94421 00003'
  },
  {
    id: 's4',
    nameEn: 'Sample Courier Office',
    nameTa: 'மாதிரி கூரியர் நிலையம்',
    categoryEn: 'Parcel Express & Speed Post',
    categoryTa: 'பார்சல் & கூரியர் சேவை',
    locationEn: 'Railway Station Road',
    locationTa: 'ரயில் நிலைய சாலை',
    timing: '9:00 AM - 8:00 PM',
    rating: 4.8,
    phone: '+91 94421 00004'
  },
  {
    id: 's5',
    nameEn: 'Sample Pooja Store',
    nameTa: 'மாதிரி பூஜை ஸ்டோர்',
    categoryEn: 'Temple Pooja & Festive Goods',
    categoryTa: 'கோவில் பூஜை பொருட்கள்',
    locationEn: 'Town Temple Sannathi',
    locationTa: 'ஊர் கோவில் சன்னதி வீதி',
    timing: '5:30 AM - 8:30 PM',
    rating: 4.9,
    phone: '+91 94421 00005'
  }
];

export const TOWN_SERVICES: ServiceItem[] = [
  {
    id: 'groceries',
    title: 'Groceries and daily needs',
    subtitle: 'Milk, rice, oil and daily kitchen provisions.',
    description: 'Procured quickly from neighborhood grocery stores with verified receipt slips.',
    icon: 'ShoppingCart',
    eta: 'Within 30-45 mins',
    startingPrice: '₹25'
  },
  {
    id: 'medicine',
    title: 'Medicine from local pharmacies',
    subtitle: 'Emergency medicines and pharmacy refills.',
    description: 'Delivered directly from licensed chemist shops near Government Hospital.',
    icon: 'Pill',
    eta: 'Within 20-30 mins',
    startingPrice: '₹30'
  },
  {
    id: 'parcel',
    title: 'Parcel and courier',
    subtitle: 'Inter-town pickups and courier drops.',
    description: 'Send keys, documents, lunch carriers, or collect parcels from the local courier office.',
    icon: 'Package',
    eta: 'Flexible timing',
    startingPrice: '₹35'
  },
  {
    id: 'pooja',
    title: 'Pooja and temple items',
    subtitle: 'Garlands, coconuts, camphor and oil.',
    description: 'Fresh pooja supplies directly from temple street vendors for morning or evening worship.',
    icon: 'Sparkles',
    eta: 'Early morning & evening',
    startingPrice: '₹25'
  },
  {
    id: 'farm_produce',
    title: 'Farm and local produce runs',
    subtitle: 'Direct village harvest & seasonal greens.',
    description: 'Tender coconuts, fresh banana leaves, country eggs, and seasonal vegetables from weekly shandy.',
    icon: 'Wheat',
    eta: 'Shandy & morning runs',
    startingPrice: '₹30'
  },
  {
    id: 'local_shops',
    title: 'Local shops',
    subtitle: 'Market Street merchant purchases.',
    description: 'Stationery, electrical spares, tailoring pickup, and hardware items from town merchants.',
    icon: 'Store',
    eta: 'Same day',
    startingPrice: '₹30'
  },
  {
    id: 'custom_errands',
    title: 'Custom errands (bank, EB bill, certificates, taluk office)',
    subtitle: 'Queue waiting & administrative assistance.',
    description: 'Assistance with TNEB bill counters, bank token lines, taluk office paperwork, and certificates.',
    icon: 'FileText',
    eta: 'Official business hours',
    startingPrice: '₹50'
  }
];

// Sample items available in town grocery and shandy runs (Marked Demo data)
export const TOWN_GROCERY_ITEMS: GroceryItem[] = [
  { id: 'tg1', name: 'Aavin Green Standardized Milk (500ml)', weight: '500 ml', price: 24, originalPrice: 24, category: 'Milk & Dairy' },
  { id: 'tg2', name: 'Farm Country Eggs (நாட்டுக்கோழி முட்டை)', weight: '6 pcs', price: 72, originalPrice: 80, category: 'Farm Produce' },
  { id: 'tg3', name: 'Fresh Country Tomatoes (நாட்டு தக்காளி)', weight: '1 kg', price: 28, originalPrice: 35, category: 'Vegetables' },
  { id: 'tg4', name: 'Pure Sesame / Gingelly Oil (நல்லெண்ணெய்)', weight: '500 ml', price: 160, originalPrice: 175, category: 'Oils & Staples' },
  { id: 'tg5', name: 'Traditional Banana Leaves (வாழை இலை கட்டு)', weight: '5 leaves', price: 25, originalPrice: 30, category: 'Pooja & Meals' },
  { id: 'tg6', name: 'Fresh Temple Jasmine Garland (மல்லிகைப் பூ)', weight: '1 garland', price: 40, originalPrice: 50, category: 'Pooja Items' }
];

export const TOWN_WHY_US_FEATURES = [
  {
    icon: 'MapPin',
    key: 'pillar1'
  },
  {
    icon: 'Users',
    key: 'pillar2'
  },
  {
    icon: 'Tag',
    key: 'pillar3'
  },
  {
    icon: 'FileText',
    key: 'pillar4'
  },
  {
    icon: 'Languages',
    key: 'pillar5'
  }
];

// Quick drop suggestions and popular town spots
export const POPULAR_LOCATIONS = [
  { name: 'Main Bus Stand', address: 'Bus Stand Circle' },
  { name: 'Market Street', address: 'North Market Bazaar' },
  { name: 'Railway Station', address: 'Station Feeder Road' },
  { name: 'Town Temple', address: 'Sannathi Street' },
  { name: 'Government Hospital', address: 'Hospital Main Road' },
  { name: 'Taluk Office', address: 'Revenue Court Road' }
];

// Ride category options (Town & local transit)
export const RIDE_OPTIONS: RideOption[] = [
  {
    id: 'bike',
    name: 'Town Bike / Moto',
    capacity: '1 person',
    eta: '5-8 mins',
    price: 35,
    icon: 'Bike',
    description: 'Quick local transit for single passenger or swift parcel pickup'
  },
  {
    id: 'auto',
    name: 'Local Auto Rickshaw',
    capacity: '3 persons',
    eta: '6-10 mins',
    price: 60,
    icon: 'Navigation',
    description: 'Reliable three-wheeler for family or market trips'
  },
  {
    id: 'car',
    name: 'Town Taxi / Mini Cab',
    capacity: '4 persons',
    eta: '10-15 mins',
    price: 150,
    icon: 'Car',
    description: 'Comfortable AC cab for outstation or railway station drops'
  }
];

// Local food & restaurant items (Sample town eateries)
export const FOOD_ITEMS: FoodItem[] = [
  {
    id: 'f1',
    restaurant: 'Sample Bakery & Tea Stall',
    name: 'Masala Chai & Hot Samosa Set',
    rating: 4.8,
    deliveryTime: '15-20 min',
    price: 45,
    category: 'Tea & Snacks'
  },
  {
    id: 'f2',
    restaurant: 'Town Hotel & Mess',
    name: 'Traditional South Indian Meals / Thali',
    rating: 4.9,
    deliveryTime: '25-30 min',
    price: 110,
    category: 'Meals'
  },
  {
    id: 'f3',
    restaurant: 'Bazaar Tiffin Center',
    name: 'Ghee Podi Idli & Crispy Medu Vada (Set)',
    rating: 4.7,
    deliveryTime: '15-25 min',
    price: 65,
    category: 'Tiffin'
  },
  {
    id: 'f4',
    restaurant: 'Market Street Mess',
    name: 'Special Chicken Dum Biryani',
    rating: 4.8,
    deliveryTime: '25-35 min',
    price: 180,
    category: 'Meals'
  },
  {
    id: 'f5',
    restaurant: 'Town Hotel & Mess',
    name: 'Curd Rice with Mango Pickle & Mor Milagai',
    rating: 4.7,
    deliveryTime: '15-20 min',
    price: 55,
    category: 'Tiffin'
  }
];

// Alias for grocery items
export const GROCERY_ITEMS: GroceryItem[] = TOWN_GROCERY_ITEMS;

// Town home repair & assistance options
export const HOME_SERVICES: HomeServiceOption[] = [
  {
    id: 'h1',
    name: 'Electrical Repairs & Fan Servicing',
    duration: '45-60 min',
    price: 199,
    rating: 4.8
  },
  {
    id: 'h2',
    name: 'Plumbing & Tap Leakage Fix',
    duration: '30-45 min',
    price: 179,
    rating: 4.9
  },
  {
    id: 'h3',
    name: 'AC Filter Cleaning & Checkup',
    duration: '60 min',
    price: 349,
    rating: 4.7
  },
  {
    id: 'h4',
    name: 'Home Appliance & Motor Repair',
    duration: '60-90 min',
    price: 249,
    rating: 4.8
  }
];
