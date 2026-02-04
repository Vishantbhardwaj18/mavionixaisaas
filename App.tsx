
import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, Settings, Globe, RefreshCcw, Send, User, 
  LayoutGrid, Briefcase, PenTool, Sparkles, LogOut, Leaf, Landmark, BarChart3,
  VolumeX, AlertTriangle, X, Info, ChevronDown, ChevronUp, Zap, FileText, TrendingUp, Palette, Sprout, Image as ImageIcon,
  MessageSquare, Plus, Trash2, History, ArrowDown, Search, MoreVertical, Edit3, Clock, Sun, Moon
} from 'lucide-react';
import { Message, UserContext, Language, ServiceType, CarbonStats, UserProfile, ChatThread } from './types';
import { INITIAL_CONTEXT, CARBON_ESTIMATES, DAILY_CARBON_LIMIT, UI_TRANSLATIONS, INTERACTION_EMISSION } from './constants';
import { sendMessageToGemini } from './services/geminiService';
import { speakText, stopSpeaking, SpeechRecognizer } from './services/audioService';
import { createOrUpdateUser } from './services/authService';
import { logAction } from './services/carbonIntelligenceEngine';
import { CarbonProvider, useCarbon } from './components/CarbonContext';

// Components
import VoiceOrb from './components/VoiceOrb';
import ServiceDisplay from './components/ServiceDisplay';
import AuthPanel from './components/AuthPanel';
import ToolsDashboard from './components/ToolsDashboard';
import DesignStudio from './components/DesignStudio';
import SchemeFinder from './components/SchemeFinder';
import CarbonDashboard from './components/CarbonDashboard';
import MainDashboard from './components/MainDashboard';
import UserProfileView from './components/UserProfileView';
import AdminDashboard from './components/AdminDashboard';
import Website from './components/Website';

const SUGGESTIONS = [
    { text: "Create an invoice for Rahul", icon: <FileText size={18} className="text-blue-500"/>, label: "Invoice" },
    { text: "Check mandi prices for Wheat", icon: <TrendingUp size={18} className="text-green-500"/>, label: "Market" },
    { text: "Design a festival poster", icon: <Palette size={18} className="text-pink-500"/>, label: "Design" },
    { text: "Find farming schemes", icon: <Sprout size={18} className="text-emerald-500"/>, label: "Schemes" },
];

// Inner App Component to use the Context
const AppContent: React.FC = () => {
  // Auth State
  const [user, setUserLocal] = useState<UserProfile | null>(null);
  const [showLanding, setShowLanding] = useState(true);
  const [landingLanguage, setLandingLanguage] = useState<Language>(Language.ENGLISH);
  
  // App State
  const [currentView, setCurrentView] = useState<'dashboard' | 'chat' | 'tools' | 'design' | 'scheme' | 'carbon' | 'profile'>('chat');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  
  // Direct Tool Navigation State
  const [targetTool, setTargetTool] = useState<string | null>(null);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Chat Logic State
  const [activeThreadId, setActiveThreadId] = useState<string>(() => Date.now().toString());
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showScrollDown, setShowScrollDown] = useState(false);
  
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedCarbonMsgId, setExpandedCarbonMsgId] = useState<string | null>(null);
  
  // Carbon Alert State
  const [limitAlertShown, setLimitAlertShown] = useState(false);
  const [showCarbonAlert, setShowCarbonAlert] = useState(false);
  
  // Use Unified Carbon Engine
  const { stats: totalCarbon, trackAction, setUser: setCarbonUser, syncAuthStats } = useCarbon();

  // Helper to define trackInteraction using trackAction from context
  const trackInteraction = (actionName: string, emission: number, saved: number) => {
    trackAction(actionName, emission, saved);
  };

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognizerRef = useRef<SpeechRecognizer | null>(null);

  // Sync user with Carbon Engine
  useEffect(() => {
      setCarbonUser(user);
  }, [user]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (!user) return;

    recognizerRef.current = new SpeechRecognizer(
      user.language,
      (text) => setInputText(text),
      () => {
        setIsListening(false);
      }
    );
  }, [user?.language]);

  // Load Chat History on Login
  useEffect(() => {
    if (user && user.role !== 'admin') {
        const savedHistory = localStorage.getItem(`mavionix_chats_${user.id}`);
        if (savedHistory) {
            try {
                const parsed = JSON.parse(savedHistory);
                setChatThreads(parsed);
            } catch (e) {
                console.error("Failed to load chat history", e);
            }
        }
    }
  }, [user]);

  // Auto-Save Chat Threads
  useEffect(() => {
      if (!user || user.role === 'admin') return;
      if (messages.length <= 1 && messages[0]?.role === 'assistant') return;

      setChatThreads(prev => {
          const updatedThreads = [...prev];
          const index = updatedThreads.findIndex(t => t.id === activeThreadId);
          
          let title = "New Conversation";
          const firstUserMsg = messages.find(m => m.role === 'user');
          if (firstUserMsg) {
              title = firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '');
          } 

          const threadData: ChatThread = {
              id: activeThreadId,
              title: title,
              messages: messages,
              lastUpdated: Date.now()
          };

          if (index >= 0) {
              updatedThreads[index] = threadData;
          } else {
              updatedThreads.unshift(threadData);
          }
          
          updatedThreads.sort((a, b) => b.lastUpdated - a.lastUpdated);
          localStorage.setItem(`mavionix_chats_${user.id}`, JSON.stringify(updatedThreads));
          return updatedThreads;
      });
  }, [messages, activeThreadId, user]);

  // Daily Limit Alert Logic
  useEffect(() => {
    const limit = user?.customCarbonLimit || DAILY_CARBON_LIMIT;
    if (totalCarbon.emission > limit && !limitAlertShown && user?.role !== 'admin') {
      setShowCarbonAlert(true);
      setLimitAlertShown(true);
      speakText("Warning. Daily carbon emission limit reached. Switching to eco-saver suggestions.", user?.language || Language.ENGLISH);
    }
  }, [totalCarbon.emission, limitAlertShown, user]);

  // Auto scroll
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        const isBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollDown(!isBottom);
    }
  };

  // --- CHAT MANAGEMENT FUNCTIONS ---

  const getGreeting = (lang: Language, businessName: string) => {
      if (lang === Language.HINDI) return `नमस्ते ${businessName}! मैं मदद के लिए तैयार हूँ।`;
      if (lang === Language.TAMIL) return `வணக்கம் ${businessName}! நான் உதவ தயாராக உள்ளேன்.`;
      if (lang === Language.BENGALI) return `নমস্কার ${businessName}! আমি সাহায্যের জন্য প্রস্তুত।`;
      return `Namaste ${businessName}! I am ready to help.`;
  };

  const handleNewChat = () => {
      if (!user) return;
      
      if (messages.length <= 1 && messages[0]?.role === 'assistant') {
          setShowRightSidebar(false);
          return;
      }

      const newId = Date.now().toString();
      setActiveThreadId(newId);
      
      const greetingMsg: Message = {
          id: '0',
          role: 'assistant',
          content: getGreeting(user.language, user.businessName),
          timestamp: Date.now(),
          type: ServiceType.CHAT
      };
      
      setMessages([greetingMsg]);
      setCurrentView('chat');
      setShowRightSidebar(false);
      trackInteraction('New Chat', INTERACTION_EMISSION, 0);
  };

  const handleLoadThread = (thread: ChatThread) => {
      setActiveThreadId(thread.id);
      setMessages(thread.messages);
      setCurrentView('chat');
      setShowRightSidebar(false);
      trackInteraction('Load Chat', INTERACTION_EMISSION, 0);
  };

  const handleDeleteThread = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (!user) return;
      
      const updatedThreads = chatThreads.filter(t => t.id !== id);
      setChatThreads(updatedThreads);
      localStorage.setItem(`mavionix_chats_${user.id}`, JSON.stringify(updatedThreads));
      
      if (id === activeThreadId) {
          handleNewChat();
      }
  };

  const handleLogin = (loggedInUser: UserProfile, authCarbon: CarbonStats) => {
    setUserLocal(loggedInUser);
    syncAuthStats(authCarbon);
    
    // If admin, they stay in their dashboard
    setCurrentView('dashboard'); 

    // Initialize chat
    if (loggedInUser.role !== 'admin') {
        const greetingMsg: Message = {
            id: '0',
            role: 'assistant',
            content: getGreeting(loggedInUser.language, loggedInUser.businessName),
            timestamp: Date.now(),
            type: ServiceType.CHAT
        };
        setMessages([greetingMsg]);
    }
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUserLocal(updatedUser);
    createOrUpdateUser(updatedUser);
    trackInteraction('Update Profile', INTERACTION_EMISSION, 0);
  };

  const handleLogout = () => {
    if (user && user.role !== 'admin') {
        // Persist session aggregates
        let sessionRevenue = 0;
        let sessionTasks = 0;

        messages.forEach(m => {
            if (m.role === 'assistant' && m.type && m.type !== ServiceType.CHAT) {
                sessionTasks++;
                if (m.type === ServiceType.INVOICE && m.metadata?.total) {
                    sessionRevenue += parseInt(m.metadata.total) || 0;
                }
            }
        });

        const prevStats = user.usageStats || { totalRevenue: 0, totalAiTasks: 0, carbon: totalCarbon, lastActive: 0 };
        
        const updatedStats = {
            ...prevStats,
            totalRevenue: prevStats.totalRevenue + sessionRevenue,
            totalAiTasks: prevStats.totalAiTasks + sessionTasks,
            // Carbon is auto-synced by context now, but good to ensure latest is captured
            carbon: totalCarbon, 
            lastActive: Date.now()
        };

        const updatedUser = { ...user, usageStats: updatedStats };
        createOrUpdateUser(updatedUser);
    }

    setUserLocal(null);
    setMessages([]);
    setChatThreads([]);
    setCurrentView('chat');
    setLimitAlertShown(false);
    setShowCarbonAlert(false);
    setShowMobileMenu(false);
    setShowRightSidebar(false);
    stopSpeaking();
    setShowLanding(true);
  };

  const handleNavigation = (view: typeof currentView) => {
      setCurrentView(view);
      setTargetTool(null); // Clear tool selection when navigating away manually
      setShowMobileMenu(false);
      trackInteraction('Navigate', INTERACTION_EMISSION, 0);
  };

  const handleOpenTool = (toolId: string) => {
      setTargetTool(toolId);
      setCurrentView('tools');
      setShowMobileMenu(false);
      trackInteraction(`Open Tool: ${toolId}`, INTERACTION_EMISSION, 0);
  };

  const handleSend = async (overrideText?: string, image?: string) => {
    const textToSend = overrideText || inputText;
    if (!textToSend.trim() && !image) return;
    if (!user) return;

    stopSpeaking();
    trackInteraction('User Message', INTERACTION_EMISSION, 0);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
      metadata: image ? { imageUrl: image } : undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    try {
      const languageInstruction = ` (IMPORTANT: Reply strictly in ${user.language})`;
      const promptWithLang = userMsg.content + languageInstruction;

      const response = await sendMessageToGemini(messages, promptWithLang, {
        businessName: user.businessName,
        businessType: user.businessType,
        location: user.location,
        language: user.language
      }, image);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        timestamp: Date.now(),
        type: response.type,
        metadata: response.data,
        carbon: response.carbon
      };

      if (image && aiMsg.carbon) {
         aiMsg.carbon.emission += CARBON_ESTIMATES.IMAGE_UPLOAD.emission;
         aiMsg.carbon.activeEmission = aiMsg.carbon.emission;
      }

      setMessages(prev => [...prev, aiMsg]);
      
      if (aiMsg.carbon) {
        trackAction(
            aiMsg.type || ServiceType.CHAT, 
            aiMsg.carbon.emission, 
            aiMsg.carbon.saved
        );
      }

      speakText(response.text, user.language);

    } catch (error) {
      console.error("Interaction failed", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Network issue. Please try again.",
        timestamp: Date.now(),
        type: ServiceType.CHAT
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToolAction = (prompt: string, image?: string) => {
    if (currentView !== 'chat') {
        setCurrentView('chat');
    }
    handleSend(prompt, image);
  };

  const toggleListening = () => {
    if (isListening) {
      recognizerRef.current?.stop();
    } else {
      stopSpeaking();
      recognizerRef.current?.start();
      setIsListening(true);
    }
  };

  // 1. Show Website if no user and landing is enabled
  if (!user && showLanding) {
    return <Website onStart={(lang) => { setLandingLanguage(lang); setShowLanding(false); }} />;
  }

  // 2. Show Auth Panel if no user and landing disabled (user clicked Get Started)
  if (!user && !showLanding) {
    return (
        <CarbonProvider>
            <AuthPanel onLogin={handleLogin} onBack={() => setShowLanding(true)} initialLanguage={landingLanguage} />
        </CarbonProvider>
    );
  }

  // 3. Show Admin Dashboard
  if (user?.role === 'admin') {
      return <AdminDashboard user={user} onLogout={handleLogout} initialStats={totalCarbon} onUpdateUser={handleUpdateUser} />;
  }

  const t = UI_TRANSLATIONS[user.language].nav;

  // 4. Show Main App
  return (
    <div className={`flex h-screen overflow-hidden font-sans relative ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Carbon Alert Modal */}
      {showCarbonAlert && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] w-[90%] max-w-md animate-bounce-in">
              <div className="bg-red-50 border-2 border-red-100 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 relative">
                  <div className="flex items-start gap-3">
                      <div className="bg-red-100 p-2 rounded-full text-red-600 animate-pulse">
                          <AlertTriangle size={24} />
                      </div>
                      <div className="flex-1">
                          <h3 className="font-bold text-red-800 text-lg">Daily Limit Reached!</h3>
                          <p className="text-xs text-red-600 leading-relaxed">
                              You have exceeded the daily carbon emission limit of <strong>{user.customCarbonLimit || DAILY_CARBON_LIMIT}g</strong>. 
                              The app is using passive energy even when idle.
                          </p>
                      </div>
                      <button 
                        onClick={() => setShowCarbonAlert(false)}
                        className="text-red-400 hover:text-red-700"
                      >
                          <X size={20} />
                      </button>
                  </div>
                  <div className="flex gap-2">
                      <button 
                        onClick={() => { setShowCarbonAlert(false); handleNavigation('carbon'); }}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-red-700 transition"
                      >
                          View Impact Report
                      </button>
                      <button 
                        onClick={() => setShowCarbonAlert(false)}
                        className="px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg text-xs font-bold hover:bg-red-50 transition"
                      >
                          Dismiss
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={() => setShowMobileMenu(false)}
        ></div>
      )}

      {/* Mobile Chat History Overlay */}
      {showRightSidebar && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={() => setShowRightSidebar(false)}
        ></div>
      )}

      {/* Left Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 ${isDarkMode ? 'bg-slate-950 border-r border-slate-800' : 'bg-slate-900 shadow-2xl'} text-white p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}`}>
        <button 
          onClick={() => setShowMobileMenu(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white md:hidden"
        >
          <X size={24} />
        </button>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 mb-8 flex-shrink-0">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/30">M</div>
            <div>
              <h1 className="font-bold text-lg tracking-wide">MaVionix</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Rural AI OS</p>
            </div>
          </div>
          
          <nav className="space-y-2 flex-shrink-0">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 px-2">{t.workspace}</div>
            
            <button 
               onClick={() => handleNavigation('dashboard')}
               className={`flex items-center gap-3 w-full p-3 rounded-xl transition group ${currentView === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
            >
              <LayoutGrid size={18} className={`${currentView === 'dashboard' ? 'text-white' : 'group-hover:text-indigo-400'} transition`} /> {t.dashboard}
            </button>

            <button 
               onClick={() => handleNavigation('chat')}
               className={`flex items-center gap-3 w-full p-3 rounded-xl transition group ${currentView === 'chat' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
            >
              <Sparkles size={18} className={`${currentView === 'chat' ? 'text-white' : 'group-hover:text-amber-400'} transition`} /> {t.aiAssistant}
            </button>

            <button 
               onClick={() => handleNavigation('tools')}
               className={`flex items-center gap-3 w-full p-3 rounded-xl transition group ${currentView === 'tools' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
            >
              <Briefcase size={18} className={`${currentView === 'tools' ? 'text-white' : 'group-hover:text-emerald-400'} transition`} /> {t.businessTools}
            </button>

            <button 
               onClick={() => handleNavigation('design')}
               className={`flex items-center gap-3 w-full p-3 rounded-xl transition group ${currentView === 'design' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
            >
               <PenTool size={18} className={`${currentView === 'design' ? 'text-white' : 'group-hover:text-pink-400'} transition`} /> {t.designStudio}
            </button>
            
            <button 
               onClick={() => handleNavigation('scheme')}
               className={`flex items-center gap-3 w-full p-3 rounded-xl transition group ${currentView === 'scheme' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
            >
               <Landmark size={18} className={`${currentView === 'scheme' ? 'text-white' : 'group-hover:text-orange-400'} transition`} /> {t.govSchemes}
            </button>
            
            <button 
               onClick={() => handleNavigation('carbon')}
               className={`flex items-center gap-3 w-full p-3 rounded-xl transition group ${currentView === 'carbon' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
            >
               <Leaf size={18} className={`${currentView === 'carbon' ? 'text-white' : 'group-hover:text-emerald-400'} transition`} /> {t.sustainability}
            </button>
          </nav>
        </div>

        <div className="pt-4 mt-2 border-t border-slate-800 space-y-4 flex-shrink-0">
           
           <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800 cursor-pointer"
           >
                <div className="flex items-center gap-2">
                    {isDarkMode ? <Moon size={14} className="text-indigo-400"/> : <Sun size={14} className="text-amber-400"/>}
                    <span className="text-xs text-slate-300">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
           </button>

           <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <div className="flex items-center gap-2">
                    <Zap size={14} className="text-amber-400 animate-pulse" />
                    <div className="text-[10px] text-slate-400">
                        {t.passiveTracker}
                    </div>
                </div>
                <div className="text-xs font-mono text-emerald-400">
                    {totalCarbon.emission.toFixed(2)}g
                </div>
           </div>

           <div 
             onClick={() => handleNavigation('profile')}
             className="flex items-center justify-between p-2 rounded-xl bg-slate-800/50 border border-slate-700 cursor-pointer hover:bg-slate-800 transition group"
           >
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-indigo-900 flex items-center justify-center border border-indigo-700 text-xs font-bold">
                  {user.businessName[0]}
               </div>
               <div className="overflow-hidden">
                 <p className="text-white text-sm truncate w-24 group-hover:text-indigo-200 transition">{user.businessName}</p>
                 <p className="text-[10px] text-slate-400">{t.profile}</p>
               </div>
             </div>
             <button onClick={(e) => { e.stopPropagation(); handleLogout(); }} className="text-slate-400 hover:text-red-400 p-1">
                <LogOut size={16} />
             </button>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        
        {/* Header (Mobile Only) */}
        <header className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-b p-4 flex justify-between items-center shadow-sm z-30 md:hidden flex-shrink-0`}>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowMobileMenu(true)} className={`p-2 -ml-2 rounded-full transition ${isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}>
               <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold">M</div>
               <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>MaVionix</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentView === 'chat' && (
                <button onClick={() => setShowRightSidebar(true)} className={`p-2 rounded-full transition relative ${isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}>
                    <History size={20} />
                    {chatThreads.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full"></span>}
                </button>
            )}
            <button onClick={handleLogout} className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-full">
                <LogOut size={20} />
            </button>
          </div>
        </header>

        {currentView === 'dashboard' ? (
           <div className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
              <MainDashboard user={user} stats={totalCarbon} messages={messages} onNavigate={handleNavigation} onOpenTool={handleOpenTool} language={user.language} />
           </div>
        ) : currentView === 'tools' ? (
           <div className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
              <ToolsDashboard onAction={handleToolAction} language={user.language} initialTool={targetTool} onToolExit={() => setTargetTool(null)} />
           </div>
        ) : currentView === 'design' ? (
           <div className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
              <DesignStudio onAction={handleToolAction} language={user.language} />
           </div>
        ) : currentView === 'scheme' ? (
            <div className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
               <SchemeFinder onAction={handleToolAction} language={user.language} />
            </div>
        ) : currentView === 'carbon' ? (
            <div className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
               <CarbonDashboard stats={totalCarbon} limit={user.customCarbonLimit} language={user.language} userId={user.id} isDarkMode={isDarkMode} />
            </div>
        ) : currentView === 'profile' ? (
            <div className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
               <UserProfileView 
                  user={user} 
                  stats={totalCarbon} 
                  onUpdateUser={handleUpdateUser}
                  onBack={() => handleNavigation('dashboard')}
               />
            </div>
        ) : (
          /* CHAT VIEW - Split Layout */
          <div className="flex-1 flex overflow-hidden h-full relative">
            
            {/* Center Chat Area */}
            <div 
                className={`flex-1 flex flex-col relative h-full overflow-hidden ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`} 
            >
                {/* ... existing chat code ... */}
                {/* Scrollable Messages Area */}
                <div 
                    className="flex-1 overflow-y-auto pb-40 custom-scrollbar"
                    onScroll={handleScroll}
                    ref={chatContainerRef}
                >
                    {/* Empty State / Welcome Screen */}
                    {messages.length <= 1 && (
                        <div className="max-w-3xl mx-auto px-6 py-12 text-center animate-fade-in mt-10">
                            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 text-indigo-600 ring-4 ring-indigo-50">
                                <Sparkles size={40} />
                            </div>
                            <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                {user.language === Language.BENGALI ? 'হ্যালো' : user.language === Language.HINDI ? 'नमस्ते' : user.language === Language.TAMIL ? 'வணக்கம்' : 'Hello'}, {user.businessName}
                            </h2>
                            <p className="text-slate-500 mb-10 text-lg max-w-lg mx-auto">
                                {user.language === Language.BENGALI ? 'আজ আমি আপনার ব্যবসায় কীভাবে সাহায্য করতে পারি?' : 
                                user.language === Language.HINDI ? 'आज मैं आपके व्यवसाय को बढ़ाने में कैसे मदद कर सकता हूँ?' :
                                user.language === Language.TAMIL ? 'இன்று உங்கள் வணிகத்தை வளர்க்க நான் எவ்வாறு உதவ முடியும்?' :
                                'How can I help you grow your business today?'}
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                                {SUGGESTIONS.map((s, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => handleSend(s.text)}
                                        className={`p-4 rounded-xl border shadow-sm transition-all group ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-indigo-500' : 'bg-white border-slate-200 hover:shadow-md hover:border-indigo-300'}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-700 group-hover:bg-indigo-900' : 'bg-slate-50 group-hover:bg-indigo-50'}`}>
                                                {s.icon}
                                            </div>
                                            <div>
                                                <p className={`font-bold text-sm group-hover:text-indigo-600 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{s.label}</p>
                                                <p className="text-xs text-slate-500 line-clamp-1">{s.text}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
                        {messages.slice(messages.length <= 1 ? 1 : 0).map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                            
                            {/* Assistant Avatar */}
                            {msg.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0 mr-3 mt-1">
                                    M
                                </div>
                            )}

                            <div className={`max-w-[85%] md:max-w-[75%] space-y-2`}>
                            
                            {/* Message Bubble */}
                            <div className={`p-4 md:p-5 shadow-sm text-sm md:text-base leading-relaxed ${
                                msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm' 
                                : `${isDarkMode ? 'bg-slate-800 text-slate-100 border-slate-700' : 'bg-white text-slate-800 border-slate-200'} border rounded-2xl rounded-tl-sm`
                            }`}>
                                {/* Show uploaded image */}
                                {msg.role === 'user' && msg.metadata?.imageUrl && (
                                <div className="mb-3 rounded-xl overflow-hidden border border-white/20">
                                    <img src={msg.metadata.imageUrl} alt="Uploaded" className="max-w-full h-auto max-h-60 object-cover" />
                                </div>
                                )}
                                
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                            </div>

                            {/* Service Metadata (Cards) */}
                            {msg.role === 'assistant' && msg.type !== ServiceType.CHAT && msg.metadata && (
                                <div className="animate-fade-in-up pl-1">
                                <ServiceDisplay type={msg.type!} data={msg.metadata} language={user.language} />
                                </div>
                            )}

                            {/* Carbon Footprint Tag */}
                            {msg.role === 'assistant' && msg.carbon && (
                                <div className="flex flex-col items-start gap-1 ml-1 mt-1">
                                <div className="flex items-center gap-2">
                                    <div className={`flex items-center gap-2 text-[10px] px-2 py-1 rounded-full border shadow-sm backdrop-blur-sm ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-slate-400' : 'bg-white/50 border-slate-100 text-slate-400'}`}>
                                        <span className="flex items-center gap-1">
                                        <RefreshCcw size={10} /> {(msg.carbon.energy).toFixed(2)} J
                                        </span>
                                        <span>•</span>
                                        <span className="text-emerald-600 font-medium">
                                        -{msg.carbon.emission.toFixed(2)}g CO₂
                                        </span>
                                    </div>
                                    
                                    {/* Granular Toggle */}
                                    {msg.carbon.breakdown && (
                                        <button 
                                            onClick={() => setExpandedCarbonMsgId(expandedCarbonMsgId === msg.id ? null : msg.id)}
                                            className={`p-1 rounded-full transition ${isDarkMode ? 'hover:bg-slate-700 text-slate-500' : 'hover:bg-slate-200 text-slate-400'}`}
                                            title="View Carbon Breakdown"
                                        >
                                            {expandedCarbonMsgId === msg.id ? <ChevronUp size={12}/> : <Info size={12}/>}
                                        </button>
                                    )}
                                </div>

                                {/* Granular Breakdown Panel */}
                                {expandedCarbonMsgId === msg.id && msg.carbon.breakdown && (
                                    <div className="bg-slate-800 text-slate-200 p-3 rounded-xl text-[10px] w-full max-w-[250px] shadow-lg animate-fade-in mt-1 border border-slate-700 relative z-10">
                                        <div className="flex justify-between items-center mb-2 border-b border-slate-700 pb-2">
                                            <span className="font-bold text-slate-300">Process Breakdown</span>
                                            <Leaf size={10} className="text-emerald-400"/>
                                        </div>
                                        <div className="space-y-1.5">
                                            {msg.carbon.breakdown.map((step, idx) => (
                                                <div key={idx} className="flex justify-between items-center">
                                                    <span className="opacity-80">{step.step}</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-12 h-1 bg-slate-700 rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-emerald-500 rounded-full" 
                                                                style={{width: `${(step.emission / msg.carbon!.emission) * 100}%`}}
                                                            ></div>
                                                        </div>
                                                        <span className="font-mono font-bold text-emerald-400 w-8 text-right">{step.emission.toFixed(2)}g</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                </div>
                            )}
                            </div>
                        </div>
                        ))}
                        
                        {/* Processing Indicator */}
                        {isProcessing && (
                            <div className="flex justify-start animate-fade-in pl-11">
                                <div className={`px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border flex items-center gap-2 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Bar - Fixed Bottom of Center Area */}
                <div className={`absolute bottom-0 left-0 w-full backdrop-blur-md border-t px-4 py-4 z-40 ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
                    <div className="max-w-3xl mx-auto relative">
                        
                        {/* Floating Voice Orb */}
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 pointer-events-auto">
                            <VoiceOrb 
                                isListening={isListening} 
                                isProcessing={isProcessing} 
                                onClick={toggleListening} 
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <button className={`p-3 rounded-xl transition ${isDarkMode ? 'text-slate-500 hover:text-indigo-400 hover:bg-slate-800' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                                <ImageIcon size={22} />
                            </button>

                            <button 
                                onClick={stopSpeaking}
                                className={`p-3 rounded-xl transition ${isDarkMode ? 'text-slate-500 hover:text-red-400 hover:bg-slate-800' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                                title="Stop AI Voice"
                            >
                                <VolumeX size={22} />
                            </button>

                            <div className={`flex-1 rounded-2xl border transition-all flex items-center px-4 ${isDarkMode ? 'bg-slate-800 border-transparent focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-900' : 'bg-slate-100 border-transparent focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100'}`}>
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={isListening ? "Listening..." : (user.language === Language.ENGLISH ? "Ask anything..." : user.language === Language.BENGALI ? "কিছু জিজ্ঞাসা করুন..." : "कुछ भी पूछें...")}
                                    className={`w-full bg-transparent outline-none h-14 ${isDarkMode ? 'text-slate-100 placeholder:text-slate-500' : 'text-slate-700 placeholder:text-slate-400'}`}
                                    disabled={isProcessing}
                                />
                            </div>

                            <button 
                                onClick={() => handleSend()}
                                disabled={!inputText.trim() || isProcessing}
                                className="bg-indigo-600 text-white p-4 rounded-xl disabled:opacity-50 hover:bg-indigo-700 transition-all shadow-md active:scale-95 flex-shrink-0"
                            >
                                <Send size={22} />
                            </button>
                        </div>
                        
                        <div className="text-center mt-2">
                            <div className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                                <Leaf size={10} className="text-emerald-500" />
                                <span>Idle Energy Monitored</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Chat History */}
            <aside className={`
                fixed inset-y-0 right-0 z-50 w-72 md:shadow-none md:relative md:w-80
                transform transition-transform duration-300 ease-in-out flex flex-col border-l
                ${showRightSidebar ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0
                ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}
            `}>
                <div className={`p-4 border-b flex justify-between items-center flex-shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <h3 className={`font-bold flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                        <History size={18} className="text-indigo-600"/> Previous Chats
                    </h3>
                    <button 
                        onClick={() => setShowRightSidebar(false)} 
                        className={`md:hidden p-2 hover:text-slate-600 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 flex-shrink-0">
                    <button 
                        onClick={handleNewChat}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] font-bold text-sm"
                    >
                        <Plus size={18} /> New Chat
                    </button>
                </div>

                {/* History List */}
                <div className="flex-1 overflow-y-auto px-2 pb-4 custom-scrollbar space-y-1">
                    {chatThreads.length === 0 ? (
                        <div className="text-center py-10 px-6">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${isDarkMode ? 'bg-slate-800 text-slate-600' : 'bg-slate-50 text-slate-300'}`}>
                                <MessageSquare size={24} />
                            </div>
                            <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>No History Yet</p>
                            <p className="text-xs text-slate-500 mt-1">Start a conversation to see it saved here.</p>
                        </div>
                    ) : (
                        chatThreads.map(thread => (
                            <div 
                                key={thread.id}
                                onClick={() => handleLoadThread(thread)}
                                className={`group relative p-3 rounded-xl cursor-pointer transition-all border border-transparent ${activeThreadId === thread.id ? (isDarkMode ? 'bg-indigo-900/20 border-indigo-800' : 'bg-indigo-50 border-indigo-100') : (isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50')}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`text-xs font-bold truncate pr-6 ${activeThreadId === thread.id ? 'text-indigo-500' : (isDarkMode ? 'text-slate-300' : 'text-slate-700')}`}>
                                        {thread.title || "Conversation"}
                                    </h4>
                                    <span className="text-[10px] text-slate-500 flex-shrink-0 whitespace-nowrap">
                                        {new Date(thread.lastUpdated).toLocaleDateString([], {month:'short', day:'numeric'})}
                                    </span>
                                </div>
                                <p className="text-[10px] text-slate-500 line-clamp-1 pr-6">
                                    {thread.messages.find(m => m.role === 'user')?.content || "No preview"}
                                </p>
                                
                                <button 
                                    onClick={(e) => handleDeleteThread(e, thread.id)}
                                    className="absolute bottom-2 right-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                    title="Delete"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </aside>
          </div>
        )}

      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CarbonProvider>
      <AppContent />
    </CarbonProvider>
  );
};

export default App;
