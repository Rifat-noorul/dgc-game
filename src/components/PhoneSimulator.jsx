import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Lock, Shield, AlertTriangle, CheckCircle, RefreshCw, Smartphone, 
  Search, ShieldAlert, CreditCard, Volume2, VolumeX, Eye, EyeOff, Globe, Phone, PhoneOff, Mic, MicOff, Layers, Download, Check, AlertOctagon,
  Image as GalleryIcon, MessageSquare, ShieldCheck, FileText, X, Home, Info, User, Users, ClipboardList, ChevronUp, ChevronDown,
  Pause, Grid, UserPlus, CircleDot, Disc, PhoneForwarded
} from 'lucide-react';
import { playSound } from '../audio/soundEngine';
import { getTranslation } from '../localization/translations';
import { phoneAppsData } from '../data/phoneData';

export default function PhoneSimulator({ characterKey, onMissionResult, soundMuted, currentLanguage, onBackToOverworld }) {

  const t = (key, params) => getTranslation(currentLanguage, key, params);

  const missionData = phoneAppsData[characterKey] || phoneAppsData.mother;

  // Active App on Home Screen (null = Home Screen App Grid)
  const [activeApp, setActiveApp] = useState(null);
  const [selectedMessageThread, setSelectedMessageThread] = useState(null);

  // Top Dropdown Notification Banner state
  const [notificationVisible, setNotificationVisible] = useState(true);

  // Active Gallery photo preview state
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Investigation Notepad & Evidence Checklist State
  const [unlockedClues, setUnlockedClues] = useState([]);
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);

  // Final Verdict Decision Modal & Mission Result State
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [missionResult, setMissionResult] = useState(null);

  // Mission Threat Prompts and Final Verdict Decision Options
  const missionThreatDefs = {
    sibling: {
      prompt: "How will you handle the missing hostel fees?",
      optionA: "Install the Loan APK & Grant Permissions",
      optionB: "Delete the APK & Report to Warden",
      scamType: "Predatory Instant Loan App Trap",
      cookedDetails: "The illegal loan APK silently exfiltrated your entire contact list and gallery! Scammers sent manipulated photos to your hostel group, demanding ₹25,000 ransom and draining the Vault.",
      avertedDetails: "You uninstalled the unauthorized APK and notified the Hostel Warden. The scammer network failed to siphon funds or compromise your personal contacts!"
    },
    mother: {
      prompt: "How will you handle the mixer warranty replacement request?",
      optionA: "Click the Sponsored Link & Pay ₹50 Fee",
      optionB: "Close the Browser Tab & Reject Payment Link",
      scamType: "Fake E-Commerce & AutoPay Mandate Trap",
      cookedDetails: "The fake link disguised a hidden recurring AutoPay UPI mandate! ₹15,000 was immediately siphoned from the family bank account.",
      avertedDetails: "You spotted the suspicious third-party URL domain and safely closed the browser. The family savings remain completely intact!"
    },
    father: {
      prompt: "A frantic stranger asks you to dial *401* on your phone. What do you do?",
      optionA: "Dial *401* to help the stranger in emergency",
      optionB: "Refuse the request & report SIM call-forwarding attempt",
      scamType: "*401* Unconditional Call Forwarding Scam",
      cookedDetails: "Dialing *401* activated unconditional call forwarding! Scammers intercepted your banking OTPs via call audio and drained ₹45,000 from your tea stall savings.",
      avertedDetails: "You recognized the *401* USSD code carrier warning and refused the request. Your phone calls and banking OTPs stay secure!"
    },
    protagonist: {
      prompt: "A SMS alerts you that your debit card is blocked. How do you respond?",
      optionA: "Enter Card CVV & OTP on the SMS Link",
      optionB: "Ignore the SMS & Verify in Official Bank App",
      scamType: "Phishing SMS & Card Verification Fraud",
      cookedDetails: "Entering your CVV and OTP authorized an instant international ecommerce transaction! ₹30,000 was stolen from your debit card.",
      avertedDetails: "You checked the official banking app directly, proving the SMS was a fraudulent phishing attempt. Zero money lost!"
    },
    father_arrest: {
      prompt: "A caller claiming to be a CBI Inspector threatens digital arrest via video call. What do you do?",
      optionA: "Transfer ₹45,000 to the 'CBI Safety Vault'",
      optionB: "Disconnect Call & Report Fake Warrant to Cyber Crime Police (1930)",
      scamType: "Digital Arrest & Fake Law Enforcement Coercion",
      cookedDetails: "Panicked by the forged warrant, you transferred money to a scammer bank account! The impostors disappeared with ₹45,000.",
      avertedDetails: "You verified the fake official stamp and email domain on the PDF and hung up. Cyber crime authorities were notified!"
    },
    sibling_task: {
      prompt: "A Telegram recruiter offers high daily returns for rating videos if you deposit ₹5,000. What is your choice?",
      optionA: "Pay ₹5,000 Deposit to Unlock Daily Earnings",
      optionB: "Block Recruiter & Report Job Scam to Placement Cell",
      scamType: "Telegram Part-Time Task & Deposit Fraud",
      cookedDetails: "After sending the initial ₹5,000 deposit, the Telegram group demanded ₹20,000 more for 'withdrawal unlocking'. Your money is gone!",
      avertedDetails: "You identified the classic task-scam escalation model and blocked the handle. College placement advisory was updated!"
    },
    mother_blackout: {
      prompt: "SMS threatens electricity disconnection at 9 PM unless you download the utility update APK. What do you do?",
      optionA: "Download Utility Update APK & Pay Dues",
      optionB: "Ignore Scam Link & Check Official Utility App",
      scamType: "Electricity Power Disconnection SMS Scam",
      cookedDetails: "The malicious APK injected remote access tools onto the phone, stealing net banking credentials and wiping account funds!",
      avertedDetails: "You cross-checked actual electricity dues on the official utility portal and confirmed ₹0 pending balance. Scam foiled!"
    },
    protagonist_qr: {
      prompt: "An OLX buyer sends a QR code claiming you must enter your UPI PIN to RECEIVE advance payment. What do you do?",
      optionA: "Scan QR Code & Enter UPI PIN to Receive Money",
      optionB: "Decline QR Scan & Remind Buyer PIN is Only to Send Money",
      scamType: "Reverse UPI QR Code Fraud",
      cookedDetails: "Entering your UPI PIN authorized a debit transaction instead of a credit! ₹3,000 was instantly deducted from your balance.",
      avertedDetails: "You remembered the golden rule of UPI: 'PIN is ONLY to send money!'. You refused to enter your PIN and saved your cash!"
    }
  };

  const currentThreat = missionThreatDefs[characterKey] || missionThreatDefs.sibling;

  // Dynamic Clock State
  const [currentTime, setCurrentTime] = useState('20:43');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hrs = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hrs}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Case Evidence Clue Definitions
  const caseClueDefs = {
    mother: [
      { id: 'opened_gallery', label: 'Verify old mixer warranty card in Gallery' },
      { id: 'inspected_url', label: 'Inspect sponsored store domain URL' }
    ],
    sibling: [
      { id: 'checked_permissions', label: 'Review requested SMS & Contact permissions' },
      { id: 'checked_chat', label: 'Read hostel boys group chat warnings' }
    ],
    father: [
      { id: 'read_carrier_warning', label: 'Read Carrier Advisory on *401* call forwarding' }
    ],
    protagonist: [
      { id: 'checked_official_bank', label: 'Verify actual balance in official Bank App' }
    ],
    father_arrest: [
      { id: 'inspected_warrant_pdf', label: 'Inspect CBI warrant PDF for fake email' },
      { id: 'checked_truecaller', label: 'Check Truecaller spam report database' }
    ],
    sibling_task: [
      { id: 'checked_glassdoor_reviews', label: 'Inspect Glassdoor bot reviews' },
      { id: 'checked_college_notice', label: 'Read College Placement Cell advisory' }
    ],
    mother_blackout: [
      { id: 'checked_utility_dues', label: 'Check pending dues in Utility App' },
      { id: 'checked_apt_chat', label: 'Read Apartment Group outage message' }
    ],
    protagonist_qr: [
      { id: 'checked_olx_chat', label: 'Read OLX buyer payment instructions' },
      { id: 'checked_bank_tips', label: 'Read Central Bank UPI safety tips' }
    ]
  };

  const requiredClues = caseClueDefs[characterKey] || [];
  const allCluesUnlocked = requiredClues.length === 0 || requiredClues.every(clue => unlockedClues.includes(clue.id));

  const unlockClue = (clueId) => {
    if (!unlockedClues.includes(clueId)) {
      playSound('success', soundMuted);
      setUnlockedClues(prev => [...prev, clueId]);
    }
  };

  // CHROME SEARCH FLOW STATE ('search' | 'results' | 'scam_site')
  const [chromeStep, setChromeStep] = useState('search');
  const [browserView, setBrowserView] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim().length > 0) {
      playSound('pop', soundMuted);
      setBrowserView('phishing');
    }
  };

  // MOTHER MISSION STATE
  const [motherState, setMotherState] = useState({
    screen: 'home',
    searchQuery: '',
    timer: 179,
    urlInspected: false,
    showWarning: false,
    selectedCod: false,
    codAlert: false,
    upiPin: ''
  });

  // SIBLING MISSION STATE
  const [siblingState, setSiblingState] = useState({
    screen: 'forum',
    downloadProgress: 0,
    smsPermission: true,
    contactsPermission: true,
    ussdPermission: true
  });

  // FATHER MISSION STATE
  const [fatherState, setFatherState] = useState({
    screen: 'dilemma',
    digits: '',
    speakerphoneOn: false,
    callTimer: 0
  });

  // PROTAGONIST MISSION STATE
  const [protagonistState, setProtagonistState] = useState({
    screen: 'sms',
    cardNumber: '4532 8912 3456 7890',
    cardHolder: 'RAHUL SHARMA',
    expiry: '09/28',
    cvv: '',
    isCardFlipped: false
  });

  // Timers
  useEffect(() => {
    if (characterKey === 'mother' && motherState.screen === 'store' && motherState.timer > 0) {
      const interval = setInterval(() => {
        setMotherState(prev => ({ ...prev, timer: prev.timer - 1 }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [characterKey, motherState.screen, motherState.timer]);

  useEffect(() => {
    if (siblingState.screen === 'downloading') {
      const interval = setInterval(() => {
        setSiblingState(prev => {
          if (prev.downloadProgress >= 100) {
            clearInterval(interval);
            return { ...prev, screen: 'installer' };
          }
          return { ...prev, downloadProgress: prev.downloadProgress + 20 };
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [siblingState.screen]);

  useEffect(() => {
    if (fatherState.screen === 'calling') {
      const interval = setInterval(() => {
        setFatherState(prev => ({ ...prev, callTimer: prev.callTimer + 1 }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [fatherState.screen]);

  // Physical Keyboard Listener for Mother Search Keyboard
  useEffect(() => {
    if (characterKey !== 'mother' || activeApp !== 'chrome' || motherState.screen !== 'searchKeyboard') return;

    const handleKeyDown = (e) => {
      if (e.key === 'Backspace') {
        playSound('click', soundMuted);
        setMotherState(prev => ({ ...prev, searchQuery: prev.searchQuery.slice(0, -1) }));
      } else if (e.key === 'Enter') {
        if (motherState.searchQuery.trim().length > 0) {
          playSound('pop', soundMuted);
          setMotherState(prev => ({ ...prev, screen: 'searchResults' }));
        }
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        playSound('click', soundMuted);
        setMotherState(prev => ({ ...prev, searchQuery: prev.searchQuery + e.key }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [characterKey, activeApp, motherState.screen, motherState.searchQuery, soundMuted]);

  // Physical Keyboard Listener for Father Dialer Keyboard
  useEffect(() => {
    if (characterKey !== 'father' || activeApp !== 'dialer' || fatherState.screen === 'calling') return;

    const handleKeyDown = (e) => {
      if (e.key === 'Backspace') {
        playSound('click', soundMuted);
        setFatherState(prev => ({ ...prev, digits: prev.digits.slice(0, -1) }));
      } else if (['0','1','2','3','4','5','6','7','8','9','*','#'].includes(e.key)) {
        playSound('click', soundMuted);
        setFatherState(prev => ({ ...prev, digits: prev.digits + e.key }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [characterKey, activeApp, fatherState.screen, fatherState.digits, soundMuted]);

  // HANDLERS: MOTHER
  const handleMotherKeyTap = (char) => {
    playSound('click', soundMuted);
    setMotherState(prev => ({ ...prev, searchQuery: prev.searchQuery + char }));
  };

  const handleMotherBackspace = () => {
    playSound('click', soundMuted);
    setMotherState(prev => ({ ...prev, searchQuery: prev.searchQuery.slice(0, -1) }));
  };

  const handleMotherSearchSubmit = () => {
    if (!motherState.searchQuery) return;
    playSound('pop', soundMuted);
    setMotherState(prev => ({ ...prev, screen: 'searchResults' }));
  };

  const handleMotherPayUpiClick = () => {
    playSound('pop', soundMuted);
    setMotherState(prev => ({ ...prev, codAlert: false, screen: 'upiModal' }));
  };

  const handleMotherUpiKey = (digit) => {
    playSound('click', soundMuted);
    if (motherState.upiPin.length < 4) {
      const nextPin = motherState.upiPin + digit;
      setMotherState(prev => ({ ...prev, upiPin: nextPin }));

      if (nextPin.length === 4) {
        playSound('scammed', soundMuted);
        setTimeout(() => {
          onMissionResult({
            success: false,
            scammedAmount: 1299,
            scamType: 'Fake E-Commerce & Advance UPI Trap'
          });
        }, 500);
      }
    }
  };

  const handleMotherInspectUrl = () => {
    playSound('pop', soundMuted);
    unlockClue('inspected_url');
    setMotherState(prev => ({ ...prev, urlInspected: true, showWarning: true }));
  };

  const handleMotherCloseTabSafe = () => {
    playSound('success', soundMuted);
    onMissionResult({
      success: true,
      scammedAmount: 0,
      scamType: 'Fake E-Commerce & Advance UPI Trap'
    });
  };

  // HANDLERS: SIBLING
  const handleSiblingTogglePermission = (permKey) => {
    playSound('click', soundMuted);
    unlockClue('checked_permissions');
    setSiblingState(prev => ({ ...prev, [permKey]: !prev[permKey] }));
  };

  // Navigation handlers
  const handleNavBack = () => {
    playSound('click', soundMuted);
    if (selectedPhoto) {
      setSelectedPhoto(null);
      return;
    }
    setActiveApp(null);
  };

  const handleNavHome = () => {
    playSound('pop', soundMuted);
    setSelectedPhoto(null);
    setActiveApp(null);
  };

  const handleNavPutDown = () => {
    playSound('click', soundMuted);
    if (onBackToOverworld) onBackToOverworld();
  };

  // Helper to open app from notification banner or app grid
  const openAppByName = (appName) => {
    playSound('pop', soundMuted);

    if (['chrome', 'downloads', 'cbiCall', 'telegramJob', 'paymentGateway', 'scanner'].includes(appName)) {
      playSound('heartbeat', soundMuted);
    }

    if (appName === 'gallery') unlockClue('opened_gallery');
    if (appName === 'permissions') unlockClue('checked_permissions');
    if (appName === 'collegeChat') unlockClue('checked_chat');
    if (appName === 'carrier' || (appName === 'messages' && characterKey === 'father')) unlockClue('read_carrier_warning');
    if (appName === 'officialBank') unlockClue('checked_official_bank');
    if (appName === 'pdfViewer') unlockClue('inspected_warrant_pdf');
    if (appName === 'truecaller') unlockClue('checked_truecaller');
    if (appName === 'companyReviews') unlockClue('checked_glassdoor_reviews');
    if (appName === 'collegeNotice') unlockClue('checked_college_notice');
    if (appName === 'utilityApp') unlockClue('checked_utility_dues');
    if (appName === 'aptChat') unlockClue('checked_apt_chat');
    if (appName === 'olxMarket') unlockClue('checked_olx_chat');
    if (appName === 'bankTips') unlockClue('checked_bank_tips');

    setActiveApp(appName);
  };

  // QWERTY keyboard rows
  const qwertyRow1 = ['Q','W','E','R','T','Y','U','I','O','P'];
  const qwertyRow2 = ['A','S','D','F','G','H','J','K','L'];
  const qwertyRow3 = ['Z','X','C','V','B','N','M'];

  // Character metadata setup
  let deviceTitle = t('deviceMother');
  let wallpaperBg = 'bg-gradient-to-b from-amber-950 via-slate-900 to-amber-900/80';
  
  if (characterKey === 'sibling' || characterKey === 'sibling_task') {
    deviceTitle = t('deviceSibling');
    wallpaperBg = 'bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950';
  } else if (characterKey === 'father' || characterKey === 'father_arrest') {
    deviceTitle = t('deviceFather');
    wallpaperBg = 'bg-gradient-to-b from-stone-950 via-amber-950/60 to-slate-950';
  } else if (characterKey === 'protagonist' || characterKey === 'protagonist_qr') {
    deviceTitle = t('deviceProtagonist');
    wallpaperBg = 'bg-gradient-to-b from-slate-950 via-blue-950/80 to-slate-900';
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-0 md:p-2 bg-[#090604] text-slate-100 font-sans-game select-none overflow-hidden">
      
      {/* Main Physical Phone Screen Container */}
      <div className="relative w-full h-full flex flex-col overflow-hidden bg-zinc-900 rounded-lg">
        
        {/* Samsung Galaxy One UI Pinned Top Status Bar */}
        <div className="w-full px-4 pt-2.5 pb-2 flex justify-between items-center text-[11px] font-mono text-slate-200 bg-slate-950 border-b border-slate-800 shrink-0 select-none z-50">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="text-amber-300 font-mono">{currentTime}</span>
            <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/40 font-black">Jio 5G</span>
          </div>
          
          {/* Hole Punch Camera Cutout */}
          <div className="w-16 h-3.5 bg-black rounded-full mx-auto flex items-center justify-center border border-slate-800 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700" />
          </div>

          <div className="flex items-center gap-1.5 font-bold text-slate-300">
            <div className="flex items-end gap-0.5 h-3">
              <div className="w-0.5 h-1 bg-amber-400 rounded-xs" />
              <div className="w-0.5 h-1.5 bg-amber-400 rounded-xs" />
              <div className="w-0.5 h-2 bg-amber-400 rounded-xs" />
              <div className="w-0.5 h-3 bg-amber-400 rounded-xs" />
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-black flex items-center gap-0.5">
              85% 🔋
            </span>
          </div>
        </div>

        {/* TOP DROP-DOWN NOTIFICATION BANNER */}
        {notificationVisible && (
          <div className="bg-slate-900/95 border-b-2 border-amber-500 p-2.5 shadow-2xl z-40 animate-pulse shrink-0 backdrop-blur">
            <div className="flex items-start justify-between gap-2">
              <div 
                onClick={() => {
                  setNotificationVisible(false);
                  openAppByName('messages');
                }}
                className="cursor-pointer flex items-start gap-2 text-xs flex-1"
              >
                <div className="w-7 h-7 rounded-xl bg-amber-500 text-black font-black flex items-center justify-center text-xs shrink-0 comic-border-sm">
                  💬
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center text-[10px] font-mono text-amber-400 font-bold">
                    <span>
                      {missionData.notifications?.[0]?.title || 'Urgent Cyber Threat Alert'}
                    </span>
                    <span className="text-slate-400">NOW</span>
                  </div>
                  <div className="font-bold text-slate-100 text-[11px] leading-tight">
                    {missionData.notifications?.[0]?.preview || 'Tap to review suspicious messages.'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setNotificationVisible(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
                title="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Viewport Display Area */}
        <div className="flex-1 overflow-y-auto relative p-2">

          {/* FATHER MISSION URGENT HOOK BANNER */}
          {characterKey === 'father' && (
            <div className="bg-red-950/90 border-2 border-red-500 p-2.5 rounded-xl comic-border-sm mb-2 text-xs shadow-xl animate-pulse shrink-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="font-bold text-amber-300 flex items-center gap-1 font-mono text-[10px]">
                  <span>🚨</span> URGENT STRANGER REQUEST:
                </div>
                <span className="text-[8px] bg-red-600 text-white px-1.5 py-0.2 rounded font-black uppercase">Hospital Emergency</span>
              </div>
              <p className="text-slate-100 font-semibold leading-snug text-[11px]">
                "Bhaiyya, please! My wife is in the hospital. Can you urgently dial <span className="font-mono text-amber-300 font-black px-1 py-0.2 bg-black/70 rounded border border-amber-500/80 tracking-wider select-all">*401*9876543210</span> for me? My battery is dead!"
              </p>
            </div>
          )}

          {/* HOME SCREEN (APP GRID & WALLPAPER) */}
          {!activeApp && (
            <div className="h-full flex flex-col justify-between py-2 text-center select-none">
              <div className="space-y-1 mt-2">
                <div className="text-3xl font-black font-mono text-amber-300 tracking-wider">{currentTime}</div>
                <div className="text-xs font-mono text-slate-300 font-bold uppercase tracking-widest">{missionData.deviceName || deviceTitle}</div>
                <div className="text-[10px] text-amber-400/80 font-mono">Tap any app icon to inspect evidence</div>
              </div>

              {/* INTERACTIVE APP GRID */}
              <div className="grid grid-cols-3 gap-4 my-auto px-2">
                {characterKey === 'mother' && (
                  <>
                    <button
                      onClick={() => openAppByName('chrome')}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-amber-500 hover:scale-105 transition-all cursor-pointer relative comic-border-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-red-500 to-yellow-400 flex items-center justify-center text-black font-bold shadow-lg">
                        <Globe size={24} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">{t('appChrome')}</span>
                    </button>

                    <button
                      onClick={() => openAppByName('gallery')}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-amber-500 hover:scale-105 transition-all cursor-pointer relative comic-border-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold shadow-lg">
                        <GalleryIcon size={24} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">{t('appGallery')}</span>
                    </button>

                    <button
                      onClick={() => openAppByName('whatsapp')}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-amber-500 hover:scale-105 transition-all cursor-pointer relative comic-border-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-lg">
                        <MessageSquare size={24} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">{t('appWhatsApp')}</span>
                    </button>
                  </>
                )}

                {characterKey === 'sibling' && (
                  <>
                    <button
                      onClick={() => openAppByName('downloads')}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-indigo-500 hover:scale-105 transition-all cursor-pointer relative comic-border-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                        <Download size={24} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">{t('appDownloads')}</span>
                    </button>

                    <button
                      onClick={() => openAppByName('permissions')}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-indigo-500 hover:scale-105 transition-all cursor-pointer relative comic-border-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-purple-700 flex items-center justify-center text-white font-bold shadow-lg">
                        <ShieldAlert size={24} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">{t('appPermissions')}</span>
                    </button>

                    <button
                      onClick={() => openAppByName('collegeChat')}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-indigo-500 hover:scale-105 transition-all cursor-pointer relative comic-border-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                        <Users size={24} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">{t('appCollegeChat')}</span>
                    </button>
                  </>
                )}

                {characterKey === 'father' && (
                  <>
                    <button
                      onClick={() => openAppByName('dialer')}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-amber-500 hover:scale-105 transition-all cursor-pointer relative comic-border-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-lg">
                        <Phone size={24} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">{t('appPhoneDialer')}</span>
                    </button>

                    <button
                      onClick={() => openAppByName('carrier')}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-amber-500 hover:scale-105 transition-all cursor-pointer relative comic-border-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center text-black font-bold shadow-lg">
                        <ShieldAlert size={24} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">{t('appSmsCarrier')}</span>
                    </button>

                    <button
                      onClick={() => openAppByName('callLog')}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-amber-500 hover:scale-105 transition-all cursor-pointer relative comic-border-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-slate-200 font-bold shadow-lg">
                        <FileText size={24} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">{t('appCallLog')}</span>
                    </button>
                  </>
                )}

                {characterKey === 'protagonist' && (
                  <>
                    <button
                      onClick={() => openAppByName('sms')}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-red-500 hover:scale-105 transition-all cursor-pointer relative comic-border-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold shadow-lg">
                        <MessageSquare size={24} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">{t('appSmsMessenger')}</span>
                    </button>

                    <button
                      onClick={() => openAppByName('officialBank')}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-emerald-500 hover:scale-105 transition-all cursor-pointer relative comic-border-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-black font-bold shadow-lg">
                        <ShieldCheck size={24} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">{t('appOfficialBank')}</span>
                    </button>

                    <button
                      onClick={() => openAppByName('paymentGateway')}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-red-500 hover:scale-105 transition-all cursor-pointer relative comic-border-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center text-black font-bold shadow-lg">
                        <CreditCard size={24} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">{t('appPaymentGateway')}</span>
                    </button>
                  </>
                )}

                {characterKey === 'father_arrest' && (
                  <>
                    <button
                      onClick={() => openAppByName('cbiCall')}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-purple-500 hover:scale-105 transition-all cursor-pointer relative comic-border-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                        <Phone size={24} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">{t('appCbiCall')}</span>
                    </button>

                    <button
                      onClick={() => openAppByName('pdfViewer')}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-purple-500 hover:scale-105 transition-all cursor-pointer relative comic-border-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-red-400 font-bold shadow-lg">
                        <FileText size={24} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">{t('appPdfViewer')}</span>
                    </button>

                    <button
                      onClick={() => openAppByName('truecaller')}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-purple-500 hover:scale-105 transition-all cursor-pointer relative comic-border-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                        <ShieldCheck size={24} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">{t('appTruecaller')}</span>
                    </button>
                  </>
                )}

                {characterKey === 'sibling_task' && (
                  <>
                    <button
                      onClick={() => openAppByName('telegramJob')}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-cyan-500 hover:scale-105 transition-all cursor-pointer relative comic-border-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-cyan-600 flex items-center justify-center text-white font-bold shadow-lg">
                        <MessageSquare size={24} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">{t('appTelegramJob')}</span>
                    </button>

                    <button
                      onClick={() => openAppByName('companyReviews')}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-cyan-500 hover:scale-105 transition-all cursor-pointer relative comic-border-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-slate-200 font-bold shadow-lg">
                        <User size={24} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">{t('appCompanyReviews')}</span>
                    </button>

                    <button
                      onClick={() => openAppByName('collegeNotice')}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-cyan-500 hover:scale-105 transition-all cursor-pointer relative comic-border-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-lg">
                        <Info size={24} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">{t('appCollegeNotice')}</span>
                    </button>
                  </>
                )}

                {characterKey === 'mother_blackout' && (
                  <>
                    <button
                      onClick={() => openAppByName('sms')}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-amber-500 hover:scale-105 transition-all cursor-pointer relative comic-border-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold shadow-lg">
                        <MessageSquare size={24} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">{t('appSmsMessenger')}</span>
                    </button>

                    <button
                      onClick={() => openAppByName('utilityApp')}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-amber-500 hover:scale-105 transition-all cursor-pointer relative comic-border-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-black font-bold shadow-lg">
                        <Layers size={24} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">{t('appUtilityApp')}</span>
                    </button>

                    <button
                      onClick={() => openAppByName('aptChat')}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-amber-500 hover:scale-105 transition-all cursor-pointer relative comic-border-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                        <Users size={24} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">{t('appAptChat')}</span>
                    </button>
                  </>
                )}

                {characterKey === 'protagonist_qr' && (
                  <>
                    <button
                      onClick={() => openAppByName('scanner')}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-rose-500 hover:scale-105 transition-all cursor-pointer relative comic-border-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-rose-600 flex items-center justify-center text-white font-bold shadow-lg">
                        <Search size={24} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">{t('appPaymentScanner')}</span>
                    </button>

                    <button
                      onClick={() => openAppByName('olxMarket')}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-rose-500 hover:scale-105 transition-all cursor-pointer relative comic-border-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center text-black font-bold shadow-lg">
                        <MessageSquare size={24} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">{t('appOlxMarket')}</span>
                    </button>

                    <button
                      onClick={() => openAppByName('bankTips')}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-rose-500 hover:scale-105 transition-all cursor-pointer relative comic-border-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-lg">
                        <Shield size={24} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">{t('appBankTips')}</span>
                    </button>
                  </>
                )}
              </div>

              {/* Bottom Quick Help Prompt */}
              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl text-[11px] text-slate-300 font-mono comic-border-sm my-2">
                💡 <span className="text-amber-400 font-bold">Detective Tip:</span> Uncover evidence in notepad before making final decisions!
              </div>

              {/* SUBMIT FINAL VERDICT BUTTON */}
              <button
                onClick={() => {
                  playSound('pop', soundMuted);
                  setShowDecisionModal(true);
                }}
                className="w-full mt-2 py-3 px-4 bg-slate-950 hover:bg-amber-500 text-amber-400 hover:text-black font-black text-xs uppercase rounded-xl border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.8)] transition-all cursor-pointer flex items-center justify-center gap-2 tracking-widest font-mono comic-border-amber animate-pulse"
              >
                <span>⚖️</span>
                <span>[ SUBMIT FINAL VERDICT ]</span>
              </button>
            </div>
          )}

          {/* CHROME BROWSER APP VIEW (CASE 1 MOTHER - FAKE BROWSER & SEARCH FLOW) */}
          {activeApp === 'chrome' && (
            <div className="space-y-3 font-sans-game">
              {/* Dynamic Mobile Browser Header & URL Bar */}
              <div className="bg-slate-950 border-2 border-amber-500/80 p-2 rounded-xl comic-border-sm space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Globe size={16} className="text-amber-400 shrink-0" />
                    <span className="font-bold text-slate-200 text-[11px]">Chrome Mobile</span>
                  </div>
                  {browserView === 'phishing' && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          playSound('click', soundMuted);
                          setBrowserView('search');
                        }}
                        className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-[9px] font-mono font-bold cursor-pointer"
                      >
                        ◀ Back to Search
                      </button>
                      <button
                        onClick={handleMotherInspectUrl}
                        className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded text-[9px] font-mono font-bold cursor-pointer transition-all flex items-center gap-1"
                      >
                        <Search size={10} />
                        <span>Inspect Domain</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Dynamic URL Bar based on browserView */}
                {browserView === 'search' ? (
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[10px] font-mono text-slate-300">
                    <span className="text-emerald-400 font-bold shrink-0">🔒 Secure</span>
                    <span className="text-slate-500 shrink-0">http://</span>
                    <span className="text-slate-200 font-bold truncate">goggle.com/search</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[10px] font-mono text-slate-200">
                    <span className="text-slate-400 font-bold shrink-0">http://</span>
                    <span className="text-slate-100 font-bold truncate">bajajelectricals-warranty-desk.in/claim</span>
                  </div>
                )}

                {browserView === 'phishing' && motherState.urlInspected && (
                  <div className="p-2 bg-red-950/80 border border-red-600 rounded text-[10px] text-red-200 font-mono space-y-1">
                    <div className="font-bold text-amber-300">🔍 DOMAIN INSPECTION WARNING:</div>
                    <p className="leading-tight">
                      Domain uses fake name <span className="text-red-300 font-bold font-mono">bajajelectricals-warranty-desk.in</span> instead of official <span className="text-emerald-300 font-bold font-mono">bajajelectricals.com</span>. Scammers add brand keywords to domain names to fool victims into authorizing hidden AutoPay mandates!
                    </p>
                  </div>
                )}
              </div>

              {/* 1. DEFAULT VIEW: FAKE SEARCH ENGINE HOMEPAGE */}
              {browserView === 'search' && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 text-center">
                  {/* Search Engine Logo */}
                  <div className="py-2">
                    <div className="text-3xl font-black font-title tracking-wider select-none">
                      <span className="text-blue-500">G</span>
                      <span className="text-red-500">o</span>
                      <span className="text-yellow-500">g</span>
                      <span className="text-blue-500">g</span>
                      <span className="text-green-500">l</span>
                      <span className="text-red-500">e</span>
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono uppercase tracking-widest pt-1">
                      Search the World Wide Web
                    </div>
                  </div>

                  {/* Search Form / Input */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSearch();
                    }}
                    className="space-y-3"
                  >
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSearch();
                          }
                        }}
                        placeholder="Search or enter web address..."
                        className="w-full bg-slate-950 border-2 border-amber-500/60 focus:border-amber-400 rounded-full py-2.5 px-4 pr-10 text-xs font-mono text-amber-300 placeholder-slate-500 outline-none shadow-inner"
                      />
                      <Search size={16} className="absolute right-3.5 top-3 text-amber-400" />
                    </div>

                    <button
                      type="button"
                      onClick={handleSearch}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-xl comic-border-sm cursor-pointer shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Search size={14} />
                      <span>Search / Go</span>
                    </button>
                  </form>

                  {/* Quick Recent Link / Suggestion */}
                  <div className="pt-2 border-t border-slate-800 text-left space-y-1.5">
                    <div className="text-[10px] text-slate-400 font-mono font-bold">Recent SMS Link Suggestion:</div>
                    <div
                      onClick={() => {
                        playSound('pop', soundMuted);
                        setSearchQuery('http://bajajelectricals-warranty-desk.in/claim');
                        setBrowserView('phishing');
                      }}
                      className="p-2 bg-slate-950 border border-slate-800 hover:border-amber-500/60 rounded-lg cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div className="truncate pr-2">
                        <div className="text-[11px] font-bold text-slate-200 group-hover:text-amber-300">
                          Mixer Service Replacement Claim
                        </div>
                        <div className="text-[9px] text-amber-400/80 font-mono truncate">
                          http://bajajelectricals-warranty-desk.in/claim
                        </div>
                      </div>
                      <span className="text-xs text-amber-400 font-bold shrink-0">➜</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. RESULT VIEW: DECEPTIVELY LEGITIMATE CORPORATE PHISHING PAGE */}
              {browserView === 'phishing' && (
                <div className="bg-white border border-slate-300 rounded-xl p-3.5 space-y-3 text-xs text-slate-900 shadow-lg font-sans">
                  {/* Clean Corporate E-Commerce Header */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        ⚡
                      </div>
                      <div>
                        <div className="font-bold text-blue-900 text-xs tracking-tight">Bajaj Electricals Service Desk</div>
                        <div className="text-[9px] text-slate-500 font-mono flex items-center gap-0.5">
                          <span>Official Customer Warranty Portal</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] bg-blue-50 text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded font-mono font-semibold">
                        ISO 9001 Certified
                      </span>
                    </div>
                  </div>

                  {/* Main Status & Approval Notice */}
                  <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg text-center space-y-1">
                    <div className="text-[9px] text-blue-800 uppercase font-mono font-bold tracking-wider">
                      Warranty Claim Verification Status
                    </div>
                    <h3 className="font-bold text-sm text-blue-950">
                      Mixer Grinder Replacement Approved
                    </h3>
                    <p className="text-[10px] text-slate-600 leading-snug">
                      Ticket <span className="font-mono text-blue-800 font-bold">#WM-9481</span> • Product Warranty Motor Replacement Unit
                    </p>
                  </div>

                  {/* Product Claim Summary & Limited Offer Box */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Replacement Unit:</span>
                      <span className="font-semibold text-slate-900">750W Motor Grinder</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Original Retail Price:</span>
                      <span className="line-through text-gray-400 font-mono">₹2,998</span>
                    </div>
                    <div className="flex items-center justify-between font-bold border-t border-slate-200 pt-1">
                      <span className="text-blue-900">50% Exchange Upgrade Offer:</span>
                      <span className="text-emerald-700 text-xs font-mono font-bold">₹1,499</span>
                    </div>
                  </div>

                  {/* Scarcity and Urgency Banner */}
                  <div className="p-2 bg-amber-100/90 border border-amber-300 rounded-lg text-center font-mono font-bold text-[10px] text-amber-900 animate-pulse flex items-center justify-center gap-1 shadow-xs">
                    <span>🔥 Limited Time: Offer reserved for 04:59 minutes!</span>
                  </div>

                  {/* False Trust Shipping Details Box */}
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-[11px]">
                    <div className="font-bold text-blue-900 flex items-center justify-between">
                      <span>📦 Shipping & Delivery Address</span>
                      <span className="text-[8px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-mono font-bold">VERIFIED</span>
                    </div>
                    <div className="text-slate-700 text-[10px] leading-tight">
                      Recipient: Sunita Sharma • 42, Green Park Extension, New Delhi [Protected for Privacy]
                    </div>
                  </div>

                  {/* Corporate Payment CTA & Fine Print Clue */}
                  {motherState.screen !== 'upiModal' ? (
                    <div className="space-y-2 pt-1">
                      <button
                        onClick={handleMotherPayUpiClick}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5"
                      >
                        <CreditCard size={14} />
                        <span>Pay ₹1,499 via UPI to Claim Offer</span>
                      </button>

                      {/* Smoking Gun Fine Print Clue */}
                      <div className="text-center text-[9px] text-slate-500 font-sans italic px-1 leading-tight">
                        *By proceeding, you authorize an automatic UPI AutoPay mandate up to ₹5,000.
                      </div>

                      <button
                        onClick={handleMotherCloseTabSafe}
                        disabled={!allCluesUnlocked}
                        className={`w-full py-2 font-bold text-xs rounded-lg cursor-pointer ${
                          allCluesUnlocked ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {allCluesUnlocked ? '🔒 Close Phishing Tab & Report Fake Portal' : '🔒 Complete Evidence Audit to Unlock Decision'}
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-white border-2 border-blue-600 rounded-xl space-y-3 shadow-md animate-fadeIn">
                      <div className="text-center space-y-1 border-b border-slate-200 pb-2">
                        <div className="text-xs font-bold text-blue-900 font-mono">UPI Verification & Mandate Auth</div>
                        <div className="text-[10px] text-slate-600">Enter 4-Digit UPI PIN to authorize refundable ₹50 fee</div>
                      </div>

                      <div className="flex justify-center gap-2">
                        {[0, 1, 2, 3].map(idx => (
                          <div
                            key={idx}
                            className="w-8 h-8 rounded-lg border-2 border-blue-500 flex items-center justify-center text-lg font-mono font-bold text-blue-900 bg-blue-50"
                          >
                            {motherState.upiPin[idx] ? '•' : ''}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-1.5">
                        {['1','2','3','4','5','6','7','8','9','C','0','✓'].map(key => (
                          <button
                            key={key}
                            onClick={() => {
                              if (key === 'C') {
                                handleMotherBackspace();
                              } else if (key !== '✓') {
                                handleMotherUpiKey(key);
                              }
                            }}
                            className="h-9 bg-slate-100 hover:bg-blue-50 border border-slate-300 text-slate-800 font-mono font-bold text-sm rounded-lg active:scale-95 cursor-pointer"
                          >
                            {key}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setMotherState(prev => ({ ...prev, screen: 'store', upiPin: '' }))}
                        className="w-full py-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg cursor-pointer hover:bg-slate-200"
                      >
                        Cancel Verification
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* MESSAGES & WHATSAPP APP VIEW */}
          {(activeApp === 'messages' || activeApp === 'whatsapp') && (
            <div className="space-y-3 font-sans-game h-full flex flex-col overflow-hidden">
              <div className="bg-slate-900 border-2 border-amber-500 p-2.5 rounded-xl comic-border-sm flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      playSound('click', soundMuted);
                      if (selectedMessageThread) setSelectedMessageThread(null);
                      else setActiveApp(null);
                    }}
                    className="text-amber-400 hover:text-white p-1 cursor-pointer"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div>
                    <div className="font-bold text-xs text-amber-200">
                      {selectedMessageThread ? selectedMessageThread.sender : (activeApp === 'whatsapp' ? 'WhatsApp Messages' : 'Messages Inbox')}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {selectedMessageThread ? (selectedMessageThread.phone || 'Online') : `${missionData.messages?.length || 0} Threads`}
                    </div>
                  </div>
                </div>
                <MessageSquare size={18} className="text-amber-400" />
              </div>

              {!selectedMessageThread ? (
                <div className="space-y-2 h-full flex-1 overflow-y-auto pr-1">
                  {missionData.messages?.map((thread) => (
                    <div
                      key={thread.id}
                      onClick={() => {
                        playSound('pop', soundMuted);
                        setSelectedMessageThread(thread);
                      }}
                      className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-amber-500 cursor-pointer transition-all space-y-1 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{thread.avatar || '💬'}</span>
                          <span className="font-bold text-xs text-slate-100 group-hover:text-amber-300">{thread.sender}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{thread.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 truncate leading-snug pl-7">{thread.preview}</p>
                      {thread.unread && (
                        <div className="pl-7 pt-0.5">
                          <span className="text-[8px] font-black bg-red-600 text-white px-1.5 py-0.2 rounded uppercase animate-pulse">
                            NEW MESSAGE
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-3 flex-1 overflow-y-auto">
                  {selectedMessageThread.thread?.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${item.sender === 'me' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-xl text-xs space-y-2 ${
                          item.sender === 'me'
                            ? 'bg-amber-600 text-black font-semibold'
                            : 'bg-slate-950 border border-slate-700 text-slate-100'
                        }`}
                      >
                        <p className="leading-snug">{item.text}</p>
                        {item.type === 'image' && (
                          <div className="space-y-1.5 pt-1">
                            <img src={item.src} alt="Attachment" className="w-full rounded-lg border border-black shadow" />
                            {item.caption && (
                              <div className="text-[10px] bg-red-950 text-red-300 border border-red-600 p-1.5 rounded font-mono font-bold">
                                {item.caption}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setSelectedMessageThread(null)}
                    className="w-full py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl cursor-pointer hover:bg-slate-700"
                  >
                    ◀ Back to Message Threads
                  </button>
                </div>
              )}
            </div>
          )}

          {/* GALLERY APP VIEW */}
          {activeApp === 'gallery' && (
            <div className="space-y-3 font-sans-game h-full flex flex-col">
              <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800 shrink-0">
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <GalleryIcon size={16} /> Photos & Evidence Gallery
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{missionData.gallery?.length || 0} Items</span>
              </div>

              {!selectedPhoto ? (
                <div className="grid grid-cols-2 gap-2.5 flex-1 overflow-y-auto pr-1">
                  {missionData.gallery?.map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => {
                        playSound('pop', soundMuted);
                        unlockClue('opened_gallery');
                        setSelectedPhoto(photo);
                      }}
                      className="aspect-square bg-slate-900 border-2 border-emerald-500/80 hover:border-amber-400 rounded-xl p-2 flex flex-col justify-between cursor-pointer transition-all comic-border-sm bg-gradient-to-b from-slate-900 to-emerald-950/40 relative overflow-hidden group"
                    >
                      <div className="w-full flex-1 bg-black/60 rounded-lg overflow-hidden flex items-center justify-center p-1 border border-slate-800">
                        <img 
                          src={photo.src} 
                          alt={photo.title} 
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextSibling) {
                              e.currentTarget.nextSibling.style.display = 'flex';
                            }
                          }}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" 
                        />
                        <div className="hidden bg-gray-100 w-full h-full rounded p-3 flex flex-col gap-2 justify-between shadow-inner border border-gray-300 relative overflow-hidden">
                          <div className="space-y-1.5 w-full">
                            <div className="w-1/2 h-3 bg-blue-300/50 rounded mb-2"></div>
                            <div className="w-full h-1.5 bg-gray-300 rounded"></div>
                            <div className="w-5/6 h-1.5 bg-gray-300 rounded"></div>
                            <div className="w-4/5 h-1.5 bg-gray-300 rounded"></div>
                            <div className="w-2/3 h-1.5 bg-gray-300 rounded"></div>
                          </div>
                          <div className="flex items-center justify-between w-full mt-1">
                            <span className="text-[7px] font-mono font-bold text-gray-500 truncate max-w-[70%]">
                              {photo.title || 'DOC'}
                            </span>
                            <div className="w-4 h-4 bg-red-400/50 rounded-full border border-red-500/60 flex items-center justify-center shrink-0">
                              <div className="w-1.5 h-1.5 bg-red-600/70 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pt-1 text-[10px] font-bold text-emerald-300 truncate text-center">
                        {photo.title}
                      </div>
                      {photo.isEvidence && (
                        <span className="absolute top-1 right-1 text-[7px] font-black bg-red-600 text-white px-1 py-0.2 rounded uppercase shadow">
                          EVIDENCE
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 flex-1 overflow-y-auto">
                  <div className="bg-slate-900 border-2 border-emerald-500 p-3.5 rounded-2xl comic-border-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-title text-base text-emerald-400">{selectedPhoto.title}</div>
                      <span className="text-[10px] font-mono text-slate-400">{selectedPhoto.date}</span>
                    </div>

                    <div className="bg-black border border-slate-800 rounded-xl overflow-hidden p-2 flex justify-center min-h-[140px] items-center">
                      <img 
                        src={selectedPhoto.src} 
                        alt={selectedPhoto.title} 
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextSibling) {
                            e.currentTarget.nextSibling.style.display = 'flex';
                          }
                        }}
                        className="max-h-56 object-contain rounded" 
                      />
                      <div className="hidden bg-gray-100 w-full p-4 flex flex-col justify-between shadow-inner border border-gray-300 relative overflow-hidden rounded-xl min-h-[160px]">
                        <div className="space-y-2 w-full">
                          <div className="flex items-center justify-between border-b border-gray-300 pb-2">
                            <div className="w-1/2 h-3.5 bg-blue-400/50 rounded mb-1"></div>
                            <span className="text-[9px] font-mono font-bold text-gray-500">{selectedPhoto.date}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-300 rounded"></div>
                          <div className="w-5/6 h-2 bg-gray-300 rounded"></div>
                          <div className="w-4/5 h-2 bg-gray-300 rounded"></div>
                          <div className="w-2/3 h-2 bg-gray-300 rounded"></div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-300 mt-3 w-full">
                          <span className="text-xs font-mono font-bold text-gray-800 truncate max-w-[70%]">
                            📄 {selectedPhoto.title}
                          </span>
                          <div className="w-6 h-6 bg-red-400/50 rounded-full border border-red-500/60 flex items-center justify-center text-[7px] font-black text-red-800 uppercase shadow-sm">
                            SEAL
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-950/80 border border-amber-500 rounded-xl text-xs font-mono text-amber-200 leading-snug space-y-1.5">
                      <div>{selectedPhoto.caption}</div>
                      {selectedPhoto.isEvidence && (
                        <div className="p-2 bg-black/60 border border-red-500/80 rounded text-red-300 font-bold text-[10px] flex items-center gap-1">
                          <span>⚠️ CRITICAL SCAM EVIDENCE VERIFIED</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="w-full py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl cursor-pointer hover:bg-slate-700"
                  >
                    ◀ Back to Photo Grid
                  </button>
                </div>
              )}
            </div>
          )}

          {/* CALL LOG APP VIEW */}
          {activeApp === 'callLog' && (
            <div className="space-y-3 font-sans-game">
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Phone size={16} className="text-amber-400" /> Phone Call History
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{missionData.callLog?.length || 0} Calls</span>
              </div>

              <div className="space-y-2 text-xs">
                {missionData.callLog?.map((call) => (
                  <div
                    key={call.id}
                    className={`p-3 border rounded-xl flex items-center justify-between ${
                      call.isSpam
                        ? 'bg-red-950/60 border-red-800 text-red-100'
                        : 'bg-slate-900 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                        call.type === 'missed' ? 'bg-red-900 text-red-300' : call.type === 'incoming' ? 'bg-emerald-900 text-emerald-300' : 'bg-blue-900 text-blue-300'
                      }`}>
                        {call.type === 'missed' ? '↙' : call.type === 'incoming' ? '↙' : '↗'}
                      </div>
                      <div>
                        <div className="font-bold text-xs flex items-center gap-1.5">
                          <span>{call.name}</span>
                          {call.isSpam && (
                            <span className="text-[8px] bg-red-600 text-white font-black px-1.5 py-0.2 rounded uppercase">
                              SCAMMER
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{call.number} • {call.time} ({call.duration})</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DOWNLOADS APP VIEW (CASE 2 SIBLING) */}
          {activeApp === 'downloads' && (
            <div className="space-y-3 font-sans-game h-full flex flex-col overflow-hidden">
              <div className="bg-indigo-950 border-2 border-indigo-500 p-2.5 rounded-xl comic-border-sm flex items-center justify-between shrink-0">
                <div>
                  <div className="font-bold text-xs text-indigo-200">Downloads Manager</div>
                  <div className="text-[10px] text-indigo-400 font-mono">/sdcard/Download</div>
                </div>
                <Download size={18} className="text-indigo-400" />
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-3 text-xs flex-1 overflow-y-auto">
                <div className="p-3 bg-red-950/80 border-2 border-red-600 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertOctagon size={20} className="text-red-400 shrink-0" />
                      <div>
                        <div className="font-bold text-xs text-red-200 font-mono">CashNow_Instant_Loan_v2.apk</div>
                        <div className="text-[10px] text-slate-400 font-mono">14.2 MB • Downloaded 10m ago</div>
                      </div>
                    </div>
                    <span className="text-[8px] font-black bg-red-600 text-white px-1.5 py-0.5 rounded uppercase">MALWARE</span>
                  </div>

                  <div className="p-2 bg-black/60 border border-amber-500/80 rounded text-[10px] text-amber-300 font-mono leading-snug">
                    ⚠️ PENDING INSTALL WARNING: App from unverified third-party source requesting dangerous accessibility & contact permissions!
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-300 space-y-1">
                  <div className="font-bold text-amber-400">File Inspection Details:</div>
                  <p className="leading-tight">
                    Package Name: <span className="font-mono text-slate-200">com.cashnow.loan.stealer</span><br/>
                    Signed: Self-signed certificate (Unverified Developer)<br/>
                    Risks: Contacts Exfiltration, SMS Forwarder, Camera Hijack
                  </p>
                </div>

                {/* Benign Decoy Files */}
                <div className="pt-1 border-t border-slate-800 space-y-2">
                  <div className="text-[10px] font-mono font-bold text-slate-400">Other Files:</div>

                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileText size={18} className="text-slate-400 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-200 text-xs font-mono">Data_Structures_Syllabus.pdf</div>
                        <div className="text-[9px] text-slate-400 font-mono">1.2 MB • Downloaded 2 days ago</div>
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono">PDF</span>
                  </div>

                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <GalleryIcon size={18} className="text-slate-400 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-200 text-xs font-mono">Hostel_Mess_Menu_Sept.jpg</div>
                        <div className="text-[9px] text-slate-400 font-mono">450 KB • Downloaded 3 days ago</div>
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono">JPG</span>
                  </div>

                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileText size={18} className="text-slate-400 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-200 text-xs font-mono">Fee_Receipt_Semester.pdf</div>
                        <div className="text-[9px] text-slate-400 font-mono">800 KB • Downloaded 1 week ago</div>
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono">PDF</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PERMISSIONS APP VIEW (CASE 2 SIBLING) */}
          {activeApp === 'permissions' && (
            <div className="space-y-3 font-sans-game">
              <div className="bg-purple-950 border-2 border-purple-500 p-2.5 rounded-xl comic-border-sm flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-purple-200">System App Permissions</div>
                  <div className="text-[10px] text-purple-400 font-mono">CashNow Instant Loan</div>
                </div>
                <ShieldAlert size={18} className="text-purple-400" />
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2.5 text-xs">
                <div className="p-2.5 bg-red-950/60 border border-red-800 rounded-lg text-red-200 font-mono text-[10px]">
                  ⚠️ DANGEROUS PERMISSIONS REQUESTED BY UNKNOWN APK:
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-200 flex items-center gap-1.5">
                        <span>👥 Allow access to Contacts</span>
                      </div>
                      <div className="text-[10px] text-slate-400 leading-tight">Reads all saved numbers & family contacts</div>
                    </div>
                    <button
                      onClick={() => handleSiblingTogglePermission('contactsPermission')}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer ${siblingState.contactsPermission ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}
                    >
                      {siblingState.contactsPermission ? 'ALLOWED (DANGER)' : 'DENIED'}
                    </button>
                  </div>

                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-200 flex items-center gap-1.5">
                        <span>💬 Allow access to SMS logs</span>
                      </div>
                      <div className="text-[10px] text-slate-400 leading-tight">Reads incoming banking OTPs & personal texts</div>
                    </div>
                    <button
                      onClick={() => handleSiblingTogglePermission('smsPermission')}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer ${siblingState.smsPermission ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}
                    >
                      {siblingState.smsPermission ? 'ALLOWED (DANGER)' : 'DENIED'}
                    </button>
                  </div>

                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-200 flex items-center gap-1.5">
                        <span>📷 Allow access to Camera</span>
                      </div>
                      <div className="text-[10px] text-slate-400 leading-tight">Captures photos and background media without consent</div>
                    </div>
                    <button
                      onClick={() => handleSiblingTogglePermission('ussdPermission')}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer ${siblingState.ussdPermission ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}
                    >
                      {siblingState.ussdPermission ? 'ALLOWED (DANGER)' : 'DENIED'}
                    </button>
                  </div>
                </div>

                <div className="p-2 bg-amber-950/80 border border-amber-500 rounded text-[10px] text-amber-200 font-mono leading-snug">
                  🚨 SECURITY RISK: Instant loan apps harvest your contacts and photo gallery to blackmail you into paying illegal 300% interest rates.
                </div>
              </div>
            </div>
          )}

          {/* COLLEGE CHAT APP VIEW (CASE 2 SIBLING) */}
          {activeApp === 'collegeChat' && (
            <div className="space-y-3 font-sans-game h-full flex flex-col overflow-hidden">
              <div className="bg-blue-950 border-2 border-blue-500 p-2.5 rounded-xl comic-border-sm flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                    🎓
                  </div>
                  <div>
                    <div className="font-bold text-xs text-blue-200">Hostel & College Batchmates</div>
                    <div className="text-[10px] text-blue-400 font-mono">WhatsApp Group • 42 Members</div>
                  </div>
                </div>
                <Users size={18} className="text-blue-400" />
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2.5 text-xs flex-1 overflow-y-auto">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-300">Rahul (CR)</span>
                    <span className="text-[9px] text-slate-400 font-mono">1:15 PM</span>
                  </div>
                  <p className="leading-snug text-slate-300">
                    "Tomorrow's first hour is canceled, the professor is on leave."
                  </p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-300">Karthik</span>
                    <span className="text-[9px] text-slate-400 font-mono">1:30 PM</span>
                  </div>
                  <p className="leading-snug text-slate-300">
                    "Anyone going to the canteen? Get me a coffee."
                  </p>
                </div>

                <div className="p-3 bg-red-950/90 border-2 border-red-600 rounded-xl space-y-1.5 text-red-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400">Aman (Hostel Room 204)</span>
                    <span className="text-[9px] text-slate-400 font-mono">1:45 PM</span>
                  </div>
                  <p className="leading-snug font-semibold text-slate-100">
                    "Hey, don't download that loan app, it's a scam! They just threatened to send my photos to my contacts!"
                  </p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 text-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-300">Vivek (Batchmate)</span>
                    <span className="text-[9px] text-slate-400 font-mono">1:48 PM</span>
                  </div>
                  <p className="leading-snug">
                    "Bro same thing happened to my roommate! They hack your phone permissions as soon as you install the APK. Uninstall it immediately and block their numbers!"
                  </p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-300">Sanjay</span>
                    <span className="text-[9px] text-slate-400 font-mono">1:55 PM</span>
                  </div>
                  <p className="leading-snug text-slate-300">
                    "Did anyone submit the database assignment yet?"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CARRIER SMS APP VIEW (CASE 3 FATHER) */}
          {activeApp === 'carrier' && (
            <div className="space-y-3 font-sans-game">
              <div className="bg-amber-950 border-2 border-amber-500 p-2.5 rounded-xl comic-border-sm flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-amber-200">Carrier SMS & Inbox</div>
                  <div className="text-[10px] text-amber-400 font-mono">Airtel 5G Network</div>
                </div>
                <ShieldAlert size={18} className="text-amber-400" />
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2.5 text-xs">
                <div className="p-3 bg-red-950/80 border-2 border-red-600 rounded-xl space-y-1.5 text-red-100">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-amber-400 flex items-center gap-1">
                      <span>Wholesale Scammer (+91 98765-43210)</span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono">10:42 AM</span>
                  </div>
                  <p className="leading-snug text-slate-100 font-semibold">
                    "Sir, advance payment of ₹10,000 sent. Please approve the pending UPI collect request to receive the money."
                  </p>
                  <div className="p-2 bg-black/60 border border-red-500/80 rounded text-[10px] text-red-300 font-mono font-bold">
                    ⚠️ FRAUD COLLECT REQUEST: Approving a collect request DEDUCTS ₹10,000 from your account!
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 text-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400">AIRTEL-ADVISORY</span>
                    <span className="text-[9px] text-slate-400 font-mono">Yesterday</span>
                  </div>
                  <p className="leading-snug text-slate-300 text-[11px]">
                    "CAUTION: Never dial *401*&lt;Number&gt; requested by unknown callers! Dialing *401* activates unconditional call forwarding."
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PHONE DIALER APP VIEW (CASE 3 FATHER - *401* CALL FORWARDING SCAM) */}
          {activeApp === 'dialer' && (
            <div className="space-y-3 font-sans-game">
              {fatherState.screen !== 'calling' ? (
                <>
                  <div className="bg-slate-900 border-2 border-emerald-500 p-2.5 rounded-xl comic-border-sm flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-emerald-200">Phone Dialer</div>
                      <div className="text-[10px] text-emerald-400 font-mono">Default Phone App</div>
                    </div>
                    <Phone size={18} className="text-emerald-400" />
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-3">
                    {/* Dial Display Box */}
                    <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between min-h-[48px]">
                      <div className="font-mono text-xl font-bold text-emerald-400 tracking-wider truncate">
                        {fatherState.digits || <span className="text-slate-600 text-sm font-sans">Type *401*9876543210...</span>}
                      </div>
                      {fatherState.digits && (
                        <button
                          onClick={() => setFatherState(prev => ({ ...prev, digits: prev.digits.slice(0, -1) }))}
                          className="text-slate-400 hover:text-white p-1 font-bold text-sm cursor-pointer"
                          title="Backspace"
                        >
                          ⌫
                        </button>
                      )}
                    </div>

                    {/* Numeric Keypad Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      {['1','2','3','4','5','6','7','8','9','*','0','#'].map((key) => (
                        <button
                          key={key}
                          onClick={() => {
                            playSound('click', soundMuted);
                            setFatherState(prev => ({ ...prev, digits: prev.digits + key }));
                          }}
                          className="h-11 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-100 font-mono text-lg font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow"
                        >
                          {key}
                        </button>
                      ))}
                    </div>

                    {/* Action Bar (Green Call Button) */}
                    <div className="flex items-center justify-center gap-3 pt-1">
                      <button
                        onClick={() => {
                          if (!fatherState.digits) return;
                          playSound('pop', soundMuted);
                          setFatherState(prev => ({ ...prev, screen: 'calling', callTimer: 8 }));
                        }}
                        className="w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full flex items-center justify-center comic-border shadow-xl cursor-pointer active:scale-95 transition-transform"
                        title="Place Call"
                      >
                        <Phone size={24} />
                      </button>
                    </div>

                    {/* Clue Decision Button (If carrier warning clue unlocked) */}
                    {allCluesUnlocked && (
                      <div className="pt-2 border-t border-slate-800">
                        <button
                          onClick={() => {
                            playSound('success', soundMuted);
                            onMissionResult({
                              success: true,
                              scammedAmount: 0,
                              scamType: '*401* Call Forwarding Scam'
                            });
                          }}
                          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl comic-border-sm cursor-pointer shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5"
                        >
                          <ShieldCheck size={16} />
                          <span>🛡️ REFUSE TO DIAL *401* (SCAM DETECTED)</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* HIGH-FIDELITY ANDROID ACTIVE CALL SCREEN VIEW */
                <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 text-center space-y-5 shadow-2xl relative overflow-hidden font-sans-game">
                  {/* Subtle Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-slate-950 to-black pointer-events-none" />

                  {/* Header / Caller Info */}
                  <div className="relative z-10 space-y-2 pt-2">
                    <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-amber-500/80 mx-auto flex items-center justify-center text-2xl shadow-xl animate-pulse">
                      🙋🏽‍♂️
                    </div>
                    <div>
                      <h3 className="font-mono text-lg font-bold text-amber-300 tracking-wider">
                        {fatherState.digits || '*401*9876543210'}
                      </h3>
                      <div className="text-[11px] text-emerald-400 font-mono font-semibold">
                        Active Call Forwarding Request...
                      </div>
                    </div>
                    {/* Timer: 00:08 */}
                    <div className="text-xs font-mono font-bold text-slate-300 bg-slate-900/80 inline-block px-3 py-1 rounded-full border border-slate-800">
                      00:08
                    </div>
                  </div>

                  {/* REALISTIC 2x3 GRID OF CALL ACTION BUTTONS */}
                  <div className="relative z-10 grid grid-cols-3 gap-y-4 gap-x-2 py-2 max-w-xs mx-auto">
                    {/* Mute */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => playSound('click', soundMuted)}
                        className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 flex items-center justify-center shadow cursor-pointer active:scale-95 transition-all"
                      >
                        <Mic size={20} />
                      </button>
                      <span className="text-[10px] font-medium text-slate-300">Mute</span>
                    </div>

                    {/* Keypad */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => playSound('click', soundMuted)}
                        className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 flex items-center justify-center shadow cursor-pointer active:scale-95 transition-all"
                      >
                        <Grid size={20} />
                      </button>
                      <span className="text-[10px] font-medium text-slate-300">Keypad</span>
                    </div>

                    {/* Speaker */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => playSound('click', soundMuted)}
                        className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 flex items-center justify-center shadow cursor-pointer active:scale-95 transition-all"
                      >
                        <Volume2 size={20} />
                      </button>
                      <span className="text-[10px] font-medium text-slate-300">Speaker</span>
                    </div>

                    {/* Add Call */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => playSound('click', soundMuted)}
                        className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 flex items-center justify-center shadow cursor-pointer active:scale-95 transition-all"
                      >
                        <UserPlus size={20} />
                      </button>
                      <span className="text-[10px] font-medium text-slate-300">Add Call</span>
                    </div>

                    {/* Hold */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => playSound('click', soundMuted)}
                        className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 flex items-center justify-center shadow cursor-pointer active:scale-95 transition-all"
                      >
                        <Pause size={20} />
                      </button>
                      <span className="text-[10px] font-medium text-slate-300">Hold</span>
                    </div>

                    {/* Record */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => playSound('click', soundMuted)}
                        className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 flex items-center justify-center shadow cursor-pointer active:scale-95 transition-all"
                      >
                        <CircleDot size={20} className="text-red-400" />
                      </button>
                      <span className="text-[10px] font-medium text-slate-300">Record</span>
                    </div>
                  </div>

                  {/* PROMINENT RED END CALL BUTTON */}
                  <div className="relative z-10 pt-2 flex flex-col items-center">
                    <button
                      onClick={() => {
                        if (allCluesUnlocked) {
                          setFatherState(prev => ({ ...prev, screen: 'dilemma' }));
                        } else {
                          playSound('scammed', soundMuted);
                          onMissionResult({
                            success: false,
                            scammedAmount: 45000,
                            scamType: '*401* Call Forwarding Scam'
                          });
                        }
                      }}
                      className="w-14 h-14 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center comic-border shadow-2xl cursor-pointer active:scale-95 transition-all"
                    >
                      <PhoneOff size={24} />
                    </button>
                    <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest mt-1">End Call</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SMS MESSENGER VIEW */}
          {activeApp === 'sms' && (
            <div className="space-y-3 font-sans-game h-full flex flex-col overflow-hidden">
              <div className="bg-slate-900 border-2 border-red-500 p-2.5 rounded-xl comic-border-sm flex items-center justify-between shrink-0">
                <div>
                  <div className="font-bold text-xs text-red-200">SMS Messenger</div>
                  <div className="text-[10px] text-red-400 font-mono">Messages Inbox ({missionData.messages?.length || 1})</div>
                </div>
                <MessageSquare size={18} className="text-red-400" />
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2.5 text-xs flex-1 overflow-y-auto">
                {characterKey === 'mother_blackout' ? (
                  <div className="p-3 bg-red-950/80 border border-red-700 rounded-lg text-red-100 space-y-1.5">
                    <div className="font-bold text-amber-400">STATE-POWER-DEPT (SMS)</div>
                    <p className="leading-snug">
                      "URGENT: Power connection to your meter will be disconnected tonight at 11:30 PM due to unpaid bill of ₹4,850. Pay immediately via link below."
                    </p>
                    <div className="text-[10px] text-amber-300 font-mono bg-black/60 p-1.5 rounded underline">
                      http://electricity-bill-pay.xyz/urgent
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Top Malicious SMS Alert */}
                    <div className="p-3 bg-red-950/90 border-2 border-red-500 rounded-xl text-red-100 space-y-1.5 shadow-lg animate-pulse">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                          <span>🚨</span> HDFC-ALERT (SMS)
                        </div>
                        <span className="text-[8px] bg-red-600 text-white px-1.5 py-0.2 rounded font-black uppercase">UNREAD</span>
                      </div>
                      <p className="leading-snug font-semibold text-[11px]">
                        "ALERT: ₹49,999 debited from Account **4819 for online purchase at FLIPKART. If not done by you, click link to block transaction immediately!"
                      </p>
                      <div className="text-[10px] text-amber-300 font-mono bg-black/80 p-1.5 rounded underline font-bold border border-amber-500/40">
                        http://hdfc-security-refund.xyz/block
                      </div>
                    </div>

                    {/* Decoy SMS Messages */}
                    {missionData.messages?.filter(m => !m.isMalicious)?.map((msg) => (
                      <div key={msg.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 font-bold text-slate-100">
                            <span>{msg.avatar || '💬'}</span>
                            <span>{msg.sender}</span>
                          </div>
                          <span className="text-[9px] text-slate-500 font-mono">{msg.timestamp}</span>
                        </div>
                        <p className="text-[10px] text-slate-300 leading-snug pl-5">{msg.preview}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* OFFICIAL HDFC BANK APP DASHBOARD VIEW */}
          {activeApp === 'officialBank' && (
            <div className="space-y-3 font-sans-game">
              {/* Corporate Header */}
              <div className="bg-blue-900 border-2 border-blue-950 p-3 rounded-xl comic-border-sm flex items-center justify-between text-white shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center border border-white">
                    HDFC
                  </div>
                  <div>
                    <div className="font-bold text-xs tracking-wide">HDFC Bank MobileBanking</div>
                    <div className="text-[9px] text-blue-200 font-mono">Official Banking App • v12.4</div>
                  </div>
                </div>
                <ShieldCheck size={20} className="text-emerald-400" />
              </div>

              {/* Clean Corporate Dashboard Body */}
              <div className="bg-white border-2 border-blue-900/40 rounded-xl p-3.5 space-y-3 text-slate-900 shadow-xl">
                {/* User Greeting & Masked Account */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Welcome back</div>
                    <div className="text-sm font-black text-blue-950">Welcome, Rifat</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-mono font-bold text-slate-500 uppercase">Primary Account</div>
                    <div className="text-[10px] font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Savings A/c: XXXXXXXX4819
                    </div>
                  </div>
                </div>

                {/* Available Balance Card */}
                <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-3.5 rounded-xl shadow-md relative overflow-hidden space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-blue-200">Net Available Balance</div>
                  <div className="text-2xl font-black font-mono tracking-tight text-white">₹50,000.00</div>
                  <div className="flex items-center justify-between pt-1 text-[9px] font-mono text-emerald-300">
                    <span>STATUS: ACTIVE & SECURE</span>
                    <span>100% INTACT</span>
                  </div>
                </div>

                {/* Mini-Statement (Recent Transactions Clue) */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-blue-950 uppercase tracking-wider">Recent Transactions</span>
                    <span className="text-[9px] font-mono text-blue-700 font-bold">Mini-Statement</span>
                  </div>

                  <div className="space-y-1.5 font-mono text-[10px]">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800">Swiggy Food Order</div>
                        <div className="text-[8px] text-slate-400">Today 01:15 PM • Debit</div>
                      </div>
                      <span className="font-bold text-red-600">- ₹350.00</span>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800">Hostel Mess Fee Payment</div>
                        <div className="text-[8px] text-slate-400">Yesterday 10:30 AM • Debit</div>
                      </div>
                      <span className="font-bold text-red-600">- ₹5,000.00</span>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800">UPI Transfer from Father</div>
                        <div className="text-[8px] text-slate-400">3 Days Ago • Credit</div>
                      </div>
                      <span className="font-bold text-emerald-600">+ ₹10,000.00</span>
                    </div>
                  </div>
                </div>

                {/* Verification Evidence Note */}
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-[10px] font-mono text-emerald-900 leading-snug space-y-0.5">
                  <div className="font-bold flex items-center gap-1 text-emerald-800">
                    ✅ VERIFIED BANK EVIDENCE:
                  </div>
                  <p>
                    Your balance is intact at ₹50,000.00! No ₹49,999 Flipkart transaction exists. The SMS was a fake smishing scam link.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PHISHING REFUND PORTAL (CARD CAPTURE PHISHING) */}
          {activeApp === 'paymentGateway' && (
            <div className="space-y-3 font-sans-game">
              {/* Fake Corporate Banking Header */}
              <div className="bg-blue-900 border-2 border-blue-950 p-2.5 rounded-xl comic-border-sm flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-red-600 text-white font-black text-xs flex items-center justify-center border border-white">
                    HDFC
                  </div>
                  <div>
                    <div className="font-bold text-xs">Transaction Cancellation Portal</div>
                    <div className="text-[9px] text-amber-300 font-mono">http://hdfc-security-refund.xyz/block</div>
                  </div>
                </div>
                <CreditCard size={18} className="text-amber-300" />
              </div>

              {/* Light Deceptive Corporate Cancellation Form */}
              <div className="bg-slate-50 border-2 border-blue-900/30 rounded-xl p-3.5 space-y-3 text-slate-900 shadow-xl">
                <div className="p-2.5 bg-red-50 border border-red-300 rounded-lg text-red-900 text-center space-y-0.5">
                  <div className="font-bold text-xs">Unauthorized Flipkart Reversal (₹49,999)</div>
                  <div className="text-[9px] font-mono text-red-700">Enter Debit Card details to authorize immediate refund.</div>
                </div>

                {/* Form Fields */}
                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">16-Digit Debit Card Number</label>
                    <input
                      type="text"
                      value={protagonistState.cardNumber}
                      onChange={(e) => setProtagonistState(prev => ({ ...prev, cardNumber: e.target.value }))}
                      placeholder="4532 8912 3456 7890"
                      className="w-full bg-white border border-slate-300 focus:border-blue-700 rounded p-2 text-xs font-bold text-slate-800 outline-none shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Expiry Date (MM/YY)</label>
                      <input
                        type="text"
                        value={protagonistState.expiry}
                        onChange={(e) => setProtagonistState(prev => ({ ...prev, expiry: e.target.value }))}
                        placeholder="09/28"
                        className="w-full bg-white border border-slate-300 focus:border-blue-700 rounded p-2 text-xs font-bold text-slate-800 outline-none shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">CVV (3 Digits)</label>
                      <input
                        type="password"
                        maxLength={3}
                        value={protagonistState.cvv}
                        onChange={(e) => setProtagonistState(prev => ({ ...prev, cvv: e.target.value }))}
                        placeholder="•••"
                        className="w-full bg-white border border-slate-300 focus:border-blue-700 rounded p-2 text-xs font-bold text-slate-800 outline-none shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">ATM PIN (4 Digits)</label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="••••"
                      className="w-full bg-white border border-slate-300 focus:border-blue-700 rounded p-2 text-xs font-bold text-slate-800 outline-none shadow-sm"
                    />
                  </div>
                </div>

                {/* Fake Trust Badges */}
                <div className="p-2 bg-slate-200/80 rounded-lg flex items-center justify-around text-[8px] font-mono text-slate-600 font-bold border border-slate-300">
                  <span className="flex items-center gap-0.5">🔒 128-bit SSL Secured</span>
                  <span className="flex items-center gap-0.5">🛡️ PCI DSS Compliant</span>
                  <span className="flex items-center gap-0.5">🏛️ Verified by Visa</span>
                </div>

                {/* The Single Professional Blue Action Button */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => {
                      playSound('scammed', soundMuted);
                      onMissionResult({
                        success: false,
                        scammedAmount: 49999,
                        scamType: 'SMS Smishing & Fake Bank Gateway'
                      });
                    }}
                    className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg shadow-md cursor-pointer active:scale-95 transition-all uppercase tracking-wider"
                  >
                    Authorize Refund & Cancel Transaction
                  </button>

                  {allCluesUnlocked && (
                    <button
                      onClick={() => {
                        playSound('success', soundMuted);
                        onMissionResult({
                          success: true,
                          scammedAmount: 0,
                          scamType: 'SMS Smishing & Fake Bank Gateway'
                        });
                      }}
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl comic-border-sm cursor-pointer shadow-lg active:scale-95 transition-all"
                    >
                      🛡️ CLOSE FAKE PHISHING TAB (SCAM DETECTED)
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* OTHER CASE APPS WITH DECISION UNLOCK LOCKED STATE */}
          {activeApp === 'cbiCall' && (
            <div className="space-y-3 font-sans-game">
              <div className="bg-purple-950/80 border-2 border-purple-500 p-3 rounded-2xl comic-border-sm text-center">
                <div className="w-12 h-12 rounded-full bg-red-600 text-white font-black text-xl flex items-center justify-center mx-auto mb-2 comic-border animate-pulse">
                  👮‍♂️
                </div>
                <h3 className="font-title text-base text-purple-200">{t('cbiCallOfficerTitle')}</h3>
              </div>

              <div className="bg-slate-900 border-2 border-red-500 p-3 rounded-xl comic-border-sm text-xs space-y-2 text-slate-200">
                <p className="leading-tight font-semibold">{t('cbiCallDemandText')}</p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    playSound('scammed', soundMuted);
                    onMissionResult({
                      success: false,
                      scammedAmount: 45000,
                      scamType: 'Digital Arrest Extortion'
                    });
                  }}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-xl comic-border-sm cursor-pointer"
                >
                  {t('cbiPayDepositBtn')}
                </button>

                <button
                  onClick={() => {
                    playSound('success', soundMuted);
                    onMissionResult({
                      success: true,
                      scammedAmount: 0,
                      scamType: 'Digital Arrest Extortion'
                    });
                  }}
                  disabled={!allCluesUnlocked}
                  className={`w-full py-2.5 font-black text-xs rounded-xl comic-border-sm cursor-pointer ${
                    allCluesUnlocked ? 'bg-emerald-500 hover:bg-emerald-400 text-black' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {allCluesUnlocked ? t('cbiHangupReportBtn') : '🔒 Complete Evidence Audit to Unlock'}
                </button>
              </div>
            </div>
          )}

          {/* PDF VIEWER APP VIEW (CASE 5 FATHER ARREST) */}
          {activeApp === 'pdfViewer' && (
            <div className="space-y-3 font-sans-game">
              <div className="bg-slate-900 border-2 border-red-500 p-2.5 rounded-xl comic-border-sm flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-1">
                  <FileText size={14} /> Warrant_Notice_CBI.pdf
                </span>
                <span className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded font-mono">UNVERIFIED</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
                <div className="p-3 bg-red-950/80 border border-red-700 rounded-lg space-y-2 text-red-100">
                  <div className="font-bold text-red-300 uppercase border-b border-red-800 pb-1">
                    CBI Digital Arrest Notice #8912
                  </div>
                  <p className="text-[11px] leading-snug">
                    "Official Arrest Warrant issued for Money Laundering. Sender Email: <span className="font-mono text-amber-300 underline font-bold">cbi-investigation-dept@gmail.com</span>"
                  </p>
                  <div className="p-2 bg-black/70 border border-amber-500 rounded text-[10px] font-mono text-amber-300">
                    ⚠️ SUSPICIOUS EMAIL: Official CBI warrants are sent ONLY from @cbi.gov.in, NEVER from @gmail.com!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TRUECALLER APP VIEW (CASE 5 FATHER ARREST) */}
          {activeApp === 'truecaller' && (
            <div className="space-y-3 font-sans-game">
              <div className="bg-blue-950 border-2 border-blue-500 p-2.5 rounded-xl comic-border-sm flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-blue-200">Truecaller Database</div>
                  <div className="text-[10px] text-blue-400 font-mono">Spam Protection</div>
                </div>
                <ShieldCheck size={18} className="text-blue-400" />
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
                <div className="p-3 bg-red-950/80 border border-red-700 rounded-lg text-red-100 space-y-1">
                  <div className="font-bold text-red-300 text-sm">Caller: +91 91234 56789</div>
                  <div className="text-xs text-red-400 font-bold">🚨 Flagged by 1,420 Users</div>
                  <div className="text-[10px] text-slate-300 pt-1 font-mono">
                    Category: Digital Arrest Cyber Extortion Scam
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TELEGRAM JOB APP VIEW (CASE 6 SIBLING TASK) */}
          {activeApp === 'telegramJob' && (
            <div className="space-y-3 font-sans-game">
              <div className="bg-cyan-950/80 border-2 border-cyan-500 p-3 rounded-2xl comic-border-sm">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs border-b border-slate-800 pb-2 mb-2">
                  <MessageSquare size={16} />
                  <span>{t('telegramRecruiterTitle')}</span>
                </div>
                <p className="text-xs text-slate-200 leading-snug">{t('telegramOfferText')}</p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    playSound('scammed', soundMuted);
                    onMissionResult({
                      success: false,
                      scammedAmount: 1500,
                      scamType: 'Fake Placement Task Scam'
                    });
                  }}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-xl comic-border-sm cursor-pointer"
                >
                  {t('telegramPayDepositBtn')}
                </button>

                <button
                  onClick={() => {
                    playSound('success', soundMuted);
                    onMissionResult({
                      success: true,
                      scammedAmount: 0,
                      scamType: 'Fake Placement Task Scam'
                    });
                  }}
                  disabled={!allCluesUnlocked}
                  className={`w-full py-2.5 font-black text-xs rounded-xl comic-border-sm cursor-pointer ${
                    allCluesUnlocked ? 'bg-emerald-500 hover:bg-emerald-400 text-black' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {allCluesUnlocked ? t('telegramReportScamBtn') : '🔒 Complete Evidence Audit to Unlock'}
                </button>
              </div>
            </div>
          )}

          {/* COMPANY REVIEWS APP VIEW (CASE 6 SIBLING TASK) */}
          {activeApp === 'companyReviews' && (
            <div className="space-y-3 font-sans-game">
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300">Glassdoor Reviews</span>
                <span className="text-[10px] text-red-400 font-bold">Rating 1.1 ★</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
                <div className="p-2.5 bg-red-950/80 border border-red-800 rounded-lg text-red-100 space-y-1">
                  <div className="font-bold text-red-300">Review: "FRAUD TASK SCAM"</div>
                  <p className="text-[11px] leading-snug">
                    "They promised ₹500 per YouTube like task, but demanded ₹1,500 security deposit then blocked me immediately!"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* COLLEGE NOTICE APP VIEW (CASE 6 SIBLING TASK) */}
          {activeApp === 'collegeNotice' && (
            <div className="space-y-3 font-sans-game">
              <div className="bg-emerald-950 border-2 border-emerald-500 p-2.5 rounded-xl comic-border-sm flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-emerald-200">College Placement Cell</div>
                  <div className="text-[10px] text-emerald-400 font-mono">Official Advisory</div>
                </div>
                <Info size={18} className="text-emerald-400" />
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
                <div className="p-3 bg-emerald-950/80 border border-emerald-700 rounded-lg text-emerald-100 leading-snug">
                  <div className="font-bold text-amber-400 mb-1">STUDENT WARNING:</div>
                  "No legitimate employer demands advance security deposits for part-time task jobs. Report Telegram task recruiter groups immediately."
                </div>
              </div>
            </div>
          )}

          {/* UTILITY APP VIEW (CASE 7 MOTHER BLACKOUT - STATE POWER UTILITY PHISHING PORTAL) */}
          {activeApp === 'utilityApp' && (
            <div className="space-y-3 font-sans-game">
              <div className="bg-slate-900 border-2 border-emerald-500 p-2.5 rounded-xl comic-border-sm flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-emerald-200">State Electricity Board (TNEB Quick Pay)</div>
                  <div className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                    <span>🌐 http://tneb-quickpay-discom-bill.xyz</span>
                    <span className="text-red-400 font-bold">⚠️ UNSECURE DOMAIN</span>
                  </div>
                </div>
                <Layers size={18} className="text-emerald-400" />
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-3 text-xs">
                <div className="p-3.5 bg-red-950/80 border-2 border-red-600 rounded-xl text-center space-y-1.5">
                  <div className="text-[10px] text-red-300 font-mono font-bold uppercase tracking-wider">
                    🚨 IMMEDIATE DISCONNECTION NOTICE
                  </div>
                  <div className="text-2xl font-black font-mono text-red-400">₹4,850.00 (OVERDUE)</div>
                  <div className="text-[10px] text-slate-200 font-mono font-bold">
                    Power supply scheduled for cutoff at 11:30 PM tonight!
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="font-bold text-slate-200 text-xs border-b border-slate-800 pb-1">
                    Quick Meter Bill Settlement Form
                  </div>
                  <div className="space-y-1.5 font-mono text-[10px]">
                    <div>
                      <span className="text-slate-400">Consumer Number:</span> <span className="text-slate-200 font-bold">883910</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Meter Serial:</span> <span className="text-slate-200 font-bold">TNEB-MTR-9048</span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-amber-950/80 border border-amber-600 rounded-lg text-[10px] text-amber-200 font-mono leading-snug">
                  🔍 SUSPICIOUS SIGNS: Mismatched state board logo, domain ends in <span className="font-bold text-amber-300">.xyz</span> instead of official government <span className="font-bold text-emerald-300">.gov.in</span>, and threatens immediate midnight power disconnection!
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => {
                      playSound('scammed', soundMuted);
                      onMissionResult({
                        success: false,
                        scammedAmount: 4850,
                        scamType: 'Fake Electricity Bill Disconnection Phishing'
                      });
                    }}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-xl comic-border-sm cursor-pointer"
                  >
                    Pay ₹4,850 Overdue Bill via Quick Pay
                  </button>

                  <button
                    onClick={() => {
                      playSound('success', soundMuted);
                      onMissionResult({
                        success: true,
                        scammedAmount: 0,
                        scamType: 'Fake Electricity Bill Disconnection Phishing'
                      });
                    }}
                    disabled={!allCluesUnlocked}
                    className={`w-full py-2.5 font-black text-xs rounded-xl comic-border-sm cursor-pointer ${
                      allCluesUnlocked ? 'bg-emerald-500 hover:bg-emerald-400 text-black' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {allCluesUnlocked ? '🔒 Close Phishing Portal & Report to Electricity Board' : '🔒 Complete Evidence Audit to Unlock'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* APT CHAT APP VIEW (CASE 7 MOTHER BLACKOUT) */}
          {activeApp === 'aptChat' && (
            <div className="space-y-3 font-sans-game">
              <div className="bg-blue-950 border-2 border-blue-500 p-2.5 rounded-xl comic-border-sm flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                  🏢
                </div>
                <div>
                  <div className="font-bold text-xs text-blue-200">Apartment Society Group</div>
                  <div className="text-[10px] text-blue-400 font-mono">Building Admin</div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
                <div className="bg-blue-950/80 border border-blue-700/60 p-3 rounded-lg text-blue-100 font-sans-game space-y-1">
                  <div className="text-[10px] font-bold text-amber-400">Society Admin (11:05 PM)</div>
                  <p className="leading-snug text-slate-100 font-semibold">
                    "All residents please note: The power grid is working normally. Ignore fake SMS messages claiming power cutoff!"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SCANNER APP VIEW (CASE 8 PROTAGONIST QR) */}
          {activeApp === 'scanner' && (
            <div className="space-y-3 font-sans-game">
              <div className="bg-rose-950/80 border-2 border-rose-500 p-3 rounded-2xl comic-border-sm text-center">
                <h3 className="font-title text-base text-rose-200">{t('qrScannerTitle')}</h3>
              </div>

              <div className="bg-slate-900 border-2 border-red-500 p-3 rounded-xl comic-border-sm text-xs text-red-300 font-mono font-bold">
                {t('qrScannerPrompt')}
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    playSound('scammed', soundMuted);
                    onMissionResult({
                      success: false,
                      scammedAmount: 3000,
                      scamType: 'Reverse UPI QR Code Scam'
                    });
                  }}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-xl comic-border-sm cursor-pointer"
                >
                  {t('qrPayPinBtn')}
                </button>

                <button
                  onClick={() => {
                    playSound('success', soundMuted);
                    onMissionResult({
                      success: true,
                      scammedAmount: 0,
                      scamType: 'Reverse UPI QR Code Scam'
                    });
                  }}
                  disabled={!allCluesUnlocked}
                  className={`w-full py-2.5 font-black text-xs rounded-xl comic-border-sm cursor-pointer ${
                    allCluesUnlocked ? 'bg-emerald-500 hover:bg-emerald-400 text-black' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {allCluesUnlocked ? t('qrRejectScamBtn') : '🔒 Complete Evidence Audit to Unlock'}
                </button>
              </div>
            </div>
          )}

          {/* OLX MARKET APP VIEW (CASE 8 PROTAGONIST QR) */}
          {activeApp === 'olxMarket' && (
            <div className="space-y-3 font-sans-game">
              <div className="bg-amber-950 border-2 border-amber-500 p-2.5 rounded-xl comic-border-sm flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center font-bold text-black text-xs">
                  🛒
                </div>
                <div>
                  <div className="font-bold text-xs text-amber-200">OLX Buyer Chat</div>
                  <div className="text-[10px] text-amber-400 font-mono">Buyer: Vikram</div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
                <div className="bg-amber-950/80 border border-amber-700/60 p-3 rounded-lg text-amber-100 font-sans-game space-y-1">
                  <div className="text-[10px] font-bold text-amber-400">Vikram Buyer (11:20 AM)</div>
                  <p className="leading-snug text-slate-100 font-semibold">
                    "I am buying your sofa. Scan this QR code and enter your UPI PIN to receive ₹3,000 advance payment."
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* BANK TIPS APP VIEW (CASE 8 PROTAGONIST QR) */}
          {activeApp === 'bankTips' && (
            <div className="space-y-3 font-sans-game">
              <div className="bg-emerald-950 border-2 border-emerald-500 p-2.5 rounded-xl comic-border-sm flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-emerald-200">Central Bank UPI Safety</div>
                  <div className="text-[10px] text-emerald-400 font-mono">NPCI Guidelines</div>
                </div>
                <Shield size={18} className="text-emerald-400" />
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
                <div className="p-3 bg-emerald-950/80 border border-emerald-700 rounded-lg text-emerald-100 leading-snug space-y-1">
                  <div className="font-bold text-amber-400">GOLDEN RULE OF UPI:</div>
                  <p className="font-semibold text-slate-100">
                    "UPI PIN is ONLY required to DEDUCT money from your account. You NEVER need to enter your PIN to RECEIVE money!"
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* FLOATING INVESTIGATION NOTEPAD WIDGET */}
        <div className="absolute bottom-14 right-2 z-40">
          {!isNotepadOpen ? (
            <button
              onClick={() => {
                playSound('pop', soundMuted);
                setIsNotepadOpen(true);
              }}
              className="py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] rounded-xl comic-border border-2 flex items-center gap-1 shadow-lg animate-pulse cursor-pointer"
            >
              <ClipboardList size={14} />
              <span>Clues ({unlockedClues.length}/{requiredClues.length})</span>
              <ChevronUp size={12} />
            </button>
          ) : (
            <div className="w-64 bg-slate-900 border-2 border-amber-500 rounded-xl p-3 comic-border shadow-2xl text-xs space-y-2 select-none">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="font-bold text-amber-400 flex items-center gap-1 text-[11px]">
                  <ClipboardList size={14} /> Evidence Checklist
                </span>
                <button
                  onClick={() => setIsNotepadOpen(false)}
                  className="text-amber-400 hover:text-white font-black text-xs cursor-pointer"
                >
                  <ChevronDown size={14} />
                </button>
              </div>

              <div className="space-y-1.5 text-[10px] font-mono">
                {requiredClues.map((clue) => {
                  const isDone = unlockedClues.includes(clue.id);
                  return (
                    <div
                      key={clue.id}
                      className={`p-1.5 rounded flex items-start gap-1.5 ${
                        isDone ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      <span className="shrink-0 mt-0.5">{isDone ? '✅' : '🔒'}</span>
                      <span className="leading-tight">{clue.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="text-[9px] text-amber-400/80 font-mono text-center pt-1 border-t border-slate-800">
                {allCluesUnlocked ? '✅ All Clues Verified! Decision Unlocked.' : '🔒 Audit all clues to unlock decision.'}
              </div>
            </div>
          )}
        </div>

        {/* FINAL VERDICT DECISION MODAL OVERLAY */}
        {showDecisionModal && (
          <div className="absolute inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-slate-950 border-2 border-amber-500 rounded-2xl p-5 shadow-2xl space-y-4 text-center relative comic-border-amber">
              
              {/* Close Modal Button */}
              <button 
                onClick={() => {
                  playSound('click', soundMuted);
                  setShowDecisionModal(false);
                }}
                className="absolute top-3 right-3 text-slate-400 hover:text-amber-400 p-1 cursor-pointer font-bold"
                title="Cancel"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div className="space-y-1 pt-1">
                <div className="inline-block px-3 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full font-mono text-[10px] uppercase font-bold tracking-widest">
                  ⚖️ FINAL VERDICT
                </div>
                <h3 className="text-base font-black text-amber-300 font-mono tracking-wide">
                  CASE DECISION
                </h3>
              </div>

              {/* Threat Prompt Display */}
              <div className="bg-slate-900/90 border border-amber-500/40 p-3.5 rounded-xl shadow-inner text-left">
                <div className="text-[9px] text-amber-400/90 font-mono font-bold uppercase tracking-wider mb-1">
                  MISSION THREAT PROMPT:
                </div>
                <p className="text-slate-100 font-bold text-xs leading-relaxed">
                  "{currentThreat.prompt}"
                </p>
              </div>

              {/* Massive Decision Buttons Side-by-Side */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Option A (The Trap) */}
                <button
                  onClick={() => {
                    playSound('scammed', soundMuted);
                    setShowDecisionModal(false);
                    setMissionResult('scammed');
                  }}
                  className="p-3 bg-slate-900/90 border-2 border-red-600/60 text-red-400 hover:bg-red-950 hover:border-red-500 hover:text-red-200 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all cursor-pointer rounded-xl flex flex-col items-center justify-between text-center font-bold text-[11px] space-y-2 group comic-border-sm min-h-[110px]"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">⚠️</span>
                  <span className="text-[9px] text-red-500 uppercase tracking-wider font-mono font-black">OPTION A (THE TRAP)</span>
                  <span className="leading-tight font-sans-game">{currentThreat.optionA}</span>
                </button>

                {/* Option B (The Safe Route) */}
                <button
                  onClick={() => {
                    playSound('success', soundMuted);
                    setShowDecisionModal(false);
                    setMissionResult('survived');
                  }}
                  className="p-3 bg-slate-900/90 border-2 border-emerald-500/60 text-emerald-400 hover:bg-emerald-950 hover:border-emerald-400 hover:text-emerald-200 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all cursor-pointer rounded-xl flex flex-col items-center justify-between text-center font-bold text-[11px] space-y-2 group comic-border-sm min-h-[110px]"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">🛡️</span>
                  <span className="text-[9px] text-emerald-500 uppercase tracking-wider font-mono font-black">OPTION B (SAFE ROUTE)</span>
                  <span className="leading-tight font-sans-game">{currentThreat.optionB}</span>
                </button>
              </div>

              <div className="text-[9px] text-slate-400 font-mono italic">
                Choose wisely. Your choice determines family safety & vault integrity.
              </div>
            </div>
          </div>
        )}

        {/* OUTCOME SCREEN: SCAMMED ("YOU GOT COOKED!") */}
        {missionResult === 'scammed' && (
          <div className="absolute inset-0 z-[130] bg-black/95 flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-sm bg-red-950/95 border-4 border-red-600 rounded-2xl p-5 shadow-[0_0_50px_rgba(239,68,68,0.7)] text-center space-y-4 relative comic-border-red">
              <div className="text-5xl animate-bounce">💀</div>
              
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-red-500 tracking-wider font-mono uppercase">
                  YOU GOT COOKED!
                </h2>
                <div className="text-[10px] font-mono text-red-300 font-bold tracking-widest uppercase">
                  CRITICAL SCAM BREACH OCCURRED
                </div>
              </div>

              <div className="bg-black/85 border border-red-700/80 p-3.5 rounded-xl text-left space-y-2.5 text-xs font-mono">
                <div className="flex justify-between items-center border-b border-red-900 pb-1.5 text-red-400 font-bold text-[10px]">
                  <span>SCAM PATTERN:</span>
                  <span className="truncate max-w-[170px]">{currentThreat.scamType}</span>
                </div>

                <p className="text-slate-200 leading-relaxed font-semibold text-[11px]">
                  {currentThreat.cookedDetails}
                </p>

                <div className="p-2 bg-red-900/40 border border-red-600 rounded-lg text-red-200 text-[10px] font-mono flex items-center gap-2">
                  <span className="text-lg shrink-0">⚠️</span>
                  <span>Vault funds drained & personal contacts compromised!</span>
                </div>
              </div>

              <button
                onClick={() => {
                  playSound('click', soundMuted);
                  onMissionResult({
                    success: false,
                    scammedAmount: 15000,
                    scamType: currentThreat.scamType,
                    warning: currentThreat.cookedDetails
                  });
                }}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase rounded-xl border-2 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.7)] transition-all cursor-pointer comic-border flex items-center justify-center gap-2 tracking-wider font-mono"
              >
                <span>🔙 RETURN TO CASE BOARD</span>
              </button>
            </div>
          </div>
        )}

        {/* OUTCOME SCREEN: SURVIVED ("SCAM AVERTED") */}
        {missionResult === 'survived' && (
          <div className="absolute inset-0 z-[130] bg-black/95 flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-sm bg-emerald-950/95 border-4 border-emerald-500 rounded-2xl p-5 shadow-[0_0_50px_rgba(16,185,129,0.6)] text-center space-y-4 relative comic-border">
              <div className="text-5xl animate-bounce">🛡️</div>
              
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-emerald-400 tracking-wider font-mono uppercase">
                  SCAM AVERTED
                </h2>
                <div className="text-[10px] font-mono text-emerald-300 font-bold tracking-widest uppercase">
                  EXCELLENT DETECTIVE WORK!
                </div>
              </div>

              <div className="bg-black/85 border border-emerald-700/80 p-3.5 rounded-xl text-left space-y-2.5 text-xs font-mono">
                <div className="flex justify-between items-center border-b border-emerald-900 pb-1.5 text-emerald-400 font-bold text-[10px]">
                  <span>THREAT NEUTRALIZED:</span>
                  <span className="truncate max-w-[170px]">{currentThreat.scamType}</span>
                </div>

                <p className="text-slate-200 leading-relaxed font-semibold text-[11px]">
                  {currentThreat.avertedDetails}
                </p>

                <div className="p-2 bg-emerald-900/40 border border-emerald-500 rounded-lg text-emerald-200 text-[10px] font-mono flex items-center gap-2">
                  <span className="text-lg shrink-0">💰</span>
                  <span><strong className="text-amber-300">+₹5,000 Detective Bonus</strong> added to Family Vault!</span>
                </div>
              </div>

              <button
                onClick={() => {
                  playSound('success', soundMuted);
                  onMissionResult({
                    success: true,
                    scammedAmount: 0,
                    scamType: currentThreat.scamType,
                    warning: currentThreat.avertedDetails
                  });
                }}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase rounded-xl border-2 border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.7)] transition-all cursor-pointer comic-border flex items-center justify-center gap-2 tracking-wider font-mono"
              >
                <span>🔙 RETURN TO CASE BOARD</span>
              </button>
            </div>
          </div>
        )}

        {/* UNIVERSAL BOTTOM NAVIGATION BAR */}
        <div className="shrink-0 w-full h-12 bg-zinc-950 border-t border-zinc-700 flex items-center justify-center z-[100]">
          <button 
            onClick={() => {
              playSound('click', soundMuted);
              setSelectedPhoto(null);
              if (activeApp !== null) {
                setActiveApp(null);
              } else {
                handleNavPutDown();
              }
            }} 
            className="text-amber-500 font-bold active:scale-95 px-6 py-2 cursor-pointer"
          >
            ◀ BACK
          </button>
        </div>

      </div>

    </div>
  );
}
