
import React, { useEffect, useState, useMemo } from 'react';
import { UserProfile, CarbonStats, AdminRoleType } from '../types';
import { getKnownUsers, deleteUser, toggleUserLock, resetUserPin, updateUserLimit, updateUserRole, createOrUpdateUser } from '../services/authService';
import { 
  Users, Leaf, Shield, LogOut, Search, BarChart3, Lock, Trash2, 
  RotateCcw, Ban, Unlock, Eye, X, Crown, Activity, DollarSign, TrendingUp, Zap, 
  AlertTriangle, CheckCircle2, AlertCircle, ShieldAlert, Lightbulb,
  User, RefreshCw, Mail, Phone, Clock, Download, FileText, Globe, Settings, Sun, Moon, Database, Flame, Droplets,
  UserPlus, Edit3, Check, ShieldCheck, Server, Save, HardDrive, Bell, Cpu
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, Legend, LineChart, Line
} from 'recharts';
import CarbonDashboard from './CarbonDashboard'; 
import AdminAnalytics from './carbon/AdminAnalytics'; 
import CarbonTracker from './CarbonTracker';
import { DAILY_CARBON_LIMIT, ADMIN_CARBON_RATES, ADMIN_REFERENCE_CAP, USER_REFERENCE_CAP } from '../constants';
import { useCarbon } from './CarbonContext';

interface Props {
  user: UserProfile;
  onLogout: () => void;
  initialStats: CarbonStats;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

const AdminDashboard: React.FC<Props> = ({ user, onLogout, initialStats, onUpdateUser }) => {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'admins' | 'sustainability' | 'profile'>('overview');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [editingLimit, setEditingLimit] = useState<string>('');
  const [roleEditMode, setRoleEditMode] = useState(false);
  const [profileEditMode, setProfileEditMode] = useState(false);
  
  // Admin Profile State
  const [adminName, setAdminName] = useState(user.businessName);
  const [adminEmail, setAdminEmail] = useState(user.email || '');
  const [globalCarbonCap, setGlobalCarbonCap] = useState(DAILY_CARBON_LIMIT);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Admin Management State
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [potentialAdminSearch, setPotentialAdminSearch] = useState('');
  const [selectedPotentialAdmin, setSelectedPotentialAdmin] = useState<UserProfile | null>(null);
  const [newAdminRoleType, setNewAdminRoleType] = useState<AdminRoleType>('viewer');
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);

  // Admin Session Carbon Tracking (Using Unified Context)
  const { stats, trackAction, setUser: setContextUser } = useCarbon();
  const [currentTip, setCurrentTip] = useState('Digital management saves 98% carbon vs paper.');

  const currentAdminType = user.adminType || 'super_admin';
  const canManageAdmins = currentAdminType === 'super_admin';
  const canDelete = currentAdminType === 'super_admin';
  const canModifyUsers = currentAdminType === 'super_admin' || currentAdminType === 'support_admin';

  // Real-time polling
  useEffect(() => {
    setContextUser(user); 
    const fetchUsers = () => { setUsers(getKnownUsers()); };
    fetchUsers(); 
    const interval = setInterval(fetchUsers, 2000); 
    return () => clearInterval(interval);
  }, []);

  // Theme Classes Helper
  const theme = {
      bg: isDarkMode ? 'bg-slate-900' : 'bg-slate-50',
      text: isDarkMode ? 'text-slate-100' : 'text-slate-800',
      sidebar: isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200',
      card: isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200',
      cardText: isDarkMode ? 'text-slate-400' : 'text-slate-500',
      heading: isDarkMode ? 'text-white' : 'text-slate-800',
      input: isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800',
      tableHead: isDarkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-500',
      tableRowHover: isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50',
      divider: isDarkMode ? 'divide-slate-700' : 'divide-slate-100',
      accentBg: isDarkMode ? 'bg-indigo-600' : 'bg-indigo-600',
      iconBg: isDarkMode ? 'bg-slate-900' : 'bg-slate-100',
      modalBg: isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
  };

  const handleTrackInteraction = (type: keyof typeof ADMIN_CARBON_RATES) => {
      const rate = ADMIN_CARBON_RATES[type];
      trackAction(type, rate.emission, rate.saved);
  };

  const handleAdminLogout = () => {
      const prevStats = user.usageStats || { totalRevenue: 0, totalAiTasks: 0, carbon: {emission:0, saved:0, energy:0, idleEmission:0, activeEmission:0, idleTime:0}, lastActive: 0 };
      const updatedStats = {
          ...prevStats,
          carbon: stats,
          lastActive: Date.now()
      };
      const updatedUser = { ...user, usageStats: updatedStats };
      createOrUpdateUser(updatedUser);
      onLogout();
  };

  const handleTabChange = (tab: typeof activeTab) => {
      setActiveTab(tab);
      handleTrackInteraction(tab === 'sustainability' ? 'VIEW_REPORT' : 'CLICK');
  };

  const handleSaveProfile = () => {
      handleTrackInteraction('UPDATE_USER');
      const updatedUser = {
          ...user,
          businessName: adminName,
          email: adminEmail
      };
      createOrUpdateUser(updatedUser);
      onUpdateUser(updatedUser);
      setProfileEditMode(false);
      alert("Admin profile updated.");
  };

  const filteredUsers = users.filter(u => 
    u.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.mobile && u.mobile.includes(searchTerm)) ||
    (u.email && u.email.toLowerCase().includes(searchTerm))
  );

  const potentialAdmins = users.filter(u => 
    u.role !== 'admin' && 
    (u.businessName.toLowerCase().includes(potentialAdminSearch.toLowerCase()) ||
    (u.mobile && u.mobile.includes(potentialAdminSearch)) ||
    (u.email && u.email.toLowerCase().includes(potentialAdminSearch)))
  );

  // --- Aggregate Stats Calculation ---
  const aggregates = useMemo(() => {
      let totalCarbonSaved = 0;
      let totalCarbonEmission = 0;
      let totalEnergy = 0;
      let totalRevenue = 0;
      let totalTasks = 0;
      let activeProUsers = 0;
      let totalIdleEmission = 0;
      let totalActiveEmission = 0;

      users.forEach(u => {
          let userCarbon = u.usageStats?.carbon || { emission: 0, saved: 0, energy: 0, idleEmission: 0, activeEmission: 0, idleTime: 0 };
          if (u.id === user.id) { userCarbon = stats; }

          if (u.usageStats) {
              totalRevenue += u.usageStats.totalRevenue;
              totalTasks += u.usageStats.totalAiTasks;
          }

          totalCarbonSaved += userCarbon.saved;
          totalCarbonEmission += userCarbon.emission;
          totalEnergy += userCarbon.energy;
          totalIdleEmission += userCarbon.idleEmission || 0;
          totalActiveEmission += userCarbon.activeEmission || 0;

          if (u.subscription === 'pro') activeProUsers++;
      });

      return {
          totalCarbonSaved,
          totalCarbonEmission, 
          totalEnergy,
          totalRevenue,
          totalTasks,
          activeProUsers,
          totalUsers: users.length,
          totalIdleEmission,
          totalActiveEmission
      };
  }, [users, stats, user.id]);

  // Mock Trend Data for Charts
  const trendData = useMemo(() => {
      return [
          { name: 'Mon', revenue: aggregates.totalRevenue * 0.1, tasks: Math.floor(aggregates.totalTasks * 0.1) },
          { name: 'Tue', revenue: aggregates.totalRevenue * 0.15, tasks: Math.floor(aggregates.totalTasks * 0.12) },
          { name: 'Wed', revenue: aggregates.totalRevenue * 0.12, tasks: Math.floor(aggregates.totalTasks * 0.15) },
          { name: 'Thu', revenue: aggregates.totalRevenue * 0.18, tasks: Math.floor(aggregates.totalTasks * 0.2) },
          { name: 'Fri', revenue: aggregates.totalRevenue * 0.2, tasks: Math.floor(aggregates.totalTasks * 0.25) },
          { name: 'Sat', revenue: aggregates.totalRevenue * 0.15, tasks: Math.floor(aggregates.totalTasks * 0.1) },
          { name: 'Sun', revenue: aggregates.totalRevenue * 0.1, tasks: Math.floor(aggregates.totalTasks * 0.08) },
      ];
  }, [aggregates]);

  const userDistribution = useMemo(() => [
      { name: 'Owners', value: users.filter(u => u.role === 'owner').length, color: '#6366f1' },
      { name: 'Staff', value: users.filter(u => u.role === 'staff').length, color: '#f59e0b' },
      { name: 'Admins', value: users.filter(u => u.role === 'admin').length, color: '#10b981' },
  ], [users]);

  const recentLogs = useMemo(() => [
      { id: 1, type: 'alert', msg: 'High carbon emission alert from User #124', time: '10 min ago' },
      { id: 2, type: 'info', msg: 'System backup completed successfully', time: '1 hour ago' },
      { id: 3, type: 'user', msg: 'New Pro subscription: Kisan Mart', time: '2 hours ago' },
      { id: 4, type: 'alert', msg: 'Database latency spike detected (resolved)', time: '4 hours ago' },
  ], []);

  const handleLockUser = (userId: string, name: string) => {
      handleTrackInteraction('UPDATE_USER');
      if (!canModifyUsers) return;
      const updatedUser = toggleUserLock(userId);
      if (updatedUser) {
          setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
          if (selectedUser?.id === userId) setSelectedUser(updatedUser);
      }
  };

  const handleResetPin = (userId: string, name: string) => {
      handleTrackInteraction('RESET_PIN');
      if (!canModifyUsers) return;
      if (window.confirm(`Reset PIN for "${name}"?`)) {
          const updatedUser = resetUserPin(userId);
          if (updatedUser) {
               setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
               if (selectedUser?.id === userId) setSelectedUser(updatedUser);
               alert(`PIN reset for ${name}. They will be asked to set a new PIN on next login.`);
          }
      }
  };

  const handleDeleteUser = (id: string, name: string) => {
      handleTrackInteraction('UPDATE_USER');
      if (!canDelete) {
          alert("Access Denied: Only Super Admins can delete users.");
          return;
      }
      if (window.confirm(`Delete "${name}" permanently? This action cannot be undone.`)) {
          const updatedList = deleteUser(id);
          setUsers(updatedList);
          setSelectedUser(null);
      }
  };

  const handleUpdateLimit = () => {
      handleTrackInteraction('UPDATE_USER');
      if (!canModifyUsers) return;
      if (selectedUser && editingLimit) {
          const limit = parseFloat(editingLimit);
          if (!isNaN(limit) && limit > 0) {
              const updatedUser = updateUserLimit(selectedUser.id, limit);
              if (updatedUser) {
                  setUsers(prev => prev.map(u => u.id === selectedUser.id ? updatedUser : u));
                  setSelectedUser(updatedUser);
                  setEditingLimit('');
                  alert(`Limit updated to ${limit}g for ${updatedUser.businessName}`);
              }
          } else {
              alert("Please enter a valid number");
          }
      }
  };

  const handlePromoteUser = () => {
      if (!selectedPotentialAdmin) return;
      handleTrackInteraction('MANAGE_ROLE');
      const updatedUser = updateUserRole(selectedPotentialAdmin.id, 'admin', newAdminRoleType);
      if (updatedUser) {
          setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
          setShowAddAdminModal(false);
          setSelectedPotentialAdmin(null);
          setPotentialAdminSearch('');
          alert(`${updatedUser.businessName} is now an Admin.`);
      }
  };

  const handleUpdateAdminRole = (adminId: string, newType: AdminRoleType) => {
      handleTrackInteraction('MANAGE_ROLE');
      const updatedUser = updateUserRole(adminId, 'admin', newType);
      if (updatedUser) {
          setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
          setEditingAdminId(null);
      }
  };

  const handleRevokeAdmin = (adminId: string) => {
      if (adminId === user.id) {
          alert("You cannot revoke your own admin access.");
          return;
      }
      if (window.confirm("Are you sure? This user will lose all admin privileges and become a regular owner.")) {
          handleTrackInteraction('MANAGE_ROLE');
          const updatedUser = updateUserRole(adminId, 'owner');
          if (updatedUser) {
              setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
          }
      }
  };

  const openUserDetail = (u: UserProfile) => {
      handleTrackInteraction('CLICK');
      setSelectedUser(u);
      setRoleEditMode(false);
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col md:flex-row ${theme.bg} ${theme.text} transition-colors duration-300`}>
      
      {/* Sidebar Navigation */}
      <aside className={`w-full md:w-64 p-6 flex flex-col h-auto md:h-screen sticky top-0 z-20 border-r transition-colors duration-300 ${theme.sidebar}`}>
          <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-indigo-500/20">A</div>
             <div>
                 <h1 className={`font-bold text-lg ${theme.heading}`}>Admin Panel</h1>
                 <p className={`text-[10px] capitalize ${theme.cardText}`}>{currentAdminType.replace('_', ' ')}</p>
             </div>
          </div>

          <div className="mb-6 space-y-3">
              <div>
                  <p className={`text-[10px] font-bold uppercase mb-2 ${theme.cardText}`}>Session Impact</p>
                  <CarbonTracker stats={stats} compact />
              </div>
              <div className={`p-3 rounded-xl border flex items-start gap-2 ${theme.card}`}>
                  <Lightbulb size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className={`text-[10px] leading-tight ${theme.cardText}`}>
                      {currentTip}
                  </p>
              </div>
          </div>

          <nav className="flex-1 space-y-2">
              {/* Navigation Buttons */}
              {['overview', 'users', 'admins', 'sustainability', 'profile'].map((tab) => {
                  if (tab === 'admins' && !canManageAdmins) return null;
                  const icons: any = { overview: BarChart3, users: Users, admins: ShieldAlert, sustainability: Leaf, profile: User };
                  const Icon = icons[tab];
                  return (
                    <button 
                        key={tab}
                        onClick={() => handleTabChange(tab as any)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition capitalize ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : `${theme.cardText} hover:bg-slate-100 dark:hover:bg-slate-800`}`}
                    >
                        <Icon size={18} /> {tab}
                    </button>
                  );
              })}
          </nav>

          <div className={`pt-6 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} space-y-4`}>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition ${theme.card}`}
              >
                  <span className={`text-xs font-bold ${theme.cardText}`}>Appearance</span>
                  {isDarkMode ? <Moon size={16} className="text-indigo-400"/> : <Sun size={16} className="text-amber-500"/>}
              </button>

              <button onClick={handleAdminLogout} className="flex items-center gap-2 text-red-400 hover:text-red-500 transition text-sm font-bold w-full p-2">
                  <LogOut size={16} /> Logout System
              </button>
          </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 p-4 md:p-8 overflow-y-auto ${theme.bg}`}>
          
          <div className="flex justify-between items-center mb-8">
              <h2 className={`text-2xl font-bold ${theme.heading} capitalize`}>
                  {activeTab.replace('_', ' ')}
              </h2>
              <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 border ${isDarkMode ? 'bg-emerald-900 text-emerald-300 border-emerald-700' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                      <Zap size={12} fill="currentColor" /> System Online
                  </span>
                  <div className="animate-spin text-slate-400"><RefreshCw size={12}/></div>
              </div>
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                  
                  {/* Metric Cards Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {[
                          { label: 'Total Users', val: aggregates.totalUsers, icon: Users, color: 'text-indigo-500', sub: '+12% this week' },
                          { label: 'Total Saved', val: `${(aggregates.totalCarbonSaved / 1000).toFixed(1)}kg`, icon: Leaf, color: 'text-emerald-500', sub: 'Carbon prevented' },
                          { label: 'Revenue', val: `₹${aggregates.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-blue-500', sub: '+5% vs last month' },
                          { label: 'AI Tasks', val: aggregates.totalTasks, icon: Activity, color: 'text-purple-500', sub: 'High engagement' },
                      ].map((stat, i) => (
                          <div key={i} className={`p-5 rounded-2xl shadow-sm border ${theme.card}`}>
                              <div className="flex justify-between items-start mb-4">
                                  <div className={`p-3 rounded-xl ${theme.iconBg} ${stat.color}`}><stat.icon size={20}/></div>
                                  <span className={`text-xs font-bold uppercase ${theme.cardText} flex items-center gap-1`}>
                                      {i === 0 || i === 2 ? <TrendingUp size={12} className="text-emerald-500"/> : null}
                                      {stat.label}
                                  </span>
                              </div>
                              <div className={`text-3xl font-bold ${theme.heading}`}>{stat.val}</div>
                              <div className="text-[10px] text-slate-500 mt-1">{stat.sub}</div>
                          </div>
                      ))}
                  </div>

                  {/* Main Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Revenue & Growth */}
                      <div className={`lg:col-span-2 p-6 rounded-2xl border shadow-sm ${theme.card}`}>
                          <h3 className={`font-bold text-lg mb-6 flex items-center gap-2 ${theme.heading}`}>
                              <BarChart3 size={20} className="text-blue-500"/> Growth Analytics
                          </h3>
                          <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={trendData}>
                                      <defs>
                                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                          </linearGradient>
                                          <linearGradient id="colorTask" x1="0" y1="0" x2="0" y2="1">
                                              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.1}/>
                                              <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                                          </linearGradient>
                                      </defs>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                                      <Tooltip 
                                          contentStyle={{borderRadius: '12px', border: 'none', backgroundColor: isDarkMode ? '#1e293b' : '#fff', color: isDarkMode ? '#fff' : '#000'}} 
                                      />
                                      <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" name="Revenue (₹)" />
                                      <Area type="monotone" dataKey="tasks" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorTask)" name="AI Tasks" />
                                      <Legend />
                                  </AreaChart>
                              </ResponsiveContainer>
                          </div>
                      </div>

                      {/* User Distribution */}
                      <div className={`p-6 rounded-2xl border shadow-sm ${theme.card}`}>
                          <h3 className={`font-bold text-lg mb-6 flex items-center gap-2 ${theme.heading}`}>
                              <Users size={20} className="text-purple-500"/> User Roles
                          </h3>
                          <div className="h-64 relative">
                              <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                      <Pie
                                          data={userDistribution}
                                          innerRadius={60}
                                          outerRadius={80}
                                          paddingAngle={5}
                                          dataKey="value"
                                      >
                                          {userDistribution.map((entry, index) => (
                                              <Cell key={`cell-${index}`} fill={entry.color} />
                                          ))}
                                      </Pie>
                                      <Tooltip contentStyle={{borderRadius: '12px', border: 'none', backgroundColor: isDarkMode ? '#1e293b' : '#fff'}} />
                                      <Legend verticalAlign="bottom" height={36}/>
                                  </PieChart>
                              </ResponsiveContainer>
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                                  <div className="text-center">
                                      <div className={`text-3xl font-bold ${theme.heading}`}>{aggregates.totalUsers}</div>
                                      <div className="text-xs text-slate-500 uppercase">Total</div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Secondary Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* System Intelligence */}
                      <div className={`p-6 rounded-2xl border shadow-sm ${theme.card}`}>
                          <h3 className={`font-bold text-lg mb-6 flex items-center gap-2 ${theme.heading}`}>
                              <Cpu size={20} className="text-amber-500"/> System Intelligence
                          </h3>
                          
                          <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                                      <span className="text-xs font-bold text-emerald-500 uppercase mb-1">Server Status</span>
                                      <span className={`text-lg font-bold ${theme.heading} flex items-center gap-2`}>
                                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Healthy
                                      </span>
                                  </div>
                                  <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                                      <span className="text-xs font-bold text-blue-500 uppercase mb-1">API Latency</span>
                                      <span className={`text-lg font-bold ${theme.heading}`}>45ms</span>
                                  </div>
                              </div>

                              <h4 className={`text-xs font-bold uppercase ${theme.cardText} mb-2`}>Recent Logs</h4>
                              <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                                  {recentLogs.map(log => (
                                      <div key={log.id} className={`flex items-center gap-3 p-3 rounded-lg border text-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                                          <div className={`p-1.5 rounded-full ${
                                              log.type === 'alert' ? 'bg-red-500/10 text-red-500' : 
                                              log.type === 'info' ? 'bg-blue-500/10 text-blue-500' : 
                                              'bg-emerald-500/10 text-emerald-500'
                                          }`}>
                                              {log.type === 'alert' ? <AlertTriangle size={12}/> : log.type === 'info' ? <Server size={12}/> : <User size={12}/>}
                                          </div>
                                          <div className="flex-1 truncate text-slate-400">
                                              {log.msg}
                                          </div>
                                          <div className="text-[10px] text-slate-600 whitespace-nowrap">{log.time}</div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>

                      {/* Quick Actions / Sustainability Mini */}
                      <div className={`p-6 rounded-2xl border shadow-sm flex flex-col ${theme.card}`}>
                          <h3 className={`font-bold text-lg mb-6 flex items-center gap-2 ${theme.heading}`}>
                              <Leaf size={20} className="text-emerald-500"/> Sustainability Target
                          </h3>
                          
                          <div className="flex-1 flex flex-col justify-center">
                              <div className="flex justify-between items-end mb-2">
                                  <span className={`text-sm font-bold ${theme.cardText}`}>Current Platform Usage</span>
                                  <span className={`text-2xl font-bold ${theme.heading}`}>{aggregates.totalCarbonEmission.toFixed(1)}g</span>
                              </div>
                              <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                                  <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 w-[65%] rounded-full"></div>
                              </div>
                              <div className="flex justify-between text-xs text-slate-500 mb-8">
                                  <span>0g</span>
                                  <span>Daily Cap: {globalCarbonCap * aggregates.totalUsers}g</span>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                  <button className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition hover:scale-[1.02] ${isDarkMode ? 'bg-slate-900 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                                      <Bell size={16} className="text-amber-500" />
                                      <span className={`text-xs font-bold ${theme.heading}`}>Send Alert</span>
                                  </button>
                                  <button className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition hover:scale-[1.02] ${isDarkMode ? 'bg-slate-900 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                                      <Download size={16} className="text-blue-500" />
                                      <span className={`text-xs font-bold ${theme.heading}`}>Export Report</span>
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
              <div className="space-y-6 animate-fade-in">
                  <div className={`rounded-2xl shadow-sm border overflow-hidden ${theme.card}`}>
                      <div className={`p-6 border-b flex flex-col md:flex-row justify-between items-center gap-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                          <input 
                              value={searchTerm}
                              onChange={e => setSearchTerm(e.target.value)}
                              placeholder="Search users..."
                              className={`w-full md:w-96 pl-4 pr-4 py-2 rounded-xl outline-none focus:border-indigo-500 border ${theme.input}`}
                          />
                      </div>
                      <div className="overflow-x-auto">
                          <table className={`w-full text-left text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                              <thead className={`font-bold uppercase text-[10px] tracking-wider ${theme.tableHead}`}>
                                  <tr>
                                      <th className="px-6 py-4">User</th>
                                      <th className="px-6 py-4">Role</th>
                                      <th className="px-6 py-4 text-right">Controls</th>
                                  </tr>
                              </thead>
                              <tbody className={`divide-y ${theme.divider}`}>
                                  {filteredUsers.map(u => (
                                      <tr key={u.id} className={`transition ${theme.tableRowHover}`}>
                                          <td className="px-6 py-4 font-bold">{u.businessName}</td>
                                          <td className="px-6 py-4">{u.role}</td>
                                          <td className="px-6 py-4 text-right">
                                              <button onClick={() => openUserDetail(u)} className="p-2 text-indigo-500 hover:bg-slate-700 rounded-lg"><Eye size={16}/></button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          )}

          {/* ADMINS TAB */}
          {activeTab === 'admins' && canManageAdmins && (
              <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                       <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden flex-1 w-full">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                            <div className="relative z-10 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <ShieldCheck size={24} className="text-purple-300" /> Admin Team
                                    </h3>
                                    <p className="text-purple-200 text-sm mt-1">
                                        Manage privileges and access controls.
                                    </p>
                                </div>
                                <button 
                                    onClick={() => { setShowAddAdminModal(true); setPotentialAdminSearch(''); setSelectedPotentialAdmin(null); }} 
                                    className="bg-white text-indigo-900 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-50 transition shadow-lg"
                                >
                                    <UserPlus size={16} /> Add Member
                                </button>
                            </div>
                       </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {users.filter(u => u.role === 'admin').map(admin => {
                          const isMe = admin.id === user.id;
                          const roleType = admin.adminType || 'viewer';
                          const isSuper = roleType === 'super_admin';
                          const isSupport = roleType === 'support_admin';
                          
                          return (
                            <div key={admin.id} className={`p-6 rounded-3xl border relative overflow-hidden group ${theme.card}`}>
                                <div className={`absolute top-0 right-0 p-3 opacity-10 ${isSuper ? 'text-amber-500' : isSupport ? 'text-blue-500' : 'text-slate-500'}`}>
                                    <Shield size={80} />
                                </div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shadow-md ${isSuper ? 'bg-amber-100 text-amber-600' : isSupport ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                                            {admin.businessName[0]}
                                        </div>
                                        <div>
                                            <h4 className={`font-bold text-lg ${theme.heading}`}>{admin.businessName} {isMe && '(You)'}</h4>
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${isSuper ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : isSupport ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}>
                                                {roleType.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        <div className="text-xs text-slate-500 flex items-center gap-2">
                                            <Mail size={12}/> {admin.email || 'No email'}
                                        </div>
                                        <div className="text-xs text-slate-500 flex items-center gap-2">
                                            <Clock size={12}/> Active: {new Date(admin.lastLogin).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className={`text-[10px] space-y-1 mb-6 p-3 rounded-xl ${theme.iconBg}`}>
                                        <p className="font-bold text-slate-500 uppercase mb-1">Capabilities</p>
                                        <div className="grid grid-cols-2 gap-1">
                                            <div className="flex items-center gap-1 text-emerald-500"><Check size={10}/> View Dashboard</div>
                                            <div className={`flex items-center gap-1 ${isSuper || isSupport ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                {isSuper || isSupport ? <Check size={10}/> : <X size={10}/>} Manage Users
                                            </div>
                                            <div className={`flex items-center gap-1 ${isSuper ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                {isSuper ? <Check size={10}/> : <X size={10}/>} Manage Admins
                                            </div>
                                            <div className={`flex items-center gap-1 ${isSuper ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                {isSuper ? <Check size={10}/> : <X size={10}/>} Delete Data
                                            </div>
                                        </div>
                                    </div>

                                    {!isMe && (
                                        <div className="flex gap-2">
                                            {editingAdminId === admin.id ? (
                                                <div className="flex items-center gap-2 w-full animate-fade-in">
                                                    <select 
                                                        value={admin.adminType}
                                                        onChange={(e) => handleUpdateAdminRole(admin.id, e.target.value as AdminRoleType)}
                                                        className={`flex-1 text-xs p-2 rounded-lg border ${theme.input} outline-none`}
                                                    >
                                                        <option value="super_admin">Super Admin</option>
                                                        <option value="support_admin">Support Admin</option>
                                                        <option value="viewer">Viewer</option>
                                                    </select>
                                                    <button onClick={() => setEditingAdminId(null)} className="p-2 bg-slate-200 rounded-lg text-slate-600 hover:bg-slate-300"><X size={14}/></button>
                                                </div>
                                            ) : (
                                                <>
                                                    <button 
                                                        onClick={() => setEditingAdminId(admin.id)}
                                                        className={`flex-1 py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition ${isDarkMode ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-600'}`}
                                                    >
                                                        <Edit3 size={12} /> Change Role
                                                    </button>
                                                    <button 
                                                        onClick={() => handleRevokeAdmin(admin.id)}
                                                        className="py-2 px-3 text-xs font-bold rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition"
                                                        title="Revoke Admin Access"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                          );
                      })}
                  </div>
              </div>
          )}

          {/* ADMIN PROFILE TAB */}
          {activeTab === 'profile' && (
              <div className="animate-fade-in space-y-6">
                  
                  {/* Admin Header Card */}
                  <div className={`p-8 rounded-3xl border shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center gap-8 ${theme.card}`}>
                      <div className="relative group">
                          <div className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold shadow-2xl ${isDarkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-700'}`}>
                              {user.businessName[0]}
                          </div>
                          {profileEditMode && (
                              <div className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white shadow-lg cursor-pointer hover:bg-indigo-500 transition">
                                  <Edit3 size={16} />
                              </div>
                          )}
                      </div>
                      
                      <div className="text-center md:text-left flex-1">
                          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                              <h2 className={`text-3xl font-bold ${theme.heading}`}>
                                  {profileEditMode ? (
                                      <input 
                                          value={adminName} 
                                          onChange={(e) => setAdminName(e.target.value)} 
                                          className={`bg-transparent border-b border-indigo-500 outline-none w-full max-w-[300px] text-center md:text-left ${theme.heading}`} 
                                      />
                                  ) : user.businessName}
                              </h2>
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white uppercase tracking-wider flex items-center gap-1">
                                  <ShieldCheck size={12} /> {currentAdminType.replace('_', ' ')}
                              </span>
                          </div>
                          
                          <p className={`text-sm mb-6 ${theme.cardText}`}>
                              {profileEditMode ? (
                                  <input 
                                      value={adminEmail} 
                                      onChange={(e) => setAdminEmail(e.target.value)} 
                                      className="bg-transparent border-b border-slate-500 outline-none w-full max-w-[300px] text-center md:text-left" 
                                  />
                              ) : user.email}
                          </p>

                          <div className="flex gap-3 justify-center md:justify-start">
                              {profileEditMode ? (
                                  <button onClick={handleSaveProfile} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg">
                                      <Save size={16} /> Save Changes
                                  </button>
                              ) : (
                                  <button onClick={() => setProfileEditMode(true)} className="px-6 py-2 border border-indigo-200 text-indigo-500 rounded-xl font-bold text-sm hover:bg-indigo-50 hover:border-indigo-300 transition flex items-center gap-2">
                                      <Edit3 size={16} /> Edit Profile
                                  </button>
                              )}
                          </div>
                      </div>
                  </div>

                  {/* System Settings & Data Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* System Configuration */}
                      <div className={`p-6 rounded-3xl border shadow-sm ${theme.card}`}>
                          <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${theme.heading}`}>
                              <Settings size={20} className="text-slate-400" /> System Configuration
                          </h3>
                          
                          <div className="space-y-6">
                              <div>
                                  <div className="flex justify-between items-center mb-2">
                                      <label className={`text-sm font-bold ${theme.cardText}`}>Global Carbon Limit (Daily)</label>
                                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold">{globalCarbonCap}g</span>
                                  </div>
                                  <input 
                                      type="range" 
                                      min="500" 
                                      max="5000" 
                                      step="100" 
                                      value={globalCarbonCap} 
                                      onChange={(e) => setGlobalCarbonCap(parseInt(e.target.value))}
                                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                  <p className="text-[10px] text-slate-500 mt-1">Default limit applied to all new users.</p>
                              </div>

                              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/5 dark:bg-slate-800/50">
                                  <div className="flex items-center gap-3">
                                      <div className={`p-2 rounded-full ${maintenanceMode ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'}`}>
                                          <Server size={20} />
                                      </div>
                                      <div>
                                          <p className={`font-bold text-sm ${theme.heading}`}>Maintenance Mode</p>
                                          <p className="text-xs text-slate-500">Disable user access for updates</p>
                                      </div>
                                  </div>
                                  <button 
                                      onClick={() => setMaintenanceMode(!maintenanceMode)}
                                      className={`w-12 h-6 rounded-full relative transition-colors ${maintenanceMode ? 'bg-amber-500' : 'bg-slate-300'}`}
                                  >
                                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${maintenanceMode ? 'left-7' : 'left-1'}`}></div>
                                  </button>
                              </div>
                          </div>
                      </div>

                      {/* Data Management */}
                      <div className={`p-6 rounded-3xl border shadow-sm ${theme.card}`}>
                          <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${theme.heading}`}>
                              <Database size={20} className="text-slate-400" /> Data Operations
                          </h3>
                          
                          <div className="space-y-4">
                              <button className={`w-full p-4 rounded-xl border flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition ${theme.cardText} ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                  <div className="flex items-center gap-3">
                                      <FileText size={20} className="text-blue-500" />
                                      <div className="text-left">
                                          <p className={`font-bold text-sm ${theme.heading}`}>Export Audit Logs</p>
                                          <p className="text-xs opacity-70">Download system activity report (CSV)</p>
                                      </div>
                                  </div>
                                  <Download size={18} />
                              </button>

                              <button className={`w-full p-4 rounded-xl border flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition ${theme.cardText} ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                  <div className="flex items-center gap-3">
                                      <HardDrive size={20} className="text-emerald-500" />
                                      <div className="text-left">
                                          <p className={`font-bold text-sm ${theme.heading}`}>System Backup</p>
                                          <p className="text-xs opacity-70">Create snapshot of current database</p>
                                      </div>
                                  </div>
                                  <RefreshCw size={18} />
                              </button>
                          </div>
                      </div>

                  </div>
              </div>
          )}

          {/* SUSTAINABILITY TAB - UPDATED WITH LIST */}
          {activeTab === 'sustainability' && (
              <div className="animate-fade-in space-y-8">
                  {/* Aggregated Dashboard */}
                  <div className="bg-emerald-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
                      <div className="relative z-10">
                          <h3 className="text-2xl font-bold mb-2">Global Impact Report</h3>
                          <p className="text-emerald-200 max-w-xl">Aggregated carbon footprint data across all MaVionix users.</p>
                      </div>
                  </div>
                  
                  {/* Grand Total Uncapped Visualization */}
                  <div className={`p-8 rounded-3xl border shadow-lg relative overflow-hidden ${theme.card}`}>
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                          <Globe size={120} className={isDarkMode ? 'text-white' : 'text-slate-900'} />
                      </div>
                      <h2 className={`text-xl font-bold uppercase tracking-widest mb-1 ${theme.cardText}`}>Total Platform Footprint</h2>
                      <p className="text-xs text-emerald-500 font-bold mb-6 flex items-center gap-2"><CheckCircle2 size={12}/> All Users + Admins • No Limits Applied</p>
                      
                      <div className="flex flex-col md:flex-row gap-8 items-end">
                          <div className="flex-1">
                              <span className={`text-6xl md:text-7xl font-black ${theme.heading}`}>
                                  {aggregates.totalCarbonEmission.toFixed(2)}
                                  <span className="text-2xl font-medium text-slate-500 ml-2">g CO₂e</span>
                              </span>
                          </div>
                      </div>
                  </div>

                  {/* Comprehensive User List Table */}
                  <div className={`rounded-2xl shadow-sm border overflow-hidden ${theme.card}`}>
                      <div className={`p-6 border-b flex items-center gap-2 ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                          <Database size={18} className="text-indigo-500" />
                          <h3 className={`font-bold ${theme.heading}`}>Detailed User Sustainability List</h3>
                      </div>
                      <div className="overflow-x-auto">
                          <table className={`w-full text-left text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                              <thead className={`font-bold uppercase text-[10px] tracking-wider ${theme.tableHead}`}>
                                  <tr>
                                      <th className="px-6 py-4">User / Admin</th>
                                      <th className="px-6 py-4">Role</th>
                                      <th className="px-6 py-4 text-center">Total Emission (g)</th>
                                      <th className="px-6 py-4 text-center">Energy (J)</th>
                                      <th className="px-6 py-4 text-center">Active / Idle (g)</th>
                                      <th className="px-6 py-4 text-center">Saved (g)</th>
                                      <th className="px-6 py-4 text-right">Net Impact</th>
                                  </tr>
                              </thead>
                              <tbody className={`divide-y ${theme.divider}`}>
                                  {users.map(u => {
                                      const c = u.id === user.id ? stats : u.usageStats?.carbon || { emission: 0, saved: 0, energy: 0, idleEmission: 0, activeEmission: 0 };
                                      const netImpact = c.saved - c.emission;
                                      return (
                                          <tr key={u.id} className={`transition ${theme.tableRowHover}`}>
                                              <td className="px-6 py-4">
                                                  <div className="flex items-center gap-3">
                                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                                          {u.businessName[0]}
                                                      </div>
                                                      <div>
                                                          <div className={`font-bold ${theme.heading}`}>{u.businessName}</div>
                                                          <div className="text-[10px] text-slate-500">{u.location}</div>
                                                      </div>
                                                  </div>
                                              </td>
                                              <td className="px-6 py-4">
                                                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-purple-900/30 text-purple-400' : 'bg-slate-700 text-slate-400'}`}>
                                                      {u.role}
                                                  </span>
                                              </td>
                                              <td className="px-6 py-4 text-center font-mono font-bold text-white">
                                                  {c.emission.toFixed(2)}
                                              </td>
                                              <td className="px-6 py-4 text-center font-mono text-slate-400">
                                                  {c.energy.toFixed(2)}
                                              </td>
                                              <td className="px-6 py-4 text-center">
                                                  <div className="text-xs">
                                                      <span className="text-emerald-400" title="Active">{(c.activeEmission || 0).toFixed(2)}</span>
                                                      <span className="text-slate-600 mx-1">/</span>
                                                      <span className="text-amber-400" title="Idle">{(c.idleEmission || 0).toFixed(2)}</span>
                                                  </div>
                                              </td>
                                              <td className="px-6 py-4 text-center font-bold text-emerald-500">
                                                  {c.saved.toFixed(0)}
                                              </td>
                                              <td className="px-6 py-4 text-right">
                                                  <span className={`font-bold ${netImpact > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                      {netImpact > 0 ? '+' : ''}{netImpact.toFixed(1)}g
                                                  </span>
                                              </td>
                                          </tr>
                                      );
                                  })}
                                  {/* Total Row */}
                                  <tr className="bg-slate-800/50 font-bold border-t-2 border-slate-600">
                                      <td className="px-6 py-4 text-white uppercase tracking-wider">Total Platform</td>
                                      <td></td>
                                      <td className="px-6 py-4 text-center text-white">{aggregates.totalCarbonEmission.toFixed(2)}</td>
                                      <td className="px-6 py-4 text-center text-slate-400">{aggregates.totalEnergy.toFixed(2)}</td>
                                      <td className="px-6 py-4 text-center">
                                          <span className="text-emerald-400">{aggregates.totalActiveEmission.toFixed(2)}</span> / <span className="text-amber-400">{aggregates.totalIdleEmission.toFixed(2)}</span>
                                      </td>
                                      <td className="px-6 py-4 text-center text-emerald-500">{aggregates.totalCarbonSaved.toFixed(0)}</td>
                                      <td className="px-6 py-4 text-right text-emerald-400">
                                          +{(aggregates.totalCarbonSaved - aggregates.totalCarbonEmission).toFixed(2)}g
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                  </div>

                  <AdminAnalytics aggregates={aggregates} users={users} />
              </div>
          )}

      </main>

      {/* Add Admin Modal */}
      {showAddAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
              <div className={`w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden ${theme.modalBg}`}>
                  <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                      <h3 className={`font-bold text-lg ${theme.heading}`}>Add Administrator</h3>
                      <button onClick={() => setShowAddAdminModal(false)} className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                          <X size={20} />
                      </button>
                  </div>
                  
                  <div className="p-6 space-y-6">
                      {!selectedPotentialAdmin ? (
                          <div className="space-y-4">
                              <p className={`text-sm ${theme.cardText}`}>Search for an existing user to promote them to the Admin Team.</p>
                              <div className="relative">
                                  <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                                  <input 
                                      value={potentialAdminSearch}
                                      onChange={e => setPotentialAdminSearch(e.target.value)}
                                      placeholder="Search by name, email or mobile..."
                                      className={`w-full pl-10 p-3 rounded-xl border outline-none ${theme.input} focus:border-indigo-500`}
                                      autoFocus
                                  />
                              </div>
                              
                              <div className={`max-h-48 overflow-y-auto space-y-2 rounded-xl border p-2 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                                  {potentialAdmins.length === 0 ? (
                                      <p className="text-center text-xs text-slate-500 py-4">No matching non-admin users found.</p>
                                  ) : (
                                      potentialAdmins.map(u => (
                                          <div 
                                            key={u.id} 
                                            onClick={() => setSelectedPotentialAdmin(u)}
                                            className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-indigo-500/10 transition ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                                          >
                                              <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xs">
                                                  {u.businessName[0]}
                                              </div>
                                              <div className="flex-1">
                                                  <div className={`font-bold text-sm ${theme.heading}`}>{u.businessName}</div>
                                                  <div className="text-xs text-slate-500">{u.email || u.mobile}</div>
                                              </div>
                                              <UserPlus size={16} className="text-indigo-500" />
                                          </div>
                                      ))
                                  )}
                              </div>
                          </div>
                      ) : (
                          <div className="space-y-6 animate-slide-in-right">
                              <div className={`p-4 rounded-xl border flex items-center gap-3 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                                      {selectedPotentialAdmin.businessName[0]}
                                  </div>
                                  <div>
                                      <h4 className={`font-bold ${theme.heading}`}>{selectedPotentialAdmin.businessName}</h4>
                                      <p className="text-xs text-slate-500">Selected User</p>
                                  </div>
                                  <button onClick={() => setSelectedPotentialAdmin(null)} className="ml-auto text-xs text-indigo-500 hover:underline">Change</button>
                              </div>

                              <div>
                                  <label className={`block text-xs font-bold uppercase mb-2 ${theme.cardText}`}>Assign Role</label>
                                  <div className="grid grid-cols-1 gap-3">
                                      <label className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition ${newAdminRoleType === 'super_admin' ? 'border-amber-500 bg-amber-500/10' : `${theme.card} hover:border-slate-500`}`}>
                                          <input type="radio" name="role" checked={newAdminRoleType === 'super_admin'} onChange={() => setNewAdminRoleType('super_admin')} className="accent-amber-500" />
                                          <div>
                                              <div className={`font-bold text-sm ${newAdminRoleType === 'super_admin' ? 'text-amber-500' : theme.heading}`}>Super Admin</div>
                                              <div className="text-xs text-slate-500">Full access to manage users, admins, and system settings.</div>
                                          </div>
                                      </label>
                                      
                                      <label className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition ${newAdminRoleType === 'support_admin' ? 'border-blue-500 bg-blue-500/10' : `${theme.card} hover:border-slate-500`}`}>
                                          <input type="radio" name="role" checked={newAdminRoleType === 'support_admin'} onChange={() => setNewAdminRoleType('support_admin')} className="accent-blue-500" />
                                          <div>
                                              <div className={`font-bold text-sm ${newAdminRoleType === 'support_admin' ? 'text-blue-500' : theme.heading}`}>Support Admin</div>
                                              <div className="text-xs text-slate-500">Can manage users (lock/unlock) but cannot modify admin team.</div>
                                          </div>
                                      </label>

                                      <label className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition ${newAdminRoleType === 'viewer' ? 'border-slate-500 bg-slate-500/10' : `${theme.card} hover:border-slate-500`}`}>
                                          <input type="radio" name="role" checked={newAdminRoleType === 'viewer'} onChange={() => setNewAdminRoleType('viewer')} className="accent-slate-500" />
                                          <div>
                                              <div className={`font-bold text-sm ${newAdminRoleType === 'viewer' ? 'text-slate-500' : theme.heading}`}>Viewer</div>
                                              <div className="text-xs text-slate-500">Read-only access to dashboards and reports.</div>
                                          </div>
                                      </label>
                                  </div>
                              </div>

                              <button 
                                onClick={handlePromoteUser}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition flex items-center justify-center gap-2"
                              >
                                  <ShieldAlert size={18} /> Grant Admin Access
                              </button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* User Detail Modal - Fully Restored */}
      {selectedUser && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className={`w-full max-w-md h-full shadow-2xl overflow-y-auto animate-slide-in-right border-l ${theme.modalBg}`}>
                  <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                      <h3 className={`font-bold text-lg ${theme.heading}`}>User Profile</h3>
                      <button onClick={() => setSelectedUser(null)} className="p-2 rounded-full hover:bg-slate-800"><X size={20} className={theme.cardText}/></button>
                  </div>
                  
                  <div className="p-6 space-y-8">
                      {/* Identity Card */}
                      <div className="text-center relative">
                          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl font-bold shadow-lg mb-4 ${selectedUser.isLocked ? 'bg-red-900 text-red-200' : 'bg-indigo-600 text-white'}`}>
                              {selectedUser.isLocked ? <Lock size={32}/> : selectedUser.businessName[0]}
                          </div>
                          <h2 className={`text-2xl font-bold ${theme.heading}`}>{selectedUser.businessName}</h2>
                          <p className={`text-sm ${theme.cardText} mb-2`}>{selectedUser.location}</p>
                          <div className="flex justify-center gap-2">
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 capitalize">{selectedUser.role}</span>
                              {selectedUser.subscription === 'pro' && <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-900/30 text-amber-500 border border-amber-500/30 flex items-center gap-1"><Crown size={10}/> Pro</span>}
                          </div>
                      </div>

                      {/* Carbon Status */}
                      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                          <h4 className={`text-xs font-bold uppercase mb-4 flex items-center gap-2 ${theme.cardText}`}><Leaf size={14}/> Eco-Impact</h4>
                          <div className="grid grid-cols-2 gap-4 text-center">
                              <div>
                                  <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{(selectedUser.usageStats?.carbon.emission || 0).toFixed(1)}g</div>
                                  <div className="text-[10px] text-slate-500">Emitted</div>
                              </div>
                              <div>
                                  <div className="text-xl font-bold text-emerald-500">{(selectedUser.usageStats?.carbon.saved || 0).toFixed(1)}g</div>
                                  <div className="text-[10px] text-slate-500">Saved</div>
                              </div>
                          </div>
                      </div>

                      {/* Info Grid */}
                      <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 border-b border-slate-800">
                              <span className={`text-sm ${theme.cardText}`}>Mobile</span>
                              <span className={`font-mono text-sm ${theme.heading}`}>{selectedUser.mobile || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 border-b border-slate-800">
                              <span className={`text-sm ${theme.cardText}`}>Email</span>
                              <span className={`font-mono text-sm ${theme.heading}`}>{selectedUser.email || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 border-b border-slate-800">
                              <span className={`text-sm ${theme.cardText}`}>Joined</span>
                              <span className={`font-mono text-sm ${theme.heading}`}>{new Date(parseInt(selectedUser.id)).toLocaleDateString()}</span>
                          </div>
                      </div>

                      {/* Controls */}
                      <div className="space-y-3 pt-4 border-t border-slate-800">
                          <p className={`text-xs font-bold uppercase mb-2 ${theme.cardText}`}>Administrative Actions</p>
                          
                          <button 
                              onClick={() => handleLockUser(selectedUser.id, selectedUser.businessName)}
                              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${selectedUser.isLocked ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
                          >
                              {selectedUser.isLocked ? <Unlock size={16}/> : <Lock size={16}/>}
                              {selectedUser.isLocked ? 'Unlock Account' : 'Lock Account'}
                          </button>

                          <button 
                              onClick={() => handleResetPin(selectedUser.id, selectedUser.businessName)}
                              className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                          >
                              <RotateCcw size={16}/> Reset Security PIN
                          </button>

                          {canDelete && (
                              <button 
                                  onClick={() => handleDeleteUser(selectedUser.id, selectedUser.businessName)}
                                  className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-red-900/20 text-red-500 hover:bg-red-900/40 transition"
                              >
                                  <Trash2 size={16}/> Delete User Permanently
                              </button>
                          )}
                      </div>

                      {/* Quota Management */}
                      <div className="pt-4 border-t border-slate-800">
                          <p className={`text-xs font-bold uppercase mb-3 ${theme.cardText}`}>Carbon Limit Configuration</p>
                          <div className="flex gap-2">
                              <input 
                                  type="number"
                                  placeholder={selectedUser.customCarbonLimit?.toString() || DAILY_CARBON_LIMIT.toString()}
                                  value={editingLimit}
                                  onChange={(e) => setEditingLimit(e.target.value)}
                                  className={`flex-1 p-3 rounded-xl outline-none border font-mono text-sm ${theme.input}`}
                              />
                              <button 
                                  onClick={handleUpdateLimit}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-xl font-bold text-sm"
                              >
                                  Update
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminDashboard;
