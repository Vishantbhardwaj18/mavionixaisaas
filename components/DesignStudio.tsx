
import React, { useState } from 'react';
import { PenTool, Image, UserSquare2, ChevronLeft, CheckCircle, Palette, Layers, Leaf, Instagram, Briefcase, Upload, X, Layout, Globe, User, Phone, MapPin, Type } from 'lucide-react';
import { CARBON_ESTIMATES, UI_TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface Props {
  onAction: (prompt: string, image?: string) => void;
  language: Language;
}

const DesignStudio: React.FC<Props> = ({ onAction, language }) => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const t = UI_TRANSLATIONS[language]?.design || UI_TRANSLATIONS[Language.ENGLISH].design;

  // Logo State
  const [logoName, setLogoName] = useState('');
  const [industry, setIndustry] = useState('');
  const [logoStyle, setLogoStyle] = useState('Minimalist');
  const [logoColor, setLogoColor] = useState('Brand Colors');
  const [logoImage, setLogoImage] = useState<string | null>(null);

  // Card State
  const [cardName, setCardName] = useState('');
  const [cardRole, setCardRole] = useState('');
  const [cardContact, setCardContact] = useState('');
  const [cardTheme, setCardTheme] = useState('Classic White');
  const [cardImage, setCardImage] = useState<string | null>(null);

  // Poster State
  const [posterTitle, setPosterTitle] = useState('');
  const [posterDesc, setPosterDesc] = useState('');
  const [posterTheme, setPosterTheme] = useState('Vibrant');
  const [posterImage, setPosterImage] = useState<string | null>(null);

  // Social Post State
  const [socialPlatform, setSocialPlatform] = useState('Instagram');
  const [socialContent, setSocialContent] = useState('');
  const [socialVibe, setSocialVibe] = useState('Trendy');

  // Brand Kit State
  const [brandName, setBrandName] = useState('');
  const [brandValues, setBrandValues] = useState('');
  const [brandColor, setBrandColor] = useState('Trustworthy (Blue/Slate)');
  const [brandFont, setBrandFont] = useState('Modern Sans-Serif');

  // Website Builder State
  const [webBizName, setWebBizName] = useState('');
  const [webType, setWebType] = useState('E-commerce Store');
  const [webServices, setWebServices] = useState('');
  const [webStyle, setWebStyle] = useState('Modern');

  const tools = [
    {
      id: 'brand',
      name: t.brand,
      desc: 'Logo, Color Palette & Fonts.',
      icon: <Palette size={24} className="text-teal-500" />,
      bg: 'bg-teal-50',
      saving: CARBON_ESTIMATES.BRAND_KIT.saved
    },
    {
      id: 'logo',
      name: t.logo,
      desc: 'Design a unique brand identity.',
      icon: <PenTool size={24} className="text-indigo-500" />,
      bg: 'bg-indigo-50',
      saving: CARBON_ESTIMATES.LOGO.saved
    },
    {
      id: 'card',
      name: t.card,
      desc: 'Professional business cards.',
      icon: <UserSquare2 size={24} className="text-orange-500" />,
      bg: 'bg-orange-50',
      saving: CARBON_ESTIMATES.CARD.saved
    },
    {
      id: 'website',
      name: 'Website Builder',
      desc: 'Full website design & layout.',
      icon: <Layout size={24} className="text-blue-600" />,
      bg: 'bg-blue-50',
      saving: CARBON_ESTIMATES.WEBSITE.saved
    },
    {
      id: 'poster',
      name: t.poster,
      desc: 'Promotional graphics for events.',
      icon: <Image size={24} className="text-purple-500" />,
      bg: 'bg-purple-50',
      saving: CARBON_ESTIMATES.POSTER.saved
    },
    {
      id: 'social',
      name: t.social,
      desc: 'Posts for Instagram & Facebook.',
      icon: <Instagram size={24} className="text-pink-500" />,
      bg: 'bg-pink-50',
      saving: CARBON_ESTIMATES.SOCIAL.saved
    },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoSubmit = () => {
    if (!logoName || !industry) return;
    let prompt = `Create a LOGO DESIGN for business "${logoName}" in the "${industry}" industry. Style: ${logoStyle}. Color Preference: ${logoColor}.`;
    if (logoImage) prompt += " Use the attached image as visual inspiration or a base sketch.";
    prompt += " Return a design preview.";
    
    onAction(prompt, logoImage || undefined);
    setActiveTool(null);
    setLogoImage(null);
  };

  const handleCardSubmit = () => {
    if (!cardName || !cardContact) return;
    let prompt = `Create a VISITING CARD DESIGN for "${cardName}" (${cardRole}). Contact details: ${cardContact}. Theme: ${cardTheme}.`;
    if (cardImage) prompt += " Incorporate the attached business logo into the card layout.";
    
    onAction(prompt, cardImage || undefined);
    setActiveTool(null);
    setCardImage(null);
  };

  const handlePosterSubmit = () => {
    if (!posterTitle) return;
    let prompt = `Create a PROMOTIONAL POSTER DESIGN with headline "${posterTitle}". Details: "${posterDesc}". Color Theme: ${posterTheme}.`;
    if (posterImage) prompt += " Feature the attached product or main image prominently in the poster.";
    
    onAction(prompt, posterImage || undefined);
    setActiveTool(null);
    setPosterImage(null);
  };

  const handleSocialSubmit = () => {
    if (!socialContent) return;
    const prompt = `Create a SOCIAL MEDIA POST for ${socialPlatform}. Content: "${socialContent}". Vibe: ${socialVibe}. Return type 'design' with subtype 'social'.`;
    onAction(prompt);
    setActiveTool(null);
  };

  const handleBrandKitSubmit = () => {
    if (!brandName) return;
    const prompt = `Create a COMPLETE BRAND KIT for "${brandName}". Core Values: "${brandValues}". Preferred Color Theme: ${brandColor}. Preferred Font Style: ${brandFont}. Include Logo, Color Palette (hex codes), and Font recommendations. Return type 'design' with subtype 'brand_kit'.`;
    onAction(prompt);
    setActiveTool(null);
  };

  const handleWebsiteSubmit = () => {
    if (!webBizName || !webServices) return;
    const prompt = `Create a ${webType} WEBSITE for "${webBizName}". Services/Products: "${webServices}". Design Style: ${webStyle}. Provide a full layout structure with hero, services, and contact sections.`;
    onAction(prompt);
    setActiveTool(null);
  };

  // Helper component for Image Upload UI
  const ImageUploader = ({ image, setImage, label }: { image: string | null, setImage: (v: string | null) => void, label: string }) => (
    <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative group">
      <input 
        type="file" 
        accept="image/*" 
        onChange={(e) => handleImageUpload(e, setImage)} 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      {image ? (
        <div className="relative w-full h-32 flex items-center justify-center">
            <img src={image} alt="Preview" className="max-h-full max-w-full object-contain rounded-md shadow-sm" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md pointer-events-none">
                <p className="text-white text-xs font-bold">Change Image</p>
            </div>
            <button 
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); setImage(null); }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md z-20 hover:bg-red-600 transition"
            >
                <X size={14} />
            </button>
        </div>
      ) : (
        <>
            <div className="bg-white p-3 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                <Upload size={24} className="text-indigo-500" />
            </div>
            <p className="text-xs text-slate-600 font-bold">{label}</p>
            <p className="text-[10px] text-slate-400 mt-1">Supports JPG, PNG (Max 5MB)</p>
        </>
      )}
    </div>
  );

  // Main Grid View
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
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-slate-200 text-left transition-all flex flex-col gap-4 group relative overflow-hidden"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tool.bg} group-hover:scale-110 transition-transform`}>
                {tool.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800">{tool.name}</h3>
                <p className="text-sm text-slate-500">{tool.desc}</p>
              </div>

               {/* Carbon Badge */}
               <div className="mt-2 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-[10px] font-bold border border-emerald-100">
                    <Leaf size={10} /> Saves ~{tool.saving}g CO₂
                </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Website Builder Tool
  if (activeTool === 'website') {
    return (
      <div className="p-4 md:p-8 animate-fade-in max-w-2xl mx-auto w-full">
        <button onClick={() => setActiveTool(null)} className="flex items-center gap-1 text-slate-500 mb-6 hover:text-slate-800 transition">
          <ChevronLeft size={20} /> Back to Studio
        </button>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
              <Layout className="text-blue-600" size={24} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800">Website Builder</h2>
                <p className="text-xs text-slate-500">Create your digital presence</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Business Name</label>
              <div className="relative">
                  <Briefcase className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    value={webBizName}
                    onChange={(e) => setWebBizName(e.target.value)}
                    placeholder="e.g. Urban Trends"
                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition"
                  />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Website Type</label>
              <select
                value={webType}
                onChange={(e) => setWebType(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition"
              >
                <option>E-commerce Store</option>
                <option>Corporate / Business</option>
                <option>Portfolio / Resume</option>
                <option>Blog / News</option>
                <option>Landing Page</option>
                <option>Restaurant / Cafe</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Services / Products</label>
              <textarea
                value={webServices}
                onChange={(e) => setWebServices(e.target.value)}
                placeholder="e.g. Men's clothing, accessories, winter collection..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none h-24 resize-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Visual Style</label>
              <div className="grid grid-cols-2 gap-3">
                  {['Modern', 'Classic', 'Vibrant', 'Minimalist'].map(style => (
                      <button 
                        key={style}
                        onClick={() => setWebStyle(style)}
                        className={`p-2 rounded-lg text-sm font-medium border transition ${webStyle === style ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-600'}`}
                      >
                          {style}
                      </button>
                  ))}
              </div>
            </div>

            <button
              onClick={handleWebsiteSubmit}
              disabled={!webBizName || !webServices}
              className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all hover:scale-[1.02]"
            >
              <Globe size={18} /> Generate Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Logo Creator Tool
  if (activeTool === 'logo') {
    return (
      <div className="p-4 md:p-8 animate-fade-in max-w-2xl mx-auto w-full">
        <button onClick={() => setActiveTool(null)} className="flex items-center gap-1 text-slate-500 mb-6 hover:text-slate-800 transition">
          <ChevronLeft size={20} /> Back to Studio
        </button>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shadow-sm">
              <PenTool className="text-indigo-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Logo Creator</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Business Name</label>
              <div className="relative">
                  <Briefcase className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    value={logoName}
                    onChange={(e) => setLogoName(e.target.value)}
                    placeholder="e.g. Royal Spices"
                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition"
                  />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Industry / Category</label>
              <input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Food & Beverage"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition"
              />
            </div>
            
            <ImageUploader image={logoImage} setImage={setLogoImage} label="Upload Inspiration / Sketch" />

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Visual Style</label>
                    <select
                        value={logoStyle}
                        onChange={(e) => setLogoStyle(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition"
                    >
                        <option>Minimalist</option>
                        <option>Vintage / Retro</option>
                        <option>Modern & Bold</option>
                        <option>Hand-drawn</option>
                        <option>Luxury</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Color Palette</label>
                    <select
                        value={logoColor}
                        onChange={(e) => setLogoColor(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition"
                    >
                        <option>Brand Colors</option>
                        <option>Black & White</option>
                        <option>Warm (Red/Orange)</option>
                        <option>Cool (Blue/Green)</option>
                        <option>Pastel</option>
                    </select>
                </div>
            </div>

            <button
              onClick={handleLogoSubmit}
              disabled={!logoName || !industry}
              className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02]"
            >
              <Palette size={18} /> Generate Design
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Visiting Card Tool
  if (activeTool === 'card') {
    return (
      <div className="p-4 md:p-8 animate-fade-in max-w-2xl mx-auto w-full">
        <button onClick={() => setActiveTool(null)} className="flex items-center gap-1 text-slate-500 mb-6 hover:text-slate-800 transition">
          <ChevronLeft size={20} /> Back to Studio
        </button>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shadow-sm">
              <UserSquare2 className="text-orange-600" size={24} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800">Visiting Card Maker</h2>
                <p className="text-xs text-slate-500">Design professional business cards</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Name on Card</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="e.g. Rajesh Kumar"
                            className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 outline-none transition"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Role / Designation</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input
                            value={cardRole}
                            onChange={(e) => setCardRole(e.target.value)}
                            placeholder="e.g. Proprietor"
                            className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 outline-none transition"
                        />
                    </div>
                </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Contact Details</label>
              <div className="relative">
                  <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    value={cardContact}
                    onChange={(e) => setCardContact(e.target.value)}
                    placeholder="Phone, Email, Address..."
                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 outline-none transition"
                  />
              </div>
            </div>

            <ImageUploader image={cardImage} setImage={setCardImage} label="Upload Business Logo" />

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Card Theme</label>
                <div className="grid grid-cols-3 gap-3">
                    {['Classic White', 'Modern Dark', 'Creative', 'Minimalist', 'Professional'].map(theme => (
                        <button 
                            key={theme}
                            onClick={() => setCardTheme(theme)}
                            className={`p-2 rounded-lg text-xs font-bold border transition ${cardTheme === theme ? 'bg-orange-50 border-orange-500 text-orange-700' : 'bg-white border-slate-200 text-slate-600'}`}
                        >
                            {theme}
                        </button>
                    ))}
                </div>
            </div>

            <button
              onClick={handleCardSubmit}
              disabled={!cardName || !cardContact}
              className="w-full py-3.5 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-orange-200 transition-all hover:scale-[1.02] mt-4"
            >
              <CheckCircle size={18} /> Generate Card
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Poster Tool
  if (activeTool === 'poster') {
    return (
      <div className="p-4 md:p-8 animate-fade-in max-w-2xl mx-auto w-full">
        <button onClick={() => setActiveTool(null)} className="flex items-center gap-1 text-slate-500 mb-6 hover:text-slate-800 transition">
          <ChevronLeft size={20} /> Back to Studio
        </button>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shadow-sm">
              <Image className="text-purple-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Flyer & Poster Designer</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Headline / Title</label>
              <div className="relative">
                  <Type className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    value={posterTitle}
                    onChange={(e) => setPosterTitle(e.target.value)}
                    placeholder="e.g. Grand Opening Sale!"
                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-500 outline-none transition"
                  />
              </div>
            </div>
            
            <ImageUploader image={posterImage} setImage={setPosterImage} label="Upload Main Image (Product/Shop)" />

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Details / Description</label>
              <textarea
                value={posterDesc}
                onChange={(e) => setPosterDesc(e.target.value)}
                placeholder="e.g. 50% Off on all items. Visit us this Sunday."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-500 outline-none h-24 resize-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Color Theme</label>
              <select
                value={posterTheme}
                onChange={(e) => setPosterTheme(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-500 outline-none transition"
              >
                <option>Vibrant (Red/Yellow)</option>
                <option>Cool (Blue/Green)</option>
                <option>Elegant (Black/Gold)</option>
                <option>Pastel (Soft colors)</option>
              </select>
            </div>

            <button
              onClick={handlePosterSubmit}
              disabled={!posterTitle}
              className="w-full py-3.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-200 transition-all hover:scale-[1.02]"
            >
              <Layers size={18} /> Create Poster
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Social Media Tool
  if (activeTool === 'social') {
    return (
      <div className="p-4 md:p-8 animate-fade-in max-w-2xl mx-auto w-full">
        <button onClick={() => setActiveTool(null)} className="flex items-center gap-1 text-slate-500 mb-6 hover:text-slate-800 transition">
          <ChevronLeft size={20} /> Back to Studio
        </button>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center shadow-sm">
              <Instagram className="text-pink-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Social Media Post</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Platform</label>
              <div className="flex gap-2">
                  {['Instagram', 'Facebook', 'WhatsApp', 'LinkedIn'].map(p => (
                      <button
                        key={p}
                        onClick={() => setSocialPlatform(p)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition ${socialPlatform === p ? 'bg-pink-50 border-pink-500 text-pink-700' : 'bg-white border-slate-200 text-slate-600'}`}
                      >
                          {p}
                      </button>
                  ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Caption / Content</label>
              <textarea
                value={socialContent}
                onChange={(e) => setSocialContent(e.target.value)}
                placeholder="e.g. New arrivals are here! Come visit our store."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-pink-500 outline-none h-24 resize-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Vibe / Style</label>
              <select
                value={socialVibe}
                onChange={(e) => setSocialVibe(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-pink-500 outline-none transition"
              >
                <option>Trendy</option>
                <option>Professional</option>
                <option>Festive</option>
                <option>Minimalist</option>
              </select>
            </div>

            <button
              onClick={handleSocialSubmit}
              disabled={!socialContent}
              className="w-full py-3.5 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-pink-200 transition-all hover:scale-[1.02]"
            >
              <Layers size={18} /> Generate Post
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Brand Kit Tool
  if (activeTool === 'brand') {
    return (
      <div className="p-4 md:p-8 animate-fade-in max-w-2xl mx-auto w-full">
        <button onClick={() => setActiveTool(null)} className="flex items-center gap-1 text-slate-500 mb-6 hover:text-slate-800 transition">
          <ChevronLeft size={20} /> Back to Studio
        </button>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center shadow-sm">
              <Briefcase className="text-teal-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Brand Kit Generator</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Business Name</label>
              <div className="relative">
                  <Briefcase className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Green Harvest"
                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-500 outline-none transition"
                  />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Core Values / Themes</label>
              <textarea
                value={brandValues}
                onChange={(e) => setBrandValues(e.target.value)}
                placeholder="e.g. Trust, Organic, Sustainability, Modern"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-500 outline-none h-24 resize-none transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Color Theme</label>
                    <select
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-500 outline-none transition"
                    >
                        <option>Trustworthy (Blue/Slate)</option>
                        <option>Eco/Nature (Green/Earth)</option>
                        <option>Luxury (Gold/Black)</option>
                        <option>Vibrant (Red/Yellow)</option>
                        <option>Minimal (Black/White)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Font Style</label>
                    <select
                        value={brandFont}
                        onChange={(e) => setBrandFont(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-500 outline-none transition"
                    >
                        <option>Modern Sans-Serif</option>
                        <option>Traditional Serif</option>
                        <option>Handwritten / Script</option>
                        <option>Bold / Display</option>
                    </select>
                </div>
            </div>
            
            <button
              onClick={handleBrandKitSubmit}
              disabled={!brandName}
              className="w-full py-3.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-teal-200 transition-all hover:scale-[1.02]"
            >
              <Palette size={18} /> Generate Brand Kit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DesignStudio;
