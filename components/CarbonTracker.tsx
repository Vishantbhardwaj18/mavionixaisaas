import React from 'react';
import { Leaf, Wind, TrendingDown, Zap } from 'lucide-react';
import { CarbonStats } from '../types';

interface Props {
  stats: CarbonStats;
  compact?: boolean;
}

const CarbonTracker: React.FC<Props> = ({ stats, compact = false }) => {
  // Format numbers
  const emission = stats.emission.toFixed(2);
  const saved = stats.saved.toFixed(2);
  const netImpact = (stats.saved - stats.emission).toFixed(2);

  if (compact) {
    return (
      <div className="flex items-center space-x-2 text-[10px] md:text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shadow-sm animate-pulse-slow">
        <Leaf size={12} className="fill-emerald-200" />
        <span>Used {emission}g</span>
        <span className="text-emerald-300">|</span>
        <span className="font-bold">Avoided {saved}g CO₂</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-emerald-50/50 p-4 rounded-2xl shadow-sm border border-emerald-100 mb-4 animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
          <div className="bg-emerald-100 p-1 rounded-md">
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          Eco Impact Tracker
        </h3>
        <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
            <Zap size={10} fill="currentColor" /> Live
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-8 h-8 bg-red-50 rounded-bl-full z-0 transition-all group-hover:scale-110"></div>
          <div className="relative z-10">
             <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                <Wind size={10} /> Emissions
             </div>
             <div className="text-lg font-bold text-slate-700 leading-none">
                {emission}<span className="text-[10px] text-slate-400 font-normal ml-0.5">g</span>
             </div>
             <div className="text-[9px] text-slate-400 mt-1">
                Server Energy
             </div>
          </div>
        </div>

        <div className="bg-emerald-600 p-3 rounded-xl border border-emerald-600 shadow-md relative overflow-hidden group text-white">
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full z-0 transition-all group-hover:scale-110"></div>
          <div className="relative z-10">
             <div className="text-[10px] uppercase font-bold text-emerald-200 mb-1 flex items-center gap-1">
                <TrendingDown size={10} /> Avoided
             </div>
             <div className="text-lg font-bold text-white leading-none">
                {saved}<span className="text-[10px] text-emerald-200 font-normal ml-0.5">g</span>
             </div>
             <div className="text-[9px] text-emerald-100 mt-1">
                vs Physical Tasks
             </div>
          </div>
        </div>
      </div>

      <div className="mt-3 bg-white/50 rounded-lg p-2 border border-emerald-100/50">
         <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-500">Net Positive Impact</span>
            <span className="font-bold text-emerald-700">+{netImpact}g CO₂</span>
         </div>
         <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
             <div 
               className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
               style={{ width: `${Math.min(100, (stats.saved / (stats.saved + stats.emission || 1)) * 100)}%` }}
             ></div>
         </div>
         <p className="text-[9px] text-center text-slate-400 mt-1.5">
            Every digital action saves ~98% carbon vs physical travel.
         </p>
      </div>
    </div>
  );
};

export default CarbonTracker;