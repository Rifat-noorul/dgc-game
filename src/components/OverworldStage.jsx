import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const WalkableOverworld = ({ onBack, currentCase, onOpenPhone }) => {
    // --- STATE ---
    const [player, setPlayer] = useState({ x: 150, y: 300 });
    const [isMoving, setIsMoving] = useState(false);

    // New States for the Comic Panel Integration
    const [activeComic, setActiveComic] = useState(null);
    const [objectiveStep, setObjectiveStep] = useState(1); // 1 = Walk to object, 2 = Phone unlocked

    // Placeholder Target Object (The Mixer/Wallet)
    const targetObject = { x: 150, y: 150, width: 60, height: 60 };

    // --- LIGHTING LOGIC (Blackout Fix) ---
    const isBlackout = currentCase?.id === 'case_07'; // Adjust ID to match your blackout case
    const lightingStyle = isBlackout ? {
        maskImage: `radial-gradient(circle 250px at ${player.x + 24}px ${player.y + 24}px, transparent 20%, rgba(0,0,0,0.95) 100%)`,
        WebkitMaskImage: `radial-gradient(circle 250px at ${player.x + 24}px ${player.y + 24}px, transparent 20%, rgba(0,0,0,0.95) 100%)`
    } : {};

    // --- INTERACTION LOGIC ---
    const handleInteract = () => {
        // Basic distance check (replace with your custom collision math if needed)
        const dist = Math.hypot(player.x - targetObject.x, player.y - targetObject.y);

        if (dist < 80 && objectiveStep === 1) {
            // 1. Player reached the object! Trigger the comic panel.
            setActiveComic({
                image: '/comics/case1_mixer.png',
                text: "The mixer sits dead on the counter. The motor reeks of burnt copper and melted plastic."
            });
        } else if (objectiveStep === 2) {
            // 2. If already investigated, open the phone.
            if (onOpenPhone) onOpenPhone();
        }
    };

    // --- MOVEMENT LOGIC ---
    // (Paste your existing useEffect or custom hook for the virtual joystick/WASD here)

    return (
        <div className="fixed inset-0 w-full h-[100dvh] flex flex-col bg-black overflow-hidden touch-none font-mono">

            {/* --- TOP HUD (Fixed Stacking & Text Wrap) --- */}
            <div className="shrink-0 relative z-40 p-4 flex items-center justify-between bg-zinc-950 border-b border-amber-600/30">
                <button onClick={onBack} className="text-amber-500 font-bold flex items-center gap-2 active:scale-95">
                    <ArrowLeft size={20} /> CASE BOARD
                </button>
                <div className="text-amber-500 text-sm">
                    Step {objectiveStep}: {objectiveStep === 1 ? "Investigate Object" : "Access Phone"}
                </div>
            </div>

            {/* Notification Banner */}
            {isBlackout && (
                <div className="shrink-0 relative z-40 mx-4 mt-2 mb-2 bg-amber-500 text-black font-bold p-2 text-sm md:text-base break-words whitespace-normal border-2 border-black shadow-[4px_4px_0px_rgba(255,255,255,0.2)]">
                    *SPARK! BZZZT!* Total blackout!
                </div>
            )}

            {/* --- GAME CANVAS --- */}
            <div className="flex-1 w-full h-full relative overflow-hidden bg-[#110e0c] border-y-4 border-amber-600/50">

                {/* The Grid Background */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(#3f3f46 1px, transparent 1px), linear-gradient(90deg, #3f3f46 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                {/* Target Object Indicator (The Mixer) */}
                <div
                    className="absolute bg-zinc-800 border-2 border-amber-500 flex items-center justify-center rounded-sm animate-pulse"
                    style={{ left: targetObject.x, top: targetObject.y, width: targetObject.width, height: targetObject.height }}
                />

                {/* The Player SVG */}
                <div
                    className={`absolute z-30 w-12 h-12 transition-transform duration-75 ${isMoving ? 'animate-[wiggle_0.3s_ease-in-out_infinite]' : ''}`}
                    style={{ left: player.x, top: player.y }}
                >
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)]">
                        <ellipse cx="50" cy="55" rx="35" ry="25" fill="rgba(0,0,0,0.4)" />
                        <path d="M 20 40 C 20 15, 80 15, 80 40 L 85 70 C 85 85, 15 85, 15 70 Z" fill="#b45309" stroke="#000000" strokeWidth="6" strokeLinejoin="round" />
                        <path d="M 35 30 L 50 45 L 65 30" fill="none" stroke="#000000" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="50" cy="40" r="22" fill="#fcd34d" stroke="#000000" strokeWidth="6" />
                        <path d="M 28 35 Q 50 10 72 35 Q 50 25 28 35 Z" fill="#1c1917" />
                    </svg>
                </div>

                {/* Dynamic Blackout Lighting Mask */}
                <div className="absolute inset-0 pointer-events-none z-40 bg-black transition-opacity duration-300" style={lightingStyle} />
            </div>

            {/* --- MOBILE CONTROLS (Portrait Anchored) --- */}
            <div className="absolute bottom-8 left-0 w-full px-8 flex justify-between items-end z-50 pointer-events-none md:hidden">
                {/* Left Joystick Area */}
                <div className="w-24 h-24 rounded-full bg-zinc-800/80 border-4 border-amber-500 pointer-events-auto flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-amber-500" />
                </div>

                {/* Right Action Button */}
                <button
                    onClick={handleInteract}
                    className="w-20 h-20 rounded-full bg-amber-500 border-4 border-black text-black text-sm font-bold pointer-events-auto active:scale-90"
                >
                    ACTION
                </button>
            </div>

            {/* --- COMIC PANEL OVERLAY --- */}
            {activeComic && (
                <div className="fixed inset-0 z-[120] bg-black/90 flex flex-col items-center justify-center p-6 backdrop-blur-md">

                    <div className="bg-zinc-200 border-8 border-black p-2 md:p-4 -rotate-2 shadow-[12px_12px_0px_rgba(217,119,6,1)] max-w-lg w-full relative animate-in zoom-in-95 duration-300">
                        <div className="bg-zinc-900 border-4 border-black w-full aspect-video flex items-center justify-center overflow-hidden">
                            <img src={activeComic.image} alt="Comic Panel" className="w-full h-full object-cover" />
                        </div>

                        <div className="absolute -bottom-6 md:-bottom-8 left-4 right-4 bg-amber-400 border-4 border-black p-3 font-bold text-black text-xs md:text-sm shadow-[4px_4px_0px_rgba(0,0,0,1)] text-center leading-snug">
                            {activeComic.text}
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setActiveComic(null);
                            setObjectiveStep(2); // Updates UI to "Step 2: Access Phone"
                        }}
                        className="mt-16 text-amber-500 hover:text-amber-400 font-bold animate-pulse active:scale-95 text-lg"
                    >
                        [ CLICK TO INVESTIGATE ]
                    </button>
                </div>
            )}

        </div>
    );
};

export default WalkableOverworld;