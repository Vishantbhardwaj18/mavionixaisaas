
import React, { useMemo } from 'react';
import { 
  TrendingUp, Users, Leaf, ArrowRight, Plus, 
  FileText, PenTool, Sparkles, Clock, Wallet, 
  ArrowUpRight, ArrowDownRight, Package, Inbox, 
  PieChart as PieChartIcon, Activity, CheckCircle2, 
  BarChart3, AlertCircle, DollarSign, Trees, AlertTriangle, Zap,
  BookOpen
} from 'lucide-react';
import { UserProfile, CarbonStats, Message, ServiceType, Language } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { DAILY_CARBON_LIMIT, UI_TRANSLATIONS } from '../constants';

interface Props {
  user: UserProfile;
  stats: CarbonStats;
  messages: Message[];
  onNavigate: (view: 'chat' | 'tools' | 'design' | 'scheme' | 'carbon') => void;
  onOpenTool: (toolId: string) => void;
  language: Language;
}

const MainDashboard: React.FC<Props> = ({ user, stats, messages, onNavigate, onOpenTool, language }) => {
  const t = UI_TRANSLATIONS[language]?.dashboard || UI_TRANSLATIONS[Language.ENGLISH].dashboard;

  // Dynamic Stats Calculation
  const { 
    revenue, 
    customerCount, 
    schemesFound, 
    activities, 
    chartData,
    serviceDistribution,
    totalAiTasks
  } = useMemo(() => {
    let revenue = 0;
    let customers = new Set<string>();
    let schemes = 0;
    let totalAiTasks = 0;
    
    // Service Counters
    const serviceCounts = {
        [ServiceType.INVOICE]: 0,
        [ServiceType.DESIGN]: 0,
        [ServiceType.SCHEME]: 0,
        [ServiceType.WEBSITE]: 0,
        [ServiceType.GROWTH]: 0,
        [ServiceType.CHAT]: 0
    };

    const activityList = [...messages].reverse().filter(m => 
       m.role === 'assistant' && m.type && m.type !== ServiceType.CHAT
    ).map(m => {
        let amount = '-';
        let status = 'Completed';
        let title = 'Action';
        let typeLabel = 'General';
        
        totalAiTasks++;
        if (m.type) serviceCounts[m.type]++;

        if (m.type === ServiceType.INVOICE && m.metadata?.total) {
            const val = parseInt(m.metadata.total) || 0;
            revenue += val;
            if (m.metadata.customer) customers.add(m.metadata.customer);
            amount = `₹${val}`;
            status = 'Sent';
            title = `Invoice #${m.metadata.invoiceNo || 'Draft'}`;
            typeLabel = 'Invoice';
        } else if (m.type === ServiceType.SCHEME && Array.isArray(m.metadata)) {
            schemes += m.metadata.length;
            status = 'Found';
            title = `${m.metadata.length} Schemes Matched`;
            typeLabel = 'Scheme';
        } else if (m.type === ServiceType.DESIGN) {
            title = `Design: ${m.metadata.subtype || 'Graphic'}`;
            status = 'Generated';
            typeLabel = 'Design';
        } else if (m.type === ServiceType.WEBSITE) {
            title = `Website: ${m.metadata.businessName}`;
            status = 'Drafted';
            typeLabel = 'Web';
        } else if (m.type === ServiceType.GROWTH) {
            title = "Growth Analytics Report";
            status = 'Analyzed';
            typeLabel = 'Growth';
        }

        return {
            id: m.id,
            type: typeLabel,
            title,
            time: new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            status,
            amount,
            rawDate: new Date(m.timestamp)
        };
    });

    // Prepare Pie Chart Data
    const serviceDistribution = [
        { name: 'Invoicing', value: serviceCounts[ServiceType.INVOICE], color: '#3b82f6' }, // blue
        { name: 'Marketing', value: serviceCounts[ServiceType.DESIGN] + serviceCounts[ServiceType.WEBSITE], color: '#ec4899' }, // pink
        { name: 'Schemes', value: serviceCounts[ServiceType.SCHEME], color: '#f97316' }, // orange
        { name: 'Advisory', value: serviceCounts[ServiceType.CHAT] + serviceCounts[ServiceType.GROWTH], color: '#10b981' }, // emerald
    ].filter(i => i.value > 0);

    // If no data, provide placeholder for pie chart visual
    if (serviceDistribution.length === 0) {
        serviceDistribution.push({ name: 'General', value: 1, color: '#f1f5f9' }); // Lighter grey for empty state
    }

    // Chart Data (Simple Weekly placeholder + Today's real data)
    const chart = [
        { name: 'Mon', value: 0 },
        { name: 'Tue', value: 0 },
        { name: 'Wed', value: 0 },
        { name: 'Thu', value: 0 },
        { name: 'Fri', value: 0 },
        { name: 'Sat', value: 0 },
        { name: 'Sun', value: 0 },
    ];
    
    // Fill today with session revenue
    const dayIndex = new Date().getDay(); // 0 = Sun
    const chartIndex = dayIndex === 0 ? 6 : dayIndex - 1; 
    chart[chartIndex].value = revenue; 
    
    return { 
        revenue, 
        customerCount: customers.size, 
        schemesFound: schemes, 
        activities: activityList,
        chartData: chart,
        serviceDistribution,
        totalAiTasks
    };
  }, [messages]);

  // Khata Data - Starting at 0 for new users
  const khataSummary = {
      toCollect: 0,
      toPay: 0,
      recent: [] as any[]
  };

  const limit = user.customCarbonLimit || DAILY_CARBON_LIMIT;
  const limitProgress = Math.min(100, (stats.emission / limit) * 100);
  const isLimitReached = stats.emission >= limit;

  return (
    <div className="p-4 md:p-8 space-y-6 animate-fade-in max-w-7xl mx-auto pb-24">
      
      {/* Professional Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
            {t.overview}
            <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full border border-indigo-200 uppercase tracking-wide flex items-center gap-1">
                <Zap size={10} fill="currentColor"/> Live
            </span>
          </h1>
          <p className="text-slate-500 mt-1">
             {t.welcomeBack}, <span className="font-semibold text-slate-700">{user.businessName}</span>.
          </p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => onNavigate('tools')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition"
            >
                <Plus size={16} /> {t.newTransaction}
            </button>
        </div>
      </div>

      {/* Quick Launch Actions */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 relative z-10">Quick Launch</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
              <button 
                onClick={() => onOpenTool('invoice')}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-3 rounded-xl transition border border-white/5 group"
              >
                  <div className="p-2 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform"><FileText size={18} /></div>
                  <span className="font-bold text-sm">Create Invoice</span>
              </button>
              <button 
                onClick={() => onOpenTool('khata')}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-3 rounded-xl transition border border-white/5 group"
              >
                  <div className="p-2 bg-purple-500 rounded-lg group-hover:scale-110 transition-transform"><BookOpen size={18} /></div>
                  <span className="font-bold text-sm">Update Khata</span>
              </button>
              <button 
                onClick={() => onOpenTool('market')}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-3 rounded-xl transition border border-white/5 group"
              >
                  <div className="p-2 bg-green-500 rounded-lg group-hover:scale-110 transition-transform"><TrendingUp size={18} /></div>
                  <span className="font-bold text-sm">Check Rates</span>
              </button>
              <button 
                onClick={() => onOpenTool('scheme')}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-3 rounded-xl transition border border-white/5 group"
              >
                  <div className="p-2 bg-orange-500 rounded-lg group-hover:scale-110 transition-transform"><AlertCircle size={18} /></div>
                  <span className="font-bold text-sm">Find Schemes</span>
              </button>
          </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
           <div className="flex justify-between items-start mb-3">
              <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600 group-hover:scale-110 transition-transform">
                 <Wallet size={20} />
              </div>
              {revenue > 0 && (
                  <span className="flex items-center gap-1 text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold">
                      <ArrowUpRight size={10} /> +100%
                  </span>
              )}
           </div>
           <div className="text-2xl font-bold text-slate-800">₹{revenue.toLocaleString('en-IN')}</div>
           <div className="text-xs text-slate-500 font-medium">{t.monthlyRevenue}</div>
        </div>

        {/* Khata / Net Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
           <div className="flex justify-between items-start mb-3">
              <div className="bg-purple-50 p-2.5 rounded-xl text-purple-600 group-hover:scale-110 transition-transform">
                 <Activity size={20} />
              </div>
           </div>
           {/* Simple estimation for profit based on revenue, just for display */}
           <div className="text-2xl font-bold text-slate-800">₹{(revenue * 0.2).toLocaleString('en-IN')}</div>
           <div className="text-xs text-slate-500 font-medium">{t.netProfit}</div>
        </div>

        {/* AI Efficiency */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
           <div className="flex justify-between items-start mb-3">
              <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600 group-hover:scale-110 transition-transform">
                 <Sparkles size={20} />
              </div>
           </div>
           <div className="text-2xl font-bold text-slate-800">{totalAiTasks}</div>
           <div className="text-xs text-slate-500 font-medium">{t.aiTasks}</div>
        </div>

        {/* Carbon Impact - UPDATED */}
        <div 
            className={`p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all group relative overflow-hidden cursor-pointer ${isLimitReached ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}
            onClick={() => onNavigate('carbon')}
        >
           <div className="relative z-10">
               <div className="flex justify-between items-start mb-2">
                  <div className={`bg-white p-2.5 rounded-xl group-hover:scale-110 transition-transform shadow-sm ${isLimitReached ? 'text-red-600' : 'text-emerald-600'}`}>
                     <Leaf size={20} />
                  </div>
                  {isLimitReached && <AlertTriangle size={18} className="text-red-600 animate-pulse"/>}
               </div>
               
               <div className="flex justify-between items-end mb-1">
                   <div>
                       <div className={`text-2xl font-bold ${isLimitReached ? 'text-red-900' : 'text-emerald-900'}`}>
                           {stats.emission.toFixed(2)}g
                       </div>
                       <div className={`text-[10px] uppercase font-bold ${isLimitReached ? 'text-red-700' : 'text-emerald-700'}`}>
                           {t.dailyEmission}
                       </div>
                   </div>
                   <div className="text-right">
                       <div className={`text-[10px] font-bold ${isLimitReached ? 'text-red-500' : 'text-emerald-600'}`}>
                           {t.limit}: {limit}g
                       </div>
                   </div>
               </div>

               {/* Progress Bar */}
               <div className="w-full bg-white/50 h-2 rounded-full overflow-hidden mb-2">
                    <div 
                    className={`h-full transition-all duration-1000 ${isLimitReached ? 'bg-red-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${limitProgress}%` }}
                    ></div>
               </div>

               <div className={`text-[10px] font-medium flex items-center gap-1 ${isLimitReached ? 'text-red-700' : 'text-emerald-700'}`}>
                   {t.totalSaved}: {(stats.saved / 1000).toFixed(2)}kg
               </div>
           </div>
           <div className={`absolute -bottom-4 -right-4 opacity-10 rotate-12 ${isLimitReached ? 'text-red-900' : 'text-emerald-900'}`}>
               <Leaf size={80} />
           </div>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                   <BarChart3 size={18} className="text-blue-600" /> {t.financialPerf}
                </h3>
                <select className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-600 outline-none">
                    <option>This Week</option>
                    <option>Last Month</option>
                    <option>Last Quarter</option>
                </select>
             </div>
             <div className="h-64 w-full">
                {revenue === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-xl">
                        <BarChart3 size={40} className="mb-2 opacity-50"/>
                        <p className="text-sm font-medium">No financial data yet</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} tickFormatter={(value) => `₹${value/1000}k`} />
                            <Tooltip 
                                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                formatter={(value: number) => [`₹${value}`, 'Revenue']}
                            />
                            <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
             </div>
        </div>

        {/* AI Usage Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                <PieChartIcon size={18} className="text-pink-600" /> {t.aiUsage}
            </h3>
            <p className="text-xs text-slate-500 mb-6">Distribution of AI tasks performed.</p>
            
            <div className="flex-1 min-h-[200px] relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={serviceDistribution}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {serviceDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '11px'}}/>
                    </PieChart>
                 </ResponsiveContainer>
                 {/* Center Text */}
                 <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none pb-8">
                     <div className="text-2xl font-bold text-slate-800">{totalAiTasks}</div>
                     <div className="text-[10px] text-slate-400 uppercase font-bold">Tasks</div>
                 </div>
            </div>
        </div>
      </div>

      {/* Bottom Row: Khata & Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Khata Book Widget */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                   <Package size={18} className="text-purple-600" /> {t.khata}
                </h3>
                <button 
                    onClick={() => onOpenTool('khata')}
                    className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition"
                >
                    Open Ledger
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                  <div 
                    onClick={() => onOpenTool('khata')}
                    className="bg-green-50 p-4 rounded-xl border border-green-100 text-center cursor-pointer hover:bg-green-100 transition group"
                  >
                      <div className="text-xs font-bold text-green-700 uppercase mb-1">{t.toCollect}</div>
                      <div className="text-xl font-bold text-green-800">₹{khataSummary.toCollect.toLocaleString('en-IN')}</div>
                      <div className="mt-2 text-[10px] font-bold bg-white text-green-700 rounded-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity">Record +</div>
                  </div>
                  <div 
                    onClick={() => onOpenTool('khata')}
                    className="bg-red-50 p-4 rounded-xl border border-red-100 text-center cursor-pointer hover:bg-red-100 transition group"
                  >
                      <div className="text-xs font-bold text-red-700 uppercase mb-1">{t.toPay}</div>
                      <div className="text-xl font-bold text-red-800">₹{khataSummary.toPay.toLocaleString('en-IN')}</div>
                      <div className="mt-2 text-[10px] font-bold bg-white text-red-700 rounded-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity">Record -</div>
                  </div>
              </div>

              <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase">Recent Entries</h4>
                  {khataSummary.recent.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-sm italic">
                          No transactions recorded yet.
                      </div>
                  ) : (
                    khataSummary.recent.map((entry, i) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${entry.type === 'credit' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                    {entry.name[0]}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-700">{entry.name}</div>
                                    <div className="text-[10px] text-slate-400">{entry.date}</div>
                                </div>
                            </div>
                            <div className={`font-bold text-sm ${entry.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                {entry.type === 'credit' ? '+' : '-'} ₹{entry.amount.toLocaleString()}
                            </div>
                        </div>
                    ))
                  )}
              </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                   <Clock size={18} className="text-slate-500" /> {t.recentActivity}
                </h3>
             </div>
             
             {activities.length === 0 ? (
                 <div className="text-center py-12 text-slate-400 flex flex-col items-center border-2 border-dashed border-slate-100 rounded-xl">
                     <div className="bg-slate-50 p-4 rounded-full mb-3">
                         <Inbox size={24} />
                     </div>
                     <p className="text-sm">{t.noActivity}</p>
                     <button onClick={() => onNavigate('tools')} className="mt-4 text-xs bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                         {t.goToTools}
                     </button>
                 </div>
             ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {activities.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100 group">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                                item.type === 'Invoice' ? 'bg-blue-100 text-blue-600' :
                                item.type === 'Design' ? 'bg-pink-100 text-pink-600' :
                                item.type === 'Scheme' ? 'bg-orange-100 text-orange-600' : 
                                item.type === 'Growth' ? 'bg-purple-100 text-purple-600' :
                                'bg-emerald-100 text-emerald-600'
                            }`}>
                                {item.type === 'Invoice' ? <FileText size={18}/> :
                                item.type === 'Design' ? <PenTool size={18}/> :
                                item.type === 'Scheme' ? <AlertCircle size={18}/> : 
                                item.type === 'Growth' ? <TrendingUp size={18}/> :
                                <CheckCircle2 size={18}/>}
                            </div>
                            <div>
                                <div className="font-bold text-sm text-slate-800">{item.title}</div>
                                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                    {item.type} • {item.time}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className={`text-sm font-bold ${item.amount.includes('₹') ? 'text-slate-800' : 'text-slate-400'}`}>
                                {item.amount !== '-' ? item.amount : ''}
                            </div>
                            <div className={`text-[10px] font-medium px-2 py-0.5 rounded-full inline-block mt-1 ${
                                item.status === 'Sent' ? 'bg-blue-50 text-blue-600' :
                                item.status === 'Found' ? 'bg-orange-50 text-orange-600' :
                                'bg-emerald-50 text-emerald-600'
                            }`}>{item.status}</div>
                        </div>
                    </div>
                    ))}
                </div>
             )}
          </div>

      </div>
    </div>
  );
};

export default MainDashboard;
