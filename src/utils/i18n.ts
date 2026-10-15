import { Language } from '../types';

const LANG_KEY = 'errandx_selected_language';

export const getStoredLanguage = (): Language => {
  if (typeof window === 'undefined') return 'ta';
  const stored = localStorage.getItem(LANG_KEY);
  if (stored === 'en' || stored === 'ta') return stored;
  // Tamil is the default as requested
  return 'ta';
};

export const setStoredLanguage = (lang: Language): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LANG_KEY, lang);
  }
};

export const TRANSLATIONS = {
  en: {
    appName: 'ErrandX',
    tagline: 'One app. Every local errand in your town.',
    subTagline: 'Connect with local task partners in {townName} for groceries, medical supplies, farm produce, pooja items, parcel pickup, and government/EB bill errands.',
    demoBadge: 'Demo mode · Simulated orders & partners',
    demoData: 'Demo data',
    nav: {
      home: 'Home',
      services: 'Services',
      about: 'About Us',
      howItWorks: 'How It Works',
      localShops: 'Local Shops',
      contact: 'Contact',
      postErrand: 'Post an Errand',
      bookNow: 'Book Now',
      signIn: 'Sign In / Register',
      signOut: 'Sign Out',
      partnerMode: 'Switch to Partner Mode',
      customerMode: 'Switch to Customer Mode',
      wallet: 'ErrandX Wallet',
      topUp: 'Top Up',
      mobilePreview: 'Mobile View',
      fullPortal: 'Web Portal',
      dualView: 'Dual View',
    },
    hero: {
      pill: 'Hyperlocal errands in {townName}, Tamil Nadu',
      title1: 'One app.',
      title2: 'Every local errand in your town.',
      desc: 'ErrandX connects people in {townName} with trusted local task partners for daily needs, pharmacy medicines, temple pooja items, farm fresh produce, and town office runs.',
      postBtn: 'Post Errand Now',
      aiBtn: 'AI Errand Assistant',
      howBtn: 'How It Works',
      stats: {
        errands: 'Town Errands',
        partners: 'Task Partners',
        satisfaction: 'Community Trust'
      }
    },
    services: {
      heading: 'Town Errand Categories',
      subheading: 'Reliable local service assistance tailored for {townName}',
      groceries: {
        title: 'Groceries and daily needs',
        desc: 'Milk, provisions, vegetables, cooking oils, and household essentials from trusted local grocery stores.',
        startingPrice: '₹25'
      },
      medicine: {
        title: 'Medicine from local pharmacies',
        desc: 'Prescription medicines, refills, fever/cold tablets, and first aid from licensed medical shops in {townName}.',
        startingPrice: '₹30'
      },
      parcel: {
        title: 'Parcel and courier',
        desc: 'Pick up or drop documents, keys, lunch tiffins, and parcels across {townName} or to the courier office.',
        startingPrice: '₹35'
      },
      pooja: {
        title: 'Pooja and temple items',
        desc: 'Fresh flowers, garland, camphor, coconuts, pooja oil, and prasad for home rituals or Town Temple darshan.',
        startingPrice: '₹25'
      },
      farm_produce: {
        title: 'Farm and local produce runs',
        desc: 'Direct from nearby village farms: fresh sugarcane, plantain leaves, seasonal greens, tender coconuts, and country eggs.',
        startingPrice: '₹30'
      },
      local_shops: {
        title: 'Local shops',
        desc: 'Support local merchants: stationery, hardware, tailoring, bakery snacks, and town market goods.',
        startingPrice: '₹30'
      },
      custom_errands: {
        title: 'Custom errands (bank, EB bill, certificates, taluk office)',
        desc: 'Queue assistance, TNEB electricity bill payment, bank token waiting, ration card, certificates, and taluk office paperwork.',
        startingPrice: '₹50'
      }
    },
    shopsBanner: {
      title: 'Local shops and partners',
      subtitle: 'Sample businesses registered to fulfill errands in {townName}',
      badge: 'Demo data · Registered local partners'
    },
    whyUs: {
      title: 'Why {townName} Chooses ErrandX',
      subtitle: 'Designed specifically for small towns and rural taluks across Tamil Nadu',
      pillar1Title: 'Town-Centric Network',
      pillar1Desc: 'Tailored for local geography—from Main Bus Stand and Market Street to Town Temple and Taluk Office.',
      pillar2Title: 'Trusted Neighbors',
      pillar2Desc: 'Task partners are verified residents from your own town who know every street and lane.',
      pillar3Title: 'Clear Fair Pricing',
      pillar3Desc: 'No hidden surge pricing. Transparent errand charges starting at just ₹25-₹50.',
      pillar4Title: 'Custom Local Errands',
      pillar4Desc: 'EB electricity bill payments, bank token queues, ration shop runs, and taluk office document submissions.',
      pillar5Title: 'Tamil & English Support',
      pillar5Desc: 'Fully usable in pure, accessible Tamil (தமிழ்) and English on any smartphone.'
    },
    footer: {
      tagline: 'One app. Every local errand in your town.',
      location: '{townName}, Tamil Nadu',
      contactTitle: 'Contact & Administration',
      nameLabel: 'Operator:',
      phoneLabel: 'Phone:',
      emailLabel: 'Email:',
      linksTitle: 'Quick Links',
      servicesTitle: 'Errand Services',
      disclaimer: 'ErrandX is a town-level community platform. All transaction records and task pilot profiles shown here are simulated for demo and evaluation purposes.',
      rights: 'All rights reserved. Town-based local services platform.'
    },
    actions: {
      confirmDispatch: 'Confirm & Dispatch Errand',
      cancel: 'Cancel',
      selectLocation: 'Select Town Location',
      pickupLocation: 'Pickup Location / Shop',
      dropLocation: 'Delivery Address in {townName}',
      budget: 'Proposed Partner Fee',
      notes: 'Instructions for Task Partner',
      demoSimulatedNotice: 'Demo mode: payments and tasks are simulated.',
      callPartner: 'Call Partner',
      trackLive: 'Track Errand',
      viewInvoice: 'View Invoice',
      close: 'Close',
      save: 'Save Changes'
    },
    status: {
      confirmed: 'Confirmed',
      assigned: 'Partner Assigned',
      in_transit: 'In Transit',
      completed: 'Completed',
      cancelled: 'Cancelled'
    }
  },
  ta: {
    appName: 'ErrandX',
    tagline: 'உங்கள் ஊரின் அனைத்து உள்ளூர் பணிகளுக்கும் ஒரே செயலி.',
    subTagline: '{townName} ஊரின் மளிகை பொருட்கள், மருந்தகம், பண்ணை விளைபொருட்கள், கோவில் பூஜை சாமான்கள், பார்சல் மற்றும் EB பில்/தாலுகா அலுவலக பணிகளுக்கு உள்ளூர் பார்ட்னர்களுடன் இணையுங்கள்.',
    demoBadge: 'டெமோ பயன்முறை · மாதிரி ஆர்டர்கள் & பார்ட்னர்கள்',
    demoData: 'மாதிரி தரவு (Demo data)',
    nav: {
      home: 'முகப்பு',
      services: 'சேவைகள்',
      about: 'எங்களைப் பற்றி',
      howItWorks: 'எவ்வாறு செயல்படுகிறது',
      localShops: 'உள்ளூர் கடைகள்',
      contact: 'தொடர்பு',
      postErrand: 'பணி பதிவு செய்க',
      bookNow: 'பதிவு செய்க',
      signIn: 'உள்நுழைக / பதிவு செய்க',
      signOut: 'வெளியேறு',
      partnerMode: 'பார்ட்னர் பயன்முறைக்கு மாறுக',
      customerMode: 'வாடிக்கையாளர் பயன்முறைக்கு மாறுக',
      wallet: 'ErrandX வாலட்',
      topUp: 'பணம் சேர்க்க',
      mobilePreview: 'மொபைல் காட்சி',
      fullPortal: 'இணைய தளம்',
      dualView: 'இரட்டை பார்வை',
    },
    hero: {
      pill: '{townName}, தமிழ்நாடு - உள்ளூர் பணிகள் தளம்',
      title1: 'ஒரே செயலி.',
      title2: 'உங்கள் ஊரின் அனைத்து உள்ளூர் பணிகளுக்கும்.',
      desc: '{townName} நகரவாசிகளுக்கு தேவையான மளிகை, மருந்து வாங்குதல், பூஜை பொருட்கள், பார்சல் கொண்டு சேர்த்தல் மற்றும் தாலுகா/EB அலுவலக பணிகளுக்கு நம்பகமான உள்ளூர் பார்ட்னர்கள்.',
      postBtn: 'உடனடி பணி பதிவு',
      aiBtn: 'AI பணி உதவியாளர்',
      howBtn: 'செயல்முறை விளக்கம்',
      stats: {
        errands: 'ஊர் பணிகள்',
        partners: 'உள்ளூர் பார்ட்னர்கள்',
        satisfaction: 'மக்களின் நம்பிக்கை'
      }
    },
    services: {
      heading: 'ஊர் சேவைகள் & பணிகள்',
      subheading: '{townName} ஊரின் தேவைகளுக்கேற்ப வடிவமைக்கப்பட்ட 7 முதன்மை சேவைகள்',
      groceries: {
        title: 'மளிகை மற்றும் அன்றாட தேவைகள்',
        desc: 'பால், மளிகைப் பொருட்கள், சமையல் எண்ணெய், அரிசி மற்றும் அன்றாட அத்தியாவசிய பொருட்கள் உள்ளூர் மளிகைக் கடைகளில் இருந்து.',
        startingPrice: '₹25'
      },
      medicine: {
        title: 'உள்ளூர் மருந்தக மருந்துகள்',
        desc: 'டாக்டர் சீட்டு மருந்துகள், சளி/காய்ச்சல் மாத்திரைகள், வலி நிவாரணி மற்றும் முதலுதவி பொருட்கள் {townName} மருந்தகங்களில் இருந்து.',
        startingPrice: '₹30'
      },
      parcel: {
        title: 'பார்சல் மற்றும் கூரியர்',
        desc: 'சாவி, சார்ஜர், சாப்பாட்டு கேரியர், ஆவணங்கள் அல்லது கூரியர் அலுவலகத்தில் இருந்து பார்சல் வாங்கி வர/அனுப்ப.',
        startingPrice: '₹35'
      },
      pooja: {
        title: 'பூஜை மற்றும் கோவில் பொருட்கள்',
        desc: 'பூமாலை, சூடம், தேங்காய், கற்பூரம், விளக்கெண்ணெய் மற்றும் ஊர் கோவில் அர்ச்சனை சாமான்கள்.',
        startingPrice: '₹25'
      },
      farm_produce: {
        title: 'பண்ணை மற்றும் உள்ளூர் விளைபொருட்கள்',
        desc: 'அருகிலுள்ள கிராமத்து வயல்களில் இருந்து நேரடி கரும்பு, வாழை இலை, நாட்டு காய்கறிகள், கீரைகள், இளநீர் மற்றும் நாட்டுக்கோழி முட்டை.',
        startingPrice: '₹30'
      },
      local_shops: {
        title: 'உள்ளூர் கடைகள்',
        desc: 'ஸ்டேஷனரி கடைகள், பேக்கரி தின்பண்டங்கள், ஹார்டுவேர் மற்றும் மார்க்கெட் தெரு உள்ளூர் வணிகர்களின் பொருட்கள்.',
        startingPrice: '₹30'
      },
      custom_errands: {
        title: 'தனிப்பயன் பணிகள் (வங்கி, EB பில், சான்றிதழ்கள், தாலுகா அலுவலகம்)',
        desc: 'EB மின்சார கட்டணம் செலுத்துதல், வங்கி டோக்கன் வரிசை, ரேஷன் கடை, சான்றிதழ் விண்ணப்பம் மற்றும் தாலுகா அலுவலக வேலைகள்.',
        startingPrice: '₹50'
      }
    },
    shopsBanner: {
      title: 'உள்ளூர் கடைகள் மற்றும் பார்ட்னர்கள்',
      subtitle: '{townName} ஊரில் பதிவுசெய்துள்ள மாதிரி உள்ளூர் வணிகங்கள்',
      badge: 'மாதிரி தரவு · பதிவுசெய்துள்ள உள்ளூர் கடைகள்'
    },
    whyUs: {
      title: '{townName} மக்கள் ErrandX-ஐ ஏன் தேர்ந்தெடுக்கிறார்கள்?',
      subtitle: 'தமிழ்நாட்டின் சிறு நகரங்கள் மற்றும் கிராமப்புற தாலுகாக்களுக்காக பிரத்யேகமாக உருவாக்கப்பட்டது',
      pillar1Title: 'ஊருக்கு ஏற்ற கட்டமைப்பு',
      pillar1Desc: 'மெயின் பஸ் நிலையம், மார்க்கெட் தெரு, ஊர் கோவில், அரசு மருத்துவமனை மற்றும் தாலுகா அலுவலகம் வரை அனைத்து வழிகளும் பரிச்சயம்.',
      pillar2Title: 'நம்பகமான ஊர் பார்ட்னர்கள்',
      pillar2Desc: 'உங்கள் சொந்த ஊரைச் சேர்ந்த, முகவரியும் குணமும் தெரிந்த உள்ளூர் இளைஞர்கள் மற்றும் சேவைப் பார்ட்னர்கள்.',
      pillar3Title: 'நியாயமான குறைந்த கட்டணம்',
      pillar3Desc: 'திடீர் கட்டண உயர்வு கிடையாது. வெறும் ₹25 - ₹50 ஆரம்ப கட்டணத்தில் வெளிப்படையான விலை.',
      pillar4Title: 'அரசு & வங்கி பணிகள் உதவி',
      pillar4Desc: 'EB பில் கட்டுதல், வங்கி வரிசையில் நிற்றல், உழவர் சந்தை வேலைகள் மற்றும் தாலுகா அலுவலக விண்ணப்ப உதவிகள்.',
      pillar5Title: 'எளிமையான தமிழ் பயன்பாடு',
      pillar5Desc: 'அனைத்து மக்களும் எளிதில் புரிந்து கொள்ளும் தூய மற்றும் எளிய தமிழ் மற்றும் ஆங்கில இடைமுகம்.'
    },
    footer: {
      tagline: 'உங்கள் ஊரின் அனைத்து உள்ளூர் பணிகளுக்கும் ஒரே செயலி.',
      location: '{townName}, தமிழ்நாடு',
      contactTitle: 'தொடர்பு & நிர்வாகம்',
      nameLabel: 'நிர்வாகி:',
      phoneLabel: 'தொலைபேசி:',
      emailLabel: 'மின்னஞ்சல்:',
      linksTitle: 'முக்கிய இணைப்புகள்',
      servicesTitle: 'பணி சேவைகள்',
      disclaimer: 'ErrandX என்பது சிறு நகரங்களுக்கான மாதிரி உள்ளூர் தளம். இங்கு காட்டப்பட்டுள்ள பணிகளும் பார்ட்னர்களும் டெமோ மாதிரி பயன்பாட்டிற்காக வடிவமைக்கப்பட்டவை.',
      rights: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. உள்ளூர் சேவைகள் தளம்.'
    },
    actions: {
      confirmDispatch: 'பணியை உறுதிசெய்து அனுப்பவும்',
      cancel: 'ரத்து செய்',
      selectLocation: 'ஊர் இடத்தை தேர்வு செய்க',
      pickupLocation: 'எடுக்கும் இடம் / கடை',
      dropLocation: '{townName} விநியோக முகவரி',
      budget: 'பார்ட்னர் கூலி (₹)',
      notes: 'பார்ட்னருக்கான குறிப்புகள்',
      demoSimulatedNotice: 'டெமோ பயன்முறை: கொடுப்பனவுகள் மற்றும் பணிகள் மாதிரியாக செயல்படுத்தப்படுகின்றன.',
      callPartner: 'பார்ட்னரை அழைக்க',
      trackLive: 'பணியை கண்காணிக்க',
      viewInvoice: 'ரசீதை பார்க்க',
      close: 'மூடுக',
      save: 'சேமிக்க'
    },
    status: {
      confirmed: 'உறுதிசெய்யப்பட்டது',
      assigned: 'பார்ட்னர் ஒதுக்கப்பட்டார்',
      in_transit: 'வழியில் உள்ளார்',
      completed: 'நிறைவடைந்தது',
      cancelled: 'ரத்து செய்யப்பட்டது'
    }
  }
};
