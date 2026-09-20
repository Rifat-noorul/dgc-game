import React, { useState, useRef, useEffect } from 'react';
import { ShieldAlert, Target, Brain, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { playSound } from '../audio/soundEngine';
import { getTranslation } from '../localization/translations';

export default function CaseBriefing({
  caseKey,
  characterKey,
  onStartInvestigation,
  onStartMission,
  onStart,
  soundMuted,
  currentLanguage
}) {
  const t = (key, params) => getTranslation(currentLanguage, key, params);

  const [holdProgress, setHoldProgress] = useState(0);
  const holdIntervalRef = useRef(null);
  const isTransitioningRef = useRef(false);

  const activeKey = caseKey || characterKey || 'mother';
  const startHandler = onStartInvestigation || onStartMission || onStart;

  // Case Briefing Metadata tailored per character case
  const briefingData = {
    mother: {
      titleKey: "caseMotherTitle",
      subtitleKey: "caseMotherSubtitle",
      vectorKey: "caseMotherVector",
      icon: "🍳",
      conKey: "caseMotherCon",
      objectiveKey: "caseMotherObjective"
    },
    father: {
      titleKey: "caseFatherTitle",
      subtitleKey: "caseFatherSubtitle",
      vectorKey: "caseFatherVector",
      icon: "☕",
      conKey: "caseFatherCon",
      objectiveKey: "caseFatherObjective"
    },
    sibling: {
      titleKey: "caseSiblingTitle",
      subtitleKey: "caseSiblingSubtitle",
      vectorKey: "caseSiblingVector",
      icon: "🎓",
      conKey: "caseSiblingCon",
      objectiveKey: "caseSiblingObjective"
    },
    protagonist: {
      titleKey: "caseProtagonistTitle",
      subtitleKey: "caseProtagonistSubtitle",
      vectorKey: "caseProtagonistVector",
      icon: "💼",
      conKey: "caseProtagonistCon",
      objectiveKey: "caseProtagonistObjective"
    },
    father_arrest: {
      titleKey: "caseFatherArrestTitle",
      subtitleKey: "caseFatherArrestSubtitle",
      vectorKey: "caseFatherArrestVector",
      icon: "⚖️",
      conKey: "caseFatherArrestCon",
      objectiveKey: "caseFatherArrestObjective"
    },
    sibling_task: {
      titleKey: "caseSiblingTaskTitle",
      subtitleKey: "caseSiblingTaskSubtitle",
      vectorKey: "caseSiblingTaskVector",
      icon: "📱",
      conKey: "caseSiblingTaskCon",
      objectiveKey: "caseSiblingTaskObjective"
    },
    mother_blackout: {
      titleKey: "caseMotherBlackoutTitle",
      subtitleKey: "caseMotherBlackoutSubtitle",
      vectorKey: "caseMotherBlackoutVector",
      icon: "⚡",
      conKey: "caseMotherBlackoutCon",
      objectiveKey: "caseMotherBlackoutObjective"
    },
    protagonist_qr: {
      titleKey: "caseProtagonistQrTitle",
      subtitleKey: "caseProtagonistQrSubtitle",
      vectorKey: "caseProtagonistQrVector",
      icon: "🛍️",
      conKey: "caseProtagonistQrCon",
      objectiveKey: "caseProtagonistQrObjective"
    }
  };

  const caseData = briefingData[activeKey] || briefingData.mother;

  // Cleanup hold interval on unmount
  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
      }
    };
  }, []);

  // Hold-to-Proceed Handler (1.0 Second)
  const startHolding = (e) => {
    if (isTransitioningRef.current) return;
    if (e && e.cancelable && e.type.startsWith('touch')) {
      e.preventDefault();
    }

    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }

    playSound('pop', soundMuted);
    let progress = 0;

    holdIntervalRef.current = setInterval(() => {
      progress += 5;
      setHoldProgress(progress);

      if (progress >= 100) {
        clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = null;
        isTransitioningRef.current = true;

        playSound('success', soundMuted);

        if (typeof startHandler === 'function') {
          startHandler();
        }
      }
    }, 30); // 30ms * 20 steps = 600ms total
  };

  const stopHolding = () => {
    if (isTransitioningRef.current) return;
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    setHoldProgress(0);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-[#0c0906] halftone-dark text-slate-100 font-noir relative select-none overflow-y-auto">
      
      {/* CLASSIFIED DOSSIER FOLDER CONTAINER */}
      <div className="my-auto w-full max-w-2xl mx-auto bg-amber-100 text-slate-900 border-4 border-black rounded-2xl p-4 sm:p-6 comic-border shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
        
        {/* CONFIDENTIAL STAMP */}
        <div className="absolute -top-4 right-4 bg-red-600 text-white font-black text-xs sm:text-sm px-4 py-1 rounded comic-border transform rotate-3 uppercase tracking-widest animate-pulse">
          {t('classifiedDossier')}
        </div>

        {/* HEADER */}
        <div className="flex items-center gap-3 border-b-2 border-slate-900/30 pb-3 mb-4">
          <div className="text-3xl p-2 bg-white/80 rounded-xl comic-border">
            {caseData.icon}
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-slate-600 tracking-widest">{t(caseData.titleKey)}</div>
            <h2 className="font-title text-2xl sm:text-3xl text-slate-950 leading-none">{t(caseData.subtitleKey)}</h2>
          </div>
        </div>

        {/* DOSSIER SECTIONS */}
        <div className="space-y-3.5 text-xs font-noir font-semibold">
          
          {/* THREAT VECTOR */}
          <div className="bg-amber-950/10 p-3 rounded-xl border border-amber-900/20">
            <div className="flex items-center gap-1.5 font-black text-amber-900 uppercase text-[11px] mb-1">
              <ShieldAlert size={16} className="text-red-600" />
              <span>{t('threatVectorHeader')}</span>
            </div>
            <div className="font-mono text-slate-900 font-bold text-sm">
              {t(caseData.vectorKey)}
            </div>
          </div>

          {/* THE PSYCHOLOGICAL CON */}
          <div className="bg-slate-900/10 p-3 rounded-xl border border-slate-900/20">
            <div className="flex items-center gap-1.5 font-black text-slate-800 uppercase text-[11px] mb-1">
              <Brain size={16} className="text-purple-700" />
              <span>{t('psychologicalConHeader')}</span>
            </div>
            <p className="text-slate-800 leading-relaxed font-sans-game">
              {t(caseData.conKey)}
            </p>
          </div>

          {/* PRIMARY MISSION OBJECTIVE */}
          <div className="bg-emerald-950/10 p-3 rounded-xl border border-emerald-900/20">
            <div className="flex items-center gap-1.5 font-black text-emerald-900 uppercase text-[11px] mb-1">
              <Target size={16} className="text-emerald-700" />
              <span>{t('primaryObjectiveHeader')}</span>
            </div>
            <p className="text-slate-900 font-bold leading-relaxed">
              {t(caseData.objectiveKey)}
            </p>
          </div>

        </div>

        {/* HOLD-TO-PROCEED ACTION BUTTON */}
        <div className="mt-6 pt-3 border-t-2 border-slate-900/30">
          <button
            onMouseDown={startHolding}
            onMouseUp={stopHolding}
            onMouseLeave={stopHolding}
            onTouchStart={startHolding}
            onTouchEnd={stopHolding}
            className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-900 text-amber-300 font-black text-sm rounded-xl comic-border relative overflow-hidden flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 touch-none"
          >
            {/* Filling Progress Fill */}
            <div
              className="absolute inset-y-0 left-0 bg-amber-500 transition-all duration-75"
              style={{ width: `${holdProgress}%` }}
            ></div>

            <span className="relative z-10 font-title text-base sm:text-lg tracking-wider text-white">
              {holdProgress > 0 ? `HOLDING... ${holdProgress}%` : t('holdToBegin')}
            </span>
            <ArrowRight size={18} className="relative z-10 text-amber-400" />
          </button>
          <div className="text-[10px] text-center text-slate-600 font-mono mt-1">{t('pressAndHoldHint')}</div>
        </div>

      </div>

    </div>
  );
}
