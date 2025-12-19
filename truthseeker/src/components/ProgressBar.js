import React from 'react';

/**
 * Reusable Progress Bar Component
 * @param {number} value - Current value (required)
 * @param {number} max - Maximum value (default: 100)
 * @param {string} label - Optional text label to display above the bar
 * @param {boolean} showValue - Whether to display the percentage text
 * @param {string} size - Height of the bar: 'sm', 'md', 'lg', 'xl' (default: 'md')
 * @param {string} colorClass - Tailwind background color class for the fill (default: 'bg-[#00ff00]')
 * @param {boolean} striped - Adds a diagonal stripe pattern
 * @param {boolean} animated - Animates the stripes (requires 'striped' to be true)
 * @param {string} className - Additional classes for the container
 */
const ProgressBar = ({
    value = 0,
    max = 100,
    label,
    showValue = false,
    size = 'md',
    colorClass = 'bg-[#00ff00]',
    striped = false,
    animated = false,
    className = ''
}) => {
    // Ensure value stays within bounds
    // Handle NaN case explicitly
    const safeValue = isNaN(value) ? 0 : value;
    const clampedValue = Math.min(Math.max(safeValue, 0), max);
    const rawPercentage = (clampedValue / max) * 100;
    const percentage = isNaN(rawPercentage) ? 0 : Math.round(rawPercentage);

    // Height mappings
    const heightClasses = {
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-4',
        xl: 'h-6'
    };

    return (
        <div className={`w-full ${className}`}>
            {/* Header: Label and Percentage */}
            {(label || showValue) && (
                <div className="flex justify-between mb-1">
                    {label && (
                        <span className="text-sm font-medium text-[#00ff00]">
                            {label}
                        </span>
                    )}
                    {showValue && size !== 'xl' && (
                        <span className="text-sm font-medium text-[#00ff00]">
                            {percentage}%
                        </span>
                    )}
                </div>
            )}

            {/* Track Background - Adapted for Truthseeker Theme (Dark Green/Black) */}
            <div className={`w-full bg-[#001100] border border-green-900 rounded-full ${heightClasses[size] || heightClasses.md} overflow-hidden`}>
                {/* Progress Fill */}
                <div
                    className={`
            h-full rounded-full transition-all duration-500 ease-out 
            flex items-center justify-center text-xs text-black font-bold
            ${colorClass}
            ${animated && striped ? 'animate-[progress-stripe_1s_linear_infinite]' : ''}
          `}
                    style={{
                        width: `${percentage}%`,
                        backgroundImage: striped
                            ? 'linear-gradient(45deg,rgba(0,0,0,.15) 25%,transparent 25%,transparent 50%,rgba(0,0,0,.15) 50%,rgba(0,0,0,.15) 75%,transparent 75%,transparent)'
                            : 'none',
                        backgroundSize: '1rem 1rem'
                    }}
                    role="progressbar"
                    aria-valuenow={clampedValue}
                    aria-valuemin="0"
                    aria-valuemax={max}
                >
                    {/* For XL size, show text inside the bar */}
                    {size === 'xl' && showValue && `${percentage}%`}
                </div>
            </div>

            {/* Inline styles for custom animation to avoid external css dependency */}
            <style>{`
        @keyframes progress-stripe {
          from { background-position: 1rem 0; }
          to { background-position: 0 0; }
        }
      `}</style>
        </div>
    );
};

export default ProgressBar;
