
export enum Language {
  ENGLISH = 'en-US',
  HINDI = 'hi-IN',
  TAMIL = 'ta-IN',
  BENGALI = 'bn-IN',
  TELUGU = 'te-IN',
  MARATHI = 'mr-IN',
  GUJARATI = 'gu-IN',
  PUNJABI = 'pa-IN',
  KANNADA = 'kn-IN',
  MALAYALAM = 'ml-IN',
  ODIA = 'or-IN',
  ASSAMESE = 'as-IN',
  URDU = 'ur-IN',
  NEPALI = 'ne-NP',
  SANSKRIT = 'sa-IN'
}

export enum ServiceType {
  CHAT = 'chat',
  SCHEME = 'scheme', // Government schemes
  DESIGN = 'design', // Logo/Graphics
  WEBSITE = 'website', // Website generation
  GROWTH = 'growth', // Analytics/CRM
  INVOICE = 'invoice', // Bill generation
  INVENTORY = 'inventory', // Stock management
  MARKET = 'market', // Mandi prices
  IDEA = 'idea', // Idea Validation
  CRM = 'crm', // Sales & Customers
  HR = 'hr', // HR & Team
}

export interface CarbonBreakdown {
  step: string;
  emission: number;
  energy: number;
}

export interface CarbonStats {
  emission: number; // in grams (Total)
  saved: number; // in grams vs traditional method
  energy: number; // in Joules
  inputMethod?: 'voice' | 'text' | 'biometric' | 'pin';
  breakdown?: CarbonBreakdown[];
  
  // New Granular Tracking
  idleEmission: number; // Passive screen/network usage
  activeEmission: number; // Direct user interaction
  idleTime: number; // Seconds spent idle
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  type?: ServiceType;
  metadata?: any; // To store structured data like scheme details or image URLs
  carbon?: CarbonStats;
}

export interface ChatThread {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: number;
}

export interface UserContext {
  businessName: string;
  businessType: string;
  location: string;
  language: Language;
}

export interface PrivacySettings {
  aiPersonalization: boolean;
  cloudBackup: boolean;
  marketing: boolean;
}

// New Carbon Types
export interface OffsetProject {
  id: string;
  name: string;
  location: string;
  type: 'forestry' | 'renewable' | 'biomass' | 'water';
  costPerKg: number; // in INR
  impact: number; // grams CO2e per unit
  certification: string;
  partner: string;
  image: string;
  description: string;
}

export interface OffsetTransaction {
  id: string;
  projectId: string;
  userId: string;
  amountKg: number;
  cost: number;
  date: number;
  certificateUrl: string;
  status: 'verified' | 'pending';
}

export interface CarbonAction {
  id: string;
  type: ServiceType | 'idle' | 'upload' | 'auth';
  emission: number;
  timestamp: number;
}

export interface UserUsageStats {
  totalRevenue: number;
  totalAiTasks: number;
  carbon: CarbonStats;
  lastActive: number;
  // New detailed tracking
  carbonHistory?: CarbonAction[]; 
  offsetHistory?: OffsetTransaction[];
  sustainabilityScore?: number; // 0-100
}

export type AdminRoleType = 'super_admin' | 'support_admin' | 'viewer';

export interface UserProfile extends UserContext {
  id: string;
  ownerName?: string;
  mobile?: string;
  email?: string;
  aadhaar?: string;
  role: 'owner' | 'staff' | 'admin';
  adminType?: AdminRoleType; // Only relevant if role is 'admin'
  lastLogin: number;
  consentGiven?: number;
  hasBiometric?: boolean;
  hasPin?: boolean;
  storedPin?: string; // MOCK ONLY: In real app, never store plain PIN
  isLocked?: boolean;
  privacySettings?: PrivacySettings;
  profileImage?: string;
  subscription?: 'free' | 'pro';
  socialLinks?: {
    website?: string;
    instagram?: string;
    facebook?: string;
  };
  usageStats?: UserUsageStats;
  customCarbonLimit?: number;
}

export interface AuthSession {
  user: UserProfile | null;
  isAuthenticated: boolean;
  carbonSession: CarbonStats;
}

// Global augmentation for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
