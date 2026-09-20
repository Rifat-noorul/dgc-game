import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ShieldAlert, Sparkles, RotateCcw, Globe } from 'lucide-react';
import TitleSplash from './components/TitleSplash';
import CaseBriefing from './components/CaseBriefing';
import DebriefReport from './components/DebriefReport';
import PrologueComic from './components/PrologueComic';
import NoirCaseBoard from './components/NoirCaseBoard';
import WalkableOverworld from './components/WalkableOverworld';
import PhoneSimulator from './components/PhoneSimulator';
import Crisis1930MiniGame from './components/Crisis1930MiniGame';
import FinalAudit from './components/FinalAudit';
import { playSound } from './audio/soundEngine';
import { getTranslation } from './localization/translations';

export default function App() {
  // Global Game State: TITLE_SPLASH | PROLOGUE_COMIC | CASE_BOARD | CASE_BRIEFING | WALKABLE_OVERWORLD | PHONE_SIM | DEBRIEF_REPORT | CRISIS_1930 | FINAL_AUDIT
  const [familyVault, setFamilyVault] = useState(50000);
  const [gameState, setGameState] = useState('TITLE_SPLASH');
  
  // FX State for high stakes feedback
  const [isShaking, setIsShaking] = useState(false);
  const [isRedFlash, setIsRedFlash] = useState(false);

  // Language State ("en" | "ta" | "hi")
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('dgc_language') || 'en';
  });

  // Sound Mute State
  const [soundMuted, setSoundMuted] = useState(false);

  // Active Character Stage
  const [activeCharacter, setActiveCharacter] = useState(null);

  // Active Scam Info for 1930 Mini-Game
  const [activeScamInfo, setActiveScamInfo] = useState(null);

  // Active Debrief Info for post-mission analysis
  const [activeDebriefInfo, setActiveDebriefInfo] = useState(null);

  // Character Progress Tracker (8 Cases across Week 1 & Week 2)
  const [characterProgress, setCharacterProgress] = useState({
    mother: { completed: false, saved: false, loss: 0 },
    sibling: { completed: false, saved: false, loss: 0 },
    father: { completed: false, saved: false, loss: 0 },
    protagonist: { completed: false, saved: false, loss: 0 },
    father_arrest: { completed: false, saved: false, loss: 0 },
    sibling_task: { completed: false, saved: false, loss: 0 },
    mother_blackout: { completed: false, saved: false, loss: 0 },
    protagonist_qr: { completed: false, saved: false, loss: 0 }
  });

  // Theme State ("noir" | "light" | "amber")
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('dgc_theme') || 'noir';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('dgc_theme', currentTheme);
  }, [currentTheme]);

  const triggerFailureFx = () => {
    setIsShaking(true);
    setIsRedFlash(true);
    playSound('error', soundMuted);
    setTimeout(() => {
      setIsShaking(false);
      setIsRedFlash(false);
    }, 750);
  };

  const cycleTheme = () => {
    playSound('click', soundMuted);
    setCurrentTheme((prev) => {
      if (prev === 'noir') return 'light';
      if (prev === 'light') return 'amber';
      return 'noir';
    });
  };

  const toggleSound = () => {
    setSoundMuted((prev) => !prev);
  };

  const handleLanguageChange = (lang) => {
    playSound('click', soundMuted);
    setCurrentLanguage(lang);
    localStorage.setItem('dgc_language', lang);
  };

  const t = (key, params) => getTranslation(currentLanguage, key, params);

  // Handler when character is chosen from Case Board -> Launch Classified Case Briefing
  const handleSelectCharacter = (charKey) => {
    setActiveCharacter(charKey);
    setGameState('CASE_BRIEFING');
  };

  // Handler when 2D Overworld stage completes
  const handleCompleteOverworld = () => {
    setGameState('PHONE_SIM');
  };

  // Handler when Phone Simulator mission finishes
  const handleMissionResult = (result) => {
    if (result.success) {
      // Safe move executed: No loss, update progress and launch debrief report
      setCharacterProgress((prev) => ({
        ...prev,
        [activeCharacter]: { completed: true, saved: true, loss: 0 }
      }));
      setActiveDebriefInfo({
        success: true,
        caseKey: activeCharacter,
        loss: 0,
        scamType: result.scamType,
        warning: result.warning
      });
      setGameState('DEBRIEF_REPORT');
    } else {
      // Scam succeeded: Screen shake + red flash + launch 1930 Emergency Mini-Game
      triggerFailureFx();
      setActiveScamInfo(result);
      setGameState('CRISIS_1930');
    }
  };

  // Handler when 1930 Crisis is resolved
  const handleCrisisResolved = (crisisResult) => {
    const loss = crisisResult.finalLoss;

    // Deduct loss from family vault
    setFamilyVault((prev) => Math.max(0, prev - loss));

    // Update character progress
    setCharacterProgress((prev) => ({
      ...prev,
      [activeCharacter]: {
        completed: true,
        saved: loss === 0,
        loss: loss
      }
    }));

    setActiveDebriefInfo({
      success: loss === 0,
      caseKey: activeCharacter,
      loss: loss,
      scamType: activeScamInfo?.scamType,
      recoveryPercent: crisisResult.recoveryPercent,
      warning: activeScamInfo?.warning
    });

    setGameState('DEBRIEF_REPORT');
  };

  // Full Game Restart
  const handleRestartGame = () => {
    setFamilyVault(50000);
    setCharacterProgress({
      mother: { completed: false, saved: false, loss: 0 },
      sibling: { completed: false, saved: false, loss: 0 },
      father: { completed: false, saved: false, loss: 0 },
      protagonist: { completed: false, saved: false, loss: 0 },
      father_arrest: { completed: false, saved: false, loss: 0 },
      sibling_task: { completed: false, saved: false, loss: 0 },
      mother_blackout: { completed: false, saved: false, loss: 0 },
      protagonist_qr: { completed: false, saved: false, loss: 0 }
    });
    setActiveCharacter(null);
    setActiveScamInfo(null);
    setActiveDebriefInfo(null);
    setGameState('TITLE_SPLASH');
  };

  return (
    <div className="w-screen min-h-screen bg-[#070503] halftone-bg flex items-center justify-center p-0 sm:p-4 selection:bg-amber-500 selection:text-black font-sans-game overflow-x-hidden relative">
      
      {/* AMBER DESK LAMP AMBIENT GLOW BACKDROP */}
      <div className="absolute inset-0 amber-desk-glow pointer-events-none z-0"></div>

      {/* RED FLASH FAILURE OVERLAY */}
      {isRedFlash && (
        <div className="fixed inset-0 bg-red-600/70 z-50 pointer-events-none animate-flash-red"></div>
      )}

      {/* FULLSCREEN MOBILE / BOXED DESK CONTAINER */}
      <div className={`w-screen h-screen max-w-none max-h-none fixed inset-0 md:relative md:w-[900px] md:h-[680px] md:rounded-3xl md:border-4 md:border-amber-900/50 flex flex-col justify-between p-2 md:p-6 bg-[#0a0705] shadow-2xl overflow-hidden select-none z-10 comic-border-lg ${
        isShaking ? 'animate-violent-shake' : ''
      }`}>
        
        {/* CRT SCANLINES OVERLAY */}
        <div className="absolute inset-0 crt-scanlines pointer-events-none z-40"></div>

        {/* RETRO TOP HUD BAR (Shown during main gameplay) */}
        {gameState !== 'TITLE_SPLASH' && (
          <header className="bg-slate-950 border-b-4 border-black p-2 px-3 sm:px-4 flex items-center justify-between z-30 select-none relative pointer-events-auto shrink-0 gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-black flex items-center justify-center font-black text-lg comic-border">
                🍳
              </div>
              <div>
                <span className="font-title text-base sm:text-xl text-amber-400 tracking-wider block leading-none">{t('gameTitle')}</span>
                <span className="text-[9px] sm:text-[10px] font-mono text-amber-600 block leading-none mt-0.5">{t('subTitle')}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Vintage Language Selector */}
              <div className="flex items-center bg-black border-2 border-amber-600 rounded-lg p-0.5 comic-border">
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`px-2 py-0.5 text-[10px] sm:text-xs font-black rounded transition-all cursor-pointer ${
                    currentLanguage === 'en'
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'text-amber-400 hover:bg-amber-950/80 hover:text-amber-200'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => handleLanguageChange('ta')}
                  className={`px-2 py-0.5 text-[10px] sm:text-xs font-black rounded transition-all cursor-pointer ${
                    currentLanguage === 'ta'
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'text-amber-400 hover:bg-amber-950/80 hover:text-amber-200'
                  }`}
                >
                  தமிழ்
                </button>
                <button
                  onClick={() => handleLanguageChange('hi')}
                  className={`px-2 py-0.5 text-[10px] sm:text-xs font-black rounded transition-all cursor-pointer ${
                    currentLanguage === 'hi'
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'text-amber-400 hover:bg-amber-950/80 hover:text-amber-200'
                  }`}
                >
                  हिंदी
                </button>
              </div>

              {/* Global Vault Indicator */}
              <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 bg-slate-900 border-2 border-amber-600/80 px-2.5 sm:px-3 py-1 rounded-xl">
                <span className="text-[9px] sm:text-[10px] font-bold text-amber-400">{t('vaultLabel')}</span>
                <span className={`font-mono font-black text-xs sm:text-sm ${familyVault < 50000 ? 'text-red-400' : 'text-emerald-400'}`}>
                  ₹{familyVault.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Global Theme Toggle Button */}
              <button
                onClick={cycleTheme}
                className="flex items-center gap-1 bg-black border-2 border-amber-600 rounded-lg px-2 py-1 text-[10px] sm:text-xs font-black text-amber-400 hover:bg-amber-950 transition-all comic-border cursor-pointer"
                title="Cycle Theme (Noir Dark | Newsprint Light | Amber Sepia)"
              >
                {currentTheme === 'noir' && (
                  <>
                    <span>🌙</span>
                    <span className="hidden sm:inline">NOIR</span>
                  </>
                )}
                {currentTheme === 'light' && (
                  <>
                    <span>☀️</span>
                    <span className="hidden sm:inline">LIGHT</span>
                  </>
                )}
                {currentTheme === 'amber' && (
                  <>
                    <span>🕯️</span>
                    <span className="hidden sm:inline">AMBER</span>
                  </>
                )}
              </button>

              {/* Sound Toggle */}
              <button
                onClick={toggleSound}
                className="p-1.5 bg-amber-950 border-2 border-amber-500 rounded-lg hover:bg-amber-800 text-amber-400 transition-colors pointer-events-auto z-50 cursor-pointer"
                title={soundMuted ? t('unmuteTitle') : t('muteTitle')}
              >
                {soundMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
          </header>
        )}

        {/* MAIN GAME STAGE ROUTER */}
        <main className="flex-1 relative overflow-y-auto overflow-x-hidden bg-slate-950 z-20 pointer-events-auto flex flex-col">
          
          {gameState === 'TITLE_SPLASH' && (
            <TitleSplash
              onStart={() => setGameState('PROLOGUE_COMIC')}
              soundMuted={soundMuted}
              currentLanguage={currentLanguage}
            />
          )}

          {gameState === 'PROLOGUE_COMIC' && (
            <PrologueComic
              onComplete={() => setGameState('CASE_BOARD')}
              soundMuted={soundMuted}
              toggleSound={toggleSound}
              currentLanguage={currentLanguage}
              currentTheme={currentTheme}
            />
          )}

          {gameState === 'CASE_BOARD' && (
            <NoirCaseBoard
              familyVault={familyVault}
              characterProgress={characterProgress}
              onSelectCharacter={handleSelectCharacter}
              onGoToAudit={() => setGameState('FINAL_AUDIT')}
              soundMuted={soundMuted}
              currentLanguage={currentLanguage}
              currentTheme={currentTheme}
            />
          )}

          {gameState === 'CASE_BRIEFING' && (
            <CaseBriefing
              caseKey={activeCharacter}
              onStartInvestigation={() => setGameState('WALKABLE_OVERWORLD')}
              onBackToBoard={() => setGameState('CASE_BOARD')}
              soundMuted={soundMuted}
              currentLanguage={currentLanguage}
            />
          )}

          {gameState === 'WALKABLE_OVERWORLD' && (
            <WalkableOverworld
              characterKey={activeCharacter}
              onCompleteOverworld={handleCompleteOverworld}
              onBackToBoard={() => setGameState('CASE_BOARD')}
              soundMuted={soundMuted}
              currentLanguage={currentLanguage}
              currentTheme={currentTheme}
              familyVault={familyVault}
              setFamilyVault={setFamilyVault}
              onDeductVault={(amount) => setFamilyVault((prev) => Math.max(0, prev - amount))}
            />
          )}

          {gameState === 'PHONE_SIM' && (
            <PhoneSimulator
              characterKey={activeCharacter}
              onMissionResult={handleMissionResult}
              onBackToOverworld={() => setGameState('WALKABLE_OVERWORLD')}
              soundMuted={soundMuted}
              currentLanguage={currentLanguage}
              currentTheme={currentTheme}
            />
          )}

          {(gameState === 'DEBRIEF_REPORT' || gameState === 'debrief') && (
            <DebriefReport
              debriefInfo={activeDebriefInfo}
              missionResult={activeDebriefInfo}
              familyVault={familyVault}
              onContinue={() => setGameState('CASE_BOARD')}
              onReturnToBoard={() => setGameState('CASE_BOARD')}
              soundMuted={soundMuted}
              currentLanguage={currentLanguage}
            />
          )}

          {gameState === 'CRISIS_1930' && (
            <Crisis1930MiniGame
              scamInfo={activeScamInfo}
              characterKey={activeCharacter}
              onCrisisResolved={handleCrisisResolved}
              onComplete={handleCrisisResolved}
              onSubmit={handleCrisisResolved}
              soundMuted={soundMuted}
              currentLanguage={currentLanguage}
              currentTheme={currentTheme}
            />
          )}

          {gameState === 'FINAL_AUDIT' && (
            <FinalAudit
              familyVault={familyVault}
              characterProgress={characterProgress}
              onRestartGame={handleRestartGame}
              soundMuted={soundMuted}
              currentLanguage={currentLanguage}
              currentTheme={currentTheme}
            />
          )}

        </main>

      </div>

    </div>
  );
}
