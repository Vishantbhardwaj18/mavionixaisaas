
import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, Mic, ArrowRight, CheckCircle, Globe, Leaf, ChevronLeft,
  Fingerprint, ShieldCheck, Mail, Scan, CreditCard,
  AlertTriangle, RefreshCw, Star, Zap, X, MessageSquare, MapPin, Loader2,
  Lock, KeyRound, Home, User
} from 'lucide-react';
import { UserProfile, Language, CarbonStats } from '../types';
import { calculateAuthCarbon, sendOTP, verifyOTP, createOrUpdateUser, getKnownUsers, findUser } from '../services/authService';
import { speakText, SpeechRecognizer } from '../services/audioService';
import { AUTH_PROMPTS, SUGGESTED_LOCATIONS } from '../constants';
import VoiceOrb from './VoiceOrb';
import CarbonTracker from './CarbonTracker';

interface Props {
  onLogin: (user: UserProfile, stats: CarbonStats) => void;
  onBack?: () => void; // Optional prop to go back to landing page
  initialLanguage?: Language;
}

type AuthStep = 'WELCOME' | 'LANDING' | 'INPUT_METHOD' | 'CAPTCHA' | 'OTP_VERIFY' | 'PIN_SETUP' | 'PIN_ENTRY' | 'BIOMETRIC_SCAN' | 'PROFILE_SETUP' | 'SUCCESS';
type AuthMode = 'LOGIN' | 'SIGNUP';
type InputMethod = 'MOBILE' | 'EMAIL' | 'AADHAAR';

const HEADER_LANG_LABELS: Record<Language, string> = {
    [Language.ENGLISH]: 'English',
    [Language.HINDI]: 'हिंदी',
    [Language.TAMIL]: 'தமிழ்',
    [Language.BENGALI]: 'বাংলা',
    [Language.TELUGU]: 'తెలుగు',
    [Language.MARATHI]: 'मराठी',
    [Language.GUJARATI]: 'ગુજરાતી',
    [Language.PUNJABI]: 'ਪੰਜਾਬੀ',
    [Language.KANNADA]: 'ಕನ್ನಡ',
    [Language.MALAYALAM]: 'മലയാളം',
    [Language.ODIA]: 'ଓଡ଼ିଆ',
    [Language.ASSAMESE]: 'অসমীয়া',
    [Language.URDU]: 'اردو',
    [Language.NEPALI]: 'नेपाली',
    [Language.SANSKRIT]: 'संस्कृतम्',
};

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

const AuthPanel: React.FC<Props> = ({ onLogin, onBack, initialLanguage = Language.ENGLISH }) => {
  // State
  const [step, setStep] = useState<AuthStep>('WELCOME');
  const [authMode, setAuthMode] = useState<AuthMode>('LOGIN');
  const [inputMethod, setInputMethod] = useState<InputMethod>('MOBILE');
  
  // Admin State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminSecret, setAdminSecret] = useState('');

  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [inputValue, setInputValue] = useState(''); // Mobile, Email, or Aadhaar
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [knownUsers, setKnownUsers] = useState<UserProfile[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // UI loading state
  const [error, setError] = useState('');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [biometricType, setBiometricType] = useState<'FINGERPRINT' | 'FACE'>('FINGERPRINT');
  
  // Face Detection State
  const [faceStatus, setFaceStatus] = useState<'SEARCHING' | 'FOUND' | 'MISSING'>('SEARCHING');
  
  // Security State
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [captchaChallenge, setCaptchaChallenge] = useState<{target: string, icon: any} | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  // Demo OTP Simulation State
  const [demoOtp, setDemoOtp] = useState<string | null>(null);

  // Profile Setup State
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [role, setRole] = useState<'owner' | 'staff' | 'admin'>('owner');
  const [consent, setConsent] = useState(false);

  // Carbon Tracking for Auth Session
  const [authCarbon, setAuthCarbon] = useState<CarbonStats>({ emission: 0, saved: 0, energy: 0 });

  const recognizerRef = useRef<SpeechRecognizer | null>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const faceIntervalRef = useRef<any>(null);

  // Helper to safely get prompt with fallback
  const getPrompt = (key: keyof typeof AUTH_PROMPTS[Language.ENGLISH]) => {
    const prompts = AUTH_PROMPTS[language] || AUTH_PROMPTS[Language.ENGLISH];
    return prompts[key] || AUTH_PROMPTS[Language.ENGLISH][key];
  };

  // Load known users on mount & listeners
  useEffect(() => {
    setKnownUsers(getKnownUsers());
    
    const handleOnline = () => { setIsOffline(false); setError(''); };
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Timer for OTP Resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Voice AI Response on Language Change
  useEffect(() => {
    const timer = setTimeout(() => {
        let textToSpeak = '';
        
        switch (step) {
            case 'WELCOME':
                // Speak greeting immediately on language selection
                textToSpeak = `${getPrompt('panelGreeting')}. ${getPrompt('panelSubtext')}`;
                break;
            case 'LANDING':
                textToSpeak = getPrompt('welcomeBack');
                break;
            case 'INPUT_METHOD':
                textToSpeak = authMode === 'LOGIN' ? getPrompt('initiateLogin') : getPrompt('initiateSignup');
                break;
            case 'OTP_VERIFY':
                textToSpeak = getPrompt('enterOTP');
                break;
            case 'PIN_ENTRY':
                textToSpeak = getPrompt('enterPin');
                break;
            case 'PIN_SETUP':
                textToSpeak = getPrompt('setupPin');
                break;
            case 'BIOMETRIC_SCAN':
                textToSpeak = getPrompt('biometric');
                break;
            case 'PROFILE_SETUP':
                textToSpeak = getPrompt('setupProfile');
                break;
            case 'CAPTCHA':
                textToSpeak = "Security Check. Please select the icon.";
                break;
            default:
                break;
        }

        if (textToSpeak) {
            speak(textToSpeak);
        }
    }, 500);

    return () => clearTimeout(timer);
  }, [language]);

  // Camera Logic for Face Biometric
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
        if (step === 'BIOMETRIC_SCAN' && biometricType === 'FACE') {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    // Start detection loop once video plays
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current?.play();
                        startFaceDetection();
                    };
                }
            } catch (err) {
                console.error("Camera denied", err);
                setError("Camera access required for Face Scan");
                setBiometricType('FINGERPRINT'); // Fallback
            }
        }
    };

    const startFaceDetection = () => {
        if (faceIntervalRef.current) clearInterval(faceIntervalRef.current);
        
        faceIntervalRef.current = setInterval(async () => {
            if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return;

            // Use experimental FaceDetector if available
            if ('FaceDetector' in window) {
                try {
                    // @ts-ignore
                    const detector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
                    const faces = await detector.detect(videoRef.current);
                    if (faces.length > 0) {
                        setFaceStatus('FOUND');
                        setError('');
                    } else {
                        setFaceStatus('MISSING');
                    }
                } catch (e) {
                    console.warn("FaceDetector failed", e);
                    // Fallback to brightness check if detector crashes
                    checkBrightness();
                }
            } else {
                // Fallback: Brightness/Motion check
                checkBrightness();
            }
        }, 500);
    };

    const checkBrightness = () => {
        if (!videoRef.current) return;
        
        // Simple brightness heuristic
        const canvas = document.createElement('canvas');
        canvas.width = 64; // Low res for speed
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, 64, 64);
            const frame = ctx.getImageData(0, 0, 64, 64);
            const data = frame.data;
            let colorSum = 0;
            
            for(let i = 0; i < data.length; i+=4) {
                const avg = (data[i] + data[i+1] + data[i+2]) / 3;
                colorSum += avg;
            }
            
            const brightness = Math.floor(colorSum / (64*64));
            // If it's not pitch black (camera covered) and has some light
            if (brightness > 20) {
                setFaceStatus('FOUND'); // Assume valid if light exists (soft fallback)
            } else {
                setFaceStatus('MISSING');
            }
        }
    };

    startCamera();

    return () => {
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
        }
        if (faceIntervalRef.current) clearInterval(faceIntervalRef.current);
    };
  }, [step, biometricType]);

  // Initialize Recognizer when language changes
  useEffect(() => {
    recognizerRef.current = new SpeechRecognizer(
      language,
      (text) => handleVoiceInput(text),
      () => setIsListening(false)
    );
  }, [language, step]);

  const speak = (text: string) => {
    speakText(text, language);
  };

  const trackCarbon = (duration: number, method: 'voice' | 'text' | 'biometric' | 'pin') => {
    const stats = calculateAuthCarbon(duration);
    stats.inputMethod = method;
    setAuthCarbon(prev => ({
      emission: prev.emission + stats.emission,
      saved: prev.saved + stats.saved,
      energy: prev.energy + stats.energy,
      inputMethod: method
    }));
    return stats;
  };

  const handleVoiceInput = (text: string) => {
    const cleanText = text.replace(/\D/g, ''); // Extract numbers
    const lower = text.toLowerCase();
    
    if (step === 'INPUT_METHOD') {
        if (inputMethod === 'MOBILE' && cleanText.length >= 10) {
            setInputValue(cleanText.slice(0, 10));
            setError('');
            speak(`${cleanText.slice(0, 10)}`);
        } else if (inputMethod === 'AADHAAR' && cleanText.length >= 12) {
            setInputValue(cleanText.slice(0, 12));
            setError('');
            speak(`${cleanText.slice(0, 12)}`);
        }
    } else if (step === 'OTP_VERIFY' || step === 'PIN_ENTRY' || step === 'PIN_SETUP') {
      const targetLen = step === 'OTP_VERIFY' ? 4 : 4;
      if (cleanText.length >= targetLen) {
        const val = cleanText.slice(0, targetLen);
        setError('');
        if (step === 'OTP_VERIFY') { setOtp(val); handleVerifyOTP(val); }
        if (step === 'PIN_ENTRY') { setPin(val); handleVerifyPin(val); }
        if (step === 'PIN_SETUP') { setPin(val); } 
      }
    } else if (step === 'WELCOME') {
       if (lower.includes('english')) setLanguage(Language.ENGLISH);
       else if (lower.includes('hindi') || lower.includes('हिंदी')) setLanguage(Language.HINDI);
       else if (lower.includes('tamil') || lower.includes('தமிழ்')) setLanguage(Language.TAMIL);
       else if (lower.includes('bengali') || lower.includes('বাংলা')) setLanguage(Language.BENGALI);
       else if (lower.includes('next') || lower.includes('continue') || lower.includes('start') || lower.includes('आगे')) handleWelcomeNext();
    } else if (step === 'PROFILE_SETUP') {
       if (lower.includes('owner')) setRole('owner');
       else if (lower.includes('staff')) setRole('staff');
       else if (lower.includes('yes')) setConsent(true);
       else if (!businessName) setBusinessName(text);
       else if (!location) setLocation(text);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognizerRef.current?.stop();
      setIsListening(false);
    } else {
      setError('');
      recognizerRef.current?.start();
      setIsListening(true);
    }
  };

  const initiateAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setStep('INPUT_METHOD');
    setInputValue('');
    setOtp('');
    setPin('');
    setAdminSecret('');
    setError('');
    
    if (isAdminMode) {
        setInputMethod('EMAIL');
    }

    const promptKey = mode === 'LOGIN' ? 'initiateLogin' : 'initiateSignup';
    speak(getPrompt(promptKey));
  };

  // --- LOCATION LOGIC ---
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocation(val);
    
    if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
    }

    if (val.length < 2) {
        setLocationSuggestions([]);
        return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
        try {
            // Use Open-Meteo Geocoding API for worldwide coverage
            const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(val)}&count=5&language=en&format=json`);
            const data = await response.json();
            
            if (data.results) {
                const cities = data.results.map((item: any) => {
                     const parts = [item.name, item.admin1, item.country].filter(Boolean);
                     return parts.join(', ');
                });
                setLocationSuggestions(Array.from(new Set(cities)) as string[]);
            } else {
                 const matches = SUGGESTED_LOCATIONS.filter(l => l.toLowerCase().includes(val.toLowerCase())).slice(0, 5);
                 setLocationSuggestions(matches);
            }
        } catch (error) {
             const matches = SUGGESTED_LOCATIONS.filter(l => l.toLowerCase().includes(val.toLowerCase())).slice(0, 5);
             setLocationSuggestions(matches);
        }
    }, 300); // Debounce
  };

  const selectLocation = (loc: string) => {
    setLocation(loc);
    setLocationSuggestions([]);
  };

  const handleAutoDetectLocation = () => {
    if (!navigator.geolocation) {
        setError("Geolocation not supported");
        return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`);
            const data = await res.json();
            const city = data.city || data.locality || data.principalSubdivision || "Unknown Location";
            const region = data.principalSubdivision || "";
            const fullLoc = region ? `${city}, ${region}` : city;
            setLocation(fullLoc);
            speak(`Detected location: ${fullLoc}`);
        } catch (e) {
            setLocation("Rural India (Detected)");
            speak("Location detected.");
        } finally {
            setIsLocating(false);
        }
    }, (err) => {
        console.error(err);
        setError("Unable to retrieve location");
        setIsLocating(false);
    });
  };

  // --- CAPTCHA LOGIC ---
  const generateCaptcha = () => {
      const items = [
          { target: 'Star', icon: <Star size={32} className="text-amber-500" /> },
          { target: 'Leaf', icon: <Leaf size={32} className="text-emerald-500" /> },
          { target: 'Heart', icon: <Zap size={32} className="text-red-500" /> },
          { target: 'Shield', icon: <ShieldCheck size={32} className="text-blue-500" /> },
      ];
      const target = items[Math.floor(Math.random() * items.length)];
      setCaptchaChallenge(target);
      setStep('CAPTCHA');
      const instruction = `Security Check. Please tap the ${target.target}.`;
      speak(instruction);
  };

  const handleCaptchaVerify = (itemTarget: string) => {
      if (captchaChallenge && itemTarget === captchaChallenge.target) {
          setCaptchaRequired(false);
          setStep('OTP_VERIFY');
          setError('');
          speak(getPrompt('verified'));
      } else {
          speak(getPrompt('invalidCode'));
          generateCaptcha(); // Regenerate on failure
      }
  };

  const handleInputSubmit = async () => {
    if (isOffline && authMode === 'LOGIN') {
        const user = findUser(inputValue);
        if (user && (user.hasPin || user.hasBiometric)) {
             if (user.isLocked) {
                 setError("Account Locked. Contact Admin.");
                 speak("Account locked.");
                 return;
             }
             if (user.hasPin) {
                 setStep('PIN_ENTRY');
                 speak(getPrompt('enterPin'));
                 return;
             }
             if (user.hasBiometric) {
                 setStep('BIOMETRIC_SCAN');
                 speak(getPrompt('biometric'));
                 return;
             }
        }
        setError("Network unavailable and no offline credentials found.");
        return;
    }

    if (inputMethod === 'MOBILE' && inputValue.length < 10) {
      setError("Enter valid 10-digit number");
      return;
    }

    if (inputMethod === 'EMAIL') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inputValue)) {
            setError("Enter a valid email address");
            return;
        }
    }
    
    setIsProcessing(true);
    const start = Date.now();
    try {
      const existingUser = findUser(inputValue);
      
      if (authMode === 'LOGIN') {
          if (!existingUser) {
            setError(getPrompt('notFound'));
            speak(getPrompt('notFound'));
            setIsProcessing(false);
            return;
          }
          
          if (existingUser.isLocked) {
              setError("Account Locked. Contact Support or Admin.");
              speak("Your account has been locked. Please contact support.");
              setIsProcessing(false);
              return;
          }
          
          // If trying to login as admin but user is not admin
          if (isAdminMode && existingUser.role !== 'admin') {
              setError("Access Denied: Not an Admin Account");
              speak("Access denied. Not an admin.");
              setIsProcessing(false);
              return;
          }

          if (existingUser.hasPin) {
              setIsProcessing(false);
              setStep('PIN_ENTRY');
              speak(getPrompt('enterPin'));
              return;
          }
      }

      if (authMode === 'SIGNUP' && existingUser) {
        setError(getPrompt('exists'));
        speak(getPrompt('exists'));
        setIsProcessing(false);
        return;
      }

      // Send OTP
      const code = await sendOTP(inputValue);
      setDemoOtp(code);
      
      trackCarbon(Date.now() - start, 'text');
      setStep('OTP_VERIFY');
      setResendTimer(60); 
      setOtp('');
      speak(getPrompt('enterOTP'));
      
      setTimeout(() => otpInputRef.current?.focus(), 100);

    } catch (e: any) {
      setError(e.message || "Failed to send OTP.");
      speak("Please wait before trying again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyOTP = async (otpValue: string = otp) => {
    if (isOffline) return;
    setIsProcessing(true);
    const start = Date.now();
    try {
      const result = await verifyOTP(inputValue, otpValue);
      trackCarbon(Date.now() - start, 'text');
      
      if (result.success) {
        setDemoOtp(null);
        if (authMode === 'LOGIN') {
           const user = findUser(inputValue);
           if (user) handleSuccess(user);
        } else {
           // Flow for New Users
           if (isAdminMode) {
               setRole('admin');
               setStep('PROFILE_SETUP'); 
               speak("Please enter admin key.");
           } else {
               // Normal user flow - skip previous ONBOARDING_INTRO as it's now WELCOME at start
               setStep('PROFILE_SETUP');
               speak(getPrompt('setupProfile'));
           }
        }
      } else {
        setOtp('');
        setError("Invalid OTP");
        if (result.requiresCaptcha) {
            setCaptchaRequired(true);
            generateCaptcha();
        } else {
            speak(getPrompt('invalidCode'));
        }
      }
    } catch (e) {
      setError("Verification failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isOffline) {
        setError("Network unavailable for Google Sign-In");
        return;
    }
    setIsProcessing(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1500));
    
    trackCarbon(1500, 'biometric'); // Assume 'biometric' as proxy for 1-click efficiency

    // Mock Google User
    const googleEmail = "demo.user@gmail.com";
    const existingUser = findUser(googleEmail);

    if (existingUser) {
        if (existingUser.isLocked) {
            setError("Account Locked");
            setIsProcessing(false);
            return;
        }
        handleSuccess(existingUser);
    } else {
        // New User Flow - Pre-fill
        setAuthMode('SIGNUP');
        setInputMethod('EMAIL');
        setInputValue(googleEmail);
        
        // Auto-fill profile setup details for better UX
        setBusinessName("Demo Business");
        setRole('owner');
        
        setStep('PROFILE_SETUP');
        speak(getPrompt('setupProfile'));
    }
    setIsProcessing(false);
  };

  const handleWelcomeNext = () => {
      setStep('LANDING');
      speak(getPrompt('welcome'));
  };

  const handleResendOTP = async () => {
      if (resendTimer > 0) return;
      setError('');
      setOtp('');
      setIsProcessing(true);
      try {
          const code = await sendOTP(inputValue);
          setDemoOtp(code);
          setResendTimer(60);
          speak(getPrompt('newCodeSent'));
      } catch (e: any) {
          setError(e.message);
      } finally {
          setIsProcessing(false);
      }
  };

  const handleVerifyPin = async (pinValue: string = pin) => {
    if (pinValue.length !== 4) return;
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 500));
    
    // Check against stored PIN (mock) or default '1234'
    const user = findUser(inputValue);
    const correctPin = user?.storedPin || '1234';

    if (pinValue === correctPin || pinValue === '1234') { 
        trackCarbon(500, 'pin');
        if (user) {
            if (user.isLocked) {
                setError("Account Locked");
                setPin('');
                setIsProcessing(false);
                return;
            }
            if (isAdminMode && user.role !== 'admin') {
                setError("Access Denied: Not an Admin Account");
                setPin('');
                setIsProcessing(false);
                return;
            }
            handleSuccess(user);
        }
    } else {
        setError("Invalid PIN");
        setPin('');
        setIsProcessing(false);
    }
  };

  const handleProfileComplete = () => {
    if (isAdminMode) {
        if (adminSecret !== 'ADMIN123') {
            setError("Invalid Admin Secret Key");
            return;
        }
    }
    // Added explicit validation check logic here to be safe, though button disabled handles UI
    if (!isAdminMode && businessName.length < 2) {
      setError("Business Name must be at least 2 characters.");
      return;
    }

    setStep('PIN_SETUP');
    setPin('');
    speak(getPrompt('setupPin'));
  };

  const handlePinSetupComplete = () => {
     if (pin.length !== 4) {
         setError("Enter 4 digits");
         return;
     }
     setStep('BIOMETRIC_SCAN');
     speak(getPrompt('biometric'));
  }

  const handleBiometricSetup = () => {
    if (biometricType === 'FACE' && faceStatus !== 'FOUND') {
        setError("Face Not Visible");
        speak("I cannot see your face. Please ensure you are visible in the camera.");
        return;
    }

    setIsProcessing(true);
    setTimeout(() => {
        const newUser: UserProfile = {
            id: Date.now().toString(),
            mobile: inputMethod === 'MOBILE' ? inputValue : undefined,
            email: inputMethod === 'EMAIL' ? inputValue : undefined,
            aadhaar: inputMethod === 'AADHAAR' ? inputValue : undefined,
            businessName: isAdminMode ? "System Admin" : (businessName || "New Business"),
            businessType: isAdminMode ? "Administration" : "Retail",
            location: location || "Rural India",
            language: language,
            role: isAdminMode ? 'admin' : role, // Ensure admin role is enforced
            lastLogin: Date.now(),
            consentGiven: Date.now(),
            hasBiometric: true,
            hasPin: true,
            storedPin: pin, // Store the pin setup by user
            isLocked: false
        };
        trackCarbon(1500, 'biometric');
        createOrUpdateUser(newUser);
        handleSuccess(newUser);
        setIsProcessing(false);
    }, 2000);
  };

  const handleSuccess = (user: UserProfile) => {
    setStep('SUCCESS');
    speak(getPrompt('success'));
    setTimeout(() => {
      onLogin(user, authCarbon);
    }, 1500);
  };

  const handleBiometricLogin = (user: UserProfile) => {
    setInputValue(user.mobile || user.email || user.aadhaar || ''); 
    setStep('BIOMETRIC_SCAN');
    speak(getPrompt('biometric'));
    
    // Auto-trigger handled by manual/effect logic below but wait for user to confirm if face
    // For automatic UX, we could trigger if face FOUND, but let's keep it manual/click for safety
  };

  const handleManualBiometricLogin = () => {
      if (biometricType === 'FACE' && faceStatus !== 'FOUND') {
          setError("Face Not Visible");
          speak("I cannot see your face. Please check lighting or camera position.");
          return;
      }

      const user = findUser(inputValue);
      if (user) {
          setIsProcessing(true);
          setTimeout(() => {
              trackCarbon(1000, 'biometric');
              createOrUpdateUser(user);
              handleSuccess(user);
              setIsProcessing(false);
          }, 2000);
      }
  };

  const selectUser = (user: UserProfile) => {
    setError(''); // Clear any previous errors when selecting a user
    if (user.isLocked) {
        setError(`User ${user.businessName} is locked.`);
        return;
    }
    // If selecting an admin user from history, force admin mode logic implicitly or explicitly
    const isUserAdmin = user.role === 'admin';
    
    if (isUserAdmin) {
        setIsAdminMode(true);
        setAuthMode('LOGIN');
    } else {
        setIsAdminMode(false);
        setAuthMode('LOGIN');
    }

    if (user.mobile) setInputMethod('MOBILE');
    else if (user.aadhaar) setInputMethod('AADHAAR');
    else setInputMethod('EMAIL');

    setInputValue(user.mobile || user.email || user.aadhaar || '');
    setLanguage(user.language);
    
    if (user.hasBiometric) {
        handleBiometricLogin(user);
    } else if (user.hasPin) {
        setStep('PIN_ENTRY');
        speak(getPrompt('enterPin'));
    } else {
        setStep('INPUT_METHOD');
        speak(getPrompt('enterMobile'));
    }
  };

  // Renderers
  return (
    <div className="min-h-screen bg-slate-50 flex items-stretch overflow-hidden font-sans">
      
      {/* Simulation Toast for OTP */}
      {demoOtp && step === 'OTP_VERIFY' && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] animate-fade-in-up w-[90%] max-w-sm">
             <div className="bg-slate-800/90 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-3">
                <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
                    <MessageSquare size={18} />
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Messages • Now</p>
                    <p className="text-sm font-medium mt-0.5">Your MaVionix verification code is <span className="font-bold text-emerald-400 text-lg">{demoOtp}</span></p>
                </div>
                <button onClick={() => setDemoOtp(null)} className="text-slate-500 hover:text-white ml-auto">
                    <X size={16} />
                </button>
             </div>
          </div>
      )}

      {/* Left Panel - Branding & Visuals (Desktop) */}
      <div className={`hidden lg:flex flex-col justify-between w-1/2 relative p-12 overflow-hidden text-white transition-colors duration-500 ${isAdminMode ? 'bg-slate-950' : 'bg-slate-900'}`}>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600 rounded-full blur-[100px] opacity-20 -ml-20 -mb-20"></div>
          
          <div className="z-10">
              <div className="flex items-center gap-3 mb-8">
                  {/* Home Button if coming from Website */}
                  {onBack && !isAdminMode && (
                      <button onClick={onBack} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition">
                          <Home size={20} />
                      </button>
                  )}
                  
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg ${isAdminMode ? 'bg-slate-800 text-white border border-slate-700' : 'bg-indigo-50'}`}>M</div>
                  <span className="text-2xl font-bold tracking-wide">MaVionix {isAdminMode && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded ml-2 align-middle">ADMIN</span>}</span>
              </div>
              <h1 className="text-5xl font-bold leading-tight mb-6">
                  {isAdminMode ? (
                      <>
                        Secure <span className="text-red-400">Admin</span> Portal <br/>Management System.
                      </>
                  ) : (
                      <>
                        Empowering <span className="text-indigo-400">Rural India</span> <br/>with Voice AI.
                      </>
                  )}
              </h1>
              <p className="text-lg text-slate-400 max-w-md">
                  {isAdminMode 
                    ? "Manage users, monitor carbon metrics, and oversee platform performance."
                    : "Manage invoices, access government schemes, and grow your business sustainably—using just your voice."
                  }
              </p>
          </div>

          <div className="z-10 grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <Globe className="mb-3 text-indigo-400" />
                  <div className="font-bold text-lg">Multilingual</div>
                  <p className="text-xs text-slate-400">15+ Indian Languages Supported</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <Leaf className="mb-3 text-emerald-400" />
                  <div className="font-bold text-lg">Eco-Friendly</div>
                  <p className="text-xs text-slate-400">Carbon tracking built-in</p>
              </div>
          </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 relative bg-white lg:bg-slate-50">
        
        {/* Mobile Branding & Back Button */}
        <div className="lg:hidden w-full flex justify-between items-start mb-8 absolute top-6 px-6">
             {onBack && (
                 <button onClick={onBack} className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200">
                     <Home size={20} />
                 </button>
             )}
        </div>

        <div className="lg:hidden mb-8 text-center animate-fade-in mt-12">
             <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center font-bold text-3xl text-white shadow-xl mb-4 ${isAdminMode ? 'bg-slate-900' : 'bg-indigo-600'}`}>M</div>
             <h2 className="text-2xl font-bold text-slate-800">MaVionix {isAdminMode && "Admin"}</h2>
             <p className="text-slate-500 text-sm">Voice AI OS</p>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-md bg-white rounded-3xl lg:shadow-xl lg:p-8 p-4 relative z-10 transition-all duration-300 border border-slate-100 lg:border-none">
           
           {/* Controls Header */}
           <div className="flex justify-between items-center mb-8 h-10">
               {step !== 'LANDING' && step !== 'SUCCESS' && step !== 'WELCOME' ? (
                   <button onClick={() => { setStep('LANDING'); setError(''); }} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition">
                       <ChevronLeft size={24} />
                   </button>
               ) : <div />}

               {step === 'LANDING' && !isAdminMode && (
                 <button 
                  onClick={() => { setIsAdminMode(true); setError(''); }}
                  className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 px-2 py-1 rounded transition uppercase tracking-wider"
                 >
                   Admin Portal
                 </button>
               )}
               
               {step === 'LANDING' && isAdminMode && (
                 <button 
                  onClick={() => { setIsAdminMode(false); setError(''); }}
                  className="text-[10px] font-bold text-red-500 hover:text-red-700 bg-red-50 px-2 py-1 rounded transition uppercase tracking-wider flex items-center gap-1"
                 >
                   <X size={10} /> Exit Admin
                 </button>
               )}

               {step !== 'WELCOME' && (
                 <div className="relative group">
                    <button className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-200 transition">
                        <Globe size={14} />
                        {HEADER_LANG_LABELS[language]}
                    </button>
                    <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    >
                        {LANGUAGE_OPTIONS.map(opt => (
                            <option key={opt.val} value={opt.val}>{opt.label}</option>
                        ))}
                    </select>
                 </div>
               )}
           </div>

           {/* STEP: WELCOME SCREEN (New Initial Step) */}
           {step === 'WELCOME' && (
               <div className="space-y-8 animate-fade-in text-center relative max-w-sm mx-auto">
                   {/* Logo/Icon */}
                   <div className="flex justify-center mb-6">
                       <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-200 text-white font-bold text-4xl">
                           M
                       </div>
                   </div>

                   <div>
                       <h2 className="text-3xl font-bold text-slate-800">{getPrompt('panelGreeting')}</h2>
                       <p className="text-slate-500 mt-3 text-lg leading-relaxed">{getPrompt('panelSubtext')}</p>
                   </div>

                   {/* Carbon Badge */}
                   <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl text-emerald-800 text-left relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-100 rounded-full -mr-8 -mt-8 opacity-50 group-hover:scale-150 transition-transform"></div>
                       <div className="flex items-center gap-2 font-bold mb-2 text-emerald-700">
                           <Leaf size={18} fill="currentColor" /> Carbon Tracking Active
                       </div>
                       <p className="text-sm opacity-90 leading-relaxed">
                           Every action you take digitally saves carbon compared to physical work. I will track your impact automatically.
                       </p>
                   </div>

                   {/* Language Selection */}
                   <div>
                       <p className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Select your Language</p>
                       <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 h-48 overflow-y-auto custom-scrollbar pr-1">
                           {LANGUAGE_OPTIONS.map(lang => (
                               <button 
                                key={lang.val}
                                onClick={() => setLanguage(lang.val)}
                                className={`py-3 px-2 rounded-xl border transition-all text-xs font-bold shadow-sm ${language === lang.val ? 'border-indigo-500 bg-indigo-600 text-white scale-105' : 'border-slate-100 bg-white text-slate-600 hover:border-indigo-200 hover:bg-slate-50'}`}
                               >
                                   {lang.label}
                               </button>
                           ))}
                       </div>
                   </div>

                   {/* Voice Orb */}
                   <div className="flex justify-center items-center gap-4 py-2">
                        <div className="h-[1px] bg-slate-200 flex-1"></div>
                        <VoiceOrb isListening={isListening} isProcessing={isProcessing} onClick={toggleListening} />
                        <div className="h-[1px] bg-slate-200 flex-1"></div>
                   </div>

                   <button 
                        onClick={handleWelcomeNext}
                        className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl text-lg hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
                    >
                        {getPrompt('getStartedBtn')} <ArrowRight size={20} />
                    </button>
               </div>
           )}

           {/* STEP: LANDING */}
           {step === 'LANDING' && (
               <div className="space-y-6 animate-fade-in">
                   {isAdminMode && (
                        <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center gap-3 mb-4 shadow-lg shadow-slate-900/20">
                            <ShieldCheck size={24} className="text-emerald-400" />
                            <div className="text-sm">
                                <p className="font-bold">{getPrompt('adminArea')}</p>
                                <p className="text-slate-400 text-xs">Authorized personnel only.</p>
                            </div>
                        </div>
                   )}

                   {knownUsers.length > 0 && !isAdminMode ? (
                       <div className="space-y-4">
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{getPrompt('recentLogins')}</p>
                           {knownUsers.slice(0, 3).map(u => (
                               <button 
                                 key={u.id}
                                 onClick={() => selectUser(u)}
                                 className={`w-full flex items-center p-3 bg-slate-50 border border-slate-200 rounded-2xl hover:border-indigo-400 hover:shadow-md transition-all group text-left ${u.isLocked ? 'opacity-50' : ''}`}
                               >
                                   <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mr-4 transition ${u.role === 'admin' ? 'bg-slate-800 text-white' : 'bg-indigo-100 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                                       {u.isLocked ? <Lock size={16} /> : u.businessName[0]}
                                   </div>
                                   <div className="flex-1">
                                       <div className="font-bold text-slate-800 group-hover:text-indigo-700 flex items-center gap-2">
                                           {u.businessName}
                                           {u.isLocked && <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded border border-red-200">LOCKED</span>}
                                       </div>
                                       <div className="text-xs text-slate-500">{u.mobile || u.email}</div>
                                   </div>
                                   {u.hasBiometric && !u.isLocked && <Fingerprint size={20} className="text-emerald-500" />}
                               </button>
                           ))}
                           <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-slate-200"></div>
                                <span className="flex-shrink-0 mx-4 text-slate-400 text-xs">OR</span>
                                <div className="flex-grow border-t border-slate-200"></div>
                           </div>
                       </div>
                   ) : (
                       <div className="text-center py-6">
                           <h3 className="text-xl font-bold text-slate-800 mb-2">{getPrompt('welcomeBack')}</h3>
                           <p className="text-slate-500 text-sm">
                               {isAdminMode ? "Please authenticate to access controls." : "Sign in to manage your business."}
                           </p>
                       </div>
                   )}

                   <div className="space-y-3">
                       <button 
                        onClick={() => initiateAuth('LOGIN')}
                        className={`w-full py-4 text-white rounded-2xl font-bold text-lg transition shadow-lg flex items-center justify-center gap-2 ${isAdminMode ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'}`}
                       >
                           {getPrompt('signIn')}
                       </button>
                       <button 
                        onClick={() => initiateAuth('SIGNUP')}
                        className="w-full py-4 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-50 transition"
                       >
                           {getPrompt('createAccount')}
                       </button>
                   </div>
               </div>
           )}

           {/* STEP: INPUT METHOD */}
           {step === 'INPUT_METHOD' && (
            <div className="space-y-6 animate-fade-in text-center">
              <h2 className="text-2xl font-bold text-slate-800">
                {authMode === 'LOGIN' ? getPrompt('welcomeBack') : getPrompt('getStartedBtn')}
              </h2>
              
              {/* Tabs */}
              <div className="flex p-1 bg-slate-100 rounded-xl">
                 {(['MOBILE', 'EMAIL', 'AADHAAR'] as InputMethod[]).map(m => (
                     <button 
                        key={m}
                        onClick={() => { setInputMethod(m); setError(''); }}
                        className={`flex-1 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all ${inputMethod === m ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                     >
                        {m === 'MOBILE' ? 'Mobile' : m === 'EMAIL' ? 'Email' : 'Aadhaar'}
                     </button>
                 ))}
              </div>

              <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     {inputMethod === 'MOBILE' && <Phone className="text-slate-400 group-focus-within:text-indigo-500" size={20} />}
                     {inputMethod === 'EMAIL' && <Mail className="text-slate-400 group-focus-within:text-indigo-500" size={20} />}
                     {inputMethod === 'AADHAAR' && <CreditCard className="text-slate-400 group-focus-within:text-indigo-500" size={20} />}
                  </div>
                  <input 
                    type={inputMethod === 'EMAIL' ? 'email' : 'tel'}
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setError('');
                    }}
                    placeholder={
                        inputMethod === 'MOBILE' ? "9876543210" : 
                        inputMethod === 'EMAIL' ? "name@example.com" : "1234 5678 9012"
                    }
                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none font-bold text-slate-800 transition-all ${inputMethod === 'EMAIL' ? 'text-lg' : 'text-xl tracking-widest'}`}
                    maxLength={inputMethod === 'MOBILE' ? 10 : inputMethod === 'AADHAAR' ? 12 : 50}
                    autoFocus
                  />
              </div>

              <div className="flex gap-4">
                  <button onClick={toggleListening} className={`p-4 rounded-2xl border-2 transition-all ${isListening ? 'border-rose-500 bg-rose-50 text-rose-500 animate-pulse' : 'border-slate-100 text-slate-400 hover:border-slate-300'}`}>
                      <Mic size={24} />
                  </button>
                  <button 
                    onClick={handleInputSubmit}
                    disabled={!inputValue || isProcessing}
                    className="flex-1 bg-indigo-600 text-white font-bold rounded-2xl text-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:hover:bg-indigo-600 flex items-center justify-center gap-2"
                  >
                     {isProcessing ? <RefreshCw className="animate-spin" /> : <ArrowRight />}
                     {isProcessing ? 'Checking...' : 'Next'}
                  </button>
              </div>

              {!isAdminMode && (
                  <>
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-400 text-xs">Or continue with</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={isProcessing}
                        className="w-full py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-3 shadow-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>
                  </>
              )}
            </div>
           )}

           {/* STEP: CAPTCHA */}
           {step === 'CAPTCHA' && captchaChallenge && (
               <div className="space-y-6 animate-fade-in text-center">
                   <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-left">
                       <AlertTriangle className="flex-shrink-0" />
                       <div className="text-sm">
                           <p className="font-bold">Security Check</p>
                           <p>Multiple failed attempts detected.</p>
                       </div>
                   </div>
                   
                   <h3 className="text-xl font-bold text-slate-800">Tap the <span className="text-indigo-600">{captchaChallenge.target}</span></h3>
                   
                   <div className="grid grid-cols-2 gap-4">
                       {[
                          { target: 'Star', icon: <Star size={32} className="text-amber-500" /> },
                          { target: 'Leaf', icon: <Leaf size={32} className="text-emerald-500" /> },
                          { target: 'Heart', icon: <Zap size={32} className="text-red-500" /> },
                          { target: 'Shield', icon: <ShieldCheck size={32} className="text-blue-500" /> },
                        ].sort(() => Math.random() - 0.5).map((item, idx) => (
                           <button 
                              key={idx}
                              onClick={() => handleCaptchaVerify(item.target)}
                              className="bg-slate-50 border-2 border-slate-100 hover:border-indigo-500 p-6 rounded-2xl flex items-center justify-center transition-all hover:shadow-md"
                           >
                               {item.icon}
                           </button>
                       ))}
                   </div>
               </div>
           )}

           {/* STEP: OTP VERIFY */}
           {step === 'OTP_VERIFY' && (
             <div className="space-y-8 animate-fade-in text-center">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-800">Verification</h2>
                    <p className="text-slate-500 mt-1">Enter the 4-digit code sent to <br/><span className="font-bold text-slate-800">{inputValue}</span></p>
                 </div>

                 <div className="relative w-full max-w-[280px] mx-auto h-16 group">
                    <input 
                        ref={otpInputRef}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 font-bold tracking-[2em] text-center"
                        value={otp}
                        onChange={e => {
                            const val = e.target.value.replace(/\D/g,'').slice(0,4);
                            setOtp(val);
                            setError('');
                            if(val.length === 4) handleVerifyOTP(val);
                        }}
                        autoFocus
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        type="tel"
                    />
                    
                    <div className="absolute inset-0 flex justify-between gap-3 pointer-events-none z-10">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div 
                                key={i} 
                                className={`flex-1 h-full rounded-xl border-2 flex items-center justify-center text-3xl font-bold transition-all bg-white
                                ${otp[i] 
                                    ? 'border-indigo-500 text-indigo-600 shadow-sm' 
                                    : i === otp.length 
                                        ? 'border-indigo-400 ring-4 ring-indigo-50/50' 
                                        : 'border-slate-200 text-slate-300'
                                }`}
                            >
                                {otp[i] || ''}
                            </div>
                        ))}
                    </div>
                 </div>

                 <div className="flex gap-4 relative z-30">
                    <button onClick={toggleListening} className={`p-4 rounded-2xl border-2 transition-all ${isListening ? 'border-rose-500 bg-rose-50 text-rose-500 animate-pulse' : 'border-slate-100 text-slate-400 hover:border-slate-300'}`}>
                        <Mic size={24} />
                    </button>
                    <button 
                        onClick={() => handleVerifyOTP()}
                        disabled={otp.length < 4 || isProcessing}
                        className="flex-1 bg-indigo-600 text-white font-bold rounded-2xl text-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                    >
                        {isProcessing ? <RefreshCw className="animate-spin" /> : <CheckCircle />}
                        Verify
                    </button>
                 </div>

                 <button 
                    onClick={handleResendOTP}
                    disabled={resendTimer > 0 || isProcessing}
                    className="text-sm font-bold text-slate-500 disabled:opacity-50 hover:text-indigo-600 transition relative z-30"
                 >
                    {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend Code"}
                 </button>
             </div>
           )}

           {/* STEP: BIOMETRIC SCAN */}
           {step === 'BIOMETRIC_SCAN' && (
             <div className="text-center space-y-8 py-4 animate-fade-in">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-800">Biometric Access</h2>
                    <p className="text-slate-500 mt-1">Secure login via device sensor</p>
                 </div>

                 <div 
                    className="relative w-40 h-40 mx-auto cursor-pointer group rounded-full overflow-hidden" 
                    onClick={authMode === 'SIGNUP' ? handleBiometricSetup : handleManualBiometricLogin}
                 >
                    {/* Ring Animations */}
                    <div className={`absolute inset-0 rounded-full transition-all duration-500 ${faceStatus === 'FOUND' ? 'bg-emerald-50' : faceStatus === 'MISSING' ? 'bg-red-50' : 'bg-indigo-50'} scale-90 group-hover:scale-100`}></div>
                    <div className={`absolute inset-0 border-4 rounded-full scale-100 group-hover:scale-110 transition-transform duration-700 pointer-events-none ${faceStatus === 'FOUND' ? 'border-emerald-200' : faceStatus === 'MISSING' ? 'border-red-200' : 'border-indigo-100'}`}></div>
                    
                    {/* Camera Feed for Face */}
                    {biometricType === 'FACE' && (
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            muted 
                            className="absolute inset-0 w-full h-full object-cover rounded-full transform scale-x-[-1] z-10" 
                        />
                    )}

                    {/* Scanner Overlay for Face */}
                    {biometricType === 'FACE' && !isProcessing && (
                        <div className="absolute inset-0 z-20 rounded-full overflow-hidden pointer-events-none">
                            <div className={`w-full h-1 shadow-[0_0_15px_rgba(52,211,153,0.8)] absolute top-0 animate-scan ${faceStatus === 'FOUND' ? 'bg-emerald-400/80' : faceStatus === 'MISSING' ? 'bg-red-400/80 shadow-[0_0_15px_rgba(248,113,113,0.8)]' : 'bg-indigo-400/80'}`}></div>
                        </div>
                    )}

                    {/* Face Detection Frame */}
                    {biometricType === 'FACE' && (
                        <div className={`absolute inset-0 z-30 pointer-events-none flex items-center justify-center opacity-70 transition-colors ${faceStatus === 'FOUND' ? 'text-emerald-500' : faceStatus === 'MISSING' ? 'text-red-500' : 'text-white'}`}>
                            <Scan size={100} strokeWidth={1} />
                        </div>
                    )}

                    {/* Icon Fallback for Fingerprint */}
                    {biometricType === 'FINGERPRINT' && (
                        <div className="absolute inset-0 flex items-center justify-center text-indigo-500 z-10">
                            <Fingerprint size={64} />
                        </div>
                    )}
                    
                    {/* Processing Spinner */}
                    {isProcessing && (
                        <div className="absolute inset-0 border-t-4 border-indigo-600 rounded-full animate-spin z-30"></div>
                    )}
                 </div>

                 {/* Status Feedback */}
                 {biometricType === 'FACE' && (
                     <div className={`text-sm font-bold animate-pulse ${faceStatus === 'FOUND' ? 'text-emerald-600' : faceStatus === 'MISSING' ? 'text-red-600' : 'text-slate-500'}`}>
                         {faceStatus === 'FOUND' ? 'Face Detected. Tap to Scan' : faceStatus === 'MISSING' ? 'Face Not Visible' : 'Looking for face...'}
                     </div>
                 )}

                 <div className="flex justify-center gap-4">
                    <button onClick={() => setBiometricType('FINGERPRINT')} className={`p-2 rounded-xl transition ${biometricType === 'FINGERPRINT' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400'}`}>
                        <Fingerprint size={24} />
                    </button>
                    <button onClick={() => setBiometricType('FACE')} className={`p-2 rounded-xl transition ${biometricType === 'FACE' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400'}`}>
                        <Scan size={24} />
                    </button>
                 </div>
             </div>
           )}

            {/* Error Message */}
            {error && (
                <div className="absolute bottom-4 left-4 right-4 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 animate-shake flex items-center gap-3 shadow-lg z-50">
                    <AlertTriangle size={18} />
                    {error}
                </div>
            )}
           
           {/* Profile Setup, Pin Setup, Pin Entry */}
           {(step === 'PROFILE_SETUP' || step === 'PIN_SETUP' || step === 'PIN_ENTRY') && (
               <div className="space-y-6 animate-fade-in text-center">
                   <h2 className="text-2xl font-bold text-slate-800">
                       {step === 'PIN_ENTRY' ? 'Enter PIN' : step === 'PIN_SETUP' ? 'Create PIN' : 'Business Profile'}
                   </h2>
                   
                   {step !== 'PROFILE_SETUP' ? (
                       <input 
                        type="password"
                        value={pin}
                        onChange={(e) => { 
                            setPin(e.target.value); 
                            setError('');
                            if(e.target.value.length === 4 && step === 'PIN_ENTRY') handleVerifyPin(e.target.value); 
                        }}
                        placeholder="••••"
                        className="w-full text-center text-4xl font-bold tracking-[1em] text-slate-800 py-4 bg-transparent border-b-2 border-slate-200 focus:border-indigo-500 outline-none"
                        maxLength={4}
                        autoFocus
                        inputMode="numeric"
                       />
                   ) : (
                       <div className="space-y-4 text-left">
                           {isAdminMode ? (
                               // Admin Specific Fields
                               <div className="space-y-3">
                                   <div className="bg-slate-100 p-3 rounded-lg text-sm text-slate-600 mb-2">
                                       Setup your admin account. <br/>A Secret Key is required.
                                   </div>
                                   <label className="text-xs font-bold text-slate-500 uppercase ml-1">Admin Secret Key</label>
                                   <div className="relative">
                                       <KeyRound className="absolute left-3 top-3 text-slate-400" size={18} />
                                       <input 
                                        type="password"
                                        value={adminSecret} 
                                        onChange={e => {
                                            setAdminSecret(e.target.value);
                                            setError('');
                                        }} 
                                        className="w-full pl-10 pr-3 py-3 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-red-500 outline-none font-medium"
                                        placeholder="Enter key..."
                                       />
                                   </div>
                                   <p className="text-[10px] text-slate-400 ml-1">Hint: ADMIN123</p>
                                   <div className="pt-2">
                                       <div className="flex gap-2 items-center">
                                           <div className="w-4 h-4 rounded border-2 border-slate-300 bg-indigo-600 border-indigo-600 flex items-center justify-center">
                                               <CheckCircle size={10} className="text-white" />
                                           </div>
                                           <span className="text-xs font-bold text-slate-700">Role: System Administrator</span>
                                       </div>
                                   </div>
                               </div>
                           ) : (
                               // Regular User Fields
                               <>
                                   <div className="space-y-1">
                                       <label className="text-xs font-bold text-slate-500 uppercase ml-1">Business Name</label>
                                       <input 
                                        value={businessName} 
                                        onChange={e => setBusinessName(e.target.value)} 
                                        className={`w-full p-4 bg-slate-50 rounded-2xl border-2 focus:border-indigo-500 outline-none font-medium transition ${businessName.length > 0 && businessName.length < 2 ? 'border-red-300' : 'border-slate-100'}`}
                                        placeholder="e.g. Kisan Mart"
                                       />
                                       {businessName.length > 0 && businessName.length < 2 && (
                                           <p className="text-[10px] text-red-500 ml-1 mt-1">Must be at least 2 characters</p>
                                       )}
                                   </div>
                                   <div className="space-y-1 relative">
                                       <label className="text-xs font-bold text-slate-500 uppercase ml-1">Location</label>
                                       <div className="relative">
                                            <input 
                                                value={location} 
                                                onChange={handleLocationChange} 
                                                className="w-full p-4 pr-12 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none font-medium"
                                                placeholder="City, State"
                                                autoComplete="off"
                                            />
                                            <button 
                                                onClick={handleAutoDetectLocation}
                                                disabled={isLocating}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-indigo-600 p-1.5 hover:bg-indigo-50 rounded-lg transition"
                                                title="Detect Location"
                                            >
                                                {isLocating ? <Loader2 size={20} className="animate-spin text-indigo-500"/> : <MapPin size={20} />}
                                            </button>
                                       </div>
                                       
                                       {locationSuggestions.length > 0 && (
                                           <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-40 overflow-y-auto">
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
                                   </div>
                                   <div className="flex gap-3">
                                       <button onClick={() => setRole('owner')} className={`flex-1 p-3 rounded-xl border-2 transition text-center ${role === 'owner' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-100'}`}>Owner</button>
                                       <button onClick={() => setRole('staff')} className={`flex-1 p-3 rounded-xl border-2 transition text-center ${role === 'staff' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-100'}`}>Staff</button>
                                   </div>
                                   <div onClick={() => setConsent(!consent)} className="flex items-center gap-3 p-3 cursor-pointer">
                                       <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${consent ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'}`}>
                                           {consent && <CheckCircle size={14} />}
                                       </div>
                                       <span className="text-sm text-slate-600">I agree to Terms & Conditions</span>
                                   </div>
                               </>
                           )}
                       </div>
                   )}

                   <button 
                     onClick={step === 'PIN_SETUP' ? handlePinSetupComplete : step === 'PROFILE_SETUP' ? handleProfileComplete : undefined}
                     disabled={(step === 'PIN_SETUP' && pin.length < 4) || (step === 'PROFILE_SETUP' && (isAdminMode ? !adminSecret : (businessName.length < 2 || !location || !consent)))}
                     className={`w-full py-4 text-white font-bold rounded-2xl text-lg hover:bg-indigo-700 transition disabled:opacity-50 ${step === 'PIN_ENTRY' ? 'hidden' : ''} ${isAdminMode ? 'bg-slate-900' : 'bg-indigo-600'}`}
                   >
                       Continue
                   </button>
               </div>
           )}

        </div>
        
        <div className="mt-8">
            <CarbonTracker stats={authCarbon} compact={true} />
        </div>

      </div>
    </div>
  );
};

export default AuthPanel;
