
import React from 'react';
import { ServiceType, Language } from '../types';
import { Download, Share2, ExternalLink, BarChart2, CheckCircle, Globe, Phone, Mail, Layout, MapPin, FileText, Printer, Palette, Type, Package, AlertTriangle, TrendingUp, TrendingDown, Minus, ShoppingCart, Truck, Lightbulb, User, Target, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Props {
  type: ServiceType;
  data: any;
  language?: Language;
}

const LABELS: Record<string, Record<string, string>> = {
    'Total': {
        [Language.HINDI]: 'कुल',
        [Language.TAMIL]: 'மொத்தம்',
        [Language.BENGALI]: 'মোট',
    },
    'Tax': {
        [Language.HINDI]: 'कर',
        [Language.TAMIL]: 'வரி',
        [Language.BENGALI]: 'কর',
    },
    'Bill To': {
        [Language.HINDI]: 'बिल',
        [Language.TAMIL]: 'பில் பெற',
        [Language.BENGALI]: 'বিল টু',
    },
    'Item': {
        [Language.HINDI]: 'वस्तु',
        [Language.TAMIL]: 'பொருள்',
        [Language.BENGALI]: 'আইটেম',
    },
    'Qty': {
        [Language.HINDI]: 'मात्रा',
        [Language.TAMIL]: 'அளவு',
        [Language.BENGALI]: 'পরিমাণ',
    },
    'Price': {
        [Language.HINDI]: 'मूल्य',
        [Language.TAMIL]: 'விலை',
        [Language.BENGALI]: 'দাম',
    }
};

const getLabel = (key: string, lang: Language) => {
    if (!LABELS[key]) return key;
    return LABELS[key][lang] || key;
};

const ServiceDisplay: React.FC<Props> = ({ type, data, language = Language.ENGLISH }) => {
  
  if (type === ServiceType.IDEA) {
      return (
          <div className="w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-md animate-fade-in">
              <div className="flex justify-between items-start mb-4">
                  <div>
                      <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                          <span className="bg-yellow-100 p-1.5 rounded-lg text-yellow-600"><Lightbulb size={18} /></span>
                          {data.title || "Startup Idea"}
                      </h3>
                      <div className="text-xs text-slate-500 mt-1">AI Validation Report</div>
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-100">
                      Score: {data.feasibilityScore || 'N/A'}/100
                  </div>
              </div>

              <div className="space-y-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Executive Summary</h4>
                      <p className="text-sm text-slate-700 leading-relaxed">{data.executiveSummary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                          <h4 className="text-xs font-bold text-blue-700 uppercase mb-1">Target Market</h4>
                          <p className="text-xs text-blue-900 leading-relaxed">{data.targetMarket}</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                          <h4 className="text-xs font-bold text-purple-700 uppercase mb-1">Pricing Strategy</h4>
                          <p className="text-xs text-purple-900 leading-relaxed">{data.pricingStrategy}</p>
                      </div>
                  </div>

                  {data.competitors && (
                      <div>
                          <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Potential Competitors</h4>
                          <div className="flex gap-2 flex-wrap">
                              {data.competitors.map((comp: string, i: number) => (
                                  <span key={i} className="text-xs bg-slate-100 border border-slate-200 px-2 py-1 rounded-md text-slate-600">
                                      {comp}
                                  </span>
                              ))}
                          </div>
                      </div>
                  )}
                  
                  <button className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                      <Download size={14} /> Download Business Plan
                  </button>
              </div>
          </div>
      );
  }

  if (type === ServiceType.CRM) {
      return (
          <div className="w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-md animate-fade-in">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-4">
                  <span className="bg-purple-100 p-1.5 rounded-lg text-purple-600"><Target size={18} /></span>
                  Sales Pipeline Analysis
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                      <div className="text-xs text-slate-500 font-bold uppercase">Total Leads</div>
                      <div className="text-xl font-bold text-slate-800">{data.totalLeads}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                      <div className="text-xs text-slate-500 font-bold uppercase">Conv. Rate</div>
                      <div className="text-xl font-bold text-emerald-600">{data.conversionRate}</div>
                  </div>
              </div>

              {data.hotLeads && data.hotLeads.length > 0 && (
                  <div className="mb-4">
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1"><Activity size={12} className="text-red-500"/> Action Required</h4>
                      <ul className="space-y-2">
                          {data.hotLeads.map((lead: string, i: number) => (
                              <li key={i} className="flex justify-between items-center bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                                  <span className="text-xs font-bold text-red-800">{lead}</span>
                                  <span className="text-[10px] text-red-600 uppercase font-bold bg-white px-2 py-0.5 rounded-full border border-red-100">Hot Lead</span>
                              </li>
                          ))}
                      </ul>
                  </div>
              )}

              <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl mb-3">
                  <h4 className="text-xs font-bold text-indigo-800 uppercase mb-1">AI Insights</h4>
                  <p className="text-xs text-indigo-700 leading-relaxed">{data.analysis}</p>
              </div>

              {data.nextActions && (
                  <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Suggested Next Steps</h4>
                      <div className="flex gap-2 flex-wrap">
                          {data.nextActions.map((action: string, i: number) => (
                              <span key={i} className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-1 rounded-md text-slate-600 font-medium">
                                  {action}
                              </span>
                          ))}
                      </div>
                  </div>
              )}
          </div>
      );
  }

  // --- EXISTING TYPES ---

  if (type === ServiceType.INVOICE) {
    // Theme selection logic
    const theme = data.theme || 'Modern';
    
    const stylesMap: any = {
        'Modern': {
            bg: 'bg-white',
            border: 'border-slate-200',
            header: 'text-slate-800',
            accent: 'text-blue-600',
            btnPrimary: 'bg-indigo-600 text-white',
            btnSecondary: 'bg-white border-slate-200 text-slate-700',
            font: 'font-sans'
        },
        'Minimal': {
            bg: 'bg-white',
            border: 'border-black',
            header: 'text-black font-serif',
            accent: 'text-black',
            btnPrimary: 'bg-black text-white rounded-none',
            btnSecondary: 'bg-white border-black text-black rounded-none',
            font: 'font-serif'
        },
        'Corporate': {
            bg: 'bg-slate-50',
            border: 'border-slate-300',
            header: 'text-slate-900',
            accent: 'text-slate-700',
            btnPrimary: 'bg-slate-800 text-white',
            btnSecondary: 'bg-white border-slate-300 text-slate-800',
            font: 'font-sans'
        },
        'Eco-Friendly': {
            bg: 'bg-green-50',
            border: 'border-green-200',
            header: 'text-green-900',
            accent: 'text-emerald-700',
            btnPrimary: 'bg-emerald-700 text-white',
            btnSecondary: 'bg-white border-emerald-200 text-emerald-800',
            font: 'font-sans'
        }
    };

    const themeStyles = stylesMap[theme] || stylesMap['Modern'];

    // Safe extraction of customer data in case AI nests it
    let customerName = 'Cash Customer';
    let customerAddress = data.clientAddress || '';
    let customerGst = data.clientGst || '';

    if (data.customer) {
        if (typeof data.customer === 'object') {
            customerName = data.customer.name || 'Customer';
            customerAddress = data.customer.address || customerAddress;
            customerGst = data.customer.gst || customerGst;
        } else {
            customerName = data.customer;
        }
    }

    return (
      <div className={`w-full p-6 rounded-xl border shadow-md text-sm ${themeStyles.bg} ${themeStyles.border} ${themeStyles.font}`}>
         <div className="flex justify-between items-start mb-6 border-b pb-4" style={{ borderColor: theme === 'Minimal' ? 'black' : '#e2e8f0' }}>
            <div>
              <h3 className={`text-2xl font-bold uppercase tracking-wider ${themeStyles.header}`}>INVOICE</h3>
              <p className={`text-xs ${theme === 'Eco-Friendly' ? 'text-green-700' : 'text-slate-500'}`}>#{data.invoiceNo || 'INV-001'}</p>
            </div>
            <div className="text-right">
               <p className={`font-bold ${themeStyles.accent}`}>{data.date}</p>
               {data.dueDate && <p className="text-xs text-red-500 font-bold mt-1">Due: {data.dueDate}</p>}
            </div>
         </div>
         
         <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
                <p className="text-[10px] font-bold uppercase opacity-60 mb-1">{getLabel('Bill To', language)}</p>
                <p className={`font-bold text-lg ${themeStyles.header}`}>{customerName}</p>
                {customerAddress && <p className="text-xs opacity-70 mt-1 max-w-[150px]">{customerAddress}</p>}
                {customerGst && <p className="text-xs opacity-70 font-mono mt-1">GSTIN: {customerGst}</p>}
            </div>
            {/* Show notes if any */}
            {data.notes && (
                <div className="text-right">
                    <p className="text-[10px] font-bold uppercase opacity-60 mb-1">Notes</p>
                    <p className="text-xs opacity-70 italic">{data.notes}</p>
                </div>
            )}
         </div>

         <table className="w-full mb-6">
            <thead>
               <tr className={`text-xs border-b ${theme === 'Minimal' ? 'border-black text-black' : 'border-slate-200 text-slate-500'}`}>
                  <th className="text-left py-2 font-bold uppercase">{getLabel('Item', language)}</th>
                  <th className="text-right py-2 font-bold uppercase">{getLabel('Qty', language)}</th>
                  <th className="text-right py-2 font-bold uppercase">{getLabel('Price', language)}</th>
                  <th className="text-right py-2 font-bold uppercase">{getLabel('Total', language)}</th>
               </tr>
            </thead>
            <tbody>
               {data.items?.map((item: any, i: number) => (
                  <tr key={i} className={`border-b ${theme === 'Minimal' ? 'border-gray-200' : 'border-slate-50'}`}>
                     <td className={`py-3 ${themeStyles.header}`}>{item.desc}</td>
                     <td className="text-right py-3 opacity-80">{item.qty}</td>
                     <td className="text-right py-3 opacity-80">{item.price}</td>
                     <td className={`text-right py-3 font-bold ${themeStyles.accent}`}>{item.total || parseInt(item.qty)*parseInt(item.price)}</td>
                  </tr>
               ))}
            </tbody>
         </table>

         <div className="flex justify-end mb-8">
             <div className="w-1/2 space-y-2">
                <div className="flex justify-between text-xs opacity-70">
                   <span>Subtotal</span>
                   <span>{data.subtotal}</span>
                </div>
                <div className="flex justify-between text-xs opacity-70">
                   <span>{getLabel('Tax', language)}</span>
                   <span>{data.tax}</span>
                </div>
                <div className={`flex justify-between font-bold text-lg border-t pt-2 mt-2 ${theme === 'Minimal' ? 'border-black' : 'border-slate-200'} ${themeStyles.accent}`}>
                   <span>{getLabel('Total', language)}</span>
                   <span>{data.total}</span>
                </div>
             </div>
         </div>

         <div className="flex gap-2">
            <button className={`flex-1 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition shadow-sm ${themeStyles.btnPrimary}`}>
               <Printer size={16} /> Print
            </button>
            <button className={`flex-1 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-opacity-50 transition shadow-sm ${themeStyles.btnSecondary}`}>
               <Share2 size={16} /> Share
            </button>
         </div>
         
         <div className="mt-4 text-center">
             <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Generated by MaVionix</span>
         </div>
      </div>
    );
  }

  if (type === ServiceType.INVENTORY) {
    // Determine status color based on low stock count
    const statusColor = data.lowStockCount > 0 ? 'text-amber-600' : 'text-emerald-600';
    const statusBg = data.lowStockCount > 0 ? 'bg-amber-50' : 'bg-emerald-50';

    return (
      <div className="w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-md">
        <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Package className="text-indigo-600" size={20} /> Inventory Report
            </h3>
            <div className={`text-xs font-bold px-2 py-1 rounded-md ${statusBg} ${statusColor}`}>
                {data.lowStockCount > 0 ? `${data.lowStockCount} Alerts` : 'Healthy'}
            </div>
        </div>
        
        {/* KPI Grid */}
        <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Total Items</div>
                <div className="text-xl font-bold text-slate-800">{data.totalItems || 0}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Valuation</div>
                <div className="text-xl font-bold text-emerald-600">₹{(data.valuation || 0).toLocaleString()}</div>
            </div>
            <div className={`bg-slate-50 p-3 rounded-xl border border-slate-100 text-center ${data.alerts?.length ? 'border-red-200 bg-red-50' : ''}`}>
                <div className={`text-[10px] uppercase font-bold ${data.alerts?.length ? 'text-red-600' : 'text-slate-500'}`}>Issues</div>
                <div className={`text-xl font-bold ${data.alerts?.length ? 'text-red-600' : 'text-slate-800'}`}>{data.alerts?.length || 0}</div>
            </div>
        </div>

        {/* AI Alerts */}
        {data.alerts && data.alerts.length > 0 && (
            <div className="mb-6 bg-red-50 border border-red-100 rounded-xl p-3">
                <h4 className="text-xs font-bold text-red-800 uppercase mb-2 flex items-center gap-1"><AlertTriangle size={12}/> Critical Alerts</h4>
                <ul className="space-y-1">
                    {data.alerts.map((alert: string, idx: number) => (
                        <li key={idx} className="text-xs text-red-700 flex items-start gap-2">
                            <span className="mt-1 w-1 h-1 rounded-full bg-red-400"></span> {alert}
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {/* Reorder Recommendations */}
        {data.recommendations && data.recommendations.length > 0 && (
            <div className="mb-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1"><ShoppingCart size={12}/> AI Reorder Suggestions</h4>
                <div className="space-y-2">
                    {data.recommendations.map((rec: string, idx: number) => (
                        <div key={idx} className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-xs text-indigo-800 flex items-center justify-between">
                            <span>{rec}</span>
                            <button className="bg-white p-1 rounded-md text-indigo-600 hover:bg-indigo-100 transition shadow-sm" title="Auto-Draft Order">
                                <Truck size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <div className="text-[10px] text-center text-slate-400 mt-2">
            Generated by MaVionix AI • Real-time Data
        </div>
      </div>
    );
  }

  if (type === ServiceType.MARKET) {
    return (
        <div className="w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-emerald-900 flex items-center gap-2">
                   <span className="bg-emerald-100 p-1 rounded">📈</span> Market Rates
                </h3>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-bold flex items-center gap-1">
                   <MapPin size={10} /> {data.location || 'Local Mandi'}
                </span>
            </div>

            <div className="grid gap-3">
                {data.commodities?.map((item: any, i: number) => {
                    const isUp = item.trend === 'up';
                    const isDown = item.trend === 'down';
                    
                    return (
                        <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                             <div>
                                 <div className="font-bold text-slate-800">{item.name}</div>
                                 <div className="text-xs text-slate-500">{item.price}</div>
                             </div>
                             <div className={`text-right flex flex-col items-end`}>
                                 <div className={`text-sm font-bold flex items-center gap-1 ${isUp ? 'text-green-600' : isDown ? 'text-red-600' : 'text-slate-500'}`}>
                                     {isUp ? <TrendingUp size={14}/> : isDown ? <TrendingDown size={14}/> : <Minus size={14}/>}
                                     {item.change}
                                 </div>
                                 <div className="text-[10px] text-slate-400 capitalize">{item.trend} Trend</div>
                             </div>
                        </div>
                    )
                })}
            </div>
            <p className="text-[10px] text-slate-400 mt-3 text-center">Rates are approximate and subject to market changes.</p>
        </div>
    );
  }

  if (type === ServiceType.SCHEME) {
    return (
      <div className="space-y-4 w-full">
        <h3 className="font-bold text-indigo-900 text-lg flex items-center gap-2">
          <span className="bg-indigo-100 p-1 rounded">🏛️</span> Recommended Schemes
        </h3>
        <div className="grid gap-3">
          {Array.isArray(data) && data.map((scheme: any, idx: number) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-800">{scheme.name || "Scheme Name"}</h4>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <p className="text-sm text-slate-600 mt-2">{scheme.benefit || "Benefits description..."}</p>
              <div className="mt-3 flex gap-2">
                <button className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-medium">Check Eligibility</button>
                <button className="text-xs border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-1">
                  <Download size={12} /> Forms
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === ServiceType.DESIGN) {
    let aspectClass = "aspect-square";
    let title = "Generated Design";
    let isBrandKit = false;
    
    if (data.subtype === 'poster') {
      aspectClass = "aspect-[2/3]";
      title = "Generated Poster";
    } else if (data.subtype === 'card') {
      aspectClass = "aspect-[1.7/1]";
      title = "Visiting Card Preview";
    } else if (data.subtype === 'social') {
      aspectClass = "aspect-square";
      title = "Social Media Post";
    } else if (data.subtype === 'brand_kit') {
      title = "Complete Brand Kit";
      isBrandKit = true;
    } else if (data.subtype === 'logo') {
      title = "Logo Concept";
    }

    if (isBrandKit) {
        return (
            <div className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="font-bold text-teal-900 mb-3 flex items-center gap-2">
                    <span className="bg-teal-100 p-1 rounded">🎨</span> {title}
                </h3>
                
                {/* Logo Section */}
                <div className="w-full bg-white rounded-lg shadow-sm p-8 flex justify-center items-center mb-4">
                     <img 
                        src={data.imageUrl || "https://picsum.photos/400/400"} 
                        alt="Logo" 
                        className="w-40 h-40 object-contain"
                    />
                </div>

                {/* Color Palette */}
                <div className="mb-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1"><Palette size={12}/> Color Palette</h4>
                    <div className="flex gap-2">
                        {data.palette && data.palette.map((color: string, i: number) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <div className="w-12 h-12 rounded-lg shadow-sm border border-slate-100" style={{ backgroundColor: color }}></div>
                                <span className="text-[10px] font-mono text-slate-500">{color}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Typography */}
                <div className="mb-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1"><Type size={12}/> Typography</h4>
                    <div className="bg-white rounded-lg border border-slate-200 p-3 space-y-2">
                        {data.fonts && data.fonts.map((font: string, i: number) => (
                            <div key={i} className="flex items-baseline gap-2">
                                <span className="text-sm font-bold text-slate-800">{font}</span>
                                <span className="text-xs text-slate-400">Primary / Secondary Font</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                <p className="text-center text-xs text-slate-500 mt-2">{data.description}</p>
                <button className="w-full mt-3 bg-teal-600 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                    <Download size={16}/> Download Brand Kit
                </button>
            </div>
        )
    }

    return (
      <div className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200">
        <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
           <span className="bg-pink-100 p-1 rounded">🎨</span> {title}
        </h3>
        <div className={`${aspectClass} w-full max-w-sm mx-auto bg-white rounded-lg shadow-sm overflow-hidden relative group transition-all`}>
          <img 
            src={data.imageUrl || "https://picsum.photos/400/400"} 
            alt="Generated Design" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-4 translate-y-full group-hover:translate-y-0 transition-transform">
            <div className="flex gap-2 justify-center">
                <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                    <Download size={16}/> Save
                </button>
                <button className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                    <Share2 size={16}/> Share
                </button>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-slate-500 mt-2">{data.description}</p>
      </div>
    );
  }

  if (type === ServiceType.WEBSITE) {
    const isModern = data.template === 'modern';
    const bgColor = isModern ? 'bg-slate-900' : 'bg-emerald-900';
    const btnColor = isModern ? 'bg-indigo-600' : 'bg-amber-600';

    return (
      <div className="w-full space-y-3">
        <h3 className="font-bold text-indigo-900 text-lg flex items-center gap-2">
           <span className="bg-blue-100 p-1 rounded">🌐</span> Website Preview
        </h3>
        
        {/* Browser Frame */}
        <div className="w-full bg-white rounded-xl overflow-hidden border border-slate-300 shadow-lg flex flex-col">
           {/* Browser Header */}
           <div className="bg-slate-100 px-3 py-2 flex items-center gap-2 border-b border-slate-200">
              <div className="flex gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              </div>
              <div className="ml-2 text-[10px] text-slate-500 bg-white border border-slate-200 px-3 py-0.5 rounded-md flex-1 truncate font-mono">
                 {data.businessName ? `www.${data.businessName.toLowerCase().replace(/\s/g,'')}.com` : 'www.mysite.com'}
              </div>
           </div>

           {/* Website Content */}
           <div className="flex-1 bg-white overflow-hidden flex flex-col">
              {/* Hero */}
              <div className={`relative h-40 ${bgColor} text-white flex flex-col justify-center items-center text-center p-4`}>
                 <img src={data.heroImage || "https://picsum.photos/800/400"} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                 <div className="relative z-10 space-y-2">
                    <h1 className="font-bold text-xl tracking-tight">{data.businessName || "My Business"}</h1>
                    <p className="text-xs opacity-90 max-w-[80%] mx-auto">{data.tagline || "Quality products for everyone."}</p>
                    <button className={`text-[10px] ${btnColor} px-3 py-1 rounded shadow-md mt-2 hover:brightness-110 transition`}>
                       Contact Us
                    </button>
                 </div>
              </div>

              {/* Services Section */}
              <div className="p-4 bg-slate-50">
                 <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">Our Services</h4>
                 <div className="grid grid-cols-2 gap-2">
                    {data.services?.slice(0, 4).map((s: any, i: number) => (
                       <div key={i} className="bg-white p-2 rounded border border-slate-100 shadow-sm text-center">
                          <div className="font-bold text-xs text-slate-800">{s.title}</div>
                          <div className="text-[9px] text-slate-500 mt-0.5 line-clamp-2">{s.desc}</div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Footer / Contact */}
              <div className="bg-slate-800 text-slate-300 p-3 text-[10px] flex justify-between items-center">
                 <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1"><Phone size={8}/> {data.contact?.phone}</span>
                    <span className="flex items-center gap-1"><Mail size={8}/> {data.contact?.email}</span>
                 </div>
                 <div className="flex items-center gap-1 text-slate-500">
                    <MapPin size={8} /> {data.contact?.address || "Rural India"}
                 </div>
              </div>
           </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
           <button className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition shadow-sm">
             <Globe size={12} /> Publish Live
           </button>
           <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition shadow-sm">
             <Layout size={12} /> Customize
           </button>
        </div>
      </div>
    );
  }

  if (type === ServiceType.GROWTH) {
    const chartData = data.chartData || [
      { name: 'Mon', sales: 4000 },
      { name: 'Tue', sales: 3000 },
      { name: 'Wed', sales: 2000 },
      { name: 'Thu', sales: 2780 },
      { name: 'Fri', sales: 1890 },
      { name: 'Sat', sales: 2390 },
      { name: 'Sun', sales: 3490 },
    ];

    return (
      <div className="w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
           <span className="bg-blue-100 p-1 rounded">📈</span> Business Growth
        </h3>
        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize: 10}} axisLine={false} tickLine={false} hide />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="sales" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
             <div className="bg-indigo-50 p-2 rounded-lg text-center">
                 <div className="text-xs text-indigo-600">Weekly Revenue</div>
                 <div className="font-bold text-indigo-900">₹24,500</div>
             </div>
             <div className="bg-emerald-50 p-2 rounded-lg text-center">
                 <div className="text-xs text-emerald-600">Growth</div>
                 <div className="font-bold text-emerald-900">+12.5%</div>
             </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ServiceDisplay;
