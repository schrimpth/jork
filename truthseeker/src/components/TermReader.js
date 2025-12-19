import React from 'react';
import { Database } from 'lucide-react';

const TermReader = ({ termData, onBack }) => (
    <div className="fixed inset-0 z-50 bg-black flex flex-col font-mono text-[#00ff00] animate-in zoom-in-95 duration-100">
        <div className="bg-[#003300] text-[#00ff00] p-2 font-bold flex justify-between items-center border-b-4 border-[#00ff00]">
            <span className="flex items-center gap-2"><Database size={16} className="animate-pulse" /> DATABASE ENTRY: {termData.term}</span>
            <button onClick={onBack} className="bg-black text-[#00ff00] px-4 font-bold border border-[#00ff00] hover:bg-red-600 hover:text-black">CLOSE FILE</button>
        </div>

        <div className="flex-1 p-8 overflow-y-auto bg-black m-4 border-2 border-dotted border-[#00ff00] shadow-[inset_0_0_50px_rgba(0,255,0,0.2)] relative">
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,255,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

            <div className="relative z-10 max-w-2xl mx-auto">
                <h1 className="text-5xl font-black text-[#00ff00] mb-2 glitch-text">{termData.term}</h1>
                <div className="h-1 w-full bg-[#00ff00] mb-8"></div>

                <div className="prose font-mono text-[#00ff00] text-lg whitespace-pre-wrap leading-relaxed">
                    {termData.fullDescription || termData.def}
                </div>

                <div className="mt-12 pt-4 border-t border-[#00ff00]/30 text-xs text-green-700 flex justify-between">
                    <span>SOURCE: DEEP_WEB_ARCHIVE_V9</span>
                    <span>VERIFICATION: PENDING</span>
                </div>
            </div>
        </div>
    </div>
);

export default TermReader;
