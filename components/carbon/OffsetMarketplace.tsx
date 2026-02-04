
import React, { useState } from 'react';
import { OffsetProject } from '../../types';
import { ShoppingCart, CheckCircle, Leaf, ExternalLink, MapPin, BadgeCheck } from 'lucide-react';

interface Props {
  projects: OffsetProject[];
  onPurchase: (project: OffsetProject, amount: number) => void;
}

const OffsetMarketplace: React.FC<Props> = ({ projects, onPurchase }) => {
  const [selectedAmount, setSelectedAmount] = useState<Record<string, number>>({});

  const handleSliderChange = (pid: string, val: number) => {
      setSelectedAmount(prev => ({ ...prev, [pid]: val }));
  };

  return (
    <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Leaf className="text-emerald-600" size={20} /> Verified Offset Projects
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map(project => {
                const amount = selectedAmount[project.id] || 10; // Default 10kg
                const cost = amount * project.costPerKg;

                return (
                    <div key={project.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-40 bg-slate-200 relative">
                            <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-1">
                                <BadgeCheck size={14} className="text-blue-500" /> {project.certification}
                            </div>
                        </div>
                        
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-slate-800">{project.name}</h4>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <MapPin size={12} /> {project.location}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-lg font-bold text-emerald-600">₹{project.costPerKg}</span>
                                    <span className="text-[10px] text-slate-400">per kg CO₂</span>
                                </div>
                            </div>
                            
                            <p className="text-sm text-slate-600 mb-4 line-clamp-2">{project.description}</p>
                            
                            <div className="bg-slate-50 p-3 rounded-xl mb-4">
                                <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                                    <span>Offset Amount</span>
                                    <span>{amount} kg</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="1000" 
                                    value={amount} 
                                    onChange={(e) => handleSliderChange(project.id, parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                />
                                <div className="flex justify-between mt-2 pt-2 border-t border-slate-200/50">
                                    <span className="text-xs text-slate-500">Total Cost</span>
                                    <span className="text-sm font-bold text-slate-900">₹{cost.toFixed(0)}</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => onPurchase(project, amount)}
                                className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                            >
                                <ShoppingCart size={16} /> Purchase Offset
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default OffsetMarketplace;
