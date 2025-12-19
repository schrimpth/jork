import React from 'react';

const TruthButton = ({ children, onClick, className = "", active = false, disabled = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`
      px-4 py-2 font-mono font-bold text-sm uppercase tracking-widest transition-all relative overflow-hidden group
      border-2 border-[#00ff00] hover:bg-[#003300] hover:text-white active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
      ${active
                ? 'bg-[#00ff00] text-black shadow-[0_0_15px_#00ff00]'
                : 'bg-black text-[#00ff00]'}
      ${className}
    `}
    >
        <span className="relative z-10 group-hover:animate-[glitch_0.3s_infinite]">{children}</span>
        <div className="absolute inset-0 bg-[#00ff00]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-100"></div>
    </button>
);

export default TruthButton;
