import React, { useState, useEffect } from 'react';
import { Siren } from 'lucide-react';
import TruthButton from './TruthButton';

const PanicMode = ({ onClose }) => {
    const [step, setStep] = useState('selection');
    const [breathState, setBreathState] = useState('BLOCK SIGNAL');

    useEffect(() => {
        if (step === 'breathing') {
            const breatheLoop = () => {
                setBreathState('REJECT FREQUENCY');
                setTimeout(() => {
                    setBreathState('HOLD SHIELD');
                    setTimeout(() => {
                        setBreathState('EXPEL TOXINS');
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

            <div className="w-full max-w-2xl border-4 border-red-600 bg-black shadow-[0_0_30px_rgba(255,0,0,0.6)] relative z-40 animate-[pulse_2s_infinite]">
                <div className="bg-red-600 text-black font-bold px-4 py-2 flex justify-between items-center text-xl">
                    <span className="flex items-center gap-2 uppercase"><Siren className="animate-[spin_2s_linear_infinite]" /> !!! PSYCHIC ATTACK DETECTED !!!</span>
                    <button onClick={onClose} className="bg-black text-red-600 border-2 border-black px-2 hover:bg-white hover:text-black">ABORT</button>
                </div>

                <div className="p-8 text-center relative overflow-hidden">
                    {step === 'selection' && (
                        <div className="space-y-8 relative z-10">
                            <div className="text-8xl text-red-600 mx-auto w-fit filter drop-shadow-[0_0_15px_red] animate-pulse">👁️</div>
                            <h2 className="text-3xl font-black text-red-500 uppercase border-b-4 border-double border-red-600 pb-4 glitch-text">
                                THEY ARE BEAMING SIGNALS INTO YOUR PREFRONTAL CORTEX
                            </h2>
                            <p className="text-xl text-[#00ff00] font-bold">
                                THE "URGE" IS A SYNTHETIC FREQUENCY. <br /> DO NOT COMPLY.
                            </p>

                            <div className="grid gap-4">
                                <TruthButton onClick={() => setStep('breathing')} className="text-xl py-6 border-red-600 text-red-600 hover:bg-red-900 hover:text-white">
                                    INITIATE SCRAMBLER PROTOCOL
                                </TruthButton>
                                <TruthButton onClick={() => setStep('tips')}>
                                    ACCESS CLASSIFIED INTEL
                                </TruthButton>
                            </div>
                        </div>
                    )}

                    {step === 'breathing' && (
                        <div className="space-y-12 relative z-10">
                            <h3 className="text-2xl font-black text-[#00ff00] animate-pulse">RECALIBRATING BIO-RHYTHMS</h3>

                            <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
                                <div className="absolute inset-0 border-[4px] border-dashed border-red-600 rounded-full animate-[spin_10s_linear_infinite]"></div>
                                <div className="absolute inset-4 border-[2px] border-green-600 rounded-full animate-[ping_3s_infinite] opacity-50"></div>

                                <div className={`text-2xl font-black text-center transition-all duration-1000 ${breathState.includes('REJECT') ? 'text-red-500 scale-110 glitch-text' :
                                        breathState.includes('HOLD') ? 'text-white scale-100' :
                                            'text-green-500 scale-90'
                                    }`}>
                                    {breathState}
                                </div>
                            </div>

                            <TruthButton onClick={() => setStep('selection')} className="border-red-600 text-red-500 w-full">
                                DISENGAGE
                            </TruthButton>
                        </div>
                    )}

                    {step === 'tips' && (
                        <div className="space-y-4 text-left relative z-10">
                            <h3 className="text-2xl font-black text-center border-b-2 border-[#00ff00] pb-2 text-[#00ff00]">THE TRUTH THEY HIDE</h3>

                            <div className="bg-black/90 border-2 border-[#00ff00] p-4 h-64 overflow-y-auto font-mono text-sm space-y-4 scrollbar-hide">
                                <p className="text-green-400 font-bold animate-[pulse_4s_infinite]"><strong>FILE #992: THE ENERGY HARVEST</strong><br />Why is it free? Because YOU are the product. They harvest your bio-energy to power the simulation.</p>
                                <p className="text-green-400 font-bold animate-[pulse_5s_infinite]"><strong>FILE #104: THE FLUORIDE STARE</strong><br />Submission leads to the stare. The stare leads to compliance. Compliance leads to the pod.</p>
                                <p className="text-green-400 font-bold animate-[pulse_3s_infinite]"><strong>FILE #77: TOWER RADIATION</strong><br />If you feel the urge, check your proximity to 5G towers. Wrap this device in foil if necessary.</p>
                            </div>

                            <TruthButton onClick={() => setStep('selection')} className="w-full">
                                CLOSE DOSSIER
                            </TruthButton>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PanicMode;
