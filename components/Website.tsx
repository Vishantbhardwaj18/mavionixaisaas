
import React, { useState, useEffect } from 'react';
import { 
  Globe, ArrowRight, Mic, Leaf, CheckCircle, 
  BarChart3, ShieldCheck, Users, Play, HelpCircle, 
  ChevronDown, ChevronUp, Layout, Smartphone, Sprout, 
  Briefcase, Landmark, LogIn, Menu, X, Mail, Phone, MapPin, 
  Clock, Calendar, Rocket, Target, FileText, TrendingUp,
  Zap, MessageSquare, Award, Star, Cpu, WifiOff, Sun,
  Database, Lock, Fingerprint, Activity, Server, Calculator,
  Cloud, BookOpen, Monitor, Battery, Wallet, Settings,
  RefreshCw, Truck, HeartHandshake, Smile, Code, Layers, FileCode, Palette, MonitorSmartphone
} from 'lucide-react';
import { APP_NAME, UI_TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface Props {
  onStart: (lang: Language) => void;
}

type Page = 'home' | 'technology' | 'services' | 'sustainability' | 'about' | 'faq';

const Website: React.FC<Props> = ({ onStart }) => {
  const [activePage, setActivePage] = useState<Page>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>(Language.ENGLISH);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const fullT = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS[Language.ENGLISH];
  const t = fullT.website;
  const navT = fullT.nav;

  // Full Language List matches AuthPanel
  const LANGUAGE_OPTIONS = [
    { label: 'English', val: Language.ENGLISH },
    { label: 'Hindi (हिंदी)', val: Language.HINDI },
    { label: 'Tamil (தமிழ்)', val: Language.TAMIL },
    { label: 'Bengali (বাংলা)', val: Language.BENGALI },
    { label: 'Telugu (తెలుగు)', val: Language.TELUGU },
    { label: 'Marathi (मराठी)', val: Language.MARATHI },
    { label: 'Gujarati (ગુજરાતી)', val: Language.GUJARATI },
    { label: 'Punjabi (ਪੰਜਾਬੀ)', val: Language.PUNJABI },
    { label: 'Kannada (ಕನ್ನಡ)', val: Language.KANNADA },
    { label: 'Malayalam (മലയാളം)', val: Language.MALAYALAM },
    { label: 'Odia (ଓଡ଼ିଆ)', val: Language.ODIA },
    { label: 'Assamese (অসমীয়া)', val: Language.ASSAMESE },
    { label: 'Urdu (اردو)', val: Language.URDU },
    { label: 'Nepali (नेपाली)', val: Language.NEPALI },
    { label: 'Sanskrit (संस्कृतम्)', val: Language.SANSKRIT },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const navigate = (page: Page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLanguageChange = (lang: Language) => {
      setCurrentLang(lang);
      setLangMenuOpen(false);
  };

  const getCurrentLangLabel = () => {
      const found = LANGUAGE_OPTIONS.find(l => l.val === currentLang);
      return found ? (found.label.split(' ')[0]) : 'EN';
  };

  // --- RENDER HELPERS ---

  const renderHome = () => (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-100/50 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-emerald-100/50 rounded-full blur-3xl -z-10"></div>

        {/* Anveshana Badge */}
        <div className="flex flex-col items-center gap-2 mb-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-50 to-white border border-orange-200 rounded-full px-4 py-1.5 shadow-sm">
                <span className="text-xs font-bold text-orange-700 uppercase tracking-wide">
                    {t.badge1}
                </span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 shadow-sm">
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                    {t.badge2}
                </span>
            </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
          {t.heroTitle}
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto mb-10 leading-relaxed">
          {t.heroSubtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button 
            onClick={() => onStart(currentLang)}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            {t.accessBtn} <Rocket size={20} className="text-yellow-400" />
          </button>
          <button 
            onClick={() => navigate('technology')}
            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            {t.hardwareBtn} <Cpu size={20} />
          </button>
        </div>

        {/* Research Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 border-t border-slate-200 pt-12">
          {[
            { val: "₹40k", label: t.metric1, color: "text-slate-900", icon: <Wallet size={16}/> },
            { val: "Solar", label: t.metric2, color: "text-amber-500", icon: <Sun size={16}/> },
            { val: "100%", label: t.metric3, color: "text-indigo-600", icon: <Mic size={16}/> },
            { val: "Offline", label: t.metric4, color: "text-emerald-600", icon: <WifiOff size={16}/> }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center group cursor-default">
              <div className={`text-3xl font-bold ${stat.color} flex items-center justify-center gap-2 mb-1 group-hover:scale-110 transition-transform`}>
                  {stat.val}
              </div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  {stat.icon} {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works (Workflow) */}
      <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">{t.howTitle}</h2>
                  <p className="text-slate-500 max-w-2xl mx-auto">{t.howDesc}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 hidden md:block"></div>
                  
                  {[
                      { step: "01", title: t.step1, desc: t.step1Desc, icon: <Mic size={32}/> },
                      { step: "02", title: t.step2, desc: t.step2Desc, icon: <Cpu size={32}/> },
                      { step: "03", title: t.step3, desc: t.step3Desc, icon: <CheckCircle size={32}/> }
                  ].map((s, i) => (
                      <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center relative group hover:-translate-y-2 transition-transform">
                          <div className="w-16 h-16 bg-indigo-600 rounded-2xl text-white flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200 text-xl font-bold">
                              {s.step}
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h3>
                          <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                  <div className="flex-1 space-y-6">
                      <h2 className="text-3xl font-bold text-slate-900">{t.probTitle}</h2>
                      <p className="text-slate-500 text-lg leading-relaxed">
                          {t.probDesc}
                      </p>
                      <ul className="space-y-4">
                          <li className="flex items-start gap-3">
                              <div className="bg-red-100 p-2 rounded-lg text-red-600"><WifiOff size={20}/></div>
                              <div>
                                  <h4 className="font-bold text-slate-800">{t.prob1Title}</h4>
                                  <p className="text-sm text-slate-500">{t.prob1Desc}</p>
                              </div>
                          </li>
                          <li className="flex items-start gap-3">
                              <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><Zap size={20}/></div>
                              <div>
                                  <h4 className="font-bold text-slate-800">{t.prob2Title}</h4>
                                  <p className="text-sm text-slate-500">{t.prob2Desc}</p>
                              </div>
                          </li>
                          <li className="flex items-start gap-3">
                              <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Fingerprint size={20}/></div>
                              <div>
                                  <h4 className="font-bold text-slate-800">{t.prob3Title}</h4>
                                  <p className="text-sm text-slate-500">{t.prob3Desc}</p>
                              </div>
                          </li>
                      </ul>
                  </div>
                  <div className="flex-1">
                      <div className="bg-slate-100 rounded-3xl p-8 border border-slate-200 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
                          <div className="space-y-6 relative z-10">
                              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                                  <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white"><Cpu size={24}/></div>
                                  <div>
                                      <div className="text-xs font-bold text-slate-400 uppercase">Architecture</div>
                                      <div className="font-bold text-slate-800">Hybrid Edge-Cloud</div>
                                  </div>
                              </div>
                              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white"><Leaf size={24}/></div>
                                  <div>
                                      <div className="text-xs font-bold text-slate-400 uppercase">Sustainability</div>
                                      <div className="font-bold text-slate-800">Carbon Aware Compute</div>
                                  </div>
                              </div>
                              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white"><Mic size={24}/></div>
                                  <div>
                                      <div className="text-xs font-bold text-slate-400 uppercase">Interface</div>
                                      <div className="font-bold text-slate-800">Multilingual Voice AI</div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>
    </div>
  );

  const renderTechnology = () => (
      <div className="animate-fade-in pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                      <Cpu size={14} /> System Architecture
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">{t.stackTitle}</h1>
                  <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                      {t.stackDesc}
                  </p>
              </div>

              {/* Technological Stack Visual */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-4"><Layout size={24}/></div>
                      <h4 className="font-bold text-slate-800 mb-2">Frontend</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                          <li>HTML5 & CSS3</li>
                          <li>JavaScript (React)</li>
                          <li>Tailwind CSS</li>
                      </ul>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4"><Server size={24}/></div>
                      <h4 className="font-bold text-slate-800 mb-2">Backend</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                          <li>Python</li>
                          <li>Node.js</li>
                          <li>REST APIs</li>
                      </ul>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4"><Database size={24}/></div>
                      <h4 className="font-bold text-slate-800 mb-2">Databases</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                          <li>MySQL</li>
                          <li>PostgreSQL</li>
                          <li>Local Storage (Edge)</li>
                      </ul>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4"><Cpu size={24}/></div>
                      <h4 className="font-bold text-slate-800 mb-2">AI Models</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                          <li>PyTorch</li>
                          <li>Scikit-learn</li>
                          <li>Gemini API</li>
                      </ul>
                  </div>
              </div>

              {/* Hardware Unit Cost Breakdown */}
              <div className="mb-20">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">{t.compHardware}</h2>
                  <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden max-w-4xl mx-auto">
                      <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm text-slate-600">
                              <thead className="bg-slate-900 text-white font-bold uppercase text-xs">
                                  <tr>
                                      <th className="px-6 py-4">{t.compItem}</th>
                                      <th className="px-6 py-4">{t.compPurpose}</th>
                                      <th className="px-6 py-4 text-right">{t.compCost}</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                  {[
                                      { item: "Solar Panel & Battery", purpose: "Power supply for rural areas", cost: "12,000" },
                                      { item: "Processor Unit", purpose: "Runs software and services", cost: "8,000" },
                                      { item: "Display & Audio System", purpose: "User interaction and guidance", cost: "6,000" },
                                      { item: "Internet Module (Wi-Fi / GSM)", purpose: "Connectivity support", cost: "4,000" },
                                      { item: "Input Devices (Biometric / Buttons)", purpose: "User access and control", cost: "3,000" },
                                      { item: "Hardware Enclosure / Booth", purpose: "Physical protection", cost: "4,000" },
                                      { item: "Installation & Miscellaneous", purpose: "Setup and wiring", cost: "3,000" },
                                  ].map((row, idx) => (
                                      <tr key={idx} className="hover:bg-slate-50/50">
                                          <td className="px-6 py-3 font-medium text-slate-800">{row.item}</td>
                                          <td className="px-6 py-3">{row.purpose}</td>
                                          <td className="px-6 py-3 text-right font-mono font-bold text-slate-700">₹{row.cost}</td>
                                      </tr>
                                  ))}
                                  <tr className="bg-indigo-50">
                                      <td className="px-6 py-4 font-bold text-indigo-900 uppercase">Total Unit Cost</td>
                                      <td className="px-6 py-4"></td>
                                      <td className="px-6 py-4 text-right font-bold text-indigo-900 text-lg">₹40,000</td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>

              {/* Architecture Diagram Representation */}
              <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden mb-20">
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                      
                      {/* Edge Layer */}
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
                          <div className="flex items-center gap-3 mb-4 text-emerald-400">
                              <Cpu size={32} />
                              <h3 className="text-xl font-bold">Edge Layer</h3>
                          </div>
                          <ul className="space-y-3 text-sm text-slate-300">
                              <li className="flex gap-2"><CheckCircle size={16} className="text-emerald-500 shrink-0"/> Local Speech Processing (ASR)</li>
                              <li className="flex gap-2"><CheckCircle size={16} className="text-emerald-500 shrink-0"/> Offline Transaction Caching</li>
                              <li className="flex gap-2"><CheckCircle size={16} className="text-emerald-500 shrink-0"/> Low-Power Processor Unit</li>
                              <li className="flex gap-2"><CheckCircle size={16} className="text-emerald-500 shrink-0"/> Solar Battery Management</li>
                          </ul>
                      </div>

                      {/* Sync Layer */}
                      <div className="flex flex-col items-center justify-center py-4 md:py-0">
                          <div className="w-full h-1 md:h-full md:w-1 bg-gradient-to-b from-transparent via-indigo-500 to-transparent relative opacity-50"></div>
                          <div className="bg-indigo-600 p-3 rounded-full absolute shadow-lg shadow-indigo-500/50">
                              <Activity size={24} className="animate-pulse" />
                          </div>
                          <div className="mt-16 text-center">
                              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Intelligent Sync</p>
                              <p className="text-[10px] text-slate-400 mt-1">Opportunistic Data Transfer</p>
                          </div>
                      </div>

                      {/* Cloud Layer */}
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
                          <div className="flex items-center gap-3 mb-4 text-blue-400">
                              <Cloud size={32} />
                              <h3 className="text-xl font-bold">Cloud Layer</h3>
                          </div>
                          <ul className="space-y-3 text-sm text-slate-300">
                              <li className="flex gap-2"><CheckCircle size={16} className="text-blue-500 shrink-0"/> Heavy Model Inference</li>
                              <li className="flex gap-2"><CheckCircle size={16} className="text-blue-500 shrink-0"/> Global Govt. Scheme DB</li>
                              <li className="flex gap-2"><CheckCircle size={16} className="text-blue-500 shrink-0"/> Cross-Region Analytics</li>
                              <li className="flex gap-2"><CheckCircle size={16} className="text-blue-500 shrink-0"/> Backup & Compliance</li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderSustainability = () => (
      <div className="animate-fade-in pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row gap-12 items-start">
                  <div className="flex-1">
                      <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                          <Leaf size={14} /> {t.greenTitle}
                      </div>
                      <h1 className="text-4xl font-bold text-slate-900 mb-6">{t.greenTitle}</h1>
                      <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                          {t.greenDesc}
                      </p>
                      
                      <div className="bg-slate-900 text-emerald-400 font-mono p-6 rounded-2xl shadow-lg mb-8 relative overflow-hidden">
                          <div className="relative z-10">
                              <p className="text-xs text-slate-500 mb-2">// Carbon Estimation Formula</p>
                              <p className="text-lg md:text-xl mb-4">E = P<sub>avg</sub> × t</p>
                              <p className="text-lg md:text-xl">C = E × α</p>
                              <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-1">
                                  <p><span className="text-white">E</span> : Energy Consumption (kWh)</p>
                                  <p><span className="text-white">P<sub>avg</sub></span> : Average System Power</p>
                                  <p><span className="text-white">t</span> : Task Duration</p>
                                  <p><span className="text-white">α</span> : Regional Emission Factor</p>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="flex-1 space-y-6">
                      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                              <TrendingUp size={20} className="text-indigo-600"/> Comparative Analysis
                          </h3>
                          
                          <div className="space-y-6">
                              <div>
                                  <div className="flex justify-between text-sm mb-2">
                                      <span className="font-bold text-slate-700">Service Availability (Outages)</span>
                                      <span className="text-indigo-600 font-bold">75-80%</span>
                                  </div>
                                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                      <div className="h-full bg-indigo-600 w-[80%]"></div>
                                  </div>
                                  <p className="text-xs text-slate-400 mt-1">Vs. 0% for Cloud-Only Apps</p>
                              </div>

                              <div>
                                  <div className="flex justify-between text-sm mb-2">
                                      <span className="font-bold text-slate-700">Energy Reduction</span>
                                      <span className="text-emerald-600 font-bold">30-35%</span>
                                  </div>
                                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                      <div className="h-full bg-emerald-500 w-[35%]"></div>
                                  </div>
                                  <p className="text-xs text-slate-400 mt-1">Due to localized edge processing</p>
                              </div>

                              <div>
                                  <div className="flex justify-between text-sm mb-2">
                                      <span className="font-bold text-slate-700">Task Completion Speed</span>
                                      <span className="text-purple-600 font-bold">~30% Faster</span>
                                  </div>
                                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                      <div className="h-full bg-purple-500 w-[30%]"></div>
                                  </div>
                                  <p className="text-xs text-slate-400 mt-1">For low-literacy users via Voice AI</p>
                              </div>
                          </div>
                      </div>

                      <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl">
                          <h4 className="font-bold text-emerald-800 mb-2">{t.ecoBadge}</h4>
                          <p className="text-sm text-emerald-700 mb-4">
                              {t.ecoDesc}
                          </p>
                          <div className="flex gap-2">
                              <Award className="text-emerald-600" size={24} />
                              <Award className="text-teal-600" size={24} />
                              <Award className="text-green-600" size={24} />
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderServices = () => (
    <div className="animate-fade-in pt-32 pb-20">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
             <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">{t.servTitle}</h1>
             <p className="text-lg text-slate-500 max-w-2xl mx-auto">
               {t.servDesc}
             </p>
          </div>

          {/* Core Business Tools */}
          <div className="mb-16">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-200 pb-2">
                  <Briefcase className="text-indigo-500"/> Core Business Tools
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                      { icon: <FileText size={28}/>, title: t.serv1, desc: "Professional websites at low cost.", color: "text-blue-600", bg: "bg-blue-50" },
                      { icon: <MessageSquare size={28}/>, title: t.serv2, desc: "Instant answers for customer queries.", color: "text-emerald-600", bg: "bg-emerald-50" },
                      { icon: <Palette size={28}/>, title: t.serv3, desc: "Logos, visiting cards, and posters.", color: "text-amber-600", bg: "bg-amber-50" },
                      { icon: <FileCode size={28}/>, title: t.serv4, desc: "Blogs and content in local languages.", color: "text-purple-600", bg: "bg-purple-50" },
                  ].map((s, i) => (
                      <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all group">
                          <div className={`w-14 h-14 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>{s.icon}</div>
                          <h4 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h4>
                          <p className="text-sm text-slate-500">{s.desc}</p>
                      </div>
                  ))}
              </div>
          </div>

          {/* Tailored Solutions (Personas) */}
          <div className="mb-20">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-200 pb-2">
                  <HeartHandshake className="text-pink-500"/> Tailored For Your Business
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border border-green-200">
                      <div className="flex items-center gap-3 mb-4">
                          <div className="bg-green-600 text-white p-2 rounded-lg"><Sprout size={20}/></div>
                          <h4 className="font-bold text-green-900">For Farmers</h4>
                      </div>
                      <ul className="space-y-2 text-sm text-green-800">
                          <li className="flex gap-2"><CheckCircle size={16}/> Market (Mandi) Rates</li>
                          <li className="flex gap-2"><CheckCircle size={16}/> Govt. Scheme Finder</li>
                          <li className="flex gap-2"><CheckCircle size={16}/> Weather Alerts (Coming Soon)</li>
                      </ul>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl border border-blue-200">
                      <div className="flex items-center gap-3 mb-4">
                          <div className="bg-blue-600 text-white p-2 rounded-lg"><Briefcase size={20}/></div>
                          <h4 className="font-bold text-blue-900">For Retailers</h4>
                      </div>
                      <ul className="space-y-2 text-sm text-blue-800">
                          <li className="flex gap-2"><CheckCircle size={16}/> Instant Invoicing</li>
                          <li className="flex gap-2"><CheckCircle size={16}/> Digital Khata (Ledger)</li>
                          <li className="flex gap-2"><CheckCircle size={16}/> Stock Management</li>
                      </ul>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-2xl border border-purple-200">
                      <div className="flex items-center gap-3 mb-4">
                          <div className="bg-purple-600 text-white p-2 rounded-lg"><Smile size={20}/></div>
                          <h4 className="font-bold text-purple-900">For SHGs / Artisans</h4>
                      </div>
                      <ul className="space-y-2 text-sm text-purple-800">
                          <li className="flex gap-2"><CheckCircle size={16}/> Website Builder</li>
                          <li className="flex gap-2"><CheckCircle size={16}/> Social Media Posters</li>
                          <li className="flex gap-2"><CheckCircle size={16}/> Product Catalogues</li>
                      </ul>
                  </div>
              </div>
          </div>

          <div className="mt-20 bg-slate-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-50"></div>
              <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-4">{t.readyTitle || "Ready to modernize your business?"}</h2>
                  <p className="text-slate-300 mb-8 max-w-2xl mx-auto">{t.readyDesc || "Join the waitlist today and get 6 months of Pro features for free when we launch."}</p>
                  <button 
                      onClick={() => onStart(currentLang)}
                      className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all shadow-lg"
                  >
                      {t.getAccess || "Get Early Access"}
                  </button>
              </div>
          </div>
       </div>
    </div>
  );

  const renderAbout = () => (
    <div className="animate-fade-in pt-32 pb-20">
       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-8 text-indigo-600 shadow-sm transform rotate-3">
               <Globe size={40} />
           </div>
           <h1 className="text-4xl font-bold text-slate-900 mb-6">{t.missionTitle}</h1>
           <p className="text-2xl text-slate-500 leading-relaxed font-light mb-12">
               "{t.missionDesc}"
           </p>

           {/* Abstract Section */}
           <div className="mb-20 text-left bg-indigo-50 border border-indigo-100 p-8 rounded-3xl">
               <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                   <BookOpen size={20} /> Abstract
               </h3>
               <p className="text-slate-700 leading-relaxed text-sm md:text-base">
                   Digital services are often presented as simple solutions for business growth, yet for many rural and village-based enterprises, these services remain difficult to access, manage, and sustain. The challenge is not the absence of technology, but the lack of systems designed for environments where electricity is unreliable, internet connectivity is limited, and technical support is rarely available. 
                   <br/><br/>
                   This project presents <strong>MaVionix GramaNet</strong>, a rural-first digital service system designed to operate under real village conditions. The system brings essential digital services into a single, continuous framework that prioritizes simplicity, reliability, and long-term usability. Instead of offering isolated solutions, the platform supports rural enterprises through guided digital access, coordinated service management, and consistent system availability.
               </p>
           </div>

           {/* Comparative Study Table */}
           <div className="mb-20 text-left">
               <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 justify-center">
                   <TrendingUp size={20} className="text-emerald-600"/> Comparative Analysis
               </h3>
               <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200">
                   <table className="w-full text-sm text-slate-600">
                       <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-xs">
                           <tr>
                               <th className="px-6 py-4 text-left">Parameter</th>
                               <th className="px-6 py-4 text-left text-indigo-700 bg-indigo-50">MaVionix</th>
                               <th className="px-6 py-4 text-left">Freelance Platforms</th>
                               <th className="px-6 py-4 text-left">Free Digital Tools</th>
                               <th className="px-6 py-4 text-left">Digital Agencies</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                           <tr className="hover:bg-slate-50">
                               <td className="px-6 py-4 font-bold">Target Users</td>
                               <td className="px-6 py-4 bg-indigo-50/50 font-bold text-indigo-700">Rural & Village SMEs</td>
                               <td className="px-6 py-4">General Users</td>
                               <td className="px-6 py-4">General Users</td>
                               <td className="px-6 py-4">Urban Businesses</td>
                           </tr>
                           <tr className="hover:bg-slate-50">
                               <td className="px-6 py-4 font-bold">Power Req</td>
                               <td className="px-6 py-4 bg-indigo-50/50 text-green-600 font-bold">Low (Solar)</td>
                               <td className="px-6 py-4">High</td>
                               <td className="px-6 py-4">High</td>
                               <td className="px-6 py-4">High</td>
                           </tr>
                           <tr className="hover:bg-slate-50">
                               <td className="px-6 py-4 font-bold">Internet Dep</td>
                               <td className="px-6 py-4 bg-indigo-50/50 text-green-600 font-bold">Low-Moderate</td>
                               <td className="px-6 py-4">High</td>
                               <td className="px-6 py-4">High</td>
                               <td className="px-6 py-4">High</td>
                           </tr>
                           <tr className="hover:bg-slate-50">
                               <td className="px-6 py-4 font-bold">Service Continuity</td>
                               <td className="px-6 py-4 bg-indigo-50/50 font-bold">Continuous System</td>
                               <td className="px-6 py-4">Task-based</td>
                               <td className="px-6 py-4">Limited</td>
                               <td className="px-6 py-4">Contract-based</td>
                           </tr>
                           <tr className="hover:bg-slate-50">
                               <td className="px-6 py-4 font-bold">Ease of Use</td>
                               <td className="px-6 py-4 bg-indigo-50/50 font-bold">Very High</td>
                               <td className="px-6 py-4">Moderate</td>
                               <td className="px-6 py-4">Moderate</td>
                               <td className="px-6 py-4">Easy</td>
                           </tr>
                           <tr className="hover:bg-slate-50">
                               <td className="px-6 py-4 font-bold">Cost</td>
                               <td className="px-6 py-4 bg-indigo-50/50 font-bold text-green-600">Affordable</td>
                               <td className="px-6 py-4">Varies</td>
                               <td className="px-6 py-4">Free (Limited)</td>
                               <td className="px-6 py-4">High</td>
                           </tr>
                       </tbody>
                   </table>
               </div>
           </div>

           {/* Team Section */}
           <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-20 text-left shadow-sm">
               <div className="flex items-center gap-2 mb-6">
                   <div className="bg-indigo-600 w-1 h-6 rounded-full"></div>
                   <h3 className="text-lg font-bold text-slate-800">Team MaVionix</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div>
                       <h4 className="font-bold text-indigo-900 mb-3 text-sm uppercase tracking-wide">College Team (SRM University, Ghaziabad)</h4>
                       <ul className="space-y-3">
                           <li className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">VB</div>
                               <div>
                                   <p className="font-bold text-slate-800">Vishant Bhardwaj</p>
                                   <p className="text-xs text-slate-500">College Student</p>
                               </div>
                           </li>
                           <li className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">MT</div>
                               <div>
                                   <p className="font-bold text-slate-800">Maanya Tyagi</p>
                                   <p className="text-xs text-slate-500">College Student</p>
                               </div>
                           </li>
                           <li className="flex items-center gap-3 border-t border-slate-100 pt-2 mt-2">
                               <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">RG</div>
                               <div>
                                   <p className="font-bold text-slate-800">Dr. Rolly Gupta</p>
                                   <p className="text-xs text-slate-500">Project Guide</p>
                               </div>
                           </li>
                       </ul>
                   </div>
                   
                   <div>
                       <h4 className="font-bold text-emerald-900 mb-3 text-sm uppercase tracking-wide">Head of Department (Computer Science & Engineering)</h4>
                       <ul className="space-y-3">
<li className="flex items-center gap-3 border-t border-slate-100 pt-2 mt-2">
                               <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">RG</div>
                               <div>
                                   <p className="font-bold text-slate-800">Dr. Neelam Singh</p>
                                   <p className="text-xs text-slate-500">HOD(CSE)</p>
                               </div>
                           </li>
                       </ul>
                   </div>
               </div>
           </div>

           {/* Business & Cost Breakdown */}
           <div className="text-left mb-20">
               <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Project Financials</h2>
               <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
                   <div className="overflow-x-auto">
                       <table className="w-full text-left text-sm text-slate-600">
                           <thead className="bg-slate-50 text-slate-800 font-bold uppercase text-xs">
                               <tr>
                                   <th className="px-6 py-4">Category</th>
                                   <th className="px-6 py-4 text-right">Amount (₹)</th>
                                   <th className="px-6 py-4 text-right">%</th>
                               </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                               {[
                                   { cat: "Project Coordinator (Part-time)", cost: "6,000", pct: "15%" },
                                   { cat: "UI / UX Designer (Freelance)", cost: "4,000", pct: "10%" },
                                   { cat: "Content & Documentation", cost: "2,000", pct: "5%" },
                                   { cat: "Tools & Software Licenses", cost: "4,800", pct: "12%" },
                                   { cat: "Branding & Website Setup", cost: "3,000", pct: "7.5%" },
                                   { cat: "Marketing & Promotion", cost: "6,000", pct: "15%" },
                                   { cat: "Operations & Hosting", cost: "2,000", pct: "5%" },
                                   { cat: "Legal & Admin", cost: "1,200", pct: "3%" },
                                   { cat: "Project Development (Core Build)", cost: "2,000", pct: "5%" },
                                   { cat: "Contingency / Risk Buffer", cost: "9,000", pct: "22.5%" },
                               ].map((row, idx) => (
                                   <tr key={idx} className="hover:bg-slate-50/50">
                                       <td className="px-6 py-3 font-medium">{row.cat}</td>
                                       <td className="px-6 py-3 text-right font-mono">{row.cost}</td>
                                       <td className="px-6 py-3 text-right text-slate-400">{row.pct}</td>
                                   </tr>
                               ))}
                               <tr className="bg-slate-900 text-white">
                                   <td className="px-6 py-4 font-bold uppercase">Total Project Cost</td>
                                   <td className="px-6 py-4 text-right font-bold text-lg">₹40,000</td>
                                   <td className="px-6 py-4 text-right">100%</td>
                               </tr>
                           </tbody>
                       </table>
                   </div>
               </div>
           </div>

           {/* Growth Plan Roadmap */}
           <div className="text-left mb-20">
               <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Growth Plan</h2>
               <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200">
                   {[
                       { phase: "Phase 1", title: "Acquire NCR SMEs", desc: "Focus on validation and pilot programs in the National Capital Region.", active: true },
                       { phase: "Phase 2", title: "Pan-India Expansion", desc: "Scaling operations via channel partners and digital marketing across states.", active: false },
                       { phase: "Phase 3", title: "Global Expansion", desc: "Targeting Africa, Middle East, and SE Asia with localized solutions.", active: false },
                   ].map((event, i) => (
                       <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                           <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${event.active ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                               {event.active ? <CheckCircle size={16}/> : <Clock size={16}/>}
                           </div>
                           <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                               <div className="flex items-center justify-between space-x-2 mb-1">
                                   <div className="font-bold text-slate-900">{event.title}</div>
                                   <time className="font-mono text-xs text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">{event.phase}</time>
                               </div>
                               <div className="text-slate-500 text-sm">{event.desc}</div>
                           </div>
                       </div>
                   ))}
               </div>
           </div>
       </div>
    </div>
  );

  const renderFAQ = () => (
    <div className="animate-fade-in pt-32 pb-20">
       <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
               <h1 className="text-4xl font-bold text-slate-900 mb-4">{t.faqTitle}</h1>
               <p className="text-slate-500">Everything you need to know about MaVionix.</p>
           </div>

           <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 mb-12">
               <div className="space-y-4">
                   {[
                       { q: "How does the offline mode work?", a: "MaVionix uses a local 'Edge' processing layer. When internet is lost, essential tasks like invoicing and data entry are processed on your device and synced to the cloud once connectivity is restored." },
                       { q: "Will it work on my solar-powered setup?", a: "Yes. The platform is optimized to run on low-power hardware (18-22 Watts), making it fully compatible with standard solar home systems used in rural areas." },
                       { q: "Is my biometric data safe?", a: "Absolutely. We use local authentication processing where possible. Your biometric data is encrypted and never shared with third parties, following strict security protocols." },
                       { q: "Can I use it if I don't know English?", a: "Yes! MaVionix is 'Voice-First' and supports Hindi, Tamil, Bengali, and English. You can speak to the app to get things done." },
                       { q: "How is carbon footprint calculated?", a: "We use an algorithmic model (E = Pavg × t) that tracks the energy used by the app and compares it against the carbon emissions of doing the same task physically (e.g., travel, paper usage)." },
                       { q: "Is this a government app?", a: "No, MaVionix is a private SaaS platform, but we integrate public government scheme data to help you access benefits easily." }
                   ].map((item, i) => (
                       <div key={i} className="border-b border-slate-100 last:border-0">
                           <button 
                             onClick={() => toggleFaq(i)}
                             className="w-full flex justify-between items-center py-5 text-left font-bold text-slate-800 hover:text-indigo-600 transition"
                           >
                               {item.q}
                               {activeFaq === i ? <ChevronUp size={20} className="text-indigo-600"/> : <ChevronDown size={20} className="text-slate-400"/>}
                           </button>
                           {activeFaq === i && (
                               <div className="pb-5 text-slate-600 text-sm leading-relaxed animate-fade-in pl-2 border-l-2 border-indigo-100 ml-1">
                                   {item.a}
                               </div>
                           )}
                       </div>
                   ))}
               </div>
           </div>

           <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 text-center">
               <h3 className="text-xl font-bold text-slate-900 mb-2">Still have questions?</h3>
               <p className="text-slate-500 mb-6">We are here to help.</p>
               <div className="flex justify-center gap-4">
                   <button className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white hover:shadow-md transition">
                       <Mail size={18} /> Email Support
                   </button>
               </div>
           </div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('home')}>
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">M</div>
              <div>
                <h1 className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">{APP_NAME}</h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Rural AI OS</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              {[
                { id: 'home', label: navT.home },
                { id: 'technology', label: navT.tech },
                { id: 'services', label: navT.services },
                { id: 'sustainability', label: navT.impact },
                { id: 'about', label: navT.about },
                { id: 'faq', label: navT.faq }
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => navigate(item.id as Page)} 
                  className={`text-sm font-medium transition-all relative ${activePage === item.id ? 'text-indigo-600 font-bold' : 'text-slate-600 hover:text-indigo-600'}`}
                >
                  {item.label}
                  {activePage === item.id && (
                    <span className="absolute -bottom-6 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></span>
                  )}
                </button>
              ))}
              
              <div className="h-6 w-px bg-slate-200 ml-2"></div>

              {/* Language Selector */}
              <div className="relative">
                  <button 
                    onClick={() => setLangMenuOpen(!langMenuOpen)}
                    className="flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-indigo-600 transition px-2 py-1 rounded-lg hover:bg-slate-100 w-24 justify-between"
                  >
                      <span className="flex items-center gap-1"><Globe size={16} /> {getCurrentLangLabel()}</span>
                      <ChevronDown size={14} />
                  </button>
                  {langMenuOpen && (
                      <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in z-50 max-h-64 overflow-y-auto custom-scrollbar">
                          {LANGUAGE_OPTIONS.map((opt) => (
                              <button 
                                key={opt.val}
                                onClick={() => handleLanguageChange(opt.val)}
                                className={`w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-slate-50 flex items-center justify-between ${currentLang === opt.val ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600'}`}
                              >
                                  {opt.label}
                                  {currentLang === opt.val && <CheckCircle size={12} />}
                              </button>
                          ))}
                      </div>
                  )}
              </div>
              
              <button 
                onClick={() => onStart(currentLang)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all hover:scale-105 flex items-center gap-2 ml-2"
              >
                Join Beta <ArrowRight size={16} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600">
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 absolute w-full px-4 py-6 shadow-xl flex flex-col gap-4 animate-fade-in-up h-screen overflow-y-auto">
             <button onClick={() => navigate('home')} className={`text-left font-medium py-2 ${activePage === 'home' ? 'text-indigo-600' : 'text-slate-700'}`}>{navT.home}</button>
             <button onClick={() => navigate('technology')} className={`text-left font-medium py-2 ${activePage === 'technology' ? 'text-indigo-600' : 'text-slate-700'}`}>{navT.tech}</button>
             <button onClick={() => navigate('services')} className={`text-left font-medium py-2 ${activePage === 'services' ? 'text-indigo-600' : 'text-slate-700'}`}>{navT.services}</button>
             <button onClick={() => navigate('sustainability')} className={`text-left font-medium py-2 ${activePage === 'sustainability' ? 'text-indigo-600' : 'text-slate-700'}`}>{navT.impact}</button>
             <button onClick={() => navigate('about')} className={`text-left font-medium py-2 ${activePage === 'about' ? 'text-indigo-600' : 'text-slate-700'}`}>{navT.about}</button>
             <button onClick={() => navigate('faq')} className={`text-left font-medium py-2 ${activePage === 'faq' ? 'text-indigo-600' : 'text-slate-700'}`}>{navT.faq}</button>
             
             <div className="py-2 border-t border-b border-slate-100">
                 <p className="text-xs font-bold text-slate-400 uppercase mb-2">Language</p>
                 <div className="grid grid-cols-2 gap-2">
                    {LANGUAGE_OPTIONS.map((opt) => (
                        <button 
                            key={opt.val}
                            onClick={() => handleLanguageChange(opt.val)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold border ${currentLang === opt.val ? 'border-indigo-600 text-indigo-600 bg-indigo-50' : 'border-slate-200 text-slate-600'}`}
                        >
                            {opt.label}
                        </button>
                    ))}
                 </div>
             </div>

             <button onClick={() => onStart(currentLang)} className="w-full py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl">Login</button>
             <button onClick={() => onStart(currentLang)} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg">Join Waitlist</button>
          </div>
        )}
      </nav>

      {/* PAGE CONTENT ROUTER */}
      <main className="flex-1">
        {activePage === 'home' && renderHome()}
        {activePage === 'technology' && renderTechnology()}
        {activePage === 'services' && renderServices()}
        {activePage === 'sustainability' && renderSustainability()}
        {activePage === 'about' && renderAbout()}
        {activePage === 'faq' && renderFAQ()}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                  <div className="flex items-center gap-2 mb-4 text-white">
                      <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold">M</div>
                      <span className="font-bold text-lg">MaVionix</span>
                  </div>
                  <p className="text-sm mb-4">{t.footerText} <br/> A Research-Backed Initiative.</p>
                  <div className="flex gap-4">
                      {/* Social Icons Placeholder */}
                      <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition cursor-pointer">X</div>
                      <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition cursor-pointer">In</div>
                      <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition cursor-pointer">Fb</div>
                  </div>
              </div>
              
              <div>
                  <h4 className="text-white font-bold mb-4">Platform</h4>
                  <ul className="space-y-2 text-sm">
                      <li><button onClick={() => navigate('services')} className="hover:text-white transition text-left">Services</button></li>
                      <li><button onClick={() => navigate('technology')} className="hover:text-white transition text-left">Architecture</button></li>
                      <li><button onClick={() => navigate('sustainability')} className="hover:text-white transition text-left">Carbon Impact</button></li>
                  </ul>
              </div>

              <div>
                  <h4 className="text-white font-bold mb-4">Research</h4>
                  <ul className="space-y-2 text-sm">
                      <li><button onClick={() => navigate('about')} className="hover:text-white transition text-left">Mission</button></li>
                      <li><button onClick={() => navigate('about')} className="hover:text-white transition text-left">Methodology</button></li>
                      <li><button onClick={() => navigate('faq')} className="hover:text-white transition text-left">Support</button></li>
                  </ul>
              </div>

              <div>
                  <h4 className="text-white font-bold mb-4">Legal</h4>
                  <ul className="space-y-2 text-sm">
                      <li><button className="hover:text-white transition text-left">Privacy Policy</button></li>
                      <li><button className="hover:text-white transition text-left">Terms of Service</button></li>
                  </ul>
              </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs">
              &copy; {new Date().getFullYear()} MaVionix. {t.rights}
          </div>
      </footer>

    </div>
  );
};

export default Website;
