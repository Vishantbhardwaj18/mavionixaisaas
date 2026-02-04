
import React from 'react';
import { CarbonStats, UserProfile } from '../../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, TrendingUp, DollarSign, Leaf } from 'lucide-react';

interface Props {
  aggregates: any;
  users: UserProfile[];
}

const AdminAnalytics: React.FC<Props> = ({ aggregates, users }) => {
  // Mock data for admin charts
  const forecastData = [
      { name: 'Jan', value: 4000 },
      { name: 'Feb', value: 3000 },
      { name: 'Mar', value: 2000 },
      { name: 'Apr', value: 2780 },
      { name: 'May', value: 1890 },
      { name: 'Jun', value: 2390 },
  ];

  const topEmitters = users
    .sort((a,b) => (b.usageStats?.carbon.emission || 0) - (a.usageStats?.carbon.emission || 0))
    .slice(0, 5);

  return (
    <div className="space-y-8">
        {/* Cost Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <TrendingUp size={20} className="text-blue-600"/> Emission Forecast
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={forecastData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                            <XAxis dataKey="name" tick={{fontSize: 12}} />
                            <YAxis tick={{fontSize: 12}} />
                            <Tooltip />
                            <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#eff6ff" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Users size={20} className="text-purple-600"/> Top Contributors
                </h3>
                <div className="space-y-4">
                    {topEmitters.map((u, i) => (
                        <div key={u.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                                    {i + 1}
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-slate-800">{u.businessName}</div>
                                    <div className="text-xs text-slate-500">{u.location}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-sm text-red-600">{(u.usageStats?.carbon.emission || 0).toFixed(1)}g</div>
                                <div className="text-[10px] text-slate-400">Emission</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default AdminAnalytics;
