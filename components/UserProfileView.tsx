
import React, { useState, useEffect, useRef } from 'react';
import { 
  User, MapPin, Phone, Mail, CreditCard, Save, Edit2, 
  Globe, Building2, Leaf, ChevronLeft, Lock, ShieldCheck, 
  CheckCircle, Crown, Award, Zap, RefreshCw, 
  Cloud, Video, HelpCircle, Star, Camera, X, Trash2, Rocket, Sparkles,
  Loader2, LogOut, Instagram, Facebook, Link, Share2, Copy, Mic, MicOff
} from 'lucide-react';
import { UserProfile, CarbonStats, Language, PrivacySettings } from '../types';
import { SUGGESTED_LOCATIONS, BUSINESS_CATEGORIES, UI_TRANSLATIONS } from '../constants';
import { SpeechRecognizer, speakText } from '../services/audioService';

interface Props {
  user: UserProfile;
  stats: CarbonStats;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onBack: () => void;
}

const UserProfileView: React.FC<Props> = ({ user, stats, onUpdateUser, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(user);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showToast, setShowToast] = useState<{msg: string, type: 'success' | 'info'} | null>(null);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  
  // Voice Control State
  const [isListening, setIsListening] = useState(false);
  const recognizerRef = useRef<SpeechRecognizer | null>(null);
  const isEditingRef = useRef(isEditing);
  const formDataRef = useRef(formData);

  const t = UI_TRANSLATIONS[user.language]?.profile || UI_TRANSLATIONS[Language.ENGLISH].profile;

  // Upgrade Modal State
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeStep, setUpgradeStep] = useState<'info' | 'payment'>('info');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({ card: '', expiry: '', cvv: '' });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isPro = formData.subscription === 'pro';

  // Sync refs for voice callback
  useEffect(() => { isEditingRef.current = isEditing; }, [isEditing]);
  useEffect(() => { formDataRef.current = formData; }, [formData]);

  // Calculate Member Since from ID (timestamp)
  const memberSince = React.useMemo(() => {
    try {
        const timestamp = parseInt(user.id);
        if (!isNaN(timestamp)) {
            return new Date(timestamp).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        }
    } catch (e) { }
    return "Unknown";
  }, [user.id]);

  // Sync state with props
  useEffect(() => {
    setFormData(user);
  }, [user]);

  // Initialize Speech Recognition
  useEffect(() => {
    recognizerRef.current = new SpeechRecognizer(
        formData.language,
        (text) => handleVoiceCommand(text),
        () => setIsListening(false)
    );
  }, [formData.language]);

  const handleVoiceCommand = (text: string) => {
      const lower = text.toLowerCase();
      
      // Save Command
      if (lower.includes('save') || lower.includes('update') || lower.includes('done')) {
          if (isEditingRef.current) {
              performSave();
              speakText("Profile updated successfully.", formDataRef.current.language);
          } else {
              speakText("You are not in edit mode.", formDataRef.current.language);
          }
      } 
      // Edit Command
      else if (lower.includes('edit') || lower.includes('change')) {
          setIsEditing(true);
          speakText("Edit mode enabled.", formDataRef.current.language);
      }
      // Cancel Command
      else if (lower.includes('cancel')) {
          setIsEditing(false);
          setFormData(user); // Reset
          speakText("Changes cancelled.", formDataRef.current.language);
      }
  };

  const toggleListening = () => {
      if (isListening) {
          recognizerRef.current?.stop();
          setIsListening(false);
      } else {
          recognizerRef.current?.start();
          setIsListening(true);
      }
  };

  const handleChange = (field: keyof UserProfile | keyof typeof user, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (key: 'website' | 'instagram' | 'facebook', value: string) => {
      setFormData(prev => ({
          ...prev,
          socialLinks: {
              ...prev.socialLinks,
              [key]: value
          }
      }));
  };

  // Location Autocomplete Logic
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    handleChange('location', val);
    if (val.length > 1) {
        const matches = SUGGESTED_LOCATIONS.filter(l => l.toLowerCase().includes(val.toLowerCase())).slice(0, 5);
        setLocationSuggestions(matches);
    } else {
        setLocationSuggestions([]);
    }
  };

  const selectLocation = (loc: string) => {
    handleChange('location', loc);
    setLocationSuggestions([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        handleChange('profileImage', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleChange('profileImage', undefined);
  }

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const performSave = () => {
      setIsSaving(true);
      // Simulate API call delay
      setTimeout(() => {
        onUpdateUser(formDataRef.current);
        setIsEditing(false);
        setIsSaving(false);
        showNotification("Profile Updated Successfully!");
      }, 1000);
  };

  const handleSave = () => {
    performSave();
  };

  const handlePaymentSubmit = () => {
     if (!paymentDetails.card || !paymentDetails.expiry || !paymentDetails.cvv) {
         return; // Basic validation
     }
     setIsUpgrading(true);
     setTimeout(() => {
          const upgradedUser = { ...formData, subscription: 'pro' as const };
          setFormData(upgradedUser);
          onUpdateUser(upgradedUser);
          setIsUpgrading(false);
          setShowUpgradeModal(false);
          setUpgradeStep('info');
          setPaymentDetails({ card: '', expiry: '', cvv: '' });
          showNotification("Payment Successful! Welcome to MaVionix Pro!");
     }, 2000);
  };

  const showNotification = (msg: string) => {
      setShowToast({ msg, type: 'success' });
      setTimeout(() => setShowToast(null), 3000);
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const handleResetPin = () => {
      showNotification("Reset link sent to mobile/email.");
  };

  const handleDataDeletion = () => {
      showNotification("Deletion request logged. We will contact you.");
  };

  const togglePrivacy = (key: keyof PrivacySettings) => {
    const currentSettings = formData.privacySettings || {
      aiPersonalization: true,
      cloudBackup: true,
      marketing: false
    };
    
    const newSettings = {
      ...currentSettings,
      [key]: !currentSettings[key]
    };

    const updatedUser = {
        ...formData,
        privacySettings: newSettings,
        consentGiven: Date.now()
    };

    setFormData(updatedUser);
    onUpdateUser(updatedUser); 
  };

  // Safe access for privacy settings
  const privacy = formData.privacySettings || {
    aiPersonalization: true,
    cloudBackup: true,
    marketing: false
  };

  // Gamification Logic
  const getLevel = (saved: number) => {
    if (saved > 50000) return { name: 'Carbon Legend', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: <Crown size={16} /> };
    if (saved > 10000) return { name: 'Eco Warrior', color: 'text-teal-600', bg: 'bg-teal-100', icon: <Award size={16} /> };
    if (saved > 1000) return { name: 'Green Starter', color: 'text-green-600', bg: 'bg-green-100', icon: <Leaf size={16} /> };
    return { name: 'New Member', color: 'text-slate-600', bg: 'bg-slate-100', icon: <Star size={16} /> };
  };

  const currentLevel = getLevel(stats.saved);
  const nextLevelGoal = stats.saved < 1000 ? 1000 : stats.saved < 10000 ? 10000 : 50000;
  const progressPercent = Math.min(100, (stats.saved / nextLevelGoal) * 100);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in pb-24 relative">
      
      {/* Toast Notification */}
      {showToast && (
          <div className="fixed top-20 right-4 md:right-8 z-50 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in-up">
              <CheckCircle size={20} className="text-emerald-400" />
              <span className="font-bold text-sm">{showToast.msg}</span>
          </div>
      )}

      {/* Upgrade & Payment Modal */}
      {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative">
                  <button onClick={() => setShowUpgradeModal(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition z-20">
                      <X size={16} />
                  </button>
                  
                  {upgradeStep === 'info' ? (
                      <>
                        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20 -ml-10 -mb-10"></div>
                            
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4">
                                    <Crown size={32} className="text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Upgrade to Pro</h2>
                                <p className="text-slate-400 text-sm mt-1">Unlock the full power of MaVionix</p>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-3">
                                {[
                                    "Unlimited AI Design Generation",
                                    "Custom Domain (yourname.com)",
                                    "Priority Voice Support",
                                    "Advanced Growth Analytics",
                                    "Zero Transaction Fees"
                                ].map((feat, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                        <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                                        <span>{feat}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-slate-100 pt-4 mt-2">
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <p className="text-xs text-slate-500 line-through">₹999/year</p>
                                        <p className="text-2xl font-bold text-slate-800">₹499<span className="text-sm text-slate-500 font-normal">/year</span></p>
                                    </div>
                                    <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                                        Save 50%
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => setUpgradeStep('payment')}
                                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2"
                                >
                                    Proceed to Payment <Rocket size={18} />
                                </button>
                            </div>
                        </div>
                      </>
                  ) : (
                      <>
                        <div className="bg-slate-50 p-6 border-b border-slate-200">
                             <div className="flex items-center gap-3">
                                <button onClick={() => setUpgradeStep('info')} className="p-1 hover:bg-white rounded-full transition">
                                    <ChevronLeft size={20} className="text-slate-500"/>
                                </button>
                                <h2 className="text-lg font-bold text-slate-800">Secure Payment</h2>
                             </div>
                        </div>
                        <div className="p-6 space-y-4">
                             <div className="bg-indigo-50 p-4 rounded-xl flex justify-between items-center mb-2">
                                 <div>
                                     <p className="text-xs text-indigo-700 font-bold uppercase">Total Amount</p>
                                     <p className="text-xl font-bold text-indigo-900">₹499.00</p>
                                 </div>
                                 <ShieldCheck size={24} className="text-indigo-300" />
                             </div>

                             <div className="space-y-3">
                                 <div>
                                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Card Number</label>
                                     <div className="relative">
                                         <CreditCard className="absolute left-3 top-3 text-slate-400" size={18} />
                                         <input 
                                            type="text" 
                                            placeholder="0000 0000 0000 0000" 
                                            value={paymentDetails.card}
                                            onChange={e => setPaymentDetails({...paymentDetails, card: e.target.value.replace(/\D/g,'').slice(0,16)})}
                                            className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-mono"
                                         />
                                     </div>
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                     <div>
                                         <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Expiry</label>
                                         <input 
                                            type="text" 
                                            placeholder="MM/YY" 
                                            value={paymentDetails.expiry}
                                            onChange={e => setPaymentDetails({...paymentDetails, expiry: e.target.value})}
                                            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-mono"
                                            maxLength={5}
                                         />
                                     </div>
                                     <div>
                                         <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">CVV</label>
                                         <input 
                                            type="password" 
                                            placeholder="123" 
                                            value={paymentDetails.cvv}
                                            onChange={e => setPaymentDetails({...paymentDetails, cvv: e.target.value.replace(/\D/g,'').slice(0,3)})}
                                            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-mono"
                                            maxLength={3}
                                         />
                                     </div>
                                 </div>
                             </div>

                             <button 
                                onClick={handlePaymentSubmit}
                                disabled={isUpgrading || !paymentDetails.card || !paymentDetails.cvv}
                                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                            >
                                {isUpgrading ? <RefreshCw size={20} className="animate-spin" /> : <Lock size={18} />}
                                {isUpgrading ? 'Processing...' : 'Pay ₹499'}
                            </button>
                            <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
                                <Lock size={10} /> 256-bit Encrypted Payment
                            </p>
                        </div>
                      </>
                  )}
              </div>
          </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-white bg-white/50 border border-slate-200 rounded-full text-slate-500 transition shadow-sm">
            <ChevronLeft size={24} />
            </button>
            <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                {t.myProfile}
                {isPro && <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full border border-amber-200 uppercase tracking-wide flex items-center gap-1"><Crown size={10} fill="currentColor"/> Pro</span>}
            </h2>
            <p className="text-slate-500 text-sm">{t.manage}</p>
            </div>
        </div>
        <div className="flex items-center gap-3">
            {/* Voice Control Button */}
            <button 
                onClick={toggleListening}
                className={`p-2.5 rounded-xl transition shadow-sm border ${isListening ? 'bg-rose-50 border-rose-200 text-rose-500 animate-pulse' : 'bg-white border-slate-200 text-slate-500 hover:text-indigo-600'}`}
                title="Voice Commands: Say 'Save' or 'Edit'"
            >
                {isListening ? <Mic size={20} /> : <MicOff size={20} />}
            </button>

            {isEditing ? (
                 <div className="flex gap-2">
                    <button onClick={() => setIsEditing(false)} className="text-sm font-bold text-slate-500 hover:bg-white px-4 py-2 rounded-xl transition border border-transparent hover:border-slate-200">
                    {t.cancel}
                    </button>
                    <button onClick={handleSave} disabled={isSaving} className="text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-xl transition flex items-center gap-2 shadow-lg shadow-indigo-200">
                    {isSaving ? <RefreshCw size={16} className="animate-spin"/> : <Save size={16} />}
                    {isSaving ? 'Saving...' : t.save}
                    </button>
                </div>
            ) : (
                <button onClick={() => setIsEditing(true)} className="text-sm font-bold text-indigo-600 bg-white border border-indigo-100 hover:bg-indigo-50 px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm">
                    <Edit2 size={16} /> {t.edit}
                </button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar (Sticky on Desktop) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-4">
          
          {/* Identity Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg text-center relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-full h-32 z-0 ${isPro ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-500' : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800'}`}></div>
            
            <div className="relative z-10 mt-12">
               {/* Profile Image with Edit Overlay */}
               <div className="relative inline-block group/avatar">
                   <div className={`w-32 h-32 rounded-full border-4 border-white shadow-xl mx-auto bg-slate-100 flex items-center justify-center overflow-hidden ${isPro ? 'ring-4 ring-amber-100' : ''}`}>
                      {formData.profileImage ? (
                          <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                          <span className={`text-5xl font-bold ${isPro ? 'text-amber-500' : 'text-indigo-300'}`}>{formData.businessName[0]}</span>
                      )}
                   </div>
                   
                   {/* Edit Button for Image */}
                   {(isEditing || !formData.profileImage) && (
                       <button 
                         onClick={triggerImageUpload}
                         className="absolute bottom-0 right-0 bg-white text-indigo-600 p-2.5 rounded-full shadow-lg border border-slate-100 hover:bg-indigo-50 transition-transform hover:scale-110"
                         title="Change Photo"
                       >
                           <Camera size={18} />
                       </button>
                   )}

                   {/* Remove Image Button (only if editing and image exists) */}
                   {isEditing && formData.profileImage && (
                       <button 
                         onClick={handleRemoveImage}
                         className="absolute top-0 right-0 bg-red-100 text-red-600 p-2 rounded-full shadow-sm border border-red-200 hover:bg-red-200 transition-transform hover:scale-110"
                         title="Remove Photo"
                       >
                           <Trash2 size={14} />
                       </button>
                   )}

                   <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      className="hidden" 
                      accept="image/*"
                   />
                   
                   {/* Verified Badge */}
                   {user.aadhaar && (
                      <div className="absolute bottom-1 left-1 bg-blue-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm pointer-events-none" title="Verified Merchant">
                          <CheckCircle size={14} />
                      </div>
                  )}
               </div>
               
               <h3 className="mt-4 text-xl font-bold text-slate-800 flex items-center justify-center gap-2">
                   {formData.businessName}
                   {isPro && <Crown size={16} className="text-amber-500" fill="currentColor" />}
               </h3>
               {formData.ownerName && <p className="text-sm font-medium text-slate-600">{formData.ownerName}</p>}
               
               <div className="flex items-center justify-center gap-2 mt-2">
                   <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${currentLevel.bg} ${currentLevel.color}`}>
                       {currentLevel.icon} {currentLevel.name}
                   </span>
                   <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
                       {formData.role}
                   </span>
               </div>

               <p className="text-slate-500 text-sm flex items-center justify-center gap-1 mt-4">
                 <MapPin size={14} /> {formData.location}
               </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2 mt-6 border-t border-slate-100 pt-6">
                <div className="text-center">
                    <div className="text-xs text-slate-400 uppercase font-bold">{t.memberSince}</div>
                    <div className="font-bold text-slate-700">{memberSince}</div>
                </div>
                <div className="text-center border-l border-slate-100">
                    <div className="text-xs text-slate-400 uppercase font-bold">{t.lastLogin}</div>
                    <div className="font-bold text-slate-700">Today</div>
                </div>
            </div>
          </div>

          {/* Cloud Sync Status */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-full ${isSyncing ? 'bg-indigo-100 text-indigo-600 animate-spin' : 'bg-emerald-100 text-emerald-600'}`}>
                      {isSyncing ? <RefreshCw size={18} /> : <Cloud size={18} />}
                  </div>
                  <div>
                      <h4 className="font-bold text-slate-800 text-sm">{t.sync}</h4>
                      <p className="text-xs text-slate-500">{isSyncing ? 'Syncing data...' : 'Everything is up to date'}</p>
                  </div>
              </div>
              <div className="text-xs text-slate-500 flex justify-between items-center bg-slate-50 p-3 rounded-xl mb-3">
                   <span>Storage Used</span>
                   <span className="font-bold text-slate-700">{isPro ? '120 MB / Unlimited' : '45 MB / 1 GB'}</span>
              </div>
              <button 
                onClick={handleManualSync}
                disabled={isSyncing}
                className="w-full text-xs font-bold text-indigo-600 py-2.5 border border-indigo-100 rounded-xl hover:bg-indigo-50 transition flex items-center justify-center gap-2"
              >
                 {isSyncing ? 'Syncing...' : 'Backup Now'}
              </button>
          </div>

          {/* Subscription Plan Card */}
          {isPro ? (
               <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-xs text-amber-100 uppercase font-bold">Current Plan</p>
                                <h4 className="text-xl font-bold flex items-center gap-2">MaVionix Pro</h4>
                            </div>
                            <div className="bg-white/20 p-2 rounded-lg">
                                <Crown size={20} className="text-white" fill="currentColor" />
                            </div>
                        </div>
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-amber-50">
                                <CheckCircle size={14} /> All Premium Features Active
                            </div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3 text-xs text-amber-50 mb-0">
                            Renews on Dec 31, 2025
                        </div>
                    </div>
               </div>
          ) : (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold">Current Plan</p>
                            <h4 className="text-xl font-bold flex items-center gap-2">Free Tier</h4>
                        </div>
                        <div className="bg-white/10 p-2 rounded-lg">
                            <Zap size={20} className="text-amber-400" />
                        </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <CheckCircle size={14} className="text-emerald-400" /> Unlimited AI Chat
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <CheckCircle size={14} className="text-emerald-400" /> Basic Designs (5/day)
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 opacity-60">
                            <Lock size={14} /> Custom Domain
                        </div>
                    </div>

                    <button 
                        onClick={() => { setShowUpgradeModal(true); setUpgradeStep('info'); }}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-sm transition shadow-lg shadow-indigo-900/50 flex items-center justify-center gap-2 group"
                    >
                        <Crown size={16} className="group-hover:text-amber-300 transition-colors" /> Upgrade to Pro
                    </button>
                </div>
            </div>
          )}

        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Gamification / Achievements */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              
              <div className="flex justify-between items-center mb-6 relative z-10">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Award size={20} className="text-orange-500" /> Eco-Achievements
                  </h3>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{stats.saved.toFixed(0)}g CO₂ Saved</span>
              </div>
              
              {/* Level Progress */}
              <div className="mb-6 relative z-10">
                  <div className="flex justify-between text-xs mb-2">
                      <span className="font-bold text-slate-700">{currentLevel.name}</span>
                      <span className="text-slate-500">{Math.round(progressPercent)}% to next level</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                  </div>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
                  <div className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${stats.saved > 100 ? 'bg-emerald-50 border-emerald-200 opacity-100 scale-100' : 'bg-slate-50 border-slate-100 opacity-60 grayscale scale-95'}`}>
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 text-emerald-600">
                          <Leaf size={20} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700">First Step</span>
                      <span className="text-[9px] text-slate-400">Save 100g CO₂</span>
                  </div>
                  
                  <div className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${stats.saved > 5000 ? 'bg-blue-50 border-blue-200 opacity-100 scale-100' : 'bg-slate-50 border-slate-100 opacity-60 grayscale scale-95'}`}>
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 text-blue-600">
                          <Cloud size={20} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700">Paperless</span>
                      <span className="text-[9px] text-slate-400">Save 5kg CO₂</span>
                  </div>

                  <div className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${user.hasBiometric ? 'bg-purple-50 border-purple-200 opacity-100 scale-100' : 'bg-slate-50 border-slate-100 opacity-60 grayscale scale-95'}`}>
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 text-purple-600">
                          <ShieldCheck size={20} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700">Secure Biz</span>
                      <span className="text-[9px] text-slate-400">Enable Biometric</span>
                  </div>

                  <div className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${stats.saved > 50000 ? 'bg-amber-50 border-amber-200 opacity-100 scale-100' : 'bg-slate-50 border-slate-100 opacity-60 grayscale scale-95'}`}>
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 text-amber-500">
                          <Crown size={20} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700">Legend</span>
                      <span className="text-[9px] text-slate-400">Save 50kg CO₂</span>
                  </div>
              </div>
          </div>

          {/* Business Details Form */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Building2 size={18} className="text-indigo-500" /> Business Details
                </h3>
             </div>
             
             <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Business Name</label>
                   {isEditing && formData.role !== 'admin' ? (
                     <input 
                       value={formData.businessName}
                       onChange={(e) => handleChange('businessName', e.target.value)}
                       className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition text-sm font-medium"
                     />
                   ) : (
                     <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 text-sm font-medium">{formData.businessName}</div>
                   )}
                </div>

                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Owner Name</label>
                   {isEditing ? (
                     <input 
                       value={formData.ownerName || ''}
                       onChange={(e) => handleChange('ownerName', e.target.value)}
                       placeholder="e.g. Ramesh Kumar"
                       className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition text-sm font-medium"
                     />
                   ) : (
                     <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 text-sm font-medium">{formData.ownerName || 'Not Added'}</div>
                   )}
                </div>

                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Business Type</label>
                   {isEditing && formData.role !== 'admin' ? (
                     <select 
                       value={formData.businessType}
                       onChange={(e) => handleChange('businessType', e.target.value)}
                       className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition text-sm font-medium"
                     >
                        <option value="">Select Business Type</option>
                        {Object.entries(BUSINESS_CATEGORIES).map(([category, types]) => (
                            <optgroup key={category} label={category}>
                                {types.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </optgroup>
                        ))}
                     </select>
                   ) : (
                     <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 text-sm font-medium">{formData.businessType}</div>
                   )}
                </div>

                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Your Role</label>
                   {isEditing && formData.role !== 'admin' ? (
                        <div className="flex gap-4">
                            <label className={`flex-1 p-3 border rounded-xl cursor-pointer transition ${formData.role === 'owner' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-200'}`}>
                                <input type="radio" className="hidden" name="role" checked={formData.role === 'owner'} onChange={() => handleChange('role', 'owner')} />
                                <div className="text-sm font-bold text-center">Owner</div>
                            </label>
                            <label className={`flex-1 p-3 border rounded-xl cursor-pointer transition ${formData.role === 'staff' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-200'}`}>
                                <input type="radio" className="hidden" name="role" checked={formData.role === 'staff'} onChange={() => handleChange('role', 'staff')} />
                                <div className="text-sm font-bold text-center">Staff</div>
                            </label>
                        </div>
                   ) : (
                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 text-sm font-medium capitalize">{formData.role}</div>
                   )}
                </div>

                <div className="md:col-span-2 relative">
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Location</label>
                   {isEditing ? (
                     <>
                        <input 
                            value={formData.location}
                            onChange={handleLocationChange}
                            placeholder="City, State"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition text-sm font-medium"
                        />
                        {/* Location Suggestions */}
                        {locationSuggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-40 overflow-y-auto">
                                {locationSuggestions.map((loc, idx) => (
                                    <button 
                                    key={idx}
                                    onClick={() => selectLocation(loc)}
                                    className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-medium text-slate-700 border-b border-slate-50 last:border-none flex items-center gap-2"
                                    >
                                        <MapPin size={14} className="text-slate-400" />
                                        {loc}
                                    </button>
                                ))}
                            </div>
                        )}
                     </>
                   ) : (
                     <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 text-sm font-medium flex items-center gap-2">
                        <MapPin size={16} className="text-slate-400" /> {formData.location}
                     </div>
                   )}
                </div>

                {/* Digital Presence - New Section */}
                <div className="md:col-span-2 border-t border-slate-100 pt-6 mt-2">
                    <h4 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                        <Globe size={16} className="text-indigo-500" /> Digital Presence
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Website</label>
                            {isEditing ? (
                                <div className="relative">
                                    <Link className="absolute left-3 top-3 text-slate-400" size={16}/>
                                    <input 
                                        value={formData.socialLinks?.website || ''}
                                        onChange={(e) => handleSocialChange('website', e.target.value)}
                                        placeholder="https://yourbusiness.com"
                                        className="w-full pl-9 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition text-sm font-medium"
                                    />
                                </div>
                            ) : (
                                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 text-sm font-medium flex items-center gap-2 overflow-hidden text-ellipsis">
                                    <Link size={16} className="text-slate-400 flex-shrink-0" /> 
                                    {formData.socialLinks?.website || <span className="text-slate-400 italic">Not Added</span>}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Instagram / Facebook</label>
                            {isEditing ? (
                                <div className="relative">
                                    <Instagram className="absolute left-3 top-3 text-slate-400" size={16}/>
                                    <input 
                                        value={formData.socialLinks?.instagram || ''}
                                        onChange={(e) => handleSocialChange('instagram', e.target.value)}
                                        placeholder="@username"
                                        className="w-full pl-9 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition text-sm font-medium"
                                    />
                                </div>
                            ) : (
                                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 text-sm font-medium flex items-center gap-2">
                                    <Instagram size={16} className="text-slate-400" /> 
                                    {formData.socialLinks?.instagram || <span className="text-slate-400 italic">Not Added</span>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Contact Info */}
             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
                    <User size={18} className="text-blue-500" /> {t.contact}
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500"><Phone size={18}/></div>
                            <div className="flex-1">
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Mobile Number</p>
                                {isEditing ? (
                                    <input 
                                        value={formData.mobile || ''}
                                        onChange={(e) => handleChange('mobile', e.target.value)}
                                        className="w-full bg-slate-50 border-b border-slate-200 focus:border-blue-500 outline-none text-sm font-bold text-slate-700 py-1"
                                        placeholder="Add Mobile"
                                    />
                                ) : (
                                    <p className="text-sm font-bold text-slate-700">{formData.mobile || 'Not linked'}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500"><Mail size={18}/></div>
                            <div className="flex-1">
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Email Address</p>
                                {isEditing ? (
                                    <input 
                                        value={formData.email || ''}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        className="w-full bg-slate-50 border-b border-slate-200 focus:border-blue-500 outline-none text-sm font-bold text-slate-700 py-1"
                                        placeholder="Add Email"
                                    />
                                ) : (
                                    <p className="text-sm font-bold text-slate-700">{formData.email || 'Not linked'}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
             </div>

             {/* Security */}
             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
                        <Lock size={18} className="text-emerald-500" /> {t.security}
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                            <div className="flex items-center gap-2">
                                <CreditCard size={16} className="text-slate-400" />
                                <span className="text-sm font-medium text-slate-700">Aadhaar Linked</span>
                            </div>
                            {formData.aadhaar ? <CheckCircle size={16} className="text-emerald-500" /> : <span className="text-xs text-slate-400">No</span>}
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-slate-400 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                </div>
                                <span className="text-sm font-medium text-slate-700">{t.biometric}</span>
                            </div>
                            {/* Toggle Visualization */}
                            <button 
                                onClick={() => handleChange('hasBiometric', !formData.hasBiometric)}
                                disabled={!isEditing}
                                className={`w-8 h-4 rounded-full relative transition-colors ${formData.hasBiometric ? 'bg-emerald-500' : 'bg-slate-300'} ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                            >
                                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${formData.hasBiometric ? 'left-4.5' : 'left-0.5'}`}></div>
                            </button>
                        </div>
                    </div>
                </div>
                {isEditing && (
                    <button onClick={handleResetPin} className="mt-4 w-full py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
                        Reset App PIN
                    </button>
                )}
             </div>
          </div>

          {/* Referral & Invite Card */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full opacity-10 blur-2xl -mr-10 -mt-10"></div>
               <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                            <Rocket size={20} className="text-yellow-300" /> {t.refer}
                        </h3>
                        <p className="text-indigo-100 text-sm max-w-sm">
                            Invite fellow shop owners to MaVionix. Both of you get <span className="font-bold text-white">1 Month Pro Free</span> when they sign up!
                        </p>
                    </div>
                    <div className="bg-white/10 p-3 rounded-xl border border-white/20 flex flex-col gap-2 min-w-[200px]">
                        <p className="text-xs text-indigo-200 uppercase font-bold text-center">Your Referral Code</p>
                        <div className="bg-white text-indigo-900 font-mono font-bold text-center py-2 rounded-lg text-lg tracking-wider select-all cursor-pointer" onClick={() => {
                            navigator.clipboard.writeText(`REF-${user.businessName.substring(0,3).toUpperCase()}${new Date().getFullYear()}`);
                            showNotification("Code Copied!");
                        }}>
                             {`REF-${user.businessName.substring(0,3).toUpperCase()}${new Date().getFullYear()}`}
                        </div>
                        <button className="text-xs bg-indigo-500 hover:bg-indigo-400 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1">
                            <Share2 size={12} /> Share Code
                        </button>
                    </div>
               </div>
          </div>

          {/* Privacy & Settings */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
                  <ShieldCheck size={18} className="text-purple-500" /> {t.privacy}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                      <div className="bg-purple-50 p-4 rounded-2xl">
                          <h4 className="text-xs font-bold text-purple-800 uppercase mb-2">Active Consent</h4>
                          <p className="text-xs text-purple-700">
                              Last updated: {new Date(formData.consentGiven || Date.now()).toLocaleDateString()}.
                              <br/>Your data is encrypted end-to-end.
                          </p>
                      </div>

                      <div className="space-y-3">
                          <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-700">AI Personalization</span>
                              <div 
                                  onClick={() => togglePrivacy('aiPersonalization')}
                                  className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${privacy.aiPersonalization ? 'bg-indigo-600' : 'bg-slate-300'}`}
                              >
                                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${privacy.aiPersonalization ? 'left-5' : 'left-1'}`}></div>
                              </div>
                          </div>
                          <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-700">Cloud Auto-Backup</span>
                              <div 
                                  onClick={() => togglePrivacy('cloudBackup')}
                                  className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${privacy.cloudBackup ? 'bg-indigo-600' : 'bg-slate-300'}`}
                              >
                                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${privacy.cloudBackup ? 'left-5' : 'left-1'}`}></div>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.language}</label>
                        {isEditing ? (
                            <select 
                            value={formData.language}
                            onChange={(e) => handleChange('language', e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 outline-none transition text-sm"
                            >
                                <option value={Language.ENGLISH}>English</option>
                                <option value={Language.HINDI}>Hindi (हिंदी)</option>
                                <option value={Language.TAMIL}>Tamil (தமிழ்)</option>
                                <option value={Language.BENGALI}>Bengali (বাংলা)</option>
                            </select>
                        ) : (
                            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 text-sm font-medium flex items-center justify-between">
                                <span className="capitalize">{formData.language === Language.ENGLISH ? 'English' : formData.language === Language.HINDI ? 'Hindi' : formData.language === Language.BENGALI ? 'Bengali' : formData.language === Language.TAMIL ? 'Tamil' : formData.language}</span>
                                <Globe size={14} className="text-slate-400" />
                            </div>
                        )}
                      </div>
                      
                      <div className="pt-2">
                         <button onClick={handleDataDeletion} className="w-full py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-bold hover:bg-red-100 transition flex items-center justify-center gap-2">
                             <Trash2 size={14} /> {t.delete}
                         </button>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileView;
