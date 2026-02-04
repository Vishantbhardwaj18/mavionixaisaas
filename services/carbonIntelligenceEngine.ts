
import { CarbonStats, OffsetProject, OffsetTransaction, ServiceType, CarbonAction } from '../types';
import { DAILY_CARBON_LIMIT } from '../constants';

// Simulated Database for Carbon Actions
const ACTION_HISTORY_KEY = 'mavionix_carbon_history';
const OFFSET_HISTORY_KEY = 'mavionix_offset_history';

// --- Configuration & Constants ---
const EMISSION_RATES = {
  [ServiceType.CHAT]: 0.2, // g per interaction
  [ServiceType.DESIGN]: 1.5,
  [ServiceType.WEBSITE]: 2.5,
  [ServiceType.INVOICE]: 0.5,
  [ServiceType.SCHEME]: 0.5,
  [ServiceType.GROWTH]: 0.8,
  [ServiceType.INVENTORY]: 0.3,
  [ServiceType.MARKET]: 0.4,
  'idle': 0.005, // per second
  'upload': 0.5,
  'auth': 0.1
};

const MOCK_PROJECTS: OffsetProject[] = [
  {
    id: 'p1',
    name: 'Sundarbans Mangrove Restoration',
    location: 'West Bengal, India',
    type: 'forestry',
    costPerKg: 2.5, // ₹2.5 per kg CO2
    impact: 1000,
    certification: 'Gold Standard',
    partner: 'GreenFuture NGO',
    image: 'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?auto=format&fit=crop&q=80&w=300',
    description: 'Planting mangroves to protect coastlines and sequester carbon.'
  },
  {
    id: 'p2',
    name: 'Rajasthan Solar Park',
    location: 'Rajasthan, India',
    type: 'renewable',
    costPerKg: 1.8,
    impact: 1000,
    certification: 'VCS',
    partner: 'SunPower India',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=300',
    description: 'Replacing coal energy with clean solar power in the desert.'
  },
  {
    id: 'p3',
    name: 'Biomass Cookstoves',
    location: 'Rural Odisha',
    type: 'biomass',
    costPerKg: 3.0,
    impact: 1000,
    certification: 'UN CDM',
    partner: 'Rural Energy Corp',
    image: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&q=80&w=300',
    description: 'Providing clean efficient cookstoves to rural families.'
  }
];

// --- Engine Logic ---

export const getHistory = (userId: string): CarbonAction[] => {
  try {
    const raw = localStorage.getItem(`${ACTION_HISTORY_KEY}_${userId}`);
    // Return actual history or empty array. No mock generation.
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const logAction = (userId: string, type: string, emission: number) => {
  const action: CarbonAction = {
    id: Date.now().toString() + Math.random(),
    type: type as any,
    emission,
    timestamp: Date.now()
  };
  
  const history = getHistory(userId);
  history.push(action);
  // Keep last 1000 actions to prevent overflow
  if (history.length > 1000) history.shift();
  
  localStorage.setItem(`${ACTION_HISTORY_KEY}_${userId}`, JSON.stringify(history));
  return action;
};

export const getOffsetProjects = (): OffsetProject[] => {
  return MOCK_PROJECTS;
};

export const getUserOffsets = (userId: string): OffsetTransaction[] => {
  try {
    const raw = localStorage.getItem(`${OFFSET_HISTORY_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const purchaseOffset = (userId: string, project: OffsetProject, amountKg: number): OffsetTransaction => {
  const transaction: OffsetTransaction = {
    id: `TXN-${Date.now()}`,
    projectId: project.id,
    userId,
    amountKg,
    cost: amountKg * project.costPerKg,
    date: Date.now(),
    certificateUrl: '#',
    status: 'verified'
  };

  const current = getUserOffsets(userId);
  current.unshift(transaction);
  localStorage.setItem(`${OFFSET_HISTORY_KEY}_${userId}`, JSON.stringify(current));
  
  return transaction;
};

export const calculateScore = (emission: number, saved: number, offsets: number) => {
  // Score formula: Base 50 + (Saved/Emitted ratio * 10) + (Offsets * 5)
  // Normalized 0-100
  const ratio = emission > 0 ? saved / emission : 1;
  let score = 50 + (ratio * 10) + (offsets > 0 ? 20 : 0);
  return Math.min(100, Math.max(0, Math.round(score)));
};

export const aggregateDailyStats = (history: CarbonAction[]) => {
  const days: Record<string, number> = {};
  const today = new Date();
  
  // Initialize last 7 days
  for(let i=6; i>=0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days[d.toLocaleDateString('en-US', {weekday: 'short'})] = 0;
  }

  history.forEach(h => {
      const d = new Date(h.timestamp);
      // Only count if within last 7 days roughly
      if (today.getTime() - h.timestamp < 7 * 86400000) {
          const key = d.toLocaleDateString('en-US', {weekday: 'short'});
          if (days[key] !== undefined) {
              days[key] += h.emission;
          }
      }
  });

  return Object.entries(days).map(([name, value]) => ({ name, value }));
};

export const getCategoryBreakdown = (history: CarbonAction[]) => {
    const breakdown: Record<string, number> = {};
    history.forEach(h => {
        const key = h.type;
        breakdown[key] = (breakdown[key] || 0) + h.emission;
    });
    
    // Top 4 categories + Others
    const sorted = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
    const top = sorted.slice(0, 4).map(([name, value], i) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        color: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899'][i]
    }));
    
    if (sorted.length > 4) {
        const otherVal = sorted.slice(4).reduce((acc, curr) => acc + curr[1], 0);
        top.push({ name: 'Others', value: otherVal, color: '#94a3b8' });
    }
    
    return top;
};
