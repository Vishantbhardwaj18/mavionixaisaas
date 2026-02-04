
import React, { useState, useEffect } from 'react';
import { FileText, Megaphone, BookOpen, ChevronLeft, Send, CheckCircle, Layout, Globe, Leaf, HelpCircle, Package, TrendingUp, Plus, Trash2, Calculator, ShieldCheck, AlertCircle, RefreshCw, Filter, Search, Truck, Calendar, MapPin, BarChart3, AlertTriangle, Sparkles, Users, ArrowUpRight, ArrowDownLeft, Wallet, Phone, History, ArrowRight, Store, Clock, Tag, Landmark, Lightbulb, Briefcase, UserPlus } from 'lucide-react';
import { CARBON_ESTIMATES, UI_TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface Props {
  onAction: (prompt: string) => void;
  language: Language;
  initialTool?: string | null;
  onToolExit?: () => void;
}

// --- TYPES ---
interface LineItem {
  id: number;
  desc: string;
  qty: number;
  price: number;
  tax: number;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  qty: number;
  unit: string;
  minLevel: number;
  price: number;
  expiry?: string;
  location?: string;
  supplier?: string;
  batch?: string;
}

// KHATA TYPES
interface KhataParty {
  id: string;
  name: string;
  type: 'Customer' | 'Supplier';
  mobile: string;
  balance: number; // > 0: You will get (Receivable), < 0: You will give (Payable)
  lastUpdated: number;
}

interface KhataTransaction {
  id: string;
  partyId: string;
  amount: number;
  type: 'GAVE' | 'GOT'; // GAVE = Credit (Balance +), GOT = Payment (Balance -)
  date: string;
  notes?: string;
}

// MARKET TYPES
interface ShopPrice {
  id: string;
  commodity: string;
  price: number;
  unit: string;
  shopName: string;
  location: string;
  type: 'Retail' | 'Wholesale';
  quality?: string;
  updatedAt: number;
  ownerId: string; // To identify my prices
  isOfficial?: boolean; 
}

// CRM TYPES
interface Lead {
    id: string;
    name: string;
    contact: string;
    status: 'New' | 'Contacted' | 'Converted' | 'Lost';
    value: number;
    notes?: string;
}

const ToolsDashboard: React.FC<Props> = ({ onAction, language, initialTool, onToolExit }) => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const t = UI_TRANSLATIONS[language]?.tools || UI_TRANSLATIONS[Language.ENGLISH].tools;

  // Sync initialTool prop to state when it changes
  useEffect(() => {
      if (initialTool) {
          setActiveTool(initialTool);
      }
  }, [initialTool]);

  const handleBack = () => {
      setActiveTool(null);
      if (onToolExit) onToolExit();
  };

  // --- SMART INVOICE STATE ---
  const [invType, setInvType] = useState('Tax Invoice');
  const [invCurrency, setInvCurrency] = useState('INR');
  const [invTheme, setInvTheme] = useState('Modern');
  const [invClient, setInvClient] = useState({ name: '', gst: '', address: '', email: '' });
  const [invItems, setInvItems] = useState<LineItem[]>([
      { id: 1, desc: '', qty: 1, price: 0, tax: 18 }
  ]);
  const [invDueDate, setInvDueDate] = useState('');
  const [invNotes, setInvNotes] = useState('');
  const [invChecking, setInvChecking] = useState(false);
  const [invComplianceMsg, setInvComplianceMsg] = useState('');

  // --- INVENTORY MANAGER STATE ---
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [invSearch, setInvSearch] = useState('');
  const [invTab, setInvTab] = useState<'list' | 'add' | 'in' | 'out'>('list');
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({ category: 'General', unit: 'pcs' });
  const invTotalValue = inventory.reduce((acc, i) => acc + (i.qty * i.price), 0);
  const invLowStock = inventory.filter(i => i.qty <= i.minLevel).length;
  const filteredInventory = inventory.filter(i => i.name.toLowerCase().includes(invSearch.toLowerCase()) || i.category.toLowerCase().includes(invSearch.toLowerCase()));

  // --- KHATA BOOK STATE ---
  const [khataParties, setKhataParties] = useState<KhataParty[]>([]);
  const [khataTransactions, setKhataTransactions] = useState<KhataTransaction[]>([]);
  const [khataView, setKhataView] = useState<'dashboard' | 'add_party' | 'party_detail'>('dashboard');
  const [selectedPartyId, setSelectedPartyId] = useState<string | null>(null);
  const [newParty, setNewParty] = useState({ 
      name: '', 
      mobile: '', 
      type: 'Customer' as 'Customer' | 'Supplier',
      openingBalance: '',
      openingType: 'to_collect' as 'to_collect' | 'to_pay' 
  });
  const [txnAmount, setTxnAmount] = useState('');
  const [txnNotes, setTxnNotes] = useState('');
  const [khataSearch, setKhataSearch] = useState('');

  // Khata Computed
  const totalToCollect = khataParties.filter(p => p.balance > 0).reduce((acc, p) => acc + p.balance, 0);
  const totalToPay = khataParties.filter(p => p.balance < 0).reduce((acc, p) => acc + Math.abs(p.balance), 0);
  const filteredParties = khataParties.filter(p => p.name.toLowerCase().includes(khataSearch.toLowerCase()));
  const selectedParty = khataParties.find(p => p.id === selectedPartyId);
  const selectedPartyTxns = khataTransactions.filter(t => t.partyId === selectedPartyId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // --- MARKET ENGINE STATE ---
  const [marketTab, setMarketTab] = useState<'mandi' | 'community' | 'manage'>('mandi');
  const [globalPrices, setGlobalPrices] = useState<ShopPrice[]>([]);
  
  // Persistent Shop Identity for this device
  const [myShopId] = useState(() => {
      const stored = localStorage.getItem('mavionix_shop_id');
      if (stored) return stored;
      const newId = 'SHOP-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      localStorage.setItem('mavionix_shop_id', newId);
      return newId;
  });

  // My Shop Form
  const [shopComm, setShopComm] = useState('');
  const [shopPrice, setShopPrice] = useState('');
  const [shopUnit, setShopUnit] = useState('kg');
  const [shopType, setShopType] = useState<'Retail' | 'Wholesale'>('Retail');
  const [shopQuality, setShopQuality] = useState('');
  const [marketSearch, setMarketSearch] = useState('');
  const [marketCrop, setMarketCrop] = useState('');
  const [marketLocation, setMarketLocation] = useState('');

  // --- CRM STATE ---
  const [crmLeads, setCrmLeads] = useState<Lead[]>([]);
  const [newLead, setNewLead] = useState<Partial<Lead>>({ status: 'New' });
  const [crmView, setCrmView] = useState<'list' | 'add'>('list');

  // --- IDEA LAB STATE ---
  const [ideaInput, setIdeaInput] = useState('');

  // Real-time Market Sync
  useEffect(() => {
      const syncPrices = () => {
          const stored = localStorage.getItem('mavionix_global_prices');
          if (stored) {
              setGlobalPrices(JSON.parse(stored));
          }
      };
      
      syncPrices(); // Initial load
      
      const interval = setInterval(syncPrices, 3000); // Poll every 3s for "Live" effect
      return () => clearInterval(interval);
  }, []);

  const myShopPrices = globalPrices.filter(p => p.ownerId === myShopId);

  const handleBroadcastPrice = () => {
      if (!shopComm || !shopPrice) return;
      
      const newPrice: ShopPrice = {
          id: Date.now().toString(),
          commodity: shopComm,
          price: parseFloat(shopPrice),
          unit: shopUnit,
          shopName: "My Business", // In real app, this comes from UserProfile
          location: marketLocation || "Local Market", // Use entered location or default
          type: shopType,
          quality: shopQuality,
          updatedAt: Date.now(),
          ownerId: myShopId,
          isOfficial: false
      };

      const updatedGlobal = [newPrice, ...globalPrices];
      setGlobalPrices(updatedGlobal);
      localStorage.setItem('mavionix_global_prices', JSON.stringify(updatedGlobal));

      // Reset Form
      setShopComm('');
      setShopPrice('');
      setShopQuality('');
      alert("Price Broadcasted to Community Live Board!");
      setMarketTab('community');
  };

  const handleDeletePrice = (id: string) => {
      const updatedGlobal = globalPrices.filter(p => p.id !== id);
      setGlobalPrices(updatedGlobal);
      localStorage.setItem('mavionix_global_prices', JSON.stringify(updatedGlobal));
  };

  const handleMarketAI = () => {
      const myItems = myShopPrices.map(p => p.commodity);
      const relevantCommunityPrices = globalPrices
        .filter(p => myItems.includes(p.commodity) && p.ownerId !== myShopId);
      
      const communityAvg = relevantCommunityPrices.length > 0 
        ? relevantCommunityPrices.reduce((acc, p) => acc + p.price, 0) / relevantCommunityPrices.length
        : "N/A";

      const prompt = `
        ACT AS PRICING ENGINE AI.
        My Shop Prices: ${JSON.stringify(myShopPrices)}
        Community Market Data (Sample): ${JSON.stringify(globalPrices.slice(0, 15))}
        Calculated Avg for My Items: ${communityAvg}
        
        Task:
        1. Compare my prices to the community average.
        2. Identify if I am overpricing or underpricing.
        3. Suggest a competitive price strategy.
        
        Output a short strategic report.
      `;
      onAction(prompt);
      handleBack(); // Should close the tool? No, maybe keep it open.
      // But props said onAction closes tool usually. Let's keep consistent.
      setActiveTool(null); 
  };

  // Invoice Calculations
  const calculateTotals = () => {
      let subtotal = 0;
      let totalTax = 0;
      invItems.forEach(item => {
          const lineTotal = item.qty * item.price;
          const taxAmount = (lineTotal * item.tax) / 100;
          subtotal += lineTotal;
          totalTax += taxAmount;
      });
      return { subtotal, totalTax, total: subtotal + totalTax };
  };
  const { subtotal, totalTax, total } = calculateTotals();

  // --- HANDLERS ---

  // Khata Handlers
  const handleAddParty = () => {
      if (!newParty.name) return;
      
      let initialBalance = 0;
      if (newParty.openingBalance) {
          const amount = parseFloat(newParty.openingBalance);
          if (!isNaN(amount)) {
              initialBalance = newParty.openingType === 'to_collect' ? amount : -amount;
          }
      }

      const party: KhataParty = {
          id: Date.now().toString(),
          name: newParty.name,
          mobile: newParty.mobile,
          type: newParty.type,
          balance: initialBalance,
          lastUpdated: Date.now()
      };
      setKhataParties([party, ...khataParties]);
      setNewParty({ name: '', mobile: '', type: 'Customer', openingBalance: '', openingType: 'to_collect' });
      setKhataView('dashboard');
  };

  const handleAddTransaction = (type: 'GAVE' | 'GOT') => {
      if (!selectedPartyId || !txnAmount) return;
      const amount = parseFloat(txnAmount);
      if (isNaN(amount) || amount <= 0) return;

      const txn: KhataTransaction = {
          id: Date.now().toString(),
          partyId: selectedPartyId,
          amount,
          type,
          date: new Date().toISOString(),
          notes: txnNotes
      };

      setKhataTransactions([txn, ...khataTransactions]);
      
      // Update Balance: 
      // GAVE (Credit) -> You gave money/goods -> Balance increases (Receivable)
      // GOT (Payment) -> You got money -> Balance decreases
      const balanceChange = type === 'GAVE' ? amount : -amount;
      
      setKhataParties(khataParties.map(p => 
          p.id === selectedPartyId 
              ? { ...p, balance: p.balance + balanceChange, lastUpdated: Date.now() } 
              : p
      ));

      setTxnAmount('');
      setTxnNotes('');
  };

  const handleKhataAIAnalysis = () => {
      const prompt = `
        ACT AS KHATA MANAGER AI.
        Current Ledger State:
        Total Receivables: ${totalToCollect}
        Total Payables: ${totalToPay}
        Parties: ${JSON.stringify(khataParties.map(p => ({name: p.name, balance: p.balance})))}
        
        Task:
        1. Identify overdue payments.
        2. Suggest cash flow optimization steps.
        
        Output a summarized report.
      `;
      onAction(prompt);
      setActiveTool(null);
  };

  // CRM Handlers
  const handleAddLead = () => {
      if (!newLead.name) return;
      const lead: Lead = {
          id: Date.now().toString(),
          name: newLead.name,
          contact: newLead.contact || '',
          status: newLead.status || 'New',
          value: Number(newLead.value) || 0,
          notes: newLead.notes || ''
      };
      setCrmLeads([...crmLeads, lead]);
      setNewLead({ status: 'New' });
      setCrmView('list');
  };

  const handleCrmAnalysis = () => {
      const prompt = `
        ACT AS SALES CRM AI.
        Current Leads: ${JSON.stringify(crmLeads)}
        
        Task:
        1. Analyze pipeline health (Total Value, Conversion ratios).
        2. Identify 'Hot' leads that need immediate action.
        3. Suggest follow-up actions for stalled leads.
        
        Return JSON type 'crm' with analysis data.
      `;
      onAction(prompt);
      setActiveTool(null);
  };

  // Idea Lab Handler
  const handleIdeaSubmit = () => {
      if (!ideaInput) return;
      const prompt = `
        ACT AS STARTUP MENTOR AI.
        User Idea: "${ideaInput}"
        
        Task:
        1. Validate this business idea for feasibility in the Indian market.
        2. Identify key competitors.
        3. Suggest a pricing strategy.
        4. Outline an executive summary.
        
        Return JSON type 'idea' with structured plan.
      `;
      onAction(prompt);
      setActiveTool(null);
  };

  // Inventory Handlers
  const handleAddItem = () => {
      setInvItems([...invItems, { id: Date.now(), desc: '', qty: 1, price: 0, tax: 18 }]);
  };

  const handleRemoveItem = (id: number) => {
      if (invItems.length > 1) {
          setInvItems(invItems.filter(i => i.id !== id));
      }
  };

  const handleItemChange = (id: number, field: keyof LineItem, value: any) => {
      setInvItems(invItems.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const checkCompliance = () => {
      setInvChecking(true);
      setTimeout(() => {
          setInvChecking(false);
          if (total > 50000 && !invClient.gst) {
              setInvComplianceMsg('⚠️ Risk: GSTIN recommended for invoices > ₹50k.');
          } else if (!invClient.name) {
              setInvComplianceMsg('❌ Error: Client Name is missing.');
          } else {
              setInvComplianceMsg('✅ Compliant: All mandatory fields look good.');
          }
      }, 1500);
  };

  const handleSmartInvoiceSubmit = () => {
     if(!invClient.name || invItems.length === 0) return;
     const itemsStr = invItems.map(i => `${i.desc} (Qty: ${i.qty}, Rate: ${i.price}, Tax: ${i.tax}%)`).join(', ');
     const prompt = `
        Generate a ${invTheme} style ${invType} in ${invCurrency}.
        Client: ${invClient.name}, GST: ${invClient.gst}, Address: ${invClient.address}.
        Items: ${itemsStr}.
        Due Date: ${invDueDate}. Notes: ${invNotes}.
        ACT AS THE INVOICE:
        1. Calculate final amounts correctly.
        2. Provide the JSON data for the invoice display including the field "theme": "${invTheme}".
        3. In the text response, speak as the invoice explaining the tax breakdown and due date rules.
     `;
     onAction(prompt);
     setActiveTool(null);
  };

  const handleInventoryAction = () => {
      if (invTab === 'add') {
          if (!newItem.name || !newItem.qty) return;
          const item: InventoryItem = {
              id: Date.now().toString(),
              name: newItem.name,
              category: newItem.category || 'General',
              qty: Number(newItem.qty),
              unit: newItem.unit || 'pcs',
              minLevel: Number(newItem.minLevel) || 0,
              price: Number(newItem.price) || 0,
              expiry: newItem.expiry,
              supplier: newItem.supplier,
              location: newItem.location
          };
          setInventory([...inventory, item]);
          setNewItem({ category: 'General', unit: 'pcs' });
          setInvTab('list');
      } else {
          const prompt = `
            ACT AS INVENTORY MANAGER AI.
            Current Inventory State: ${JSON.stringify(inventory)}
            Task:
            1. Identify items below 'minLevel'.
            2. Calculate total inventory valuation.
            3. Check for expired or near-expiry items.
            4. Recommend reorders to optimize stock.
            Output JSON format for 'inventory'.
          `;
          onAction(prompt);
          setActiveTool(null);
      }
  };

  // --- EXISTING TOOLS STATE (Other) ---
  const [event, setEvent] = useState('Sale');
  const [offer, setOffer] = useState('');
  const [webBizName, setWebBizName] = useState('');
  const [webServices, setWebServices] = useState('');
  const [webStyle, setWebStyle] = useState('Modern');
  const [webContact, setWebContact] = useState('');
  const [helpQuery, setHelpQuery] = useState('');

  const tools = [
    { 
      id: 'invoice', 
      name: t.invoice, 
      desc: 'AI-powered compliant billing engine.', 
      icon: <FileText size={24} className="text-blue-500"/>,
      bg: 'bg-blue-50',
      saving: CARBON_ESTIMATES.INVOICE.saved
    },
    { 
      id: 'inventory', 
      name: t.inventory, 
      desc: 'Track stock levels & get alerts.', 
      icon: <Package size={24} className="text-amber-500"/>,
      bg: 'bg-amber-50',
      saving: CARBON_ESTIMATES.INVENTORY.saved
    },
    { 
      id: 'market', 
      name: t.market, 
      desc: 'Check live market rates.', 
      icon: <TrendingUp size={24} className="text-green-600"/>,
      bg: 'bg-green-50',
      saving: CARBON_ESTIMATES.MARKET.saved
    },
    { 
      id: 'crm', 
      name: t.crm, 
      desc: 'Manage leads & sales pipeline.', 
      icon: <Users size={24} className="text-purple-600"/>,
      bg: 'bg-purple-50',
      saving: CARBON_ESTIMATES.CRM.saved
    },
    { 
      id: 'idea', 
      name: t.idea, 
      desc: 'Validate business ideas with AI.', 
      icon: <Lightbulb size={24} className="text-yellow-500"/>,
      bg: 'bg-yellow-50',
      saving: CARBON_ESTIMATES.IDEA.saved
    },
    { 
      id: 'marketing', 
      name: t.marketing, 
      desc: 'Design social media posts & ads.', 
      icon: <Megaphone size={24} className="text-pink-500"/>,
      bg: 'bg-pink-50',
      saving: CARBON_ESTIMATES.MARKETING.saved
    },
    { 
      id: 'khata', 
      name: t.khata, 
      desc: 'Record credit and debit entries.', 
      icon: <BookOpen size={24} className="text-emerald-500"/>,
      bg: 'bg-emerald-50',
      saving: CARBON_ESTIMATES.KHATA.saved
    },
    { 
      id: 'website', 
      name: t.website, 
      desc: 'Launch your business online in minutes.', 
      icon: <Layout size={24} className="text-blue-400"/>,
      bg: 'bg-blue-50',
      saving: CARBON_ESTIMATES.WEBSITE.saved
    },
    { 
      id: 'hr', 
      name: t.hr, 
      desc: 'Manage team roster & payroll.', 
      icon: <Briefcase size={24} className="text-slate-600"/>,
      bg: 'bg-slate-100',
      saving: CARBON_ESTIMATES.HR.saved
    },
    { 
      id: 'help', 
      name: t.help, 
      desc: 'Ask questions or report issues.', 
      icon: <HelpCircle size={24} className="text-cyan-500"/>,
      bg: 'bg-cyan-50',
      saving: 5 
    }
  ];

  const handleMarketingSubmit = () => {
      if(!offer) return;
      const prompt = `Create a marketing DESIGN for event "${event}" with offer: "${offer}".`;
      onAction(prompt);
      setActiveTool(null);
  };

  const handleWebsiteSubmit = () => {
      if(!webBizName || !webServices) return;
      const prompt = `Create a WEBSITE for "${webBizName}" offering services: "${webServices}". Use a ${webStyle} design style. Contact info: ${webContact}.`;
      onAction(prompt);
      setActiveTool(null);
  };

  const handleMarketSubmit = () => {
      const loc = marketLocation || "my region";
      const crop = marketCrop || "common crops";
      const prompt = `Check MARKET/MANDI RATES for "${crop}" in "${loc}". Show trends.`;
      onAction(prompt);
      setActiveTool(null);
  };

  const handleHelpSubmit = () => {
      if(!helpQuery) return;
      const prompt = `I need help with MaVionix: "${helpQuery}". Please assist me by explaining the feature or resolving the issue.`;
      onAction(prompt);
      setActiveTool(null);
      setHelpQuery('');
  };

  // Render Tool Grid
  if (!activeTool) {
    return (
      <div className="p-4 md:p-8 space-y-6 animate-fade-in">
         <div>
            <h2 className="text-2xl font-bold text-slate-800">{t.title}</h2>
            <p className="text-slate-500">{t.desc}</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map(tool => (
               <button 
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-slate-200 text-left transition-all flex flex-col gap-4 relative overflow-hidden group"
               >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tool.bg} group-hover:scale-110 transition-transform`}>
                     {tool.icon}
                  </div>
                  <div>
                     <h3 className="font-bold text-lg text-slate-800">{tool.name}</h3>
                     <p className="text-sm text-slate-500">{tool.desc}</p>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-[10px] font-bold border border-emerald-100">
                    <Leaf size={10} /> Saves ~{tool.saving}g CO₂
                  </div>
               </button>
            ))}
         </div>
      </div>
    );
  }

  // --- KHATA BOOK UI ---
  if (activeTool === 'khata') {
      return (
          <div className="p-4 md:p-8 animate-fade-in max-w-5xl mx-auto w-full">
              <button onClick={handleBack} className="flex items-center gap-1 text-slate-500 mb-6 hover:text-slate-800">
                  <ChevronLeft size={20} /> Back to Tools
              </button>

              {/* Khata Header */}
              <div className="flex justify-between items-start mb-6">
                  <div>
                      <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                          <BookOpen className="text-purple-600" /> Khata Book
                      </h2>
                      <p className="text-slate-500 text-sm">AI-Powered Digital Ledger</p>
                  </div>
                  {khataParties.length > 0 && (
                      <button 
                        onClick={handleKhataAIAnalysis}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg hover:bg-indigo-700 transition"
                      >
                          <Sparkles size={14} /> AI Risk Analysis
                      </button>
                  )}
              </div>

              {/* Main Khata Content */}
              {khataParties.length === 0 && khataView === 'dashboard' ? (
                  // Empty State
                  <div className="flex flex-col items-center justify-center py-16 bg-white border-2 border-dashed border-slate-200 rounded-3xl text-center">
                      <div className="bg-purple-50 p-6 rounded-full mb-4">
                          <Users size={48} className="text-purple-300" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-700 mb-2">No customers or suppliers yet</h3>
                      <p className="text-slate-500 text-sm max-w-xs mb-6">Start maintaining your digital ledger by adding your first party. It's safe, secure, and paperless.</p>
                      <button 
                          onClick={() => setKhataView('add_party')}
                          className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-purple-700 transition flex items-center gap-2"
                      >
                          <Plus size={18} /> Add First Customer
                      </button>
                  </div>
              ) : (
                  <>
                      {/* Active Dashboard View */}
                      {khataView === 'dashboard' && (
                          <div className="space-y-6">
                              {/* Summary Cards */}
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-green-50 border border-green-100 p-5 rounded-2xl">
                                      <p className="text-xs font-bold text-green-700 uppercase mb-1">You will get</p>
                                      <p className="text-2xl font-bold text-green-800">₹{totalToCollect.toLocaleString()}</p>
                                      <p className="text-[10px] text-green-600 mt-1">From {khataParties.filter(p => p.balance > 0).length} parties</p>
                                  </div>
                                  <div className="bg-red-50 border border-red-100 p-5 rounded-2xl">
                                      <p className="text-xs font-bold text-red-700 uppercase mb-1">You will give</p>
                                      <p className="text-2xl font-bold text-red-800">₹{totalToPay.toLocaleString()}</p>
                                      <p className="text-[10px] text-red-600 mt-1">To {khataParties.filter(p => p.balance < 0).length} parties</p>
                                  </div>
                              </div>

                              {/* Party List */}
                              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                      <div className="relative flex-1 mr-4">
                                          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                                          <input 
                                              value={khataSearch}
                                              onChange={(e) => setKhataSearch(e.target.value)}
                                              placeholder="Search Name..."
                                              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-purple-500"
                                          />
                                      </div>
                                      <button 
                                          onClick={() => setKhataView('add_party')}
                                          className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition shadow-sm"
                                      >
                                          <Plus size={20} />
                                      </button>
                                  </div>
                                  <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                                      {filteredParties.map(party => (
                                          <div 
                                              key={party.id} 
                                              onClick={() => { setSelectedPartyId(party.id); setKhataView('party_detail'); }}
                                              className="p-4 hover:bg-slate-50 transition cursor-pointer flex justify-between items-center group"
                                          >
                                              <div className="flex items-center gap-3">
                                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${party.balance > 0 ? 'bg-green-100 text-green-700' : party.balance < 0 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                                                      {party.name[0]}
                                                  </div>
                                                  <div>
                                                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-purple-700 transition">{party.name}</h4>
                                                      <p className="text-[10px] text-slate-500">{new Date(party.lastUpdated).toLocaleDateString()}</p>
                                                  </div>
                                              </div>
                                              <div className="text-right">
                                                  <p className={`font-bold text-sm ${party.balance > 0 ? 'text-green-600' : party.balance < 0 ? 'text-red-600' : 'text-slate-400'}`}>
                                                      {party.balance === 0 ? 'Settled' : `₹${Math.abs(party.balance).toLocaleString()}`}
                                                  </p>
                                                  <p className="text-[10px] text-slate-400 uppercase font-bold">
                                                      {party.balance > 0 ? 'Due' : party.balance < 0 ? 'Advance' : ''}
                                                  </p>
                                              </div>
                                          </div>
                                      ))}
                                      {filteredParties.length === 0 && (
                                          <div className="p-8 text-center text-slate-400 text-sm">No parties found.</div>
                                      )}
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* Add Party View */}
                      {khataView === 'add_party' && (
                          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg max-w-md mx-auto">
                              <h3 className="font-bold text-slate-800 mb-6">Add New Party</h3>
                              <div className="space-y-4">
                                  <div>
                                      <label className="text-xs font-bold text-slate-500 uppercase">Party Name</label>
                                      <input 
                                          value={newParty.name}
                                          onChange={(e) => setNewParty({...newParty, name: e.target.value})}
                                          className="w-full p-3 border rounded-xl outline-none focus:border-purple-500 mt-1"
                                          placeholder="e.g. Rahul Kirana"
                                          autoFocus
                                      />
                                  </div>
                                  <div>
                                      <label className="text-xs font-bold text-slate-500 uppercase">Mobile Number</label>
                                      <input 
                                          value={newParty.mobile}
                                          onChange={(e) => setNewParty({...newParty, mobile: e.target.value})}
                                          className="w-full p-3 border rounded-xl outline-none focus:border-purple-500 mt-1"
                                          placeholder="10 digit mobile"
                                      />
                                  </div>
                                  <div>
                                      <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
                                      <div className="flex gap-4 mt-1">
                                          <button 
                                              onClick={() => setNewParty({...newParty, type: 'Customer'})}
                                              className={`flex-1 py-2 rounded-lg border text-sm font-bold ${newParty.type === 'Customer' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'bg-white'}`}
                                          >
                                              Customer
                                          </button>
                                          <button 
                                              onClick={() => setNewParty({...newParty, type: 'Supplier'})}
                                              className={`flex-1 py-2 rounded-lg border text-sm font-bold ${newParty.type === 'Supplier' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'bg-white'}`}
                                          >
                                              Supplier
                                          </button>
                                      </div>
                                  </div>
                                  
                                  {/* Opening Balance Section */}
                                  <div>
                                      <label className="text-xs font-bold text-slate-500 uppercase">Opening Balance (Optional)</label>
                                      <div className="flex gap-2 mt-1">
                                          <div className="flex-1 relative">
                                              <span className="absolute left-3 top-2.5 font-bold text-slate-400">₹</span>
                                              <input 
                                                  type="number"
                                                  value={newParty.openingBalance}
                                                  onChange={(e) => setNewParty({...newParty, openingBalance: e.target.value})}
                                                  className="w-full pl-7 pr-3 py-2.5 border rounded-xl outline-none focus:border-purple-500 font-bold"
                                                  placeholder="0"
                                              />
                                          </div>
                                          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                                              <button 
                                                  onClick={() => setNewParty({...newParty, openingType: 'to_collect'})}
                                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${newParty.openingType === 'to_collect' ? 'bg-green-100 text-green-700 shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                                              >
                                                  Receive
                                              </button>
                                              <button 
                                                  onClick={() => setNewParty({...newParty, openingType: 'to_pay'})}
                                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${newParty.openingType === 'to_pay' ? 'bg-red-100 text-red-700 shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                                              >
                                                  Pay
                                              </button>
                                          </div>
                                      </div>
                                  </div>

                                  <div className="flex gap-3 pt-4">
                                      <button onClick={() => setKhataView('dashboard')} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl">Cancel</button>
                                      <button onClick={handleAddParty} disabled={!newParty.name} className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:bg-purple-700 disabled:opacity-50">Save Party</button>
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* Party Detail & Transaction View */}
                      {khataView === 'party_detail' && selectedParty && (
                          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden flex flex-col h-[500px]">
                              {/* Header */}
                              <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                  <div className="flex items-center gap-3">
                                      <button onClick={() => setKhataView('dashboard')} className="p-1 hover:bg-slate-200 rounded-full"><ChevronLeft size={20}/></button>
                                      <div>
                                          <h3 className="font-bold text-slate-800">{selectedParty.name}</h3>
                                          <p className="text-xs text-slate-500 flex items-center gap-1">
                                              {selectedParty.type} {selectedParty.mobile ? `• ${selectedParty.mobile}` : ''}
                                          </p>
                                      </div>
                                  </div>
                                  <div className="text-right">
                                      <p className={`text-xl font-bold ${selectedParty.balance > 0 ? 'text-green-600' : selectedParty.balance < 0 ? 'text-red-600' : 'text-slate-600'}`}>
                                          ₹{Math.abs(selectedParty.balance).toLocaleString()}
                                      </p>
                                      <p className="text-[10px] text-slate-400 uppercase font-bold">
                                          {selectedParty.balance > 0 ? 'You will Get' : selectedParty.balance < 0 ? 'You will Give' : 'Settled'}
                                      </p>
                                  </div>
                              </div>

                              {/* Transaction List */}
                              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
                                  {selectedPartyTxns.length === 0 ? (
                                      <div className="text-center text-slate-400 py-10 text-sm">No transactions yet.</div>
                                  ) : (
                                      selectedPartyTxns.map(txn => (
                                          <div key={txn.id} className={`flex justify-between items-center p-3 rounded-xl border ${txn.type === 'GAVE' ? 'bg-red-50/50 border-red-100' : 'bg-green-50/50 border-green-100'}`}>
                                              <div>
                                                  <p className="text-xs text-slate-500">{new Date(txn.date).toLocaleDateString()} <span className="opacity-50">• {new Date(txn.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span></p>
                                                  <p className="text-sm text-slate-700 font-medium">{txn.notes || (txn.type === 'GAVE' ? 'Credit Given' : 'Payment Received')}</p>
                                              </div>
                                              <div className={`font-bold ${txn.type === 'GAVE' ? 'text-red-600' : 'text-green-600'}`}>
                                                  {txn.type === 'GAVE' ? <ArrowUpRight size={16} className="inline"/> : <ArrowDownLeft size={16} className="inline"/>}
                                                  ₹{txn.amount.toLocaleString()}
                                              </div>
                                          </div>
                                      ))
                                  )}
                              </div>

                              {/* Input Area */}
                              <div className="p-4 bg-white border-t border-slate-200">
                                  <div className="flex gap-2 mb-3">
                                      <input 
                                          type="number" 
                                          value={txnAmount}
                                          onChange={(e) => setTxnAmount(e.target.value)}
                                          placeholder="Amount (₹)"
                                          className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-lg"
                                      />
                                      <input 
                                          value={txnNotes}
                                          onChange={(e) => setTxnNotes(e.target.value)}
                                          placeholder="Note (Optional)"
                                          className="flex-[2] p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500 text-sm"
                                      />
                                  </div>
                                  <div className="flex gap-3">
                                      <button 
                                          onClick={() => handleAddTransaction('GAVE')}
                                          disabled={!txnAmount}
                                          className="flex-1 py-3 bg-red-100 text-red-700 font-bold rounded-xl hover:bg-red-200 transition disabled:opacity-50 flex flex-col items-center justify-center gap-0.5"
                                      >
                                          <div className="flex items-center gap-1"><ArrowUpRight size={16} /> YOU GAVE</div>
                                          <span className="text-[10px] opacity-70 font-normal">
                                              {selectedParty.type === 'Customer' ? '(Sale/Credit)' : '(Payment)'}
                                          </span>
                                      </button>
                                      <button 
                                          onClick={() => handleAddTransaction('GOT')}
                                          disabled={!txnAmount}
                                          className="flex-1 py-3 bg-green-100 text-green-700 font-bold rounded-xl hover:bg-green-200 transition disabled:opacity-50 flex flex-col items-center justify-center gap-0.5"
                                      >
                                          <div className="flex items-center gap-1"><ArrowDownLeft size={16} /> YOU GOT</div>
                                          <span className="text-[10px] opacity-70 font-normal">
                                              {selectedParty.type === 'Customer' ? '(Payment)' : '(Purchase/Credit)'}
                                          </span>
                                      </button>
                                  </div>
                              </div>
                          </div>
                      )}
                  </>
              )}
          </div>
      );
  }

  // --- SMART INVOICE GENERATOR UI ---
  if (activeTool === 'invoice') {
     return (
        <div className="p-4 md:p-8 animate-fade-in max-w-5xl mx-auto w-full">
            <button onClick={handleBack} className="flex items-center gap-1 text-slate-500 mb-6 hover:text-slate-800">
               <ChevronLeft size={20} /> Back to Tools
            </button>
            
            <div className="flex flex-col lg:flex-row gap-6">
                {/* ... Invoice Editor Code ... */}
                <div className="flex-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FileText className="text-blue-600" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">Smart Invoice</h2>
                            </div>
                            <div className="flex gap-2">
                                <select 
                                    value={invType} 
                                    onChange={(e) => setInvType(e.target.value)}
                                    className="text-xs font-bold bg-slate-100 border-none rounded-lg px-2 py-1 outline-none cursor-pointer"
                                >
                                    <option>Tax Invoice</option>
                                    <option>Proforma</option>
                                    <option>Bill of Supply</option>
                                    <option>Export Invoice</option>
                                </select>
                                <select 
                                    value={invCurrency} 
                                    onChange={(e) => setInvCurrency(e.target.value)}
                                    className="text-xs font-bold bg-slate-100 border-none rounded-lg px-2 py-1 outline-none cursor-pointer"
                                >
                                    <option>INR (₹)</option>
                                    <option>USD ($)</option>
                                    <option>EUR (€)</option>
                                </select>
                            </div>
                        </div>

                        {/* Client Section */}
                        <div className="space-y-4 mb-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase">Bill To</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input 
                                    value={invClient.name}
                                    onChange={(e) => setInvClient({...invClient, name: e.target.value})}
                                    placeholder="Client Name / Business"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                                />
                                <input 
                                    value={invClient.gst}
                                    onChange={(e) => setInvClient({...invClient, gst: e.target.value})}
                                    placeholder="GSTIN (Optional)"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                                />
                                <input 
                                    value={invClient.address}
                                    onChange={(e) => setInvClient({...invClient, address: e.target.value})}
                                    placeholder="Billing Address"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none md:col-span-2"
                                />
                            </div>
                        </div>

                        {/* Line Items */}
                        <div className="space-y-3 mb-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase flex justify-between items-center">
                                <span>Items & Services</span>
                                <span className="text-[10px] text-slate-400">Auto-calculated</span>
                            </h3>
                            <div className="space-y-2">
                                {invItems.map((item) => (
                                    <div key={item.id} className="flex gap-2 items-start group">
                                        <div className="flex-1 space-y-2">
                                            <input 
                                                value={item.desc}
                                                onChange={(e) => handleItemChange(item.id, 'desc', e.target.value)}
                                                placeholder="Item Description"
                                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm"
                                            />
                                            <div className="flex gap-2">
                                                <input 
                                                    type="number"
                                                    value={item.qty}
                                                    onChange={(e) => handleItemChange(item.id, 'qty', parseFloat(e.target.value) || 0)}
                                                    placeholder="Qty"
                                                    className="w-20 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm"
                                                />
                                                <input 
                                                    type="number"
                                                    value={item.price}
                                                    onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                                                    placeholder="Price"
                                                    className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm"
                                                />
                                                <select
                                                    value={item.tax}
                                                    onChange={(e) => handleItemChange(item.id, 'tax', parseFloat(e.target.value))}
                                                    className="w-20 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm cursor-pointer"
                                                >
                                                    <option value={0}>0%</option>
                                                    <option value={5}>5%</option>
                                                    <option value={12}>12%</option>
                                                    <option value={18}>18%</option>
                                                    <option value={28}>28%</option>
                                                </select>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition mt-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleAddItem} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                                <Plus size={14} /> Add Item
                            </button>
                        </div>

                        {/* Extra Details */}
                        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Due Date</label>
                                <input 
                                    type="date"
                                    value={invDueDate}
                                    onChange={(e) => setInvDueDate(e.target.value)}
                                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Theme</label>
                                <select 
                                    value={invTheme}
                                    onChange={(e) => setInvTheme(e.target.value)}
                                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm"
                                >
                                    <option>Modern</option>
                                    <option>Minimal</option>
                                    <option>Corporate</option>
                                    <option>Eco-Friendly</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary & Action Column */}
                <div className="w-full lg:w-80 space-y-4">
                    
                    {/* Live Summary Card */}
                    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                        <h4 className="text-sm font-bold text-slate-400 uppercase mb-4">Invoice Summary</h4>
                        
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Subtotal</span>
                                <span>{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Tax</span>
                                <span>{totalTax.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-slate-700 pt-2 flex justify-between text-lg font-bold text-emerald-400">
                                <span>Total</span>
                                <span>{invCurrency === 'INR' ? '₹' : invCurrency === 'USD' ? '$' : '€'}{total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleSmartInvoiceSubmit}
                            disabled={!invClient.name || total === 0}
                            className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
                        >
                            <CheckCircle size={18} className="text-emerald-600" /> Generate Invoice
                        </button>
                    </div>

                    {/* AI Compliance Check */}
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-indigo-900 text-sm flex items-center gap-2">
                                <ShieldCheck size={16} /> AI Auditor
                            </h4>
                            <button onClick={checkCompliance} className="text-xs bg-white border border-indigo-200 px-2 py-1 rounded text-indigo-700 hover:bg-indigo-100">
                                {invChecking ? <RefreshCw size={12} className="animate-spin"/> : 'Check Now'}
                            </button>
                        </div>
                        <p className={`text-xs leading-relaxed ${invComplianceMsg.includes('Error') ? 'text-red-600' : invComplianceMsg.includes('Risk') ? 'text-amber-600' : 'text-indigo-700'}`}>
                            {invComplianceMsg || "Scan for errors before sending."}
                        </p>
                    </div>

                    {/* Carbon Footprint Preview */}
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-emerald-800 uppercase">Eco Impact</p>
                            <p className="text-sm font-bold text-emerald-600">~100g Saved</p>
                        </div>
                        <Leaf size={24} className="text-emerald-400" />
                    </div>

                </div>
            </div>
        </div>
     );
  }

  // --- AI INVENTORY MANAGER UI ---
  if (activeTool === 'inventory') {
      return (
         <div className="p-4 md:p-8 animate-fade-in max-w-6xl mx-auto w-full">
             <button onClick={handleBack} className="flex items-center gap-1 text-slate-500 mb-6 hover:text-slate-800">
                <ChevronLeft size={20} /> Back to Tools
             </button>
             
             {/* Header Stats */}
             <div className="grid grid-cols-3 gap-4 mb-6">
                 <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center">
                     <span className="text-xs text-slate-500 uppercase font-bold">Total SKUs</span>
                     <span className="text-2xl font-bold text-slate-800">{inventory.length}</span>
                 </div>
                 <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center">
                     <span className="text-xs text-slate-500 uppercase font-bold">Stock Value</span>
                     <span className="text-2xl font-bold text-emerald-600">₹{invTotalValue.toLocaleString()}</span>
                 </div>
                 <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center">
                     <span className="text-xs text-slate-500 uppercase font-bold">Alerts</span>
                     <span className={`text-2xl font-bold ${invLowStock > 0 ? 'text-red-500' : 'text-slate-800'}`}>{invLowStock}</span>
                 </div>
             </div>

             <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
                 
                 {/* Left Panel: Stock List */}
                 <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col">
                     <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                         <div className="flex items-center gap-2">
                             <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><Package size={20}/></div>
                             <h3 className="font-bold text-slate-800">Stock List</h3>
                         </div>
                         <div className="relative">
                             <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                             <input 
                                value={invSearch}
                                onChange={(e) => setInvSearch(e.target.value)}
                                placeholder="Search items..."
                                className="pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-500"
                             />
                         </div>
                     </div>
                     
                     <div className="flex-1 overflow-y-auto p-2">
                         {filteredInventory.length === 0 ? (
                             <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                 <Package size={48} className="mb-2 opacity-50" />
                                 <p className="text-sm">No items in stock.</p>
                                 <p className="text-xs">Add your first product to get started.</p>
                             </div>
                         ) : (
                             <table className="w-full text-sm text-left">
                                 <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
                                     <tr>
                                         <th className="px-4 py-3 rounded-l-lg">Item</th>
                                         <th className="px-4 py-3">Qty</th>
                                         <th className="px-4 py-3">Location</th>
                                         <th className="px-4 py-3 rounded-r-lg">Status</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-100">
                                     {filteredInventory.map(item => (
                                         <tr key={item.id} className="hover:bg-slate-50">
                                             <td className="px-4 py-3">
                                                 <div className="font-bold text-slate-800">{item.name}</div>
                                                 <div className="text-xs text-slate-500">{item.category}</div>
                                             </td>
                                             <td className="px-4 py-3">
                                                 <span className="font-mono font-bold text-slate-700">{item.qty}</span> <span className="text-xs text-slate-400">{item.unit}</span>
                                             </td>
                                             <td className="px-4 py-3 text-xs text-slate-600">{item.location || '-'}</td>
                                             <td className="px-4 py-3">
                                                 {item.qty <= item.minLevel ? (
                                                     <span className="bg-red-100 text-red-700 text-[10px] px-2 py-1 rounded-full font-bold flex items-center w-fit gap-1"><AlertTriangle size={10}/> Low</span>
                                                 ) : item.expiry && new Date(item.expiry) < new Date('2025-01-01') ? (
                                                     <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-1 rounded-full font-bold w-fit">Expiring</span>
                                                 ) : (
                                                     <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold w-fit">Good</span>
                                                 )}
                                             </td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                         )}
                     </div>
                 </div>

                 {/* Right Panel: Operations Console */}
                 <div className="w-full lg:w-96 flex flex-col gap-4">
                     
                     {/* Action Tabs */}
                     <div className="bg-white p-1 rounded-xl border border-slate-200 flex shadow-sm">
                         <button onClick={() => setInvTab('list')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${invTab === 'list' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>Console</button>
                         <button onClick={() => setInvTab('add')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${invTab === 'add' ? 'bg-amber-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>+ Add Product</button>
                     </div>

                     {invTab === 'add' ? (
                         <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-200 flex-1 overflow-y-auto">
                             <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Package size={18} className="text-amber-500"/> New Item</h4>
                             <div className="space-y-3">
                                 <div>
                                     <label className="text-xs font-bold text-slate-500 uppercase">Product Name</label>
                                     <input value={newItem.name || ''} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:border-amber-500 text-sm" placeholder="e.g. Wheat Flour" />
                                 </div>
                                 <div className="grid grid-cols-2 gap-3">
                                     <div>
                                         <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                                         <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full p-2 border rounded-lg outline-none text-sm bg-white">
                                             <option>General</option>
                                             <option>Grains</option>
                                             <option>Electronics</option>
                                             <option>Apparel</option>
                                         </select>
                                     </div>
                                     <div>
                                         <label className="text-xs font-bold text-slate-500 uppercase">Unit</label>
                                         <select value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})} className="w-full p-2 border rounded-lg outline-none text-sm bg-white">
                                             <option>pcs</option>
                                             <option>kg</option>
                                             <option>L</option>
                                             <option>box</option>
                                         </select>
                                     </div>
                                 </div>
                                 <div className="grid grid-cols-2 gap-3">
                                     <div>
                                         <label className="text-xs font-bold text-slate-500 uppercase">Quantity</label>
                                         <input type="number" value={newItem.qty || ''} onChange={e => setNewItem({...newItem, qty: Number(e.target.value)})} className="w-full p-2 border rounded-lg outline-none text-sm" placeholder="0" />
                                     </div>
                                     <div>
                                         <label className="text-xs font-bold text-slate-500 uppercase">Min Level</label>
                                         <input type="number" value={newItem.minLevel || ''} onChange={e => setNewItem({...newItem, minLevel: Number(e.target.value)})} className="w-full p-2 border rounded-lg outline-none text-sm" placeholder="Alert at" />
                                     </div>
                                 </div>
                                 <div>
                                     <label className="text-xs font-bold text-slate-500 uppercase">Supplier</label>
                                     <input value={newItem.supplier || ''} onChange={e => setNewItem({...newItem, supplier: e.target.value})} className="w-full p-2 border rounded-lg outline-none text-sm" placeholder="Supplier Name" />
                                 </div>
                                 <div>
                                     <label className="text-xs font-bold text-slate-500 uppercase">Location / Shelf</label>
                                     <input value={newItem.location || ''} onChange={e => setNewItem({...newItem, location: e.target.value})} className="w-full p-2 border rounded-lg outline-none text-sm" placeholder="e.g. A1" />
                                 </div>
                                 <button onClick={handleInventoryAction} className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl mt-2 transition">Save Item</button>
                             </div>
                         </div>
                     ) : (
                         <div className="flex-1 flex flex-col gap-4">
                             {/* AI Insights Card */}
                             <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl flex-1 relative overflow-hidden">
                                 <div className="absolute top-0 right-0 p-4 opacity-10"><RefreshCw size={80} className="text-indigo-600"/></div>
                                 <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2"><Sparkles size={16}/> AI Manager</h4>
                                 <p className="text-xs text-indigo-800 leading-relaxed mb-4">
                                     I'm monitoring your stock levels. Click analyze to get a full report on expiry risks and reorder suggestions.
                                 </p>
                                 
                                 <div className="bg-white/60 rounded-xl p-3 mb-4 backdrop-blur-sm">
                                     <div className="flex justify-between text-xs font-bold text-indigo-900 mb-1">
                                         <span>Health Score</span>
                                         <span>{inventory.length > 0 ? '85%' : '0%'}</span>
                                     </div>
                                     <div className="w-full bg-indigo-200 h-1.5 rounded-full overflow-hidden">
                                         <div className="h-full bg-indigo-600" style={{width: inventory.length > 0 ? '85%' : '0%'}}></div>
                                     </div>
                                 </div>

                                 <button 
                                    onClick={handleInventoryAction}
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-2"
                                 >
                                     <BarChart3 size={18}/> Analyze Inventory
                                 </button>
                             </div>

                             {/* Quick Scan */}
                             <div className="bg-white border border-slate-200 p-4 rounded-2xl">
                                 <h4 className="font-bold text-slate-800 text-sm mb-2">Quick Actions</h4>
                                 <div className="grid grid-cols-2 gap-2">
                                     <button className="py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-600 border border-slate-200">Scan Barcode</button>
                                     <button className="py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-600 border border-slate-200">Stock Audit</button>
                                 </div>
                             </div>
                         </div>
                     )}
                 </div>
             </div>
         </div>
      );
  }

  // --- EXISTING TOOLS RENDER (Marketing, Khata, etc.) ...
  
  if (activeTool === 'marketing') {
     return (
        <div className="p-4 md:p-8 animate-fade-in max-w-2xl mx-auto w-full">
            <button onClick={handleBack} className="flex items-center gap-1 text-slate-500 mb-6 hover:text-slate-800">
               <ChevronLeft size={20} /> Back to Tools
            </button>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                     <Megaphone className="text-pink-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Create Marketing Post</h2>
               </div>
               
               <div className="space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Event / Theme</label>
                     <select 
                        value={event}
                        onChange={(e) => setEvent(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-pink-500 outline-none"
                     >
                        <option>Sale</option>
                        <option>New Arrival</option>
                        <option>Festival (Diwali/Eid)</option>
                        <option>General Announcement</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Offer Details</label>
                     <input 
                        value={offer}
                        onChange={(e) => setOffer(e.target.value)}
                        placeholder="e.g. Buy 1 Get 1 Free on all Rice"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-pink-500 outline-none"
                     />
                  </div>
                  <button 
                     onClick={handleMarketingSubmit}
                     disabled={!offer}
                     className="w-full py-3 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                     <CheckCircle size={18} /> Create Design
                  </button>
               </div>
            </div>
        </div>
     );
  }

  // Render Website Builder Tool
  if (activeTool === 'website') {
      return (
         <div className="p-4 md:p-8 animate-fade-in max-w-2xl mx-auto w-full">
             <button onClick={handleBack} className="flex items-center gap-1 text-slate-500 mb-6 hover:text-slate-800">
                <ChevronLeft size={20} /> Back to Tools
             </button>
             <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Layout className="text-purple-600" />
                   </div>
                   <h2 className="text-xl font-bold text-slate-800">Website Builder</h2>
                </div>
                
                <div className="space-y-4">
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Business Name</label>
                      <input 
                         value={webBizName}
                         onChange={(e) => setWebBizName(e.target.value)}
                         placeholder="e.g. Sharma Textiles"
                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-500 outline-none"
                      />
                   </div>
                   
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Services / Products Offered</label>
                      <textarea 
                         value={webServices}
                         onChange={(e) => setWebServices(e.target.value)}
                         placeholder="e.g. Cotton Sarees, Silk Suits, Custom Tailoring..."
                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-500 outline-none h-24 resize-none"
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Design Style</label>
                        <select 
                           value={webStyle}
                           onChange={(e) => setWebStyle(e.target.value)}
                           className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-500 outline-none"
                        >
                           <option value="Modern">Modern (Clean & Minimal)</option>
                           <option value="Classic">Classic (Trusted & Bold)</option>
                           <option value="Vibrant">Vibrant (Colorful & Fun)</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact Info (Optional)</label>
                        <input 
                           value={webContact}
                           onChange={(e) => setWebContact(e.target.value)}
                           placeholder="Phone / Email"
                           className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-500 outline-none"
                        />
                     </div>
                   </div>
                   
                   <button 
                      onClick={handleWebsiteSubmit}
                      disabled={!webBizName || !webServices}
                      className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                      <Globe size={18} /> Generate Website
                  </button>
                </div>
             </div>
         </div>
      );
   }

   // Render Help Tool
   if (activeTool === 'help') {
    return (
        <div className="p-4 md:p-8 animate-fade-in max-w-2xl mx-auto w-full">
            <button onClick={handleBack} className="flex items-center gap-1 text-slate-500 mb-6 hover:text-slate-800">
               <ChevronLeft size={20} /> Back to Tools
            </button>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                     <HelpCircle className="text-cyan-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Help & Support Center</h2>
               </div>
               
               <div className="space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">How can we help?</label>
                     <textarea 
                        value={helpQuery}
                        onChange={(e) => setHelpQuery(e.target.value)}
                        placeholder="e.g. How do I create a new invoice? or I found a bug in the design studio..."
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-cyan-500 outline-none h-32 resize-none"
                     />
                  </div>
                  
                  <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100 text-cyan-800 text-sm">
                      <p className="font-bold mb-1">Did you know?</p>
                      <p className="text-xs">MaVionix AI can guide you through every feature step-by-step. Just ask!</p>
                  </div>

                  <button 
                     onClick={handleHelpSubmit}
                     disabled={!helpQuery}
                     className="w-full py-3 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                     <Send size={18} /> Ask AI Assistant
                  </button>
               </div>
            </div>
        </div>
    );
  }

  return null;
};

export default ToolsDashboard;
