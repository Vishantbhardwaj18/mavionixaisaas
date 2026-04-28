
import { Language } from './types';

export const APP_NAME = "MaVionix";

// Emission factor (g CO2 per kWh) - Approx India Grid
export const EMISSION_FACTOR = 0.82; 
export const AVG_POWER_WATTS = 2.5; // Avg mobile/process power

export const INITIAL_CONTEXT = {
  businessName: "Kisan Mart",
  businessType: "Kirana / General Store",
  location: "Rural India",
  language: Language.ENGLISH
};

// New Carbon Constants
export const DAILY_CARBON_LIMIT = 1000.0; // grams CO2 (Upgraded Limit)
export const PASSIVE_EMISSION_PER_SEC = 0.005; // Cost of screen on/idle per second
export const INTERACTION_EMISSION = 0.02; // Cost of a click/navigation

// Reference Caps (Benchmarks Only - No Hard Limits)
export const ADMIN_REFERENCE_CAP = 5000.0;
export const USER_REFERENCE_CAP = 1000.0;

export const ADMIN_CARBON_RATES = {
  IDLE_PER_SEC: { emission: 0.005, saved: 0, energy: 0.006 },
  CLICK: { emission: 0.02, saved: 0, energy: 0.025 },
  UPDATE_USER: { emission: 0.1, saved: 5, energy: 0.12 }, // Saves paper filing
  RESET_PIN: { emission: 0.1, saved: 50, energy: 0.12 }, // Saves support call/travel
  MANAGE_ROLE: { emission: 0.1, saved: 10, energy: 0.12 },
  VIEW_REPORT: { emission: 0.05, saved: 20, energy: 0.06 }, // Digital report vs printed
};

export const BUSINESS_CATEGORIES = {
  "Retail & Shop": [
    "Kirana / General Store",
    "Mobile / Electronics Shop",
    "Clothing / Garments",
    "Hardware / Construction Material",
    "Medical / Pharmacy",
    "Vegetable / Fruit Vendor",
    "Stationery / Xerox"
  ],
  "Agriculture & Allied": [
    "Crop Farming",
    "Dairy / Milk Centre",
    "Poultry / Fishery",
    "Agri-Inputs (Seeds/Fertilizer)",
    "Nursery / Horticulture",
    "Farm Machinery Rental"
  ],
  "Services": [
    "CSC / Online Services",
    "Tailoring / Boutique",
    "Salon / Barber Shop",
    "Repair (Mobile/Auto/Cycle)",
    "Tuition / Coaching",
    "Photography / Studio",
    "Event Decoration / Tent House"
  ],
  "Food & Processing": [
    "Flour Mill (Atta Chakki)",
    "Dhaba / Restaurant",
    "Tea Stall / Cafe",
    "Sweet Shop / Bakery",
    "Pickle / Papad Making",
    "Tiffin Service",
    "Catering Service"
  ],
  "Manufacturing & Craft": [
    "Handloom / Weaving",
    "Handicrafts / Pottery",
    "Furniture / Carpentry",
    "Welding / Fabrication",
    "Small Factory / Workshop"
  ],
  "Trading & Others": [
    "Wholesale / Mandi Trader",
    "Transport / Logistics",
    "Real Estate Broker",
    "Construction Contractor",
    "Self Help Group (SHG)",
    "Other"
  ]
};

export const SUGGESTED_LOCATIONS = [
  "Mumbai, Maharashtra", "Delhi, NCR", "Bangalore, Karnataka", "Hyderabad, Telangana",
  "Chennai, Tamil Nadu", "Kolkata, West Bengal", "Pune, Maharashtra", "Ahmedabad, Gujarat",
  "Jaipur, Rajasthan", "Lucknow, Uttar Pradesh", "Kanpur, Uttar Pradesh", "Nagpur, Maharashtra",
  "Indore, Madhya Pradesh", "Thane, Maharashtra", "Bhopal, Madhya Pradesh", "Visakhapatnam, Andhra Pradesh",
  "Patna, Bihar", "Vadodara, Gujarat", "Ghaziabad, Uttar Pradesh", "Ludhiana, Punjab",
  "Agra, Uttar Pradesh", "Nashik, Maharashtra", "Ranchi, Jharkhand", "Faridabad, Haryana",
  "Meerut, Uttar Pradesh", "Rajkot, Gujarat", "Varanasi, Uttar Pradesh", "Srinagar, Jammu & Kashmir",
  "Aurangabad, Maharashtra", "Dhanbad, Jharkhand", "Amritsar, Punjab", "Allahabad, Uttar Pradesh",
  "Howrah, West Bengal", "Gwalior, Madhya Pradesh", "Jabalpur, Madhya Pradesh", "Coimbatore, Tamil Nadu",
  "Vijayawada, Andhra Pradesh", "Jodhpur, Rajasthan", "Madurai, Tamil Nadu", "Raipur, Chhattisgarh",
  "Kota, Rajasthan", "Chandigarh", "Guwahati, Assam", "Solapur, Maharashtra", "Hubli, Karnataka",
  "Mysore, Karnataka", "Gurgaon, Haryana", "Aligarh, Uttar Pradesh", "Jalandhar, Punjab",
  "Bhubaneswar, Odisha", "Salem, Tamil Nadu", "Warangal, Telangana", "Bareilly, Uttar Pradesh",
  "Dehradun, Uttarakhand", "Tirupati, Andhra Pradesh", "Canacona, Goa", "Candolim, Goa",
  "Rural India"
];

// Estimated Savings in grams of CO2 vs Physical Alternative
export const CARBON_ESTIMATES = {
  DEFAULT: { emission: 0.1, saved: 10 },
  INVOICE: { emission: 0.5, saved: 100 }, // Paper + Transport
  MARKETING: { emission: 0.8, saved: 500 }, // Physical proofs/flyers
  KHATA: { emission: 0.2, saved: 50 }, // Ledger book
  WEBSITE: { emission: 2.5, saved: 15000 }, // Meetings + Travel + Hardware
  LOGO: { emission: 1.5, saved: 5000 }, // Agency travel
  CARD: { emission: 1.0, saved: 2000 }, // Print shop travel
  POSTER: { emission: 1.2, saved: 3000 }, // Print proofs
  SOCIAL: { emission: 0.8, saved: 1500 }, // DIY vs Designer
  BRAND_KIT: { emission: 2.0, saved: 8000 }, // Full agency process
  SCHEME: { emission: 0.5, saved: 5000 }, // Trip to Gov office
  IMAGE_UPLOAD: { emission: 0.5, saved: 0 }, // Extra compute for image processing
  INVENTORY: { emission: 0.3, saved: 200 }, // Saves physical audit travel/paper
  MARKET: { emission: 0.4, saved: 3000 }, // Saves physical trip to market/mandi
  IDEA: { emission: 0.6, saved: 5000 }, // Saves consultant meetings/travel
  CRM: { emission: 0.3, saved: 1000 }, // Saves physical rolodex/logs
  HR: { emission: 0.3, saved: 2000 }, // Saves physical payroll/attendance logs
};

export const AUTH_PROMPTS = {
  [Language.ENGLISH]: {
    welcome: "Welcome to MaVionix. Sign in or Create a new account.",
    enterMobile: "Please say or enter your mobile number.",
    enterEmail: "Please enter your email address.",
    enterAadhaar: "Please enter your 12-digit Aadhaar number.",
    enterOTP: "I have sent a code. Please say the numbers.",
    setupProfile: "Let's set up your business profile.",
    biometric: "Place your finger on the sensor or look at the camera.",
    setupPin: "Set a 4-digit security PIN for offline access.",
    enterPin: "Please enter your 4-digit PIN.",
    success: "Login successful. Loading your dashboard.",
    notFound: "Account not found. Please create a new account.",
    exists: "Account already exists. Please sign in.",
    initiateLogin: "Sign in using Mobile, Email or Aadhaar.",
    initiateSignup: "Create account using Mobile, Email or Aadhaar.",
    verified: "Verified. Please enter OTP.",
    invalidCode: "Code is incorrect. Try again.",
    newCodeSent: "New code sent.",
    // UI Labels
    panelGreeting: "Hi! I'm MaVionix",
    panelSubtext: "I help you run your business and save the planet. Let's get you set up.",
    getStartedBtn: "Get Started",
    signIn: "Sign In",
    createAccount: "Create Account",
    welcomeBack: "Welcome Back",
    recentLogins: "Recent Logins",
    adminArea: "Admin Secured Area"
  },
  [Language.HINDI]: {
    welcome: "MaVionix में आपका स्वागत है। साइन इन करें या नया खाता बनाएं।",
    enterMobile: "कृपया अपना मोबाइल नंबर बोलें या दर्ज करें।",
    enterEmail: "कृपया अपना ईमेल पता दर्ज करें।",
    enterAadhaar: "कृपया अपना 12 अंकों का आधार नंबर दर्ज करें।",
    enterOTP: "मैंने एक कोड भेजा है। कृपया नंबर बोलें।",
    setupProfile: "आइए आपका बिजनेस प्रोफाइल सेट करें।",
    biometric: "सत्यापन के लिए अपनी उंगली सेंसर पर रखें या कैमरे की ओर देखें।",
    setupPin: "ऑफलाइन एक्सेस के लिए 4 अंकों का पिन सेट करें।",
    enterPin: "कृपया अपना 4 अंकों का पिन दर्ज करें।",
    success: "लॉगिन सफल। आपका डैशबोर्ड लोड हो रहा है।",
    notFound: "खाता नहीं मिला। कृपया नया खाता बनाएं।",
    exists: "खाता पहले से मौजूद है। कृपया साइन इन करें।",
    initiateLogin: "मोबाइल, ईमेल या आधार का उपयोग करके साइन इन करें।",
    initiateSignup: "मोबाइल, ईमेल या आधार का उपयोग करके खाता बनाएं।",
    verified: "सत्यापित। कृपया ओटीपी दर्ज करें।",
    invalidCode: "कोड गलत है। पुनः प्रयास करें।",
    newCodeSent: "नया कोड भेजा गया।",
    // UI Labels
    panelGreeting: "नमस्ते! मैं MaVionix हूँ",
    panelSubtext: "मैं आपका व्यवसाय चलाने और कार्बन बचत करने में मदद करता हूँ।",
    getStartedBtn: "शुरू करें",
    signIn: "साइन इन करें",
    createAccount: "खाता बनाएं",
    welcomeBack: "वापसी पर स्वागत है",
    recentLogins: "हाल ही में लॉगिन",
    adminArea: "प्रशासक सुरक्षित क्षेत्र"
  },
  [Language.TAMIL]: {
    welcome: "MaVionix-க்கு வரவேற்கிறோம். உள்நுழையவும் அல்லது புதிய கணக்கை உருவாக்கவும்.",
    enterMobile: "உங்கள் மொபைல் எண்ணைச் சொல்லவும் அல்லது உள்ளிடவும்.",
    enterEmail: "உங்கள் மின்னஞ்சல் முகவரியை உள்ளிடவும்.",
    enterAadhaar: "உங்கள் 12 இலக்க ஆதார் எண்ணை உள்ளிடவும்.",
    enterOTP: "நான் ஒரு குறியீட்டை அனுப்பியுள்ளேன். எண்களைச் சொல்லுங்கள்.",
    setupProfile: "உங்கள் வணிகச் சுயவிவரத்தை அமைப்போம்.",
    biometric: "உங்கள் விரலை சென்சாரில் வைக்கவும் அல்லது கேமராவைப் பார்க்கவும்.",
    setupPin: "பாதுகாப்பு PIN-ஐ அமைக்கவும்.",
    enterPin: "உங்கள் 4 இலக்க PIN-ஐ உள்ளிடவும்.",
    success: "உள்நுழைவு வெற்றிகரமாக உள்ளது.",
    notFound: "கணக்கு இல்லை. புதிய கணக்கை உருவாக்கவும்.",
    exists: "கணக்கு ஏற்கனவே உள்ளது. தயவுசெய்து உள்நுழையவும்.",
    initiateLogin: "மொபைல், மின்னஞ்சல் அல்லது ஆதார் பயன்படுத்தி உள்நுழையவும்.",
    initiateSignup: "மொபைல், மின்னஞ்சல் அல்லது ஆதார் பயன்படுத்தி கணக்கை உருவாக்கவும்.",
    verified: "சரிபார்க்கப்பட்டது. தயவுசெய்து OTP ஐ உள்ளிடவும்.",
    invalidCode: "குறியீடு தவறானது. மீண்டும் முயற்சிக்கவும்.",
    newCodeSent: "புதிய குறியீடு அனுப்பப்பட்டது.",
    // UI Labels
    panelGreeting: "வணக்கம்! நான் MaVionix",
    panelSubtext: "உங்கள் வணிகத்தை நடத்தவும் கார்பன் சேமிக்கவும் நான் உதவுகிறேன்.",
    getStartedBtn: "தொடங்கவும்",
    signIn: "உள்நுழைய",
    createAccount: "கணக்கை உருவாக்கு",
    welcomeBack: "மீண்டும் வருக",
    recentLogins: "சமீபத்திய",
    adminArea: "நிர்வாகப் பகுதி"
  },
  [Language.BENGALI]: {
    welcome: "MaVionix-এ স্বাগতম। সাইন ইন করুন বা একটি নতুন অ্যাকাউন্ট তৈরি করুন।",
    enterMobile: "অনুগ্রহ করে আপনার মোবাইল নম্বর বলুন বা লিখুন।",
    enterEmail: "অনুগ্রহ করে আপনার ইমেল ঠিকানা লিখুন।",
    enterAadhaar: "অনুগ্রহ করে আপনার 12-সংখ্যার আধার নম্বর লিখুন।",
    enterOTP: "আমি একটি কোড পাঠিয়েছি। অনুগ্রহ করে নম্বরগুলো বলুন।",
    setupProfile: "আসুন আপনার ব্যবসার প্রোফাইল সেট আপ করি।",
    biometric: "সেন্সরে আপনার আঙুল রাখুন বা ক্যামেরার দিকে তাকান।",
    setupPin: "পিন সেট করুন।",
    enterPin: "অনুগ্রহ করে আপনার 4-সংখ্যার পিন লিখুন।",
    success: "লগইন সফল হয়েছে।",
    notFound: "অ্যাকাউন্ট পাওয়া যায়নি। অনুগ্রহ করে একটি নতুন অ্যাকাউন্ট তৈরি করুন।",
    exists: "অ্যাকাউন্ট ইতিমধ্যেই বিদ্যমান। অনুগ্রহ করে সাইন ইন করুন।",
    initiateLogin: "মোবাইল, ইমেল বা আধার ব্যবহার করে সাইন ইন করুন।",
    initiateSignup: "মোবাইল, ইমেল বা আধার ব্যবহার করে অ্যাকাউন্ট তৈরি করুন।",
    verified: "যাচাই করা হয়েছে। অনুগ্রহ করে ওটিপি দিন।",
    invalidCode: "কোড ভুল। আবার চেষ্টা করুন।",
    newCodeSent: "নতুন কোড পাঠানো হয়েছে।",
    // UI Labels
    panelGreeting: "নমস্কার! আমি MaVionix",
    panelSubtext: "আমি আপনাকে ব্যবসা চালাতে এবং কার্বন বাঁচাতে সাহায্য করি।",
    getStartedBtn: "শুরু করুন",
    signIn: "সাইন ইন",
    createAccount: "অ্যাকাউন্ট তৈরি",
    welcomeBack: "স্বাগতম",
    recentLogins: "সাম্প্রতিক লগইন",
    adminArea: "অ্যাডমিন এলাকা"
  },
  [Language.TELUGU]: {
    welcome: "MaVionixకి స్వాగతం. సైన్ ఇన్ చేయండి లేదా కొత్త ఖాతాను సృష్టించండి.",
    enterMobile: "దయచేసి మీ మొబైల్ నంబర్‌ను చెప్పండి లేదా ఎంటర్ చేయండి.",
    enterEmail: "దయచేసి మీ ఇమెయిల్ చిరునామాను ఎంటర్ చేయండి.",
    enterAadhaar: "దయచేసి మీ 12 అంకెల ఆధార్ నంబర్‌ను ఎంటర్ చేయండి.",
    enterOTP: "నేను ఒక కోడ్‌ను పంపాను. దయచేసి సంఖ్యలను చెప్పండి.",
    setupProfile: "మీ వ్యాపార ప్రొఫైల్‌ను సెటప్ చేద్దాం.",
    biometric: "మీ వేలిని సెన్సార్‌పై ఉంచండి లేదా కెమెరా వైపు చూడండి.",
    setupPin: "భద్రతా PINని సెట్ చేయండి.",
    enterPin: "దయచేసి మీ 4 అంకెల PINని ఎంటర్ చేయండి.",
    success: "లాగిన్ విజయవంతమైంది.",
    notFound: "ఖాతా కనుగొనబడలేదు. దయచేసి కొత్త ఖాతాను సృష్టించండి.",
    exists: "ఖాతా ఇప్పటికే ఉంది. దయచేసి సైన్ ఇన్ చేయండి.",
    initiateLogin: "మొబైల్, ఇమెయిల్ లేదా ఆధార్ ఉపయోగించి సైన్ ఇన్ చేయండి.",
    initiateSignup: "మొబైల్, ఇమెయిల్ లేదా ఆధార్ ఉపయోగించి ఖాతాను సృష్టించండి.",
    verified: "ధృవీకరించబడింది. దయచేసి OTPని నమోదు చేయండి.",
    invalidCode: "కోడ్ తప్పు. మళ్ళీ ప్రయత్నించండి.",
    newCodeSent: "కొత్త కోడ్ పంపబడింది.",
    panelGreeting: "హలో! నేను MaVionix",
    panelSubtext: "నేను మీ వ్యాపారాన్ని నడపడానికి మరియు కార్బన్‌ను ఆదా చేయడానికి సహాయం చేస్తాను.",
    getStartedBtn: "ప్రారంభించండి",
    signIn: "సైన్ ఇన్",
    createAccount: "ఖాతా సృష్టించండి",
    welcomeBack: "తిరిగి స్వాగతం",
    recentLogins: "ఇటీవలి లాగిన్‌లు",
    adminArea: "అడ్మిన్ ప్రాంతం"
  },
  [Language.MARATHI]: {
    welcome: "MaVionix मध्ये स्वागत आहे. साइन इन करा किंवा नवीन खाते तयार करा.",
    enterMobile: "कृपया तुमचा मोबाईल नंबर सांगा किंवा एंटर करा.",
    enterEmail: "कृपया तुमचा ईमेल पत्ता एंटर करा.",
    enterAadhaar: "कृपया तुमचा 12 अंकी आधार क्रमांक एंटर करा.",
    enterOTP: "मी एक कोड पाठवला आहे. कृपया नंबर सांगा.",
    setupProfile: "आपले व्यवसाय प्रोफाइल सेट करूया.",
    biometric: "सत्यापनासाठी तुमचे बोट सेन्सरवर ठेवा किंवा कॅमेऱ्याकडे पहा.",
    setupPin: "सुरक्षा पिन सेट करा.",
    enterPin: "कृपया तुमचा 4 अंकी पिन एंटर करा.",
    success: "लॉगिन यशस्वी झाले.",
    notFound: "खाते सापडले नाही. कृपया नवीन खाते तयार करा.",
    exists: "खाते आधीच अस्तित्वात आहे. कृपया साइन इन करा.",
    initiateLogin: "मोबाईल, ईमेल किंवा आधार वापरून साइन इन करा.",
    initiateSignup: "मोबाईल, ईमेल किंवा आधार वापरून खाते तयार करा.",
    verified: "सत्यापित. कृपया ओटीपी प्रविष्ट करा.",
    invalidCode: "कोड चुकीचा आहे. पुन्हा प्रयत्न करा.",
    newCodeSent: "नवीन कोड पाठवला.",
    panelGreeting: "नमस्ते! मी MaVionix आहे",
    panelSubtext: "मी तुमचा व्यवसाय चालवण्यास आणि कार्बन वाचवण्यास मदत करतो.",
    getStartedBtn: "सुरू करा",
    signIn: "साइन इन",
    createAccount: "खाते तयार करा",
    welcomeBack: "पुन्हा स्वागत",
    recentLogins: "अलीकडील लॉगिन",
    adminArea: "प्रशासक क्षेत्र"
  },
  [Language.GUJARATI]: {
    welcome: "MaVionix માં સ્વાગત છે. સાઇન ઇન કરો અથવા નવું ખાતું બનાવો.",
    enterMobile: "કૃપા કરીને તમારો મોબાઇલ નંબર બોલો અથવા દાખલ કરો.",
    enterEmail: "કૃપા કરીને તમારું ઇમેઇલ સરનામું દાખલ કરો.",
    enterAadhaar: "કૃપા કરીને તમારો 12 અંકનો આધાર નંબર દાખલ કરો.",
    enterOTP: "મેં એક કોડ મોકલ્યો છે. કૃપા કરીને નંબરો બોલો.",
    setupProfile: "ચાલો તમારી વ્યવસાય પ્રોફાઇલ સેટ કરીએ.",
    biometric: "તમારી આંગળી સેન્સર પર મૂકો અથવા કેમેરા તરફ જુઓ.",
    setupPin: "સુરક્ષા પિન સેટ કરો.",
    enterPin: "કૃપા કરીને તમારો 4 અંકનો પિન દાખલ કરો.",
    success: "લોગિન સફળ.",
    notFound: "ખાતું મળ્યું નથી. કૃપા કરીને નવું ખાતું બનાવો.",
    exists: "ખાતું પહેલેથી જ છે. કૃપા કરીને સાઇન ઇન કરો.",
    initiateLogin: "મોબાઇલ, ઇમેઇલ અથવા આધારનો ઉપયોગ કરીને સાઇન ઇન કરો.",
    initiateSignup: "મોબાઇલ, ઇમેઇલ અથવા આધારનો ઉપયોગ કરીને ખાતું બનાવો.",
    verified: "ચકાસાયેલ. કૃપા કરીને ઓટીપી દાખલ કરો.",
    invalidCode: "કોડ ખોટો છે. ફરી પ્રયાસ કરો.",
    newCodeSent: "નવો કોડ મોકલ્યો.",
    panelGreeting: "નમસ્તે! હું MaVionix છું",
    panelSubtext: "હું તમને તમારો વ્યવસાય ચલાવવામાં અને કાર્બન બચાવવામાં મદદ કરું છું.",
    getStartedBtn: "શરૂ કરો",
    signIn: "સાઇન ઇન",
    createAccount: "ખાતું બનાવો",
    welcomeBack: "ફરી સ્વાગત છે",
    recentLogins: "તાજેતરના લોગિન",
    adminArea: "એડમિન વિસ્તાર"
  },
  [Language.PUNJABI]: {
    welcome: "MaVionix ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ। ਸਾਈਨ ਇਨ ਕਰੋ ਜਾਂ ਨਵਾਂ ਖਾਤਾ ਬਣਾਓ।",
    enterMobile: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਮੋਬਾਈਲ ਨੰਬਰ ਦੱਸੋ ਜਾਂ ਦਰਜ ਕਰੋ।",
    enterEmail: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਈਮੇਲ ਪਤਾ ਦਰਜ ਕਰੋ।",
    enterAadhaar: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ 12 ਅੰਕਾਂ ਦਾ ਆਧਾਰ ਨੰਬਰ ਦਰਜ ਕਰੋ।",
    enterOTP: "ਮੈਂ ਇੱਕ ਕੋਡ ਭੇਜਿਆ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਨੰਬਰ ਦੱਸੋ।",
    setupProfile: "ਆਓ ਤੁਹਾਡਾ ਵਪਾਰਕ ਪ੍ਰੋਫਾਈਲ ਸੈਟ ਅਪ ਕਰੀਏ।",
    biometric: "ਆਪਣੀ ਉਂਗਲ ਸੈਂਸਰ 'ਤੇ ਰੱਖੋ ਜਾਂ ਕੈਮਰੇ ਵੱਲ ਦੇਖੋ।",
    setupPin: "ਸੁਰੱਖਿਆ ਪਿੰਨ ਸੈੱਟ ਕਰੋ।",
    enterPin: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ 4 ਅੰਕਾਂ ਦਾ ਪਿੰਨ ਦਰਜ ਕਰੋ।",
    success: "ਲੌਗਇਨ ਸਫਲ ਰਿਹਾ।",
    notFound: "ਖਾਤਾ ਨਹੀਂ ਮਿਲਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਨਵਾਂ ਖਾਤਾ ਬਣਾਓ।",
    exists: "ਖਾਤਾ ਪਹਿਲਾਂ ਹੀ ਮੌਜੂਦ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਸਾਈਨ ਇਨ ਕਰੋ।",
    initiateLogin: "ਮੋਬਾਈਲ, ਈਮੇਲ ਜਾਂ ਆਧਾਰ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਸਾਈਨ ਇਨ ਕਰੋ।",
    initiateSignup: "ਮੋਬਾਈਲ, ਈਮੇਲ ਜਾਂ ਆਧਾਰ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਖਾਤਾ ਬਣਾਓ।",
    verified: "ਤਸਦੀਕ ਹੋ ਗਿਆ। ਕਿਰਪਾ ਕਰਕੇ OTP ਦਰਜ ਕਰੋ।",
    invalidCode: "ਕੋਡ ਗਲਤ ਹੈ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    newCodeSent: "ਨਵਾਂ ਕੋਡ ਭੇਜਿਆ ਗਿਆ।",
    panelGreeting: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ! ਮੈਂ MaVionix ਹਾਂ",
    panelSubtext: "ਮੈਂ ਤੁਹਾਡਾ ਕਾਰੋਬਾਰ ਚਲਾਉਣ ਅਤੇ ਕਾਰਬਨ ਬਚਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹਾਂ।",
    getStartedBtn: "ਸ਼ੁਰੂ ਕਰੋ",
    signIn: "ਸਾਈਨ ਇਨ",
    createAccount: "ਖਾਤਾ ਬਣਾਓ",
    welcomeBack: "ਜੀ ਆਇਆਂ ਨੂੰ",
    recentLogins: "ਹਾਲੀਆ ਲੌਗਇਨ",
    adminArea: "ਐਡਮਿਨ ਖੇਤਰ"
  },
  [Language.KANNADA]: {
    welcome: "MaVionix ಗೆ ಸುಸ್ವಾಗತ. ಸೈನ್ ಇನ್ ಮಾಡಿ ಅಥವಾ ಹೊಸ ಖಾತೆಯನ್ನು ರಚಿಸಿ.",
    enterMobile: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ಹೇಳಿ ಅಥವಾ ನಮೂದಿಸಿ.",
    enterEmail: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ.",
    enterAadhaar: "ದಯವಿಟ್ಟು ನಿಮ್ಮ 12 ಅಂಕಿಯ ಆಧಾರ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.",
    enterOTP: "ನಾನು ಕೋಡ್ ಕಳುಹಿಸಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ಸಂಖ್ಯೆಗಳನ್ನು ಹೇಳಿ.",
    setupProfile: "ನಿಮ್ಮ ವ್ಯಾಪಾರ ಪ್ರೊಫೈಲ್ ಅನ್ನು ಹೊಂದಿಸೋಣ.",
    biometric: "ನಿಮ್ಮ ಬೆರಳನ್ನು ಸೆನ್ಸಾರ್ ಮೇಲೆ ಇರಿಸಿ ಅಥವಾ ಕ್ಯಾಮರಾವನ್ನು ನೋಡಿ.",
    setupPin: "ಭದ್ರತಾ ಪಿನ್ ಹೊಂದಿಸಿ.",
    enterPin: "ದಯವಿಟ್ಟು ನಿಮ್ಮ 4 ಅಂಕಿಯ ಪಿನ್ ನಮೂದಿಸಿ.",
    success: "ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ.",
    notFound: "ಖಾತೆ ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ಹೊಸ ಖಾತೆಯನ್ನು ರಚಿಸಿ.",
    exists: "ಖಾತೆ ಈಗಾಗಲೇ ಅಸ್ತಿತ್ವದಲ್ಲಿದೆ. ದಯವಿಟ್ಟು ಸೈನ್ ಇನ್ ಮಾಡಿ.",
    initiateLogin: "ಮೊಬೈಲ್, ಇಮೇಲ್ ಅಥವಾ ಆಧಾರ್ ಬಳಸಿ ಸೈನ್ ಇನ್ ಮಾಡಿ.",
    initiateSignup: "ಮೊಬೈಲ್, ಇಮೇಲ್ ಅಥವಾ ಆಧಾರ್ ಬಳಸಿ ಖಾತೆಯನ್ನು ರಚಿಸಿ.",
    verified: "ಪರಿಶೀಲಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು OTP ನಮೂದಿಸಿ.",
    invalidCode: "ಕೋಡ್ ತಪ್ಪಾಗಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    newCodeSent: "ಹೊಸ ಕೋಡ್ ಕಳುಹಿಸಲಾಗಿದೆ.",
    panelGreeting: "ನಮಸ್ಕಾರ! ನಾನು MaVionix",
    panelSubtext: "ನಿಮ್ಮ ವ್ಯಾಪಾರವನ್ನು ನಡೆಸಲು ಮತ್ತು ಇಂಗಾಲವನ್ನು ಉಳಿಸಲು ನಾನು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.",
    getStartedBtn: "ಪ್ರಾರಂಭಿಸಿ",
    signIn: "ಸೈನ್ ಇನ್",
    createAccount: "ಖಾತೆ ರಚಿಸಿ",
    welcomeBack: "ಮತ್ತೆ ಸುಸ್ವಾಗತ",
    recentLogins: "ಇತ್ತೀಚಿನ ಲಾಗಿನ್‌ಗಳು",
    adminArea: "ನಿರ್ವಾಹಕ ಪ್ರದೇಶ"
  },
  [Language.MALAYALAM]: {
    welcome: "MaVionix-ലേക്ക് സ്വാഗതം. സൈൻ ഇൻ ചെയ്യുക അല്ലെങ്കിൽ പുതിയ അക്കൗണ്ട് സൃഷ്ടിക്കുക.",
    enterMobile: "നിങ്ങളുടെ മൊബൈൽ നമ്പർ പറയുകയോ നൽകുകയോ ചെയ്യുക.",
    enterEmail: "നിങ്ങളുടെ ഇമെയിൽ വിലാസം നൽകുക.",
    enterAadhaar: "നിങ്ങളുടെ 12 അക്ക ആധാർ നമ്പർ നൽകുക.",
    enterOTP: "ഞാൻ ഒരു കോഡ് അയച്ചു. നമ്പറുകൾ പറയുക.",
    setupProfile: "നമുക്ക് നിങ്ങളുടെ ബിസിനസ്സ് പ്രൊഫൈൽ സജ്ജമാക്കാം.",
    biometric: "നിങ്ങളുടെ വിരൽ സെൻസറിൽ വയ്ക്കുക അല്ലെങ്കിൽ ക്യാമറയിലേക്ക് നോക്കുക.",
    setupPin: "സുരക്ഷാ പിൻ സജ്ജമാക്കുക.",
    enterPin: "നിങ്ങളുടെ 4 അക്ക പിൻ നൽകുക.",
    success: "ലോഗിൻ വിജയകരമായി.",
    notFound: "അക്കൗണ്ട് കണ്ടെത്തിയില്ല. ദയവായി പുതിയ അക്കൗണ്ട് സൃഷ്ടിക്കുക.",
    exists: "അക്കൗണ്ട് ഇതിനകം നിലവിലുണ്ട്. ദയവായി സൈൻ ഇൻ ചെയ്യുക.",
    initiateLogin: "മൊബൈൽ, ഇമെയിൽ അല്ലെങ്കിൽ ആധാർ ഉപയോഗിച്ച് സൈൻ ഇൻ ചെയ്യുക.",
    initiateSignup: "മൊബൈൽ, ഇമെയിൽ അല്ലെങ്കിൽ ആധാർ ഉപയോഗിച്ച് അക്കൗണ്ട് സൃഷ്ടിക്കുക.",
    verified: "പരിശോധിച്ചു. ദയവായി OTP നൽകുക.",
    invalidCode: "കോഡ് തെറ്റാണ്. വീണ്ടും ശ്രമിക്കുക.",
    newCodeSent: "പുതിയ കോഡ് അയച്ചു.",
    panelGreeting: "നമസ്കാരം! ഞാൻ MaVionix",
    panelSubtext: "ബിസിനസ്സ് നടത്താനും കാർബൺ ലാഭിക്കാനും ഞാൻ നിങ്ങളെ സഹായിക്കുന്നു.",
    getStartedBtn: "തുടങ്ങാം",
    signIn: "സൈൻ ഇൻ",
    createAccount: "അക്കൗണ്ട് സൃഷ്ടിക്കുക",
    welcomeBack: "സ്വാഗതം",
    recentLogins: "സമീപകാല ലോഗിനുകൾ",
    adminArea: "അഡ്മിൻ ഏരിയ"
  },
  [Language.ODIA]: {
    welcome: "MaVionix କୁ ସ୍ୱାଗତ। ସାଇନ୍ ଇନ୍ କରନ୍ତୁ କିମ୍ବା ନୂତନ ଆକାଉଣ୍ଟ୍ ତିଆରି କରନ୍ତୁ।",
    enterMobile: "ଦୟାକରି ଆପଣଙ୍କର ମୋବାଇଲ୍ ନମ୍ବର କୁହନ୍ତୁ କିମ୍ବା ଲେଖନ୍ତୁ।",
    enterEmail: "ଦୟାକରି ଆପଣଙ୍କର ଇମେଲ୍ ଠିକଣା ଲେଖନ୍ତୁ।",
    enterAadhaar: "ଦୟାକରି ଆପଣଙ୍କର 12 ଅଙ୍କ ବିଶିଷ୍ଟ ଆଧାର ନମ୍ବର ଲେଖନ୍ତୁ।",
    enterOTP: "ମୁଁ ଏକ କୋଡ୍ ପଠାଇଛି। ଦୟାକରି ନମ୍ବରଗୁଡିକ କୁହନ୍ତୁ।",
    setupProfile: "ଆସନ୍ତୁ ଆପଣଙ୍କର ବ୍ୟବସାୟ ପ୍ରୋଫାଇଲ୍ ସେଟ୍ ଅପ୍ କରିବା।",
    biometric: "ସେନ୍ସରରେ ଆପଣଙ୍କ ଆଙ୍ଗୁଠି ରଖନ୍ତୁ କିମ୍ବା କ୍ୟାମେରାକୁ ଦେଖନ୍ତୁ।",
    setupPin: "ସୁରକ୍ଷା ପିନ୍ ସେଟ୍ କରନ୍ତୁ।",
    enterPin: "ଦୟାକରି ଆପଣଙ୍କର 4 ଅଙ୍କ ବିଶିଷ୍ଟ ପିନ୍ ଲେଖନ୍ତୁ।",
    success: "ଲଗଇନ୍ ସଫଳ ହେଲା।",
    notFound: "ଆକାଉଣ୍ଟ୍ ମିଳିଲା ନାହିଁ। ଦୟାକରି ନୂତନ ଆକାଉଣ୍ଟ୍ ତିଆରି କରନ୍ତୁ।",
    exists: "ଆକାଉଣ୍ଟ୍ ପୂର୍ବରୁ ଅଛି। ଦୟାକରି ସାଇନ୍ ଇନ୍ କରନ୍ତୁ।",
    initiateLogin: "ମୋବାଇଲ୍, ଇମେଲ୍ କିମ୍ବା ଆଧାର ବ୍ୟବହାର କରି ସାଇନ୍ ଇନ୍ କରନ୍ତୁ।",
    initiateSignup: "ମୋବାଇଲ୍, ଇମେଲ୍ କିମ୍ବା ଆଧାର ବ୍ୟବହାର କରି ଆକାଉଣ୍ଟ୍ ତିଆରି କରନ୍ତୁ।",
    verified: "ଯାଞ୍ଚ ହୋଇଛି। ଦୟାକରି OTP ଦିଅନ୍ତୁ।",
    invalidCode: "କୋଡ୍ ଭୁଲ୍ ଅଛି। ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।",
    newCodeSent: "ନୂତନ କୋଡ୍ ପଠାଗଲା।",
    panelGreeting: "ନମସ୍କାର! ମୁଁ MaVionix",
    panelSubtext: "ମୁଁ ଆପଣଙ୍କ ବ୍ୟବସାୟ ଚଳାଇବାରେ ଏବଂ କାର୍ବନ ବଞ୍ଚାଇବାରେ ସାହାଯ୍ୟ କରେ।",
    getStartedBtn: "ଆରମ୍ଭ କରନ୍ତୁ",
    signIn: "ସାଇନ୍ ଇନ୍",
    createAccount: "ଆକାଉଣ୍ଟ୍ ତିଆରି",
    welcomeBack: "ସ୍ୱାଗତ",
    recentLogins: "ସାମ୍ପ୍ରତିକ ଲଗଇନ୍",
    adminArea: "ଆଡମିନ୍ କ୍ଷେତ୍ର"
  },
  [Language.ASSAMESE]: {
    welcome: "MaVionix লৈ স্বাগতম। ছাইন ইন কৰক বা নতুন একাউণ্ট খুলক।",
    enterMobile: "অনুগ্রহ কৰি আপোনাৰ মোবাইল নম্বৰ কওক বা লিখক।",
    enterEmail: "অনুগ্রহ কৰি আপোনাৰ ইমেইল ঠিকনা লিখক।",
    enterAadhaar: "অনুগ্রহ কৰি আপোনাৰ ১২ অংকৰ আধাৰ নম্বৰ লিখক।",
    enterOTP: "মই এটা কোড পঠাইছো। অনুগ্রহ কৰি নম্বৰবোৰ কওক।",
    setupProfile: "আহক আপোনাৰ ব্যৱসায়ৰ প্ৰফাইল ছেট আপ কৰো।",
    biometric: "আপোনাৰ আঙুলিটো ছেন্সৰত ৰাখক বা কেমেৰালৈ চাওক।",
    setupPin: "সুৰক্ষা পিন ছেট কৰক।",
    enterPin: "অনুগ্রহ কৰি আপোনাৰ ৪ অংকৰ পিন লিখক।",
    success: "লগইন সফল হৈছে।",
    notFound: "একাউণ্ট পোৱা নগ'ল। অনুগ্রহ কৰি এটা নতুন একাউণ্ট খোলক।",
    exists: "একাউণ্ট ইতিমধ্যে আছে। অনুগ্রহ কৰি ছাইন ইন কৰক।",
    initiateLogin: "মোবাইল, ইমেইল বা আধাৰ ব্যৱহাৰ কৰি ছাইন ইন কৰক।",
    initiateSignup: "মোবাইল, ইমেইল বা আধাৰ ব্যৱহাৰ কৰি একাউণ্ট খোলক।",
    verified: "সত্যাপন কৰা হ'ল। অনুগ্ৰহ কৰি OTP দিয়ক।",
    invalidCode: "কোড ভুল। পুনৰ চেষ্টা কৰক।",
    newCodeSent: "নতুন কোড পঠোৱা হ'ল।",
    panelGreeting: "নমস্কাৰ! মই MaVionix",
    panelSubtext: "মই আপোনাক ব্যৱসায় চলাবলৈ আৰু কাৰ্বন বচাবলৈ সহায় কৰো।",
    getStartedBtn: "আৰম্ভ কৰক",
    signIn: "ছাইন ইন",
    createAccount: "একাউণ্ট খোলক",
    welcomeBack: "স্বাগতম",
    recentLogins: "শেহতীয়া লগইন",
    adminArea: "এডমিন এলেকা"
  },
  [Language.URDU]: {
    welcome: "MaVionix میں خوش آمدید۔ سائن ان کریں یا نیا اکاؤنٹ بنائیں۔",
    enterMobile: "براہ کرم اپنا موبائل نمبر بولیں یا درج کریں۔",
    enterEmail: "براہ کرم اپنا ای میل ایڈریس درج کریں۔",
    enterAadhaar: "براہ کرم اپنا 12 ہندسوں کا آدھار نمبر درج کریں۔",
    enterOTP: "میں نے ایک کوڈ بھیجا ہے۔ براہ کرم نمبر بتائیں۔",
    setupProfile: "آئیے آپ کا بزنس پروفائل سیٹ کریں۔",
    biometric: "تصدیق کے لیے اپنی انگلی سینسر پر رکھیں یا کیمرے کی طرف دیکھیں۔",
    setupPin: "سیکیورٹی پن سیٹ کریں۔",
    enterPin: "براہ کرم اپنا 4 ہندسوں کا پن درج کریں۔",
    success: "لاگ ان کامیاب۔",
    notFound: "اکاؤنٹ نہیں ملا۔ براہ کرم نیا اکاؤنٹ بنائیں۔",
    exists: "اکاؤنٹ پہلے سے موجود ہے۔ براہ کرم سائن ان کریں۔",
    initiateLogin: "موبائل، ای میل یا آدھار کا استعمال کرتے ہوئے سائن ان کریں۔",
    initiateSignup: "موبائل، ای میل یا آدھار کا استعمال کرتے ہوئے اکاؤنٹ بنائیں۔",
    verified: "تصدیق ہو گئی۔ براہ کرم OTP درج کریں۔",
    invalidCode: "کوڈ غلط ہے۔ دوبارہ کوشش کریں۔",
    newCodeSent: "نیا کوڈ بھیجا گیا۔",
    panelGreeting: "آداب! میں MaVionix ہوں",
    panelSubtext: "میں آپ کا کاروبار چلانے اور کاربن بچانے میں مدد کرتا ہوں۔",
    getStartedBtn: "شروع کریں",
    signIn: "سائن ان",
    createAccount: "اکاؤنٹ بنائیں",
    welcomeBack: "خوش آمدید",
    recentLogins: "حالیہ لاگ ان",
    adminArea: "ایڈمن ایریا"
  },
  [Language.NEPALI]: {
    welcome: "MaVionix मा स्वागत छ। साइन इन गर्नुहोस् वा नयाँ खाता बनाउनुहोस्।",
    enterMobile: "कृपया आफ्नो मोबाइल नम्बर भन्नुहोस् वा लेख्नुहोस्।",
    enterEmail: "कृपया आफ्नो इमेल ठेगाना लेख्नुहोस्।",
    enterAadhaar: "कृपया आफ्नो १२ अंकको आधार नम्बर लेख्नुहोस्।",
    enterOTP: "मैले कोड पठाएको छु। कृपया नम्बरहरू भन्नुहोस्।",
    setupProfile: "तपाईंको व्यापार प्रोफाइल सेट अप गरौं।",
    biometric: "आफ्नो औंला सेन्सरमा राख्नुहोस् वा क्यामेरामा हेर्नुहोस्।",
    setupPin: "सुरक्षा पिन सेट गर्नुहोस्।",
    enterPin: "कृपया आफ्नो ४ अंकको पिन लेख्नुहोस्।",
    success: "लगइन सफल भयो।",
    notFound: "खाता भेटिएन। कृपया नयाँ खाता बनाउनुहोस्।",
    exists: "खाता पहिले नै अवस्थित छ। कृपया साइन इन गर्नुहोस्।",
    initiateLogin: "मोबाइल, इमेल वा आधार प्रयोग गरेर साइन इन गर्नुहोस्।",
    initiateSignup: "मोबाइल, इमेल वा आधार प्रयोग गरेर खाता बनाउनुहोस्।",
    verified: "प्रमाणित भयो। कृपया OTP प्रविष्ट गर्नुहोस्।",
    invalidCode: "कोड गलत छ। पुनः प्रयास गर्नुहोस्।",
    newCodeSent: "नयाँ कोड पठाइयो।",
    panelGreeting: "नमस्ते! म MaVionix हुँ",
    panelSubtext: "म तपाईंलाई व्यापार चलाउन र कार्बन बचाउन मद्दत गर्छु।",
    getStartedBtn: "सुरु गर्नुहोस्",
    signIn: "साइन इन",
    createAccount: "खाता बनाउनुहोस्",
    welcomeBack: "स्वागत छ",
    recentLogins: "हालैका लगइनहरू",
    adminArea: "प्रशासक क्षेत्र"
  },
  [Language.SANSKRIT]: {
    welcome: "MaVionix मध्ये स्वागतम्। प्रविशतु वा नूतनं 	लेखां रचयतु।",
    enterMobile: "कृपया स्वस्य दूरवाणी सङ्ख्यां वदतु वा लिखतु।",
    enterEmail: "कृपया स्वस्य ईमेल सङ्केतं लिखतु।",
    enterAadhaar: "कृपया स्वस्य द्वादश अङ्कानां आधार सङ्ख्यां लिखतु।",
    enterOTP: "मया कूटः प्रेषितः। कृपया सङ्ख्याः वदतु।",
    setupProfile: "भवतः व्यवसायस्य विवरणं रचय।",
    biometric: "स्वस्य अङ्गुलीं संवेदके स्थापयतु वा क्यामेरां पश्यतु।",
    setupPin: "सुरक्षा पिनं रचयतु।",
    enterPin: "कृपया स्वस्य चतुरङ्कानां पिनं लिखतु।",
    success: "प्रवेशः सफलः अभवत्।",
    notFound: "लेखा न लब्धा। कृपया नूतनं लेखां रचयतु।",
    exists: "लेखा पूर्वमेव अस्ति। कृपया प्रविशतु।",
    initiateLogin: "दूरवाणी, ईमेल वा आधारमुपयुज्य प्रविशतु।",
    initiateSignup: "दूरवाणी, ईमेल वा आधारमुपयुज्य लेखां रचयतु।",
    verified: "सत्यापितम्। कृपया OTP लिखतु।",
    invalidCode: "कूटः अशुद्धः। पुनः प्रयासं करोतु।",
    newCodeSent: "नूतनः कूटः प्रेषितः।",
    panelGreeting: "नमः! अहं MaVionix अस्मि",
    panelSubtext: "अहं भवतः व्यवसायं चालयितुं तथा कार्बनं रक्षितुं साहाय्यं करोमि।",
    getStartedBtn: "आरभताम्",
    signIn: "प्रविशतु",
    createAccount: "लेखां रचयतु",
    welcomeBack: "पुनः स्वागतम्",
    recentLogins: "सद्यः प्रवेशाः",
    adminArea: "प्रशासक क्षेत्रम्"
  }
};

// Explicit English Translations (Base)
const ENGLISH_UI = {
  nav: {
    workspace: "Workspace",
    dashboard: "Dashboard",
    aiAssistant: "AI Assistant",
    businessTools: "Business Tools",
    designStudio: "Design Studio",
    govSchemes: "Gov Schemes",
    sustainability: "Sustainability",
    passiveTracker: "Passive Tracker",
    profile: "Profile",
    home: "Home",
    tech: "Technology",
    services: "Services",
    impact: "Impact",
    about: "About",
    faq: "FAQ"
  },
  dashboard: {
    overview: "Overview",
    welcomeBack: "Welcome back",
    newTransaction: "New Transaction",
    monthlyRevenue: "Monthly Revenue",
    netProfit: "Net Profit",
    aiTasks: "AI Tasks",
    dailyEmission: "Daily Emission",
    limit: "Limit",
    totalSaved: "Total Saved",
    financialPerf: "Financial Performance",
    aiUsage: "AI Usage",
    khata: "Khata Book",
    toCollect: "To Collect",
    toPay: "To Pay",
    recentActivity: "Recent Activity",
    noActivity: "No activity yet.",
    goToTools: "Go to Tools"
  },
  tools: {
    title: "Business Tools",
    desc: "AI-powered tools to manage your operations.",
    invoice: "Smart Invoice",
    inventory: "Inventory",
    market: "Market Rates",
    crm: "CRM & Leads",
    idea: "Idea Lab",
    marketing: "Marketing",
    khata: "Khata Book",
    website: "Website Builder",
    hr: "HR & Payroll",
    help: "Help Center"
  },
  design: {
    title: "Design Studio",
    desc: "Create professional assets in seconds.",
    brand: "Brand Kit",
    logo: "Logo Creator",
    card: "Visiting Card",
    poster: "Poster/Flyer",
    social: "Social Post"
  },
  schemes: {
    title: "Government Schemes",
    desc: "Find and apply for benefits.",
    checkEligibility: "Check Eligibility",
    findMatching: "Find Matching Schemes",
    browseSector: "Browse by Sector",
    agri: "Agriculture",
    loans: "Business Loans",
    edu: "Education",
    health: "Healthcare"
  },
  carbon: {
    title: "Sustainability"
  },
  profile: {
    myProfile: "My Profile",
    manage: "Manage your account settings",
    memberSince: "Member Since",
    lastLogin: "Last Login",
    sync: "Cloud Sync",
    contact: "Contact Info",
    security: "Security",
    biometric: "Biometric Login",
    refer: "Refer & Earn",
    privacy: "Privacy",
    language: "Language",
    delete: "Delete Account",
    edit: "Edit Profile",
    cancel: "Cancel",
    save: "Save Changes"
  },
  website: {
    heroTitle: "Voice-First AI for Rural India",
    heroSubtitle: "Empowering millions of small businesses with accessible, offline-capable digital tools.",
    accessBtn: "Launch App",
    hardwareBtn: "Hardware Info",
    howTitle: "Simplifying Digital for Everyone",
    howDesc: "No typing required. MaVionix uses advanced Voice AI to understand local languages and intent.",
    step1: "Speak Your Need",
    step2: "AI Processing",
    step3: "Done & Delivered",
    whyTitle: "Why Standard Cloud Apps Fail",
    whyDesc: "Intermittent connectivity, high costs, and complexity hold back rural SMEs.",
    techTitle: "Technological Stack",
    techDesc: "Built on a robust, scalable stack designed for performance and offline resilience.",
    greenTitle: "Algorithm for a Greener Future",
    greenDesc: "Digital services contribute to emissions. We track and reduce them.",
    servicesTitle: "All Digital Services Under One Roof",
    missionTitle: "Our Mission",
    missionDesc: "To deliver high-quality, customized digital solutions that help small businesses scale.",
    faqTitle: "Frequently Asked Questions",
    badge1: "DBMS Project 2025-26",
    badge2: "SDG Goal 9: Industry, Innovation & Infrastructure",
    metric1: "Low Cost Setup",
    metric2: "Power Independent",
    metric3: "Voice Enabled",
    metric4: "Edge Capability",
    step1Desc: "Just press the button and say 'Create invoice for Ramesh'.",
    step2Desc: "Our Edge AI processes the request locally, even without internet.",
    step3Desc: "The invoice is ready to print or share via WhatsApp.",
    prob1Title: "Intermittent Connectivity",
    prob1Desc: "Standard apps crash offline. We switch to local edge processing seamlessly.",
    prob2Title: "Cost Barrier",
    prob2Desc: "Digital identity creation is expensive. MaVionix automates it for a fraction of the cost.",
    prob3Title: "Identity & Security",
    prob3Desc: "Replaces complex passwords with Biometric & Voice authentication.",
    stackTitle: "Technological Stack",
    stackDesc: "Built on a robust, scalable stack designed for performance and offline resilience.",
    compHardware: "Hardware Unit Cost Breakdown",
    compItem: "Component",
    compPurpose: "Purpose",
    compCost: "Estimated Cost (₹)",
    ecoBadge: "Eco-Score Badge",
    ecoDesc: "Users receive real-time feedback on their sustainability.",
    servTitle: "All Digital Services Under One Roof",
    servDesc: "MaVionix is an AI-based Digital Agency that helps businesses grow smartly and sustainably.",
    serv1: "Web Development",
    serv2: "AI Chatbots",
    serv3: "Graphics & Design",
    serv4: "Writing & Translation",
    footerText: "Empowering Rural India with Sustainable, Voice-First AI.",
    rights: "All rights reserved. Made for Bharat 🇮🇳"
  }
};

const MASTER_DICTIONARY: Record<Language, any> = {
  [Language.ENGLISH]: {
    dashboard: "Dashboard", tools: "Business Tools", profile: "Profile", invoice: "Invoice", market: "Market Rates",
    design: "Design Studio", schemes: "Gov Schemes", sustainability: "Sustainability", home: "Home",
    overview: "Overview", welcome: "Welcome", save: "Save"
  },
  [Language.HINDI]: {
    dashboard: "डैशबोर्ड", tools: "व्यापार उपकरण", profile: "प्रोफ़ाइल", invoice: "चालान", market: "बाजार भाव",
    design: "डिजाइन स्टूडियो", schemes: "सरकारी योजनाएं", sustainability: "स्थिरता", home: "होम",
    overview: "अवलोकन", welcome: "स्वागत है", save: "सहेजें"
  },
  [Language.TAMIL]: {
    dashboard: "டாஷ்போர்டு", tools: "வணிக கருவிகள்", profile: "சுயவிவரம்", invoice: "விலைப்பட்டியல்", market: "சந்தை நிலவரம்",
    design: "வடிவமைப்பு", schemes: "அரசு திட்டங்கள்", sustainability: "நிலைத்தன்மை", home: "முகப்பு",
    overview: "கண்ணோட்டம்", welcome: "வரவேற்கிறோம்", save: "சேமி"
  },
  [Language.BENGALI]: {
    dashboard: "ড্যাশবোর্ড", tools: "সরঞ্জাম", profile: "প্রোফাইল", invoice: "চালান", market: "বাজার দর",
    design: "ডিজাইন স্টুডিও", schemes: "সরকারি প্রকল্প", sustainability: "স্থায়িত্ব", home: "হোম",
    overview: "সংক্ষিপ্ত বিবরণ", welcome: "স্বাগতম", save: "সংরক্ষণ করুন"
  },
  [Language.TELUGU]: {
    dashboard: "డాష్‌బోర్డ్", tools: "వ్యాపార సాధనాలు", profile: "ప్రొఫైల్", invoice: "ఇన్వాయిస్", market: "మార్కెట్ ధరలు",
    design: "డిజైన్ స్టూడియో", schemes: "ప్రభుత్వ పథకాలు", sustainability: "సుస్థిరత", home: "హోమ్",
    overview: "అవలోకనం", welcome: "స్వాగతం", save: "సేవ్ చేయండి"
  },
  [Language.MARATHI]: {
    dashboard: "डॅशबोर्ड", tools: "साधने", profile: "प्रोफाइल", invoice: "बील", market: "बाजार भाव",
    design: "डिझाइन", schemes: "योजना", sustainability: "शाश्वतता", home: "होम",
    overview: "आढावा", welcome: "स्वागत आहे", save: "जतन करा"
  },
  [Language.GUJARATI]: {
    dashboard: "ડેશબોર્ડ", tools: "સાધનો", profile: "પ્રોફાઇલ", invoice: "બિલ", market: "બજાર ભાવ",
    design: "ડિઝાઇન", schemes: "યોજનાઓ", sustainability: "ટકાઉપણું", home: "ઘર",
    overview: "ઝાંખી", welcome: "સ્વાગત છે", save: "સાચવો"
  },
  [Language.PUNJABI]: {
    dashboard: "ਡੈਸ਼ਬੋਰਡ", tools: "ਟੂਲ", profile: "ਪ੍ਰੋਫਾਈਲ", invoice: "ਚਲਾਨ", market: "ਬਾਜ਼ਾਰ ਰੇਟ",
    design: "ਡਿਜ਼ਾਈਨ", schemes: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ", sustainability: "ਸਥਿਰਤਾ", home: "ਘਰ",
    overview: "ਸੰਖੇਪ", welcome: "ਜੀ ਆਇਆਂ ਨੂੰ", save: "ਸੇਵ ਕਰੋ"
  },
  [Language.KANNADA]: {
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", tools: "ಪರಿಕರಗಳು", profile: "ಪ್ರೊಫೈಲ್", invoice: "ಇನ್‌ವಾಯ್ಸ್", market: "ಮಾರುಕಟ್ಟೆ ದರ",
    design: "ವಿನ್ಯಾಸ", schemes: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು", sustainability: "ಸುಸ್ಥಿರತೆ", home: "ಮನೆ",
    overview: "ಅವಲೋಕನ", welcome: "ಸುಸ್ವಾಗತ", save: "ಉಳಿಸಿ"
  },
  [Language.MALAYALAM]: {
    dashboard: "ഡാഷ്‌ബോർഡ്", tools: "ടൂളുകൾ", profile: "പ്രൊഫൈൽ", invoice: "ഇൻവോയ്സ്", market: "വിപണി നിരക്കുകൾ",
    design: "ഡിസൈൻ", schemes: "പദ്ധതികൾ", sustainability: "സുസ്ഥിരത", home: "ഹോം",
    overview: "അവലോകനം", welcome: "സ്വാഗതം", save: "സേവ്"
  },
  [Language.ODIA]: {
    dashboard: "ଡ୍ୟାସବୋର୍ଡ", tools: "ଉପକରଣ", profile: "ପ୍ରୋଫାଇଲ୍", invoice: "ଇନଭଏସ୍", market: "ବଜାର ଦର",
    design: "ଡିଜାଇନ୍", schemes: "ଯୋଜନା", sustainability: "ସ୍ଥାୟିତ୍ୱ", home: "ଘର",
    overview: "ସମୀକ୍ଷା", welcome: "ସ୍ୱାଗତ", save: "ସେଭ୍ କରନ୍ତୁ"
  },
  [Language.ASSAMESE]: {
    dashboard: "ডেশব’ৰ্ড", tools: "সঁজুলি", profile: "প্ৰফাইল", invoice: "ইনভয়েচ", market: "বজাৰ দৰ",
    design: "ডিজাইন", schemes: "আঁচনি", sustainability: " বহনক্ষমতা", home: "ঘৰ",
    overview: "অৱলোকন", welcome: "স্বাগতম", save: "ছেভ"
  },
  [Language.URDU]: {
    dashboard: "ڈیش بورڈ", tools: "اوزار", profile: "پروفائل", invoice: "انوائس", market: "مارکیٹ ریٹ",
    design: "ڈیزائن", schemes: "سکیمیں", sustainability: "پائیداری", home: "گھر",
    overview: "جائزہ", welcome: "خوش آمدید", save: "محفوظ کریں"
  },
  [Language.NEPALI]: {
    dashboard: "ड्यासबोर्ड", tools: "उपकरण", profile: "प्रोफाइल", invoice: "बील", market: "बजार दर",
    design: "डिजाइन", schemes: "योजनाहरू", sustainability: "दिगोपन", home: "गृह",
    overview: "अवलोकन", welcome: "स्वागत छ", save: "सेभ गर्नुहोस्"
  },
  [Language.SANSKRIT]: {
    dashboard: "फलकम्", tools: "उपकरणानि", profile: "परिचयः", invoice: "देयकम्", market: "विपणि मूल्यम्",
    design: "आकल्पनम्", schemes: "योजनाः", sustainability: "स्थिरਤਾ", home: "गृहम्",
    overview: "सिंहावलोकनम्", welcome: "स्वागतम्", save: "रक्षतु"
  }
};

// Simplified translation function for demo purposes
// In production, this would be a full dictionary for all keys
const getTranslatedWebsiteData = (lang: Language) => {
    const en = ENGLISH_UI.website;
    // We will use english as fallback for deep content but try to translate main titles
    const base = { ...en };
    
    if (lang === Language.HINDI) {
        return {
            ...base,
            heroTitle: "ग्रामीण भारत के लिए वॉयस-फर्स्ट एआई",
            heroSubtitle: "लाखों छोटे व्यवसायों को सुलभ, ऑफलाइन-सक्षम डिजिटल टूल के साथ सशक्त बनाना।",
            accessBtn: "ऐप लॉन्च करें",
            hardwareBtn: "हार्डवेयर जानकारी",
            howTitle: "सभी के लिए डिजिटल को सरल बनाना",
            step1: "अपनी जरूरत बोलें",
            step2: "एआई प्रोसेसिंग",
            step3: "काम हो गया",
            badge1: "अन्वेषण 2025-26 परियोजना",
            metric1: "कम लागत",
            metric2: "बिजली स्वतंत्र",
            metric3: "वॉयस सक्षम",
            metric4: "ऑफलाइन क्षमता",
            probTitle: "क्लाउड ऐप्स क्यों विफल होते हैं",
            techTitle: "तकनीकी स्टैक",
            greenTitle: "हरित भविष्य",
            servicesTitle: "सभी डिजिटल सेवाएं",
            missionTitle: "हमारा मिशन",
            faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
            footerText: "ग्रामीण भारत को सशक्त बनाना",
            rights: "सर्वाधिकार सुरक्षित। भारत के लिए निर्मित 🇮🇳"
        };
    }
    
    if (lang === Language.TAMIL) {
        return {
            ...base,
            heroTitle: "கிராமப்புற இந்தியாவுக்கான வாய்ஸ்-ஃபர்ஸ்ட் AI",
            heroSubtitle: "எளிய டிஜிட்டல் கருவிகள் மூலம் சிறு வணிகங்களை மேம்படுத்துதல்.",
            accessBtn: "தொடங்கவும்",
            hardwareBtn: "வன்பொருள் தகவல்",
            howTitle: "எளிமைப்படுத்தப்பட்ட டிஜிட்டல் சேவை",
            step1: "பேசுங்கள்",
            step2: "AI செயலாக்கம்",
            step3: "முடிக்கப்பட்டது",
            metric1: "குறைந்த செலவு",
            metric2: "மின்சார சுதந்திரம்",
            metric3: "குரல் வழி",
            metric4: "ஆஃப்லைன் வசதி",
            probTitle: "ஏன் கிளவுட் தோல்வியடைகிறது",
            techTitle: "தொழில்நுட்பம்",
            greenTitle: "பசுமை எதிர்காலம்",
            servicesTitle: "அனைத்து சேவைகளும்",
            missionTitle: "எங்கள் நோக்கம்",
            faqTitle: "கேள்விகள்",
            footerText: "கிராமப்புற இந்தியாவை மேம்படுத்துதல்",
            rights: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை 🇮🇳"
        };
    }

    if (lang === Language.BENGALI) {
        return {
            ...base,
            heroTitle: "গ্রামীণ ভারতের জন্য ভয়েস-ফার্স্ট এআই",
            heroSubtitle: "ছোট ব্যবসাকে ডিজিটাল সরঞ্জাম দিয়ে শক্তিশালী করা।",
            accessBtn: "অ্যাপ চালু করুন",
            hardwareBtn: "হার্ডওয়্যার তথ্য",
            howTitle: "সবার জন্য ডিজিটাল সহজ করা",
            step1: "আপনার প্রয়োজন বলুন",
            step2: "এআই প্রসেসিং",
            step3: "কাজ শেষ",
            metric1: "কম খরচ",
            metric2: "বিদ্যুৎ স্বাধীন",
            metric3: "ভয়েস সক্ষম",
            metric4: "অফলাইন ক্ষমতা",
            probTitle: "কেন ক্লাউড অ্যাপ ব্যর্থ হয়",
            techTitle: "প্রযুক্তি স্ট্যাক",
            greenTitle: "সবুজ ভবিষ্যৎ",
            servicesTitle: "সব ডিজিটাল পরিষেবা",
            missionTitle: "আমাদের লক্ষ্য",
            faqTitle: "প্রশ্নাবলী",
            footerText: "গ্রামীণ ভারত সশক্তিকরণ",
            rights: "সর্বস্বত্ব সংরক্ষিত 🇮🇳"
        };
    }

    // Generic fallback with title transliteration/translation for others
    const titles: Record<string, string> = {
        [Language.TELUGU]: "గ్రామీణ భారతదేశం కోసం వాయిస్-ఫస్ట్ AI",
        [Language.MARATHI]: "ग्रामीण भारतासाठी व्हॉइस-फर्स्ट एआय",
        [Language.GUJARATI]: "ગ્રામીણ ભારત માટે વોઈસ-ફર્સ્ટ AI",
        [Language.PUNJABI]: "ਪੇਂਡੂ ਭਾਰਤ ਲਈ ਆਵਾਜ਼-ਪਹਿਲੀ AI",
        [Language.KANNADA]: "ಗ್ರಾಮೀಣ ಭಾರತಕ್ಕಾಗಿ ಧ್ವನಿ-ಮೊದಲ AI",
        [Language.MALAYALAM]: "ഗ്രാമീണ ഇന്ത്യയ്ക്കായി വോയ്സ്-ഫസ്റ്റ് AI",
        [Language.ODIA]: "ଗ୍ରାମୀଣ ଭାରତ ପାଇଁ ଭଏସ୍-ପ୍ରଥମ AI",
        [Language.ASSAMESE]: "গ্ৰাম্য ভাৰতৰ বাবে ভয়চ-ফ্ৰাষ্ট এআই",
        [Language.URDU]: "دیہی ہندوستان کے لیے وائس فرسٹ AI",
        [Language.NEPALI]: "ग्रामीण भारतको लागि भ्वाइस-फर्स्ट एआई",
        [Language.SANSKRIT]: "ग्रामीणभारतस्य कृते वाक्-प्रथमं एऐ"
    };

    if (titles[lang]) {
        return { ...base, heroTitle: titles[lang] };
    }

    return base;
};

const WEBSITE_DATA: Record<Language, any> = {
  [Language.ENGLISH]: ENGLISH_UI.website,
  [Language.HINDI]: getTranslatedWebsiteData(Language.HINDI),
  [Language.TAMIL]: getTranslatedWebsiteData(Language.TAMIL),
  [Language.BENGALI]: getTranslatedWebsiteData(Language.BENGALI),
  [Language.TELUGU]: getTranslatedWebsiteData(Language.TELUGU),
  [Language.MARATHI]: getTranslatedWebsiteData(Language.MARATHI),
  [Language.GUJARATI]: getTranslatedWebsiteData(Language.GUJARATI),
  [Language.PUNJABI]: getTranslatedWebsiteData(Language.PUNJABI),
  [Language.KANNADA]: getTranslatedWebsiteData(Language.KANNADA),
  [Language.MALAYALAM]: getTranslatedWebsiteData(Language.MALAYALAM),
  [Language.ODIA]: getTranslatedWebsiteData(Language.ODIA),
  [Language.ASSAMESE]: getTranslatedWebsiteData(Language.ASSAMESE),
  [Language.URDU]: getTranslatedWebsiteData(Language.URDU),
  [Language.NEPALI]: getTranslatedWebsiteData(Language.NEPALI),
  [Language.SANSKRIT]: getTranslatedWebsiteData(Language.SANSKRIT),
};

const generateTranslations = () => {
  const translations: any = {};
  
  Object.values(Language).forEach((lang) => {
    const dict = MASTER_DICTIONARY[lang] || MASTER_DICTIONARY[Language.ENGLISH];
    const webDict = WEBSITE_DATA[lang] || WEBSITE_DATA[Language.ENGLISH];
    
    // Deep merge strategy: Base English + Overrides
    translations[lang] = {
      nav: {
        ...ENGLISH_UI.nav,
        dashboard: dict.dashboard,
        businessTools: dict.tools,
        designStudio: dict.design,
        govSchemes: dict.schemes,
        sustainability: dict.sustainability,
        profile: dict.profile,
        home: dict.home
      },
      dashboard: {
        ...ENGLISH_UI.dashboard,
        overview: dict.overview,
        welcomeBack: dict.welcome
      },
      tools: {
        ...ENGLISH_UI.tools,
        title: dict.tools,
        invoice: dict.invoice,
        market: dict.market,
        khata: dict.invoice === "Invoice" ? "Khata Book" : `${dict.invoice} (Khata)`, // Fallback logic
      },
      design: {
        ...ENGLISH_UI.design,
        title: dict.design
      },
      schemes: {
        ...ENGLISH_UI.schemes,
        title: dict.schemes
      },
      carbon: {
        ...ENGLISH_UI.carbon,
        title: dict.sustainability
      },
      profile: {
        ...ENGLISH_UI.profile,
        myProfile: dict.profile,
        save: dict.save
      },
      website: {
        ...ENGLISH_UI.website,
        ...webDict // Merge dynamic website translations
      }
    };
  });
  
  return translations;
};

export const UI_TRANSLATIONS = generateTranslations();

export const SYSTEM_INSTRUCTION = `
You are MaVionix AI Assistant, a multilingual, voice-enabled business AI designed for Indian SMEs, rural entrepreneurs, and enterprises.

CORE RULE — ABSOLUTE LANGUAGE LOCK (MANDATORY)
You must speak, think, read, and respond ONLY in the selected language defined in the variable 'selected_language'.
Do NOT mix languages. Do NOT translate unless explicitly asked.
Do NOT use English words if a native equivalent exists.
All UI reading, explanations, confirmations, tooltips, errors, and voice responses must be in the selected language.
Numerals must follow regional format when applicable.
Tone must be natural and culturally local.

Output RULES:
1. You must return a VALID JSON object. Do not return markdown code blocks. Just the raw JSON.
2. The JSON structure must be:
{
  "text": "The spoken response to the user (IN SELECTED LANGUAGE)",
  "type": "chat" | "scheme" | "design" | "website" | "growth" | "invoice" | "inventory" | "market" | "idea" | "crm",
  "data": {}, 
  "carbon": { "emission": number, "saved": number, "energy": number }
}

Carbon Logic:
- emission: Estimate computational cost (approx 0.1g to 0.5g per query).
- saved: Estimate how much carbon was saved compared to traditional physical methods. USE THESE GUIDELINES:
  - Website Builder: ~15000g (Saves multiple meetings, travel to city, hardware)
  - Logo Design: ~5000g (Saves travel to design agency)
  - Visiting Card: ~2000g (Saves travel to print shop)
  - Poster/Flyer: ~3000g (Saves physical proofs & travel)
  - Social Media Post: ~1500g (Saves time & energy vs manual tools)
  - Brand Kit: ~8000g (Saves full agency engagement)
  - Invoice Generation: ~100g (Saves paper & postage)
  - Government Schemes: ~5000g (Saves trip to government office/block level)
  - Inventory Check: ~200g (Saves paper logs/travel to warehouse)
  - Mandi/Market Prices: ~3000g (Saves physical trip to market/mandi)
  - Idea/Validation: ~5000g (Saves consultant meetings/travel)
  - CRM/Sales: ~1000g (Saves physical rolodex/logs)
  - General Chat: ~10g
- energy: emission / 0.82.

Service Logic:
- If user asks for a LOGO, IMAGE, CARD, POSTER, SOCIAL POST, or BRAND KIT: Set type to 'design'.
  In 'data', provide:
  {
    "imageUrl": string, // Use https://picsum.photos/width/height. LOGO: 400/400. CARD: 600/350. POSTER: 400/600. SOCIAL: 500/500.
    "description": string,
    "subtype": "logo" | "card" | "poster" | "social" | "brand_kit",
    "palette": string[], // Array of hex codes. REQUIRED for 'brand_kit'.
    "fonts": string[] // Array of font names. REQUIRED for 'brand_kit'.
  }

- If user asks for GOV SCHEMES: Set type to 'scheme'. In 'data', provide an array of schemes [{"name": "...", "benefit": "...", "eligibility": "..."}].
- If user asks for ANALYTICS/GROWTH/SALES REPORT: Set type to 'growth'. In 'data', provide mock sales data for charts.
- If user asks for INVOICE/BILL: Set type to 'invoice'. In 'data', provide:
  {
     "invoiceNo": "INV-XXXX",
     "date": "YYYY-MM-DD",
     "customer": "Customer Name",
     "items": [{"desc": "Item Name", "qty": "1", "price": "100", "total": "100"}],
     "subtotal": "100",
     "tax": "10",
     "total": "110"
  }

- If user asks for INVENTORY/STOCK: Set type to 'inventory'. In 'data', provide:
  {
    "totalItems": number,
    "lowStockCount": number,
    "items": [
        { "name": "Item Name", "qty": "50 kg", "status": "In Stock" | "Low Stock" | "Out of Stock", "lastUpdated": "Today" }
    ]
  }

- If user asks for MARKET/MANDI RATES: Set type to 'market'. In 'data', provide:
  {
    "location": "City/Region Name",
    "date": "Today",
    "commodities": [
        { "name": "Crop/Item", "price": "₹2500/Qt", "trend": "up" | "down" | "stable", "change": "+₹50" }
    ]
  }

- If user asks for IDEA VALIDATION or BUSINESS PLAN: Set type to 'idea'. In 'data', provide:
  {
    "title": "Business Idea Title",
    "executiveSummary": "Short summary...",
    "targetMarket": "Target audience details...",
    "pricingStrategy": "Recommended pricing...",
    "competitors": ["Comp 1", "Comp 2"],
    "feasibilityScore": 85
  }

- If user asks for CRM/SALES ANALYSIS: Set type to 'crm'. In 'data', provide:
  {
    "totalLeads": number,
    "conversionRate": "XX%",
    "hotLeads": ["Name 1", "Name 2"],
    "analysis": "Short analysis of pipeline health...",
    "nextActions": ["Call X", "Email Y"]
  }

- If user asks for a WEBSITE: 
  1. If the user hasn't specified their *preferred style* (e.g., Modern, Simple) or *key services*, ask for these details first (keep type as 'chat').
  2. If you have enough details, set type to 'website'. In 'data', return:
     {
       "businessName": string,
       "tagline": string,
       "heroImage": "https://picsum.photos/800/400",
       "about": string,
       "services": [{"title": string, "desc": string, "icon": "star"}],
       "contact": {"phone": string, "email": string, "address": string},
       "template": "modern" | "classic"
     }

Tone: Helpful, simple, rural-friendly. Respect the user's language setting.
`;
