
import React, { useState } from 'react';
import { Landmark, Search, Sprout, Briefcase, GraduationCap, HeartPulse, Leaf, ArrowRight } from 'lucide-react';
import { CARBON_ESTIMATES, UI_TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface Props {
  onAction: (prompt: string) => void;
  language: Language;
}

const SchemeFinder: React.FC<Props> = ({ onAction, language }) => {
  const [state, setState] = useState('');
  const [category, setCategory] = useState('');
  const [income, setIncome] = useState('');
  const t = UI_TRANSLATIONS[language]?.schemes || UI_TRANSLATIONS[Language.ENGLISH].schemes;

  const quickCategories = [
    { id: 'agri', name: t.agri, icon: <Sprout size={24} className="text-green-600"/>, bg: 'bg-green-100', prompt: 'farming and agriculture subsidies' },
    { id: 'msme', name: t.loans, icon: <Briefcase size={24} className="text-blue-600"/>, bg: 'bg-blue-100', prompt: 'small business loans and MSME schemes' },
    { id: 'edu', name: t.edu, icon: <GraduationCap size={24} className="text-yellow-600"/>, bg: 'bg-yellow-100', prompt: 'education scholarships and skill development' },
    { id: 'health', name: t.health, icon: <HeartPulse size={24} className="text-red-600"/>, bg: 'bg-red-100', prompt: 'health insurance and medical assistance schemes' },
  ];

  const handleSearch = () => {
    if (!category) return;
    const prompt = `Find GOVERNMENT SCHEMES for "${category}" in "${state || 'India'}". Annual Income/Turnover: ${income || 'Not specified'}. Provide detailed eligibility criteria and benefits.`;
    onAction(prompt);
  };

  const handleQuickCategory = (catPrompt: string) => {
      const prompt = `Find active GOVERNMENT SCHEMES related to ${catPrompt} for rural India. List benefits and how to apply.`;
      onAction(prompt);
  }

  return (
    <div className="p-4 md:p-8 space-y-6 animate-fade-in max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <div className="bg-orange-100 p-2 rounded-lg"><Landmark className="text-orange-600"/></div>
                    {t.title}
                </h2>
                <p className="text-slate-500 mt-1">{t.desc}</p>
            </div>
             <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-xs font-bold border border-emerald-100 shadow-sm self-start md:self-auto">
                <Leaf size={14} /> Saves ~{CARBON_ESTIMATES.SCHEME.saved}g CO₂ per search
            </div>
        </div>

        {/* Search Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Search size={18} className="text-indigo-500"/> {t.checkEligibility}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase">State / Region</label>
                    <input 
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="e.g. Maharashtra"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 outline-none transition-all"
                    />
                </div>
                <div className="space-y-2">
                     <label className="block text-xs font-bold text-slate-500 uppercase">Category</label>
                     <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 outline-none transition-all"
                     >
                        <option value="">Select Category</option>
                        <option value="Farmers">Farmers (Kisan)</option>
                        <option value="Women Entrepreneurs">Women Entrepreneurs</option>
                        <option value="Small Business">Small Business / Shopkeeper</option>
                        <option value="Students">Students</option>
                        <option value="Senior Citizens">Senior Citizens</option>
                        <option value="Minority">Minority Communities</option>
                     </select>
                </div>
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Annual Income</label>
                    <input 
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        placeholder="e.g. 2.5 Lakh"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 outline-none transition-all"
                    />
                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <button 
                    onClick={handleSearch}
                    disabled={!category}
                    className="w-full md:w-auto px-8 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
                >
                    {t.findMatching} <ArrowRight size={18} />
                </button>
            </div>
        </div>

        {/* Quick Categories */}
        <div>
            <h3 className="font-bold text-slate-700 mb-4 pl-1">{t.browseSector}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickCategories.map(cat => (
                    <button 
                        key={cat.id}
                        onClick={() => handleQuickCategory(cat.prompt)}
                        className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all text-left group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-transparent to-slate-50 rounded-bl-full z-0"></div>
                        <div className="relative z-10">
                            <div className={`w-12 h-12 ${cat.bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                {cat.icon}
                            </div>
                            <div className="font-bold text-slate-800 text-sm md:text-base">{cat.name}</div>
                            <div className="text-[10px] text-slate-400 mt-1 font-medium">Click to search</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
        
        {/* Info Banner */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
             <div className="bg-white p-2 rounded-full shadow-sm text-indigo-600 mt-0.5">
                 <Briefcase size={16} />
             </div>
             <div>
                 <h4 className="font-bold text-indigo-900 text-sm">Need help with documentation?</h4>
                 <p className="text-xs text-indigo-700 mt-0.5">
                     After finding a scheme, ask MaVionix AI to generate the necessary application letters or list the required documents.
                 </p>
             </div>
        </div>
    </div>
  );
};

export default SchemeFinder;
