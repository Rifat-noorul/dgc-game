import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle2, Sparkles, Footprints, Info } from 'lucide-react';
import { playSound } from '../audio/soundEngine';
import { getTranslation } from '../localization/translations';

export default function WalkableOverworld({ characterKey, onCompleteOverworld, onBackToBoard, soundMuted, currentLanguage, familyVault, setFamilyVault, onDeductVault }) {
  const canvasRef = useRef(null);

  const t = (key, params) => getTranslation(currentLanguage, key, params);



  // Virtual player position state (in 640x380 virtual coordinate space)
  const [playerPos, setPlayerPos] = useState({ x: 90, y: 300 });

  const [playerDir, setPlayerDir] = useState('right');
  const [isMoving, setIsMoving] = useState(false);

  // Objectives tracking & Hold-to-Interact
  const [stageProgress, setStageProgress] = useState({ step1: false, step2: false });
  const [interactPrompt, setInteractPrompt] = useState(null);
  const [dialogueText, setDialogueText] = useState(null);
  const [isZoomingPhone, setIsZoomingPhone] = useState(false);

  // Action Comic Overlay & Hazard Disclaimer Overlay State
  const [activeComic, setActiveComic] = useState(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const showDisclaimerRef = useRef(true);
  const disclaimerBtnRef = useRef(null);

  useEffect(() => {
    showDisclaimerRef.current = showDisclaimer;
    if (showDisclaimer && disclaimerBtnRef.current) {
      disclaimerBtnRef.current.focus();
    }
  }, [showDisclaimer]);

  const dustParticlesRef = useRef([]);

  // NPC Stranger position for Father's stage (animated pacing)
  const [npcPos, setNpcPos] = useState({ x: 520, y: 210 });
  const npcDirRef = useRef(-1);

  // Joystick touch state
  const joystickRef = useRef({ active: false, startX: 0, startY: 0, deltaX: 0, deltaY: 0 });
  const [joystickThumb, setJoystickThumb] = useState({ x: 0, y: 0 });

  // Keys active tracking ref
  const activeKeysRef = useRef(new Set());

  // Comprehensive Level Configuration Map for all 8 Missions
  const levelConfigs = {
    mother: {
      nameKey: "motherStageName",
      characterRole: 'mother',
      characterName: 'Mother',
      color: '#991b1b',
      accentColor: '#fbbf24',
      primaryTarget: { x: 310, y: 110, id: 'mixer', label: 'Burnt Mixer Counter' },
      phoneTarget: { x: 510, y: 240, id: 'table', label: 'Kitchen Phone Desk' },
      props: [
        { id: 'fridge', name: 'FRIDGE', label: 'FRIDGE', x: 50, y: 35, w: 75, h: 100 },
        { id: 'stove', name: 'GAS STOVE', label: 'STOVE', x: 140, y: 35, w: 90, h: 70 },
        { id: 'mixer_counter', name: 'MIXER COUNTER', label: 'MIXER COUNTER', x: 240, y: 35, w: 160, h: 70 },
        { id: 'phone_desk', name: 'PHONE DESK', label: 'PHONE DESK', x: 450, y: 180, w: 150, h: 90 }
      ],
      hazards: [
        { id: 'haz_m1', x: 250, y: 260, w: 65, h: 50, label: '⚡ SPARKING WIRES' },
        { id: 'haz_m2', x: 410, y: 105, w: 60, h: 45, label: '⚡ HIGH VOLTAGE' }
      ],
      obstacles: [
        { id: 'obs_m1', name: 'WALL BARRIER', x: 190, y: 140, w: 20, h: 140 },
        { id: 'obs_m2', name: 'WALL BARRIER', x: 340, y: 65, w: 20, h: 160 }
      ]
    },
    father: {
      nameKey: "fatherStageName",
      characterRole: 'father',
      characterName: 'Father',
      color: '#334155',
      accentColor: '#94a3b8',
      primaryTarget: { x: 270, y: 150, id: 'teaStall', label: 'Tea Stall Counter' },
      phoneTarget: { x: 480, y: 210, id: 'strangerNPC', label: 'Frantic Stranger' },
      props: [
        { id: 'tea_counter', name: 'TEA STALL COUNTER', label: 'TEA COUNTER', x: 160, y: 40, w: 230, h: 90 },
        { id: 'customer_bench', name: 'CUSTOMER BENCH', label: 'BENCH', x: 400, y: 200, w: 140, h: 40 },
        { id: 'tea_stalls_shelf', name: 'GLASS SHELF', label: 'TEA SHELF', x: 50, y: 40, w: 90, h: 80 }
      ],
      hazards: [
        { id: 'haz_f1', x: 220, y: 270, w: 65, h: 45, label: '⚡ EXPOSED CABLE' },
        { id: 'haz_f2', x: 330, y: 130, w: 60, h: 50, label: '⚡ SPARKING WIRES' }
      ],
      obstacles: [
        { id: 'obs_f1', name: 'WALL BARRIER', x: 260, y: 160, w: 20, h: 140 },
        { id: 'obs_f2', name: 'WALL BARRIER', x: 380, y: 65, w: 20, h: 150 }
      ]
    },
    sibling: {
      nameKey: "siblingStageName",
      characterRole: 'sibling',
      characterName: 'Sibling',
      color: '#3730a3',
      accentColor: '#818cf8',
      primaryTarget: { x: 210, y: 110, id: 'wallet', label: 'Study Desk' },
      phoneTarget: { x: 510, y: 240, id: 'bedPhone', label: 'Hostel Bed Phone' },
      props: [
        { id: 'study_desk', name: 'STUDY DESK', label: 'STUDY DESK', x: 120, y: 40, w: 180, h: 60 },
        { id: 'hostel_bed', name: 'HOSTEL BED', label: 'HOSTEL BED', x: 420, y: 70, w: 180, h: 140 },
        { id: 'wardrobe', name: 'WARDROBE', label: 'WARDROBE', x: 40, y: 40, w: 70, h: 110 }
      ],
      hazards: [
        { id: 'haz_s1', x: 230, y: 250, w: 60, h: 50, label: '⚡ FAULTY OUTLET' },
        { id: 'haz_s2', x: 380, y: 130, w: 60, h: 45, label: '⚡ SPARKING WIRES' }
      ],
      obstacles: [
        { id: 'obs_s1', name: 'WALL BARRIER', x: 180, y: 150, w: 20, h: 150 },
        { id: 'obs_s2', name: 'WALL BARRIER', x: 330, y: 65, w: 20, h: 160 }
      ]
    },
    protagonist: {
      nameKey: "protagonistStageName",
      characterRole: 'protagonist',
      characterName: 'Protagonist',
      color: '#0ea5e9',
      accentColor: '#38bdf8',
      primaryTarget: { x: 520, y: 110, id: 'clock', label: 'Biometric Clock' },
      phoneTarget: { x: 230, y: 250, id: 'desk', label: 'Office Desk' },
      props: [
        { id: 'office_desk', name: 'OFFICE DESK', label: 'OFFICE DESK', x: 140, y: 170, w: 200, h: 80 },
        { id: 'biometric_clock', name: 'BIOMETRIC CLOCK', label: 'BIO CLOCK', x: 490, y: 65, w: 65, h: 70 },
        { id: 'wall_board', name: 'NOTICE BOARD', label: 'NOTICE BOARD', x: 40, y: 50, w: 80, h: 70 }
      ],
      hazards: [
        { id: 'haz_p1', x: 290, y: 110, w: 65, h: 45, label: '⚡ LIVE SERVER CABLE' },
        { id: 'haz_p2', x: 440, y: 250, w: 60, h: 50, label: '⚡ SPARKING WIRES' }
      ],
      obstacles: [
        { id: 'obs_p1', name: 'WALL BARRIER', x: 220, y: 65, w: 20, h: 140 },
        { id: 'obs_p2', name: 'WALL BARRIER', x: 380, y: 170, w: 20, h: 140 }
      ]
    },
    father_arrest: {
      nameKey: "fatherArrestStageName",
      characterRole: 'father',
      characterName: 'Father',
      color: '#581c87',
      accentColor: '#c084fc',
      primaryTarget: { x: 220, y: 120, id: 'tv', label: 'Living Room TV' },
      phoneTarget: { x: 500, y: 240, id: 'table', label: 'Coffee Table Phone' },
      props: [
        { id: 'tv_unit', name: 'LIVING ROOM TV', label: 'TV UNIT', x: 180, y: 40, w: 120, h: 60 },
        { id: 'coffee_table', name: 'COFFEE TABLE', label: 'COFFEE TABLE', x: 440, y: 190, w: 130, h: 70 },
        { id: 'sofa_set', name: 'SOFA SET', label: 'SOFA SET', x: 40, y: 180, w: 120, h: 80 }
      ],
      hazards: [
        { id: 'haz_fa1', x: 240, y: 260, w: 60, h: 50, label: '⚡ DAMAGED CORD' },
        { id: 'haz_fa2', x: 390, y: 120, w: 60, h: 45, label: '⚡ SPARKING WIRES' }
      ],
      obstacles: [
        { id: 'obs_fa1', name: 'WALL BARRIER', x: 170, y: 160, w: 20, h: 140 },
        { id: 'obs_fa2', name: 'WALL BARRIER', x: 360, y: 65, w: 20, h: 150 }
      ]
    },
    sibling_task: {
      nameKey: "siblingTaskStageName",
      characterRole: 'sibling',
      characterName: 'Sibling',
      color: '#0891b2',
      accentColor: '#22d3ee',
      primaryTarget: { x: 200, y: 110, id: 'books', label: 'Library Books' },
      phoneTarget: { x: 500, y: 240, id: 'desk', label: 'Study Desk Phone' },
      props: [
        { id: 'library_books', name: 'LIBRARY BOOKSHELF', label: 'BOOKSHELF', x: 150, y: 30, w: 120, h: 80 },
        { id: 'study_desk', name: 'STUDY DESK', label: 'STUDY DESK', x: 440, y: 190, w: 130, h: 70 },
        { id: 'reading_table', name: 'READING TABLE', label: 'READING TABLE', x: 40, y: 160, w: 110, h: 70 }
      ],
      hazards: [
        { id: 'haz_st1', x: 240, y: 250, w: 60, h: 50, label: '⚡ EXPOSED WIRING' },
        { id: 'haz_st2', x: 390, y: 120, w: 60, h: 45, label: '⚡ SPARKING WIRES' }
      ],
      obstacles: [
        { id: 'obs_st1', name: 'WALL BARRIER', x: 180, y: 150, w: 20, h: 150 },
        { id: 'obs_st2', name: 'WALL BARRIER', x: 340, y: 65, w: 20, h: 160 }
      ]
    },
    mother_blackout: {
      nameKey: "motherBlackoutStageName",
      characterRole: 'mother',
      characterName: 'Mother',
      color: '#1c1917',
      accentColor: '#f59e0b',
      primaryTarget: { x: 220, y: 110, id: 'switchboard', label: 'Circuit Switchboard' },
      phoneTarget: { x: 450, y: 160, id: 'table', label: 'Utility Desk Phone' },
      props: [
        { id: 'switchboard', name: 'CIRCUIT SWITCHBOARD', label: 'SWITCHBOARD', x: 190, y: 50, w: 60, h: 50 },
        { id: 'utility_desk', name: 'UTILITY DESK', label: 'UTILITY DESK', x: 400, y: 120, w: 100, h: 60 },
        { id: 'fuse_cabinet', name: 'FUSE CABINET', label: 'FUSE CABINET', x: 40, y: 40, w: 80, h: 90 }
      ],
      hazards: [
        { id: 'haz_mb1', x: 220, y: 240, w: 65, h: 50, label: '⚡ SHORT CIRCUIT SPARK' },
        { id: 'haz_mb2', x: 370, y: 100, w: 60, h: 45, label: '⚡ SPARKING WIRES' }
      ],
      obstacles: [
        { id: 'obs_mb1', name: 'WALL BARRIER', x: 160, y: 140, w: 20, h: 150 },
        { id: 'obs_mb2', name: 'WALL BARRIER', x: 330, y: 65, w: 20, h: 160 }
      ]
    },
    protagonist_qr: {
      nameKey: "protagonistQrStageName",
      characterRole: 'protagonist',
      characterName: 'Protagonist',
      color: '#e11d48',
      accentColor: '#fb7185',
      primaryTarget: { x: 200, y: 110, id: 'books', label: 'Bookshelf' },
      phoneTarget: { x: 500, y: 240, id: 'bed', label: 'Scanner Bed Phone' },
      props: [
        { id: 'bookshelf', name: 'BOOKSHELF', label: 'BOOKSHELF', x: 150, y: 30, w: 110, h: 80 },
        { id: 'scanner_bed', name: 'SCANNER BED', label: 'SCANNER BED', x: 450, y: 190, w: 110, h: 70 },
        { id: 'storage_box', name: 'STORAGE BOXES', label: 'STORAGE BOXES', x: 40, y: 160, w: 80, h: 60 }
      ],
      hazards: [
        { id: 'haz_pq1', x: 250, y: 250, w: 60, h: 50, label: '⚡ BROKEN CHARGER' },
        { id: 'haz_pq2', x: 410, y: 120, w: 60, h: 45, label: '⚡ SPARKING WIRES' }
      ],
      obstacles: [
        { id: 'obs_pq1', name: 'WALL BARRIER', x: 190, y: 150, w: 20, h: 140 },
        { id: 'obs_pq2', name: 'WALL BARRIER', x: 360, y: 65, w: 20, h: 150 }
      ]
    }
  };

  // Default Safe Fallback Configuration for undefined or incomplete levels
  const fallbackConfig = {
    nameKey: "motherStageName",
    characterRole: 'mother',
    characterName: 'Investigator',
    color: '#1c1917',
    accentColor: '#f59e0b',
    primaryTarget: { x: 300, y: 150, id: 'investigate', label: 'Investigate Area' },
    phoneTarget: { x: 500, y: 240, id: 'phone', label: 'Secure Phone Desk' },
    props: [],
    hazards: [],
    obstacles: []
  };

  const hazardHitRef = useRef(false);

  const config = levelConfigs[characterKey] || fallbackConfig;

  // Active target coordinates based on step 1 vs step 2
  const activeTargetPos = stageProgress.step1
    ? (config?.phoneTarget || fallbackConfig.phoneTarget)
    : (config?.primaryTarget || fallbackConfig.primaryTarget);

  // Prop Visual Helper Rendering SVGs and 2.5D Shapes
  const renderPropVisual = (prop) => {
    switch (prop.id) {
      case 'mixer_counter':
        return (
          <div className="w-full h-full bg-amber-950/90 border-4 border-black rounded-lg shadow-[4px_6px_0px_rgba(0,0,0,0.8)] relative flex items-center justify-around p-2">
            <div className="absolute inset-x-2 top-2 h-1 bg-amber-900/60 rounded" />
            <div className="relative flex flex-col items-center">
              <div className="absolute -top-6 flex gap-1 pointer-events-none z-30">
                <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-smoke-rise" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-smoke-rise" style={{ animationDelay: '0.4s' }} />
                <div className="w-3 h-3 bg-slate-500 rounded-full animate-smoke-rise" style={{ animationDelay: '0.8s' }} />
              </div>
              <svg className="w-10 h-12 drop-shadow-md" viewBox="0 0 40 50">
                <path d="M 12 10 L 28 10 L 25 32 L 15 32 Z" fill="rgba(255,255,255,0.75)" stroke="black" strokeWidth="2.5" />
                <rect x="10" y="6" width="20" height="4" rx="1" fill="#78350f" stroke="black" strokeWidth="2" />
                <path d="M 28 15 C 34 15, 34 25, 26 26" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 10 32 L 30 32 L 34 46 L 6 46 Z" fill="#d97706" stroke="black" strokeWidth="2.5" />
                <circle cx="20" cy="40" r="3" fill="black" />
              </svg>
            </div>
          </div>
        );

      case 'phone_desk':
      case 'utility_desk':
      case 'coffee_table':
      case 'scanner_bed':
        return (
          <div className="w-full h-full bg-amber-900/90 border-4 border-black rounded-lg shadow-[4px_6px_0px_rgba(0,0,0,0.8)] relative flex items-center justify-center p-2">
            <div className="absolute inset-x-2 top-1.5 h-1 bg-amber-800/80 rounded" />
            <div className="w-7 h-12 bg-slate-950 border-2 border-black rounded-md shadow-lg flex items-center justify-center relative p-0.5">
              <div className="w-5 h-9 bg-cyan-400 rounded-sm shadow-[0_0_12px_rgba(34,211,238,0.9)] animate-pulse flex flex-col items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              </div>
            </div>
          </div>
        );

      case 'study_desk':
        return (
          <div className="w-full h-full bg-amber-950/90 border-4 border-black rounded-lg shadow-[4px_6px_0px_rgba(0,0,0,0.8)] relative flex items-center justify-around p-2">
            <svg className="w-12 h-10" viewBox="0 0 48 40">
              <rect x="6" y="4" width="36" height="24" rx="2" fill="#0284c7" stroke="black" strokeWidth="2" />
              <rect x="9" y="7" width="30" height="18" fill="#38bdf8" className="animate-pulse" />
              <path d="M 2 28 L 46 28 L 42 36 L 6 36 Z" fill="#94a3b8" stroke="black" strokeWidth="2" />
            </svg>

            <div className="flex flex-col gap-0.5">
              <div className="w-8 h-2 bg-red-600 border border-black rounded-xs shadow" />
              <div className="w-10 h-2 bg-blue-600 border border-black rounded-xs shadow" />
              <div className="w-9 h-2 bg-emerald-600 border border-black rounded-xs shadow" />
            </div>

            <div className="w-6 h-10 bg-slate-950 border-2 border-black rounded flex items-center justify-center p-0.5">
              <div className="w-4.5 h-8 bg-cyan-400 rounded-xs shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse" />
            </div>
          </div>
        );

      case 'hostel_bed':
        return (
          <div className="w-full h-full bg-indigo-950/90 border-4 border-black rounded-xl shadow-[4px_6px_0px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col justify-between p-2">
            <div className="w-16 h-8 bg-slate-100 border-2 border-black rounded-lg shadow-sm mx-auto flex items-center justify-center">
              <div className="w-10 h-1 bg-slate-300 rounded" />
            </div>
            <div className="w-full h-16 bg-indigo-700 border-t-2 border-black rounded-b-lg flex items-center justify-center">
              <div className="w-20 h-2 bg-indigo-500/60 rounded-full" />
            </div>
          </div>
        );

      case 'tea_counter':
        return (
          <div className="w-full h-full bg-amber-900/90 border-4 border-black rounded-lg shadow-[4px_6px_0px_rgba(0,0,0,0.8)] relative flex items-center justify-around p-2">
            <div className="relative flex flex-col items-center">
              <div className="absolute -top-4 flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-200/80 rounded-full animate-smoke-rise" style={{ animationDelay: '0s' }} />
                <div className="w-1.5 h-1.5 bg-slate-300/80 rounded-full animate-smoke-rise" style={{ animationDelay: '0.5s' }} />
              </div>
              <svg className="w-12 h-12" viewBox="0 0 48 48">
                <path d="M 12 20 Q 8 32, 14 40 L 34 40 Q 40 32, 36 20 Z" fill="#cbd5e1" stroke="black" strokeWidth="2.5" />
                <ellipse cx="24" cy="20" rx="12" ry="4" fill="#94a3b8" stroke="black" strokeWidth="2" />
                <circle cx="24" cy="15" r="3" fill="#78350f" stroke="black" strokeWidth="1.5" />
                <path d="M 34 26 C 42 22, 44 16, 42 14" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
                <path d="M 14 18 C 14 6, 34 6, 34 18" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-5 h-7 border-2 border-black rounded-b-md bg-white/30 backdrop-blur-xs flex flex-col justify-end p-0.5 shadow-sm">
                  <div className="w-full h-4 bg-amber-600/90 rounded-xs border-t border-amber-800" />
                </div>
              ))}
            </div>
          </div>
        );

      case 'customer_bench':
        return (
          <div className="w-full h-full bg-amber-950/90 border-4 border-black rounded-lg shadow-[4px_6px_0px_rgba(0,0,0,0.8)] relative flex items-center justify-around p-1">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 bg-amber-800 border-2 border-black rounded-full shadow-inner flex items-center justify-center">
                <div className="w-4 h-4 bg-amber-900 rounded-full border border-amber-950" />
              </div>
            ))}
          </div>
        );

      case 'office_desk':
        return (
          <div className="w-full h-full bg-slate-900/90 border-4 border-black rounded-lg shadow-[4px_6px_0px_rgba(0,0,0,0.8)] relative flex items-center justify-around p-2">
            <div className="flex items-center gap-1.5">
              <div className="w-10 h-7 bg-slate-950 border-2 border-black rounded shadow-[0_0_10px_rgba(56,189,248,0.8)] flex items-center justify-center">
                <div className="w-8 h-5 bg-sky-500/80 rounded-xs" />
              </div>
              <div className="w-10 h-7 bg-slate-950 border-2 border-black rounded shadow-[0_0_10px_rgba(56,189,248,0.8)] flex items-center justify-center">
                <div className="w-8 h-5 bg-sky-500/80 rounded-xs" />
              </div>
            </div>
            <div className="w-6 h-10 bg-slate-950 border-2 border-black rounded flex items-center justify-center p-0.5">
              <div className="w-4.5 h-8 bg-cyan-400 rounded-xs shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse" />
            </div>
          </div>
        );

      case 'tv_unit':
        return (
          <div className="w-full h-full bg-slate-950/90 border-4 border-black rounded-lg shadow-[4px_6px_0px_rgba(0,0,0,0.8)] relative flex items-center justify-center p-1.5">
            <div className="w-20 h-11 bg-slate-900 border-2 border-black rounded-md flex flex-col items-center justify-center p-1 relative shadow-inner">
              <div className="w-full h-full bg-red-600/90 rounded-xs shadow-[0_0_14px_rgba(239,68,68,0.9)] animate-pulse flex items-center justify-center text-[7px] font-black text-white tracking-tighter uppercase">
                CBI NOTICE
              </div>
            </div>
          </div>
        );

      case 'switchboard':
        return (
          <div className="w-full h-full bg-slate-900/90 border-4 border-black rounded-lg shadow-[4px_6px_0px_rgba(0,0,0,0.8)] relative flex items-center justify-center p-1">
            <div className="w-8 h-8 bg-slate-800 border-2 border-black rounded flex flex-col items-center justify-center gap-1">
              <div className="w-5 h-1.5 bg-amber-400 rounded-xs animate-ping" />
              <div className="w-5 h-1.5 bg-slate-600 rounded-xs" />
            </div>
          </div>
        );

      case 'biometric_clock':
        return (
          <div className="w-full h-full bg-slate-900/90 border-4 border-black rounded-lg shadow-[4px_6px_0px_rgba(0,0,0,0.8)] relative flex items-center justify-center p-1">
            <div className="w-10 h-10 bg-sky-950 border-2 border-black rounded-lg shadow-[0_0_10px_rgba(56,189,248,0.8)] flex items-center justify-center">
              <div className="w-6 h-6 bg-cyan-400 rounded-full animate-pulse flex items-center justify-center font-mono text-[9px] font-black text-slate-950">
                BIO
              </div>
            </div>
          </div>
        );

      case 'library_books':
      case 'bookshelf':
      case 'wall_board':
        return (
          <div className="w-full h-full bg-amber-950/90 border-4 border-black rounded-lg shadow-[4px_6px_0px_rgba(0,0,0,0.8)] relative flex items-center justify-around p-2">
            <div className="flex gap-1 items-end h-full">
              <div className="w-3 h-10 bg-red-700 border border-black rounded-xs" />
              <div className="w-3 h-12 bg-blue-700 border border-black rounded-xs" />
              <div className="w-3 h-9 bg-emerald-700 border border-black rounded-xs" />
              <div className="w-3 h-11 bg-purple-700 border border-black rounded-xs" />
            </div>
          </div>
        );

      case 'fridge':
        return (
          <div className="w-full h-full bg-slate-800 border-4 border-black rounded-lg shadow-[4px_6px_0px_rgba(0,0,0,0.8)] relative flex flex-col justify-between p-1.5 overflow-hidden">
            <div className="w-full h-2/5 bg-slate-700 border-b-2 border-black rounded-t flex items-center justify-end px-2">
              <div className="w-2 h-6 bg-slate-400 rounded-xs border border-black" />
            </div>
            <div className="w-full h-3/5 bg-slate-750 border-t border-slate-600 flex items-center justify-between px-2 relative">
              <div className="w-4 h-5 bg-amber-400 border border-black text-[6px] font-bold text-black flex items-center justify-center rounded-xs shadow">📌</div>
              <div className="w-2 h-10 bg-slate-400 rounded-xs border border-black" />
            </div>
          </div>
        );

      case 'stove':
        return (
          <div className="w-full h-full bg-zinc-900 border-4 border-black rounded-lg shadow-[4px_6px_0px_rgba(0,0,0,0.8)] relative flex items-center justify-around p-2">
            <div className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center shadow-inner">
              <div className="w-4 h-4 rounded-full bg-amber-500 animate-pulse border border-black shadow-[0_0_8px_rgba(245,158,11,0.9)]" />
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center shadow-inner">
              <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse border border-black shadow-[0_0_8px_rgba(59,130,246,0.9)]" />
            </div>
          </div>
        );

      case 'wardrobe':
        return (
          <div className="w-full h-full bg-amber-950 border-4 border-black rounded-lg shadow-[4px_6px_0px_rgba(0,0,0,0.8)] relative flex justify-around p-2">
            <div className="w-1/2 h-full border-r border-black flex items-center justify-end pr-1">
              <div className="w-1.5 h-6 bg-amber-400 rounded border border-black" />
            </div>
            <div className="w-1/2 h-full flex items-center justify-start pl-1">
              <div className="w-1.5 h-6 bg-amber-400 rounded border border-black" />
            </div>
          </div>
        );

      case 'tea_stalls_shelf':
        return (
          <div className="w-full h-full bg-amber-900/90 border-4 border-black rounded-lg shadow-[4px_6px_0px_rgba(0,0,0,0.8)] flex flex-col justify-around p-1">
            <div className="w-full h-1 bg-amber-700 rounded" />
            <div className="flex justify-around items-end">
              <div className="w-4 h-5 bg-cyan-200/80 border border-black rounded-xs" />
              <div className="w-4 h-5 bg-amber-200/80 border border-black rounded-xs" />
            </div>
            <div className="w-full h-1 bg-amber-700 rounded" />
          </div>
        );

      case 'sofa_set':
        return (
          <div className="w-full h-full bg-purple-950 border-4 border-black rounded-xl shadow-[4px_6px_0px_rgba(0,0,0,0.8)] flex items-center justify-around p-2 relative">
            <div className="w-8 h-10 bg-purple-800 border-2 border-black rounded-md" />
            <div className="w-8 h-10 bg-purple-800 border-2 border-black rounded-md" />
          </div>
        );

      case 'reading_table':
        return (
          <div className="w-full h-full bg-cyan-950 border-4 border-black rounded-lg shadow-[4px_6px_0px_rgba(0,0,0,0.8)] flex items-center justify-around p-2">
            <div className="w-10 h-8 bg-amber-800 border border-black rounded flex flex-col gap-0.5 p-0.5">
              <div className="w-full h-1.5 bg-yellow-400 rounded-xs" />
              <div className="w-full h-1.5 bg-blue-400 rounded-xs" />
            </div>
          </div>
        );

      case 'fuse_cabinet':
        return (
          <div className="w-full h-full bg-stone-900 border-4 border-black rounded-lg shadow-[4px_6px_0px_rgba(0,0,0,0.8)] flex items-center justify-center p-2">
            <div className="w-10 h-12 bg-amber-500 border-2 border-black rounded flex flex-col items-center justify-center text-[8px] font-black text-black">
              ⚠️ DANGER
            </div>
          </div>
        );

      case 'storage_box':
        return (
          <div className="w-full h-full bg-amber-800 border-4 border-black rounded-lg shadow-[4px_6px_0px_rgba(0,0,0,0.8)] flex items-center justify-around p-1">
            <div className="w-8 h-8 bg-amber-700 border-2 border-black rounded flex items-center justify-center font-mono text-[7px] font-black text-amber-200">
              BOX
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full bg-amber-900/90 border-4 border-black rounded-lg shadow-[4px_6px_0px_rgba(0,0,0,0.8)]" />
        );
    }
  };

  // Collision Checking Helper for Wall Sliding (Prop Hitboxes + Invisible Wall Obstacles)
  const checkCollision = (posX, posY, stageKey) => {
    const level = levelConfigs[stageKey] || fallbackConfig;
    const boxes = level?.props || [];
    const obs = level?.obstacles || [];
    const allSolids = [...boxes, ...obs];
    const pr = 10; // Forgiving collision radius (shrunk from 16px to 10px)
    const inset = 4; // Inset collision bounding box by 4px
    for (let box of allSolids) {
      const bx = box.x + inset;
      const by = box.y + inset;
      const bw = Math.max(1, box.w - inset * 2);
      const bh = Math.max(1, box.h - inset * 2);
      if (
        posX + pr > bx &&
        posX - pr < bx + bw &&
        posY + pr > by &&
        posY - pr < by + bh
      ) {
        return true;
      }
    }
    return false;
  };

  // Hazard Zone Intersection Checking Helper
  const checkHazardIntersection = (posX, posY, stageKey) => {
    const level = levelConfigs[stageKey] || fallbackConfig;
    const hazards = level?.hazards || [];
    const pr = 12;
    for (let h of hazards) {
      if (
        posX + pr > h.x &&
        posX - pr < h.x + h.w &&
        posY + pr > h.y &&
        posY - pr < h.y + h.h
      ) {
        return h;
      }
    }
    return null;
  };

  // DYNAMIC PLAYER AVATAR SPRITE RENDERER FOR ALL 4 CHARACTERS
  const renderPlayerAvatar = () => {
    const role = config?.characterRole || (characterKey && characterKey.includes('father') ? 'father' : 'mother');
    const isLeft = playerDir === 'left';

    let coatColor = '#991b1b';
    let headFill = '#fcd34d';
    let hairColor = '#1c1917';
    let roleLabel = 'MOTHER';
    let badgeBg = 'bg-red-900';

    if (role === 'father') {
      coatColor = '#334155';
      hairColor = '#64748b';
      roleLabel = 'FATHER';
      badgeBg = 'bg-slate-900';
    } else if (role === 'sibling') {
      coatColor = '#3730a3';
      hairColor = '#475569';
      roleLabel = 'SIBLING';
      badgeBg = 'bg-indigo-900';
    } else if (role === 'protagonist') {
      coatColor = '#0ea5e9';
      hairColor = '#0f172a';
      roleLabel = 'PROTAGONIST';
      badgeBg = 'bg-sky-900';
    }

    return (
      <div
        className={`absolute z-40 w-12 h-14 -ml-6 -mt-7 pointer-events-none transition-transform duration-75 flex flex-col items-center justify-center ${
          isMoving ? 'animate-[wiggle_0.3s_ease-in-out_infinite]' : ''
        }`}
        style={{
          left: `${(playerPos.x / 640) * 100}%`,
          top: `${(playerPos.y / 380) * 100}%`
        }}
      >
        {/* CHARACTER ROLE BADGE LABEL ABOVE AVATAR */}
        <div className={`px-1.5 py-0.2 mb-0.5 rounded text-[7px] font-mono font-black text-amber-300 border border-amber-500/80 shadow-md ${badgeBg}`}>
          {roleLabel}
        </div>

        <div
          className="w-12 h-12 relative"
          style={{ transform: isLeft ? 'scaleX(-1)' : 'none' }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)]">
            {/* Ground Shadow */}
            <ellipse cx="50" cy="58" rx="35" ry="22" fill="rgba(0,0,0,0.4)" />

            {/* Coat / Body */}
            <path
              d="M 20 40 C 20 15, 80 15, 80 40 L 85 72 C 85 85, 15 85, 15 72 Z"
              fill={coatColor}
              stroke="#000000"
              strokeWidth="6"
              strokeLinejoin="round"
            />

            {/* Collar Detail */}
            <path
              d="M 35 30 L 50 45 L 65 30"
              fill="none"
              stroke="#000000"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Character Head */}
            <circle
              cx="50"
              cy="40"
              r="22"
              fill={headFill}
              stroke="#000000"
              strokeWidth="6"
            />

            {/* Character Hair & Accessories */}
            {role === 'mother' && (
              <>
                {/* Hair Bun */}
                <circle cx="50" cy="18" r="10" fill={hairColor} stroke="#000" strokeWidth="3" />
                <path d="M 28 35 Q 50 12 72 35 Q 50 25 28 35 Z" fill={hairColor} />
                {/* Red Bindi */}
                <circle cx="50" cy="38" r="2.5" fill="#dc2626" />
              </>
            )}

            {role === 'father' && (
              <>
                {/* Silver Hair */}
                <path d="M 28 32 Q 50 15 72 32 Q 50 22 28 32 Z" fill={hairColor} />
                {/* Eyeglasses */}
                <rect x="34" y="36" width="12" height="8" rx="2" fill="none" stroke="#000" strokeWidth="2.5" />
                <rect x="54" y="36" width="12" height="8" rx="2" fill="none" stroke="#000" strokeWidth="2.5" />
                <line x1="46" y1="40" x2="54" y2="40" stroke="#000" strokeWidth="2.5" />
              </>
            )}

            {role === 'sibling' && (
              <>
                {/* Casual Hair */}
                <path d="M 26 30 Q 35 12 50 20 Q 65 12 74 30 Q 50 24 26 30 Z" fill={hairColor} />
                {/* Headphones Band */}
                <path d="M 25 40 C 25 15, 75 15, 75 40" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                <rect x="22" y="35" width="6" height="12" rx="2" fill="#0284c7" />
                <rect x="72" y="35" width="6" height="12" rx="2" fill="#0284c7" />
              </>
            )}

            {role === 'protagonist' && (
              <>
                {/* Detective Fedora Hat */}
                <ellipse cx="50" cy="24" rx="28" ry="8" fill="#1e293b" stroke="#000" strokeWidth="3" />
                <path d="M 32 24 C 32 10, 68 10, 68 24 Z" fill="#0f172a" stroke="#000" strokeWidth="3" />
                <rect x="32" y="21" width="36" height="3" fill="#e11d48" />
              </>
            )}
          </svg>
        </div>
      </div>
    );
  };

  // Automated Customer Walking Animation for Father's Stage
  useEffect(() => {
    if (characterKey !== 'father') return;

    const interval = setInterval(() => {
      setNpcPos((prev) => {
        if (prev.x > 380) {
          return { ...prev, x: Math.max(380, prev.x - 2) };
        }
        return prev;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [characterKey]);

  // KEYBOARD LISTENERS
  useEffect(() => {
    const validKeys = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D']);

    const handleKeyDown = (e) => {
      if (showDisclaimerRef.current) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'e' || e.key === 'E') {
          playSound('pop', soundMuted);
          showDisclaimerRef.current = false;
          setShowDisclaimer(false);
        }
        return;
      }

      if (validKeys.has(e.key)) {
        activeKeysRef.current.add(e.key.toLowerCase());
        setIsMoving(true);
      }
      if (e.key === 'e' || e.key === 'E' || e.key === ' ' || e.key === 'Enter') {
        if (activeComic) {
          handleDismissComic();
        } else {
          triggerActionDirect();
        }
      }
    };

    const handleKeyUp = (e) => {
      if (validKeys.has(e.key)) {
        activeKeysRef.current.delete(e.key.toLowerCase());
        if (activeKeysRef.current.size === 0 && !joystickRef.current.active) {
          setIsMoving(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [interactPrompt, soundMuted]);

  // GAME LOOP (MOVEMENT, WALL SLIDING & DUST PARTICLES)
  useEffect(() => {
    let animationFrameId;
    let stepTimer = 0;
    let particleTimer = 0;

    const gameLoop = () => {
      if (showDisclaimerRef.current) {
        setIsMoving(false);
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }
      let dx = 0;
      let dy = 0;
      const speed = 3.8;

      const keys = activeKeysRef.current;
      if (keys.has('w') || keys.has('arrowup')) dy -= speed;
      if (keys.has('s') || keys.has('arrowdown')) dy += speed;
      if (keys.has('a') || keys.has('arrowleft')) dx -= speed;
      if (keys.has('d') || keys.has('arrowright')) dx += speed;

      if (joystickRef.current.active) {
        dx += (joystickRef.current.deltaX / 45) * speed;
        dy += (joystickRef.current.deltaY / 45) * speed;
      }

      if (dx !== 0 || dy !== 0) {
        setIsMoving(true);

        if (Math.abs(dx) >= Math.abs(dy)) {
          setPlayerDir(dx > 0 ? 'right' : 'left');
        } else {
          setPlayerDir(dy > 0 ? 'down' : 'up');
        }

        setPlayerPos((prev) => {
          let nextX = Math.max(40, Math.min(600, prev.x + dx));
          let nextY = Math.max(65, Math.min(345, prev.y + dy));

          // Axis-separated wall sliding collision check
          if (checkCollision(nextX, prev.y, characterKey)) {
            nextX = prev.x; // Block X movement
          }
          if (checkCollision(prev.x, nextY, characterKey)) {
            nextY = prev.y; // Block Y movement
          }
          // Combined pre-check to prevent diagonal corner clipping into obstacles
          if (checkCollision(nextX, nextY, characterKey)) {
            nextX = prev.x;
            nextY = prev.y;
          }

          // Hazard Zone Intersection & Penalty Check
          const hitHazard = checkHazardIntersection(nextX, nextY, characterKey);
          if (hitHazard && !hazardHitRef.current) {
            hazardHitRef.current = true;

            playSound('error', soundMuted);

            if (onDeductVault) {
              onDeductVault(500);
            } else if (setFamilyVault) {
              setFamilyVault((v) => Math.max(0, v - 500));
            }

            setDialogueText(`⚡ HAZARD HIT! ${hitHazard.label || 'Sparking wires'} caused ₹500 Vault damage! Resetting position.`);

            setTimeout(() => {
              hazardHitRef.current = false;
            }, 1000);

            return { x: 90, y: 300 };
          }

          stepTimer++;
          if (stepTimer % 15 === 0) {
            playSound('footstep', soundMuted);
          }

          // Add dust particle trail every 200ms
          particleTimer++;
          if (particleTimer % 10 === 0) {
            dustParticlesRef.current.push({
              x: prev.x,
              y: prev.y + 15,
              size: 4 + Math.random() * 3,
              opacity: 0.6,
              life: 1.0
            });
          }

          return { x: nextX, y: nextY };
        });
      } else {
        if (activeKeysRef.current.size === 0 && !joystickRef.current.active) {
          setIsMoving(false);
        }
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [characterKey, soundMuted]);

  // OMNI-DIRECTIONAL 360-DEGREE PROXIMITY CHECKER
  useEffect(() => {
    let currentPrompt = null;
    const interactionRadius = 65; // Expanded 360-degree radial proximity threshold (in pixels)

    const target = !stageProgress.step1
      ? config.primaryTarget
      : config.phoneTarget;

    if (target) {
      const dist = Math.hypot(playerPos.x - target.x, playerPos.y - target.y);
      if (dist <= interactionRadius) {
        if (!stageProgress.step1) {
          if (characterKey === 'mother') currentPrompt = { id: 'mixer', text: t('motherPromptMixer') };
          else if (characterKey === 'father') currentPrompt = { id: 'teaStall', text: t('fatherPromptTea') };
          else if (characterKey === 'sibling') currentPrompt = { id: 'wallet', text: t('siblingPromptWallet') };
          else if (characterKey === 'protagonist') currentPrompt = { id: 'clock', text: t('protagonistPromptClock') };
          else if (characterKey === 'father_arrest') currentPrompt = { id: 'tv', text: t('fatherArrestPromptTv') };
          else if (characterKey === 'sibling_task') currentPrompt = { id: 'books', text: t('siblingTaskPromptBooks') };
          else if (characterKey === 'mother_blackout') currentPrompt = { id: 'switchboard', text: t('motherBlackoutPromptSwitch') };
          else if (characterKey === 'protagonist_qr') currentPrompt = { id: 'books', text: t('protagonistQrPromptBooks') };
        } else {
          if (characterKey === 'mother') currentPrompt = { id: 'table', text: t('motherPromptTable') };
          else if (characterKey === 'father') currentPrompt = { id: 'strangerNPC', text: t('fatherPromptStranger') };
          else if (characterKey === 'sibling') currentPrompt = { id: 'bedPhone', text: t('siblingPromptBed') };
          else if (characterKey === 'protagonist') currentPrompt = { id: 'desk', text: t('protagonistPromptDesk') };
          else if (characterKey === 'father_arrest') currentPrompt = { id: 'table', text: t('fatherArrestPromptTable') };
          else if (characterKey === 'sibling_task') currentPrompt = { id: 'desk', text: t('siblingTaskPromptDesk') };
          else if (characterKey === 'mother_blackout') currentPrompt = { id: 'table', text: t('motherBlackoutPromptTable') };
          else if (characterKey === 'protagonist_qr') currentPrompt = { id: 'bed', text: t('protagonistQrPromptBed') };
        }
      }
    }

    setInteractPrompt(currentPrompt);
  }, [playerPos, stageProgress, characterKey, npcPos, currentLanguage, config]);

  // CANVAS RENDER ENGINE WITH ATMOSPHERIC RETRO-NOIR TEXTURES & FLOOR PATTERNS
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = canvas.parentElement;
    if (container) {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        if (canvas.width !== Math.floor(rect.width) || canvas.height !== Math.floor(rect.height)) {
          canvas.width = Math.floor(rect.width);
          canvas.height = Math.floor(rect.height);
        }
      }
    }

    const W = canvas.width || 640;
    const H = canvas.height || 380;
    const sx = W / 640;
    const sy = H / 380;
    const now = Date.now();

    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';

    // 1. FLOORPLANS & RETRO-NOIR ATMOSPHERIC PATTERNS
    if (characterKey === 'mother' || characterKey === 'mother_blackout') {
      ctx.fillStyle = '#1c1917'; ctx.fillRect(0, 0, W, H);
      const tileSizeX = 40 * sx; const tileSizeY = 40 * sy;
      for (let x = 0; x < W; x += tileSizeX) {
        for (let y = 0; y < H; y += tileSizeY) {
          const isOdd = (Math.floor(x / tileSizeX) + Math.floor(y / tileSizeY)) % 2 === 1;
          ctx.fillStyle = isOdd ? '#292524' : '#1c1917'; ctx.fillRect(x, y, tileSizeX, tileSizeY);
          ctx.strokeStyle = '#090807'; ctx.lineWidth = 1; ctx.strokeRect(x, y, tileSizeX, tileSizeY);
        }
      }

    } else if (characterKey === 'father') {
      ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#1e293b'; ctx.fillRect(0, 260 * sy, W, H - 260 * sy);
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 4 * sy;
      ctx.setLineDash([20 * sx, 20 * sx]); ctx.strokeRect(0, 260 * sy, W, 0); ctx.setLineDash([]);

      const puddleGlow = ctx.createRadialGradient(250 * sx, 200 * sy, 10 * sx, 250 * sx, 200 * sy, 90 * sx);
      puddleGlow.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
      puddleGlow.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = puddleGlow; ctx.fillRect(160 * sx, 130 * sy, 180 * sx, 100 * sy);

      const lampGlow = ctx.createRadialGradient(100 * sx, 100 * sy, 10 * sx, 100 * sx, 100 * sy, 240 * sx);
      lampGlow.addColorStop(0, 'rgba(251, 191, 36, 0.35)');
      lampGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = lampGlow; ctx.beginPath(); ctx.arc(100 * sx, 100 * sy, 240 * sx, 0, Math.PI * 2); ctx.fill();

    } else if (characterKey === 'sibling' || characterKey === 'sibling_task') {
      ctx.fillStyle = '#291d0f'; ctx.fillRect(0, 0, W, H);
      const plankH = 30 * sy;
      for (let y = 0; y < H; y += plankH) {
        ctx.strokeStyle = '#181008'; ctx.lineWidth = 2; ctx.strokeRect(0, y, W, plankH);
      }

    } else if (characterKey === 'protagonist' || characterKey === 'protagonist_qr') {
      ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);

    } else if (characterKey === 'father_arrest') {
      ctx.fillStyle = '#1c1917'; ctx.fillRect(0, 0, W, H);
    }

    // 2. DUST PARTICLES RENDER
    const dusts = dustParticlesRef.current;
    for (let i = dusts.length - 1; i >= 0; i--) {
      const p = dusts[i];
      p.life -= 0.04;
      p.opacity = p.life * 0.5;
      if (p.life <= 0) {
        dusts.splice(i, 1);
        continue;
      }
      ctx.fillStyle = `rgba(245, 158, 11, ${p.opacity})`;
      ctx.beginPath(); ctx.arc(p.x * sx, p.y * sy, p.size * sx, 0, Math.PI * 2); ctx.fill();
    }

    // 3. OBJECTIVE TRAIL & ANIMATED FLOATING BADGE
    const px = playerPos.x * sx;
    const py = playerPos.y * sy;
    const tx = activeTargetPos.x * sx;
    const ty = activeTargetPos.y * sy;

    const opacityPulse = 0.65 + 0.35 * Math.sin(now * 0.006);
    ctx.save();
    ctx.strokeStyle = `rgba(245, 158, 11, ${opacityPulse})`;
    ctx.lineWidth = 4 * Math.max(sx, sy);
    ctx.setLineDash([8 * sx, 8 * sy]);
    ctx.lineDashOffset = -(now * 0.04) % (16 * sx);
    ctx.shadowBlur = 14; ctx.shadowColor = '#f59e0b';
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.restore();

    const floatOffset = Math.sin(now * 0.008) * 8 * sy;
    const badgeY = ty - (32 * sy) + floatOffset;
    ctx.save();
    ctx.shadowBlur = 12; ctx.shadowColor = '#f59e0b';
    ctx.fillStyle = '#f59e0b'; ctx.fillRect(tx - 45 * sx, badgeY - 14 * sy, 90 * sx, 24 * sy);
    ctx.strokeStyle = '#000000'; ctx.lineWidth = 3; ctx.strokeRect(tx - 45 * sx, badgeY - 14 * sy, 90 * sx, 24 * sy);
    ctx.fillStyle = '#000000'; ctx.font = `900 ${Math.max(10, Math.floor(12 * sx))}px sans-serif`; ctx.textAlign = 'center';
    ctx.fillText(t('objectiveMarker'), tx, badgeY + 2 * sy);
    ctx.restore();

    // 4. BLACKOUT FLASHLIGHT EFFECT (CASE #07)
    if (characterKey === 'mother_blackout') {
      ctx.save();
      const flashGradient = ctx.createRadialGradient(px, py, 25 * sx, px, py, 130 * sx);
      flashGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      flashGradient.addColorStop(0.7, 'rgba(5, 5, 10, 0.88)');
      flashGradient.addColorStop(1, 'rgba(5, 5, 10, 0.99)');
      ctx.fillStyle = flashGradient;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

  }, [playerPos, playerDir, isMoving, characterKey, npcPos, stageProgress, activeTargetPos, currentLanguage]);

  const caseComicDetails = {
    mother: {
      title: "MOTHER'S KITCHEN",
      image: '/comics/kitchen_smoke.png',
      text: "The mixer sits dead on the counter. The motor reeks of burnt copper and melted plastic."
    },
    sibling: {
      title: "HOSTEL DESK",
      image: '/comics/case2_wallet.png', // Update filename as you generate more art
      text: "The wallet is completely empty. Not a single rupee left for the mess fee."
    },
    father: {
      title: "FRANTIC STRANGER",
      image: '/comics/father_stall.png',
      text: "A frantic stranger rushes up: 'Bhaiyya, urgent emergency! My wife is in the hospital and my phone battery is dead. Please dial *401*9876543210 for me!'"
    },
    protagonist: {
      title: "BIOMETRIC CLOCK",
      image: '/comics/hunt_begins1.png', // Matches files in your project directory
      text: "The biometric clock chimes loudly. A sudden SMS notification flashes on the phone."
    },
    father_arrest: {
      title: "LIVING ROOM TV",
      image: '/comics/father_arrest.png', // Update filename as you generate more art
      text: "The TV news blares warnings about extortionists placing fake CBI video calls."
    },
    sibling_task: {
      title: "LIBRARY STUDY DESK",
      image: '/comics/telegram_scam.png', // Matches files in your project directory
      text: "Study notes are scattered everywhere. An urgent Telegram alert chimes from 'Elena HR'."
    },
    mother_blackout: {
      title: "CIRCUIT SWITCHBOARD",
      image: '/comics/switch_board.png', // Matches files in your project directory
      text: "Sparks fly from the fuse box as the entire apartment goes dark in a sudden blackout."
    },
    protagonist_qr: {
      title: "BOOKSHELF & DESK",
      image: '/comics/qr_code.png', // Matches files in your project directory
      text: "Textbooks are stacked for sale. A buyer on OLX sends an instant message requesting a QR scan."
    }
  };

  const handleDismissComic = () => {
    playSound('pop', soundMuted);
    setActiveComic(null);
    setStageProgress(prev => ({ ...prev, step1: true }));

    if (characterKey === 'mother') setDialogueText(t('motherDiagMixer'));
    else if (characterKey === 'father') setDialogueText(t('fatherDiagTea'));
    else if (characterKey === 'sibling') setDialogueText(t('siblingDiagWallet'));
    else if (characterKey === 'protagonist') setDialogueText(t('protagonistDiagClock'));
    else if (characterKey === 'father_arrest') setDialogueText(t('fatherArrestDiagTv'));
    else if (characterKey === 'sibling_task') setDialogueText(t('siblingTaskDiagNotes'));
    else if (characterKey === 'mother_blackout') setDialogueText(t('motherBlackoutDiagSpark'));
    else if (characterKey === 'protagonist_qr') setDialogueText(t('protagonistQrDiagBooks'));
  };

  // INTERACTION TRIGGER WITH HOLD-PROGRESS (STEP 1) OR ZOOM (STEP 2)
  const triggerActionDirect = () => {
    if (showDisclaimerRef.current) return;
    if (activeComic) {
      handleDismissComic();
      return;
    }

    if (!interactPrompt) return;

    if (!stageProgress.step1) {
      playSound('pop', soundMuted);
      const comicData = caseComicDetails[characterKey] || caseComicDetails.mother;
      setActiveComic(comicData);
    } else {
      playSound('success', soundMuted);
      setIsZoomingPhone(true);
      setTimeout(() => {
        onCompleteOverworld();
      }, 400);
    }
  };

  // TOUCH JOYSTICK HANDLERS
  const handleTouchStart = (e) => {
    if (showDisclaimerRef.current) return;
    const touch = e.touches ? e.touches[0] : e;
    joystickRef.current = { active: true, startX: touch.clientX, startY: touch.clientY, deltaX: 0, deltaY: 0 };
    setIsMoving(true);
  };

  const handleTouchMove = (e) => {
    if (showDisclaimerRef.current || !joystickRef.current.active) return;
    const touch = e.touches ? e.touches[0] : e;
    const dx = touch.clientX - joystickRef.current.startX;
    const dy = touch.clientY - joystickRef.current.startY;
    const dist = Math.hypot(dx, dy);
    const maxDist = 45; const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(dist, maxDist);
    const clampedX = Math.cos(angle) * clampedDist;
    const clampedY = Math.sin(angle) * clampedDist;

    joystickRef.current.deltaX = clampedX; joystickRef.current.deltaY = clampedY;
    setJoystickThumb({ x: clampedX, y: clampedY });
  };

  const handleTouchEnd = () => {
    joystickRef.current = { active: false, startX: 0, startY: 0, deltaX: 0, deltaY: 0 };
    setJoystickThumb({ x: 0, y: 0 });
    if (activeKeysRef.current.size === 0) setIsMoving(false);
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-black flex flex-col overflow-hidden touch-none overscroll-none select-none">

      {/* 1. TOP HUD BAR CONTAINER (SHRINK-0 Z-40) */}
      <div className="shrink-0 z-40 p-2 md:p-4 bg-black/90 border-b-2 border-amber-600/60 comic-border flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left text-xs md:text-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToBoard}
            className="p-1.5 px-3 bg-amber-950 hover:bg-amber-800 text-amber-300 rounded border border-amber-600 flex items-center gap-1.5 text-xs font-bold cursor-pointer active:scale-95 transition-transform"
          >
            <ArrowLeft size={16} />
            <span>{t('btnCaseBoard')}</span>
          </button>
          <div>
            <h2 className="font-title text-base sm:text-lg text-amber-300 leading-none">{t(config.nameKey)}</h2>
          </div>

          {typeof familyVault === 'number' && (
            <div className="flex items-center gap-1.5 bg-slate-950 border border-amber-600/80 px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold shadow-md">
              <span className="text-amber-400 text-[10px]">VAULT:</span>
              <span className={familyVault < 50000 ? 'text-red-400 font-black' : 'text-emerald-400 font-black'}>
                ₹{familyVault.toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>

        <div className="text-[10px] md:text-xs font-mono">
          {stageProgress.step1 ? (
            <span className="text-emerald-400 font-bold flex items-center justify-center md:justify-end gap-1">
              <CheckCircle2 size={14} /> {t('step1DonePhone')}
            </span>
          ) : (
            <span className="text-amber-300 font-bold">
              {characterKey === 'mother' && t('motherStep1Inst')}
              {characterKey === 'father' && t('fatherStep1Inst')}
              {characterKey === 'sibling' && t('siblingStep1Inst')}
              {characterKey === 'protagonist' && t('protagonistStep1Inst')}
              {characterKey === 'father_arrest' && t('fatherArrestStep1Inst')}
              {characterKey === 'sibling_task' && t('siblingTaskStep1Inst')}
              {characterKey === 'mother_blackout' && t('motherBlackoutStep1Inst')}
              {characterKey === 'protagonist_qr' && t('protagonistQrStep1Inst')}
            </span>
          )}
        </div>
      </div>

      {/* 2. RESPONSIVE STAGE CANVAS WRAPPER (FLEX-1 FLUID STRETCH) */}
      <div className={`flex-1 w-full h-full relative overflow-hidden flex items-center justify-center bg-[#110e0c] border-y-4 border-amber-600/50 touch-none ${isZoomingPhone ? 'zoom-into-phone' : ''
        }`}>
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />

        {/* VISIBLE PROPS OVERLAY LAYER (EXACT MATCHING COLLISION BOUNDARIES) */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {levelConfigs[characterKey]?.props?.map((prop, index) => (
            <div
              key={prop.id || index}
              className="absolute border-2 border-amber-600 bg-amber-900/40 rounded-lg shadow-[4px_6px_0px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center justify-between p-1 group"
              style={{
                left: `${(prop.x / 640) * 100}%`,
                top: `${(prop.y / 380) * 100}%`,
                width: `${(prop.w / 640) * 100}%`,
                height: `${(prop.h / 380) * 100}%`
              }}
            >
              {renderPropVisual(prop)}
              <div className="absolute bottom-0.5 inset-x-0.5 bg-black/90 px-1 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-black text-amber-400/90 border border-amber-600/80 text-center truncate uppercase shadow-md">
                {prop.name || prop.label || 'PROP'}
              </div>
            </div>
          )) || null}
        </div>

        {/* VISIBLE OBSTACLE WALL BARRIERS LAYER */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {levelConfigs[characterKey]?.obstacles?.map((obs, index) => (
            <div
              key={obs.id || index}
              className="absolute border-2 border-dashed border-amber-600/80 bg-amber-950/60 rounded shadow-md flex items-center justify-center p-0.5"
              style={{
                left: `${(obs.x / 640) * 100}%`,
                top: `${(obs.y / 380) * 100}%`,
                width: `${(obs.w / 640) * 100}%`,
                height: `${(obs.h / 380) * 100}%`
              }}
            >
              <div className="bg-black/90 px-1 py-0.2 rounded text-[7px] font-mono font-black text-amber-400/90 tracking-tighter truncate uppercase border border-amber-600/60">
                BARRIER
              </div>
            </div>
          )) || null}
        </div>

        {/* HAZARD ZONES CAUTION TAPE OVERLAY LAYER (Z-15) */}
        <div className="absolute inset-0 pointer-events-none z-15">
          {levelConfigs[characterKey]?.hazards?.map((haz, index) => (
            <div
              key={haz.id || index}
              className="absolute border-2 border-amber-400 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(245,158,11,0.6)] flex flex-col items-center justify-center p-1 group"
              style={{
                left: `${(haz.x / 640) * 100}%`,
                top: `${(haz.y / 380) * 100}%`,
                width: `${(haz.w / 640) * 100}%`,
                height: `${(haz.h / 380) * 100}%`,
                background: 'repeating-linear-gradient(45deg, rgba(234, 179, 8, 0.4) 0px, rgba(234, 179, 8, 0.4) 12px, rgba(0, 0, 0, 0.8) 12px, rgba(0, 0, 0, 0.8) 24px)'
              }}
            >
              <div className="bg-black/90 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-black text-amber-300 border border-amber-500 flex items-center gap-1 shadow-lg animate-pulse">
                <span className="text-yellow-400 animate-bounce">⚡</span>
                <span className="truncate">{haz.label || 'SPARKING WIRES'}</span>
              </div>
            </div>
          )) || null}
        </div>

        {/* Dynamic Player-Centered Ambient Lighting Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: characterKey === 'mother_blackout'
              ? `radial-gradient(circle 250px at ${(playerPos.x / 640) * 100}% ${(playerPos.y / 380) * 100}%, transparent 20%, rgba(0,0,0,0.95) 100%)`
              : `radial-gradient(circle 350px at ${(playerPos.x / 640) * 100}% ${(playerPos.y / 380) * 100}%, transparent 40%, rgba(0,0,0,0.7) 100%)`,
            maskImage: characterKey === 'mother_blackout'
              ? `radial-gradient(circle 250px at ${(playerPos.x / 640) * 100}% ${(playerPos.y / 380) * 100}%, transparent 20%, rgba(0,0,0,0.95) 100%)`
              : undefined,
            WebkitMaskImage: characterKey === 'mother_blackout'
              ? `radial-gradient(circle 250px at ${(playerPos.x / 640) * 100}% ${(playerPos.y / 380) * 100}%, transparent 20%, rgba(0,0,0,0.95) 100%)`
              : undefined
          }}
        />

        {/* DYNAMIC VISIBLE OBJECTIVE NPC / TARGET CHARACTER OVERLAY (Z-30) */}
        {(() => {
          const isStep1Done = stageProgress.step1;
          let label = "OBJECTIVE";
          let badgeBg = "bg-amber-500 text-black";
          let iconContent = null;

          if (!isStep1Done) {
            if (characterKey === 'mother') {
              label = "BURNT MIXER";
              iconContent = (
                <div className="w-12 h-12 bg-amber-950 border-2 border-black rounded-lg flex flex-col items-center justify-center relative shadow-lg">
                  <div className="text-lg animate-pulse">⚡</div>
                  <span className="text-[7px] font-black text-amber-300 uppercase">MIXER</span>
                </div>
              );
            } else if (characterKey === 'father') {
              label = "TEA COUNTER";
              iconContent = (
                <div className="w-12 h-12 bg-amber-900 border-2 border-black rounded-lg flex flex-col items-center justify-center relative shadow-lg">
                  <div className="text-lg animate-bounce">☕</div>
                  <span className="text-[7px] font-black text-amber-300 uppercase">STALL</span>
                </div>
              );
            } else if (characterKey === 'sibling') {
              label = "STUDY DESK";
              iconContent = (
                <div className="w-12 h-12 bg-indigo-950 border-2 border-black rounded-lg flex flex-col items-center justify-center relative shadow-lg">
                  <div className="text-lg animate-pulse">👛</div>
                  <span className="text-[7px] font-black text-amber-300 uppercase">WALLET</span>
                </div>
              );
            } else if (characterKey === 'protagonist') {
              label = "BIO CLOCK";
              iconContent = (
                <div className="w-12 h-12 bg-sky-950 border-2 border-black rounded-lg flex flex-col items-center justify-center relative shadow-lg">
                  <div className="text-lg animate-pulse">⏰</div>
                  <span className="text-[7px] font-black text-amber-300 uppercase">CLOCK</span>
                </div>
              );
            } else if (characterKey === 'father_arrest') {
              label = "CBI NOTICE TV";
              iconContent = (
                <div className="w-12 h-12 bg-purple-950 border-2 border-black rounded-lg flex flex-col items-center justify-center relative shadow-lg">
                  <div className="text-lg animate-pulse">📺</div>
                  <span className="text-[7px] font-black text-purple-300 uppercase">TV NEWS</span>
                </div>
              );
            } else if (characterKey === 'sibling_task') {
              label = "LIBRARY DESK";
              iconContent = (
                <div className="w-12 h-12 bg-cyan-950 border-2 border-black rounded-lg flex flex-col items-center justify-center relative shadow-lg">
                  <div className="text-lg animate-pulse">📚</div>
                  <span className="text-[7px] font-black text-cyan-300 uppercase">BOOKS</span>
                </div>
              );
            } else if (characterKey === 'mother_blackout') {
              label = "SWITCHBOARD";
              iconContent = (
                <div className="w-12 h-12 bg-stone-900 border-2 border-black rounded-lg flex flex-col items-center justify-center relative shadow-lg">
                  <div className="text-lg animate-ping">⚡</div>
                  <span className="text-[7px] font-black text-amber-400 uppercase">FUSE</span>
                </div>
              );
            } else if (characterKey === 'protagonist_qr') {
              label = "BOOK DISPLAY";
              iconContent = (
                <div className="w-12 h-12 bg-rose-950 border-2 border-black rounded-lg flex flex-col items-center justify-center relative shadow-lg">
                  <div className="text-lg animate-pulse">📖</div>
                  <span className="text-[7px] font-black text-rose-300 uppercase">OLX SALE</span>
                </div>
              );
            }
          } else {
            if (characterKey === 'father') {
              label = "FRANTIC STRANGER";
              badgeBg = "bg-red-600 text-white animate-pulse";
              iconContent = (
                <div className="w-12 h-14 bg-slate-950 border-2 border-red-500 rounded-xl flex flex-col items-center justify-center relative shadow-2xl animate-bounce">
                  <div className="w-8 h-8 rounded-full bg-purple-600 border-2 border-amber-400 flex items-center justify-center shadow-lg font-black text-white">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white stroke-black stroke-1">
                      <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm0 4c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z"/>
                    </svg>
                  </div>
                  <span className="text-[6px] font-black text-red-300 uppercase mt-0.5 animate-pulse">HELP!</span>
                </div>
              );
            } else if (characterKey === 'protagonist_qr') {
              label = "SHADY BUYER (OLX)";
              badgeBg = "bg-rose-600 text-white";
              iconContent = (
                <div className="w-12 h-14 bg-slate-900 border-2 border-rose-500 rounded-xl flex flex-col items-center justify-center relative shadow-2xl animate-pulse">
                  <div className="w-7 h-7 rounded-full bg-rose-500 border border-black flex items-center justify-center text-xs shadow font-black">
                    🕵🏻‍♂️
                  </div>
                  <span className="text-[6px] font-black text-rose-300 uppercase mt-0.5">ARMY OLX</span>
                </div>
              );
            } else if (characterKey === 'father_arrest') {
              label = "CBI VIDEO CALL";
              badgeBg = "bg-purple-600 text-white";
              iconContent = (
                <div className="w-12 h-14 bg-purple-950 border-2 border-purple-400 rounded-xl flex flex-col items-center justify-center relative shadow-2xl animate-pulse">
                  <div className="w-7 h-7 rounded-full bg-purple-600 border border-black flex items-center justify-center text-xs shadow font-black">
                    ⚖️
                  </div>
                  <span className="text-[6px] font-black text-purple-200 uppercase mt-0.5">CBI CALL</span>
                </div>
              );
            } else if (characterKey === 'sibling_task') {
              label = "TELEGRAM HR";
              badgeBg = "bg-cyan-600 text-white";
              iconContent = (
                <div className="w-12 h-14 bg-cyan-950 border-2 border-cyan-400 rounded-xl flex flex-col items-center justify-center relative shadow-2xl animate-pulse">
                  <div className="w-7 h-7 rounded-full bg-cyan-500 border border-black flex items-center justify-center text-xs shadow font-black">
                    💼
                  </div>
                  <span className="text-[6px] font-black text-cyan-200 uppercase mt-0.5">TASK HR</span>
                </div>
              );
            } else {
              label = "SECURE PHONE";
              iconContent = (
                <div className="w-10 h-14 bg-slate-950 border-2 border-cyan-400 rounded-xl flex flex-col items-center justify-center relative shadow-2xl animate-pulse">
                  <div className="w-6 h-9 bg-cyan-400 rounded flex flex-col items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  </div>
                  <span className="text-[6px] font-black text-cyan-300 uppercase mt-0.5">PHONE</span>
                </div>
              );
            }
          }

          return (
            <div
              className="absolute z-30 w-16 h-16 -ml-8 -mt-8 pointer-events-none flex flex-col items-center justify-center transition-all duration-300"
              style={{
                left: `${(activeTargetPos.x / 640) * 100}%`,
                top: `${(activeTargetPos.y / 380) * 100}%`
              }}
            >
              {/* GLOWING PULSE HALO RING */}
              <div className="absolute inset-0 rounded-full bg-amber-500/30 animate-ping pointer-events-none" />
              <div className="absolute -inset-2 rounded-full border-2 border-amber-400/80 animate-pulse pointer-events-none shadow-[0_0_20px_rgba(245,158,11,0.8)]" />

              {/* TOP FLOATING OBJECTIVE BADGE */}
              <div className={`px-1.5 py-0.5 rounded text-[7px] font-mono font-black uppercase shadow-lg border border-black z-10 flex items-center gap-1 ${badgeBg}`}>
                <span className="animate-bounce">🎯</span>
                <span className="truncate">{label}</span>
              </div>

              {/* NPC / OBJECT VISUAL CONTAINER */}
              <div className="mt-1 relative z-10">
                {iconContent}
              </div>
            </div>
          );
        })()}

        {/* STATIC FATHER NPC (TEA VENDOR) STANDING BEHIND COUNTER */}
        {characterKey === 'father' && (
          <div
            className="absolute z-25 w-12 h-14 -ml-6 -mt-7 pointer-events-none flex flex-col items-center justify-center"
            style={{ left: `${(270 / 640) * 100}%`, top: `${(50 / 380) * 100}%` }}
          >
            <div className="px-1.5 py-0.2 mb-0.5 rounded text-[7px] font-mono font-black text-amber-300 bg-slate-900 border border-amber-500/80 shadow-md">
              FATHER (TEA VENDOR)
            </div>
            <div className="w-10 h-10 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                <circle cx="50" cy="40" r="22" fill="#fcd34d" stroke="#000" strokeWidth="6" />
                <path d="M 28 32 Q 50 15 72 32 Q 50 22 28 32 Z" fill="#64748b" />
                <rect x="34" y="36" width="12" height="8" rx="2" fill="none" stroke="#000" strokeWidth="2.5" />
                <rect x="54" y="36" width="12" height="8" rx="2" fill="none" stroke="#000" strokeWidth="2.5" />
                <line x1="46" y1="40" x2="54" y2="40" stroke="#000" strokeWidth="2.5" />
                <path d="M 20 40 C 20 25, 80 25, 80 40 L 85 72 C 85 85, 15 85, 15 72 Z" fill="#334155" stroke="#000" strokeWidth="6" />
              </svg>
            </div>
          </div>
        )}

        {/* DYNAMIC PLAYER AVATAR SPRITE (Z-40) */}
        {renderPlayerAvatar()}

        {/* DIALOGUE BANNER */}
        {dialogueText && (
          <div className="absolute top-3 inset-x-3 bg-slate-950/95 text-amber-200 border-2 border-amber-500 p-3 rounded-xl comic-border text-xs font-noir flex items-start gap-2.5 shadow-2xl z-40 animate-pulse">
            <Info className="text-amber-400 shrink-0 mt-0.5" size={18} />
            <div className="flex-1 font-semibold leading-snug">{dialogueText}</div>
            <button
              onClick={() => setDialogueText(null)}
              className="text-amber-400 font-black text-xs px-2 py-0.5 bg-amber-950 rounded cursor-pointer hover:bg-amber-800"
            >
              ✕
            </button>
          </div>
        )}

        {/* 3. RE-ANCHORED DYNAMIC MOBILE CONTROLS (INSIDE FLEX-1 CANVAS STAGE CONTAINER) */}
        <div className="fixed z-50 pointer-events-none flex w-full items-end portrait:bottom-8 portrait:left-0 portrait:px-8 portrait:justify-between landscape:bottom-6 landscape:left-0 landscape:px-12 landscape:justify-between md:hidden">
          {/* Joystick Base (Left) */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            className="w-24 h-24 rounded-full bg-slate-950/90 border-4 border-amber-500 flex items-center justify-center relative touch-none pointer-events-auto shadow-2xl active:scale-95"
          >
            <div
              style={{
                transform: `translate(${joystickThumb.x}px, ${joystickThumb.y}px)`
              }}
              className="w-10 h-10 rounded-full bg-amber-400 border-2 border-black comic-border shadow-md transition-transform duration-75"
            />
          </div>

          {/* Action Button (Right) */}
          <button
            onClick={triggerActionDirect}
            className={`w-20 h-20 text-xs font-black uppercase rounded-full bg-amber-500 hover:bg-amber-400 text-black shadow-2xl active:scale-95 bg-amber-500/90 flex flex-col items-center justify-center border-4 border-black comic-border pointer-events-auto cursor-pointer transition-all ${interactPrompt ? 'animate-bounce bg-amber-400 ring-4 ring-amber-300' : 'opacity-90'
              }`}
          >
            <Sparkles size={20} />
            <span className="text-[10px] font-black uppercase tracking-tighter mt-0.5 text-center leading-tight">
              {interactPrompt ? t('btnInteract') : t('btnAction')}
            </span>
          </button>
        </div>
      </div>

      {/* 4. DESKTOP DOCK CONTROLS BAR (SHRINK-0 Z-40 FOR MD:FLEX) */}
      <div className="hidden md:flex shrink-0 h-16 w-full max-w-4xl mx-auto px-6 items-center justify-between bg-black/90 border-t-2 border-amber-900/60 z-40 comic-border">
        <div className="flex items-center gap-3">
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            className="w-12 h-12 rounded-full bg-slate-950 border-2 border-amber-500 flex items-center justify-center relative touch-none cursor-pointer shadow-lg"
          >
            <div
              style={{
                transform: `translate(${joystickThumb.x * 0.4}px, ${joystickThumb.y * 0.4}px)`
              }}
              className="w-5 h-5 rounded-full bg-amber-400 border border-black shadow"
            />
          </div>
          <div className="text-xs text-amber-400 font-mono">{t('joystickLabel')}</div>
        </div>

        <div className="flex items-center gap-2 text-xs text-amber-300/80 font-sans-game font-semibold">
          <Footprints size={18} className="text-amber-400" />
          <span>{t('keyboardHint')}</span>
        </div>

        <button
          onClick={triggerActionDirect}
          className={`px-5 py-2.5 text-xs font-black uppercase rounded-xl bg-amber-500 hover:bg-amber-400 text-black shadow-lg active:scale-95 flex items-center justify-center gap-2 border-2 border-black comic-border cursor-pointer transition-all ${interactPrompt ? 'animate-bounce bg-amber-400 ring-4 ring-amber-300' : 'opacity-90'
            }`}
        >
          <Sparkles size={16} />
          <span className="font-black uppercase tracking-wider">
            {interactPrompt ? t('btnInteract') : t('btnAction')}
          </span>
          <span className="text-[10px] font-mono">[E]</span>
        </button>
      </div>

      {/* 5. ACTION COMIC OVERLAY PANEL */}
      {activeComic && (
        <div
          onClick={handleDismissComic}
          className="fixed inset-0 z-[120] bg-black/90 flex flex-col items-center justify-center p-6 backdrop-blur-md cursor-pointer select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-200 border-8 border-black p-2 md:p-4 -rotate-2 shadow-[12px_12px_0px_rgba(217,119,6,1)] max-w-lg w-full relative animate-in zoom-in-95 duration-300"
          >
            <div className="bg-zinc-900 border-4 border-black w-full aspect-video flex items-center justify-center overflow-hidden">
              <img src={activeComic.image} alt="Comic Panel" className="w-full h-full object-cover" />
            </div>

            <div className="absolute -bottom-6 md:-bottom-8 left-4 right-4 bg-amber-400 border-4 border-black p-3 font-bold font-mono text-black text-xs md:text-sm shadow-[4px_4px_0px_rgba(0,0,0,1)] text-center">
              {activeComic.text}
            </div>
          </div>

          <button
            onClick={handleDismissComic}
            className="mt-16 text-amber-500 hover:text-amber-400 font-mono font-bold animate-pulse active:scale-95 text-lg cursor-pointer"
          >
            [ CLICK TO INVESTIGATE ]
          </button>
        </div>
      )}

      {/* 6. HAZARD DISCLAIMER OVERLAY */}
      {showDisclaimer && (
        <div
          onClick={() => {
            playSound('pop', soundMuted);
            showDisclaimerRef.current = false;
            setShowDisclaimer(false);
          }}
          className="fixed inset-0 bg-black/80 z-[999] flex items-center justify-center p-4 cursor-pointer select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border-4 border-amber-500 shadow-[8px_8px_0px_rgba(245,158,11,1)] p-6 md:p-8 max-w-lg w-full text-center flex flex-col items-center gap-5 relative animate-in zoom-in-95 duration-200"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400 font-black text-3xl shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              ⚠️
            </div>

            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-black font-mono tracking-wider text-amber-400 uppercase">
                HAZARD WARNING
              </h2>
              <p className="text-sm md:text-base font-bold font-mono text-zinc-200 leading-relaxed border-t border-b border-zinc-800 py-4 my-2">
                ⚠️ HAZARD WARNING: Watch your step Detective. If you step on exposed cables, sparking wires, or other environmental hazards, you will lose Vault capital and restart from the beginning.
              </p>
            </div>

            <button
              ref={disclaimerBtnRef}
              onClick={() => {
                playSound('pop', soundMuted);
                showDisclaimerRef.current = false;
                setShowDisclaimer(false);
              }}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 border-2 border-amber-700 rounded-xl cursor-pointer transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-0.5 flex items-center justify-center gap-2 uppercase tracking-wide font-mono text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-amber-300"
            >
              <span className="font-bold">I Understand [ CLICK ]</span>
            </button>

            <div className="text-[11px] font-mono text-amber-300/70 tracking-widest uppercase">
              Press [ENTER], [SPACE], or [E] to continue
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
