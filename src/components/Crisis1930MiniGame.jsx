import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, Phone, CheckCircle2, Copy, ArrowRight, RefreshCw, Flame, Lock } from 'lucide-react';
import { playSound } from '../audio/soundEngine';
import { getTranslation } from '../localization/translations';

export default function Crisis1930MiniGame({ scamInfo, characterKey, onCrisisResolved, onComplete, onSubmit, soundMuted, currentLanguage }) {
  // Real-time 60-second timer
  const [timeLeft, setTimeLeft] = useState(60);
  const [stage, setStage] = useState(1); // 1: Keypad Dial 1930, 2: Emergency Triage, 3: Dispute Submission

  const t = (key, params) => getTranslation(currentLanguage, key, params);

  // Keypad stage state
  const [dialedDigits, setDialedDigits] = useState('');

  // Triage stage state (toggles)
  const [toggles, setToggles] = useState([false, false, false, false]);

  // Dispute stage state
  const txnId = 'TXN-8942-0192-3841';
  const [copied, setCopied] = useState(false);
  const [inputTxnId, setInputTxnId] = useState('');

  // Triage options tailored per character mission key & scam type
  const triageConfig = {
    mother: {
      options: [
        { label: 'Freeze Joint Debit Card & UPI VPA', correct: true },
        { label: 'File Fraud Transaction Complaint on 1930', correct: true },
        { label: 'Change Home Wi-Fi Password', correct: false },
        { label: 'Report Spam Call on Truecaller', correct: false }
      ]
    },
    sibling: {
      options: [
        { label: 'Block Unknown Telegram Contact & Delete APK', correct: true },
        { label: 'Scan Mobile Device for Remote Admin Malware', correct: true },
        { label: 'Mute Phone Ringer', correct: false },
        { label: 'Clear Browser Search History', correct: false }
      ]
    },
    father: {
      options: [
        { label: 'Dial ##002# to Disable Call Forwarding', correct: true },
        { label: 'Alert Telecom Carrier of Call Hijack', correct: true },
        { label: 'Order Replacement SIM Card', correct: false },
        { label: 'Turn Off Phone Bluetooth', correct: false }
      ]
    },
    protagonist: {
      options: [
        { label: 'Block Compromised Net Banking Portal', correct: true },
        { label: 'Freeze Credit Card & Report Phishing Link', correct: true },
        { label: 'Block SMS Sender ID', correct: false },
        { label: 'Clear Browser Cache & Cookies', correct: false }
      ]
    },
    father_arrest: {
      options: [
        { label: 'Freeze Bank Account & File Cyber Crime Report', correct: true },
        { label: 'Disconnect Fake CBI Video Call Immediately', correct: true },
        { label: 'Pay ₹5,000 Token Fee via UPI', correct: false },
        { label: 'Send Scanned Aadhaar & Passport Copy', correct: false }
      ]
    },
    sibling_task: {
      options: [
        { label: 'File UPI Fraud Chargeback Dispute', correct: true },
        { label: 'Report Telegram HR Scam Channel to Cyber Cell', correct: true },
        { label: 'Deposit Level-2 Security Fee', correct: false },
        { label: 'Share Family Contacts List', correct: false }
      ]
    },
    mother_blackout: {
      options: [
        { label: 'Uninstall Remote Access Screen-Sharing APK', correct: true },
        { label: 'Verify Electricity Bill on Official Portal', correct: true },
        { label: 'Grant Accessibility Rights to APK', correct: false },
        { label: 'Transfer Payment to Utility Agent VPA', correct: false }
      ]
    },
    protagonist_qr: {
      options: [
        { label: 'Immediately Freeze Compromised UPI VPA', correct: true },
        { label: 'Report Reverse Debit Scam on Cyber Crime Portal', correct: true },
        { label: 'Enter UPI PIN to Cancel Payment', correct: false },
        { label: 'Send Debit Screenshot to OLX Buyer', correct: false }
      ]
    },
    'Fake E-Commerce & Advance UPI Trap': {
      options: [
        { label: 'Freeze Joint Debit Card & UPI', correct: true },
        { label: 'File Fraud Transaction Complaint', correct: true },
        { label: 'Change Wi-Fi Password', correct: false },
        { label: 'Report Spam Call', correct: false }
      ]
    },
    'Shady Referral APK Download': {
      options: [
        { label: 'Revoke APK Admin Rights & Delete File', correct: true },
        { label: 'Block Net Banking Portal', correct: true },
        { label: 'Mute Phone Ringer', correct: false },
        { label: 'Restart Device', correct: false }
      ]
    },
    'Public Emergency Call & Forwarding': {
      options: [
        { label: 'Dial ##002# to Disable Call Forwarding', correct: true },
        { label: 'Alert Mobile Network Carrier', correct: true },
        { label: 'Order New SIM Card', correct: false },
        { label: 'Turn Off Bluetooth', correct: false }
      ]
    },
    'Overdue EMI Smishing & Card Flip Portal': {
      options: [
        { label: 'Block Net Banking Portal', correct: true },
        { label: 'Freeze Joint Debit Card & UPI', correct: true },
        { label: 'Block Sender SMS Number', correct: false },
        { label: 'Clear Browser Cache', correct: false }
      ]
    },
    'Digital Arrest Extortion': {
      options: [
        { label: 'Freeze Bank Account & File Cyber Report', correct: true },
        { label: 'Hang Up Call & Block Extorter Number', correct: true },
        { label: 'Pay Initial ₹5,000 Token Fee', correct: false },
        { label: 'Send Scanned Passport Copy', correct: false }
      ]
    },
    'Fake Placement Task Scam': {
      options: [
        { label: 'File UPI Chargeback & Fraud Dispute', correct: true },
        { label: 'Report Telegram Channel to Cyber Cell', correct: true },
        { label: 'Pay Additional Level-2 Deposit', correct: false },
        { label: 'Share Family Contact List', correct: false }
      ]
    },
    'Midnight Electricity Blackout': {
      options: [
        { label: 'Uninstall Shady Remote Access APK', correct: true },
        { label: 'Verify Bill Status on Official Utility Site', correct: true },
        { label: 'Grant Accessibility Services to APK', correct: false },
        { label: 'Transfer Payment via Personal UPI', correct: false }
      ]
    },
    'Reverse UPI QR Code Scam': {
      options: [
        { label: 'Immediately Freeze Compromised UPI VPA', correct: true },
        { label: 'Report Reverse Debit Fraud to Cyber Cell', correct: true },
        { label: 'Enter UPI PIN Again to Cancel', correct: false },
        { label: 'Send Debit Screenshot to Buyer', correct: false }
      ]
    }
  };

  const currentTriage =
    triageConfig[characterKey] ||
    triageConfig[scamInfo?.characterKey] ||
    triageConfig[scamInfo?.scamType] ||
    triageConfig.mother;

  // Countdown Timer & Siren
  useEffect(() => {
    playSound('siren', soundMuted);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalSubmission(true); // Timed out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle Stage 1: Keypad Dialing
  const handleKeypadPress = (num) => {
    if (dialedDigits.length < 4) {
      playSound('pop', soundMuted);
      setDialedDigits((prev) => prev + num);
    }
  };

  const handleKeypadCall = () => {
    if (dialedDigits === '1930') {
      playSound('success', soundMuted);
      setStage(2);
    } else {
      playSound('error', soundMuted);
      setDialedDigits('');
    }
  };

  // Handle Stage 2: Triage Toggles
  const handleToggle = (index) => {
    playSound('click', soundMuted);
    setToggles((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleTriageSubmit = () => {
    const isCorrect = currentTriage.options.every((opt, idx) => toggles[idx] === opt.correct);
    if (isCorrect) {
      playSound('success', soundMuted);
      setStage(3);
    } else {
      playSound('error', soundMuted);
    }
  };

  // Handle Stage 3 & Final Recovery Calculation
  const handleCopyTxn = () => {
    playSound('pop', soundMuted);
    navigator.clipboard?.writeText?.(txnId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinalSubmission = (timedOut = false) => {
    const timeSpent = 60 - timeLeft;
    let recoveryPercent = 0;

    if (!timedOut && timeSpent <= 30) {
      recoveryPercent = 100; // 100% recovered
    } else if (!timedOut && timeSpent <= 50) {
      recoveryPercent = 50; // 50% recovered
    } else {
      recoveryPercent = 0; // 0% recovered
    }

    const scammedAmount = scamInfo?.scammedAmount ?? 5000;
    const recoveredAmount = (scammedAmount * recoveryPercent) / 100;
    const finalLoss = scammedAmount - recoveredAmount;

    playSound(recoveryPercent > 0 ? 'success' : 'scammed', soundMuted);

    const resolveCallback = onCrisisResolved || onComplete || onSubmit;
    if (resolveCallback) {
      resolveCallback({
        recoveredAmount,
        finalLoss,
        recoveryPercent,
        timeSpent
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-6 bg-red-950/90 text-slate-100 font-noir relative select-none red-strobe-glow overflow-y-auto">
      
      {/* 1930 EMERGENCY STROBE HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/90 border-4 border-red-600 p-3 sm:px-5 rounded-2xl comic-border">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-red-500 animate-ping" size={32} />
          <div>
            <h1 className="font-title text-2xl sm:text-3xl text-red-500 tracking-wider">{t('crisisHeader')}</h1>
            <p className="text-xs text-red-200/80 font-sans-game font-semibold">
              {t('crisisSubtext', { amount: (scamInfo?.scammedAmount ?? 5000).toLocaleString('en-IN') })}
            </p>
          </div>
        </div>

        {/* 60s REAL TIME COUNTDOWN TIMER & LIVE DRAIN */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="bg-red-950/90 border-2 border-red-500/80 px-3 py-1.5 rounded-xl text-center">
            <div className="text-[9px] uppercase font-bold text-red-400">Vault Drain</div>
            <div className="font-black text-sm font-mono text-red-300">
              -₹{((60 - timeLeft) * 300).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="flex items-center gap-3 bg-red-950 border-2 border-red-500 px-4 py-2 rounded-xl">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-red-400">{t('timerLabel')}</div>
              <div className="font-black text-2xl font-mono text-red-500 animate-pulse">
                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}s
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STAGE CONTAINER */}
      <div className="my-auto max-w-xl mx-auto w-full bg-slate-950 border-4 border-black rounded-2xl p-4 sm:p-6 comic-border shadow-2xl relative my-4">
        
        {/* STAGE 1: DIAL 1-9-3-0 ON KEYPAD */}
        {stage === 1 && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="bg-red-950/80 border border-red-500 p-2.5 rounded-xl text-xs text-red-200 w-full font-noir">
              {t('step1Title')}
            </div>

            <div className="w-full max-w-xs bg-slate-900 border-2 border-red-500 p-3 rounded-xl">
              <div className="text-[10px] text-slate-400 font-mono">{t('dialedLabel')}</div>
              <div className="text-2xl font-black font-mono text-amber-400 tracking-widest my-1 min-h-[36px]">
                {dialedDigits || '____'}
              </div>

              {/* Keypad */}
              <div className="grid grid-cols-3 gap-2 my-3">
                {['1','2','3','4','5','6','7','8','9','0'].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handleKeypadPress(digit)}
                    className={`py-3 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-lg text-lg font-bold font-mono text-amber-300 cursor-pointer ${
                      digit === '0' ? 'col-start-2' : ''
                    }`}
                  >
                    {digit}
                  </button>
                ))}
              </div>

              <button
                onClick={handleKeypadCall}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-black text-sm rounded-xl comic-border flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone size={18} />
                <span>{t('btnDial1930')}</span>
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: EMERGENCY TRIAGE TOGGLES */}
        {stage === 2 && (
          <div className="flex flex-col gap-4">
            <div className="bg-red-950/80 border border-red-500 p-2.5 rounded-xl text-xs text-red-200 font-noir">
              {t('step2Title')}
            </div>

            <div className="space-y-3">
              {currentTriage.options.map((opt, idx) => (
                <div
                  key={idx}
                  onClick={() => handleToggle(idx)}
                  className={`p-3 rounded-xl border-2 comic-border flex items-center justify-between cursor-pointer transition-all ${
                    toggles[idx] ? 'bg-amber-950 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold font-noir">{opt.label}</span>
                  <div className={`w-10 h-6 rounded-full border-2 border-black flex items-center p-0.5 transition-colors ${
                    toggles[idx] ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
                  }`}>
                    <div className="w-4 h-4 rounded-full bg-white border border-black shadow"></div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleTriageSubmit}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm rounded-xl comic-border mt-2 cursor-pointer"
            >
              {t('btnConfirmTriage')}
            </button>
          </div>
        )}

        {/* STAGE 3: DISPUTE SUBMISSION */}
        {stage === 3 && (
          <div className="flex flex-col gap-4 text-center">
            <div className="bg-emerald-950/80 border border-emerald-500 p-2.5 rounded-xl text-xs text-emerald-200 font-noir">
              {t('step3Title')}
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 text-xs">
              <div className="text-[10px] text-slate-400 font-mono">{t('generatedTxnLabel')}</div>
              <div className="flex items-center justify-center gap-2 my-2">
                <span className="font-mono text-base font-black text-amber-400">{txnId}</span>
                <button
                  onClick={handleCopyTxn}
                  className="px-2.5 py-1 bg-amber-500 text-black font-bold text-xs rounded comic-border flex items-center gap-1 cursor-pointer"
                >
                  <Copy size={14} />
                  <span>{copied ? t('btnCopied') : t('btnCopy')}</span>
                </button>
              </div>
            </div>

            <div className="text-left space-y-1">
              <label className="text-[10px] text-slate-400 font-mono">PASTE / ENTER TRANSACTION ID:</label>
              <input
                type="text"
                value={inputTxnId}
                onChange={(e) => setInputTxnId(e.target.value)}
                placeholder={t('pasteTxnPlaceholder')}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-center font-mono font-bold text-amber-300 text-sm"
              />
            </div>

            <button
              onClick={() => handleFinalSubmission(false)}
              disabled={!inputTxnId}
              className={`w-full py-3.5 rounded-xl font-black text-sm comic-border cursor-pointer ${
                inputTxnId ? 'bg-emerald-500 hover:bg-emerald-400 text-black' : 'bg-slate-800 text-slate-500'
              }`}
            >
              {t('btnSubmitDispute')}
            </button>
          </div>
        )}

      </div>

      {/* FOOTER RECOVERY INFO */}
      <div className="flex items-center justify-between text-xs text-red-300/80 bg-black/80 p-2.5 rounded-xl comic-border">
        <div>{t('recoveryScaleText')}</div>
        <div className="font-mono font-bold">CURRENT ELAPSED: {60 - timeLeft}s</div>
      </div>

    </div>
  );
}

