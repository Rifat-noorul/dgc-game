import React, { useState, useEffect } from 'react';
import { playSound } from '../audio/soundEngine';
import { getTranslation } from '../localization/translations';

export default function TitleSplash({ onStart, soundMuted, currentLanguage }) {
  const t = (key, params) => getTranslation(currentLanguage, key, params);

  const fullSubtitle = "30 Days. ₹50,000. One Family. Survive the Web.";
  const [displayedSubtitle, setDisplayedSubtitle] = useState("");
  const [isFlashing, setIsFlashing] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Play intro boom on mount
  useEffect(() => {
    playSound('intro_boom', soundMuted);
  }, []);

  // Typewriter effect for subtitle
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullSubtitle.length) {
        setDisplayedSubtitle(fullSubtitle.slice(0, index + 1));
        playSound('typewriter', soundMuted);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [soundMuted]);

  const handleStartClick = () => {
    playSound('click', soundMuted);
    setIsFlashing(true);

    setTimeout(() => {
      setIsFlashing(false);
      setIsFadingOut(true);

      setTimeout(() => {
        onStart();
      }, 800);
    }, 100);
  };

  return (
    <div className={`w-full h-full relative overflow-hidden bg-black text-amber-400 flex flex-col justify-between p-6 sm:p-10 select-none z-50 font-noir transition-opacity duration-700 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* WHITE FLASH OVERLAY */}
      {isFlashing && (
        <div className="absolute inset-0 bg-white z-50 pointer-events-none"></div>
      )}

      {/* CRT SCANLINE OVERLAY */}
      <div className="absolute inset-0 crt-scanlines pointer-events-none z-40"></div>

      {/* TOP BOOT METADATA */}
      <div className="flex justify-between items-center text-xs font-mono text-amber-600/80 z-20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>SYSTEM READY // KERALA NOIR CYBER DEFENSE</span>
        </div>
        <div>v2.5.0 STABLE</div>
      </div>

      {/* CENTER GLITCH TITLE & TYPEWRITER SUBTITLE */}
      <div className="my-auto text-center space-y-6 z-20">
        <div className="space-y-2">
          <div className="text-xs sm:text-sm font-mono text-red-500 uppercase tracking-widest animate-pulse">
            ⚠️ HIGH-STAKES CYBER SURVIVAL
          </div>
          <h1 className="font-title text-4xl sm:text-7xl font-black text-amber-400 tracking-wider leading-none animate-glitch drop-shadow-[0_0_25px_rgba(245,158,11,0.5)]">
            DON'T GET COOKED!
          </h1>
        </div>

        <div className="h-8 flex items-center justify-center">
          <p className="font-mono text-sm sm:text-lg text-amber-200/90 font-bold border-r-2 border-amber-400 pr-1 animate-pulse leading-none">
            {displayedSubtitle}
          </p>
        </div>

        {/* PROMINENT START BUTTON */}
        <div className="pt-6">
          <button
            onClick={handleStartClick}
            className="py-4 px-8 bg-amber-500 hover:bg-amber-400 text-black font-black font-title text-xl sm:text-2xl rounded-2xl comic-border border-4 border-black shadow-[8px_8px_0px_0px_rgba(245,158,11,0.3)] hover:shadow-[10px_10px_0px_0px_rgba(245,158,11,0.5)] cursor-pointer transition-all active:scale-95 animate-bounce"
          >
            [ INITIATE CONNECTION ]
          </button>
        </div>
      </div>

      {/* BOTTOM LEGAL / DETECTIVE FOOTER */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-amber-700 z-20 border-t border-amber-900/40 pt-3">
        <div>SALARY VAULT CAPITAL: ₹50,000</div>
        <div>STAY ALERT • DO NOT DEBIT • REPORT 1930</div>
      </div>

    </div>
  );
}
