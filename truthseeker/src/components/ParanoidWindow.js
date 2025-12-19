import React from 'react';
import { Skull, Eye } from 'lucide-react';

const ParanoidWindow = ({ title, children, className = "", warningLevel = "low" }) => (
    <div className={`bg-black border-2 border-[#00ff00] shadow-[0_0_10px_rgba(0,255,0,0.2)] mb-6 relative overflow-hidden group ${className}`}>
        <div className={`px-2 py-1 flex items-center justify-between border-b-2 border-[#00ff00] z-10 relative ${warningLevel === 'high' ? 'bg-red-900 animate-pulse' : 'bg-[#003300]'
            }`}>
            <span className={`text-[#00ff00] font-bold font-mono tracking-widest text-sm flex items-center gap-2 uppercase ${warningLevel === 'high' ? 'text-black' : ''}`}>
                {warningLevel === 'high' ? <Skull size={14} /> : <Eye size={14} />}
                {title}
            </span>
            <div className="flex gap-2">
                <span className="text-xs text-[#00ff00] animate-[blink_1s_step-end_infinite]">● REC</span>
            </div>
        </div>
        <div className="p-4 font-mono text-[#00ff00] z-10 relative">
            {children}
        </div>
    </div>
);

export default ParanoidWindow;
