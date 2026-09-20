import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Flame, Lock, ArrowRight, UserCheck, RefreshCw, Layers } from 'lucide-react';
import { playSound } from '../audio/soundEngine';
import { getTranslation } from '../localization/translations';

export default function NoirCaseBoard({ familyVault, characterProgress, onSelectCharacter, onGoToAudit, soundMuted, currentLanguage }) {
  const [activeTab, setActiveTab] = useState('week1');
  
  const t = (key, params) => getTranslation(currentLanguage, key, params);

  const week1Cases = [
    {
      key: 'mother',
      titleKey: 'caseMotherTitle',
      subtitleKey: 'caseMotherSubtitle',
      vectorKey: 'caseMotherVector',
      descKey: 'caseMotherDesc',
      polaroidColor: 'bg-amber-100 border-amber-900',
      icon: '🍳'
    },
    {
      key: 'sibling',
      titleKey: 'caseSiblingTitle',
      subtitleKey: 'caseSiblingSubtitle',
      vectorKey: 'caseSiblingVector',
      descKey: 'caseSiblingDesc',
      polaroidColor: 'bg-indigo-100 border-indigo-900',
      icon: '🎓'
    },
    {
      key: 'father',
      titleKey: 'caseFatherTitle',
      subtitleKey: 'caseFatherSubtitle',
      vectorKey: 'caseFatherVector',
      descKey: 'caseFatherDesc',
      polaroidColor: 'bg-slate-100 border-slate-900',
      icon: '☕'
    },
    {
      key: 'protagonist',
      titleKey: 'caseProtagonistTitle',
      subtitleKey: 'caseProtagonistSubtitle',
      vectorKey: 'caseProtagonistVector',
      descKey: 'caseProtagonistDesc',
      polaroidColor: 'bg-red-100 border-red-900',
      icon: '💼'
    }
  ];

  const week2Cases = [
    {
      key: 'father_arrest',
      titleKey: 'caseFatherArrestTitle',
      subtitleKey: 'caseFatherArrestSubtitle',
      vectorKey: 'caseFatherArrestVector',
      descKey: 'caseFatherArrestDesc',
      polaroidColor: 'bg-purple-100 border-purple-900',
      icon: '⚖️'
    },
    {
      key: 'sibling_task',
      titleKey: 'caseSiblingTaskTitle',
      subtitleKey: 'caseSiblingTaskSubtitle',
      vectorKey: 'caseSiblingTaskVector',
      descKey: 'caseSiblingTaskDesc',
      polaroidColor: 'bg-cyan-100 border-cyan-900',
      icon: '📱'
    },
    {
      key: 'mother_blackout',
      titleKey: 'caseMotherBlackoutTitle',
      subtitleKey: 'caseMotherBlackoutSubtitle',
      vectorKey: 'caseMotherBlackoutVector',
      descKey: 'caseMotherBlackoutDesc',
      polaroidColor: 'bg-emerald-100 border-emerald-900',
      icon: '⚡'
    },
    {
      key: 'protagonist_qr',
      titleKey: 'caseProtagonistQrTitle',
      subtitleKey: 'caseProtagonistQrSubtitle',
      vectorKey: 'caseProtagonistQrVector',
      descKey: 'caseProtagonistQrDesc',
      polaroidColor: 'bg-rose-100 border-rose-900',
      icon: '🛍️'
    }
  ];

  const currentCases = activeTab === 'week1' ? week1Cases : week2Cases;

  const completedCount = Object.values(characterProgress).filter(c => c.completed).length;
  const allCompleted = completedCount === 8;

  const handleCardClick = (key) => {
    playSound('click', soundMuted);
    onSelectCharacter(key);
  };

  const handleTabClick = (tabKey) => {
    playSound('click', soundMuted);
    setActiveTab(tabKey);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-5 bg-[var(--bg-app-root)] halftone-bg text-[var(--text-main)] font-noir relative select-none overflow-y-auto">
      
      {/* DETECTIVE BOARD HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--bg-card)] border-4 border-amber-600/60 p-3 sm:px-5 rounded-2xl comic-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black text-xl comic-border">
            🕵️
          </div>
          <div>
            <h1 className="font-title text-2xl sm:text-3xl text-amber-400 leading-none">{t('caseBoardHeader')}</h1>
            <p className="text-xs text-[var(--text-muted)] font-sans-game font-semibold">{t('caseBoardSubtext')}</p>
          </div>
        </div>

        {/* VAULT HUD DISPLAY */}
        <div className="flex items-center gap-4 bg-[var(--bg-desk-box)] border-2 border-amber-500 px-4 py-2 rounded-xl">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">{t('familyVaultLabel')}</div>
            <div className={`font-black text-xl font-mono ${familyVault < 50000 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
              ₹{familyVault.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-900 border border-amber-400 flex items-center justify-center font-bold text-amber-300">
            {completedCount}/8
          </div>
        </div>
      </div>

      {/* WEEK 1 vs WEEK 2 TABS */}
      <div className="flex items-center gap-2 mt-3 px-1">
        <button
          onClick={() => handleTabClick('week1')}
          className={`flex-1 sm:flex-none py-2 px-4 rounded-t-xl font-black text-xs sm:text-sm transition-all comic-border cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'week1'
              ? 'bg-amber-500 text-black shadow-lg translate-y-1'
              : 'bg-black/60 text-amber-400 hover:bg-black/80'
          }`}
        >
          <Layers size={16} />
          <span>{t('tabWeek1')}</span>
        </button>

        <button
          onClick={() => handleTabClick('week2')}
          className={`flex-1 sm:flex-none py-2 px-4 rounded-t-xl font-black text-xs sm:text-sm transition-all comic-border cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'week2'
              ? 'bg-amber-500 text-black shadow-lg translate-y-1'
              : 'bg-black/60 text-amber-400 hover:bg-black/80'
          }`}
        >
          <span>⚡</span>
          <span>{t('tabWeek2')}</span>
        </button>
      </div>

      {/* CORKBOARD AREA WITH POLAROID CASE FILES & RED YARN LINES */}
      <div className="mb-4 relative bg-[var(--bg-card)] border-4 border-black rounded-2xl rounded-tl-none p-4 sm:p-6 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* Decorative Red Yarn Background SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40" xmlns="http://www.w3.org/2000/svg">
          <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="#ef4444" strokeWidth="3" strokeDasharray="6 4" />
          <line x1="80%" y1="20%" x2="50%" y2="50%" stroke="#ef4444" strokeWidth="3" strokeDasharray="6 4" />
          <line x1="20%" y1="80%" x2="50%" y2="50%" stroke="#ef4444" strokeWidth="3" strokeDasharray="6 4" />
          <line x1="80%" y1="80%" x2="50%" y2="50%" stroke="#ef4444" strokeWidth="3" strokeDasharray="6 4" />
        </svg>

        {/* Central Pin / Vault Badge */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center">
          <div className="w-5 h-5 rounded-full bg-red-600 border-2 border-black shadow-md animate-ping mb-1"></div>
          <div className="bg-black text-amber-400 px-3 py-1 text-xs font-black comic-border uppercase">
            {t('centralPin')}
          </div>
        </div>

        {/* 4 CASE CARDS GRID FOR CURRENT TAB */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 z-10 relative">
          {currentCases.map((item) => {
            const prog = characterProgress[item.key] || { completed: false, saved: false, loss: 0 };

            return (
              <div
                key={item.key}
                onClick={() => handleCardClick(item.key)}
                className={`p-4 rounded-xl comic-border cursor-pointer transition-all duration-200 relative transform hover:-translate-y-1 hover:rotate-1 ${item.polaroidColor} text-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group`}
              >
                {/* Push pin icon top center */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-red-600 border-2 border-black shadow-md flex items-center justify-center font-bold text-[10px] text-white">
                  📌
                </div>

                <div className="flex items-start justify-between border-b-2 border-slate-900/30 pb-2 mb-2">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-slate-700 uppercase">{t(item.titleKey)}</span>
                    <h3 className="font-title text-2xl text-slate-950 font-bold leading-tight">{t(item.subtitleKey)}</h3>
                  </div>
                  <div className="text-3xl p-1 bg-white/80 rounded-lg comic-border">
                    {item.icon}
                  </div>
                </div>

                <p className="text-xs font-noir font-semibold text-slate-800 mb-3 min-h-[32px]">
                  {t(item.descKey)}
                </p>

                <div className="bg-slate-900/10 p-2 rounded-lg text-[11px] font-mono font-bold mb-3 border border-slate-900/20">
                  <span className="text-slate-600 block text-[9px] uppercase">{t('threatVector')}</span>
                  <span className="text-slate-900">{t(item.vectorKey)}</span>
                </div>

                {/* Status Footer */}
                <div className="flex items-center justify-between border-t-2 border-slate-900/30 pt-2.5">
                  {prog.completed ? (
                    prog.saved ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white text-xs font-black comic-border">
                        <CheckCircle size={14} />
                        <span>{t('statusSafe')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white text-xs font-black comic-border">
                        <Flame size={14} />
                        <span>{t('statusScammed')}{prog.loss.toLocaleString('en-IN')})</span>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-black text-xs font-black comic-border">
                      <AlertTriangle size={14} />
                      <span>{t('statusUninvestigated')}</span>
                    </div>
                  )}

                  <button className="py-1 px-3 bg-black text-amber-300 font-bold text-xs rounded hover:bg-amber-950 flex items-center gap-1 transition-colors">
                    <span>{prog.completed ? t('btnReplay') : t('btnInvestigate')}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* FOOTER AUDIT BUTTON WHEN ALL 8 CASES ARE DONE */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/90 p-3 rounded-xl comic-border">
        <div className="text-xs text-amber-300/80 font-sans-game">
          {allCompleted ? t('allCompletedSubtext') : t('remainingSubtext', { count: 8 - completedCount })}
        </div>

        {allCompleted && (
          <button
            onClick={onGoToAudit}
            className="w-full sm:w-auto py-3 px-6 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm rounded-xl comic-border flex items-center justify-center gap-2 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce"
          >
            <span>{t('btnFinalAudit')}</span>
          </button>
        )}
      </div>

    </div>
  );
}
