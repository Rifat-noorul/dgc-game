import React from 'react';
import { Trophy, Award, ShieldCheck, Flame, RotateCcw, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { playSound } from '../audio/soundEngine';
import { getTranslation } from '../localization/translations';

export default function FinalAudit({ familyVault, characterProgress, onRestartGame, soundMuted, currentLanguage }) {
  
  const t = (key, params) => getTranslation(currentLanguage, key, params);

  const startingVault = 50000;
  const totalLost = startingVault - familyVault;
  const vaultPercent = Math.max(0, Math.round((familyVault / startingVault) * 100));

  // Determine Detective Grade & Arcade Rank Title
  let grade = 'F';
  let gradeTitle = 'COMPROMISED TARGET';
  let gradeBg = 'bg-red-950 text-red-400 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]';

  if (familyVault === 50000) {
    grade = 'S';
    gradeTitle = 'MASTER CYBER DETECTIVE (PERFECT)';
    gradeBg = 'bg-emerald-950 text-amber-300 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)] animate-pulse';
  } else if (vaultPercent >= 80) {
    grade = 'A';
    gradeTitle = 'SENIOR FRAUD INVESTIGATOR';
    gradeBg = 'bg-emerald-900 text-emerald-300 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
  } else if (vaultPercent >= 60) {
    grade = 'B';
    gradeTitle = 'JUNIOR CYBER DETECTIVE';
    gradeBg = 'bg-indigo-950 text-indigo-300 border-indigo-500';
  } else if (vaultPercent >= 40) {
    grade = 'C';
    gradeTitle = 'VIGILANT CITIZEN';
    gradeBg = 'bg-amber-950 text-amber-300 border-amber-500';
  }

  const completedCasesCount = Object.values(characterProgress).filter(c => c.completed).length;
  const savedCasesCount = Object.values(characterProgress).filter(c => c.completed && c.saved).length;

  const charCards = [
    { key: 'mother', titleKey: 'caseMotherTitle', icon: '🍳', vectorKey: 'caseMotherVector' },
    { key: 'sibling', titleKey: 'caseSiblingTitle', icon: '🎓', vectorKey: 'caseSiblingVector' },
    { key: 'father', titleKey: 'caseFatherTitle', icon: '☕', vectorKey: 'caseFatherVector' },
    { key: 'protagonist', titleKey: 'caseProtagonistTitle', icon: '💼', vectorKey: 'caseProtagonistVector' },
    { key: 'father_arrest', titleKey: 'caseFatherArrestTitle', icon: '⚖️', vectorKey: 'caseFatherArrestVector' },
    { key: 'sibling_task', titleKey: 'caseSiblingTaskTitle', icon: '📱', vectorKey: 'caseSiblingTaskVector' },
    { key: 'mother_blackout', titleKey: 'caseMotherBlackoutTitle', icon: '⚡', vectorKey: 'caseMotherBlackoutVector' },
    { key: 'protagonist_qr', titleKey: 'caseProtagonistQrTitle', icon: '🛍️', vectorKey: 'caseProtagonistQrVector' }
  ];

  const handleRestart = () => {
    playSound('success', soundMuted);
    onRestartGame();
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-6 bg-[var(--bg-app-root)] halftone-dark text-[var(--text-main)] font-noir relative select-none overflow-y-auto">
      
      {/* FINAL AUDIT HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/90 border-4 border-amber-600 p-3 sm:px-5 rounded-2xl comic-border">
        <div className="flex items-center gap-3">
          <Trophy className="text-amber-400" size={32} />
          <div>
            <h1 className="font-title text-2xl sm:text-3xl text-amber-400 leading-none">{t('auditHeader')}</h1>
            <p className="text-xs text-amber-200/80 font-sans-game font-semibold">{t('auditSubtext')}</p>
          </div>
        </div>

        {/* GRADE BADGE */}
        <div className={`px-4 py-2 rounded-xl border-2 comic-border flex items-center gap-3 ${gradeBg}`}>
          <div className="text-4xl font-black font-title leading-none">{grade}</div>
          <div className="text-right">
            <div className="text-[10px] font-black uppercase tracking-widest">{t('ratingGradeLabel')}</div>
            <div className="text-xs font-black font-sans-game">{gradeTitle}</div>
            <div className="text-[9px] font-mono opacity-80 mt-0.5">{savedCasesCount}/{completedCasesCount} Cases Preserved</div>
          </div>
        </div>
      </div>

      {/* FINANCIAL SUMMARY & REPORT CARDS */}
      <div className="my-4 space-y-4">
        
        {/* VAULT STATS BANNER */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-black/80 p-4 rounded-2xl border-2 border-amber-600/60 comic-border">
          <div className="text-center">
            <div className="text-[10px] text-amber-400 uppercase font-mono">{t('startingVaultLabel')}</div>
            <div className="text-xl font-black text-slate-200 font-mono">₹50,000</div>
          </div>

          <div className="text-center border-y sm:border-y-0 sm:border-x border-amber-900/60 py-2 sm:py-0">
            <div className="text-[10px] text-amber-400 uppercase font-mono">{t('survivingBalanceLabel')}</div>
            <div className={`text-2xl font-black font-mono ${familyVault < 50000 ? 'text-red-400' : 'text-emerald-400'}`}>
              ₹{familyVault.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="text-center">
            <div className="text-[10px] text-amber-400 uppercase font-mono">{t('totalMoneyLostLabel')}</div>
            <div className={`text-xl font-black font-mono ${totalLost > 0 ? 'text-red-500' : 'text-emerald-400'}`}>
              -₹{totalLost.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* 4 INDIVIDUAL REPORT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {charCards.map((item) => {
            const prog = characterProgress[item.key] || { completed: false, saved: false, loss: 0 };

            return (
              <div key={item.key} className="bg-slate-950 p-3.5 rounded-xl border-2 border-black comic-border flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="text-2xl p-2 bg-slate-900 rounded-lg comic-border">{item.icon}</div>
                  <div>
                    <h4 className="font-title text-xl text-amber-300 leading-none">{t(item.titleKey)}</h4>
                    <div className="text-[10px] text-slate-400 font-mono my-0.5">{t(item.vectorKey)}</div>
                    
                    <div className="mt-1.5 flex items-center gap-2">
                      {prog.saved ? (
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-600 rounded text-[10px] font-black">
                          ✅ {t('statusSafe')}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-950 text-red-300 border border-red-600 rounded text-[10px] font-black">
                          ❌ {t('statusScammed')}{prog.loss.toLocaleString('en-IN')})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[9px] font-mono text-slate-500">STATUS</div>
                  <div className={`text-xs font-black ${prog.saved ? 'text-emerald-400' : 'text-red-400'}`}>
                    {prog.saved ? t('statusPreserved') : t('statusDrained')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* FOOTER RESTART CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/90 p-3 rounded-2xl comic-border">
        <div className="text-xs text-amber-300/80 font-sans-game">
          {t('auditQuote')}
        </div>

        <button
          onClick={handleRestart}
          className="w-full sm:w-auto py-3 px-6 bg-amber-500 hover:bg-amber-400 text-black font-black text-sm rounded-xl comic-border flex items-center justify-center gap-2 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 cursor-pointer"
        >
          <RotateCcw size={18} />
          <span>{t('btnRestartGame')}</span>
        </button>
      </div>

    </div>
  );
}

