
import React, { useState, useEffect } from 'react';
import { Leaf, Wind, TrendingDown, Zap, Target, Award, ArrowUpRight, Info, AlertTriangle, Clock, Download, Share2, Activity, Battery } from 'lucide-react';
import { CarbonStats, Language, OffsetProject } from '../types';
import { DailyEmissionChart, UsageBreakdownChart } from './carbon/CarbonCharts';
import OffsetMarketplace from './carbon/OffsetMarketplace';
import { getHistory, aggregateDailyStats, getCategoryBreakdown, getOffsetProjects, purchaseOffset, getUserOffsets } from '../services/carbonIntelligenceEngine';
import { DAILY_CARBON_LIMIT, UI_TRANSLATIONS } from '../constants';
import { useCarbon } from './CarbonContext';

interface Props {
  stats: CarbonStats; // Legacy prop, we'll try to use context if available
  limit?: number;
  language: Language;
  userId?: string;
  isDarkMode?: boolean;
}

const CarbonDashboard: React.FC<Props> = ({ stats: initialStats, limit, language, userId, isDarkMode = false }) => {
  // Try to use global context, fallback to props
  const { stats: contextStats } = useCarbon();
  const liveStats = contextStats || initialStats;

  // State
  const [activeTab, setActiveTab] = useState<'overview' | 'offsets' | 'report'>('overview');
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [breakdownData, setBreakdownData] = useState<any[]>([]);
  const [userOffsets, setUserOffsets] = useState<any[]>([]);
  
  // Theme Helper
  const theme = {
      card: isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200',
      text: isDarkMode ? 'text-slate-100' : 'text-slate-800',
      subText: isDarkMode ? 'text-slate-400' : 'text-slate-500',
      accentBg: isDarkMode ? 'bg-slate-900' : 'bg-slate-50',
  };

  // Initialize Data
  useEffect(() => {
      if (userId) {
          const rawHistory = getHistory(userId);
          setHistoryData(aggregateDailyStats(rawHistory));
          setBreakdownData(getCategoryBreakdown(rawHistory));
          setUserOffsets(getUserOffsets(userId));
      } else {
          // Fallback or Admin view: ensure empty if no ID
          setHistoryData([]);
          setBreakdownData([]);
          setUserOffsets([]);
      }
  }, [userId, liveStats.emission]); // Refresh when emission updates

  const t = UI_TRANSLATIONS[language]?.carbon || UI_TRANSLATIONS[Language.ENGLISH].carbon;
  const effectiveLimit = limit || DAILY_CARBON_LIMIT;
  const limitProgress = Math.min(100, (liveStats.emission / effectiveLimit) * 100);
  const isLimitReached = liveStats.emission >= effectiveLimit;
  const isWarning = !isLimitReached && limitProgress > 75;
  const hasUsageData = historyData.some(d => d.value > 0);

  const handlePurchase = (project: OffsetProject, amount: number) => {
      if (!userId) return;
      const txn = purchaseOffset(userId, project, amount);
      setUserOffsets(prev => [txn, ...prev]);
      alert(`Successfully purchased ${amount}kg offset from ${project.name}! Certificate generated.`);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in max-w-6xl mx-auto pb-24">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className={`text-3xl font-bold flex items-center gap-3 ${theme.text}`}>
            <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
              <Leaf size={32} />
            </div>
            {t.title}
          </h2>
          <p className={`${theme.subText} mt-1`}>Real-time Environmental Impact Tracker</p>
        </div>
        
        <div className="flex gap-2">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition ${activeTab === 'overview' ? 'bg-slate-800 text-white' : `${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-50'}`}`}
            >
                Overview
            </button>
            <button 
                onClick={() => setActiveTab('offsets')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition ${activeTab === 'offsets' ? 'bg-slate-800 text-white' : `${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-50'}`}`}
            >
                Offset Market
            </button>
        </div>
      </div>

      {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Real-time Status Card */}
            <div className={`p-6 rounded-3xl border transition-all relative overflow-hidden ${isLimitReached ? 'bg-red-50 border-red-200' : isWarning ? 'bg-amber-50 border-amber-200' : theme.card}`}>
                <div className="flex justify-between items-end mb-4 relative z-10">
                    <div>
                        <p className={`text-xs font-bold uppercase tracking-wider opacity-60 mb-1 ${isLimitReached || isWarning ? 'text-slate-800' : theme.subText}`}>Today's Emission</p>
                        <h3 className={`text-4xl font-bold font-mono tracking-tight ${isLimitReached || isWarning ? 'text-slate-900' : theme.text}`}>
                            {liveStats.emission.toFixed(3)}<span className="text-lg opacity-60 font-sans">g CO₂</span>
                        </h3>
                    </div>
                    <div className="text-right">
                        <p className={`text-xs font-bold uppercase tracking-wider opacity-60 mb-1 ${isLimitReached || isWarning ? 'text-slate-800' : theme.subText}`}>Daily Quota</p>
                        <p className={`text-xl font-bold ${isLimitReached || isWarning ? 'text-slate-900' : theme.text}`}>{effectiveLimit}g</p>
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className="relative h-4 bg-black/5 rounded-full overflow-hidden mb-2 z-10">
                    <div 
                        className={`h-full transition-all duration-300 ease-linear ${isLimitReached ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${limitProgress}%` }}
                    ></div>
                </div>
                
                <div className={`flex justify-between text-xs font-bold opacity-60 relative z-10 ${isLimitReached || isWarning ? 'text-slate-800' : theme.text}`}>
                    <span>{limitProgress.toFixed(1)}% Used</span>
                    <span>{isLimitReached ? 'Limit Exceeded' : `${(effectiveLimit - liveStats.emission).toFixed(2)}g Remaining`}</span>
                </div>

                {/* Granular Breakdown Mini-Bar */}
                <div className={`mt-4 flex gap-4 text-[10px] uppercase font-bold tracking-wider opacity-70 relative z-10 ${isLimitReached || isWarning ? 'text-slate-800' : theme.text}`}>
                    <div className="flex items-center gap-1">
                        <Activity size={12} /> Active: {(liveStats.activeEmission || 0).toFixed(2)}g
                    </div>
                    <div className="flex items-center gap-1">
                        <Battery size={12} /> Idle Load: {(liveStats.idleEmission || 0).toFixed(2)}g ({Math.floor((liveStats.idleTime || 0)/60)}m)
                    </div>
                </div>

                {/* Background Decor */}
                <div className={`absolute -right-10 -bottom-10 opacity-10 ${isLimitReached ? 'text-red-500' : 'text-emerald-500'}`}>
                    <CloudIcon size={180} />
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`md:col-span-2 p-6 rounded-3xl border shadow-sm ${theme.card}`}>
                    <h3 className={`font-bold mb-6 ${theme.text}`}>Emission Trend (7 Days)</h3>
                    {hasUsageData ? (
                        <DailyEmissionChart data={historyData} />
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">
                            <Wind size={32} className="mb-2 opacity-50" />
                            <p>Start using AI tools to see your footprint.</p>
                        </div>
                    )}
                </div>
                <div className={`p-6 rounded-3xl border shadow-sm ${theme.card}`}>
                    <h3 className={`font-bold mb-6 ${theme.text}`}>Source Breakdown</h3>
                    {hasUsageData ? (
                        <UsageBreakdownChart data={breakdownData} />
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">
                            <Zap size={32} className="mb-2 opacity-50" />
                            <p>No activity recorded yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-emerald-900/20 border-emerald-900/50' : 'bg-emerald-50 border-emerald-100'}`}>
                    <div className="text-emerald-600 mb-2"><TrendingDown size={24} /></div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-900'}`}>{liveStats.saved.toFixed(1)}g</div>
                    <div className={`text-xs font-bold ${isDarkMode ? 'text-emerald-500' : 'text-emerald-700'}`}>Carbon Avoided</div>
                </div>
                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-blue-900/20 border-blue-900/50' : 'bg-blue-50 border-blue-100'}`}>
                    <div className="text-blue-600 mb-2"><Zap size={24} /></div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-900'}`}>{liveStats.energy.toFixed(4)}J</div>
                    <div className={`text-xs font-bold ${isDarkMode ? 'text-blue-500' : 'text-blue-700'}`}>Energy Used</div>
                </div>
                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-purple-900/20 border-purple-900/50' : 'bg-purple-50 border-purple-100'}`}>
                    <div className="text-purple-600 mb-2"><Target size={24} /></div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-900'}`}>92/100</div>
                    <div className={`text-xs font-bold ${isDarkMode ? 'text-purple-500' : 'text-purple-700'}`}>Sustainability Score</div>
                </div>
                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-orange-900/20 border-orange-900/50' : 'bg-orange-50 border-orange-100'}`}>
                    <div className="text-orange-600 mb-2"><Award size={24} /></div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-900'}`}>{userOffsets.length}</div>
                    <div className={`text-xs font-bold ${isDarkMode ? 'text-orange-500' : 'text-orange-700'}`}>Offsets Purchased</div>
                </div>
            </div>

            {/* Eco Tips (Only show if data exists) */}
            {hasUsageData && (
                <div className={`border rounded-3xl p-6 flex items-start gap-4 ${isDarkMode ? 'bg-indigo-900/20 border-indigo-900/50' : 'bg-indigo-50 border-indigo-100'}`}>
                    <div className={`p-2 rounded-xl text-indigo-600 hidden md:block ${isDarkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'}`}>
                        <Info size={24} />
                    </div>
                    <div>
                        <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-900'}`}>Smart Recommendation</h4>
                        <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-indigo-300' : 'text-indigo-800'}`}>
                            Based on your recent activity, try grouping your "Design" tasks to reduce redundant rendering energy by 15%.
                        </p>
                    </div>
                </div>
            )}
          </div>
      )}

      {activeTab === 'offsets' && (
          <div className="animate-fade-in space-y-8">
              <OffsetMarketplace 
                  projects={getOffsetProjects()} 
                  onPurchase={handlePurchase}
              />
              
              {/* Transaction History */}
              <div className={`rounded-3xl border p-6 ${theme.card}`}>
                  <h3 className={`font-bold mb-4 ${theme.text}`}>Your Offset History</h3>
                  {userOffsets.length === 0 ? (
                      <div className={`text-center py-8 text-sm ${theme.subText}`}>
                          No offsets purchased yet. Start your journey above!
                      </div>
                  ) : (
                      <div className="space-y-3">
                          {userOffsets.map((txn) => (
                              <div key={txn.id} className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                                  <div className="flex items-center gap-3">
                                      <div className={`p-2 rounded-full text-emerald-600 ${isDarkMode ? 'bg-emerald-900/20' : 'bg-emerald-100'}`}>
                                          <Leaf size={16} />
                                      </div>
                                      <div>
                                          <p className={`text-sm font-bold ${theme.text}`}>{txn.amountKg}kg Offset</p>
                                          <p className={`text-xs ${theme.subText}`}>{new Date(txn.date).toLocaleDateString()}</p>
                                      </div>
                                  </div>
                                  <div className="text-right">
                                      <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md">Verified</span>
                                      <button className="text-xs text-indigo-600 block mt-1 hover:underline flex items-center justify-end gap-1">
                                          <Download size={10} /> Certificate
                                      </button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          </div>
      )}

    </div>
  );
};

// Helper Icon
const CloudIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.5 19C19.9853 19 22 16.9853 22 14.5C22 12.132 20.177 10.244 17.812 10.039C17.447 5.764 13.864 2.5 9.5 2.5C5.621 2.5 2.368 5.127 1.5 8.761C1.332 8.75 1.165 8.75 1 8.75C0.447715 8.75 0 9.19772 0 9.75C0 10.3023 0.447715 10.75 1 10.75C3.39 10.75 5.467 11.97 6.67 13.785C7.26 13.277 8.028 13 8.875 13C10.739 13 12.25 14.511 12.25 16.375C12.25 17.201 11.989 17.958 11.545 18.563C11.83 18.835 12.15 19 12.5 19H17.5Z"/>
    </svg>
);

export default CarbonDashboard;
