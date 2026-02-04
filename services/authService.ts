import { UserProfile, CarbonStats, Language, AdminRoleType } from '../types';
import { EMISSION_FACTOR, AVG_POWER_WATTS } from '../constants';

const RECENT_USERS_KEY = 'mavionix_recent_users';

// In-memory simulation of server-side storage
// In a real app, this would be Redis or a Database
interface RateLimitData {
  attempts: number;
  lastAttempt: number;
  lockedUntil: number;
}

const RATE_LIMITS: Record<string, RateLimitData> = {};
const ACTIVE_OTPS: Record<string, { code: string, expires: number }> = {};

// Helper to calc carbon for Auth actions
export const calculateAuthCarbon = (durationMs: number): CarbonStats => {
  const durationSec = durationMs / 1000;
  const energy = AVG_POWER_WATTS * durationSec; // Joules
  const emission = energy * EMISSION_FACTOR; // Grams
  // Auth usually saves a trip to a physical bank/office for verification
  const saved = 50; // Grams (Assumed savings for digital ID vs physical)
  
  return { 
    energy, 
    emission, 
    saved,
    idleEmission: 0,
    activeEmission: emission,
    idleTime: 0
  };
};

export const getKnownUsers = (): UserProfile[] => {
  try {
    const data = localStorage.getItem(RECENT_USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveUsers = (users: UserProfile[]) => {
  localStorage.setItem(RECENT_USERS_KEY, JSON.stringify(users));
};

export const deleteUser = (userId: string): UserProfile[] => {
  const users = getKnownUsers();
  const updatedUsers = users.filter(u => u.id !== userId);
  saveUsers(updatedUsers);
  return updatedUsers;
};

export const toggleUserLock = (userId: string): UserProfile | undefined => {
  const users = getKnownUsers();
  const user = users.find(u => u.id === userId);
  if (user) {
    user.isLocked = !user.isLocked;
    saveUsers(users);
  }
  return user;
};

export const resetUserPin = (userId: string): UserProfile | undefined => {
  const users = getKnownUsers();
  const user = users.find(u => u.id === userId);
  if (user) {
    user.hasPin = false; // Will force pin setup on next login
    user.storedPin = undefined; // Clear stored PIN
    saveUsers(users);
  }
  return user;
};

export const updateUserLimit = (userId: string, limit: number): UserProfile | undefined => {
  const users = getKnownUsers();
  const user = users.find(u => u.id === userId);
  if (user) {
    user.customCarbonLimit = limit;
    saveUsers(users);
  }
  return user;
};

export const updateUserRole = (userId: string, role: 'owner' | 'staff' | 'admin', adminType?: AdminRoleType): UserProfile | undefined => {
  const users = getKnownUsers();
  const user = users.find(u => u.id === userId);
  if (user) {
    user.role = role;
    if (role === 'admin') {
      user.adminType = adminType || 'viewer';
    } else {
      delete user.adminType;
    }
    saveUsers(users);
    return user;
  }
  return undefined;
};

// Generate a random 4 digit code
const generateOTPCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const canRequestOTP = (identifier: string): { allowed: boolean; waitTime?: number } => {
  const now = Date.now();
  const record = RATE_LIMITS[identifier];

  if (!record) return { allowed: true };

  // If locked
  if (record.lockedUntil > now) {
    return { allowed: false, waitTime: Math.ceil((record.lockedUntil - now) / 1000) };
  }

  // Rate limit: Max 3 requests per minute
  if (record.attempts >= 3 && (now - record.lastAttempt) < 60000) {
    // Lock for 2 minutes
    RATE_LIMITS[identifier].lockedUntil = now + 120000;
    return { allowed: false, waitTime: 120 };
  }

  // Reset if enough time passed
  if ((now - record.lastAttempt) > 60000) {
    RATE_LIMITS[identifier] = { attempts: 0, lastAttempt: now, lockedUntil: 0 };
  }

  return { allowed: true };
};

export const sendOTP = async (identifier: string): Promise<string> => {
  if (!navigator.onLine) {
    throw new Error("No internet connection");
  }

  // Check Rate Limits
  const check = canRequestOTP(identifier);
  if (!check.allowed) {
    throw new Error(`Too many requests. Please wait ${check.waitTime} seconds.`);
  }

  // Update Rate Limit Record
  if (!RATE_LIMITS[identifier]) {
    RATE_LIMITS[identifier] = { attempts: 1, lastAttempt: Date.now(), lockedUntil: 0 };
  } else {
    RATE_LIMITS[identifier].attempts += 1;
    RATE_LIMITS[identifier].lastAttempt = Date.now();
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate NEW OTP
  const code = generateOTPCode();
  
  // Store OTP with 5 minute expiration
  ACTIVE_OTPS[identifier] = {
    code: code,
    expires: Date.now() + 5 * 60 * 1000
  };

  console.log(`[DEV ONLY] OTP for ${identifier}: ${code}`);
  return code; 
};

export const verifyOTP = async (identifier: string, otp: string): Promise<{ success: boolean; requiresCaptcha?: boolean }> => {
  if (!navigator.onLine) {
    throw new Error("No internet connection");
  }

  await new Promise(resolve => setTimeout(resolve, 1000));

  const stored = ACTIVE_OTPS[identifier];
  
  // Check if OTP exists and is not expired
  if (!stored || Date.now() > stored.expires) {
    return { success: false };
  }

  // Verify Code
  if (stored.code === otp) {
    // Clear OTP after successful use to prevent replay
    delete ACTIVE_OTPS[identifier];
    // Reset rate limits on success
    delete RATE_LIMITS[identifier];
    return { success: true };
  } else {
    // Track failed attempts for CAPTCHA
    const attempts = (RATE_LIMITS[identifier]?.attempts || 0);
    // If failed more than twice, require CAPTCHA on next retry
    return { success: false, requiresCaptcha: attempts > 2 };
  }
};

export const createOrUpdateUser = (profile: UserProfile): UserProfile => {
  const users = getKnownUsers();
  
  // Try to find by ID first for updates
  let existingIndex = -1;
  
  if (profile.id) {
    existingIndex = users.findIndex(u => u.id === profile.id);
  }
  
  // Fallback to identifiers
  if (existingIndex === -1) {
    existingIndex = users.findIndex(u => 
      (u.mobile && u.mobile === profile.mobile) || 
      (u.email && u.email === profile.email) ||
      (u.aadhaar && u.aadhaar === profile.aadhaar)
    );
  }
  
  const updatedProfile = {
    ...profile,
    lastLogin: Date.now()
  };

  // Ensure usageStats initialized
  if (!updatedProfile.usageStats) {
      // If updating existing, try to keep old stats, otherwise init
      if (existingIndex >= 0 && users[existingIndex].usageStats) {
          updatedProfile.usageStats = users[existingIndex].usageStats;
      } else {
          updatedProfile.usageStats = {
              totalRevenue: 0,
              totalAiTasks: 0,
              carbon: { 
                emission: 0, 
                saved: 0, 
                energy: 0,
                idleEmission: 0,
                activeEmission: 0,
                idleTime: 0
              },
              lastActive: Date.now()
          };
      }
  }

  if (existingIndex >= 0) {
    // Preserve fields that might not be in the incoming profile update
    updatedProfile.isLocked = users[existingIndex].isLocked;
    updatedProfile.hasPin = users[existingIndex].hasPin;
    updatedProfile.hasBiometric = users[existingIndex].hasBiometric;
    updatedProfile.customCarbonLimit = users[existingIndex].customCarbonLimit; 
    
    updatedProfile.role = profile.role || users[existingIndex].role;
    updatedProfile.adminType = profile.adminType || users[existingIndex].adminType;

    // Overwrite with new profile data
    Object.assign(users[existingIndex], updatedProfile);
  } else {
    users.push(updatedProfile);
  }

  localStorage.setItem(RECENT_USERS_KEY, JSON.stringify(users));
  return updatedProfile;
};

export const findUser = (identifier: string): UserProfile | undefined => {
  const users = getKnownUsers();
  return users.find(u => u.mobile === identifier || u.email === identifier || u.aadhaar === identifier);
};