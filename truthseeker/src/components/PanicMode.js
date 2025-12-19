import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import TruthButton from './TruthButton';

const PanicMode = ({ onClose }) => {
    const [step, setStep] = useState('selection');
    const [breathState, setBreathState] = useState('INHALE');

    useEffect(() => {
        if (step === 'breathing') {
            const breatheLoop = () => {
                setBreathState('INHALE');
                setTimeout(() => {
                    setBreathState('HOLD');
                    setTimeout(() => {
                        setBreathState('EXHALE');
                    }, 4000);
                }, 4000);
            };
            breatheLoop();
            const interval = setInterval(breatheLoop, 12000);
            return () => clearInterval(interval);
        }
    }, [step]);

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4 font-mono overflow-hidden">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#000_3px)] pointer-events-none opacity-50 z-0"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff00]/5 to-transparent h-[100px] w-full animate-[scanline_3s_linear_infinite] pointer-events-none z-10"></div>

            <div className="w-full max-w-2xl border-4 border-[#00ff00] bg-black shadow-[0_0_30px_rgba(0,255,0,0.2)] relative z-40">
                <div className="bg-[#00ff00] text-black font-bold px-4 py-2 flex justify-between items-center text-xl">
                    <span className="flex items-center gap-2 uppercase"><Activity className="animate-pulse" /> BREATHING ASSIST</span>
                    <button onClick={onClose} className="bg-black text-[#00ff00] border-2 border-black px-2 hover:bg-white hover:text-black font-bold">CLOSE</button>
                </div>

                <div className="p-8 text-center relative overflow-hidden">
                    {step === 'selection' && (
                        <div className="space-y-8 relative z-10">
                            <div className="text-8xl text-[#00ff00] mx-auto w-fit filter drop-shadow-[0_0_15px_#00ff00] animate-pulse">🫁</div>
                            <h2 className="text-3xl font-black text-[#00ff00] uppercase border-b-4 border-double border-[#00ff00] pb-4">
                                REGAIN CONTROL
                            </h2>
                            <p className="text-xl text-green-500 font-bold">
                                Focus on your breath. Reset your nervous system. <br /> You are in control.
                            </p>

                            <div className="grid gap-4">
                                <TruthButton onClick={() => setStep('breathing')} className="text-xl py-6 border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00] hover:text-black">
                                    START EXERCISE
                                </TruthButton>
                            </div>
                        </div>
                    )}

                    {step === 'breathing' && (
                        <div className="space-y-12 relative z-10">
                            <h3 className="text-2xl font-black text-[#00ff00] animate-pulse">4-4-4 BREATHING PATTERN</h3>

                            <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
                                <div className="absolute inset-0 border-[4px] border-dashed border-[#00ff00] rounded-full animate-[spin_10s_linear_infinite]"></div>
                                <div className={`absolute inset-4 border-[2px] border-white rounded-full transition-all duration-[4000ms] opacity-50 ${breathState === 'INHALE' ? 'scale-100 opacity-80' :
                                        breathState === 'HOLD' ? 'scale-100 opacity-100 border-4' :
                                            'scale-50 opacity-30'
                                    }`}></div>

                                <div className={`text-4xl font-black text-center transition-all duration-500 ${breathState === 'HOLD' ? 'text-white scale-110' :
                                        'text-[#00ff00] scale-100'
                                    }`}>
                                    {breathState}
                                </div>
                            </div>

                            <TruthButton onClick={() => setStep('selection')} className="border-red-600 text-red-500 w-full hover:bg-red-900 hover:text-white">
                                STOP EXERCISE
                            </TruthButton>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PanicMode;
