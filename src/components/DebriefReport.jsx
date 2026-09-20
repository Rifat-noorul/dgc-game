import React, { useState, useEffect } from 'react';
import { ShieldCheck, Flame, ArrowRight, BookOpen } from 'lucide-react';
import { playSound } from '../audio/soundEngine';
import { getTranslation } from '../localization/translations';

export default function DebriefReport({ 
  debriefInfo, 
  missionResult, 
  onContinue, 
  onReturnToBoard, 
  familyVault = 50000, 
  soundMuted, 
  currentLanguage 
}) {
  const info = debriefInfo || missionResult || {};
  const handleReturn = onReturnToBoard || onContinue || (() => {});
  const t = (key, params) => getTranslation(currentLanguage, key, params);

  const isSuccess = info.success ?? (info.loss === 0);
  const lossAmount = info.loss ?? info.scammedAmount ?? 0;

  // Typewriter text effect for [ MISSION CONCLUDED ]
  const headline = "[ MISSION CONCLUDED ]";
  const [typedHeadline, setTypedHeadline] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= headline.length) {
        setTypedHeadline(headline.slice(0, index));
        if (index % 2 === 0) playSound('typewriter', soundMuted);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [soundMuted]);

  // Real-world educational debrief breakdowns per scam vector
  const scamDebriefs = {
    'Fake E-Commerce & Advance UPI Trap': {
      title: "Fake E-Commerce & Flash Sale Phishing",
      breakdown: "Scammers create lookalike e-commerce domains offering 80% discounts. Entering a UPI PIN ALWAYS debits money from your bank account!",
      prevention: "Inspect website URL protocol and domain extension. Never enter a UPI PIN to receive discounts."
    },
    'Shady Referral APK Download': {
      title: "Malicious APK & Loanware Blackmail",
      breakdown: "Unsigned APK files requested intrusive permissions to read SMS OTPs and contacts to hijack banking OTPs.",
      prevention: "Never install unsigned APK files from messaging apps. Revoke SMS permissions."
    },
    'Public Emergency Call & Forwarding': {
      title: "Emergency Call Forwarding Trap (*401*)",
      breakdown: "Dialing *401* before a phone number activates Unconditional Call Forwarding to scammers.",
      prevention: "Never dial carrier star codes (*401*, *21*) given by strangers."
    },
    'Overdue EMI Smishing & Card Flip Portal': {
      title: "EMI Smishing & Cloned Bank Portal",
      breakdown: "Urgent SMS messages threaten bank account suspension, linking to phishing websites.",
      prevention: "Ignore payment links sent via SMS. Log into official bank mobile apps directly."
    },
    'Digital Arrest Extortion': {
      title: "Digital Arrest Extortion Syndicate",
      breakdown: "Criminal syndicates pose as police/CBI on WhatsApp video calls with forged warrants.",
      prevention: "Indian law enforcement NEVER places video calls demanding money transfers for 'digital arrest'."
    },
    'Fake Placement Task Scam': {
      title: "Telegram Part-Time Task Fraud",
      breakdown: "Recruiters promise ₹2,500/day for simple tasks but require advance registration deposits.",
      prevention: "Legitimate companies NEVER ask job applicants for advance deposits."
    },
    'Midnight Electricity Blackout': {
      title: "Utility Outage Smishing & Remote RAT Tool",
      breakdown: "Scammers send urgent SMS warnings during power cuts demanding Remote Support APK installation.",
      prevention: "Check utility bills on official state power board apps. Never install remote desktop tools."
    },
    'Reverse UPI QR Code Scam': {
      title: "Marketplace Buyer Reverse Debit QR Code",
      breakdown: "Buyers send QR codes claiming to pay, but scanning them prompts a UPI PIN entry to debit your account.",
      prevention: "Receiving money through UPI NEVER requires entering a UPI PIN."
    }
  };

  const debriefData = scamDebriefs[info.scamType] || {
    title: info.caseKey ? `${String(info.caseKey).toUpperCase()} CASE ANALYSIS` : "Cyber Fraud Investigation",
    breakdown: isSuccess 
      ? "Scam vector successfully identified and neutralized. No financial loss incurred."
      : `Scam vector exploited vulnerability resulting in financial loss.`,
    prevention: "Always verify recipient identities, inspect website domain names, and never share OTPs or PINs."
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-zinc-950 text-slate-100 font-noir relative select-none overflow-y-auto z-40">
      
      {/* POST-MISSION DEBRIEF CONTAINER */}
      <div className="my-auto w-full max-w-2xl mx-auto bg-slate-950 border-4 border-black rounded-2xl p-4 sm:p-6 comic-border shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
        
        {/* TYPEWRITER HEADLINE */}
        <div className="text-amber-500 font-mono font-black text-xl sm:text-2xl tracking-wider mb-2 text-center min-h-[36px]">
          {typedHeadline}
        </div>

        {/* CLASSIFIED STAMP */}
        <div className={`absolute -top-5 right-4 font-black text-xs sm:text-sm px-4 py-1.5 rounded comic-border transform -rotate-2 uppercase tracking-widest ${
          isSuccess ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {isSuccess ? '[ SCAM AVERTED ]' : '[ VAULT COMPROMISED ]'}
        </div>

        {/* HEADER */}
        <div className="flex items-center gap-3 border-b-2 border-slate-800 pb-3 mb-4">
          <div className={`text-3xl p-2 rounded-xl comic-border ${isSuccess ? 'bg-emerald-500 text-black' : 'bg-red-600 text-white'}`}>
            {isSuccess ? <ShieldCheck size={28} /> : <Flame size={28} />}
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-amber-400 font-mono">POST-MISSION DETECTIVE DEBRIEF</div>
            <h2 className="font-title text-2xl sm:text-3xl text-amber-300 leading-none">{debriefData.title}</h2>
          </div>
        </div>

        {/* FINANCIAL SUMMARY */}
        <div className="bg-slate-900 border-2 border-slate-800 p-3 rounded-xl flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] text-slate-400 font-mono block uppercase">FINANCIAL IMPACT:</span>
            <span className={`text-lg font-black font-mono ${isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
              {isSuccess ? '₹0 LOSS (VAULT PROTECTED)' : `-₹${lossAmount.toLocaleString('en-IN')} DRAINED`}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-amber-400 font-mono block uppercase">REMAINING VAULT:</span>
            <span className="text-base font-black font-mono text-emerald-400">
              ₹{Number(familyVault).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* TYPEWRITER SCAM MECHANICS */}
        <div className="space-y-3 text-xs font-noir">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
              <BookOpen size={16} />
              <span>REAL-WORLD MECHANICS</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans-game font-semibold">
              {debriefData.breakdown}
            </p>
          </div>

          <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/80 text-emerald-200">
            <div className="font-black text-emerald-400 text-xs mb-0.5 uppercase">PREVENTION RULE:</div>
            <p className="text-[11px] font-mono leading-tight">
              {debriefData.prevention}
            </p>
          </div>
        </div>

        {/* ACTION BUTTON */}
        <div className="mt-5 pt-3 border-t-2 border-slate-800">
          <button
            onClick={() => {
              playSound('click', soundMuted);
              handleReturn();
            }}
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-black font-black text-sm rounded-xl comic-border flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1"
          >
            <span>[ RETURN TO CASE BOARD ]</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>

    </div>
  );
}
