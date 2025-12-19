import React, { useState } from 'react';

/**
 * Weekly Status Tracker
 * Visualizes the last 7 days, highlighting days where a "compromise" (relapse) occurred.
 * @param {string[]} history - Array of ISO date strings (e.g., ['2023-10-01']) representing compromised days.
 * @param {string} className - Optional container classes.
 */
const WeeklyStatus = ({ history = [], className = '' }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Generate the last 7 days (including today)
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i)); // 6 days ago -> Today
        return d.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    });

    return (
        <div className={`w-full ${className}`}>
            <div className="flex items-center justify-between mb-4 border-b border-green-900 pb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-green-700">7-Day Analysis</span>
                <span className={`text-xs font-mono font-bold ${history.some(h => h.startsWith(new Date().toISOString().split('T')[0])) ? 'text-red-500 animate-pulse' : 'text-[#00ff00]'}`}>
                    STATUS: {history.some(h => h.startsWith(new Date().toISOString().split('T')[0])) ? 'COMPROMISED' : 'SECURE'}
                </span>
            </div>

            <div className="flex justify-between items-end h-24 gap-2">
                {last7Days.map((dateStr, index) => {
                    const isCompromised = history.some(h => h.startsWith(dateStr));
                    const isToday = index === 6;
                    const isHovered = hoveredIndex === index;

                    return (
                        <div
                            key={dateStr}
                            className="flex-1 flex flex-col h-full justify-end relative transition-all duration-300 hover:scale-105"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* Tooltip */}
                            <div className={`
                transition-opacity duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                text-[10px] bg-black border border-green-900 text-[#00ff00] px-2 py-1 rounded 
                pointer-events-none whitespace-nowrap z-20 font-mono shadow-[0_0_10px_rgba(0,255,0,0.2)]
                ${isHovered ? 'opacity-100' : 'opacity-0'}
              `}>
                                {dateStr}: {isCompromised ? 'FAILURE' : 'SECURE'}
                            </div>

                            {/* Bar */}
                            <div
                                className={`
                  w-full rounded-sm transition-all duration-500 relative border
                  ${isCompromised
                                        ? 'bg-red-900/50 border-red-500 h-[30%] shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                                        : 'bg-[#003300] border-[#00ff00] h-full shadow-[0_0_5px_rgba(0,255,0,0.3)]'
                                    }
                  ${isToday ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : 'opacity-80 hover:opacity-100'}
                `}
                            >
                                {/* Pulse effect overlay for compromised days */}
                                {isCompromised && (
                                    <div className="absolute inset-0 bg-red-500 opacity-20 animate-pulse"></div>
                                )}
                                {/* Scanline effect for secure days */}
                                {!isCompromised && (
                                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,0,0.2)_50%)] bg-[length:100%_4px]"></div>
                                )}
                            </div>

                            {/* Footer Label */}
                            <div className={`mt-2 text-[10px] text-center font-mono ${isToday ? 'text-white font-bold' : 'text-green-800'}`}>
                                {isToday ? 'NOW' : dateStr.split('-')[2]}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WeeklyStatus;
