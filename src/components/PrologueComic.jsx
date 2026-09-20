import React, { useState } from 'react';
import { Sparkles, ArrowRight, Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { playSound } from '../audio/soundEngine';
import { getTranslation } from '../localization/translations';

export default function PrologueComic({ onComplete, soundMuted, toggleSound, currentLanguage }) {
  const [activePanel, setActivePanel] = useState(0);

  const t = (key, params) => getTranslation(currentLanguage, key, params);

  const panels = [
    {
      id: 'panel1',
      titleKey: 'panel1Title',
      taglineKey: 'panel1Tagline',
      bgClass: 'from-amber-950/40 via-amber-900/20 to-black',
      image: '/comics/salary_alert.png',
      svg: (
        <svg className="w-full h-full pointer-events-none" viewBox="0 0 400 240" fill="none">
          <rect width="400" height="240" fill="#120c08" />
          <path d="M 150 0 L 250 0 L 360 240 L 40 240 Z" fill="url(#lampGlow)" opacity="0.35" />
          <defs>
            <radialGradient id="lampGlow" cx="50%" cy="0%" r="90%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect x="0" y="160" width="400" height="80" fill="#29180e" stroke="#000" strokeWidth="4" />
          <path d="M 200 10 L 220 10 L 210 40 Z" fill="#f59e0b" stroke="#000" strokeWidth="3" />
          <path d="M 210 40 Q 240 80 230 160" stroke="#d97706" strokeWidth="6" fill="none" />
          <rect x="140" y="140" width="120" height="70" rx="8" fill="#1e293b" stroke="#000" strokeWidth="4" />
          <rect x="145" y="145" width="110" height="60" rx="4" fill="#0284c7" className="animate-pulse" />
          <text x="150" y="165" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">A/C CREDITED!</text>
          <text x="150" y="180" fill="#fef08a" fontSize="12" fontWeight="bold" fontFamily="monospace">₹50,000.00</text>
          <text x="150" y="195" fill="#e0f2fe" fontSize="8" fontFamily="sans-serif">Family Salary Vault</text>
          <path d="M 100 240 Q 130 180 145 180" stroke="#78350f" strokeWidth="16" strokeLinecap="round" />
          <path d="M 300 240 Q 270 180 255 180" stroke="#78350f" strokeWidth="16" strokeLinecap="round" />
        </svg>
      ),
      speech: (
        <div className="bg-amber-100 text-black p-3.5 comic-border rounded-xl relative w-full">
          <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">{t('panel1Protagonist')}</div>
          <p className="text-sm font-semibold leading-tight font-noir">
            {t('panel1Speech')}
          </p>
        </div>
      ),
      sfxKey: 'panel1SFX'
    },
    {
      id: 'panel2',
      titleKey: 'panel2Title',
      taglineKey: 'panel2Tagline',
      bgClass: 'from-amber-950/50 via-slate-900 to-black',
      image: '/comics/multi_buzz.png',
      svg: (
        <svg className="w-full h-full pointer-events-none" viewBox="0 0 400 240" fill="none">
          <rect width="400" height="240" fill="#0a0a0c" />
          <line x1="133" y1="0" x2="133" y2="240" stroke="#000" strokeWidth="5" />
          <line x1="266" y1="0" x2="266" y2="240" stroke="#000" strokeWidth="5" />
          <rect x="5" y="5" width="123" height="230" fill="#1c100b" />
          <circle cx="66" cy="70" r="24" fill="#78350f" stroke="#000" strokeWidth="3" />
          <rect x="40" y="140" width="50" height="80" fill="#0284c7" stroke="#000" strokeWidth="3" className="animate-bounce" />
          <text x="25" y="210" fill="#f59e0b" fontSize="11" fontWeight="bold" fontFamily="monospace">MOTHER</text>
          <text x="35" y="225" fill="#ffffff" fontSize="9">Kitchen</text>
          <rect x="138" y="5" width="123" height="230" fill="#0f172a" />
          <circle cx="200" cy="70" r="24" fill="#475569" stroke="#000" strokeWidth="3" />
          <rect x="175" y="140" width="50" height="80" fill="#0284c7" stroke="#000" strokeWidth="3" className="animate-bounce" />
          <text x="160" y="210" fill="#f59e0b" fontSize="11" fontWeight="bold" fontFamily="monospace">FATHER</text>
          <text x="165" y="225" fill="#94a3b8" fontSize="9">Tea Stall</text>
          <rect x="271" y="5" width="124" height="230" fill="#1e1b4b" />
          <circle cx="333" cy="70" r="24" fill="#3730a3" stroke="#000" strokeWidth="3" />
          <rect x="308" y="140" width="50" height="80" fill="#0284c7" stroke="#000" strokeWidth="3" className="animate-bounce" />
          <text x="295" y="210" fill="#f59e0b" fontSize="11" fontWeight="bold" fontFamily="monospace">SIBLING</text>
          <text x="305" y="225" fill="#a5b4fc" fontSize="9">Hostel</text>
        </svg>
      ),
      speech: (
        <div className="bg-amber-100 text-black p-3.5 comic-border rounded-xl relative w-full">
          <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">{t('panel2Alert')}</div>
          <p className="text-sm font-semibold leading-tight font-noir">
            {t('panel2Speech')}
          </p>
        </div>
      ),
      sfxKey: 'panel2SFX'
    },
    {
      id: 'panel3',
      titleKey: 'panel3Title',
      taglineKey: 'panel3Tagline',
      bgClass: 'from-orange-950/60 via-red-950/40 to-black',
      image: '/comics/kitchen_smoke.png',
      svg: (
        <svg className="w-full h-full pointer-events-none" viewBox="0 0 400 240" fill="none">
          <rect width="400" height="240" fill="#180e07" />
          <rect x="0" y="150" width="400" height="90" fill="#2d1b10" stroke="#000" strokeWidth="4" />
          <rect x="160" y="100" width="80" height="70" rx="6" fill="#475569" stroke="#000" strokeWidth="4" />
          <path d="M 175 60 L 225 60 L 215 100 L 185 100 Z" fill="#94a3b8" stroke="#000" strokeWidth="3" />
          <circle cx="160" cy="50" r="30" fill="#334155" opacity="0.7" />
          <circle cx="230" cy="40" r="35" fill="#1e293b" opacity="0.8" />
          <circle cx="190" cy="30" r="40" fill="#0f172a" opacity="0.9" />
          <path d="M 150 90 L 170 70 L 160 110 L 190 80" stroke="#f59e0b" strokeWidth="4" fill="none" className="animate-pulse" />
          <path d="M 230 110 L 250 85 L 235 125" stroke="#ef4444" strokeWidth="4" fill="none" className="animate-ping" />
        </svg>
      ),
      speech: (
        <div className="bg-orange-100 text-black p-3.5 comic-border rounded-xl relative w-full">
          <div className="text-xs font-bold text-orange-900 uppercase tracking-wider mb-1">{t('panel3Mother')}</div>
          <p className="text-sm font-semibold leading-tight font-noir">
            {t('panel3Speech')}
          </p>
        </div>
      ),
      sfxKey: 'panel3SFX'
    },
    {
      id: 'panel4',
      titleKey: 'panel4Title',
      taglineKey: 'panel4Tagline',
      bgClass: 'from-amber-950 via-slate-950 to-black',
      image: '/comics/hunt_begins.png',
      svg: (
        <svg className="w-full h-full pointer-events-none" viewBox="0 0 400 240" fill="none">
          <rect width="400" height="240" fill="#090604" />
          <circle cx="200" cy="120" r="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 6" opacity="0.4" />
          <circle cx="200" cy="120" r="70" stroke="#ef4444" strokeWidth="3" opacity="0.6" />
          <rect x="150" y="70" width="100" height="100" rx="16" fill="#1c100b" stroke="#f59e0b" strokeWidth="6" />
          <circle cx="200" cy="120" r="22" fill="#d97706" stroke="#000" strokeWidth="4" />
          <path d="M 200 100 L 200 140 M 180 120 L 220 120" stroke="#000" strokeWidth="4" />
          <text x="135" y="200" fill="#fef08a" fontSize="16" fontWeight="900" fontFamily="monospace">FAMILY VAULT: ₹50,000</text>
        </svg>
      ),
      speech: (
        <div className="bg-amber-400 text-black p-3.5 comic-border rounded-xl relative w-full text-center">
          <div className="text-xs font-black uppercase tracking-widest text-black mb-1">{t('panel4Caption')}</div>
          <p className="text-sm sm:text-base font-black leading-snug font-noir">
            {t('panel4Speech')}
          </p>
        </div>
      ),
      sfxKey: 'panel4SFX'
    }
  ];

  const current = panels[activePanel];

  const handleNext = () => {
    try {
      playSound('pop', soundMuted);
    } catch (e) {
      console.warn('Audio play error:', e);
    }

    if (activePanel < panels.length - 1) {
      setActivePanel((prev) => (prev < panels.length - 1 ? prev + 1 : prev));
    } else {
      try {
        playSound('success', soundMuted);
      } catch (e) {
        console.warn('Audio play error:', e);
      }
      onComplete();
    }
  };

  const handlePrev = () => {
    try {
      playSound('click', soundMuted);
    } catch (e) {
      console.warn('Audio play error:', e);
    }

    if (activePanel > 0) {
      setActivePanel((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-5 bg-[var(--bg-app-root)] text-[var(--text-main)] font-noir relative select-none">

      {/* HEADER BAR */}
      <div className="flex items-center justify-between z-30 relative border-b-4 border-amber-600/40 pb-2 mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-amber-500 animate-pulse shrink-0" size={20} />
          <span className="font-title text-xl sm:text-2xl text-amber-400 tracking-wider">{t('prologueHeader')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 bg-amber-950/80 border-2 border-amber-500 rounded text-xs font-bold text-amber-300">
            {activePanel + 1} / 4
          </div>
        </div>
      </div>

      {/* MAIN COMIC STAGE */}
      <div className="flex flex-col md:grid md:grid-cols-2 gap-3 w-full flex-1 my-auto items-center justify-center">

        {/* VISUAL NOIR PANEL */}
        <div className="w-full h-52 sm:h-64 md:h-full relative rounded-xl border-2 border-black overflow-hidden comic-border-amber bg-black shrink-0">
          {current.image ? (
            <img
              src={current.image}
              alt={t(current.titleKey)}
              className="w-full h-full object-cover select-none"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : null}

          {/* SVG Fallback */}
          <div className={current.image ? 'hidden' : 'w-full h-full'}>
            {current.svg}
          </div>

          {/* SFX Action Burst */}
          <div className="absolute top-3 right-3 bg-amber-400 text-black px-2.5 py-1 font-black text-xs comic-border rotate-6 animate-bounce pointer-events-none">
            {t(current.sfxKey)}
          </div>

          {/* Tagline overlay */}
          <div className="absolute bottom-0 inset-x-0 bg-black/85 backdrop-blur border-t-2 border-amber-500 p-2 text-center text-xs font-bold text-amber-300 pointer-events-none">
            {t(current.taglineKey)}
          </div>
        </div>

        {/* DIALOGUE & BUTTON CONTROLS */}
        <div className="w-full flex flex-col justify-between gap-3 mt-2 md:mt-0 relative z-40">
          <div className="text-amber-400 font-title text-lg sm:text-xl tracking-wide uppercase">
            {t(current.titleKey)}
          </div>

          {current.speech}

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 mt-2 w-full">
            {activePanel > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-amber-200 border-2 border-amber-700 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-md"
              >
                {t('prevPanel')}
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3 text-base bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl comic-border flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:translate-y-0.5"
            >
              <span>{activePanel === panels.length - 1 ? t('openCaseBoard') : t('nextPanel')}</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

      </div>

      {/* FOOTER BAR */}
      <div className="flex items-center justify-between text-[10px] sm:text-xs text-amber-600/70 border-t border-amber-900/40 pt-2 shrink-0 mt-2">
        <div>{t('prologueFooterLeft')}</div>
        <div>{t('prologueFooterRight')}</div>
      </div>

    </div>
  );
}